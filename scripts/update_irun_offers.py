#!/usr/bin/env python3
"""Met à jour les liens i-Run (Running Route et Trail) depuis le catalogue Kwanko i-Run.

Usage :
    python3 scripts/update_irun_offers.py chemin/vers/catalogue_i-run.csv

Le catalogue est le CSV exporté depuis Kwanko (colonnes title, gender, size, sale_price, link…).
Pour chaque modèle des moteurs Route et Trail, le script :
  - retrouve les articles du catalogue dont le nom correspond EXACTEMENT au modèle
    (voir ALIASES quand le nom i-Run diffère du nom MyBestPair) ;
  - remplace les anciennes offres i-Run par une offre par genre et par pointure (la moins chère) ;
  - met à jour le lien i-Run de secours (lienIRun) ;
  - affiche les modèles introuvables chez i-Run.
"""

import csv
import json
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENGINES = [
    ROOT / "running" / "route" / "route-app.js",
    ROOT / "running" / "trail" / "trail-app.js",
]

# Nom MyBestPair -> noms exacts du catalogue i-Run (liste vide = modèle non vendu par i-Run).
ALIASES = {
    # Route
    "Nike Alphafly 3": [
        "Nike Air Zoom Alphafly Next% 3",
        "Nike Air Zoom Alphafly Next% 3 CPH",
        "Nike Air Zoom Alphafly Next% 3 Eliud Kipchoge",
        "Nike Air Zoom Alphafly Next% 3 Glam",
        "Nike Air Zoom Alphafly Next% 3 Katana",
        "Nike Air Zoom Alphafly Next% 3 PRM",
        "Nike Air Zoom Alphafly Next% 3 Women's Race Series",
    ],
    "Adidas Adios Pro 4": [
        "adidas adizero Adios Pro 4",
        "adidas adizero Adios Pro 4 Berlin Marathon",
        "adidas adizero Adios Pro 4 Ekiden",
    ],
    "HOKA Clifton 11": ["Hoka One One Clifton 11"],
    "HOKA Mach 7": ["Hoka One One Mach 7"],
    "HOKA Bondi 9": ["Hoka One One Bondi 9"],
    "Nike Vaporfly 4": ["Nike Vaporfly Next% 4"],
    "On Cloudsurfer 2": ["On-Running Cloudsurfer 2"],
    "On Cloudmonster 2": ["On-Running Cloudmonster 2"],
    "KIPRUN KD900X LD+": [],
    "New Balance FuelCell SC Elite v5": [],
    # Trail
    "HOKA Speedgoat 7": ["Hoka One One Speedgoat 7"],
    "HOKA Mafate 5": ["Hoka One One Mafate 5"],
    "HOKA Tecton X 3": ["Hoka One One Tecton X 3", "Hoka One One Tecton X 3 Neon Pack"],
    "HOKA Challenger 8": ["Hoka One One Challenger 8"],
    "HOKA Zinal 3": ["Hoka One One Zinal 3"],
    "NIKE Zegama 2": ["Nike Zegama Trail 2", "Nike Zegama Trail 2 W"],
    "NIKE ACG Zegama Trail": ["Nike ACG Zegama"],
    "NNORMAL Kjerag 2.0": ["NNormal Kjerag 02"],
    "ASICS GEL-Trabuco 14": ["Asics Trabuco 14"],
    "ASICS Fuji Speed 4": ["Asics Fujispeed 4"],
    "ON Cloudultra 3": ["On-Running Cloudultra 3"],
    "SALOMON S/LAB Genesis": [],  # i-Run ne vend que la Genesis 2 / Genesis Spine
    "LA SPORTIVA Jackal II": [],  # i-Run ne vend que les versions Boa et Gore-Tex
    "NNORMAL Tomir 2.0": [],
    "NEW BALANCE Fresh Foam X More Trail v3": [],
    "TOPO Ultraventure 4": [],
}

# Variantes acceptées automatiquement en plus du nom exact (genre, coloris).
AUTO_SUFFIXES = ["", " w", " m", " neon pack"]


def norm(s):
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def parse_size(raw):
    """'42' -> 42.0, '40.5' -> 40.5, '40.2/3' -> 40.67, '41.1/3' -> 41.33."""
    m = re.fullmatch(r"(\d+)(?:[.,](\d)/3|[.,]5)?", raw.strip())
    if not m:
        return None
    base = float(m.group(1))
    if m.group(2):
        return round(base + int(m.group(2)) / 3, 2)
    if raw.strip().endswith("5") and ("." in raw or "," in raw):
        return base + 0.5
    return base


def load_feed(path):
    rows = []
    with open(path, encoding="utf-8") as f:
        for r in csv.DictReader(f):
            ptype = r.get("product_type", "")
            if not ptype.endswith(("Running", "Trail")) or r.get("age_group") != "adult":
                continue
            if r.get("availability") not in ("in_stock", ""):
                continue
            size = parse_size(r.get("size", ""))
            if size is None:
                continue
            price = r.get("sale_price") or r.get("price")
            rows.append({
                "title": r["title"],
                "gender": r["gender"] if r["gender"] in ("male", "female") else "unisex",
                "size": size,
                "price": float(price),
                "link": r["link"],
            })
    return rows


def titles_for(model, titles_by_norm):
    if model in ALIASES:
        return set(ALIASES[model])
    n = norm(model)
    found = set()
    for suffix in AUTO_SUFFIXES:
        found |= titles_by_norm.get(n + suffix, set())
    return found


def offers_for(rows):
    best = {}
    for r in rows:
        key = (r["gender"], r["size"])
        if key not in best or r["price"] < best[key]["price"]:
            best[key] = r
    return [
        {"merchant": "I-RUN", "key": "i-run", "gender": g, "price": r["price"],
         "link": r["link"], "sizes": [s]}
        for (g, s), r in sorted(best.items())
    ]


def fallback_link(rows):
    """Lien de secours : de préférence un modèle homme proche du 42."""
    if not rows:
        return ""
    return min(rows, key=lambda r: (r["gender"] != "male", abs(r["size"] - 42), r["price"]))["link"]


def replace_json(src, name, opener, value):
    pattern = re.compile(r"^(\s*const " + name + r" = )(" + re.escape(opener) + r".*)(;)\s*$", re.M)
    m = pattern.search(src)
    if not m:
        raise SystemExit(f"{name} introuvable")
    dumped = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    return src[:m.start(2)] + dumped + src[m.end(2):]


def read_json(src, name, opener):
    m = re.search(r"^\s*const " + name + r" = (" + re.escape(opener) + r".*);\s*$", src, re.M)
    return json.loads(m.group(1))


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    feed = load_feed(sys.argv[1])
    titles_by_norm = defaultdict(set)
    for r in feed:
        titles_by_norm[norm(r["title"])].add(r["title"])
    rows_by_title = defaultdict(list)
    for r in feed:
        rows_by_title[r["title"]].append(r)

    for engine in ENGINES:
        src = engine.read_text(encoding="utf-8")
        shoes = read_json(src, "SHOES", "[")
        offers = read_json(src, "MERCHANT_OFFERS", "{")
        missing = []
        total = 0
        for shoe in shoes:
            model = shoe["modele"]
            titles = titles_for(model, titles_by_norm)
            rows = [r for t in titles for r in rows_by_title.get(t, [])]
            new = offers_for(rows)
            others = [o for o in offers.get(model, []) if o["key"] != "i-run"]
            offers[model] = others + new
            shoe["lienIRun"] = fallback_link(rows)
            total += len(new)
            if not new:
                missing.append(model)
            print(f"  {model:45} {len(new):3} offres  ← {', '.join(sorted(titles)) or '—'}")
        src = replace_json(src, "SHOES", "[", shoes)
        src = replace_json(src, "MERCHANT_OFFERS", "{", offers)
        engine.write_text(src, encoding="utf-8")
        print(f"{engine.relative_to(ROOT)} : {total} offres i-Run, {len(missing)} modèle(s) absent(s) chez i-Run : {', '.join(missing) or 'aucun'}\n")


if __name__ == "__main__":
    main()
