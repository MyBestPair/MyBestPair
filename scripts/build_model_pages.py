#!/usr/bin/env python3
"""Build static catalogue pages from the shoe data embedded in the questionnaires."""
import html
import json
import re
import unicodedata
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

ROOT = Path(__file__).resolve().parents[1]
CSS = re.search(r"<style>(.*?)</style>", (ROOT / "running/route/modeles/asics-novablast-6/index.html").read_text(), re.S).group(1)
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


def display_name(shoe, sport):
    name = shoe.get("modele", shoe.get("name"))
    if sport == "basket" and not name.casefold().startswith(shoe["brand"].casefold() + " "):
        return shoe["brand"] + " " + name
    return name


def render(shoe, sport, base, category, fields):
    name = display_name(shoe, sport)
    notes = scores(shoe, sport, fields)
    ranked = sorted(notes, key=lambda key: (-notes[key], fields.index(key)))
    strengths = ", ".join(label(key).lower() for key in ranked[:3])
    modest = ", ".join(label(key).lower() for key in sorted(notes, key=lambda key: (notes[key], fields.index(key)))[:2])
    url = f"https://mybestpair.fr/{base}/modeles/{slug(name)}/"
    description = f"{name} : notes MyBestPair en {strengths}, caractéristiques de la base {category} et accès au questionnaire pour tester ton profil."
    rows = "\n".join(f'<div class="score"><span>{h(label(key))}</span><strong>{score(notes[key])}</strong></div>' for key in fields)
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
    specs = "\n".join(f"<div><dt>{h(key)}</dt><dd>{h(value)}</dd></div>" for key, value in details)
    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#124f9c">
  <title>{h(name)} : caractéristiques et profil | MyBestPair</title>
  <meta name="description" content="{h(description)}">
  <link rel="canonical" href="{url}"><link rel="icon" href="../../../../favicon.png">
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-8CZ831W067"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','G-8CZ831W067');</script>
  <style>{CSS}</style>
</head>
<body>
  <nav class="topbar" aria-label="Navigation principale"><a class="brand" href="../../../../">MYBESTPAIR</a><a href="../../#{fragment}">Questionnaire {h(category)}</a></nav>
  <main>
    <nav class="crumbs" aria-label="Fil d'Ariane"><a href="../../../../">Accueil</a> › <a href="../../">{h(category)}</a> › <a href="../">Modèles</a> › {h(name)}</nav>
    <header class="hero"><div class="eyebrow">Fiche modèle · {h(category)}</div><h1>{h(name)} : pour quel profil ?</h1><p>Caractéristiques enregistrées dans la base MyBestPair et notes utilisées pour comparer les modèles selon ton profil.</p></header>
    <div class="layout"><div>
      <section class="card"><h2>En bref</h2><p>{use} Ses notes les plus élevées dans MyBestPair concernent {h(strengths)}. Ses notes les plus basses dans cette base concernent {h(modest)}. Ces écarts aident à situer la paire selon tes priorités, sans prédire ton ressenti personnel.</p>
      <p class="note"><strong>Pas de score universel :</strong> le classement est recalculé pour chaque profil. Les notes ci-dessous sont des évaluations internes à MyBestPair, pas des résultats d'un essai indépendant.</p>
      <div class="scores" aria-label="Notes internes MyBestPair sur 10">{rows}</div></section>
      <section class="card"><h2>À quel usage la base l'associe-t-elle ?</h2><p>{use}</p><h3>À considérer avant de choisir</h3><p>{caveat}</p></section>
      <section class="card"><h2>Comment MyBestPair la compare</h2><p>Le questionnaire prend en compte {factors}. Une même chaussure peut donc ressortir ou non dans le Top 3 selon les réponses. Les liens marchands n'influencent pas le classement.</p><p><a href="../">Comparer les autres modèles {h(category)}</a>.</p></section>
    </div><aside>
      <section class="card"><h2>Caractéristiques dans la base</h2><dl class="specs">{specs}</dl><p class="muted" style="margin-top:16px">Données indicatives enregistrées dans la base MyBestPair. Vérifie les caractéristiques exactes de la référence et de la pointure auprès du fabricant ou du vendeur.</p></section>
      <section class="card"><h2>Est-ce ta paire ?</h2><p>Renseigne ton profil pour voir si {h(name)} ressort parmi tes recommandations et quels autres modèles lui sont comparés.</p><a class="cta" href="../../#{fragment}" id="questionnaireLink">Tester mon profil gratuitement</a><small>Prix et disponibilité peuvent évoluer : vérifie-les chez le marchand.</small></section>
    </aside></div>
  </main><footer>© 2026 MyBestPair · <a href="../../../../confidentialite.html">Confidentialité</a></footer>
  <script>document.getElementById('questionnaireLink').addEventListener('click',function(){{if(typeof gtag==='function')gtag('event','model_page_questionnaire_click',{{sport:'{sport}',model:{json.dumps(name, ensure_ascii=False)}}})}});</script>
</body></html>
'''


def main():
    all_urls = []
    for sport, (base, category, fields) in SPECS.items():
        source = (ROOT / ("shoes.js" if sport == "basket" else f"{base}/index.html")).read_text()
        shoes = items(source)
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
                page.write_text(render(shoe, sport, base, category, fields))
            all_urls.append(f"https://mybestpair.fr/{base}/modeles/{path}/")
        links = "\n".join(f'<li><a href="{h(path)}/">{h(name)}</a></li>' for name, path in zip(names, slugs))
        index = f'''<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Chaussures {h(category)} : {len(shoes)} fiches modèles | MyBestPair</title><meta name="description" content="Parcours les {len(shoes)} modèles {h(category)} de la base MyBestPair, consulte leurs caractéristiques et teste ton profil."><link rel="canonical" href="https://mybestpair.fr/{base}/modeles/"><link rel="icon" href="../../../favicon.png"><style>{CSS}</style></head><body><nav class="topbar"><a class="brand" href="../../../">MYBESTPAIR</a><a href="../">Questionnaire {h(category)}</a></nav><main><nav class="crumbs"><a href="../../../">Accueil</a> › <a href="../">{h(category)}</a> › Modèles</nav><header class="hero"><div class="eyebrow">Catalogue MyBestPair</div><h1>Chaussures {h(category)} : les {len(shoes)} modèles de la base</h1><p>Explore les caractéristiques et les notes internes des paires, puis teste ton profil pour obtenir un classement personnalisé.</p></header><section class="card"><h2>Toutes les fiches</h2><ul style="columns:2;column-width:250px">{links}</ul><p>Les fiches décrivent la base MyBestPair. Les caractéristiques et disponibilités peuvent évoluer.</p></section><p><a class="cta" href="../">Tester mon profil gratuitement</a></p></main><footer>© 2026 MyBestPair · <a href="../../../confidentialite.html">Confidentialité</a></footer></body></html>'''
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
