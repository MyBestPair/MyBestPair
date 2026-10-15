# Vidéo 9:16 — « Trouve la meilleure paire pour ton sport »

Vidéo verticale de 15 s (1080 × 1920, 30 i/s) pour TikTok, Reels et Shorts : `mybestpair-9x16.mp4`.
Ce dossier ne sert pas au site (aucune page n'y renvoie) : il garde la source pour pouvoir modifier la vidéo.

| Temps | Scène |
|---|---|
| 0 – 2,3 s | Accroche : « Des centaines de modèles… Laquelle est faite pour TOI ? » |
| 2,3 – 4,4 s | Étape 1 : les 6 sports (cadran de l'accueil), choix de Route |
| 4,4 – 8,7 s | Étape 2 : questionnaire (objectif, distance, budget, 3 priorités) |
| 8,7 – 9,6 s | Analyse des 50 modèles Route |
| 9,6 – 12,3 s | Étape 3 : Top 3 avec scores /100 + « Les commissions n'entrent pas dans le calcul » |
| 12,3 – 15 s | CTA : « Fais le test gratuit » + mybestpair.fr |

Le Top 3 montré est le vrai résultat du questionnaire Route (15 oct. 2026) pour le profil : entraînement,
semi-marathon, 5:00-6:00/km, 72 kg, pied standard, médio-pied, 150 €, priorités amorti / dynamisme / confort.
Photos des 3 modèles : i-Run (celles des fiches du site). Vidéo sans son : ajouter une musique dans l'appli.

## Refaire la vidéo
- Aperçu : ouvrir `index.html` dans un navigateur (lecture en boucle).
- Rendu : `node render.cjs /tmp/frames 60` puis `sh encode.sh /tmp/frames mybestpair-9x16.mp4`
  (Playwright + ffmpeg, police Inter installée).
