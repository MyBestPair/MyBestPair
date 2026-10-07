# MyBestPair — mémoire du projet

## Contexte
- Romain gère seul mybestpair.fr. Il n'est pas développeur : réponds-lui **en français**, de façon **concise**, et explique **ce qu'il doit vérifier** (sur le site, dans la PR), pas le code.
- Le site recommande des chaussures de sport via un questionnaire qui donne un **Top 3 personnalisé**. Sports : Route, Trail, Basket, Padel, Rugby.
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
| Rugby : page + questionnaire | `rugby/index.html`, moteur `rugby/rugby-app.js` (même barème), données `rugby/shoes-rugby.js`, Top 3 `rugby/top3-rugby.js` |
| Route / Trail | `running/route/` (`route-app.js`), `running/trail/` (`trail-app.js`), Top 3 commun `running/top3.js` |
| Fiches modèles + catalogues | `*/modeles/<modele>/index.html` et `*/modeles/index.html`, **générés** par `python3 scripts/build_model_pages.py` (ne pas les éditer à la main) |
| Données des fiches | `scripts/fiches_enrichies.json`, `scripts/model_photos.json` |
| Pages légales / méthode | `methodologie.html`, `confidentialite.html`, `mentions-legales.html`, `conditions-utilisation.html`, `qui-sommes-nous.html` |
| SEO | `sitemap.xml`, `robots.txt` |

Fiches actuelles : 193 (30 Basket, 50 Route, 51 Trail, 32 Padel, 30 Rugby). Le script de génération est stable : le relancer sans changement de données ne modifie aucun fichier.
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
  - tableau des 30 modèles validé par Romain le 7 oct. 2026, puis 6 modèles récents ajoutés depuis le catalogue Rakuten (Indiga W 26V, Spin Lady, Courtquick, Movea 2, Motion One LTD, Sprint Pro 4.0) ; toutes les notes sont des estimations (fiches fabricants + tests publiés) ;
  - **ne proposer que des modèles récents** (dernière génération) : un joueur veut une paire actuelle ; écarter les anciennes générations quand une plus récente existe (retirés le 7 oct. 2026 : Kuikma PS 990 Dyn, ASICS Gel-Dedicate 8 Padel, Babolat Movea 1re version, adidas Barricade 13) ;
  - le script de génération ne supprime pas les fiches des modèles retirés : supprimer à la main le dossier `padel/modeles/<modele>/` ;
  - versions femme : champ `women` (lien, prix, photo) utilisé quand on choisit « Femme » (PS PRO, Game FF, Courtquick) ;
  - prix, liens Rakuten et photos de 25 modèles repris du catalogue Rakuten Decathlon (export du 7 oct. 2026, script PowerShell de Romain `export-decathlon-padel.ps1`, API Product Search mid=44806) ; prix catalogue hors promotion, comme le dit la méthodologie ;
  - 4 modèles absents du catalogue Rakuten gardés sans lien pour l'instant (choix de Romain) : ASICS Solution Swift FF Padel, HEAD Sprint Evo 4.0, Wilson Hurakn Pro V2, NOX Nerbo.
- **Ancien domaine** : mysportshoes.fr (chez OVH) redirige vers mybestpair.fr en http seulement (la redirection web OVH ne gère pas le https). Choix de Romain le 7 oct. 2026 : on laisse ainsi pour l'instant ; si besoin, solution = petit site de redirection sur GitHub Pages + zone DNS OVH.
- **Étape 3 — Module Rugby** (choisi avant le foot : réseau de Romain dans les Landes, moins de concurrence en ligne ; viser une mise en ligne rapide, avant le Black Friday) :
  - même principe que le Padel (page, moteur copié de `app.js`, même barème 62/15/10/8/5, fiches, sitemap, encart d'affiliation) ; la part « surface » = terrain + type de crampons ;
  - questions, dans cet ordre (validé par Romain) : poste en 3 groupes (1re et 2e ligne / talonneur et 3e ligne / trois-quarts, demis compris), style de jeu (impact-combat / polyvalent / vitesse-évitement), poids (kg), homme / femme / enfant, terrain (sec / gras / synthétique / je ne sais pas), type de crampons (fer-vissés / moulés / hybride / je ne sais pas), niveau, type de pied, budget, marque préférée, 3 priorités ; pas de pointure pour l'instant ;
  - raisonner par **profil de joueur**, pas par étiquette « avant / trois-quarts » sur les chaussures : piliers et 2e ligne → accroche, stabilité, protection (tige plus épaisse, risque de se faire marcher sur les pieds) ; 3e ligne modernes et certains talonneurs → profils mobiles, crampons plus légers ; le style et le poids corrigent le poste ;
  - crampons « je ne sais pas » → déduits du terrain (gras : fer ou hybride ; sec : moulés ou hybride ; synthétique : moulés) ; fer sur synthétique : avertissement, souvent interdit ;
  - 8 critères proposés : accroche, stabilité, maintien, protection, légèreté, dynamisme, confort, durabilité (dynamisme à la place de l'amorti, sauf avis contraire de Romain) ;
  - données : export Rakuten via `export-decathlon-rugby.ps1` (même principe que le padel) ; le catalogue Rakuten Decathlon ne contient que 12 crampons de rugby (Offload, adidas RS15/Kakari, Mizuno Monarcida) ;
  - tableau de 30 modèles validé par Romain le 7 oct. 2026 : 12 avec lien Decathlon + 18 références récentes sans lien (Canterbury, adidas, Mizuno, Gilbert ; prix public indicatif, champ `priceIndicative`) ; 24 adultes mixtes, 2 femmes (RS15 Avaglide, Kakari W), 4 enfants ; RS15 SG hybride en coloris standard (l'édition Antoine Dupont existe à 99,99 €) ;
  - pas encore de 2e marchand rugby (choix de Romain) : à chercher plus tard dans Awin/Kwanko pour donner des liens aux 18 modèles ; photo de Romain (buteur) recadrée sur les crampons et le ballon, joueur non reconnaissable : un site de chaussures doit montrer des chaussures (`images/carte-rugby.webp`, `images/rugby-hero.webp`).
