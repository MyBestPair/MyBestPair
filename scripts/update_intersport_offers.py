#!/usr/bin/env python3
"""Offres Intersport (Kwanko, affiliation de Romain du 18 nov. 2026) : lit l'export catalogue Kwanko
d'Intersport (CSV, une ligne par pointure) et écrit le champ « intersport » des modèles reconnus.

    python3 scripts/update_intersport_offers.py chemin/vers/catvXXXX.csv

- Correspondance modèle du site -> nom exact du produit chez Intersport : table MATCHES ci-dessous
  (à compléter sport par sport ; ne mettre que des correspondances certaines, même modèle et même génération).
- Prix = prix du jour le plus bas parmi les coloris en stock (« dès … » sur les fiches) ; lien = une pointure
  de ce coloris. Le prix catalogue du modèle (champ « price », utilisé par le classement) ne change pas.
- Règle 5 de CLAUDE.md : le lien Kwanko n'est jamais écrit en clair, seulement « is:CODE » ; les pages
  reconstruisent l'adresse en mémoire (fiche-offres.js, Top 3).
- Un modèle qui n'est plus trouvé dans l'export perd son champ « intersport ».
"""
import csv
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOST = "https://" + "rf.tropsretni.btc"[::-1] + "/?"  # hôte de suivi Kwanko écrit à l'envers (règle 5)
SOURCES = {"rugby": "rugby/shoes-rugby.js"}

# Nom du modèle sur le site (champ « name ») -> nom du produit dans l'export Intersport (colonne « name of the product »).
MATCHES = {
    "rugby": {
        "Kakari SG": "chaussures de rugby hybrides homme kakari sg",
        "RS15 FG": "chaussures de rugby moulées homme rs15 fg",
        "RS15 SG Hybride": "chaussures de rugby hybrides homme rs15 sg",
        "RS15 Elite SG Hybride": "chaussures de rugby hybrides homme rs15 elite sg",
        "Kakari Elite SG": "chaussures de rugby hybrides homme kakari elite sg",
        "RS15 Avaglide": "chaussures de rugby hybrides femme rs15 avaglide sg",
        # Waitangi II CL du site = « Waitangi Club » 2026 de Mizuno (130 €) ; l'ancienne « waitangi ii cl » d'Intersport est la version 2025.
        "Waitangi II CL": "chaussures de rugby moulées homme waitangi club",
        "Sidestep Icon 8S": "chaussures de rugby hybrides homme side step icon 8s",
        "Speedster 6S": "chaussures de rugby homme speedster 6s",
    },
}


def price_of(text):
    return float(text.replace("EUR", "").strip() or 0)


def read_export(path):
    rows = {}
    with open(path, encoding="utf-8") as fh:
        for r in csv.DictReader(fh):
            if r["product availability"] != "in stock" or not r["product page URL"].startswith(HOST):
                continue
            rows.setdefault(r["name of the product"].strip().lower(), []).append(r)
    return rows


def best_offer(rows):
    cheapest = min(price_of(r["current price"]) for r in rows)
    pick = [r for r in rows if price_of(r["current price"]) == cheapest]
    pick.sort(key=lambda r: r["internal reference"])
    r = pick[len(pick) // 2]  # une pointure du milieu du coloris le moins cher
    return {"link": "is:" + r["product page URL"][len(HOST):], "price": cheapest}


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    export = read_export(sys.argv[1])
    for sport, rel in SOURCES.items():
        path = ROOT / rel
        source = path.read_text()
        m = re.search(r"const SHOES\s*=\s*(\[.*?\n\]);", source, re.S)
        shoes = json.loads(m.group(1))
        found = 0
        for shoe in shoes:
            target = MATCHES[sport].get(shoe["name"])
            offer = best_offer(export[target]) if target and export.get(target) else None
            if offer:
                shoe["intersport"] = offer
                found += 1
            else:
                shoe.pop("intersport", None)
                if target:
                    print(f"  {sport} : {shoe['name']} absent de l'export ({target})")
        path.write_text(source[:m.start(1)] + json.dumps(shoes, indent=2, ensure_ascii=False) + source[m.end(1):])
        print(f"{sport} : {found} modèles avec une offre Intersport")


if __name__ == "__main__":
    main()
