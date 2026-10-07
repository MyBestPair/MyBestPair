/* Base Padel MyBestPair — 32 modèles de dernière génération (relevé Decathlon du 7 octobre 2026 et catalogue Rakuten).
 * Notes sur 10, dans l'ordre de CRITERIA. Toutes les notes sont des estimations MyBestPair
 * établies à partir des fiches fabricants et des tests publiés (voir methodologie.html).
 * sole : CHEVRONS / OMNI / MIXTE · foot : ETROIT / STANDARD / LARGE
 * gender : HOMME / FEMME / MIXTE · link : lien marchand Decathlon (Rakuten), vide = « Lien bientôt disponible ».
 * Prix, liens et photos : catalogue Rakuten Decathlon (export du 7 octobre 2026), prix catalogue hors promotion.
 * women : lien, prix et photo de la version femme, utilisés quand la joueuse choisit « Femme ».
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
    "price": 94.99,
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
    "gender": "MIXTE",
    "scoreBrand": "KUIKMA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448066740892562282761882&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-kuikma-ps-pro%2F361002%2Fc382c121m8926635",
    "photo": "https://contents.mediadecathlon.com/p2953888/k$38c168aff3ee5c35395d615d5ed668f5/picture.jpg",
    "women": {
      "price": 94.99,
      "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448064784792571707008643&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-kuikma-ps-pro%2F360981%2Fc143m8926638",
      "photo": "https://contents.mediadecathlon.com/p2953697/k$c2bcb33b9edf92a26b6532b48de1c83d/picture.jpg"
    }
  },
  {
    "name": "PS Stab",
    "brand": "Kuikma",
    "price": 79.99,
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480617293298340895039797&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-kuikma-ps-stab-rouge%2F352574%2Fc146c380m8871079",
    "photo": "https://contents.mediadecathlon.com/p2700144/k$3cbf3139c92af5c2e670b61766e4682f/picture.jpg"
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480614333398193486184063&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-ps-dynamic-bleu-clair%2F355400%2Fc406m8883471",
    "photo": "https://contents.mediadecathlon.com/p3027591/k$3d2288e275bf06d53d4810235c7ca65e/picture.jpg"
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.44806558728484720756134&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-pour-homme-ps-team-bleu%2F347711%2Fc158c43c43m8948988",
    "photo": "https://contents.mediadecathlon.com/p2951611/k$103c01fa83dc019096701ce3216982d7/picture.jpg"
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448061717091583171456539&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-femme-ps-comfort-bleu-clair%2F355874%2Fc155c158m8891469",
    "photo": "https://contents.mediadecathlon.com/p2700147/k$4b70817a5770b223c8da8469b494c26f/picture.jpg"
  },
  {
    "name": "PS 500",
    "brand": "Kuikma",
    "price": 44.99,
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448063115558676368338148&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-homme-ps-500-noir-jaune%2F310385%2Fc382c132m8805268",
    "photo": "https://contents.mediadecathlon.com/p2448110/k$438a3973598cce6306fbeb3d1b1bd1aa/picture.jpg"
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448069130966022588006583&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-tennis-padel-et-pickleball-homme-comfort-lite-terracota%2F365168%2Fc101c382m9019684",
    "photo": "https://contents.mediadecathlon.com/p3117542/k$855531c85c47b9850573719a612d660b/picture.jpg"
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480616367255597944003148&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-homme-asics-gel-dedicate-9%2F386627%2Fm9030241",
    "photo": "https://contents.mediadecathlon.com/p3173722/k$ab83530ca9cc05edc197d26ea09baa77/picture.jpg"
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
    "gender": "MIXTE",
    "scoreBrand": "ASICS",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448062687369133921334274&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-homme-asics-game-ff-gris-bleu-rose%2F367927%2Fm8949962",
    "photo": "https://contents.mediadecathlon.com/p2816641/k$50a2c21f7701f3f6976fc6a8734d2a58/picture.jpg",
    "women": {
      "price": 69.99,
      "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448069587540811268867556&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchausures-de-padel-femme-asics-game-ff-padel%2F381325%2Fm9001463",
      "photo": "https://contents.mediadecathlon.com/p3039955/k$a397dd718f2ef5f428f36e3aa43aa70a/picture.jpg"
    }
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
    "price": 119.99,
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.44806745693465105546124&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-homme-asics-gel-challenguer-15-blanc-bleu%2F381323%2Fm9001456",
    "photo": "https://contents.mediadecathlon.com/p3039965/k$2162f3a160c1b79adeb1f17fc4b9fbe4/picture.jpg"
  },
  {
    "name": "Sonicsmash FF",
    "brand": "ASICS",
    "price": 139.99,
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448064921583686734084084&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-homme-asics-sonicsmash-ff-white-orange%2F381312%2Fm9049415",
    "photo": "https://contents.mediadecathlon.com/p3212420/k$82705f8252c4e39f17f3706214b98674/picture.jpg"
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448064526946384483165548&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-femme-babolat-sensa-25-blanche%2F367016%2Fm8948121",
    "photo": "https://contents.mediadecathlon.com/p2852067/k$3bf34defe4dc5edb52581829eb8c12cb/picture.jpg"
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480611580387529285262133&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-homme-babolat-jet-viva-blanc%2F365394%2Fm8941944",
    "photo": "https://contents.mediadecathlon.com/p2816643/k$e09b8de425d44f954a9087dadce32037/picture.jpg"
  },
  {
    "name": "Premura 3 Juan Lebron",
    "brand": "Babolat",
    "price": 169.99,
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480614634464146526800284&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-premura-3-juan-lebron-pour-homme%2F381314%2Fm9001489",
    "photo": "https://contents.mediadecathlon.com/p2952052/k$82f2bf32f48000a4e7010c87bad23f68/picture.jpg"
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480610154853658275369429&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-homme-bullpadel-bogun-25-noir-jaune%2F365313%2Fm8941938",
    "photo": "https://contents.mediadecathlon.com/p2816648/k$24d7febfac49deb394d198eae515e3eb/picture.jpg"
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448069358136013169288314&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-padel-homme-bullpadel-binux-black%2F381511%2Fm9001992",
    "photo": "https://contents.mediadecathlon.com/p3033250/k$04447916d42a75d46c862fba03bef696/picture.jpg"
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480614752201594169353422&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-homme-bullpadel-neuron-26v-grey%2F381427%2Fm9001994",
    "photo": "https://contents.mediadecathlon.com/p3031108/k$e21b30870febaeefd673b882718d1217/picture.jpg"
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480612588568593961950133&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-homme-bullpadel-vertex-vibram-26%2F381408%2Fm9001997",
    "photo": "https://contents.mediadecathlon.com/p3031113/k$a914f156f953b9a9853ee8979338d838/picture.jpg"
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.44806987467767689746609&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-homme-adidas-crazyquick-ls-padel-rouge%2F365580%2Fm8942722",
    "photo": "https://contents.mediadecathlon.com/p2835247/k$4e97a6679e028468e84a60bf924019d0/picture.jpg"
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448062494409354153057949&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-homme-head-motion-team-bleu%2F365400%2Fm8941947",
    "photo": "https://contents.mediadecathlon.com/p2860142/k$7465e720b8704b4bcadc7ffe9b197c83/picture.jpg"
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
    "price": 159.99,
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448068987620541671657488&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-homme-wilson-bela-tour-blanc-rouge%2F365525%2Fm8942655",
    "photo": "https://contents.mediadecathlon.com/p2816184/k$9ed03eeb257a44d9896e44229957ae32/picture.jpg"
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
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448064583602075193780679&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-slam-pro-pour-homme%2F381316%2Fm9001579",
    "photo": "https://contents.mediadecathlon.com/p3133015/k$2c836ba709015aa3fc9c737978590832/picture.jpg"
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
  },
  {
    "name": "Indiga W 26V",
    "brand": "Bullpadel",
    "price": 74.99,
    "scores": [
      8.0,
      7.0,
      7.0,
      7.0,
      7.5,
      7.5,
      8.5,
      7.0
    ],
    "sole": "CHEVRONS",
    "foot": "STANDARD",
    "gender": "FEMME",
    "scoreBrand": "BULLPADEL",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448068456336545924662305&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-padel-femme-bullpadel-indiga-w-26v%2F381513%2Fm9001999",
    "photo": "https://contents.mediadecathlon.com/p3219711/k$4f4cbff4a422cc706e3e45728e4e7e67/picture.jpg"
  },
  {
    "name": "Spin Lady",
    "brand": "Joma",
    "price": 79.99,
    "scores": [
      7.5,
      7.0,
      8.0,
      7.5,
      7.0,
      7.5,
      7.5,
      7.0
    ],
    "sole": "MIXTE",
    "foot": "STANDARD",
    "gender": "FEMME",
    "scoreBrand": "JOMA",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.448066030737227428534479&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-padel-femme-joma-spin-lady-orange%2F395281%2Fm9077135",
    "photo": "https://contents.mediadecathlon.com/p3239352/k$942a55ef103de8cf595a3d516583551c/picture.jpg"
  },
  {
    "name": "Courtquick Padel",
    "brand": "adidas",
    "price": 79.99,
    "scores": [
      7.5,
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
    "gender": "MIXTE",
    "scoreBrand": "ADIDAS",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480614637953484977070397&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-homme-adidas-courtquick-padel%2F381363%2Fm9001589",
    "photo": "https://contents.mediadecathlon.com/p3034865/k$172b15cff879cfeeb6f3ff207e8da56a/picture.jpg",
    "women": {
      "price": 79.99,
      "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480617824909014766927930&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-femme-adidas-courtquick%2F381364%2Fm9001593",
      "photo": "https://contents.mediadecathlon.com/p3033185/k$c26ebf6ba5d079e46f322e37694c60bc/picture.jpg"
    }
  },
  {
    "name": "Movea 2",
    "brand": "Babolat",
    "price": 89.99,
    "scores": [
      8.0,
      7.5,
      8.0,
      8.0,
      7.0,
      8.0,
      8.5,
      7.0
    ],
    "sole": "MIXTE",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "BABOLAT",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480645167581628324641&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-homme-babolat-movea-2-blanches%2F365368%2Fm8942113",
    "photo": "https://contents.mediadecathlon.com/p2852246/k$95cc9006b2ec73ad1d5df04067c72f4b/picture.jpg"
  },
  {
    "name": "Motion One LTD",
    "brand": "HEAD",
    "price": 69.99,
    "scores": [
      7.5,
      7.0,
      7.5,
      7.5,
      7.5,
      7.5,
      7.5,
      7.5
    ],
    "sole": "MIXTE",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "HEAD",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.4480617830542872473190793&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-homme-head-motion-one-ltd%2F381287%2Fm9001594",
    "photo": "https://contents.mediadecathlon.com/p3139826/k$32205bbbae08a910755a62569c14b912/picture.jpg"
  },
  {
    "name": "Sprint Pro 4.0",
    "brand": "HEAD",
    "price": 70.99,
    "scores": [
      7.5,
      7.5,
      7.5,
      8.0,
      8.0,
      8.0,
      7.5,
      8.0
    ],
    "sole": "MIXTE",
    "foot": "STANDARD",
    "gender": "HOMME",
    "scoreBrand": "HEAD",
    "link": "https://click.linksynergy.com/link?id=wi07X/YO2lw&offerid=2079203.44806268452679361736637&type=15&murl=https%3A%2F%2Fwww.decathlon.fr%2Fp%2Fchaussures-de-padel-homme-head-sprint-pro-4-0-bleu-vert%2F365315%2Fm8942682",
    "photo": "https://contents.mediadecathlon.com/p2860136/k$8d1cf7323614169836c95ad9039e60f7/picture.jpg"
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
