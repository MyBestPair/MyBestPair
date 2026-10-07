/* Base Rugby MyBestPair — 30 modèles récents validés par Romain le 7 octobre 2026.
 * Notes sur 10, dans l'ordre de CRITERIA. Toutes les notes sont des estimations MyBestPair
 * établies à partir des fiches fabricants et des tests publiés (voir methodologie.html).
 * studs : FER (vissés) / MOULES / HYBRIDE · foot : ETROIT / STANDARD / LARGE · public : ADULTE / FEMME / ENFANT
 * link : lien marchand Decathlon (Rakuten), vide = « Lien bientôt disponible ».
 * Prix : catalogue Rakuten Decathlon (export du 7 octobre 2026, hors promotion) ; priceIndicative = prix public constaté, sans marchand.
 */
const CRITERIA = [
  "ACCROCHE",
  "STABILITE",
  "MAINTIEN",
  "PROTECTION",
  "LEGERETE",
  "DYNAMISME",
  "CONFORT",
  "DURABILITE"
];

const SHOES = [
  {
    "name": "Impact R500 SG8",
    "brand": "Offload",
    "price": 49.99,
    "scores": [
      8.5,
      8.5,
      8.5,
      8.5,
      5.5,
      5.5,
      8.0,
      8.0
    ],
    "studs": "FER",
    "foot": "LARGE",
    "public": "ADULTE",
    "scoreBrand": "OFFLOAD",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480616493656033516091586&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fcrampons-rugby-adulte-impact-r500-sg8-noir%2F362167%2Fc382m8933378",
    "photo": "https://contents.mediadecathlon.com/p2878814/k$939e8ecddfc794cdf8ec27fdd48dff1f/picture.jpg"
  },
  {
    "name": "Advance R500 SG",
    "brand": "Offload",
    "price": 49.99,
    "scores": [
      8.0,
      8.0,
      8.0,
      7.5,
      7.0,
      7.0,
      7.5,
      7.5
    ],
    "studs": "HYBRIDE",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "OFFLOAD",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448063929930118908167885&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fcrampons-rugby-hybrides-adulte-advance-r500-sg-noir%2F338943%2Fc382m8737282",
    "photo": "https://contents.mediadecathlon.com/p2504171/k$03bfff9155de64701964f20ed6140b16/picture.jpg"
  },
  {
    "name": "Advance R500 FG",
    "brand": "Offload",
    "price": 39.99,
    "scores": [
      7.5,
      7.5,
      7.5,
      7.0,
      7.0,
      7.0,
      7.5,
      7.5
    ],
    "studs": "MOULES",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "OFFLOAD",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448067540292089809545231&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fcrampons-rugby-adulte-advance-r500-fg-noir%2F347138%2Fc382c183c414m8803788",
    "photo": "https://contents.mediadecathlon.com/p2574401/k$4e46bceb32b880554ae2ef2af870f6b6/picture.jpg"
  },
  {
    "name": "Score R500 FG",
    "brand": "Offload",
    "price": 49.99,
    "scores": [
      7.5,
      7.0,
      7.0,
      6.0,
      8.5,
      8.0,
      7.5,
      7.0
    ],
    "studs": "MOULES",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "OFFLOAD",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480614052487974463292069&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fcrampons-rugby-moulees-adulte-score-r500-fg-bleu-noir%2F341129%2Fc59c382m8757916",
    "photo": "https://contents.mediadecathlon.com/p2635293/k$8e2490b338fd8176d5b1cf1a8f9ea1ba/picture.jpg"
  },
  {
    "name": "Kakari SG",
    "brand": "adidas",
    "price": 89.99,
    "scores": [
      8.5,
      8.5,
      8.0,
      8.0,
      6.0,
      6.0,
      7.5,
      8.0
    ],
    "studs": "FER",
    "foot": "LARGE",
    "public": "ADULTE",
    "scoreBrand": "ADIDAS",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448062272152388770656329&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fcrampons-de-rugby-visses-adulte-kakari-sg-bleu-marine%2F358012%2Fc195m9029997",
    "photo": "https://contents.mediadecathlon.com/p3161428/k$61111cc4f8a5aab679d727ca91df98ca/picture.jpg"
  },
  {
    "name": "RS15 FG",
    "brand": "adidas",
    "price": 89.99,
    "scores": [
      8.0,
      7.5,
      7.5,
      6.5,
      8.5,
      8.5,
      8.0,
      7.5
    ],
    "studs": "MOULES",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "ADIDAS",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480613244336284637932353&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-rugby-adulte-rs15-fg-bleu-et-bleu-ciel%2F386637%2Fm9030242",
    "photo": "https://contents.mediadecathlon.com/p3156071/k$02ba689b519e7d089ad0f2a1001ee23b/picture.jpg"
  },
  {
    "name": "RS15 SG Hybride",
    "brand": "adidas",
    "price": 84.99,
    "scores": [
      8.5,
      7.5,
      7.5,
      6.5,
      8.5,
      8.5,
      8.0,
      7.5
    ],
    "studs": "HYBRIDE",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "ADIDAS",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480618475367278530129&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fcrampons-hybrides-de-rugby-adulte-adidas-rs15-sg-hybride-noir-et-blanc%2F357967%2Fc1m8966720",
    "photo": "https://contents.mediadecathlon.com/p2926954/k$c1ce536ca015bd0b0990005111a00c9f/picture.jpg"
  },
  {
    "name": "RS15 Elite SG Hybride",
    "brand": "adidas",
    "price": 129.99,
    "scores": [
      8.5,
      8.0,
      8.0,
      7.0,
      9.0,
      9.0,
      8.5,
      7.5
    ],
    "studs": "HYBRIDE",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "ADIDAS",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448067234179248475457243&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fcrampons-hybrides-de-rugby-adulte-rs15-elite-sg-hybride-rose-jaune%2F358061%2Fc24c22m9030010",
    "photo": "https://contents.mediadecathlon.com/p3184378/k$f46d1f2f3439e602e7f7b7e96dff172a/picture.jpg"
  },
  {
    "name": "Monarcida Neo III",
    "brand": "Mizuno",
    "price": 84.99,
    "scores": [
      8.0,
      7.5,
      7.5,
      7.0,
      7.5,
      7.0,
      8.5,
      7.5
    ],
    "studs": "HYBRIDE",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "MIZUNO",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448065742436976717311313&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fcrampons-de-rugby-adulte-monarcida-neo-iii-noir-et-rouge%2F373707%2Fc1c14m9030250",
    "photo": "https://contents.mediadecathlon.com/p3175340/k$21272c44824c71284d9e6fdc37b6a246/picture.jpg"
  },
  {
    "name": "R500 Enfant FG",
    "brand": "Offload",
    "price": 29.99,
    "scores": [
      7.0,
      7.0,
      7.0,
      6.5,
      7.5,
      7.0,
      7.5,
      7.0
    ],
    "studs": "MOULES",
    "foot": "STANDARD",
    "public": "ENFANT",
    "scoreBrand": "OFFLOAD",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448061905530887214886739&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-rugby-moulees-terrain-sec-r500-enfant-rouge%2F308466%2Fc221c66c239m8774039",
    "photo": "https://contents.mediadecathlon.com/p2383999/k$e1bfa7b99bd80d5c872e4b58e9504107/picture.jpg"
  },
  {
    "name": "Skill R500 Junior SG",
    "brand": "Offload",
    "price": 34.99,
    "scores": [
      7.5,
      7.5,
      7.0,
      7.0,
      7.0,
      6.5,
      7.0,
      7.5
    ],
    "studs": "FER",
    "foot": "STANDARD",
    "public": "ENFANT",
    "scoreBrand": "OFFLOAD",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.44806819089812362995427&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fcrampons-de-rugby-visses-enfant-skill-r500-junior-sg-noir-motif%2F312699%2Fc381c76c230m8736004",
    "photo": "https://contents.mediadecathlon.com/p2384007/k$66b5c8c0bd41aa444cf86136a651d504/picture.jpg"
  },
  {
    "name": "Monarcida Neo III Select JR",
    "brand": "Mizuno",
    "price": 64.99,
    "scores": [
      7.5,
      7.0,
      7.0,
      6.5,
      7.5,
      7.0,
      8.0,
      7.0
    ],
    "studs": "MOULES",
    "foot": "STANDARD",
    "public": "ENFANT",
    "scoreBrand": "MIZUNO",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480611867596825236753881&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-rugby-enfant-monarcida-neo-3-select-jr-fg-noir-et-rouge%2F386653%2Fm9030253",
    "photo": "https://contents.mediadecathlon.com/p3177961/k$32a0c105eea370397ad57eea8b003bb5/picture.jpg"
  },
  {
    "name": "Stampede Pro SG",
    "brand": "Canterbury",
    "price": 180,
    "scores": [
      9.0,
      9.0,
      8.5,
      8.5,
      6.0,
      6.0,
      8.0,
      8.5
    ],
    "studs": "FER",
    "foot": "LARGE",
    "public": "ADULTE",
    "scoreBrand": "CANTERBURY",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Phoenix Genesis Pro SG",
    "brand": "Canterbury",
    "price": 160,
    "scores": [
      8.5,
      8.5,
      8.5,
      7.5,
      7.5,
      8.0,
      8.0,
      8.0
    ],
    "studs": "HYBRIDE",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "CANTERBURY",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Phoenix Genesis Team FG",
    "brand": "Canterbury",
    "price": 90,
    "scores": [
      7.5,
      8.0,
      7.5,
      7.0,
      7.5,
      7.5,
      7.5,
      7.5
    ],
    "studs": "MOULES",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "CANTERBURY",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Speed Falcon 2.0 SG",
    "brand": "Canterbury",
    "price": 180,
    "scores": [
      8.5,
      7.5,
      7.5,
      6.0,
      9.0,
      9.0,
      8.0,
      7.5
    ],
    "studs": "FER",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "CANTERBURY",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Speed Junior Pro",
    "brand": "Canterbury",
    "price": 80,
    "scores": [
      8.0,
      7.0,
      7.5,
      6.5,
      8.5,
      8.0,
      8.0,
      7.0
    ],
    "studs": "FER",
    "foot": "STANDARD",
    "public": "ENFANT",
    "scoreBrand": "CANTERBURY",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Kakari Elite SG",
    "brand": "adidas",
    "price": 150,
    "scores": [
      9.0,
      9.0,
      8.5,
      8.5,
      6.5,
      6.5,
      8.0,
      8.5
    ],
    "studs": "FER",
    "foot": "LARGE",
    "public": "ADULTE",
    "scoreBrand": "ADIDAS",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Kakari RS SG",
    "brand": "adidas",
    "price": 220,
    "scores": [
      9.0,
      8.5,
      8.5,
      8.0,
      7.5,
      7.5,
      8.5,
      8.0
    ],
    "studs": "FER",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "ADIDAS",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Adizero RS15 Pro SG",
    "brand": "adidas",
    "price": 220,
    "scores": [
      9.0,
      8.0,
      8.0,
      6.5,
      9.5,
      9.5,
      8.5,
      7.5
    ],
    "studs": "HYBRIDE",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "ADIDAS",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Morelia Neo IV Elite SG",
    "brand": "Mizuno",
    "price": 220,
    "scores": [
      9.0,
      8.0,
      8.5,
      7.5,
      8.5,
      8.5,
      9.0,
      8.5
    ],
    "studs": "FER",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "MIZUNO",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Waitangi II CL",
    "brand": "Mizuno",
    "price": 110,
    "scores": [
      8.5,
      8.5,
      8.0,
      8.0,
      6.5,
      6.5,
      8.5,
      8.5
    ],
    "studs": "FER",
    "foot": "LARGE",
    "public": "ADULTE",
    "scoreBrand": "MIZUNO",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Sidestep Icon 8S",
    "brand": "Gilbert",
    "price": 150,
    "scores": [
      8.5,
      8.5,
      8.0,
      8.0,
      6.5,
      6.5,
      7.5,
      8.0
    ],
    "studs": "FER",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "GILBERT",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Speedster 6S",
    "brand": "Gilbert",
    "price": 120,
    "scores": [
      8.0,
      7.0,
      7.0,
      6.0,
      8.5,
      8.5,
      7.5,
      7.0
    ],
    "studs": "FER",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "GILBERT",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "RS15 Avaglide",
    "brand": "adidas",
    "price": 170,
    "scores": [
      8.5,
      7.5,
      8.0,
      6.5,
      9.0,
      9.0,
      9.0,
      7.5
    ],
    "studs": "HYBRIDE",
    "foot": "STANDARD",
    "public": "FEMME",
    "scoreBrand": "ADIDAS",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Kakari W SG",
    "brand": "adidas",
    "price": 120,
    "scores": [
      8.5,
      8.5,
      8.0,
      8.0,
      6.5,
      6.5,
      8.0,
      8.0
    ],
    "studs": "FER",
    "foot": "STANDARD",
    "public": "FEMME",
    "scoreBrand": "ADIDAS",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Stampede Groundbreak Team SG",
    "brand": "Canterbury",
    "price": 95,
    "scores": [
      8.5,
      8.5,
      8.0,
      8.0,
      6.0,
      5.5,
      7.5,
      8.5
    ],
    "studs": "FER",
    "foot": "LARGE",
    "public": "ADULTE",
    "scoreBrand": "CANTERBURY",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Speed Falcon 2.0 Team SG",
    "brand": "Canterbury",
    "price": 95,
    "scores": [
      8.0,
      7.0,
      7.0,
      6.0,
      8.5,
      8.5,
      7.5,
      7.0
    ],
    "studs": "FER",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "CANTERBURY",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "PWR X 8S V2 SG",
    "brand": "Gilbert",
    "price": 110,
    "scores": [
      8.5,
      8.5,
      8.0,
      8.0,
      7.0,
      6.5,
      8.0,
      8.0
    ],
    "studs": "FER",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "GILBERT",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Morelia Neo IV Pro SG",
    "brand": "Mizuno",
    "price": 140,
    "scores": [
      8.5,
      7.5,
      8.0,
      7.0,
      8.5,
      8.5,
      8.5,
      8.0
    ],
    "studs": "HYBRIDE",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "MIZUNO",
    "link": "",
    "priceIndicative": true
  }
];

/* Ajustements du poids des critères (même ordre que CRITERIA), ajoutés à 1 puis multipliés par les priorités.
 * On raisonne par profil : le poste donne la base, le style et le poids la corrigent. */
const POSITION_MODS = {
  "PREMIERE_DEUXIEME": [0.2, 0.3, 0.15, 0.35, -0.3, -0.25, 0, 0.15],
  "TALONNEUR_TROISIEME": [0.15, 0.1, 0.05, 0.05, 0.05, 0.1, 0, 0.05],
  "TROIS_QUARTS": [0.1, -0.05, 0, -0.15, 0.3, 0.3, 0.05, 0]
};

const STYLE_MODS = {
  "IMPACT": [0.05, 0.15, 0.1, 0.15, -0.15, -0.1, 0, 0.05],
  "POLYVALENT": [0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05],
  "VITESSE": [0.05, -0.05, 0, -0.05, 0.15, 0.15, 0, 0]
};

const LEVEL_MODS = {
  "DEBUTANT": [0, 0.05, 0.05, 0.05, 0, 0, 0.15, 0.05],
  "CLUB": [0.05, 0.05, 0.05, 0.05, 0, 0, 0.05, 0.05],
  "COMPETITION": [0.1, 0.05, 0.05, 0, 0.05, 0.1, 0, 0]
};

/* Plus le joueur est lourd, plus la stabilité, la protection et la durabilité comptent. */
function weightMods(kg) {
  if (!Number.isFinite(kg) || kg <= 0) return [0, 0, 0, 0, 0, 0, 0, 0];
  if (kg < 75) return [0, -0.05, 0, -0.05, 0.1, 0.1, 0, 0];
  if (kg < 95) return [0, 0, 0, 0, 0, 0, 0, 0];
  if (kg < 110) return [0.05, 0.1, 0.05, 0.1, -0.05, 0, 0, 0.05];
  return [0.05, 0.2, 0.1, 0.15, -0.1, -0.05, 0, 0.1];
}
