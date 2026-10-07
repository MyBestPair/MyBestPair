# MyBestPair — mémoire du projet

## Contexte
- Romain gère seul mybestpair.fr. Il n'est pas développeur : réponds-lui **en français**, de façon **concise**, et explique **ce qu'il doit vérifier** (sur le site, dans la PR), pas le code.
- Le site recommande des chaussures de sport via un questionnaire qui donne un **Top 3 personnalisé**. Sports : Route, Trail, Basket, Padel.
- Site statique HTML/JS hébergé sur GitHub (pas de framework, pas de build hors `scripts/`).
- Monétisation par affiliation : **Kwanko, Awin, Rakuten** (Decathlon passe par Rakuten).

## Règles de travail (à respecter à chaque session)
1. **Une PR par sujet**, sur une branche `claude/…`. Romain fusionne lui-même : ne jamais fusionner.
2. **Avant chaque PR** : vérifier l'affichage sur mobile (largeur **390 px**) avec Chromium/Playwright, et vérifier par `git diff` que rien d'autre que le sujet n'a changé.
3. **Ne jamais toucher** :
   - aux liens d'affiliation existants ;
   - à l'événement GA4 `affiliate_click` et à ses paramètres (modèle `product_name`, marque `brand`, rang `rank`, réseau `affiliate_network`, marchand `merchant`) ;
   - à `analytics-consent.js`.
4. **Le classement ne dépend jamais de la commission** ni de la présence d'un lien d'affiliation.

## Organisation du dépôt
| Élément | Où |
|---|---|
| Accueil | `index.html` |
| Basket : page + questionnaire | `basket/index.html`, moteur `app.js`, données `shoes.js`, affichage Top 3 `basket/top3-basket.js` |
| Padel : page + questionnaire | `padel/index.html`, moteur `padel/padel-app.js` (copie adaptée de `app.js`, même barème), données `padel/shoes-padel.js`, Top 3 `padel/top3-padel.js` |
| Route / Trail | `running/route/` (`route-app.js`), `running/trail/` (`trail-app.js`), Top 3 commun `running/top3.js` |
| Fiches modèles + catalogues | `*/modeles/<modele>/index.html` et `*/modeles/index.html`, **générés** par `python3 scripts/build_model_pages.py` (ne pas les éditer à la main) |
| Données des fiches | `scripts/fiches_enrichies.json`, `scripts/model_photos.json` |
| Pages légales / méthode | `methodologie.html`, `confidentialite.html`, `mentions-legales.html`, `conditions-utilisation.html`, `qui-sommes-nous.html` |
| SEO | `sitemap.xml`, `robots.txt` |

Fiches actuelles : 161 (30 Basket, 50 Route, 51 Trail, 30 Padel). Le script de génération est stable : le relancer sans changement de données ne modifie aucun fichier.
Exception : la fiche `running/route/modeles/asics-novablast-6/` est rédigée à la main ; le script la conserve et n'y injecte que certains blocs (dont l'encart d'affiliation). Toute modification du gabarit des fiches doit aussi être prévue pour elle.
L'encart d'affiliation (texte dans `AFFILIATE_NOTE`, `scripts/build_model_pages.py`) renvoie vers `methodologie.html#liens-commerciaux`.

## Barème (moteur `app.js`, `FINAL_WEIGHTS`)
62 % critères techniques · 15 % budget · 10 % surface · 8 % pied · 5 % marque.
Budget : marge « coup de cœur » de +20 € au-dessus du budget annoncé. Les 3 priorités choisies multiplient le poids des critères (×1,5 / ×1,25 / ×1,1).

## Feuille de route
- **Étape 1 — Mention d'affiliation** : encart en haut des fiches, catalogues et résultats Route/Trail/Basket ; ancre `#liens-commerciaux` dans `methodologie.html` ; Kwanko ajouté dans `confidentialite.html`.
- **Étape 2 — Module Padel** (en ligne visé le **vendredi 9 octobre 2026**, indexation avant le Black Friday du **27 novembre 2026**) :
  - calqué sur `basket/` : même structure de page, même moteur `app.js`, même barème (la part « surface » = surface/semelle) ;
  - 30 modèles issus du relevé Decathlon de Romain (7 oct. 2026), liens marchands Decathlon via Rakuten ;
  - 8 critères notés sur 10 : adhérence, amorti, stabilité, maintien, légèreté, confort, durabilité, réactivité ;
  - questions : niveau (je débute / loisir régulier / compétition), fréquence (1×/sem. / 2-3× / 4× ou plus — plus c'est fréquent, plus la durabilité compte), surface (extérieur gazon sablé / indoor / je ne sais pas → type de semelle conseillé), style de jeu (attaquant au filet / défenseur au fond / polyvalent / je ne sais pas), type de pied, budget, marque préférée, 3 priorités, homme / femme / peu importe ;
  - livrables : page `/padel/` avec questionnaire, guide « Comment choisir ses chaussures de padel », FAQ avec données structurées (comme `basket/`), 30 fiches via `build_model_pages.py`, carte Padel sur l'accueil, `sitemap.xml` à jour, encart d'affiliation ;
  - tableau des 30 modèles validé par Romain le 7 oct. 2026 ; toutes les notes sont des estimations (fiches fabricants + tests publiés) ;
  - prix, liens Rakuten et photos de 25 modèles repris du catalogue Rakuten Decathlon (export du 7 oct. 2026, script PowerShell de Romain `export-decathlon-padel.ps1`, API Product Search mid=44806) ; prix catalogue hors promotion, comme le dit la méthodologie ;
  - reste à faire : 5 modèles absents du catalogue Rakuten (ASICS Solution Swift FF Padel, adidas Barricade 13, HEAD Sprint Evo 4.0, Wilson Hurakn Pro V2, NOX Nerbo), semelle de la Barricade 13 à confirmer.
