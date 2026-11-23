#!/usr/bin/env python3
"""Met à jour les offres Ekosport (Running Route et Trail) depuis l'export catalogue Kwanko Ekosport.

Usage :
    python3 scripts/update_ekosport_offers.py chemin/vers/export_ekosport.csv

L'export (CSV, souvent livré en .zip) a une ligne par pointure et par coloris (colonnes
« product page URL », « ID_Parent », « Taille », « Genre », « current price », « product availability »).
Pour chaque modèle des moteurs Route et Trail qui a déjà des offres Ekosport, le script :
  - retrouve, grâce aux liens actuels (ek:CODE), les produits Ekosport du modèle (ID_Parent) ;
  - remplace ses offres Ekosport par une offre par genre et par pointure en stock (la moins chère),
    au prix du jour (« current price ») ;
  - retire les offres Ekosport d'un modèle qu'Ekosport ne vend plus ;
  - écrit les liens sous forme courte « ek:CODE » (règle 5 de CLAUDE.md).
Les modèles sans offre Ekosport ne sont pas touchés (ajout de nouveaux modèles : à faire à la main).
"""

import csv
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENGINES = [ROOT / "running" / "route" / "route-app.js", ROOT / "running" / "trail" / "trail-app.js"]
HOST = "iza.ekosport.fr"
GENDERS = {"Homme": "male", "Femme": "female", "Mixte": "unisex"}


def parse_size(raw):
    m = re.fullmatch(r"(\d+)(?: (\d)/(\d))?", raw.strip())
    if not m:
        return None
    base = float(m.group(1))
    if m.group(2):
        return round(base + int(m.group(2)) / int(m.group(3)), 2)
    return base


def load_feed(path):
    csv.field_size_limit(10**9)
    by_code, by_parent = {}, defaultdict(list)
    with open(path, encoding="utf-8") as f:
        for r in csv.DictReader(f):
            m = re.fullmatch(r"https://" + re.escape(HOST) + r"/\?([A-Za-z0-9]+)", r["product page URL"])
            if not m:
                continue
            row = {
                "code": m.group(1),
                "parent": r["ID_Parent"],
                "gender": GENDERS.get(r["Genre"]),
                "size": parse_size(r["Taille"]),
                "price": round(float(r["current price"]), 2),
                "in_stock": r["product availability"] == "in stock",
                "name": r["name"],
            }
            by_code[row["code"]] = row
            by_parent[row["parent"]].append(row)
    return by_code, by_parent


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
    by_code, by_parent = load_feed(sys.argv[1])
    for engine in ENGINES:
        src = engine.read_text(encoding="utf-8")
        offers = read_json(src, "MERCHANT_OFFERS", "{")
        total, gone = 0, []
        for model, lst in offers.items():
            old = [o for o in lst if o["key"] == "ekosport"]
            if not old:
                continue
            parents = {by_code[o["link"][3:]]["parent"] for o in old if o["link"][3:] in by_code}
            best = {}
            for p in parents:
                for r in by_parent[p]:
                    if not (r["in_stock"] and r["gender"] and r["size"]):
                        continue
                    key = (r["gender"], r["size"])
                    if key not in best or r["price"] < best[key]["price"]:
                        best[key] = r
            new = [{"merchant": "EKOSPORT", "key": "ekosport", "gender": g, "price": r["price"],
                    "link": "ek:" + r["code"], "sizes": [s]} for (g, s), r in sorted(best.items())]
            offers[model] = [o for o in lst if o["key"] != "ekosport"] + new
            total += len(new)
            if not new:
                gone.append(model)
            print(f"  {model:45} {len(old):3} → {len(new):3} offres  ({', '.join(sorted(parents)) or '—'})")
        engine.write_text(replace_json(src, "MERCHANT_OFFERS", "{", offers), encoding="utf-8")
        print(f"{engine.relative_to(ROOT)} : {total} offres Ekosport ; plus vendus chez Ekosport : {', '.join(gone) or 'aucun'}\n")


if __name__ == "__main__":
    main()
