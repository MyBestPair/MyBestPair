"""Génère les pages comparatifs (modèle « A vs B »).

Données éditoriales : scripts/comparatifs.json (une entrée par comparatif).
Notes MyBestPair : lues dans running/route/route-app.js (SHOES), pour rester
synchronisées avec le questionnaire.

Usage : python3 scripts/build_comparatifs.py
Sortie : running/route/comparatifs/<slug>/index.html + entrée dans sitemap.xml.

Liens marchands : jamais de lien Kwanko en clair (règle 5 de CLAUDE.md).
Les boutons portent le code court (ir:/es:/ek:) dans data-k ; le script de la
page reconstruit l'adresse au chargement.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SPORTS = {
    "route": {"base": "running/route", "app": "running/route/route-app.js", "label": "Running Route", "ga": "running_route"},
}
CRITERIA = [("amorti", "Amorti"), ("dynamisme", "Dynamisme"), ("stabilite", "Stabilité"),
            ("confort", "Confort"), ("durabilite", "Durabilité"), ("legerete", "Légèreté")]
CSS = """
.vs-page{max-width:960px}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.vs-faces{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px;margin:0 0 26px}
.vs-face{margin:0;text-align:center;background:#f8fafc;border-radius:14px;padding:12px}
.vs-face img{display:block;width:100%;height:150px;object-fit:contain;mix-blend-mode:multiply}
.vs-face figcaption{margin-top:8px;line-height:1.35}.vs-face strong{display:block;font:800 1rem Manrope,'DM Sans',sans-serif}.vs-face span{color:var(--muted);font-size:.84rem;font-weight:700}
.vs-badge{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:#09254c;color:#fff;font:800 .9rem Manrope,sans-serif}
.vs-scroll{overflow-x:auto}
.vs-table{width:100%;border-collapse:collapse;font-size:.93rem}
.vs-table th,.vs-table td{text-align:left;vertical-align:top;padding:11px 10px;border-bottom:1px solid var(--line);line-height:1.45}
.vs-table thead th{font:800 .95rem Manrope,'DM Sans',sans-serif;color:var(--ink);border-bottom:2px solid var(--line)}
.vs-table tbody th{width:30%;color:var(--muted);font-weight:700;padding-left:0}
.vs-table td.win{background:#eef8f1;font-weight:800}
.vs-src{margin-top:14px}
.vs-scores{display:grid;gap:12px;margin-top:18px}
.vs-score{display:grid;grid-template-columns:minmax(80px,.8fr) 1fr 1fr;gap:12px;align-items:center;font-size:.9rem}
.vs-score-head span{font:800 .85rem Manrope,'DM Sans',sans-serif}
.vs-crit{font-weight:700}
.vs-bar{display:flex;align-items:center;gap:8px;--fill:#9db8d9}
.vs-bar:before{content:"";flex:1;height:9px;border-radius:6px;background:linear-gradient(to right,var(--fill) var(--score),#e9eef4 var(--score))}
.vs-bar.win{--fill:#1559ae}
.vs-bar b{flex-shrink:0;min-width:44px;text-align:right;font-size:.82rem;color:var(--muted)}.vs-bar.win b{color:var(--blue)}
.vs-verdicts{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.vs-verdict{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:14px;padding:19px;background:#fcfdff}
.vs-verdict h3{margin:0 0 6px;font-size:1.1rem}.vs-verdict h4{margin:14px 0 4px;font-size:.9rem;color:var(--muted)}
.vs-verdict li{font-size:.94rem;line-height:1.45}
.vs-limits{list-style:none;padding:0}.vs-limits li{position:relative;padding-left:18px}.vs-limits li:before{content:"–";position:absolute;left:0;color:#c46a12;font-weight:800}
.vs-offers{margin-top:auto;padding-top:8px}.vs-offers .cta{margin:8px 0 0}
.vs-fiche{display:inline-block;margin-top:12px;font-size:.88rem;font-weight:800}
.vs-bf{background:#fff7ea;border-color:#f2dcc1}
.vs-sources li{font-size:.9rem}
@media(max-width:570px){.vs-verdicts{grid-template-columns:1fr}.vs-faces{gap:8px}.vs-face img{height:110px}.vs-badge{width:36px;height:36px;font-size:.78rem}.vs-score{grid-template-columns:76px 1fr 1fr;gap:8px}.vs-table th,.vs-table td{padding:10px 6px}.vs-table tbody th{width:32%}}
"""
MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août",
          "septembre", "octobre", "novembre", "décembre"]


def h(value):
    return html.escape(str(value), quote=True)


def note(value):
    return f"{value:g}".replace(".", ",") + "/10"


def date_fr(iso):
    y, m, d = (int(x) for x in iso.split("-"))
    return f"{d} {MONTHS[m - 1]} {y}"


def load_shoes(app_path):
    first_line = (ROOT / app_path).read_text(encoding="utf-8").split("\n", 1)[0]
    data = json.loads(first_line[len("const SHOES = "):].rstrip().rstrip(";"))
    return {s["modele"]: s for s in data}


def json_ld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False, separators=(",", ":")) + "</script>"


def render(c, shoes):
    sport = SPORTS[c["sport"]]
    url = f"https://mybestpair.fr/{sport['base']}/comparatifs/{c['slug']}/"
    root = "../../../../"
    a, b = c["models"]
    sa, sb = shoes[a["name"]], shoes[b["name"]]

    crumbs = json_ld({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://mybestpair.fr/"},
        {"@type": "ListItem", "position": 2, "name": sport["label"], "item": f"https://mybestpair.fr/{sport['base']}/"},
        {"@type": "ListItem", "position": 3, "name": f"{a['short']} vs {b['short']}", "item": url}]})
    article = json_ld({"@context": "https://schema.org", "@type": "Article", "headline": c["h1"], "url": url,
                       "inLanguage": "fr-FR", "dateModified": c["updated"],
                       "author": {"@type": "Organization", "name": "MyBestPair", "url": "https://mybestpair.fr/"}})
    faq = json_ld({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": f["q"], "acceptedAnswer": {"@type": "Answer", "text": f["a"]}} for f in c["faq"]]})

    # Bandeau photo A vs B
    def face(m, s):
        return (f'<figure class="vs-face"><img src="{h(m["photo"])}" alt="{h(m["name"])}" loading="lazy" decoding="async">'
                f'<figcaption><strong>{h(m["name"])}</strong><span>Prix habituel : {s["prix"]:g} €</span></figcaption></figure>')
    faces = f'<div class="vs-faces">{face(a, sa)}<span class="vs-badge" aria-hidden="true">VS</span>{face(b, sb)}</div>'

    # Tableau des caractéristiques
    head = f'<tr><th scope="col"><span class="sr-only">Caractéristique</span></th><th scope="col">{h(a["short"])}</th><th scope="col">{h(b["short"])}</th></tr>'
    rows = []
    for r in c["specs"]:
        ca = ' class="win"' if r.get("win") == "a" else ""
        cb = ' class="win"' if r.get("win") == "b" else ""
        rows.append(f'<tr><th scope="row">{h(r["label"])}</th><td{ca}>{h(r["a"])}</td><td{cb}>{h(r["b"])}</td></tr>')
    specs = f'<div class="vs-scroll"><table class="vs-table"><thead>{head}</thead><tbody>{"".join(rows)}</tbody></table></div>'

    # Notes MyBestPair, lues dans les données du questionnaire
    bars = []
    for key, label in CRITERIA:
        va, vb = sa[key], sb[key]
        bars.append(
            f'<div class="vs-score"><span class="vs-crit">{label}</span>'
            f'<span class="vs-bar{" win" if va > vb else ""}" style="--score:{va * 10:g}%"><b>{note(va)}</b></span>'
            f'<span class="vs-bar{" win" if vb > va else ""}" style="--score:{vb * 10:g}%"><b>{note(vb)}</b></span></div>')
    scores = (f'<div class="vs-scores"><div class="vs-score vs-score-head"><span></span><span>{h(a["short"])}</span><span>{h(b["short"])}</span></div>'
              + "".join(bars) + "</div>")

    def verdict(m):
        offers = "".join(
            f'<a class="cta vs-merchant" href="#" data-k="{h(o["link"])}" data-merchant="{h(o["key"])}" data-product-name="{h(m["name"])}" '
            f'data-product-brand="{h(shoes[m["name"]]["marque"])}" target="_blank" rel="noopener noreferrer sponsored">Voir chez {h(o["label"])}</a>'
            for o in m["offers"])
        return (f'<article class="vs-verdict"><h3>Prends la {h(m["short"])} si…</h3>'
                f'<ul>{"".join(f"<li>{h(x)}</li>" for x in m["forWho"])}</ul>'
                f'<h4>Ses limites</h4><ul class="vs-limits">{"".join(f"<li>{h(x)}</li>" for x in m["limits"])}</ul>'
                f'<div class="vs-offers">{offers}</div>'
                f'<a class="vs-fiche" href="../../modeles/{h(m["fiche"])}/">Voir la fiche {h(m["short"])} →</a></article>')

    faq_html = "".join(f'<details><summary>{h(f["q"])}</summary><p>{h(f["a"])}</p></details>' for f in c["faq"])
    sources = "".join(f'<li><a href="{h(s["url"])}" target="_blank" rel="noopener">{h(s["label"])}</a></li>' for s in c["sources"])
    title = f"{c['title']} | MyBestPair"

    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#124f9c">
  <title>{h(title)}</title>
  <meta name="description" content="{h(c["description"])}">
  <link rel="canonical" href="{url}"><link rel="icon" href="{root}favicon.png">
  <meta property="og:type" content="article"><meta property="og:site_name" content="MyBestPair"><meta property="og:locale" content="fr_FR"><meta property="og:title" content="{h(title)}"><meta property="og:description" content="{h(c["description"])}"><meta property="og:url" content="{url}"><meta property="og:image" content="https://mybestpair.fr/images/og-mybestpair.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800&display=swap" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800&display=swap"></noscript>
  {crumbs}
  {article}
  {faq}
  <script src="{root}analytics-consent.js"></script>
  <script src="{root}ambiance.js"></script>
  <link rel="stylesheet" href="{root}modeles.css">
  <style>
{CSS}  </style>
</head>
<body>
  <nav class="topbar" aria-label="Navigation principale"><a class="brand" href="{root}" aria-label="MyBestPair — accueil"><img src="{root}logo-mybestpair.webp" alt="MyBestPair" width="159" height="28"></a><a href="../../#questionnaire">Questionnaire {h(sport["label"])}</a></nav>
  <main class="vs-page">
    <nav class="crumbs" aria-label="Fil d'Ariane"><a href="{root}">Accueil</a> › <a href="../../">{h(sport["label"])}</a> › {h(a["short"])} vs {h(b["short"])}</nav>
    <header class="hero">
      <div class="eyebrow">MyBestPair / Comparatif {h(sport["label"])}</div>
      <h1>{h(c["h1"])}</h1>
      <p>{h(c["lead"])}</p>
      <div class="hero-meta"><span>Mis à jour le <time datetime="{c["updated"]}">{date_fr(c["updated"])}</time></span><span>Notes MyBestPair + données fabricants</span></div>
    </header>
    <p class="note affiliate-note">Certains liens vers les marchands sont des liens d’affiliation (Kwanko, Awin, Rakuten) : un achat peut rapporter une commission à MyBestPair, sans surcoût pour toi. Le classement n’en dépend pas. <a href="{root}methodologie.html#liens-commerciaux">En savoir plus</a></p>

    <section class="card">{faces}
      <h2>Côte à côte</h2>
      {specs}
      <p class="muted vs-src">{h(c["specsNote"])}</p>
    </section>

    <section class="card">
      <h2>Leurs notes MyBestPair</h2>
      <p class="muted">Notes internes sur 10, utilisées par le questionnaire pour comparer les modèles. Ce ne sont pas des notes de test terrain. <a href="{root}methodologie.html">Notre méthodologie</a></p>
      {scores}
    </section>

    <section class="card">
      <h2>Notre verdict : pour qui ?</h2>
      <div class="vs-verdicts">{verdict(a)}{verdict(b)}</div>
    </section>

    <section class="card vs-bf">
      <h2>Faut-il attendre le Black Friday ?</h2>
      <p>{h(c["blackFriday"])}</p>
      <a class="cta" href="{root}black-friday/">Voir la page Black Friday →</a>
    </section>

    <section class="card">
      <h2>Ni l’une ni l’autre ?</h2>
      <p>Ton poids, ta foulée, ton pied et ton budget changent tout. Le questionnaire compare les 50 modèles de notre base et te donne ton Top 3 en 2 minutes.</p>
      <a class="cta" href="../../#questionnaire" id="questionnaireLink">Trouver ma paire</a>
    </section>

    <section class="card faq">
      <h2>Questions fréquentes</h2>
      {faq_html}
    </section>

    <section class="card">
      <h2>Sources</h2>
      <ul class="vs-sources">{sources}</ul>
    </section>
  </main>
  <footer>© 2026 MyBestPair · <a href="{root}conditions-utilisation.html">Conditions d’utilisation</a> · <a href="{root}methodologie.html">Méthodologie</a> · <a href="{root}confidentialite.html">Confidentialité</a></footer>
  <script>
  (function(){{
    var H={{ir:"rf.nur-i.xsf",es:"rf.erots-ecnarudne.foz",ek:"rf.tropsoke.azi"}};
    document.querySelectorAll(".vs-merchant").forEach(function(a){{
      var m=/^(ir|es|ek):(.+)$/.exec(a.dataset.k||"");
      if(m)a.href="https://"+H[m[1]].split("").reverse().join("")+"/?"+m[2];
      a.addEventListener("click",function(){{
        if(typeof gtag==="function")gtag("event","affiliate_click",{{product_name:a.dataset.productName,brand:a.dataset.productBrand,rank:0,sport:"{sport["ga"]}",affiliate_network:"kwanko",merchant:a.dataset.merchant}});
      }});
    }});
    var q=document.getElementById("questionnaireLink");
    q.addEventListener("click",function(){{if(typeof gtag==="function")gtag("event","comparison_questionnaire_click",{{sport:"{sport["ga"]}",comparison:"{c["slug"]}"}});}});
  }})();
  </script>
</body>
</html>
'''


def main():
    comparatifs = json.loads((ROOT / "scripts" / "comparatifs.json").read_text(encoding="utf-8"))
    sitemap = ROOT / "sitemap.xml"
    xml = sitemap.read_text(encoding="utf-8")
    for c in comparatifs:
        sport = SPORTS[c["sport"]]
        shoes = load_shoes(sport["app"])
        for m in c["models"]:
            if m["name"] not in shoes:
                raise ValueError(f"Modèle absent de {sport['app']} : {m['name']}")
            for o in m["offers"]:
                if not re.match(r"^(ir|es|ek):", o["link"]):
                    raise ValueError(f"Lien marchand non masqué pour {m['name']} : utiliser ir:/es:/ek:")
        out = ROOT / sport["base"] / "comparatifs" / c["slug"] / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(render(c, shoes), encoding="utf-8")
        loc = f"https://mybestpair.fr/{sport['base']}/comparatifs/{c['slug']}/"
        entry = f"  <url><loc>{loc}</loc><lastmod>{c['updated']}</lastmod></url>"
        if loc in xml:
            xml = re.sub(rf"  <url><loc>{re.escape(loc)}</loc>.*?</url>", entry, xml)
        else:
            # Placé avant les fiches modèles, que build_model_pages.py réécrit.
            xml = xml.replace("  <url><loc>https://mybestpair.fr/running/route/modeles/", entry + "\n  <url><loc>https://mybestpair.fr/running/route/modeles/", 1)
        print(out.relative_to(ROOT))
    sitemap.write_text(xml, encoding="utf-8")


if __name__ == "__main__":
    main()
