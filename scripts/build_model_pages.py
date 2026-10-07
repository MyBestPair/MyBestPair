#!/usr/bin/env python3
"""Build static catalogue pages from the shoe data of the questionnaires (shoes.js, route-app.js, trail-app.js)."""
import html
import json
import re
import unicodedata
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

ROOT = Path(__file__).resolve().parents[1]
PHOTOS = json.loads((ROOT / "scripts/model_photos.json").read_text())
ENRICHED = json.loads((ROOT / "scripts/fiches_enrichies.json").read_text())
SPECS = {
    "route": ("running/route", "Running Route", ["amorti", "dynamisme", "stabilite", "confort", "durabilite", "legerete"]),
    "trail": ("running/trail", "Running Trail", ["accroche", "amorti", "stabilite", "protection", "dynamisme", "confort"]),
    "basket": ("basket", "Basket", ["traction", "amorti", "reactivite", "stabilite", "maintien", "legerete", "confort", "durabilite"]),
    "padel": ("padel", "Padel", ["adherence", "amorti", "stabilite", "maintien", "legerete", "confort", "durabilite", "reactivite"]),
    "rugby": ("rugby", "Rugby", ["accroche", "stabilite", "maintien", "protection", "legerete", "dynamisme", "confort", "durabilite"]),
}
SOURCES = {"basket": "shoes.js", "padel": "padel/shoes-padel.js", "rugby": "rugby/shoes-rugby.js"}
# Basket and Padel share the same data layout: scores list, one folder deep.
FLAT = ("basket", "padel", "rugby")
SOLES = {"CHEVRONS": "Chevrons", "OMNI": "Omni", "MIXTE": "Mixte"}
GENDERS = {"HOMME": "Homme", "FEMME": "Femme", "MIXTE": "Homme et femme"}
STUDS = {"FER": "fer (vissés)", "MOULES": "moulés", "HYBRIDE": "hybrides"}
PUBLICS = {"ADULTE": "Adulte (homme et femme)", "FEMME": "Femme", "ENFANT": "Enfant"}
AFFILIATE_NOTE = "Certains liens vers les marchands sont des liens d’affiliation (Kwanko, Awin, Rakuten) : un achat peut rapporter une commission à MyBestPair, sans surcoût pour toi. Le classement n’en dépend pas."


def affiliate_note(root):
    return f'<p class="note affiliate-note">{h(AFFILIATE_NOTE)} <a href="{root}methodologie.html#liens-commerciaux">En savoir plus</a></p>'


LABELS = {"adherence": "Adhérence", "reactivite": "Réactivité", "stabilite": "Stabilité", "legerete": "Légèreté", "durabilite": "Durabilité"}


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
    if sport in FLAT:
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
    if sport in FLAT and not name.casefold().startswith(shoe["brand"].casefold() + " "):
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


OG_IMAGE = "https://mybestpair.fr/images/og-mybestpair.jpg"
FONTS_URL = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800&display=swap"


def head_extras(title, description, url):
    """Social sharing tags and non-blocking web fonts, shared by every generated page."""
    return (
        f'<meta property="og:type" content="website"><meta property="og:site_name" content="MyBestPair"><meta property="og:locale" content="fr_FR">'
        f'<meta property="og:title" content="{h(title)}"><meta property="og:description" content="{h(description)}"><meta property="og:url" content="{url}">'
        f'<meta property="og:image" content="{OG_IMAGE}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'
        f'<meta name="twitter:card" content="summary_large_image">'
        f'<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        f'<link rel="preload" as="style" href="{FONTS_URL}" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="{FONTS_URL}"></noscript>'
    )


def json_ld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/") + "</script>"


def breadcrumb(items_list):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": name, "item": url} for i, (name, url) in enumerate(items_list)]}


def enriched_html(name):
    data = ENRICHED.get(name)
    if not data:
        return ""
    points = "".join(f"<li>{h(item)}</li>" for item in data["nouveautes"])
    sources = " · ".join(f'<a href="{h(url)}" target="_blank" rel="noopener">{h(label)}</a>' for label, url in data["sources"])
    return (f'\n      <section class="card"><h2>Ce qu\'il faut savoir sur la {h(name)}</h2>'
            f'<h3>Pour quel coureur ?</h3><p>{h(data["pour_qui"])}</p>'
            f'<h3>Ce qui change sur cette version</h3><ul>{points}</ul>'
            f'<h3>Face à ses rivales</h3><p>{h(data["rivales"])}</p>'
            f'<p class="muted">Caractéristiques issues des annonces fabricant et des tests publiés. Sources : {sources}.</p></section>')


def price_of(shoe):
    return float(shoe.get("prix", shoe.get("price", 0)) or 0)


def alternatives(shoe, shoes, sport, fields, count=4):
    """Closest models in the same base: similar scores, same category, similar price."""
    notes = scores(shoe, sport, fields)
    group = shoe.get("surface") if sport == "basket" else shoe.get("sole") if sport == "padel" else shoe.get("studs") if sport == "rugby" else shoe.get("type")
    ranked = []
    for other in shoes:
        if other is shoe:
            continue
        other_notes = scores(other, sport, fields)
        distance = sum((notes[key] - other_notes[key]) ** 2 for key in fields) ** 0.5
        distance += abs(price_of(shoe) - price_of(other)) / 40
        other_group = other.get("surface") if sport == "basket" else other.get("sole") if sport == "padel" else other.get("studs") if sport == "rugby" else other.get("type")
        if other_group != group:
            distance += 1.5
        ranked.append((distance, display_name(other, sport), other))
    ranked.sort(key=lambda item: (item[0], item[1]))
    return [(name, other) for _, name, other in ranked[:count]]


def sole_text(shoe):
    return SOLES.get(shoe.get("sole"), "À confirmer")


def meta_of(shoe, sport):
    """Short line under a model name in catalogue tiles and related models."""
    if sport == "basket":
        return f"{display_value(shoe['surface'])} · {display_value(shoe['foot'])}"
    if sport == "padel":
        return f"Semelle {sole_text(shoe).lower()} · " + f"{price_of(shoe):g}".replace(".", ",") + " €"
    if sport == "rugby":
        return f"Crampons {STUDS.get(shoe['studs'], 'à confirmer')} · " + ("≈ " if shoe.get("priceIndicative") else "") + f"{price_of(shoe):g}".replace(".", ",") + " €"
    return f"{display_value(shoe['type'])} · {shoe['distance']}"


def alternatives_html(shoe, shoes, sport, fields):
    links = []
    for name, other in alternatives(shoe, shoes, sport, fields):
        meta = f"{display_value(other['surface'])} · " + f"{price_of(other):g}".replace(".", ",") + " €" if sport == "basket" else meta_of(other, sport)
        links.append(f'<li><a href="../{slug(name)}/">{h(name)}</a> <span class="muted">· {h(meta)}</span></li>')
    return f'<section class="card"><h2>Modèles proches à comparer</h2><p class="muted">Paires dont les notes, la catégorie et le prix se rapprochent le plus dans notre base.</p><ul>{"".join(links)}</ul></section>'


def render(shoe, sport, base, category, fields, photo=None, related=""):
    root_link = "../../../" if sport in FLAT else "../../../../"
    name = display_name(shoe, sport)
    notes = scores(shoe, sport, fields)
    ranked = sorted(notes, key=lambda key: (-notes[key], fields.index(key)))
    strengths = ", ".join(label(key).lower() for key in ranked[:3])
    modest = ", ".join(label(key).lower() for key in sorted(notes, key=lambda key: (notes[key], fields.index(key)))[:2])
    url = f"https://mybestpair.fr/{base}/modeles/{slug(name)}/"
    title = f"{name} : notes et profil | MyBestPair"
    if len(title) > 60:
        title = f"{name} : notes et profil"
    description = f"{name} : notes MyBestPair en {strengths}. Caractéristiques clés et test gratuit pour savoir si c'est ta paire."
    if len(description) > 155:
        description = f"{name} : notes MyBestPair en {strengths}. Teste gratuitement si c'est ta paire."
    rows = "\n".join(f'<div class="score" style="--score:{notes[key] * 10:g}%"><span>{h(label(key))}</span><strong>{score(notes[key])}</strong></div>' for key in fields)
    if sport == "basket":
        details = [("Surface enregistrée", shoe["surface"]), ("Type de pied enregistré", shoe["foot"]), ("Prix indicatif de la base", f'{shoe["price"]:g} €')]
        use = f"La base associe ce modèle aux surfaces {h(shoe['surface'].lower())} et à un pied {h(shoe['foot'].lower())}."
        caveat = "En extérieur, la durabilité de la semelle mérite une attention particulière. Le maintien et la pointure se vérifient à l'essayage."
        factors = "ton budget, ton poste, ton style de jeu, la surface, ton type de pied et les priorités que tu classes"
        fragment = "profile-section"
    elif sport == "padel":
        details = [("Semelle enregistrée", sole_text(shoe)), ("Chaussant enregistré", shoe["foot"]), ("Modèle", GENDERS.get(shoe["gender"], shoe["gender"])), ("Prix indicatif de la base", f'{shoe["price"]:g} €'.replace(".", ","))]
        use = {"CHEVRONS": "La base associe ce modèle à une semelle à chevrons, la plus adaptée au gazon synthétique sablé.",
               "OMNI": "La base associe ce modèle à une semelle omni, plus adaptée aux terrains peu sablés.",
               "MIXTE": "La base associe ce modèle à une semelle mixte, polyvalente entre terrains sablés et terrains couverts."}.get(shoe["sole"], "Le type de semelle de ce modèle reste à confirmer selon la version vendue.")
        use += f" Son chaussant est enregistré comme {h(shoe['foot'].lower())}."
        caveat = "Sur gazon très sablé, l'usure de la semelle mérite une attention particulière si tu joues souvent. Le maintien et la pointure se vérifient à l'essayage."
        factors = "ton niveau, ta fréquence de jeu, ton terrain, ton style de jeu, ton type de pied, ton budget et les priorités que tu classes"
        fragment = "profile-section"
    elif sport == "rugby":
        price_label = "Prix public indicatif" if shoe.get("priceIndicative") else "Prix indicatif de la base"
        details = [("Crampons enregistrés", STUDS.get(shoe["studs"], "à confirmer")), ("Chaussant enregistré", shoe["foot"]), ("Public", PUBLICS.get(shoe["public"], shoe["public"])), (price_label, f'{shoe["price"]:g} €'.replace(".", ","))]
        use = {"FER": "La base associe ce modèle à des crampons fer (vissés), les plus accrocheurs sur terrain gras.",
               "MOULES": "La base associe ce modèle à des crampons moulés, adaptés aux terrains secs et aux synthétiques.",
               "HYBRIDE": "La base associe ce modèle à des crampons hybrides (moulés et vissés), polyvalents selon la saison."}.get(shoe["studs"], "Le type de crampons de ce modèle reste à confirmer.")
        use += f" Son chaussant est enregistré comme {h(shoe['foot'].lower())}."
        caveat = "Vérifie le règlement de ton club : les crampons fer sont souvent interdits sur synthétique. Le maintien et la pointure se confirment à l'essayage."
        factors = "ton poste, ton style de jeu, ton gabarit, ton terrain, tes crampons, ton niveau, ton type de pied, ton budget et les priorités que tu classes"
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
    context = f"Semelle {sole_text(shoe).lower()} · {display_value(shoe['foot'])}" if sport == "padel" else f"Crampons {STUDS.get(shoe['studs'], 'à confirmer')} · {display_value(shoe['foot'])}" if sport == "rugby" else meta_of(shoe, sport)
    key_point = f"{label(ranked[0])} : {score(notes[ranked[0]])}"
    visual = f'<figure class="product-photo"><img src="{h(photo[0])}" alt="{h(name)} — visuel marchand" loading="lazy" decoding="async"><figcaption>Photo produit du catalogue {h(photo[1])} · le coloris peut varier</figcaption></figure>' if photo else ""
    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#124f9c">
  <title>{h(title)}</title>
  <meta name="description" content="{h(description)}">
  <link rel="canonical" href="{url}"><link rel="icon" href="{root_link}favicon.png">
  {head_extras(title, description, url)}
  {json_ld(breadcrumb([("Accueil", "https://mybestpair.fr/"), (category, f"https://mybestpair.fr/{base}/"), ("Modèles", f"https://mybestpair.fr/{base}/modeles/"), (name, url)]))}
  <script src="{root_link}analytics-consent.js"></script>
  <link rel="stylesheet" href="{root_link}modeles.css">
</head>
<body>
  <nav class="topbar" aria-label="Navigation principale"><a class="brand" href="{root_link}">MYBESTPAIR</a><a href="../../#{fragment}">Questionnaire {h(category)}</a></nav>
  <main>
    <nav class="crumbs" aria-label="Fil d'Ariane"><a href="{root_link}">Accueil</a> › <a href="../../">{h(category)}</a> › <a href="../">Modèles</a> › {h(name)}</nav>
    <header class="hero"><div class="eyebrow">MyBestPair / {h(category)}</div><h1>{h(name)}</h1><p>Une première lecture de la paire, avant de vérifier si elle correspond vraiment à ton profil.</p><div class="hero-meta"><span>{h(context)}</span><span>{h(key_point)}</span></div><a class="cta" href="../../#{fragment}">Vérifier avec mon profil →</a></header>
    {affiliate_note(root_link)}
    <div class="layout"><div>
      <section class="card"><h2>L'essentiel sur cette paire</h2><p class="lede">{use}</p><div class="verdict"><div><span>Ses atouts dans notre base</span><strong>{h(strengths.capitalize())}</strong></div><div><span>À regarder de plus près</span><strong>{h(modest.capitalize())}</strong></div></div><p class="note">Ces indications viennent des données MyBestPair. Elles permettent de comparer les modèles, mais ne remplacent pas un essai de la chaussure.</p></section>{enriched_html(name)}
      <section class="card"><h2>Ses notes MyBestPair</h2><p class="muted">Évaluations internes sur 10 utilisées par le questionnaire, et non notes issues d'un test terrain indépendant. <a href="{root_link}methodologie.html">Comprendre notre méthodologie</a>.</p><div class="scores" aria-label="Notes internes MyBestPair sur 10">{rows}</div></section>
      <section class="card"><h2>Avant de choisir</h2><p>{caveat}</p><p>Le questionnaire tient aussi compte de {factors}. Le classement change donc selon ton profil.</p><p><a href="../">Voir toutes les chaussures {h(category)} →</a></p></section>
      {related}
    </div><aside>{visual}
      <section class="card"><h2>Repères techniques</h2><dl class="specs">{specs}</dl><p class="muted" style="margin-top:16px">Données indicatives de notre base. Les caractéristiques exactes peuvent varier selon la version et la pointure : vérifie-les auprès du fabricant.</p></section>
      <section class="card"><h2>Est-ce ta paire ?</h2><p>Renseigne ton profil pour voir si {h(name)} ressort parmi tes recommandations et quels autres modèles lui sont comparés.</p><a class="cta" href="../../#{fragment}" id="questionnaireLink">Tester mon profil gratuitement</a><small>Prix et disponibilité peuvent évoluer : vérifie-les chez le marchand.</small></section>
    </aside></div>
  </main><footer>© 2026 MyBestPair · <a href="{root_link}conditions-utilisation.html">Conditions d’utilisation</a> · <a href="{root_link}methodologie.html">Méthodologie</a> · <a href="{root_link}confidentialite.html">Confidentialité</a></footer>
  <script>document.getElementById('questionnaireLink').addEventListener('click',function(){{if(typeof gtag==='function')gtag('event','model_page_questionnaire_click',{{sport:'{sport}',model:{json.dumps(name, ensure_ascii=False)}}})}});</script>
</body></html>
'''


def main():
    all_urls = []
    for sport, (base, category, fields) in SPECS.items():
        source = (ROOT / SOURCES.get(sport, f"{base}/{sport}-app.js")).read_text()
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
            if sport == "route" and path == "asics-novablast-6":
                pilot = page.read_text()
                if 'property="og:title"' not in pilot:
                    title = re.search(r"<title>(.*?)</title>", pilot).group(1)
                    desc = html.unescape(re.search(r'<meta name="description" content="(.*?)">', pilot).group(1))
                    pilot = pilot.replace('<link rel="icon"', head_extras(html.unescape(title), desc, f"https://mybestpair.fr/{base}/modeles/{path}/") + '\n  <link rel="icon"', 1)
                if '"BreadcrumbList"' not in pilot:
                    crumbs = json_ld(breadcrumb([("Accueil", "https://mybestpair.fr/"), (category, f"https://mybestpair.fr/{base}/"), ("Modèles", f"https://mybestpair.fr/{base}/modeles/"), (name, f"https://mybestpair.fr/{base}/modeles/{path}/")]))
                    pilot = pilot.replace('<link rel="icon"', crumbs + '\n  <link rel="icon"', 1)
                if "affiliate-note" not in pilot:
                    pilot = pilot.replace("</header>", "</header>\n    " + affiliate_note("../../../../"), 1)
                block = alternatives_html(shoe, shoes, sport, fields)
                pilot = re.sub(r'\n        <section class="card"><h2>Modèles proches à comparer</h2>.*?</section>', "", pilot, flags=re.S)
                marker = '\n      </div>\n      <aside>'
                page.write_text(pilot.replace(marker, "\n        " + block + marker, 1))
            if not (sport == "route" and path == "asics-novablast-6"):
                page.write_text(render(shoe, sport, base, category, fields, image_for(name, offers), alternatives_html(shoe, shoes, sport, fields)))
            all_urls.append(f"https://mybestpair.fr/{base}/modeles/{path}/")
        tiles = []
        for shoe, name, path in zip(shoes, names, slugs):
            brand = shoe.get("brand", name.split()[0])
            model = name[len(brand):].strip() if name.lower().startswith(brand.lower()) else name
            meta = meta_of(shoe, sport)
            photo = image_for(name, offers)
            visual = f'<span class="tile-photo"><img src="{h(photo[0])}" alt="{h(name)}" loading="lazy" decoding="async"></span>' if photo else ''
            tiles.append(f'<a class="model-tile" href="{h(path)}/">{visual}<span class="tile-brand">{h(brand)}</span><strong>{h(model)}</strong><span class="tile-meta">{h(meta)}</span><span class="tile-link">Voir la fiche →</span></a>')
        links = "\n".join(tiles)
        hub_root = "../../" if sport in FLAT else "../../../"
        catalogue_ld = json_ld(breadcrumb([("Accueil", "https://mybestpair.fr/"), (category, f"https://mybestpair.fr/{base}/"), ("Modèles", f"https://mybestpair.fr/{base}/modeles/")])) + json_ld({
            "@context": "https://schema.org", "@type": "ItemList", "name": f"Chaussures {category} : fiches modèles MyBestPair",
            "numberOfItems": len(names),
            "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "url": f"https://mybestpair.fr/{base}/modeles/{sl}/"} for i, (n, sl) in enumerate(zip(names, slugs))]})
        index = f'''<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Chaussures {h(category)} : {len(shoes)} fiches modèles | MyBestPair</title><meta name="description" content="Parcours les {len(shoes)} modèles {h(category)} de la base MyBestPair, consulte leurs caractéristiques et teste ton profil."><link rel="canonical" href="https://mybestpair.fr/{base}/modeles/"><link rel="icon" href="{hub_root}favicon.png">{head_extras(f"Chaussures {category} : {len(shoes)} fiches modèles | MyBestPair", f"Parcours les {len(shoes)} modèles {category} de la base MyBestPair, consulte leurs caractéristiques et teste ton profil.", f"https://mybestpair.fr/{base}/modeles/")}{catalogue_ld}<script src="{hub_root}analytics-consent.js"></script><link rel="stylesheet" href="{hub_root}modeles.css"></head><body><nav class="topbar"><a class="brand" href="{hub_root}">MYBESTPAIR</a><a href="../">Questionnaire {h(category)}</a></nav><main><nav class="crumbs"><a href="{hub_root}">Accueil</a> › <a href="../">{h(category)}</a> › Modèles</nav><header class="hero"><div class="eyebrow">Catalogue MyBestPair / {h(category)}</div><h1>Une paire pour chaque profil.</h1><p>Explore les {len(shoes)} modèles de notre base {h(category)}, puis trouve ceux qui correspondent à ta pratique.</p><a class="cta" href="../">Trouver ma paire →</a></header>{affiliate_note(hub_root)}<div class="catalogue-toolbar"><h2>Explorer les modèles</h2><p>{len(shoes)} fiches · caractéristiques et notes MyBestPair</p></div><div class="catalogue-grid">{links}</div><p class="muted" style="margin-top:24px">Les données présentées sont indicatives et les disponibilités peuvent évoluer.</p></main><footer>© 2026 MyBestPair · <a href="{hub_root}conditions-utilisation.html">Conditions d’utilisation</a> · <a href="{hub_root}methodologie.html">Méthodologie</a> · <a href="{hub_root}confidentialite.html">Confidentialité</a></footer></body></html>'''
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
    old = re.sub(r'\s*<url>\s*<loc>https://mybestpair.fr/(?:running/(?:route|trail)/|basket/|padel/|rugby/)modeles/[^<]*</loc>\s*</url>', '', old)
    entries = "\n".join(f"  <url><loc>{xml_escape(url)}</loc></url>" for url in all_urls)
    sitemap.write_text(old.replace('</urlset>', entries + '\n</urlset>'))


if __name__ == '__main__':
    main()
