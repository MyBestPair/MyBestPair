#!/usr/bin/env python3
"""Page Black Friday : bloc « Les modèles à surveiller », recalculé à partir des données des questionnaires.

Règle affichée sur la page : pour chaque profil, le modèle le mieux noté de la base (critère du profil)
parmi ceux qui ont au moins une offre marchand, avec une marque différente à chaque fois dans un même sport.
À égalité, le moins cher. La commission n'entre jamais en compte (règle 4 de CLAUDE.md).

Les boutons « Voir le prix » reprennent les offres des fiches (même code, mêmes événements GA4 via fiche-offres.js) ;
liens Kwanko écrits ir:/es:/ek:CODE (règle 5). Relancer après chaque mise à jour des prix :
    python3 scripts/build_black_friday.py
Le script ne réécrit que ce qui est entre <!-- picks:start --> et <!-- picks:end -->.
"""
import json
import re

import build_model_pages as bm

PAGE = bm.ROOT / "black-friday/index.html"
MAX_SHOPS = 2  # marchands affichés par modèle (les moins chers) ; les autres sont sur la fiche
RELEVE = "27 octobre 2026"  # date des exports marchands utilisés : à changer à chaque mise à jour des prix

QUIZ = {"route": "../running/route/#questionnaire", "trail": "../running/trail/#questionnaire", "basket": "../basket/#profile-section",
        "padel": "../padel/#profile-section", "rugby": "../rugby/#profile-section", "foot": "../foot/#profile-section"}


def avg(notes):
    return round(sum(notes.values()) / len(notes), 2)


# Un profil = (étiquette, filtre, critère, phrase). Critère « moyenne » = moyenne de toutes les notes du sport.
# Les profils sont choisis dans l'ordre de la liste : les plus contraints (petit budget) en premier, pour la règle des marques.
SPORTS = [
    ("route", "Running sur route", "Entraînement, polyvalence, amorti ou vitesse : un modèle par profil.", [
        ("Entraînement quotidien", lambda s: s["type"] == "DAILY", "durabilite", "Pour courir tous les jours avec une paire qui dure"),
        ("Polyvalente", lambda s: s["type"] == "POLYVALENTE", "dynamisme", "Une seule paire pour le footing comme pour le fractionné"),
        ("Amorti maximal", lambda s: s["type"] == "MAX CUSHION", "amorti", "Pour les sorties longues à allure tranquille, quand l’amorti passe avant tout"),
        ("Vitesse", lambda s: s["type"] == "TEMPO", "dynamisme", "Pour les séances rapides et les courses sur route"),
    ]),
    ("trail", "Trail", "Polyvalence, ultra, terrain technique ou vitesse : un modèle par profil.", [
        ("Polyvalente", lambda s: s["type"] == "POLYVALENTE", "accroche", "Une seule paire pour les terrains mixtes"),
        ("Ultra-distance", lambda s: s["type"] == "ULTRA", "amorti", "Pour les longues distances, avec beaucoup d’amorti"),
        ("Terrain technique", lambda s: s["type"] == "TECHNIQUE", "stabilite", "Pour la montagne et les terrains techniques"),
        ("Vitesse et compétition", lambda s: s["type"] in ("TEMPO", "RACE"), "accroche", "Pour courir vite en course"),
    ]),
    ("basket", "Basket", "Petit budget, salle, salle et extérieur : un modèle par profil.", [
        ("Moins de 100 €", lambda s: s["price"] < 100, "moyenne", "Pour débuter ou jouer en loisir avec un petit budget"),
        ("Salle", lambda s: s["surface"] == "INDOOR", "traction", "Pour jouer en salle"),
        ("Salle et extérieur", lambda s: s["surface"] == "INDOOR/OUTDOOR", "durabilite", "Pour jouer en salle comme dehors, avec une paire faite pour durer"),
    ]),
    ("padel", "Padel", "Trois budgets : un modèle par tranche de prix.", [
        ("Moins de 60 €", lambda s: s["price"] < 60, "moyenne", "Pour jouer avec un petit budget"),
        ("De 60 à 120 €", lambda s: 60 <= s["price"] <= 120, "moyenne", "Pour jouer régulièrement"),
        ("Plus de 120 €", lambda s: s["price"] > 120, "moyenne", "Pour les joueurs exigeants"),
    ]),
    ("rugby", "Rugby", "Avants, trois-quarts, enfants : un modèle par profil.", [
        ("Avants", lambda s: s["public"] == "ADULTE", "protection", "Pour les piliers, deuxième ligne et talonneurs qui vont au contact"),
        ("Trois-quarts", lambda s: s["public"] == "ADULTE", "legerete", "Pour les joueurs rapides : demis, centres, ailiers, arrières"),
        ("Enfant", lambda s: s["public"] == "ENFANT", "moyenne", "Pour l’école de rugby"),
    ]),
    ("foot", "Foot", "Vitesse, technique, petit budget, enfants : un modèle par profil.", [
        ("Vitesse", lambda s: s["public"] == "ADULTE", "legerete", "Pour les attaquants et ailiers qui jouent sur la vitesse"),
        ("Technique", lambda s: s["public"] == "ADULTE", "toucher", "Pour les milieux qui cherchent le toucher de balle"),
        ("Moins de 60 €", lambda s: s["public"] == "ADULTE" and s["price"] < 60 and s["studs"] in ("FG", "MG"), "moyenne", "Pour jouer en loisir sur herbe ou synthétique avec un petit budget"),
        ("Enfant", lambda s: s["public"] == "ENFANT", "moyenne", "Pour les jeunes joueurs"),
    ]),
]


def load(sport):
    base, _, fields = bm.SPECS[sport]
    source = (bm.ROOT / bm.SOURCES.get(sport, f"{base}/{sport}-app.js")).read_text()
    match = re.search(r"const MERCHANT_OFFERS = (\{.*?\});", source, re.S)
    return base, fields, bm.items(source), json.loads(match.group(1)) if match else {}


def detail(shoe, sport):
    if sport == "route":
        return f"Distances : {shoe['distance']}."
    if sport == "trail":
        return ""
    if sport == "padel":
        return f"Semelle {bm.sole_text(shoe).lower()}."
    if sport == "rugby":
        return f"Crampons {bm.STUDS.get(shoe['studs'], 'à confirmer')}, chaussant {bm.display_value(shoe['foot']).lower()}."
    if sport == "foot":
        return f"Crampons {shoe.get('studsLabel') or bm.FOOT_STUDS.get(shoe['studs'], 'à confirmer')}, chaussant {bm.display_value(shoe['foot']).lower()}."
    return f"Chaussant {bm.display_value(shoe['foot']).lower()}."


def pick_html(sport, base, fields, shoes, offers, profile, chosen_brands):
    label_, keep, crit, sentence = profile
    candidates = []
    for shoe in shoes:
        name = bm.display_name(shoe, sport)
        brand = (shoe.get("marque") or shoe.get("brand")).casefold()
        if brand in chosen_brands or not keep(shoe) or not bm.buy_offers(shoe, sport, offers, name, with_amazon=False):
            continue
        notes = bm.scores(shoe, sport, fields)
        value = avg(notes) if crit == "moyenne" else notes[crit]
        candidates.append((-value, bm.price_of(shoe), -avg(notes), name, shoe, notes, value))
    if not candidates:
        raise ValueError(f"Aucun modèle pour {sport} / {label_}")
    # Critère du profil, puis le moins cher, puis la meilleure moyenne (puis le nom, pour un résultat stable).
    _, price, _, name, shoe, notes, value = min(candidates, key=lambda c: c[:4])
    chosen_brands.add((shoe.get("marque") or shoe.get("brand")).casefold())
    if crit == "moyenne":
        best = max(fields, key=lambda k: (notes[k], k))
        why = f"Note moyenne : {bm.score(round(value, 1))} ; point fort : {bm.label(best).lower()} {bm.score(notes[best])}."
    else:
        why = f"{bm.label(crit)} : {bm.score(value)} dans notre base."
    path = bm.slug(name)
    photo = bm.image_for(name, offers, shoe)
    visual = ""
    if photo:
        credit = f'<span class="tile-credit">Photo : © {bm.h(photo[2])}</span>' if photo[2] else ""
        visual = f'<span class="tile-photo"><img src="{bm.h(photo[0])}" alt="{bm.h(name)}" loading="lazy" decoding="async">{credit}</span>'
    lines = bm.buy_lines(shoe, sport, offers, name, with_amazon=False)  # pages Black Friday / Noël : marchands avec prix uniquement
    more = len(lines) - MAX_SHOPS
    extra = f'<p class="pick-more"><a href="../{base}/modeles/{path}/#ou-acheter">+ {more} autre{"s" if more > 1 else ""} marchand{"s" if more > 1 else ""} sur la fiche</a></p>' if more > 0 else ""
    usual = ("≈ " if shoe.get("priceIndicative") else "") + bm.euros(price)
    return (f'<article class="pick">{visual}<span class="pick-profile">{bm.h(label_)}</span><h4>{bm.h(name)}</h4>'
            f'<p>{bm.h(" ".join(filter(None, [sentence + ".", why, detail(shoe, sport)])))}</p><p class="pick-price">Prix habituel : {usual}</p>'
            f'<div class="buy pick-buy"><ul class="buy-list">{"".join(lines[:MAX_SHOPS])}</ul>{extra}</div>'
            f'<div class="pick-links"><a class="fiche" href="../{base}/modeles/{path}/">Voir la fiche →</a><a class="cta" href="{QUIZ[sport]}">Vérifier avec mon profil</a></div></article>')


def main():
    blocks = []
    for sport, title, intro, profiles in SPORTS:
        base, fields, shoes, offers = load(sport)
        chosen = set()
        picks = "\n          ".join(pick_html(sport, base, fields, shoes, offers, p, chosen) for p in profiles)
        blocks.append(f'''      <section class="card sport-block" id="{sport}">
        <h3>{bm.h(title)}</h3>
        <p>{bm.h(intro)}</p>
        <div class="picks">
          {picks}
        </div>
      </section>''')
    page = PAGE.read_text()
    releve = f'      <p class="note releve">Sous chaque modèle : les prix relevés chez les marchands le {RELEVE} (les deux moins chers). Le prix du jour se vérifie sur leur site.</p>'
    new, found = re.subn(r"<!-- picks:start -->.*?<!-- picks:end -->",
                         lambda m: "<!-- picks:start -->\n" + releve + "\n\n" + "\n\n".join(blocks) + "\n      <!-- picks:end -->", page, count=1, flags=re.S)
    if not found:
        raise ValueError("Repères <!-- picks:start --> / <!-- picks:end --> absents de black-friday/index.html")
    PAGE.write_text(new)


if __name__ == "__main__":
    main()
