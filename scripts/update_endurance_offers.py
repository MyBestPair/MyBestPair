#!/usr/bin/env python3
"""Met à jour les offres Endurance Store (Running Route et Trail) depuis l'export catalogue Kwanko.

Usage :
    python3 scripts/update_endurance_offers.py chemin/vers/export_endurance_store.csv

Format de l'export (nov. 2026) : une ligne par pointure et par coloris, colonnes « name »
(« Chaussures de running femme Asics Novablast 6 »), « gender » (Homme / Femme / Mixte), « size »,
« price » (prix du jour), « category », « url_product » (lien Kwanko). Endurance Store change les
codes de ses liens d'un export à l'autre : le script retrouve donc les modèles par leur NOM.

Pour chaque modèle des moteurs Route et Trail, le script :
  - retrouve les chaussures adulte dont le nom, sans « Chaussures de running/trail (femme) »,
    correspond EXACTEMENT au modèle (voir ALIASES quand le nom diffère) ;
  - écarte les tailles larges (D, 2E, Large…) et les versions GTX (noms différents) ;
  - remplace les offres Endurance Store par une offre par genre et par pointure (la moins chère) ;
  - écrit les liens sous forme courte « es:CODE » (règle 5 de CLAUDE.md) ;
  - garde telles quelles les offres d'un modèle absent de l'export et l'affiche : Endurance Store a deux
    catalogues chez Kwanko (« Endurance-Store » et « The Running Collective »), le modèle peut être dans l'autre.
"""

import csv
import json
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENGINES = [ROOT / "running" / "route" / "route-app.js", ROOT / "running" / "trail" / "trail-app.js"]
HOST = "zof.endurance-store.fr"
GENDERS = {"Homme": "male", "Femme": "female", "Mixte": "unisex"}
CATEGORIES = ("Running > Chaussures de running > Adulte", "Trail > Chaussures de trail > Adulte")

# Nom MyBestPair -> noms Endurance Store (déjà nettoyés par strip_name).
ALIASES = {
    "Adidas Adios Pro 5": ["adidas adizero adios pro 5"],
    "New Balance Fresh Foam X 880 v15": ["new balance fresh foam x 880v15"],
    "New Balance 1080 v15": ["new balance 1080v15"],
    "ASICS GEL-Trabuco 14": ["asics trabuco 14"],
}


def norm(s):
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def strip_name(name):
    n = norm(name)
    n = re.sub(r"^chaussures? de (running|trail) ", "", n)
    return re.sub(r"^(pour )?(femme|homme|mixte) ", "", n)


def parse_size(raw):
    m = re.fullmatch(r"(\d+)(?:[.,](5)| (\d)/(\d))?", raw.strip())
    if not m:
        return None  # tailles larges (« 44 D », « 44,5 2E », « Large ») écartées
    base = float(m.group(1))
    if m.group(2):
        return base + 0.5
    if m.group(3):
        return round(base + int(m.group(3)) / int(m.group(4)), 2)
    return base


def load_feed(path):
    csv.field_size_limit(10**9)
    by_name = defaultdict(list)
    with open(path, encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if not r["category"].startswith(CATEGORIES):
                continue
            m = re.fullmatch(r"https://" + re.escape(HOST) + r"/\?([A-Za-z0-9]+)", r["url_product"])
            size, gender = parse_size(r["size"]), GENDERS.get(r["gender"])
            if not (m and size and gender):
                continue
            by_name[strip_name(r["name"])].append(
                {"code": m.group(1), "gender": gender, "size": size, "price": round(float(r["price"]), 2)})
    return by_name


def read_json(src, name, opener):
    m = re.search(r"^\s*const " + name + r" = (" + re.escape(opener) + r".*);\s*$", src, re.M)
    return json.loads(m.group(1))


def replace_json(src, name, opener, value):
    pattern = re.compile(r"^(\s*const " + name + r" = )(" + re.escape(opener) + r".*)(;)\s*$", re.M)
    m = pattern.search(src)
    if not m:
        raise SystemExit(f"{name} introuvable")
    return src[:m.start(2)] + json.dumps(value, ensure_ascii=False, separators=(",", ":")) + src[m.end(2):]


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    by_name = load_feed(sys.argv[1])
    for engine in ENGINES:
        src = engine.read_text(encoding="utf-8")
        shoes = read_json(src, "SHOES", "[")
        offers = read_json(src, "MERCHANT_OFFERS", "{")
        total, missing = 0, []
        for shoe in shoes:
            model = shoe["modele"]
            names = ALIASES.get(model, [norm(model)])
            best = {}
            for n in names:
                for r in by_name.get(n, []):
                    key = (r["gender"], r["size"])
                    if key not in best or r["price"] < best[key]["price"]:
                        best[key] = r
            new = [{"merchant": "ENDURANCE-STORE", "key": "endurance-store", "gender": g, "price": r["price"],
                    "link": "es:" + r["code"], "sizes": [s]} for (g, s), r in sorted(best.items())]
            lst = offers.get(model, [])
            old = sum(o["key"] == "endurance-store" for o in lst)
            if new:
                offers[model] = [o for o in lst if o["key"] != "endurance-store"] + new
            else:
                missing.append(model + (f" (gardé : {old} offres)" if old else ""))
            total += len(new)
            print(f"  {model:45} {old:3} → {len(new) or old:3} offres{'' if new else ' (absent de l’export)'}")
        engine.write_text(replace_json(src, "MERCHANT_OFFERS", "{", offers), encoding="utf-8")
        print(f"{engine.relative_to(ROOT)} : {total} offres Endurance Store ; absents de l’export : {', '.join(missing) or 'aucun'}\n")


if __name__ == "__main__":
    main()
