const CRITERIA = [
  "TRACTION",
  "AMORTI",
  "REACTIVITE",
  "STABILITE",
  "MAINTIEN",
  "LEGERETE",
  "CONFORT",
  "DURABILITE"
];

const SHOES = [
  {
    "name": "G.T. Cut Academy 2",
    "brand": "Nike",
    "price": 99.99,
    "scores": [
      8.5,
      7.5,
      8.5,
      8.0,
      7.5,
      8.5,
      8.0,
      7.5
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "ETROIT",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/chaussure-basket/60321-nike-gt-cut-academy-2-purple-dinasty-hv9774-104.html"
  },
  {
    "name": "Giannis Immortality 5",
    "brand": "Nike",
    "price": 89.99,
    "scores": [
      8.5,
      7.5,
      8.5,
      8.0,
      8.0,
      8.5,
      8.0,
      7.5
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "STANDARD",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/2790-chaussures-nike-giannis-immortality-5"
  },
  {
    "name": "LeBron Witness 9",
    "brand": "Nike",
    "price": 109.99,
    "scores": [
      8.5,
      8.0,
      8.0,
      9.0,
      9.0,
      6.5,
      8.5,
      9.0
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "UNIVERSEL",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/nouveautes/59685-nike-lebron-witness-9-bronny-james-pe-io7381-600.html"
  },
  {
    "name": "Ja 3",
    "brand": "Nike",
    "price": 134.99,
    "scores": [
      9.5,
      8.5,
      9.0,
      8.5,
      7.5,
      8.5,
      8.0,
      5.5
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "STANDARD",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/1569-chaussures-nike-ja-3"
  },
  {
    "name": "Sabrina 3",
    "brand": "Nike",
    "price": 129.99,
    "scores": [
      8.5,
      7.0,
      9.5,
      9.5,
      9.0,
      9.5,
      8.0,
      6.5
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "STANDARD",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/1653-chaussures-nike-sabrina-3"
  },
  {
    "name": "Luka 5",
    "brand": "Jordan",
    "price": 129.99,
    "scores": [
      8.5,
      8.5,
      8.5,
      9.0,
      9.0,
      7.5,
      8.5,
      8.0
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "STANDARD",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/1458-chaussures-jordan-luka-5"
  },
  {
    "name": "Tatum 4",
    "brand": "Jordan",
    "price": 129.99,
    "scores": [
      7.5,
      8.5,
      8.5,
      8.0,
      8.5,
      7.5,
      8.5,
      7.0
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "STANDARD",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/412-jayson-tatum"
  },
  {
    "name": "KD19",
    "brand": "Nike",
    "price": 159.99,
    "scores": [
      9.0,
      9.0,
      9.0,
      8.5,
      9.0,
      6.5,
      8.5,
      8.0
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "ETROIT",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/1233-chaussures-basketball-kevin-durant"
  },
  {
    "name": "Kobe IX Elite Low Protro",
    "brand": "Nike",
    "price": 209.99,
    "scores": [
      9.5,
      8.5,
      9.0,
      9.0,
      9.0,
      8.5,
      8.5,
      6.5
    ],
    "surface": "INDOOR",
    "foot": "ETROIT",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/122-kobe-bryant"
  },
  {
    "name": "Book 2",
    "brand": "Nike",
    "price": 149.99,
    "scores": [
      7.5,
      8.0,
      7.5,
      8.5,
      8.5,
      6.0,
      7.0,
      8.0
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "STANDARD",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/chaussure-basket/59325-nike-book-2-the-phoenix-ib6687-700.html"
  },
  {
    "name": "Harden Volume 10",
    "brand": "adidas",
    "price": 160,
    "scores": [
      8.5,
      9.0,
      8.0,
      9.5,
      9.5,
      6.5,
      8.5,
      8.5
    ],
    "surface": "INDOOR",
    "foot": "ETROIT",
    "scoreBrand": "ADIDAS",
    "link": "https://www.awin1.com/cread.php?awinmid=65154&awinaffid=3058285&ued=https%3A%2F%2Fbasket-center.fr%2Fki1605-chaussures-de-basketball-adidas-harden-volume-10-turfla-noiess-turfla"
  },
  {
    "name": "D.O.N. Issue 8",
    "brand": "adidas",
    "price": 120,
    "scores": [
      9.5,
      9.0,
      9.5,
      9.0,
      9.0,
      8.5,
      9.0,
      8.0
    ],
    "surface": "INDOOR",
    "foot": "STANDARD",
    "scoreBrand": "ADIDAS",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480618163004132934585230&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-basketball-adulte-d-o-n-issue-8-bleu-violet-et-rouge%2F386596%2Fm9034125",
    "decathlonPrice": 119.99,
    "decathlonRegularPrice": 119.99,
    "decathlonSku": "386596",
    "decathlonImage": "https://contents.mediadecathlon.com/p3182856/k$e5cc9b66bc5879618859c3755b5af10f/picture.jpg"
  },
  {
    "name": "Anthony Edwards 2",
    "brand": "adidas",
    "price": 130,
    "scores": [
      9.0,
      8.5,
      9.0,
      9.0,
      9.0,
      8.0,
      8.5,
      6.5
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "STANDARD",
    "scoreBrand": "ADIDAS",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448067708749017818793452&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-basketball-adulte-anthony-edwards-ae2-rose-corail%2F386555%2Fm9030183",
    "decathlonPrice": 129.99,
    "decathlonRegularPrice": 129.99,
    "decathlonSku": "386555",
    "decathlonImage": "https://contents.mediadecathlon.com/p3204855/k$e5dfd6493e5cb4229d00d4dd2e2e9f4f/picture.jpg"
  },
  {
    "name": "Dame X",
    "brand": "adidas",
    "price": 90,
    "scores": [
      8.5,
      7.5,
      8.0,
      8.0,
      8.0,
      8.5,
      8.0,
      6.5
    ],
    "surface": "INDOOR",
    "foot": "LARGE",
    "scoreBrand": "ADIDAS",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480610678257887425776277&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-basketball-adulte-adidas-dame-x-gris%2F373766%2Fm8998618",
    "decathlonPrice": 49.99,
    "decathlonRegularPrice": 49.99,
    "decathlonSku": "373766",
    "decathlonImage": "https://contents.mediadecathlon.com/p3100437/k$2d5f46deebe9c6ae455e7e637dc30a96/picture.jpg"
  },
  {
    "name": "Curry 13",
    "brand": "Under Armour",
    "price": 140,
    "scores": [
      8.5,
      9.0,
      9.0,
      8.5,
      8.5,
      9.0,
      9.0,
      6.5
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "ETROIT",
    "scoreBrand": "UNDER ARMOUR",
    "link": "https://www.awin1.com/cread.php?awinmid=65154&awinaffid=3058285&ued=https%3A%2F%2Fbasket-center.fr%2F6007670-790-chaussures-de-basketball-under-armour-curry-13-taxi-taxi-taxi"
  },
  {
    "name": "D. Fox 2",
    "brand": "Under Armour",
    "price": 120,
    "scores": [
      8.5,
      8.0,
      9.0,
      8.5,
      8.5,
      9.0,
      8.5,
      7.5
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "STANDARD",
    "scoreBrand": "UNDER ARMOUR",
    "link": "https://www.basket4ballers.com/fr/1203-chaussures-basketball-de-aaron-fox"
  },
  {
    "name": "All-Pro Nitro 2",
    "brand": "Puma",
    "price": 130,
    "scores": [
      8.5,
      8.5,
      7.5,
      9.0,
      8.5,
      8.0,
      8.5,
      9.0
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "UNIVERSEL",
    "scoreBrand": "PUMA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448064029210942586065056&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussure-de-basketball-adulte-puma-all-pro-nitro-2-white-sunblaze%2F362929%2Fc4c28m8998760",
    "decathlonPrice": 59.99,
    "decathlonRegularPrice": 59.99,
    "decathlonSku": "362929",
    "decathlonImage": "https://contents.mediadecathlon.com/p3033160/k$1a1f9efe3d052d1d710c9504721e5b7f/picture.jpg"
  },
  {
    "name": "TWO WXY V5",
    "brand": "New Balance",
    "price": 130,
    "scores": [
      9.0,
      8.5,
      8.5,
      9.5,
      9.0,
      7.5,
      9.0,
      8.5
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "LARGE",
    "scoreBrand": "NEW BALANCE",
    "link": "https://www.shinzo.paris/fr/chaussures-basketball/37634-new-balance-two-wxy-v5-bb2wycg5.html"
  },
  {
    "name": "Fresh Foam BB V3",
    "brand": "New Balance",
    "price": 140,
    "scores": [
      9.0,
      9.5,
      7.5,
      8.5,
      9.0,
      7.0,
      9.5,
      7.0
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "ETROIT",
    "scoreBrand": "NEW BALANCE",
    "link": "https://www.newbalance.fr/fr/pd/fresh-foam-bb-v3/BBFRSV3-49565.html"
  },
  {
    "name": "Giannis Freak 7",
    "brand": "Nike",
    "price": 114.99,
    "scores": [
      8.5,
      8.5,
      8.5,
      8.5,
      8.5,
      8.0,
      8.5,
      8.0
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "ETROIT",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/basketball/59637-nike-giannis-freak-7-laser-orange-hf3450-007.html"
  },
  {
    "name": "Way of Wade 12",
    "brand": "LI-NING",
    "price": 180,
    "scores": [
      9.0,
      9.5,
      9.0,
      9.0,
      9.0,
      9.0,
      8.5,
      7.5
    ],
    "surface": "INDOOR",
    "foot": "ETROIT",
    "scoreBrand": "LI-NING",
    "link": "https://wayofwade.com/collections/way-of-wade-12"
  },
  {
    "name": "Way of Wade All City 14",
    "brand": "LI-NING",
    "price": 135,
    "scores": [
      9.5,
      9.0,
      8.5,
      9.0,
      9.0,
      9.0,
      8.5,
      9.0
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "ETROIT",
    "scoreBrand": "LI-NING",
    "link": "https://www.wayofwade.com/en-eu/collections/wade-all-city-14"
  },
  {
    "name": "Wade 808 5 Ultra",
    "brand": "LI-NING",
    "price": 145,
    "scores": [
      9.5,
      9.5,
      9.5,
      8.5,
      8.5,
      9.0,
      8.5,
      7.5
    ],
    "surface": "INDOOR",
    "foot": "ETROIT",
    "scoreBrand": "LI-NING",
    "link": "https://www.wayofwade.com/en-eu/collections/wade-808-5-ultra?filter.v.availability=1"
  },
  {
    "name": "Nike G.T. Future",
    "brand": "Nike",
    "price": 199.99,
    "scores": [
      8.0,
      9.5,
      7.5,
      7.0,
      7.0,
      5.5,
      6.5,
      8.0
    ],
    "surface": "INDOOR",
    "foot": "ETROIT",
    "scoreBrand": "NIKE",
    "link": "https://www.nike.com/fr/t/chaussures-de-basket-ball-nike-gt-future-Wi2B6Qgq"
  },
  {
    "name": "MB.05",
    "brand": "PUMA",
    "price": 130,
    "scores": [
      8.5,
      8.5,
      8.0,
      8.0,
      8.0,
      7.0,
      8.5,
      7.0
    ],
    "surface": "INDOOR",
    "foot": "STANDARD",
    "scoreBrand": "PUMA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448062860480963943302379&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-basketball-adulte-lamelo-ball-mb05-low-violet-lavande%2F386580%2Fm9027164",
    "decathlonPrice": 114.99,
    "decathlonRegularPrice": 114.99,
    "decathlonSku": "386580",
    "decathlonImage": "https://contents.mediadecathlon.com/p3181630/k$adbc94c20646a6a351ea06a9db775a07/picture.jpg"
  },
  {
    "name": "All-Pro Nitro 3",
    "brand": "PUMA",
    "price": 140,
    "scores": [
      9.0,
      8.5,
      8.5,
      9.0,
      8.5,
      8.5,
      8.5,
      8.0
    ],
    "surface": "INDOOR",
    "foot": "STANDARD",
    "scoreBrand": "PUMA",
    "link": ""
  },
  {
    "name": "Nova Surge 4",
    "brand": "Asics",
    "price": 180,
    "scores": [
      9.0,
      9.5,
      8.5,
      9.5,
      9.0,
      7.5,
      9.5,
      9.0
    ],
    "surface": "INDOOR",
    "foot": "STANDARD",
    "scoreBrand": "ASICS",
    "link": ""
  },
  {
    "name": "Gelburst 30",
    "brand": "Asics",
    "price": 160,
    "scores": [
      9.0,
      7.5,
      9.0,
      9.0,
      9.0,
      8.5,
      8.0,
      8.5
    ],
    "surface": "INDOOR",
    "foot": "STANDARD",
    "scoreBrand": "ASICS",
    "link": ""
  },
  {
    "name": "ANTA KAI 3",
    "brand": "ANTA",
    "price": 139.95,
    "scores": [
      9.0,
      8.0,
      9.0,
      9.0,
      9.5,
      8.5,
      9.0,
      7.5
    ],
    "surface": "INDOOR",
    "foot": "STANDARD",
    "scoreBrand": "ANTA",
    "link": "https://eu.anta.com/fr/collections/anta-kai-3"
  },
  {
    "name": "Shock Wave 7 Pro",
    "brand": "ANTA",
    "price": 130,
    "scores": [
      9.0,
      8.5,
      9.0,
      9.0,
      9.0,
      8.5,
      8.0,
      9.0
    ],
    "surface": "INDOOR/OUTDOOR",
    "foot": "LARGE",
    "scoreBrand": "ANTA",
    "link": "https://anta-sports.eu/shop/anta-shock-wave-7-pro-927"
  }
];

const STYLE_MODS = {
  "RAPIDE": [0.15, 0, 0.15, 0.05, 0.05, 0.15, 0, 0],
  "PUISSANT": [0.05, 0.15, 0, 0.15, 0.15, -0.05, 0.05, 0.05],
  "EXPLOSIF": [0.1, 0.05, 0.15, 0.1, 0.05, 0.1, 0, 0],
  "POLYVALENT": [0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05],
  "SHOOTEUR": [0.1, 0, 0.1, 0.1, 0.05, 0.05, 0.05, 0],
  "DEFENSEUR": [0.15, 0.05, 0.1, 0.15, 0.1, 0.05, 0, 0]
};
