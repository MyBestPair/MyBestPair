#!/usr/bin/env python3
"""Offres Intersport (Kwanko, affiliation de Romain du 18 nov. 2026) : lit l'export catalogue Kwanko
d'Intersport (CSV, une ligne par pointure) et met à jour les offres Intersport des 6 sports.

    python3 scripts/update_intersport_offers.py chemin/vers/catvXXXX.csv

- Correspondance modèle du site -> nom exact du produit chez Intersport : table MATCHES ci-dessous.
  N'y mettre que des correspondances certaines (même modèle, même génération). Un nom peut être suivi
  de « @REF1,REF2 » pour ne garder que les références fabricant qui commencent ainsi (ex. G.T. Cut Academy 2).
- Basket, Padel, Rugby, Foot : champ « intersport » du modèle {link, price}.
  Route, Trail : offres « INTERSPORT » ajoutées à MERCHANT_OFFERS (une par genre, homme / femme d'après le nom
  Intersport), comme i-Run, Ekosport et Endurance Store ; pointures non reprises (formats US / EU mélangés).
- Prix = prix du jour le plus bas parmi les coloris en stock (« dès … ») ; lien = une pointure de ce coloris.
  Le prix catalogue du modèle (utilisé par le classement) ne change pas.
- Règle 5 de CLAUDE.md : le lien Kwanko n'est jamais écrit en clair, seulement « is:CODE » ; les pages
  reconstruisent l'adresse en mémoire (fiche-offres.js, route-app.js, trail-app.js, Top 3).
- Un modèle qui n'est plus trouvé dans l'export perd son offre Intersport.
"""
import csv
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOST = "https://" + "rf.tropsretni.btc"[::-1] + "/?"  # hôte de suivi Kwanko écrit à l'envers (règle 5)
FLAT = {"basket": "shoes.js", "padel": "padel/shoes-padel.js", "rugby": "rugby/shoes-rugby.js", "foot": "foot/shoes-foot.js"}
RUNNING = {"route": "running/route/route-app.js", "trail": "running/trail/trail-app.js"}

R, T = "chaussures de running ", "chaussures de trail "
FT = "chaussures de football "


def hf(prefix, model, women=None):
    """Noms homme + femme d'un modèle running / trail."""
    return [prefix + "homme " + model, prefix + "femme " + (women or model)]


# Nom du modèle sur le site -> nom(s) du produit dans l'export Intersport (colonne « name of the product »).
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
    "foot": {
        # Predator 26 = version « languette rabattue » (FT), comme chez Decathlon ; les autres Predator League d'Intersport sont des Predator 24 / 25.
        "Predator 26 League FG": FT + "moulées homme languette rabattue predator league fg",
        "Predator 26 Elite FG": FT + "moulées homme languette rabattue predator elite fg",
        "Predator 26 League FG Jr": FT + "moulées enfant languette rabattue predator league fg",
        "F50 Hyperfast League FG/MG": FT + "moulées homme f50 hyperfast league fg",
        "F50 Hyperfast League SG": [FT + "vissées homme f50 hyperfast league sg", FT + "moulées homme f50 hyperfast league sg"],
        "F50 Hyperfast Elite FG": FT + "moulées homme f50 hyperfast elite fg",
        "F50 Hyperfast League FG/MG Jr": FT + "moulées enfant f50 hyperfast league fg",
        "Copa Pure IV League FG": FT + "moulées homme copa pure iv league fg",
        "Copa Pure IV Club TF": FT + "stabilisées homme copa pure iv club tf",
        "Copa Mundial FG": FT + "moulées homme copa mundial",
        "Future 9 Pro FG/AG": FT + "moulées homme future 9 pro fg/ag",
        "Future 9 Match FG/AG": FT + "moulées homme future 9 match fg/ag",
        "Future 9 Play TF": FT + "stabilisées homme future 9 play tt",
        "Future 9 Match FG/AG Jr": FT + "moulées enfant future 9 match fg/ag",
        "King Liga FG/AG": FT + "moulées homme king liga fg/ag",
        "Mercurial Vapor 17 Elite FG": FT + "moulées homme mercurial vapor 17 elite",
        "Mercurial Vapor 17 Academy MG": [FT + "moulées homme mercurial vapor 17 academy", FT + "moulées homme vapor 17 academy fg/mg"],
        "Mercurial Vapor 17 Club MG": [FT + "moulées homme mercurial vapor 17 club fg/mg", FT + "moulées homme vapor 17 club fg/mg"],
        "Mercurial Vapor 17 Academy MG Jr": FT + "moulées enfant mercurial vapor 17 academy",
        "Mercurial Superfly 11 Academy MG": [FT + "moulées homme mercurial superfly 11 academy", FT + "moulées homme superfly 11 academy fg/mg"],
        "Phantom 6 Elite FG": FT + "moulées homme phantom 6 low elite",
        "Phantom 6 Academy MG": [FT + "moulées homme phantom 6 low academy", FT + "moulées homme phantom 6 low academy fg/mg"],
        "Tiempo Maestro Academy MG": [FT + "moulées homme tiempo maestro academy", FT + "moulées homme tiempo maestro academy fg/mg"],
    },
    "basket": {
        "G.T. Cut Academy 2": "chaussures de basketball homme g.t. cut academy@HV9774",  # FB2599 = 1re génération
        "Giannis Immortality 5": "chaussures de basketball homme giannis immortality 5",
        "LeBron Witness 9": "chaussures de basketball homme lebron witness 9",
        "Luka 5": "chaussures de basketball homme luka 5 venom",  # coloris « Venom » de la Luka 5
        "Anthony Edwards 2": "chaussures de basketball homme anthony edwards 2",
        "Dame X": "chaussures de basketball homme dame x",
        "D.O.N. Issue 8": "chaussures de basketball homme don issue 8",
        "All-Pro Nitro 2": "chaussures de basketball homme all-pro nitro 2",
    },
    "padel": {
        "Gel-Dedicate 9": "chaussures de padel homme gel-dedicate 9",
        "Gel-Challenger 15 Padel": "chaussures de padel homme gel-challenger 15",
        "Sonicsmash FF": "chaussures de padel homme sonicsmash ff",
        "Jet Viva": "chaussures de padel homme jet viva",
        "Movea 2": "chaussures de padel homme movea 2",
        "Premura 3 Juan Lebron": "chaussures de padel homme premura 3 lebron",
        "Neuron 26V": "chaussures de padel homme neuron 26v",
        "Sprint Pro 4.0": "chaussures de padel homme sprint pro 4.0 padel",
    },
    "route": {
        "ASICS Novablast 6": hf(R, "novablast 6"),
        "ASICS Magic Speed 5": [R + "homme magic speed 5"],
        "Nike Pegasus 42": hf(R, "pegasus 42"),
        "Nike Vomero Plus": hf(R, "vomero plus"),
        "Adidas Adizero EVO SL": hf(R, "adizero evo sl"),
        "HOKA Clifton 11": hf(R, "clifton 11"),
        "HOKA Mach 7": hf(R, "mach 7"),
        "HOKA Bondi 9": hf(R, "bondi 9"),
        "Saucony Ride 19": hf(R, "ride 19"),
        "Saucony Endorphin Speed 5": [R + "homme endorphin speed 5"],
        "Brooks Adrenaline GTS 25": hf(R, "adrenaline gts 25"),
        "PUMA Deviate Nitro 4": hf(R, "deviate nitro 4"),
        "Mizuno Wave Rider 30": hf(R, "rider 30", "wave rider 30"),
        "Nike Vomero 18": hf(R, "vomero 18"),
        "Nike Structure 26": hf(R, "structure 26"),
        "Nike Zoom Fly 6": hf(R, "zoom fly 6"),
        "Nike Vaporfly 4": [R + "homme vaporfly 4"],
        "ASICS Gel-Nimbus 28": hf(R, "gel-nimbus 28"),
        "ASICS Gel-Kayano 33": [R + "homme gel-kayano 33"],
        "ASICS GT-2000 15": hf(R, "gt-2000 15"),
        "Adidas Adizero Boston 13": hf(R, "adizero boston 13") + hf(R, "boston 13"),
        "Adidas Supernova Rise 3": [R + "homme supernova rise 3"],
        "Adidas Adistar 5": hf(R, "adistar 5"),
        "Brooks Ghost 18": hf(R, "ghost 18"),
        "Brooks Glycerin 23": hf(R, "glycerin 23"),
        "Brooks Ghost Max 4": hf(R, "ghost max 4"),
        "Saucony Triumph 24": [R + "homme triumph 24"],
        "PUMA Velocity Nitro 5": hf(R, "velocity nitro 5"),
        "PUMA MagMax Nitro 2": [R + "homme magmax nitro 2"],
        "PUMA ForeverRun Nitro 2": hf(R, "foreverrun nitro 2", "foreverrun nitro 2 wn"),
        "Mizuno Wave Sky 9": [R + "homme wave sky 9"],
        "Mizuno Wave Inspire 22": hf(R, "wave inspire 22"),
        "Mizuno Neo Zen 2": hf(R, "neo zen 2"),
        "On Cloudsurfer 2": hf(R, "cloudsurfer 2"),
        "On Cloudmonster 3": hf(R, "cloudmonster 3"),
        "HOKA Arahi 9": hf(R, "arahi 9"),
        "Saucony Hurricane 26": [R + "homme hurricane 26"],
        "ASICS GT-1000 15": hf(R, "gt-1000 15"),
        "Nike Structure Plus": hf(R, "structure plus"),
        "ASICS Gel-Cumulus 28": hf(R, "gel-cumulus 28"),
        "HOKA Rincon 5": hf(R, "rincon 5"),
    },
    "trail": {
        "HOKA Speedgoat 7": hf(T, "speedgoat 7"),
        "HOKA Mafate 5": hf(T, "mafate 5"),
        "SALOMON Speedcross 6": hf(T, "speedcross 6") + [T + "femme speedcross 6 w", R + "homme speedcross 6"],
        "ASICS Trabuco Max 5": hf(T, "trabuco max 5"),
        "ASICS Fuji Lite 7": [T + "homme fuji lite 7"],
        "HOKA Challenger 8": hf(T, "challenger 8"),
        "HOKA Zinal 3": hf(T, "zinal 3"),
        "SALOMON Genesis 2": hf(T, "genesis 2"),
        "SALOMON Ultra Glide 4": hf(T, "ultra glide 4") + [R + "homme ultra glide 4"],
        "SAUCONY Peregrine 16": hf(T, "peregrine 16"),
        "SAUCONY Xodus Ultra 4": [T + "homme xodus ultra 4"],
        "BROOKS Cascadia 20": hf(T, "cascadia 20"),
        "BROOKS Caldera 8": [T + "femme caldera 8"],
        "ASICS GEL-Trabuco 14": hf(T, "trabuco 14"),
        "NIKE ACG Pegasus Trail": hf(T, "acg pegasus trail", "acg pegasus"),
        "NIKE ACG Zegama Trail": hf(T, "acg zegama"),
        "SALOMON XA Pro 3D v9": hf(T, "xa pro 3d v9"),
        "HOKA Torrent 5": hf(T, "torrent 5"),
        "NIKE Kiger 10": [T + "homme terra kiger 10"],
        "HOKA Mafate X": [T + "homme mafate x"],
        "SAUCONY Guide TR": hf(T, "guide tr"),
    },
}


def norm(text):
    return " ".join(text.lower().split())


def price_of(text):
    return float(text.replace("EUR", "").strip() or 0)


def read_export(path):
    rows = {}
    with open(path, encoding="utf-8") as fh:
        for r in csv.DictReader(fh):
            if r["product availability"] != "in stock" or not r["product page URL"].startswith(HOST):
                continue
            rows.setdefault(norm(r["name of the product"]), []).append(r)
    return rows


def rows_for(export, target):
    name, _, refs = target.partition("@")
    rows = export.get(norm(name), [])
    if refs:
        rows = [r for r in rows if r["manufacturer reference"].startswith(tuple(refs.split(",")))]
    return rows


def best_offer(rows):
    cheapest = min(price_of(r["current price"]) for r in rows)
    pick = sorted((r for r in rows if price_of(r["current price"]) == cheapest), key=lambda r: r["internal reference"])
    r = pick[len(pick) // 2]  # une pointure du milieu du coloris le moins cher
    return {"link": "is:" + r["product page URL"][len(HOST):], "price": cheapest}


def targets(value):
    return value if isinstance(value, list) else [value]


def update_flat(export, sport, rel):
    path = ROOT / rel
    source = path.read_text()
    m = re.search(r"const SHOES\s*=\s*(\[.*?\n\]);", source, re.S)
    shoes = json.loads(m.group(1))
    found = 0
    for shoe in shoes:
        wanted = MATCHES[sport].get(shoe["name"])
        rows = [r for t in targets(wanted) for r in rows_for(export, t)] if wanted else []
        if rows:
            shoe["intersport"] = best_offer(rows)
            found += 1
        else:
            shoe.pop("intersport", None)
            if wanted:
                print(f"  {sport} : {shoe['name']} absent de l'export")
    path.write_text(source[:m.start(1)] + json.dumps(shoes, indent=2, ensure_ascii=False) + source[m.end(1):])
    print(f"{sport} : {found} modèles avec une offre Intersport")
    return set(MATCHES[sport]) - {s["name"] for s in shoes}


def update_running(export, sport, rel):
    path = ROOT / rel
    source = path.read_text()
    m = re.search(r"const MERCHANT_OFFERS = (\{.*?\});", source, re.S)
    offers = json.loads(m.group(1))
    found = 0
    for model in offers:
        offers[model] = [o for o in offers[model] if o.get("key") != "intersport"]
    for model, wanted in MATCHES[sport].items():
        added = False
        for gender in ("male", "female"):
            word = " homme " if gender == "male" else " femme "
            rows = [r for t in targets(wanted) if word in t for r in rows_for(export, t)]
            if rows:
                offer = best_offer(rows)
                offers.setdefault(model, []).append({"merchant": "INTERSPORT", "key": "intersport", "gender": gender,
                                                     "price": offer["price"], "link": offer["link"], "sizes": []})
                added = True
        found += added
        if not added:
            print(f"  {sport} : {model} absent de l'export")
    path.write_text(source[:m.start(1)] + json.dumps(offers, ensure_ascii=False, separators=(",", ":")) + source[m.end(1):])
    print(f"{sport} : {found} modèles avec une offre Intersport")
    return set()


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    export = read_export(sys.argv[1])
    unknown = set()
    for sport, rel in FLAT.items():
        unknown |= update_flat(export, sport, rel)
    for sport, rel in RUNNING.items():
        unknown |= update_running(export, sport, rel)
    if unknown:
        sys.exit(f"Modèles de MATCHES absents des données du site : {sorted(unknown)}")


if __name__ == "__main__":
    main()
