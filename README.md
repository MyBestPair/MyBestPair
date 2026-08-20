# MY SHOES WEB V1.1

Version corrigée et resynchronisée avec le dernier export du MASTER.

## Correction principale
- Les 30 modèles, notes, prix, surfaces, types de pied, marques et liens sont relus depuis le dernier MASTER.
- Le calcul reste strictement basé sur le moteur du MASTER :
  - 72 % score personnalisé
  - 10 % surface
  - 8 % pied
  - 5 % marque
  - 5 % budget
  - priorités : x1,5 / x1,25 / x1,1
  - marge coup de cœur : 20 €
- Nouveau départage des quasi-égalités (< 0,10 point) :
  priorité à la compatibilité budget, puis surface, puis pied.
  Le score affiché n'est pas artificiellement modifié.

## Pourquoi ce changement ?
Deux modèles pouvant afficher tous les deux 86/100 étaient parfois séparés par seulement quelques centièmes.
Le nouveau départage évite qu'une chaussure hors budget passe devant une chaussure dans le budget pour un écart invisible pour l'utilisateur.

## Test à refaire
Repasser exactement les 3 profils de contrôle déjà utilisés, en particulier :
Arrière / Indoor / 150 € / Standard / Adidas / Shooteur /
Stabilité / Amorti / Confort.
