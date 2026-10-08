/* Base Foot MyBestPair — 41 modèles récents (dernière génération) validés par Romain le 8 octobre 2026.
 * Notes sur 10, dans l'ordre de CRITERIA. Toutes les notes sont des estimations MyBestPair
 * établies à partir des fiches fabricants et des tests publiés (voir methodologie.html).
 * studs (catégorie utilisée par le moteur) : FG (moulés, herbe sèche) / MG (multi-terrain : FG/MG, FG/AG, MG/AG, AG/FG)
 *   / SG (vissés, herbe grasse) / TF (stabilisé) ; studsLabel = indication exacte du fabricant.
 * foot : ETROIT / STANDARD / LARGE · public : ADULTE / FEMME / ENFANT
 * link : lien marchand Decathlon (Rakuten), vide = « Lien bientôt disponible ».
 * Prix : catalogue Rakuten Decathlon (export du 8 octobre 2026, hors promotion) ; priceIndicative = prix public constaté, sans marchand.
 * Nike n'est pas au catalogue Rakuten Decathlon : ses modèles sont gardés sans lien (choix de Romain).
 */
const CRITERIA = [
  "ACCROCHE",
  "TOUCHER",
  "FRAPPE",
  "LEGERETE",
  "DYNAMISME",
  "MAINTIEN",
  "CONFORT",
  "DURABILITE"
];

const SHOES = [
  {
    "name": "Predator 26 League FG",
    "brand": "adidas",
    "price": 94.99,
    "scores": [
      7.5,
      7.5,
      8.5,
      6.5,
      6.5,
      7.5,
      7.5,
      7.5
    ],
    "studs": "FG",
    "studsLabel": "FG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "ADIDAS",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480614786974595871848936&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fadidas-predator-league-ft-fg-chaussure-adulte-blanc%2F386274%2Fm9031681",
    "photo": "https://contents.mediadecathlon.com/p3210072/k$a5aeb85d273e1f66de4080d58f531f44/picture.jpg"
  },
  {
    "name": "F50 Hyperfast League FG/MG",
    "brand": "adidas",
    "price": 89.99,
    "scores": [
      7.5,
      7.0,
      7.0,
      8.0,
      8.0,
      6.5,
      7.0,
      7.0
    ],
    "studs": "MG",
    "studsLabel": "FG/MG",
    "foot": "ETROIT",
    "public": "ADULTE",
    "scoreBrand": "ADIDAS",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480612032325038484235421&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fadidas-f50-hyperfast-league-fg-mg-chaussure-adulte-blanc-violet%2F386287%2Fm9031682",
    "photo": "https://contents.mediadecathlon.com/p3210097/k$8f1679e912e8dbce83c9f1002f302ca6/picture.jpg"
  },
  {
    "name": "F50 Hyperfast League SG",
    "brand": "adidas",
    "price": 89.99,
    "scores": [
      8.0,
      7.0,
      7.0,
      7.5,
      8.0,
      6.5,
      7.0,
      7.0
    ],
    "studs": "SG",
    "studsLabel": "SG",
    "foot": "ETROIT",
    "public": "ADULTE",
    "scoreBrand": "ADIDAS",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480614195960739916439255&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fadidas-f50-hyperfast-league-sg-chaussure-adulte-blanc-violet%2F387087%2Fm9032272",
    "photo": "https://contents.mediadecathlon.com/p3209918/k$d116670d0b146e2882ffdebfc7db9123/picture.jpg"
  },
  {
    "name": "Copa Pure IV League FG",
    "brand": "adidas",
    "price": 84.99,
    "scores": [
      7.5,
      8.5,
      7.5,
      6.5,
      6.5,
      7.5,
      8.5,
      7.5
    ],
    "studs": "FG",
    "studsLabel": "FG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "ADIDAS",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448061938657570876579875&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussure-copa-pure-iv-league-fg-adulte-blanc%2F380552%2Fc4m8998771",
    "photo": "https://contents.mediadecathlon.com/p3102148/k$05c9ca16e17f5bfb5bf7611a9cf379e6/picture.jpg"
  },
  {
    "name": "Copa Pure IV Club TF",
    "brand": "adidas",
    "price": 54.99,
    "scores": [
      7.0,
      7.0,
      6.5,
      6.0,
      6.0,
      7.0,
      7.5,
      7.5
    ],
    "studs": "TF",
    "studsLabel": "TF",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "ADIDAS",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448062477777084532384009&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fadidas-copa-pure-iv-club-turf-chaussure-adulte-blanc%2F380282%2Fc4c6m9029945",
    "photo": "https://contents.mediadecathlon.com/p3210341/k$0e41ec1a82c6355be82194c24d9c7116/picture.jpg"
  },
  {
    "name": "Copa Mundial FG",
    "brand": "adidas",
    "price": 179.99,
    "scores": [
      7.5,
      9.0,
      8.0,
      6.0,
      6.0,
      7.5,
      9.0,
      8.0
    ],
    "studs": "FG",
    "studsLabel": "FG",
    "foot": "LARGE",
    "public": "ADULTE",
    "scoreBrand": "ADIDAS",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448061350474533953683670&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussure-football-copa-mundial-fg-adidas-adulte%2FX4994312%2Fc1c4m4994312",
    "photo": "https://contents.mediadecathlon.com/p531763/k$a1720f32a9a19b62c6c633b1bf729c38/picture.jpg"
  },
  {
    "name": "Future 9 Pro FG/AG",
    "brand": "Puma",
    "price": 149.99,
    "scores": [
      8.0,
      8.5,
      7.5,
      7.5,
      8.0,
      8.0,
      8.0,
      7.5
    ],
    "studs": "MG",
    "studsLabel": "FG/AG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "PUMA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480611366599234935111794&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussure-future-9-pro-fg-ag-adulte-bleu%2F379590%2Fm8995162",
    "photo": "https://contents.mediadecathlon.com/p3131661/k$45374a2971075c880c8b473a993e0250/picture.jpg"
  },
  {
    "name": "Future 9 Match FG/AG",
    "brand": "Puma",
    "price": 94.99,
    "scores": [
      7.5,
      8.0,
      7.0,
      7.0,
      7.5,
      7.5,
      7.5,
      7.0
    ],
    "studs": "MG",
    "studsLabel": "FG/AG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "PUMA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448061103770625793398725&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fpuma-future-9-match-fg-ag-chaussure-adulte-noir%2F386249%2Fm9031648",
    "photo": "https://contents.mediadecathlon.com/p3215588/k$633d9835a37838a503bcb7a65e71e819/picture.jpg"
  },
  {
    "name": "Future 9 Play TF",
    "brand": "Puma",
    "price": 59.99,
    "scores": [
      7.0,
      7.0,
      6.5,
      6.5,
      6.5,
      7.0,
      7.0,
      7.0
    ],
    "studs": "TF",
    "studsLabel": "TF",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "PUMA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448062271505773822848200&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussure-future-9-play-tt-smu-adulte-jaune-bleu%2F379390%2Fm9010850",
    "photo": "https://contents.mediadecathlon.com/p3192795/k$d513ac8d82b97dd334c498610f1c29c4/picture.jpg"
  },
  {
    "name": "Ultra 7 Pro FG",
    "brand": "Puma",
    "price": 149.99,
    "scores": [
      8.0,
      7.5,
      7.5,
      9.0,
      9.0,
      7.0,
      7.0,
      6.5
    ],
    "studs": "FG",
    "studsLabel": "FG",
    "foot": "ETROIT",
    "public": "ADULTE",
    "scoreBrand": "PUMA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448068015839380056866889&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fpuma-ultra-7-pro-fg-chaussure-adulte-rouge%2F386751%2Fm9030409",
    "photo": "https://contents.mediadecathlon.com/p3215314/k$32592deab72ddfe3c0c12e5ec8f6241e/picture.jpg"
  },
  {
    "name": "Ultra 7 Match FG/AG",
    "brand": "Puma",
    "price": 84.99,
    "scores": [
      7.5,
      7.0,
      7.0,
      8.0,
      8.0,
      6.5,
      7.0,
      6.5
    ],
    "studs": "MG",
    "studsLabel": "FG/AG",
    "foot": "ETROIT",
    "public": "ADULTE",
    "scoreBrand": "PUMA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448061919725057664569493&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fpuma-ultra-7-match-fg-ag-chaussure-adulte-rouge%2F386159%2Fm9031374",
    "photo": "https://contents.mediadecathlon.com/p3215511/k$41eb2f3b017895c71bf3f8f7afbc1cb7/picture.jpg"
  },
  {
    "name": "King Liga FG/AG",
    "brand": "Puma",
    "price": 99.99,
    "scores": [
      7.5,
      8.5,
      7.5,
      6.5,
      6.5,
      7.5,
      8.5,
      8.0
    ],
    "studs": "MG",
    "studsLabel": "FG/AG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "PUMA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448062869686653289801177&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussure-de-football-puma-king-liga-fg-ag-adulte-noir%2F386934%2Fm9030479",
    "photo": "https://contents.mediadecathlon.com/p3226509/k$71e057b7c3333a64aa72b93815f073f8/picture.jpg"
  },
  {
    "name": "Furon Team v8 FG",
    "brand": "New Balance",
    "price": 89.99,
    "scores": [
      7.5,
      7.0,
      7.0,
      7.5,
      7.5,
      6.5,
      7.0,
      7.0
    ],
    "studs": "FG",
    "studsLabel": "FG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "NEW BALANCE",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480611175618107122886860&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fnew-balance-furon-team-v8-fg-chaussure-adulte-jaune%2F381889%2Fm9003382",
    "photo": "https://contents.mediadecathlon.com/p3119045/k$dd821eb41ea55313f62265079cfb49ea/picture.jpg"
  },
  {
    "name": "Tekela Team v5 FG",
    "brand": "New Balance",
    "price": 89.99,
    "scores": [
      7.5,
      7.5,
      7.0,
      7.0,
      7.0,
      7.0,
      7.5,
      7.0
    ],
    "studs": "FG",
    "studsLabel": "FG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "NEW BALANCE",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448066043269876379926940&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussure-tekela-team-low-laced-fg-v5-adulte-bleu%2F373808%2Fm8967163",
    "photo": "https://contents.mediadecathlon.com/p2958830/k$c8897ed6a19b29dce54a22a53e6b015f/picture.jpg"
  },
  {
    "name": "Morelia II Pro MG/AG",
    "brand": "Mizuno",
    "price": 119.99,
    "scores": [
      7.5,
      9.0,
      7.5,
      7.5,
      7.0,
      7.5,
      9.0,
      8.0
    ],
    "studs": "MG",
    "studsLabel": "MG/AG",
    "foot": "LARGE",
    "public": "ADULTE",
    "scoreBrand": "MIZUNO",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480613139735951217500120&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussure-mizuno-morelia-ii-pro-mg-ag-cuir-adulte%2F373103%2Fc1c14m8968322",
    "photo": "https://contents.mediadecathlon.com/p2973641/k$58d401d3da37169b5ca1b977b415cf5e/picture.jpg"
  },
  {
    "name": "Viralto IV Cuir Premium FG",
    "brand": "Kipsta",
    "price": 69.99,
    "scores": [
      7.5,
      8.5,
      7.5,
      6.5,
      6.5,
      7.5,
      8.5,
      8.0
    ],
    "studs": "FG",
    "studsLabel": "FG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "KIPSTA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480616059607211221933451&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-football-viralto-iv-cuir-premium-pro-evolution-amber-jewel%2F325215%2Fc296m8843800",
    "photo": "https://contents.mediadecathlon.com/p2677029/k$25843d90fe661005352aa031a2a59a92/picture.jpg"
  },
  {
    "name": "Viralto IV Cuir Premium SG",
    "brand": "Kipsta",
    "price": 55.0,
    "scores": [
      8.5,
      8.5,
      7.5,
      6.0,
      6.5,
      7.5,
      8.0,
      8.0
    ],
    "studs": "SG",
    "studsLabel": "SG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "KIPSTA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448067575738025729794938&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-football-viralto-iv-premium-cuir-sg-noir%2F325420%2Fc383m8612892",
    "photo": "https://contents.mediadecathlon.com/p2066764/k$b221c83d7c809e1133212a03126ea81a/picture.jpg"
  },
  {
    "name": "Viralto IV Cuir Premium TF",
    "brand": "Kipsta",
    "price": 59.99,
    "scores": [
      7.0,
      8.0,
      7.0,
      6.0,
      6.0,
      7.5,
      8.0,
      8.0
    ],
    "studs": "TF",
    "studsLabel": "TF",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "KIPSTA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448066416012376475288551&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-football-viralto-iv-turf-blanc-cuir-de-premiere-qualite%2F358456%2Fc227m8917469",
    "photo": "https://contents.mediadecathlon.com/p2775554/k$d91bffba661a291fb28a71c3f9cddce3/picture.jpg"
  },
  {
    "name": "CLR 7 Elite FG",
    "brand": "Kipsta",
    "price": 79.99,
    "scores": [
      8.0,
      7.5,
      7.5,
      8.0,
      8.0,
      7.0,
      7.5,
      7.0
    ],
    "studs": "FG",
    "studsLabel": "FG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "KIPSTA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480611635567105115439492&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-foot-adulte-clr-7-elite-fg-yellow-orange-meteor%2F372036%2Fc346m8982981",
    "photo": "https://contents.mediadecathlon.com/p3095938/k$b8581d9e94069a0d870f691a7d15d937/picture.jpg"
  },
  {
    "name": "CLR 7 Elite SG",
    "brand": "Kipsta",
    "price": 79.99,
    "scores": [
      8.5,
      7.5,
      7.5,
      7.5,
      8.0,
      7.0,
      7.5,
      7.0
    ],
    "studs": "SG",
    "studsLabel": "SG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "KIPSTA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448063813957703009397304&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-foot-clr-7-elite-sg-white-yellow-meteor-adulte%2F372066%2Fc227c227m8977980",
    "photo": "https://contents.mediadecathlon.com/p3225543/k$8222011ffd9ed4e203897923a2fe6018/picture.jpg"
  },
  {
    "name": "Viralto III 3D Air Mesh MG/AG",
    "brand": "Kipsta",
    "price": 49.99,
    "scores": [
      7.0,
      7.5,
      7.0,
      7.0,
      7.0,
      7.0,
      7.5,
      7.0
    ],
    "studs": "MG",
    "studsLabel": "MG/AG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "KIPSTA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.44806270506576386470473&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-football-viralto-iii-3d-airmesh-mg-ag-titanium-games%2F342925%2Fc230m8891811",
    "photo": "https://contents.mediadecathlon.com/p2677031/k$018b91e64a6654877755c423331e94fd/picture.jpg"
  },
  {
    "name": "Traxium Edge AG/FG",
    "brand": "Kipsta",
    "price": 58.99,
    "scores": [
      8.0,
      6.5,
      7.0,
      7.5,
      7.5,
      6.5,
      7.0,
      7.0
    ],
    "studs": "MG",
    "studsLabel": "AG/FG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "KIPSTA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480612792618007702795043&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-football-traxium-edge-ag-fg-blanc-bleu%2F312633%2Fc375m8843813",
    "photo": "https://contents.mediadecathlon.com/p2585184/k$335342a3b9d4fd037c9d79f306d35669/picture.jpg"
  },
  {
    "name": "Viralto I MG/AG",
    "brand": "Kipsta",
    "price": 29.99,
    "scores": [
      6.5,
      6.5,
      6.0,
      6.5,
      6.0,
      6.5,
      7.0,
      7.0
    ],
    "studs": "MG",
    "studsLabel": "MG/AG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "KIPSTA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448065092643752921530444&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-foot-homme-femme-viralto-i-mg-ag-white%2F376215%2Fc426m8977704",
    "photo": "https://contents.mediadecathlon.com/p3096035/k$d263bc2107edc3d9f953a65982d92c62/picture.jpg"
  },
  {
    "name": "Agility 100 AG/FG",
    "brand": "Kipsta",
    "price": 16.99,
    "scores": [
      6.0,
      5.5,
      5.5,
      6.0,
      5.5,
      6.0,
      6.5,
      6.5
    ],
    "studs": "MG",
    "studsLabel": "AG/FG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "KIPSTA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448062092911077002461072&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-football-agility-100-ag-fg-adulte-noir%2F184873%2Fc382m8397881",
    "photo": "https://contents.mediadecathlon.com/p2606601/k$14c3a72ceca95a398b476151fc05bb58/picture.jpg"
  },
  {
    "name": "Viralto III-W FG",
    "brand": "Kipsta",
    "price": 54.99,
    "scores": [
      7.0,
      7.5,
      7.0,
      7.0,
      7.0,
      7.0,
      8.0,
      7.0
    ],
    "studs": "FG",
    "studsLabel": "FG",
    "foot": "STANDARD",
    "public": "FEMME",
    "scoreBrand": "KIPSTA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448061874467522485818088&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-football-femme-viralto-iii-w-fg-purple-rain%2F350708%2Fc295m8843840",
    "photo": "https://contents.mediadecathlon.com/p2585579/k$14e692b1618f9945b814db4a9a5c4864/picture.jpg"
  },
  {
    "name": "Viralto+ III MG Femme",
    "brand": "Kipsta",
    "price": 39.99,
    "scores": [
      7.0,
      7.0,
      6.5,
      7.0,
      6.5,
      7.0,
      7.5,
      7.0
    ],
    "studs": "MG",
    "studsLabel": "MG",
    "foot": "STANDARD",
    "public": "FEMME",
    "scoreBrand": "KIPSTA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480613906612958979910336&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussure-de-football-femme-viralto-iii-mg-grise%2F312678%2Fc143m8595964",
    "photo": "https://contents.mediadecathlon.com/p2066678/k$dd65fc962a74e13aeb003b1e90f8cb33/picture.jpg"
  },
  {
    "name": "Predator 26 League FG Jr",
    "brand": "adidas",
    "price": 74.99,
    "scores": [
      7.5,
      7.0,
      8.0,
      6.5,
      6.5,
      7.5,
      7.5,
      7.0
    ],
    "studs": "FG",
    "studsLabel": "FG",
    "foot": "STANDARD",
    "public": "ENFANT",
    "scoreBrand": "ADIDAS",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448064250544577464548830&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fadidas-predator-league-ft-fg-chaussure-enfant-blanc%2F386306%2Fm9031642",
    "photo": "https://contents.mediadecathlon.com/p3211484/k$899653c6c1a33343cd49884da12d1801/picture.jpg"
  },
  {
    "name": "Future 9 Match FG/AG Jr",
    "brand": "Puma",
    "price": 69.99,
    "scores": [
      7.5,
      7.5,
      7.0,
      7.0,
      7.5,
      7.5,
      7.5,
      7.0
    ],
    "studs": "MG",
    "studsLabel": "FG/AG",
    "foot": "STANDARD",
    "public": "ENFANT",
    "scoreBrand": "PUMA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448062924948989529259901&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fpuma-future-9-match-fg-ag-chaussure-enfant-rouge%2F386752%2Fm9030410",
    "photo": "https://contents.mediadecathlon.com/p3215322/k$f1b72b6496ffe9e6e246c0b60d5ed474/picture.jpg"
  },
  {
    "name": "F50 Hyperfast League FG/MG Jr",
    "brand": "adidas",
    "price": 69.99,
    "scores": [
      7.5,
      7.0,
      7.0,
      8.0,
      8.0,
      6.5,
      7.0,
      6.5
    ],
    "studs": "MG",
    "studsLabel": "FG/MG",
    "foot": "ETROIT",
    "public": "ENFANT",
    "scoreBrand": "ADIDAS",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480615334923244287717377&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fadidas-f50-hyperfast-league-fg-mg-chaussure-enfant-blanc-violet%2F386228%2Fm9031647",
    "photo": "https://contents.mediadecathlon.com/p3210269/k$805d3d3ec1d0368b4ab9a49a0df148a5/picture.jpg"
  },
  {
    "name": "Viralto I Easy FG Jr",
    "brand": "Kipsta",
    "price": 29.99,
    "scores": [
      6.5,
      6.5,
      6.0,
      6.5,
      6.0,
      6.5,
      7.5,
      7.0
    ],
    "studs": "FG",
    "studsLabel": "FG",
    "foot": "STANDARD",
    "public": "ENFANT",
    "scoreBrand": "KIPSTA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448067252491431447382300&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-football-enfant-a-scratch-viralto-i-easy-fg-snake%2F343046%2Fc155m8917497",
    "photo": "https://contents.mediadecathlon.com/p2814782/k$d5297de361280f5c5286f5d8ee3ab068/picture.jpg"
  },
  {
    "name": "Mercurial Vapor 17 Elite FG",
    "brand": "Nike",
    "price": 290,
    "scores": [
      8.5,
      8.0,
      8.0,
      9.5,
      9.5,
      7.0,
      7.0,
      6.5
    ],
    "studs": "FG",
    "studsLabel": "FG",
    "foot": "ETROIT",
    "public": "ADULTE",
    "scoreBrand": "NIKE",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Mercurial Vapor 17 Academy MG",
    "brand": "Nike",
    "price": 90,
    "scores": [
      7.5,
      7.0,
      7.0,
      8.0,
      8.0,
      6.5,
      7.0,
      7.0
    ],
    "studs": "MG",
    "studsLabel": "MG",
    "foot": "ETROIT",
    "public": "ADULTE",
    "scoreBrand": "NIKE",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Mercurial Vapor 17 Club MG",
    "brand": "Nike",
    "price": 55,
    "scores": [
      7.0,
      6.5,
      6.5,
      7.0,
      7.0,
      6.0,
      6.5,
      6.5
    ],
    "studs": "MG",
    "studsLabel": "MG",
    "foot": "ETROIT",
    "public": "ADULTE",
    "scoreBrand": "NIKE",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Mercurial Superfly 11 Academy MG",
    "brand": "Nike",
    "price": 100,
    "scores": [
      7.5,
      7.0,
      7.0,
      7.5,
      8.0,
      7.5,
      7.0,
      7.0
    ],
    "studs": "MG",
    "studsLabel": "MG",
    "foot": "ETROIT",
    "public": "ADULTE",
    "scoreBrand": "NIKE",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Phantom 6 Elite FG",
    "brand": "Nike",
    "price": 280,
    "scores": [
      8.5,
      9.0,
      9.0,
      8.0,
      8.5,
      8.0,
      8.0,
      7.0
    ],
    "studs": "FG",
    "studsLabel": "FG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "NIKE",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Phantom 6 Academy MG",
    "brand": "Nike",
    "price": 85,
    "scores": [
      7.5,
      8.0,
      7.5,
      7.0,
      7.0,
      7.0,
      7.5,
      7.0
    ],
    "studs": "MG",
    "studsLabel": "MG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "NIKE",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Tiempo Maestro Elite FG",
    "brand": "Nike",
    "price": 280,
    "scores": [
      8.5,
      9.0,
      8.5,
      8.0,
      8.0,
      8.0,
      9.0,
      7.5
    ],
    "studs": "FG",
    "studsLabel": "FG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "NIKE",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Tiempo Maestro Academy MG",
    "brand": "Nike",
    "price": 85,
    "scores": [
      7.5,
      8.0,
      7.5,
      6.5,
      6.5,
      7.5,
      8.0,
      7.5
    ],
    "studs": "MG",
    "studsLabel": "MG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "NIKE",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Mercurial Vapor 17 Academy MG Jr",
    "brand": "Nike",
    "price": 65,
    "scores": [
      7.5,
      7.0,
      7.0,
      8.0,
      8.0,
      6.5,
      7.0,
      6.5
    ],
    "studs": "MG",
    "studsLabel": "MG",
    "foot": "ETROIT",
    "public": "ENFANT",
    "scoreBrand": "NIKE",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "Predator 26 Elite FG",
    "brand": "adidas",
    "price": 280,
    "scores": [
      8.5,
      8.5,
      9.5,
      7.5,
      7.5,
      8.5,
      8.0,
      7.5
    ],
    "studs": "FG",
    "studsLabel": "FG",
    "foot": "STANDARD",
    "public": "ADULTE",
    "scoreBrand": "ADIDAS",
    "link": "",
    "priceIndicative": true
  },
  {
    "name": "F50 Hyperfast Elite FG",
    "brand": "adidas",
    "price": 260,
    "scores": [
      8.5,
      8.0,
      8.0,
      9.5,
      9.5,
      7.0,
      7.0,
      6.5
    ],
    "studs": "FG",
    "studsLabel": "FG",
    "foot": "ETROIT",
    "public": "ADULTE",
    "scoreBrand": "ADIDAS",
    "link": "",
    "priceIndicative": true
  }
];

/* Ajustements du poids des critères (même ordre que CRITERIA), ajoutés à 1 puis multipliés par les priorités.
 * On raisonne par profil : le poste donne la base, le style et le niveau la corrigent. */
const POSITION_MODS = {
  "GARDIEN": [0.3, 0, 0.1, -0.2, 0, 0.3, 0.2, 0.1],
  "DEFENSEUR": [0.15, -0.05, 0.15, -0.15, -0.05, 0.25, 0.05, 0.2],
  "MILIEU": [0.05, 0.3, 0.1, 0, 0.05, 0.05, 0.2, 0.05],
  "ATTAQUANT": [0.15, 0.05, 0.1, 0.3, 0.3, -0.05, -0.05, -0.05]
};

const STYLE_MODS = {
  "PUISSANCE": [0.05, 0, 0.3, -0.05, 0, 0.1, 0, 0.05],
  "TECHNIQUE": [0, 0.3, 0.05, 0, 0.05, 0, 0.1, 0],
  "VITESSE": [0.1, 0, 0, 0.25, 0.25, -0.05, 0, 0],
  "INCONNU": [0, 0, 0, 0, 0, 0, 0, 0]
};

/* Débutant et loisir : le confort et la durabilité comptent plus ; compétition : accroche, légèreté et dynamisme. */
const LEVEL_MODS = {
  "DEBUTANT": [0, 0, 0, 0, 0, 0.05, 0.2, 0.15],
  "LOISIR": [0, 0.05, 0, 0, 0, 0.05, 0.1, 0.1],
  "COMPETITION": [0.1, 0.05, 0.05, 0.1, 0.1, 0, 0, 0]
};
