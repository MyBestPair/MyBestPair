/* Moteur MyBestPair — version Rugby.
 * Même moteur que app.js (Basket) et padel-app.js : même pondération finale, même marge
 * « coup de cœur » de 20 €, mêmes multiplicateurs de priorités et même départage des égalités.
 * Adaptations Rugby : on raisonne par profil (poste en 3 groupes, style de jeu, poids, niveau)
 * pour ajuster le poids des 8 critères ; la part « surface » compare les crampons au terrain
 * et au type de crampons choisi ; homme / femme / enfant filtre la base. La commission n'intervient jamais.
 * Données : rugby/shoes-rugby.js (CRITERIA, SHOES, POSITION_MODS, STYLE_MODS, LEVEL_MODS, weightMods).
 */
const MYBESTPAIR_VERSION = "1.1";

const $ = (id) => document.getElementById(id);
const FLEX_BUDGET = 20;

/* Pondération finale MYBESTPAIR (identique à app.js). */
const FINAL_WEIGHTS = {
  tech: 0.62,
  surface: 0.10,
  foot: 0.08,
  brand: 0.05,
  budget: 0.15
};

const PRIORITY_MULT = [1.5, 1.25, 1.1];

/* Crampons conseillés selon le terrain, quand le joueur répond « je ne sais pas » (sur 100).
 * Gras : les crampons fer accrochent le mieux. Sec : moulés. Synthétique : moulés (le fer y est souvent interdit). */
const TERRAIN_FIT = {
  GRAS: { FER: 100, HYBRIDE: 90, MOULES: 40 },
  SEC: { MOULES: 100, HYBRIDE: 85, FER: 60 },
  SYNTHETIQUE: { MOULES: 100, HYBRIDE: 50, FER: 20 },
  INCONNU: { HYBRIDE: 100, FER: 80, MOULES: 80 }
};

/* Quand le joueur choisit son type de crampons : son choix d'abord, l'hybride reste proche des deux. */
const STUDS_FIT = {
  FER: { FER: 100, HYBRIDE: 75, MOULES: 30 },
  MOULES: { MOULES: 100, HYBRIDE: 70, FER: 30 },
  HYBRIDE: { HYBRIDE: 100, FER: 75, MOULES: 70 }
};

const ADVISED_STUDS = { GRAS: "FER", SEC: "MOULES", SYNTHETIQUE: "MOULES", INCONNU: "HYBRIDE" };

let rankedResults = [];
let shownCount = 3;


function stripAccentsUpper(s) {
  return String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase();
}


function titleCriterion(c) {
  const m = {
    ACCROCHE: "accroche",
    STABILITE: "stabilité",
    MAINTIEN: "maintien",
    PROTECTION: "protection",
    LEGERETE: "légèreté",
    DYNAMISME: "dynamisme",
    CONFORT: "confort",
    DURABILITE: "durabilité"
  };
  return m[c] || c.toLowerCase();
}


function studsText(s) {
  return { FER: "Fer (vissés)", MOULES: "Moulés", HYBRIDE: "Hybrides" }[s] || "À confirmer";
}


function euro(n) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2
  }).format(n);
}


function formatNote(n) {
  return Number.isInteger(n) ? String(n) : String(n).replace(".", ",");
}


function selectedSegment(name) {
  return document.querySelector(`.segmented[data-name="${name}"] .seg.active`).dataset.value;
}


/* =========================================================
   BOUTONS SEGMENTÉS
   ========================================================= */

document.querySelectorAll(".segmented").forEach(group => {
  group.addEventListener("click", e => {
    const btn = e.target.closest(".seg");
    if (!btn) return;
    group.querySelectorAll(".seg").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    if (group.dataset.name === "terrain" || group.dataset.name === "studs") updateStudsAdvice();
  });
});


function updateStudsAdvice() {
  const advice = $("studs-advice");
  if (!advice) return;
  const terrain = selectedSegment("terrain");
  const studs = selectedSegment("studs");
  if (terrain === "SYNTHETIQUE" && studs === "FER") {
    advice.textContent = "Attention : les crampons fer sont souvent interdits sur synthétique. Vérifie le règlement de ton club, des moulés sont plus sûrs.";
    advice.classList.add("warn");
    return;
  }
  advice.classList.remove("warn");
  if (studs !== "INCONNU") { advice.textContent = ""; return; }
  advice.textContent = {
    GRAS: "Crampons conseillés : fer (vissés), pour accrocher dans la boue. Les hybrides restent une bonne option.",
    SEC: "Crampons conseillés : moulés, plus confortables et plus sûrs sur terrain sec et dur.",
    SYNTHETIQUE: "Crampons conseillés : moulés. Les crampons fer sont souvent interdits sur synthétique.",
    INCONNU: "Crampons conseillés : hybrides (moulés et vissés), les plus polyvalents si le terrain change."
  }[terrain];
}


/* =========================================================
   PRIORITÉS
   ========================================================= */

function fillPriorities() {
  const selects = [$("priority1"), $("priority2"), $("priority3")];
  const defaults = ["ACCROCHE", "STABILITE", "CONFORT"];

  selects.forEach((sel, i) => {
    sel.innerHTML = CRITERIA
      .map(c => `<option value="${c}">${titleCriterion(c).replace(/^./, x => x.toUpperCase())}</option>`)
      .join("");
    sel.value = defaults[i];
  });

  selects.forEach(sel => sel.addEventListener("change", validatePriorityUI));
  validatePriorityUI();
}


function validatePriorityUI() {
  const vals = [$("priority1").value, $("priority2").value, $("priority3").value];
  const dup = new Set(vals).size !== 3;
  $("form-error").hidden = !dup;
  $("form-error").textContent = dup
    ? "Choisis trois priorités différentes pour obtenir une recommandation fiable."
    : "";
}


/* =========================================================
   PROFIL UTILISATEUR
   ========================================================= */

function profile() {
  return {
    position: selectedSegment("position"),
    style: selectedSegment("style"),
    weight: Number($("weight").value),
    public: selectedSegment("public"),
    terrain: selectedSegment("terrain"),
    studs: selectedSegment("studs"),
    level: selectedSegment("level"),
    foot: selectedSegment("foot"),
    budget: Number($("budget").value),
    brand: $("brand").value,
    priorities: [$("priority1").value, $("priority2").value, $("priority3").value]
  };
}


/* =========================================================
   BUDGET (identique à app.js)
   ========================================================= */

function budgetCompat(price, budget) {
  /* Dans le budget : compatibilité parfaite. */
  if (price <= budget) return 100;

  /* Jusqu'à +20 € : zone « Coup de cœur », de 100 à 80. */
  if (price <= budget + FLEX_BUDGET) {
    return 100 - ((price - budget) / FLEX_BUDGET) * 20;
  }

  /* Au-delà de la marge : pénalité beaucoup plus importante. */
  return Math.max(0, 80 - ((price - (budget + FLEX_BUDGET)) / FLEX_BUDGET) * 40);
}


function budgetStatus(price, budget) {
  if (price <= budget) return { text: mbpIcon("check", "ico-ok") + " Dans le budget", key: "in" };
  if (price <= budget + FLEX_BUDGET) return { text: mbpIcon("heart", "ico-heart") + " Coup de cœur", key: "heart" };
  return { text: mbpIcon("alert", "ico-warn") + " Hors budget", key: "out" };
}


/* =========================================================
   PONDÉRATION DU PROFIL
   ========================================================= */

function playerWeights(p) {
  const zero = Array(8).fill(0);
  const position = POSITION_MODS[p.position] || zero;
  const style = STYLE_MODS[p.style] || zero;
  const level = LEVEL_MODS[p.level] || zero;
  const weight = weightMods(p.weight);

  return CRITERIA.map((criterion, i) => {
    const priorityIndex = p.priorities.indexOf(criterion);
    const pm = priorityIndex >= 0 ? PRIORITY_MULT[priorityIndex] : 1;
    return Math.max(0.3, 1 + position[i] + style[i] + level[i] + weight[i]) * pm;
  });
}


/* =========================================================
   POINT À SAVOIR / POINTS FORTS
   ========================================================= */

function weakestMessage(scores) {
  const min = Math.min(...scores);
  if (min >= 8) return { text: mbpIcon("check", "ico-ok") + " Profil très équilibré", balanced: true };

  const c = CRITERIA[scores.indexOf(min)];
  const specific = {
    LEGERETE: mbpIcon("alert") + " Modèle plutôt lourd",
    DURABILITE: mbpIcon("alert") + " Durabilité plus limitée",
    PROTECTION: mbpIcon("alert") + " Protection légère",
    CONFORT: mbpIcon("alert") + " Confort un peu en retrait"
  };
  return {
    text: specific[c] || `${mbpIcon("alert")} ${titleCriterion(c).replace(/^./, x => x.toUpperCase())} en retrait`,
    balanced: false
  };
}


function strengths(scores) {
  return scores
    .map((v, i) => ({ v, i }))
    .sort((a, b) => b.v - a.v || a.i - b.i)
    .slice(0, 3)
    .map(x => CRITERIA[x.i]);
}


/* =========================================================
   CALCUL D'UNE CHAUSSURE
   ========================================================= */

function studsCompat(shoe, p) {
  if (p.studs !== "INCONNU") {
    let fit = (STUDS_FIT[p.studs] || {})[shoe.studs] ?? 60;
    /* Fer sur synthétique : souvent interdit, on ne le recommande pas. */
    if (p.terrain === "SYNTHETIQUE" && shoe.studs === "FER") fit = Math.min(fit, 20);
    return fit;
  }
  return (TERRAIN_FIT[p.terrain] || TERRAIN_FIT.INCONNU)[shoe.studs] ?? 60;
}


function compute(shoe, p) {
  const weights = playerWeights(p);
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const personalized = shoe.scores.reduce((sum, v, i) => sum + v * weights[i], 0) / weightSum;

  const surface = studsCompat(shoe, p);

  /* Pied : 100 si même chaussant ; 75 si chaussant voisin (un pied standard va bien dans un chaussant large,
   * fréquent chez les crampons d'avants) ; 50 si opposé (pied étroit dans un chaussant large, ou l'inverse). */
  const FOOT_ORDER = ["ETROIT", "STANDARD", "LARGE"];
  const gap = Math.abs(FOOT_ORDER.indexOf(shoe.foot) - FOOT_ORDER.indexOf(p.foot));
  const foot = shoe.foot === "UNIVERSEL" || gap === 0 ? 100 : gap === 1 ? 75 : 50;

  const hasBrandPreference = p.brand !== "AUCUNE";
  const brand = !hasBrandPreference || stripAccentsUpper(shoe.scoreBrand) === stripAccentsUpper(p.brand) ? 100 : 0;

  const budget = budgetCompat(shoe.price, p.budget);

  const final =
    personalized * 10 * FINAL_WEIGHTS.tech +
    surface * FINAL_WEIGHTS.surface +
    foot * FINAL_WEIGHTS.foot +
    brand * FINAL_WEIGHTS.brand +
    budget * FINAL_WEIGHTS.budget;

  const priorityNotes = p.priorities.map(c => shoe.scores[CRITERIA.indexOf(c)]);
  const avg = priorityNotes.reduce((a, b) => a + b, 0) / 3;
  const prefix =
    avg >= 9 ? "Correspondance exceptionnelle"
    : avg >= 8.5 ? "Excellente correspondance"
    : avg >= 8 ? "Très bonne correspondance"
    : "Bonne correspondance";

  const why =
    `${prefix} avec tes priorités : ` +
    `${titleCriterion(p.priorities[0])} (${formatNote(priorityNotes[0])}/10), ` +
    `${titleCriterion(p.priorities[1])} (${formatNote(priorityNotes[1])}/10) et ` +
    `${titleCriterion(p.priorities[2])} (${formatNote(priorityNotes[2])}/10).`;

  return {
    ...shoe,
    personalized,
    surfaceCompat: surface,
    footCompat: foot,
    brandCompat: brand,
    hasBrandPreference,
    budgetCompat: budget,
    final,
    priorityNotes,
    why,
    strengths: strengths(shoe.scores),
    watch: weakestMessage(shoe.scores),
    budgetStatus: budgetStatus(shoe.price, p.budget)
  };
}


/* Homme / femme / enfant : filtre de la base, sans effet sur le score.
 * Homme : modèles adultes ; femme : modèles adultes et modèles femme ; enfant : modèles enfant. */
function matchesPublic(shoe, who) {
  if (who === "ENFANT") return shoe.public === "ENFANT";
  if (who === "FEMME") return shoe.public === "ADULTE" || shoe.public === "FEMME";
  return shoe.public === "ADULTE";
}


/* =========================================================
   AFFICHAGE DES RÉSULTATS
   (remplacé par le Top 3 de top3-rugby.js)
   ========================================================= */

function render() {
  $("cards").innerHTML = rankedResults
    .slice(0, shownCount)
    .map((r, i) => `<article class="shoe-card ${i < 3 ? "rank" + (i + 1) : "other"}"><div class="shoe-name">${r.brand} ${r.name}</div><p>${Math.round(r.final)} / 100 · ${euro(r.price)}</p></article>`)
    .join("");
  $("more-btn").hidden = shownCount >= Math.min(6, rankedResults.length);
}


/* =========================================================
   SUIVI ANALYTICS DES CLICS PRODUITS / AFFILIATION
   ========================================================= */

document.addEventListener("click", e => {
  const link = e.target.closest(".product-link");
  if (!link || link.classList.contains("disabled")) return;

  const card = link.closest(".shoe-card");
  const productName = card?.querySelector(".shoe-name")?.textContent?.trim() || "";
  const productBrand = link.dataset.productBrand || "";
  const merchant = link.dataset.merchant || "";

  let rank = 0;
  if (card?.classList.contains("rank1")) rank = 1;
  else if (card?.classList.contains("rank2")) rank = 2;
  else if (card?.classList.contains("rank3")) rank = 3;

  if (typeof gtag !== "function") return;

  const href = link.href || "";
  const isRakuten = href.includes("click.linksynergy.com");
  const isAwin = href.includes("awin1.com");
  const isKwanko = href.includes("kwanko.com");
  const isAffiliate = isRakuten || isAwin || isKwanko;
  const affiliateNetwork = isKwanko ? "kwanko" : (isRakuten ? "rakuten" : (isAwin ? "awin" : ""));

  /* Événement envoyé pour TOUS les clics produits. */
  gtag("event", "product_click", {
    product_name: productName,
    brand: productBrand,
    rank: rank,
    sport: "rugby",
    affiliate: isAffiliate ? "yes" : "no",
    merchant: merchant
  });

  /* Événement supplémentaire pour les liens affiliés. */
  if (isAffiliate) {
    gtag("event", "affiliate_click", {
      product_name: productName,
      brand: productBrand,
      rank: rank,
      sport: "rugby",
      affiliate_network: affiliateNetwork,
      merchant: merchant
    });
  }
});


/* =========================================================
   ANALYTICS : DÉBUT DU QUESTIONNAIRE
   ========================================================= */

let questionnaireStarted = false;

function trackQuestionnaireStart() {
  if (questionnaireStarted) return;
  questionnaireStarted = true;
  if (typeof gtag === "function") gtag("event", "questionnaire_start", { sport: "rugby" });
}

["click", "input", "change"].forEach(eventName => {
  $("profile-form").addEventListener(eventName, trackQuestionnaireStart);
});


/* =========================================================
   VALIDATION DU QUESTIONNAIRE
   ========================================================= */

$("profile-form").addEventListener("submit", e => {
  e.preventDefault();
  validatePriorityUI();

  const p = profile();

  /* Les trois priorités doivent être différentes. */
  if (new Set(p.priorities).size !== 3) return;

  /* Budget obligatoire */
  if (!Number.isFinite(p.budget) || p.budget <= 0) {
    $("form-error").hidden = false;
    $("form-error").textContent = "Entre un budget supérieur à 0 €.";
    return;
  }

  $("form-error").hidden = true;

  const pool = SHOES.filter(s => matchesPublic(s, p.public));

  mbpLoader({
    steps: [
      "Analyse de ton profil de joueur",
      `Comparaison des ${pool.length} modèles rugby`,
      "Calcul de ton Top 3"
    ]
  }, () => {

    /* CALCUL ET CLASSEMENT (même départage que app.js) */
    rankedResults = pool
      .map(s => compute(s, p))
      .sort((a, b) => {
        const gap = b.final - a.final;
        if (Math.abs(gap) < 0.10) {
          if (b.budgetCompat !== a.budgetCompat) return b.budgetCompat - a.budgetCompat;
          if (b.surfaceCompat !== a.surfaceCompat) return b.surfaceCompat - a.surfaceCompat;
          if (b.footCompat !== a.footCompat) return b.footCompat - a.footCompat;
        }
        return gap;
      });

    shownCount = 3;
    render();

    /* ANALYTICS : RECOMMANDATIONS GÉNÉRÉES */
    if (typeof gtag === "function") {
      gtag("event", "recommendation_generated", {
        sport: "rugby",
        position: p.position,
        style: p.style,
        weight: p.weight,
        public: p.public,
        terrain: p.terrain,
        studs: p.studs,
        level: p.level,
        foot: p.foot,
        budget: p.budget,
        brand: p.brand,
        top1: rankedResults[0]?.name || "",
        top2: rankedResults[1]?.name || "",
        top3: rankedResults[2]?.name || ""
      });
    }

    const advised = p.studs !== "INCONNU" ? p.studs : ADVISED_STUDS[p.terrain];
    $("result-summary").textContent =
      `Crampons ${p.studs !== "INCONNU" ? "choisis" : "conseillés pour ton terrain"} : ${studsText(advised).toLowerCase()}.`;

    $("results-section").hidden = false;
    $("results-section").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});


/* =========================================================
   VOIR 3 AUTRES MODÈLES / MODIFIER LE PROFIL
   ========================================================= */

$("more-btn").addEventListener("click", () => {
  shownCount = 6;
  render();
});

$("edit-btn").addEventListener("click", () => {
  $("profile-section").scrollIntoView({ behavior: "smooth", block: "start" });
});


/* =========================================================
   INITIALISATION
   ========================================================= */

fillPriorities();
updateStudsAdvice();
