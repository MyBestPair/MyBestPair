#!/usr/bin/env python3
"""Build static catalogue pages from the shoe data embedded in the questionnaires."""
import html
import json
import re
import unicodedata
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

ROOT = Path(__file__).resolve().parents[1]
PHOTOS = json.loads((ROOT / "scripts/model_photos.json").read_text())
SPECS = {
    "route": ("running/route", "Running Route", ["amorti", "dynamisme", "stabilite", "confort", "durabilite", "legerete"]),
    "trail": ("running/trail", "Running Trail", ["accroche", "amorti", "stabilite", "protection", "dynamisme", "confort"]),
    "basket": ("basket", "Basket", ["traction", "amorti", "reactivite", "stabilite", "maintien", "legerete", "confort", "durabilite"]),
}
LABELS = {"reactivite": "Réactivité", "stabilite": "Stabilité", "legerete": "Légèreté", "durabilite": "Durabilité"}


def h(value):
    return html.escape(str(value), quote=True)


def slug(value):
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", normalized).strip("-")


def items(source):
    match = re.search(r"const SHOES = (\[.*?\]);", source, re.S)
    if not match:
        raise ValueError("SHOES missing")
    return json.loads(match.group(1))


def scores(shoe, sport, fields):
    if sport == "basket":
        return dict(zip(fields, shoe["scores"]))
    return {key: shoe[key] for key in fields}


def label(key):
    return LABELS.get(key, key.capitalize())


def score(value):
    return ("%g" % value).replace(".", ",") + "/10"


def display_value(value):
    return str(value).capitalize() if str(value).isupper() else str(value)


def display_name(shoe, sport):
    name = shoe.get("modele", shoe.get("name"))
    if sport == "basket" and not name.casefold().startswith(shoe["brand"].casefold() + " "):
        return shoe["brand"] + " " + name
    return name


def image_for(name, offers):
    """Use an exact-model product photo from the existing merchant offer data."""
    if name in PHOTOS:
        return PHOTOS[name]["image"], PHOTOS[name]["source"]
    for offer in offers.get(name, []):
        image = offer.get("image")
        if image and image.startswith("https://"):
            return image, offer.get("merchant", "catalogue marchand")
    return None


def render(shoe, sport, base, category, fields, photo=None):
    root_link = "../../../" if sport == "basket" else "../../../../"
    name = display_name(shoe, sport)
    notes = scores(shoe, sport, fields)
    ranked = sorted(notes, key=lambda key: (-notes[key], fields.index(key)))
    strengths = ", ".join(label(key).lower() for key in ranked[:3])
    modest = ", ".join(label(key).lower() for key in sorted(notes, key=lambda key: (notes[key], fields.index(key)))[:2])
    url = f"https://mybestpair.fr/{base}/modeles/{slug(name)}/"
    description = f"{name} : notes MyBestPair en {strengths}, caractéristiques de la base {category} et accès au questionnaire pour tester ton profil."
    rows = "\n".join(f'<div class="score" style="--score:{notes[key] * 10:g}%"><span>{h(label(key))}</span><strong>{score(notes[key])}</strong></div>' for key in fields)
    if sport == "basket":
        details = [("Surface enregistrée", shoe["surface"]), ("Type de pied enregistré", shoe["foot"]), ("Prix indicatif de la base", f'{shoe["price"]:g} €')]
        use = f"La base associe ce modèle aux surfaces {h(shoe['surface'].lower())} et à un pied {h(shoe['foot'].lower())}."
        caveat = "En extérieur, la durabilité de la semelle mérite une attention particulière. Le maintien et la pointure se vérifient à l'essayage."
        factors = "ton budget, ton poste, ton style de jeu, la surface, ton type de pied et les priorités que tu classes"
        fragment = "profile-section"
    else:
        details = [("Catégorie dans la base", shoe["type"]), ("Distance enregistrée", shoe["distance"]), ("Poids indicatif dans la base", f'{shoe["poidsChaussure"]:g} g'), ("Drop dans la base", f'{shoe["drop"]:g} mm'), ("Plaque carbone enregistrée", shoe["carbone"]), ("Type de pied enregistré", shoe["typePied"])]
        if sport == "trail":
            details.append(("Terrain enregistré", shoe["terrain"]))
            use = f"Dans la base Trail, {h(name)} est classée {h(shoe['type'].lower())}, pour les distances {h(shoe['distance'].lower())} et les terrains {h(shoe['terrain'].lower())}."
            caveat = "Vérifie que le terrain et la distance de tes sorties correspondent à ces indications. L'accroche réelle dépend aussi des conditions et de l'usure."
            factors = "ton terrain, ta distance, ton budget, ton poids, ton type de pied, ton attaque et tes priorités"
        else:
            details.append(("Allure enregistrée", shoe["allure"]))
            allure = "quelle que soit l'allure" if shoe["allure"] == "TOUTES" else f"aux allures {h(shoe['allure'].lower())}"
            use = f"Dans la base Route, {h(name)} est classée {h(shoe['type'].lower())}, pour les distances {h(shoe['distance'].lower())} et {allure}."
            caveat = "Vérifie que la distance et l'allure de tes sorties correspondent à ces indications. La largeur et le maintien se confirment à l'essayage."
            factors = "ton objectif, ton budget, ton poids, ta distance, ton type de pied, ton attaque et tes priorités"
            fragment = "questionnaire"
        fragment = "questionnaire"
    specs = "\n".join(f"<div><dt>{h(key)}</dt><dd>{h(display_value(value))}</dd></div>" for key, value in details)
    context = f"{display_value(shoe['type'])} · {shoe['distance']}" if sport != "basket" else f"{display_value(shoe['surface'])} · {display_value(shoe['foot'])}"
    key_point = f"{label(ranked[0])} : {score(notes[ranked[0]])}"
    visual = f'<figure class="product-photo"><img src="{h(photo[0])}" alt="{h(name)} — visuel marchand" loading="lazy" decoding="async"><figcaption>Photo produit du catalogue {h(photo[1])} · le coloris peut varier</figcaption></figure>' if photo else ""
    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#124f9c">
  <title>{h(name)} : caractéristiques et profil | MyBestPair</title>
  <meta name="description" content="{h(description)}">
  <link rel="canonical" href="{url}"><link rel="icon" href="{root_link}favicon.png">
  <script src="{root_link}analytics-consent.js"></script>
  <link rel="stylesheet" href="{root_link}modeles.css">
</head>
<body>
  <nav class="topbar" aria-label="Navigation principale"><a class="brand" href="{root_link}">MYBESTPAIR</a><a href="../../#{fragment}">Questionnaire {h(category)}</a></nav>
  <main>
    <nav class="crumbs" aria-label="Fil d'Ariane"><a href="{root_link}">Accueil</a> › <a href="../../">{h(category)}</a> › <a href="../">Modèles</a> › {h(name)}</nav>
    <header class="hero"><div class="eyebrow">MyBestPair / {h(category)}</div><h1>{h(name)}</h1><p>Une première lecture de la paire, avant de vérifier si elle correspond vraiment à ton profil.</p><div class="hero-meta"><span>{h(context)}</span><span>{h(key_point)}</span></div><a class="cta" href="../../#{fragment}">Vérifier avec mon profil →</a></header>
    <div class="layout"><div>
      <section class="card"><h2>L'essentiel sur cette paire</h2><p class="lede">{use}</p><div class="verdict"><div><span>Ses atouts dans notre base</span><strong>{h(strengths.capitalize())}</strong></div><div><span>À regarder de plus près</span><strong>{h(modest.capitalize())}</strong></div></div><p class="note">Ces indications viennent des données MyBestPair. Elles permettent de comparer les modèles, mais ne remplacent pas un essai de la chaussure.</p></section>
      <section class="card"><h2>Ses notes MyBestPair</h2><p class="muted">Évaluations internes sur 10 utilisées par le questionnaire, et non notes issues d'un test terrain indépendant. <a href="{root_link}methodologie.html">Comprendre notre méthodologie</a>.</p><div class="scores" aria-label="Notes internes MyBestPair sur 10">{rows}</div></section>
      <section class="card"><h2>Avant de choisir</h2><p>{caveat}</p><p>Le questionnaire tient aussi compte de {factors}. Le classement change donc selon ton profil.</p><p><a href="../">Voir toutes les chaussures {h(category)} →</a></p></section>
    </div><aside>{visual}
      <section class="card"><h2>Repères techniques</h2><dl class="specs">{specs}</dl><p class="muted" style="margin-top:16px">Données indicatives de notre base. Les caractéristiques exactes peuvent varier selon la version et la pointure : vérifie-les auprès du fabricant.</p></section>
      <section class="card"><h2>Est-ce ta paire ?</h2><p>Renseigne ton profil pour voir si {h(name)} ressort parmi tes recommandations et quels autres modèles lui sont comparés.</p><a class="cta" href="../../#{fragment}" id="questionnaireLink">Tester mon profil gratuitement</a><small>Prix et disponibilité peuvent évoluer : vérifie-les chez le marchand.</small></section>
    </aside></div>
  </main><footer>© 2026 MyBestPair · <a href="{root_link}mentions-legales.html">Mentions légales</a> · <a href="{root_link}conditions-utilisation.html">Conditions d’utilisation</a> · <a href="{root_link}methodologie.html">Méthodologie</a> · <a href="{root_link}confidentialite.html">Confidentialité</a></footer>
  <script>document.getElementById('questionnaireLink').addEventListener('click',function(){{if(typeof gtag==='function')gtag('event','model_page_questionnaire_click',{{sport:'{sport}',model:{json.dumps(name, ensure_ascii=False)}}})}});</script>
</body></html>
'''


def main():
    all_urls = []
    for sport, (base, category, fields) in SPECS.items():
        source = (ROOT / ("shoes.js" if sport == "basket" else f"{base}/index.html")).read_text()
        shoes = items(source)
        offers_match = re.search(r"const MERCHANT_OFFERS = (\{.*?\});", source, re.S)
        offers = json.loads(offers_match.group(1)) if offers_match else {}
        dest = ROOT / base / "modeles"
        dest.mkdir(exist_ok=True)
        names = [display_name(shoe, sport) for shoe in shoes]
        slugs = [slug(name) for name in names]
        if len(slugs) != len(set(slugs)):
            raise ValueError(f"Duplicate slugs in {sport}")
        for shoe, name, path in zip(shoes, names, slugs):
            page = dest / path / "index.html"
            page.parent.mkdir(exist_ok=True)
            # Keep the hand-edited pilot fiche with its manufacturer sources.
            if not (sport == "route" and path == "asics-novablast-6"):
                page.write_text(render(shoe, sport, base, category, fields, image_for(name, offers)))
            all_urls.append(f"https://mybestpair.fr/{base}/modeles/{path}/")
        tiles = []
        for shoe, name, path in zip(shoes, names, slugs):
            brand = shoe.get("brand", name.split()[0])
            model = name[len(brand):].strip() if name.lower().startswith(brand.lower()) else name
            meta = f"{display_value(shoe['type'])} · {shoe['distance']}" if sport != "basket" else f"{display_value(shoe['surface'])} · {display_value(shoe['foot'])}"
            photo = image_for(name, offers)
            visual = f'<span class="tile-photo"><img src="{h(photo[0])}" alt="" loading="lazy" decoding="async"></span>' if photo else ''
            tiles.append(f'<a class="model-tile" href="{h(path)}/">{visual}<span class="tile-brand">{h(brand)}</span><strong>{h(model)}</strong><span class="tile-meta">{h(meta)}</span><span class="tile-link">Voir la fiche →</span></a>')
        links = "\n".join(tiles)
        hub_root = "../../" if sport == "basket" else "../../../"
        index = f'''<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Chaussures {h(category)} : {len(shoes)} fiches modèles | MyBestPair</title><meta name="description" content="Parcours les {len(shoes)} modèles {h(category)} de la base MyBestPair, consulte leurs caractéristiques et teste ton profil."><link rel="canonical" href="https://mybestpair.fr/{base}/modeles/"><link rel="icon" href="{hub_root}favicon.png"><link rel="stylesheet" href="{hub_root}modeles.css"></head><body><nav class="topbar"><a class="brand" href="{hub_root}">MYBESTPAIR</a><a href="../">Questionnaire {h(category)}</a></nav><main><nav class="crumbs"><a href="{hub_root}">Accueil</a> › <a href="../">{h(category)}</a> › Modèles</nav><header class="hero"><div class="eyebrow">Catalogue MyBestPair / {h(category)}</div><h1>Une paire pour chaque profil.</h1><p>Explore les {len(shoes)} modèles de notre base {h(category)}, puis trouve ceux qui correspondent à ta pratique.</p><a class="cta" href="../">Trouver ma paire →</a></header><div class="catalogue-toolbar"><h2>Explorer les modèles</h2><p>{len(shoes)} fiches · caractéristiques et notes MyBestPair</p></div><div class="catalogue-grid">{links}</div><p class="muted" style="margin-top:24px">Les données présentées sont indicatives et les disponibilités peuvent évoluer.</p></main><footer>© 2026 MyBestPair · <a href="{hub_root}mentions-legales.html">Mentions légales</a> · <a href="{hub_root}conditions-utilisation.html">Conditions d’utilisation</a> · <a href="{hub_root}methodologie.html">Méthodologie</a> · <a href="{hub_root}confidentialite.html">Confidentialité</a></footer></body></html>'''
        (dest / "index.html").write_text(index)
        all_urls.append(f"https://mybestpair.fr/{base}/modeles/")
        category_page = ROOT / base / "index.html"
        source = category_page.read_text()
        link = f'<p>Explore aussi <a href="modeles/">les {len(shoes)} fiches modèles {h(category)}</a> pour consulter leurs caractéristiques avant le questionnaire.</p>'
        if 'href="modeles/"' not in source:
            source = source.replace('</main>', f'  {link}\n  </main>', 1)
            category_page.write_text(source)
        print(sport, len(shoes))
    sitemap = ROOT / "sitemap.xml"
    old = sitemap.read_text()
    old = re.sub(r'\s*<url>\s*<loc>https://mybestpair.fr/(?:running/(?:route|trail)/|basket/)modeles/[^<]*</loc>\s*</url>', '', old)
    entries = "\n".join(f"  <url><loc>{xml_escape(url)}</loc></url>" for url in all_urls)
    sitemap.write_text(old.replace('</urlset>', entries + '\n</urlset>'))


if __name__ == '__main__':
    main()
