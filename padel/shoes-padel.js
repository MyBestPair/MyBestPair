/* Base Padel MyBestPair — 30 modèles (relevé Decathlon du 7 octobre 2026).
 * Notes sur 10, dans l'ordre de CRITERIA. Toutes les notes sont des estimations MyBestPair
 * établies à partir des fiches fabricants et des tests publiés (voir methodologie.html).
 * sole : CHEVRONS / OMNI / MIXTE / A CONFIRMER · foot : ETROIT / STANDARD / LARGE
 * gender : HOMME / FEMME / MIXTE · link : lien marchand Decathlon (Rakuten), vide = « Lien bientôt disponible ».
 */
const CRITERIA = [
  "ADHERENCE",
  "AMORTI",
  "STABILITE",
  "MAINTIEN",
  "LEGERETE",
  "CONFORT",
  "DURABILITE",
  "REACTIVITE"
];

const SHOES = [
  {
    "name": "PS PRO",
    "brand": "Kuikma",
    "price": 79.99,
    "scores": [
      8.5,
      7.5,
      8.5,
      8.0,
      7.5,
      8.0,
      7.5,
      8.5
    ],
    "sole": "MIXTE",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "KUIKMA",
    "link": ""
  },
  {
    "name": "PS Stab",
    "brand": "Kuikma",
    "price": 54.99,
    "scores": [
      8.0,
      7.5,
      8.5,
      8.5,
      6.5,
      8.0,
      8.0,
      7.0
    ],
    "sole": "MIXTE",
    "foot": "STANDARD",
    "gender": "MIXTE",
    "scoreBrand": "KUIKMA",
    "link": ""
  },
  {
    "name": "PS Dynamic",
    "brand": "Kuikma",
    "price": 64.99,
    "scores": [
      8.0,
      7.0,
      7.0,
      7.0,
      8.5,
      7.5,
      7.0,
      8.5
    ],
    "sole": "CHEVRONS",
    "foot": "STANDARD",
    "gender": "MIXTE",
    "scoreBrand": "KUIKMA",
    "link": ""
  },
  {
    "name": "PS Team",
    "brand": "Kuikma",
    "price": 44.99,
    "scores": [
      7.5,
      6.5,
      7.0,
      7.0,
      7.0,
      7.0,
      7.5,
      6.5
    ],
    "sole": "CHEVRONS",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "KUIKMA",
    "link": ""
  },
  {
    "name": "PS Comfort",
    "brand": "Kuikma",
    "price": 44.99,
    "scores": [
      7.0,
      7.5,
      6.5,
      6.5,
      6.5,
      8.0,
      7.0,
      6.0
    ],
    "sole": "CHEVRONS",
    "foot": "LARGE",
    "gender": "FEMME",
    "scoreBrand": "KUIKMA",
    "link": ""
  },
  {
    "name": "PS 990 Dyn",
    "brand": "Kuikma",
    "price": 39.99,
    "scores": [
      7.5,
      6.5,
      6.5,
      6.5,
      8.0,
      7.0,
      6.5,
      7.5
    ],
    "sole": "CHEVRONS",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "KUIKMA",
    "link": ""
  },
  {
    "name": "PS 500",
    "brand": "Kuikma",
    "price": 34.99,
    "scores": [
      7.0,
      7.0,
      6.0,
      6.0,
      6.0,
      7.5,
      6.5,
      5.5
    ],
    "sole": "CHEVRONS",
    "foot": "LARGE",
    "gender": "HOMME",
    "scoreBrand": "KUIKMA",
    "link": ""
  },
  {
    "name": "Comfort Lite",
    "brand": "Kuikma",
    "price": 29.99,
    "scores": [
      6.0,
      6.0,
      6.0,
      6.0,
      6.5,
      6.5,
      6.0,
      5.5
    ],
    "sole": "OMNI",
    "foot": "STANDARD",
    "gender": "MIXTE",
    "scoreBrand": "KUIKMA",
    "link": ""
  },
  {
    "name": "Gel-Dedicate 8 Padel",
    "brand": "ASICS",
    "price": 44.99,
    "scores": [
      7.5,
      7.0,
      7.5,
      7.5,
      6.5,
      7.5,
      8.0,
      6.5
    ],
    "sole": "CHEVRONS",
    "foot": "STANDARD",
    "gender": "MIXTE",
    "scoreBrand": "ASICS",
    "link": ""
  },
  {
    "name": "Gel-Dedicate 9",
    "brand": "ASICS",
    "price": 74.99,
    "scores": [
      7.5,
      7.0,
      8.0,
      7.5,
      6.5,
      7.5,
      8.0,
      6.5
    ],
    "sole": "CHEVRONS",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "ASICS",
    "link": ""
  },
  {
    "name": "Game FF",
    "brand": "ASICS",
    "price": 49.99,
    "scores": [
      7.5,
      7.0,
      7.0,
      7.0,
      7.5,
      7.5,
      7.0,
      7.5
    ],
    "sole": "CHEVRONS",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "ASICS",
    "link": ""
  },
  {
    "name": "Solution Swift FF Padel",
    "brand": "ASICS",
    "price": 90.95,
    "scores": [
      8.0,
      7.0,
      7.5,
      7.5,
      8.5,
      7.5,
      7.0,
      8.5
    ],
    "sole": "CHEVRONS",
    "foot": "STANDARD",
    "gender": "MIXTE",
    "scoreBrand": "ASICS",
    "link": ""
  },
  {
    "name": "Gel-Challenger 15 Padel",
    "brand": "ASICS",
    "price": 107.95,
    "scores": [
      8.5,
      8.0,
      8.5,
      8.5,
      6.5,
      8.5,
      9.0,
      7.0
    ],
    "sole": "CHEVRONS",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "ASICS",
    "link": ""
  },
  {
    "name": "Sonicsmash FF",
    "brand": "ASICS",
    "price": 109.99,
    "scores": [
      8.0,
      7.5,
      7.5,
      7.5,
      8.5,
      7.5,
      7.0,
      9.0
    ],
    "sole": "CHEVRONS",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "ASICS",
    "link": ""
  },
  {
    "name": "Movea",
    "brand": "Babolat",
    "price": 63,
    "scores": [
      8.0,
      7.5,
      8.0,
      8.0,
      6.5,
      8.0,
      8.5,
      6.5
    ],
    "sole": "MIXTE",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "BABOLAT",
    "link": ""
  },
  {
    "name": "Sensa 25",
    "brand": "Babolat",
    "price": 79.99,
    "scores": [
      8.0,
      7.5,
      7.0,
      7.0,
      8.0,
      8.0,
      7.5,
      7.5
    ],
    "sole": "MIXTE",
    "foot": "STANDARD",
    "gender": "FEMME",
    "scoreBrand": "BABOLAT",
    "link": ""
  },
  {
    "name": "Jet Viva",
    "brand": "Babolat",
    "price": 109,
    "scores": [
      8.0,
      7.0,
      7.0,
      7.5,
      8.5,
      7.5,
      7.5,
      8.0
    ],
    "sole": "MIXTE",
    "foot": "ETROIT",
    "gender": "HOMME",
    "scoreBrand": "BABOLAT",
    "link": ""
  },
  {
    "name": "Premura 3 Juan Lebron",
    "brand": "Babolat",
    "price": 114.95,
    "scores": [
      8.5,
      7.5,
      8.0,
      8.0,
      8.5,
      8.0,
      8.0,
      9.0
    ],
    "sole": "MIXTE",
    "foot": "ETROIT",
    "gender": "MIXTE",
    "scoreBrand": "BABOLAT",
    "link": ""
  },
  {
    "name": "Bogun 25",
    "brand": "Bullpadel",
    "price": 39.99,
    "scores": [
      7.0,
      6.5,
      6.5,
      6.5,
      7.0,
      6.5,
      6.5,
      6.0
    ],
    "sole": "CHEVRONS",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "BULLPADEL",
    "link": ""
  },
  {
    "name": "Binux",
    "brand": "Bullpadel",
    "price": 49.99,
    "scores": [
      7.5,
      6.5,
      7.0,
      7.0,
      7.0,
      7.0,
      7.0,
      6.5
    ],
    "sole": "CHEVRONS",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "BULLPADEL",
    "link": ""
  },
  {
    "name": "Neuron 26V",
    "brand": "Bullpadel",
    "price": 139.99,
    "scores": [
      8.5,
      8.0,
      8.5,
      8.5,
      8.0,
      8.0,
      8.0,
      9.0
    ],
    "sole": "MIXTE",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "BULLPADEL",
    "link": ""
  },
  {
    "name": "Vertex Vibram 26",
    "brand": "Bullpadel",
    "price": 174.99,
    "scores": [
      9.0,
      8.0,
      8.5,
      8.5,
      7.0,
      8.0,
      9.5,
      8.0
    ],
    "sole": "MIXTE",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "BULLPADEL",
    "link": ""
  },
  {
    "name": "Crazyquick LS Padel",
    "brand": "adidas",
    "price": 95.99,
    "scores": [
      8.0,
      7.0,
      7.0,
      7.5,
      8.5,
      7.5,
      7.0,
      9.0
    ],
    "sole": "MIXTE",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "ADIDAS",
    "link": ""
  },
  {
    "name": "Barricade 13",
    "brand": "adidas",
    "price": 160,
    "scores": [
      8.0,
      7.0,
      9.0,
      9.0,
      5.5,
      7.5,
      9.0,
      7.0
    ],
    "sole": "A CONFIRMER",
    "foot": "STANDARD",
    "gender": "MIXTE",
    "scoreBrand": "ADIDAS",
    "link": ""
  },
  {
    "name": "Motion Team",
    "brand": "HEAD",
    "price": 59.99,
    "scores": [
      7.5,
      7.0,
      7.0,
      7.0,
      7.0,
      7.5,
      7.5,
      6.5
    ],
    "sole": "MIXTE",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "HEAD",
    "link": ""
  },
  {
    "name": "Sprint Evo 4.0",
    "brand": "HEAD",
    "price": 111.15,
    "scores": [
      7.5,
      7.5,
      8.0,
      7.5,
      8.5,
      8.5,
      7.5,
      8.0
    ],
    "sole": "OMNI",
    "foot": "LARGE",
    "gender": "FEMME",
    "scoreBrand": "HEAD",
    "link": ""
  },
  {
    "name": "Hurakn Pro V2",
    "brand": "Wilson",
    "price": 85.95,
    "scores": [
      8.0,
      7.5,
      7.5,
      8.0,
      7.5,
      8.0,
      7.5,
      7.5
    ],
    "sole": "MIXTE",
    "foot": "STANDARD",
    "gender": "MIXTE",
    "scoreBrand": "WILSON",
    "link": ""
  },
  {
    "name": "Bela Tour",
    "brand": "Wilson",
    "price": 109.99,
    "scores": [
      8.5,
      7.5,
      9.0,
      9.0,
      7.0,
      7.5,
      8.5,
      7.5
    ],
    "sole": "CHEVRONS",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "WILSON",
    "link": ""
  },
  {
    "name": "Slam Pro",
    "brand": "Joma",
    "price": 104.99,
    "scores": [
      8.0,
      8.0,
      8.0,
      8.0,
      7.0,
      8.0,
      8.0,
      7.5
    ],
    "sole": "MIXTE",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "JOMA",
    "link": ""
  },
  {
    "name": "Nerbo",
    "brand": "NOX",
    "price": 70,
    "scores": [
      8.0,
      7.0,
      8.0,
      8.0,
      7.0,
      7.5,
      8.0,
      7.0
    ],
    "sole": "MIXTE",
    "foot": "STANDARD",
    "gender": "MIXTE",
    "scoreBrand": "NOX",
    "link": ""
  }
];

/* Ajustements du poids des critères (même ordre que CRITERIA), ajoutés à 1 puis multipliés par les priorités. */
const STYLE_MODS = {
  "ATTAQUANT": [0.15, 0, 0.05, 0.05, 0.15, 0, 0, 0.15],
  "DEFENSEUR": [0.1, 0.15, 0.15, 0.1, 0, 0.05, 0.1, 0],
  "POLYVALENT": [0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05],
  "INCONNU": [0, 0, 0, 0, 0, 0, 0, 0]
};

const LEVEL_MODS = {
  "DEBUTANT": [0, 0.1, 0.1, 0.05, 0, 0.15, 0, -0.05],
  "LOISIR": [0.05, 0.05, 0.05, 0.05, 0, 0.05, 0.05, 0],
  "COMPETITION": [0.1, 0, 0.05, 0.1, 0.05, 0, 0.05, 0.15]
};

/* Plus on joue souvent, plus la durabilité compte. */
const FREQUENCY_MODS = {
  "1": [0, 0, 0, 0, 0, 0, 0, 0],
  "2-3": [0, 0, 0, 0, 0, 0, 0.2, 0],
  "4+": [0, 0.05, 0, 0, 0, 0, 0.4, 0]
};
