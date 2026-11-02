#!/usr/bin/env python3
"""Page « Idées cadeaux de Noël » (/noel/), entièrement générée : ne pas l'éditer à la main.

Règle affichée sur la page : pour un cadeau, modèles polyvalents uniquement (pas de chaussures de compétition ; neutres en running / trail) ;
dans chaque budget, la meilleure note moyenne de notre base parmi les modèles qui ont au moins une offre marchand,
une marque différente à chaque fois dans un même bloc, à égalité le moins cher. La commission n'entre jamais en compte.

Cartes, prix et boutons « Voir le prix » : mêmes fonctions que la page Black Friday (build_black_friday.py),
donc mêmes liens (Kwanko en data-k) et mêmes événements GA4 (fiche-offres.js, rank = 0).
Relancer après chaque mise à jour des prix :
    python3 scripts/build_noel.py
"""
import json

import build_black_friday as bf
import build_model_pages as bm

PAGE = bm.ROOT / "noel/index.html"
URL = "https://mybestpair.fr/noel/"
UPDATED = ("2026-11-02", "2 novembre 2026")  # date de la dernière mise à jour du contenu ou des prix
TITLE = "Idées cadeaux de Noël 2026 : chaussures de sport par sport et par budget"
DESCRIPTION = ("Offrir des chaussures de running, trail, basket, padel, rugby ou foot à Noël : notre sélection par budget, "
               "les prix chez les marchands et comment ne pas se tromper de pointure.")

ROUTE_TYPES = ("DAILY", "POLYVALENTE", "MAX CUSHION")  # + foulée NEUTRE : on ne connaît pas la foulée de la personne
TRAIL_TYPES = ("POLYVALENTE", "ULTRA", "TECHNIQUE")

# (id, titre, intro, [(sport, étiquette, filtre, phrase)]) — dans chaque bloc, choix dans l'ordre de la liste.
BLOCKS = [
    ("route", "Pour un coureur sur route", "Des chaussures d’entraînement neutres (sans correction de la foulée), pas de modèles de compétition.", [
        ("route", "Moins de 150 €", lambda s: s["type"] in ROUTE_TYPES and s["foulee"] == "NEUTRE" and s["prix"] < 150, "Une paire pour courir régulièrement sans se ruiner"),
        ("route", "De 150 à 180 €", lambda s: s["type"] in ROUTE_TYPES and s["foulee"] == "NEUTRE" and 150 <= s["prix"] <= 180, "Le meilleur compromis de notre base pour courir souvent"),
        ("route", "Plus de 180 €", lambda s: s["type"] in ROUTE_TYPES and s["foulee"] == "NEUTRE" and s["prix"] > 180, "Pour faire plaisir à un coureur exigeant"),
    ]),
    ("trail", "Pour un traileur ou une traileuse", "Des chaussures neutres pour les sentiers, pas de modèles de compétition.", [
        ("trail", "Moins de 150 €", lambda s: s["type"] in TRAIL_TYPES and s["foulee"] == "NEUTRE" and s["prix"] < 150, "Une paire pour les sentiers sans se ruiner"),
        ("trail", "De 150 à 180 €", lambda s: s["type"] in TRAIL_TYPES and s["foulee"] == "NEUTRE" and 150 <= s["prix"] <= 180, "Le meilleur compromis de notre base pour courir en nature"),
        ("trail", "Plus de 180 €", lambda s: s["type"] in TRAIL_TYPES and s["foulee"] == "NEUTRE" and s["prix"] > 180, "Pour faire plaisir à un traileur exigeant"),
    ]),
    ("basket", "Pour un joueur ou une joueuse de basket", "Des chaussures pour jouer en salle comme dehors.", [
        ("basket", "Moins de 100 €", lambda s: s["surface"] == "INDOOR/OUTDOOR" and s["price"] < 100, "Pour jouer en loisir avec un petit budget"),
        ("basket", "De 100 à 130 €", lambda s: s["surface"] == "INDOOR/OUTDOOR" and 100 <= s["price"] <= 130, "Le meilleur compromis de notre base"),
        ("basket", "Plus de 130 €", lambda s: s["surface"] == "INDOOR/OUTDOOR" and s["price"] > 130, "Pour faire plaisir à un joueur exigeant"),
    ]),
    ("padel", "Pour un joueur ou une joueuse de padel", "Trois budgets, un modèle par tranche de prix.", [
        ("padel", "Moins de 60 €", lambda s: s["price"] < 60, "Pour débuter ou jouer en loisir"),
        ("padel", "De 60 à 100 €", lambda s: 60 <= s["price"] <= 100, "Pour jouer régulièrement"),
        ("padel", "Plus de 100 €", lambda s: s["price"] > 100, "Pour faire plaisir à un joueur exigeant"),
    ]),
    ("rugby", "Pour un rugbyman ou une rugbywoman", "Crampons moulés ou hybrides : ils conviennent à plus de terrains que les crampons vissés en fer.", [
        ("rugby", "Moins de 60 €", lambda s: s["public"] == "ADULTE" and s["studs"] in ("MOULES", "HYBRIDE") and s["price"] < 60, "Pour jouer en club avec un petit budget"),
        ("rugby", "Plus de 60 €", lambda s: s["public"] == "ADULTE" and s["studs"] in ("MOULES", "HYBRIDE") and s["price"] >= 60, "Pour faire plaisir à un joueur exigeant"),
    ]),
    ("foot", "Pour un footballeur ou une footballeuse", "Crampons FG ou multi-terrain : les plus courants, pour l’herbe et, pour les MG, le synthétique.", [
        ("foot", "Moins de 60 €", lambda s: s["public"] == "ADULTE" and s["studs"] in ("FG", "MG") and s["price"] < 60, "Pour jouer en loisir avec un petit budget"),
        ("foot", "De 60 à 100 €", lambda s: s["public"] == "ADULTE" and s["studs"] in ("FG", "MG") and 60 <= s["price"] <= 100, "Le meilleur compromis de notre base"),
        ("foot", "Plus de 100 €", lambda s: s["public"] == "ADULTE" and s["studs"] in ("FG", "MG") and s["price"] > 100, "Pour faire plaisir à un joueur exigeant"),
    ]),
    ("enfants", "Pour un enfant", "Foot et rugby : les modèles enfant de notre base.", [
        ("foot", "Foot · moins de 50 €", lambda s: s["public"] == "ENFANT" and s["price"] < 50, "Pour débuter au foot"),
        ("foot", "Foot · plus de 50 €", lambda s: s["public"] == "ENFANT" and s["price"] >= 50, "Pour un jeune joueur en club"),
        ("rugby", "Rugby", lambda s: s["public"] == "ENFANT", "Pour l’école de rugby"),
    ]),
]

JUMP = {"route": "Route", "trail": "Trail", "basket": "Basket", "padel": "Padel", "rugby": "Rugby", "foot": "Foot", "enfants": "Enfants"}

FAQ = [
    ("Comment connaître sa pointure sans lui demander ?",
     "Regarde l’étiquette à l’intérieur d’une paire de sport qu’il ou elle porte souvent. Les pointures varient d’une marque à l’autre : "
     "si possible, choisis la même marque que ses chaussures actuelles. En cas de doute, une carte cadeau du marchand évite l’erreur."),
    ("Peut-on échanger des chaussures offertes à Noël ?",
     "Cela dépend du marchand : la durée pour retourner ou échanger et les conditions (chaussures non portées, boîte d’origine…) sont dans ses conditions de vente. "
     "Certains marchands allongent ce délai pendant les fêtes : vérifie-le avant d’acheter, et garde la preuve d’achat."),
    ("Quelle chaussure de sport offrir à un enfant ?",
     "Une paire adaptée à son sport et à son terrain : au foot, des crampons moulés FG ou multi-terrain MG ; au rugby, des crampons moulés, "
     "car les crampons métal sont souvent interdits sur synthétique. Prends la pointure actuelle de son pied, sans viser trop grand."),
    ("Faut-il acheter son cadeau pendant le Black Friday ?",
     "C’est souvent le bon moment pour payer moins cher, à condition de comparer avec le prix habituel du modèle. "
     "Vérifie aussi la date limite de commande pour une livraison avant Noël, indiquée par chaque marchand."),
]

STYLE = """  <style>
    .bf-col{max-width:920px;margin:0 auto}
    .sport-block h3{font-size:1.25rem;margin:0 0 4px}
    .sport-block>p{color:var(--muted);margin-bottom:16px}
    .picks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
    .pick{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:14px;padding:18px;background:#fff}
    .pick .tile-photo{margin:-4px -4px 14px}
    .pick-profile{align-self:flex-start;background:var(--soft);color:var(--blue);border-radius:100px;padding:3px 11px;font-size:.72rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
    .pick h4{font:800 1.08rem Manrope,'DM Sans',sans-serif;letter-spacing:-.02em;line-height:1.3;margin:10px 0 6px}
    .pick p{font-size:.94rem;line-height:1.5;margin:0 0 10px}
    .pick-price{font-weight:800}
    .pick-links{margin-top:auto}
    .pick-links .cta{margin:12px 0 0;background:transparent;color:#1559ae;box-shadow:inset 0 0 0 2px #1559ae}
    .pick-links .cta:hover{background:#eef4fc}
    .pick-links .fiche{display:inline-block;font-size:.88rem;font-weight:800}
    .pick-buy{margin:2px 0 4px}
    .pick-buy .buy-list{margin:0}
    .pick-buy .buy-list li{grid-template-columns:minmax(0,1fr) auto;gap:8px 12px;padding:10px 0}
    .pick-buy .buy-btn{grid-column:1/-1;padding:9px 16px}
    .pick-more{margin:0 0 6px;font-size:.88rem;font-weight:800}
    .releve{margin:0 0 4px}
    .tips li{margin:11px 0}
    .jump{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
    .jump a{border:1px solid var(--line);border-radius:999px;padding:6px 13px;font-size:.88rem;font-weight:800;text-decoration:none;background:#fff}
    .sports{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:16px}
    .sports .cta{margin:0}
    @media(max-width:570px){.picks{grid-template-columns:1fr}.sports{grid-template-columns:repeat(2,minmax(0,1fr))}}
  </style>"""


def block_html(block_id, title, intro, profiles):
    chosen, picks = set(), []
    for sport, label_, keep, sentence in profiles:
        base, fields, shoes, offers = bf.load(sport)
        picks.append(bf.pick_html(sport, base, fields, shoes, offers, (label_, keep, "moyenne", sentence), chosen))
    joined = "\n          ".join(picks)
    return f'''      <section class="card sport-block" id="{block_id}">
        <h3>{bm.h(title)}</h3>
        <p>{bm.h(intro)}</p>
        <div class="picks">
          {joined}
        </div>
      </section>'''


def main():
    root = "../"
    faq_ld = bm.json_ld({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ]})
    page_ld = bm.json_ld({"@context": "https://schema.org", "@type": "WebPage", "name": TITLE, "url": URL, "inLanguage": "fr-FR", "dateModified": UPDATED[0]})
    crumbs = bm.json_ld(bm.breadcrumb([("Accueil", "https://mybestpair.fr/"), ("Idées cadeaux de Noël", URL)]))
    blocks = "\n\n".join(block_html(*block) for block in BLOCKS)
    jump = "".join(f'<a href="#{b[0]}">{JUMP[b[0]]}</a>' for b in BLOCKS)
    faq = "\n        ".join(f"<details><summary>{bm.h(q)}</summary><p>{bm.h(a)}</p></details>" for q, a in FAQ)
    html = f'''<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#124f9c">
  <title>{bm.h(TITLE)}</title>
  <meta name="description" content="{bm.h(DESCRIPTION)}">
  <link rel="canonical" href="{URL}"><link rel="icon" href="{root}favicon.png">
  {bm.head_extras(TITLE, DESCRIPTION, URL)}
  {crumbs}
  {page_ld}
  {faq_ld}
  <script src="{root}analytics-consent.js"></script>
  <script src="{root}ambiance.js"></script>
  <link rel="stylesheet" href="{root}modeles.css">
  <script src="{root}fiche-offres.js" defer></script>
{STYLE}
</head>
<body>
  <nav class="topbar" aria-label="Navigation principale"><a class="brand" href="{root}" aria-label="MyBestPair — accueil"><img src="{root}logo-mybestpair.webp" alt="MyBestPair" width="159" height="28"></a><a href="#test">Faire le test</a></nav>
  <main>
    <nav class="crumbs" aria-label="Fil d'Ariane"><a href="{root}">Accueil</a> › Idées cadeaux de Noël</nav>
    <header class="hero">
      <div class="eyebrow">MyBestPair / Noël 2026</div>
      <h1>{bm.h(TITLE)}</h1>
      <p>Offrir des chaussures de sport, c’est offrir un cadeau qui sert vraiment, à condition de ne pas se tromper de pointure ni de modèle. Voici comment éviter l’erreur, et notre sélection par budget pour chaque sport.</p>
      <div class="hero-meta"><span>Noël : vendredi 25 décembre</span><span>Mis à jour le <time datetime="{UPDATED[0]}">{UPDATED[1]}</time></span></div>
    </header>
    <div class="bf-col">
      {bm.affiliate_note(root)}

      <section class="card" id="avant-d-offrir">
        <h2>Avant d’offrir : 4 vérifications</h2>
        <ul class="tips">
          <li><strong>La pointure.</strong> Regarde l’étiquette d’une paire de sport qu’il ou elle porte souvent. Les pointures varient d’une marque à l’autre : si possible, reste sur la même marque.</li>
          <li><strong>Le sport et la pratique.</strong> Une chaussure de trail n’est pas faite pour la route, ni des crampons vissés pour le synthétique. Le plus sûr : <a href="#test">fais le test MyBestPair à sa place</a>, avec ses réponses.</li>
          <li><strong>La forme du pied.</strong> Pied large, standard ou étroit : c’est indiqué sur chaque fiche modèle.</li>
          <li><strong>L’échange et la livraison.</strong> Vérifie chez le marchand la durée pour échanger après Noël et la date limite de commande pour être livré avant le 25 décembre.</li>
        </ul>
        <p class="muted">Pas sûr de la pointure ? Une carte cadeau du marchand évite l’erreur.</p>
      </section>

      <section class="card" id="selection">
        <h2>Notre sélection par budget</h2>
        <p><strong>Comment on l’a faite :</strong> pour un cadeau, on ne connaît pas toujours la pratique exacte. Nous avons donc retenu des modèles polyvalents (pas de chaussures de compétition ; en running et en trail, des chaussures neutres) : dans chaque budget, la meilleure note moyenne de notre base parmi les modèles qui ont au moins une offre marchand, avec une marque différente à chaque fois. À égalité, le moins cher. La commission n’entre jamais en compte.</p>
        <p class="note"><strong>Prix habituel :</strong> c’est le prix catalogue du modèle dans notre base, hors promotion.</p>
        <div class="jump">{jump}</div>
      </section>

      <p class="note releve">Sous chaque modèle : les prix relevés chez les marchands le {bf.RELEVE} (les deux moins chers). Le prix du jour se vérifie sur leur site.</p>

{blocks}

      <section class="card" id="test">
        <h2>Fais le test à sa place</h2>
        <p>Tu connais sa pratique ? Réponds au questionnaire avec ses habitudes (distance, poste, terrain, budget…) : tu obtiens son Top 3 personnalisé en 2 minutes.</p>
        <div class="sports">
          <a class="cta" href="{root}running/route/#questionnaire">Running route</a>
          <a class="cta" href="{root}running/trail/#questionnaire">Trail</a>
          <a class="cta" href="{root}basket/#profile-section">Basket</a>
          <a class="cta" href="{root}padel/#profile-section">Padel</a>
          <a class="cta" href="{root}rugby/#profile-section">Rugby</a>
          <a class="cta" href="{root}foot/#profile-section">Foot</a>
        </div>
        <p style="margin-top:16px"><a href="{root}black-friday/">Acheter pendant le Black Friday : les modèles à surveiller →</a></p>
      </section>

      <section class="card faq" id="faq">
        <h2>Questions fréquentes</h2>
        {faq}
      </section>
    </div>
  </main><footer>© 2026 MyBestPair · <a href="{root}conditions-utilisation.html">Conditions d’utilisation</a> · <a href="{root}methodologie.html">Méthodologie</a> · <a href="{root}confidentialite.html">Confidentialité</a></footer>
</body>
</html>
'''
    PAGE.parent.mkdir(exist_ok=True)
    PAGE.write_text(html)


if __name__ == "__main__":
    main()
