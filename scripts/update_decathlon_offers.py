#!/usr/bin/env python3
"""Met à jour les prix Decathlon (Rakuten Advertising) des 6 sports depuis l'export Product Search.

Usage :
    python3 scripts/update_decathlon_offers.py chemin/vers/decathlon-black-friday.csv

L'export est créé par le script PowerShell de Romain (export-decathlon-black-friday.ps1, API Product Search
de Rakuten, mid 44806) : colonnes keyword, sku, name, price (prix habituel), saleprice (prix promo, 0 sinon), link, image.
Chaque produit est retrouvé par son numéro Decathlon (sku), lu dans le lien du site (…/p/<nom>/<sku>/…) ou dans le
champ « sku » des offres Route / Trail. Prix du jour = saleprice s'il y en a un, sinon price.

  - Basket / Padel / Rugby / Foot : le prix habituel (`price`, utilisé par le classement) NE CHANGE PAS ; le prix du
    jour, s'il est plus bas, va dans `promo` (aussi dans `women` pour la version femme ; `null` si la version femme
    n'est pas en promo) ; `promo` est retiré quand la promo est finie.
  - Route / Trail : `price` des offres DECATHLON = prix du jour (comme les autres marchands). Une offre « Seconde vie »
    (occasion, sku « …-N ») est remplacée par la chaussure neuve (même sku sans « -N ») si elle est dans l'export.
  - Les produits absents de l'export ne sont pas touchés (la recherche Rakuten ne renvoie pas tout le catalogue).
Liens : seuls les liens « Seconde vie » changent ; tous les autres liens restent identiques.
"""

import csv
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
SPORTS = [ROOT / "shoes.js", ROOT / "padel/shoes-padel.js", ROOT / "rugby/shoes-rugby.js", ROOT / "foot/shoes-foot.js"]
ENGINES = [ROOT / "running/route/route-app.js", ROOT / "running/trail/trail-app.js"]


def load_feed(path):
    feed = {}
    with open(path, encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            price, sale = float(r["price"] or 0), float(r["saleprice"] or 0)
            feed.setdefault(r["sku"], {"price": price, "day": sale if 0 < sale < price else price,
                                       "link": r["link"], "image": r["image"], "name": r["name"]})
    return feed


def sku_of(link):
    m = re.search(r"murl=([^&]+)", link or "")
    if not m:
        return None
    m = re.search(r"/p/(?:mp/)?[^/]+/([^/]+)/", unquote(m.group(1)))
    return m.group(1) if m else None


def update_sports(feed):
    for path in SPORTS:
        src = path.read_text(encoding="utf-8")
        m = re.search(r"const SHOES = (\[.*?\n\]);", src, re.S)
        shoes = json.loads(m.group(1))
        promos = found = 0
        for shoe in shoes:
            for obj in (shoe, shoe.get("women") if isinstance(shoe.get("women"), dict) else None):
                if not obj or "linksynergy.com" not in str(obj.get("link", "")):
                    continue
                item = feed.get(sku_of(obj["link"]))
                if not item:
                    continue
                found += 1
                usual = obj.get("price", shoe["price"])
                if item["day"] < usual - 0.005:
                    obj["promo"] = item["day"]
                    promos += 1
                else:
                    obj.pop("promo", None)
            women = shoe.get("women")
            if isinstance(women, dict):
                if shoe.get("promo") and not women.get("promo"):
                    women["promo"] = None  # sinon la version femme hériterait de la promo de la version homme
                elif not shoe.get("promo") and women.get("promo") is None:
                    women.pop("promo", None)
        new = src[:m.start(1)] + json.dumps(shoes, indent=2, ensure_ascii=False) + src[m.end(1):]
        path.write_text(new, encoding="utf-8")
        print(f"{path.relative_to(ROOT)} : {found} liens Decathlon retrouvés, {promos} en promo")


def update_engines(feed):
    for path in ENGINES:
        src = path.read_text(encoding="utf-8")
        m = re.search(r"^(\s*const MERCHANT_OFFERS = )(\{.*\})(;)\s*$", src, re.M)
        offers = json.loads(m.group(2))
        found = replaced = 0
        for model, lst in offers.items():
            for o in lst:
                if o["key"] != "decathlon":
                    continue
                sku = o.get("sku") or sku_of(o["link"])
                if sku and sku.endswith("-N") and sku[:-2] in feed:
                    new = feed[sku[:-2]]
                    o.update(link=new["link"], sku=sku[:-2], image=new["image"] or o.get("image", ""))
                    sku = sku[:-2]
                    replaced += 1
                    print(f"  {model} ({o['gender']}) : occasion remplacée par « {new['name']} »")
                item = feed.get(sku)
                if item:
                    o["price"] = item["day"]
                    found += 1
        dumped = json.dumps(offers, ensure_ascii=False, separators=(",", ":"))
        path.write_text(src[:m.start(2)] + dumped + src[m.end(2):], encoding="utf-8")
        print(f"{path.relative_to(ROOT)} : {found} offres Decathlon mises à jour, {replaced} occasion(s) remplacée(s)")


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    feed = load_feed(sys.argv[1])
    update_sports(feed)
    update_engines(feed)


if __name__ == "__main__":
    main()
