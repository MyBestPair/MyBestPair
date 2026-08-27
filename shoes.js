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
    "scores": [8.5, 7.5, 8.5, 8.0, 7.5, 8.5, 8.0, 7.5],
    "surface": "INDOOR/OUTDOOR",
    "foot": "ETROIT",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/chaussure-basket/60321-nike-gt-cut-academy-2-purple-dinasty-hv9774-104.html"
  },
  {
    "name": "Giannis Immortality 5",
    "brand": "Nike",
    "price": 89.99,
    "scores": [8.5, 7.5, 8.5, 8.0, 8.0, 8.5, 8.0, 7.5],
    "surface": "INDOOR/OUTDOOR",
    "foot": "STANDARD",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/2790-chaussures-nike-giannis-immortality-5"
  },
  {
    "name": "LeBron Witness 9",
    "brand": "Nike",
    "price": 109.99,
    "scores": [8.5, 8.0, 8.0, 9.0, 9.0, 6.5, 8.5, 9.0],
    "surface": "INDOOR/OUTDOOR",
    "foot": "UNIVERSEL",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/nouveautes/59685-nike-lebron-witness-9-bronny-james-pe-io7381-600.html"
  },
  {
    "name": "Ja 3",
    "brand": "Nike",
    "price": 134.99,
    "scores": [9.5, 8.5, 9.0, 8.5, 7.5, 8.5, 8.0, 5.5],
    "surface": "INDOOR/OUTDOOR",
    "foot": "STANDARD",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/1569-chaussures-nike-ja-3"
  },
  {
    "name": "Sabrina 3",
    "brand": "Nike",
    "price": 129.99,
    "scores": [8.5, 7.0, 9.5, 9.5, 9.0, 9.5, 8.0, 6.5],
    "surface": "INDOOR/OUTDOOR",
    "foot": "STANDARD",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/1653-chaussures-nike-sabrina-3"
  },
  {
    "name": "Luka 5",
    "brand": "Jordan",
    "price": 129.99,
    "scores": [8.5, 8.5, 8.5, 9.0, 9.0, 7.5, 8.5, 8.0],
    "surface": "INDOOR/OUTDOOR",
    "foot": "STANDARD",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/1458-chaussures-jordan-luka-5"
  },
  {
    "name": "Tatum 4",
    "brand": "Jordan",
    "price": 129.99,
    "scores": [7.5, 8.5, 8.5, 8.0, 8.5, 7.5, 8.5, 7.0],
    "surface": "INDOOR/OUTDOOR",
    "foot": "STANDARD",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/412-jayson-tatum"
  },
  {
    "name": "KD19",
    "brand": "Nike",
    "price": 159.99,
    "scores": [9.0, 9.0, 9.0, 8.5, 9.0, 6.5, 8.5, 8.0],
    "surface": "INDOOR/OUTDOOR",
    "foot": "ETROIT",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/1233-chaussures-basketball-kevin-durant"
  },
  {
    "name": "Kobe IX Elite Low Protro",
    "brand": "Nike",
    "price": 209.99,
    "scores": [9.5, 8.5, 9.0, 9.0, 9.0, 8.5, 8.5, 6.5],
    "surface": "INDOOR",
    "foot": "ETROIT",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/122-kobe-bryant"
  },
  {
    "name": "Book 2",
    "brand": "Nike",
    "price": 149.99,
    "scores": [7.5, 8.0, 7.5, 8.5, 8.5, 6.0, 7.0, 8.0],
    "surface": "INDOOR/OUTDOOR",
    "foot": "STANDARD",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/chaussure-basket/59325-nike-book-2-the-phoenix-ib6687-700.html"
  },
  {
    "name": "Harden Volume 10",
    "brand": "adidas",
    "price": 160,
    "scores": [8.5, 9.0, 8.0, 9.5, 9.5, 6.5, 8.5, 8.5],
    "surface": "INDOOR",
    "foot": "ETROIT",
    "scoreBrand": "ADIDAS",
    "link": "https://www.basket4ballers.com/fr/nouveautes/59064-adidas-harden-volume-10-pioneer-jr1598.html"
  },
  {
    "name": "D.O.N. Issue 7",
    "brand": "adidas",
    "price": 120,
    "scores": [9.5, 8.0, 8.5, 9.5, 9.0, 7.5, 8.5, 8.5],
    "surface": "INDOOR/OUTDOOR",
    "foot": "LARGE",
    "scoreBrand": "ADIDAS",
    "link": "https://www.basket4ballers.com/fr/1347-chaussures-adidas-don-issue-7"
  },
  {
    "name": "Anthony Edwards 2",
    "brand": "adidas",
    "price": 130,
    "scores": [9.0, 8.5, 9.0, 9.0, 9.0, 8.0, 8.5, 6.5],
    "surface": "INDOOR/OUTDOOR",
    "foot": "STANDARD",
    "scoreBrand": "ADIDAS",
"link": "https://click.linksynergy.com/link?id=wi07X%2fYO2lw&offerid=2079203.448067708749017818793452&type=2&murl=https%3a%2f%2fwww.decathlon.fr%2fp%2fchaussures-de-basketball-adulte-anthony-edwards-ae2-rose-corail%2f386555%2fm9030183"
  },
  {
    "name": "Dame X",
    "brand": "adidas",
    "price": 90,
    "scores": [8.5, 7.5, 8.0, 8.0, 8.0, 8.5, 8.0, 6.5],
    "surface": "INDOOR",
    "foot": "LARGE",
    "scoreBrand": "ADIDAS",
    "link": "https://www.basket4ballers.com/fr/basketball/56822-adidas-dame-10-electric-pink-ki5996.html"
  },
  {
    "name": "Curry 13",
    "brand": "Under Armour",
    "price": 140,
    "scores": [8.5, 9.0, 9.0, 8.5, 8.5, 9.0, 9.0, 6.5],
    "surface": "INDOOR/OUTDOOR",
    "foot": "ETROIT",
    "scoreBrand": "UNDER ARMOUR",
    "link": "https://www.basket4ballers.com/fr/1740-chaussures-under-armour-curry-13"
  },
  {
    "name": "D. Fox 2",
    "brand": "Under Armour",
    "price": 120,
    "scores": [8.5, 8.0, 9.0, 8.5, 8.5, 9.0, 8.5, 7.5],
    "surface": "INDOOR/OUTDOOR",
    "foot": "STANDARD",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/1203-chaussures-basketball-de-aaron-fox"
  },
  {
    "name": "All-Pro Nitro 2",
    "brand": "Puma",
    "price": 130,
    "scores": [8.5, 8.5, 7.5, 9.0, 8.5, 8.0, 8.5, 9.0],
    "surface": "INDOOR/OUTDOOR",
    "foot": "UNIVERSEL",
    "scoreBrand": "PUMA",
    "link": "https://click.linksynergy.com/link?id=wi07X%2fYO2lw&offerid=2079203.448064029210942586065056&type=2&murl=https%3a%2f%2fwww.decathlon.fr%2fp%2fchaussures-de-basketball-adulte-all-pro-nitro-2-noir-et-vert%2f362929%2fc1m9029941"
  },
  {
    "name": "TWO WXY V5",
    "brand": "New Balance",
    "price": 130,
    "scores": [9.0, 8.5, 8.5, 9.5, 9.0, 7.5, 9.0, 8.5],
    "surface": "INDOOR/OUTDOOR",
    "foot": "LARGE",
    "scoreBrand": "NEW BALANCE",
    "link": "https://www.shinzo.paris/fr/chaussures-basketball/37634-new-balance-two-wxy-v5-bb2wycg5.html"
  },
  {
    "name": "Fresh Foam BB V3",
    "brand": "New Balance",
    "price": 140,
    "scores": [9.0, 9.5, 7.5, 8.5, 9.0, 7.0, 9.5, 7.0],
    "surface": "INDOOR/OUTDOOR",
    "foot": "ETROIT",
    "scoreBrand": "NEW BALANCE",
    "link": "https://www.newbalance.fr/fr/pd/fresh-foam-bb-v3/BBFRSV3-49565.html"
  },
  {
    "name": "Giannis Freak 7",
    "brand": "Nike",
    "price": 114.99,
    "scores": [8.5, 8.5, 8.5, 8.5, 8.5, 8.0, 8.5, 8.0],
    "surface": "INDOOR/OUTDOOR",
    "foot": "ETROIT",
    "scoreBrand": "NIKE",
    "link": "https://www.basket4ballers.com/fr/basketball/59637-nike-giannis-freak-7-laser-orange-hf3450-007.html"
  },
  {
    "name": "Way of Wade 12",
    "brand": "LI-NING",
    "price": 180,
    "scores": [9.0, 9.5, 9.0, 9.0, 9.0, 9.0, 8.5, 7.5],
    "surface": "INDOOR",
    "foot": "ETROIT",
    "scoreBrand": "LI-NING",
    "link": "https://wayofwade.com/collections/way-of-wade-12"
  },
  {
    "name": "Way of Wade All City 14",
    "brand": "LI-NING",
    "price": 135,
    "scores": [9.5, 9.0, 8.5, 9.0, 9.0, 9.0, 8.5, 9.0],
    "surface": "INDOOR/OUTDOOR",
    "foot": "ETROIT",
    "scoreBrand": "LI-NING",
    "link": "https://www.wayofwade.com/en-eu/collections/wade-all-city-14"
  },
  {
    "name": "Wade 808 5 Ultra",
    "brand": "LI-NING",
    "price": 145,
    "scores": [9.5, 9.5, 9.5, 8.5, 8.5, 9.0, 8.5, 7.5],
    "surface": "INDOOR",
    "foot": "ETROIT",
    "scoreBrand": "LI-NING",
    "link": "https://www.wayofwade.com/en-eu/collections/wade-808-5-ultra?filter.v.availability=1"
  },
  {
    "name": "Nike G.T. Future",
    "brand": "Nike",
    "price": 199.99,
    "scores": [8.0, 9.5, 7.5, 7.0, 7.0, 5.5, 6.5, 8.0],
    "surface": "INDOOR",
    "foot": "ETROIT",
    "scoreBrand": "NIKE",
    "link": "https://www.nike.com/fr/t/chaussures-de-basket-ball-nike-gt-future-Wi2B6Qgq"
  },
  {
    "name": "MB.05",
    "brand": "PUMA",
    "price": 130,
    "scores": [8.5, 8.5, 8.0, 8.0, 8.0, 7.0, 8.5, 7.0],
    "surface": "INDOOR",
    "foot": "STANDARD",
    "scoreBrand": "PUMA",
"link": "https://click.linksynergy.com/link?id=wi07X%2fYO2lw&offerid=2079203.448062860480963943302379&type=2&murl=https%3a%2f%2fwww.decathlon.fr%2fp%2fchaussures-de-basketball-adulte-lamelo-ball-mb05-low-violet-lavande%2f386580%2fm9027164"
  },
  {
    "name": "All-Pro Nitro 3",
    "brand": "PUMA",
    "price": 140,
    "scores": [9.0, 8.5, 8.5, 9.0, 8.5, 8.5, 8.5, 8.0],
    "surface": "INDOOR",
    "foot": "STANDARD",
    "scoreBrand": "PUMA",
    "link": ""
  },
  {
    "name": "Nova Surge 4",
    "brand": "Asics",
    "price": 180,
    "scores": [9.0, 9.5, 8.5, 9.5, 9.0, 7.5, 9.5, 9.0],
    "surface": "INDOOR",
    "foot": "STANDARD",
    "scoreBrand": "ASICS",
    "link": ""
  },
  {
    "name": "Gelburst 30",
    "brand": "Asics",
    "price": 160,
    "scores": [9.0, 7.5, 9.0, 9.0, 9.0, 8.5, 8.0, 8.5],
    "surface": "INDOOR",
    "foot": "STANDARD",
    "scoreBrand": "ASICS",
    "link": ""
  },
  {
    "name": "ANTA KAI 3",
    "brand": "ANTA",
    "price": 139.95,
    "scores": [9.0, 8.0, 9.0, 9.0, 9.5, 8.5, 9.0, 7.5],
    "surface": "INDOOR",
    "foot": "STANDARD",
    "scoreBrand": "ANTA",
    "link": "https://eu.anta.com/fr/collections/anta-kai-3"
  },
  {
    "name": "Shock Wave 7 Pro",
    "brand": "ANTA",
    "price": 130,
    "scores": [9.0, 8.5, 9.0, 9.0, 9.0, 8.5, 8.0, 9.0],
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
