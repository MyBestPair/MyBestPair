/* Moteur MyBestPair — version Padel.
 * Même moteur que app.js (Basket) : même pondération finale, même marge « coup de cœur »
 * de 20 €, mêmes multiplicateurs de priorités et même départage des égalités.
 * Adaptations Padel : la part « surface » compare la semelle au type de terrain,
 * le niveau, la fréquence et le style de jeu ajustent le poids des 8 critères,
 * et le choix homme / femme filtre la base. La commission n'intervient jamais.
 * Données : padel/shoes-padel.js (CRITERIA, SHOES, STYLE_MODS, LEVEL_MODS, FREQUENCY_MODS).
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

/* Compatibilité semelle / terrain, sur 100.
 * Gazon sablé extérieur : les chevrons accrochent le mieux dans le sable.
 * Indoor : terrains souvent moins sablés, la semelle mixte est la plus sûre.
 * Je ne sais pas : la mixte reste la plus polyvalente. */
const SOLE_FIT = {
  EXTERIEUR: { CHEVRONS: 100, MIXTE: 80, OMNI: 40 },
  INDOOR: { MIXTE: 100, OMNI: 85, CHEVRONS: 80 },
  INCONNU: { MIXTE: 100, CHEVRONS: 80, OMNI: 60 }
};
const SOLE_UNKNOWN_FIT = 60;
const ADVISED_SOLE = { EXTERIEUR: "CHEVRONS", INDOOR: "MIXTE", INCONNU: "MIXTE" };

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
    ADHERENCE: "adhérence",
    AMORTI: "amorti",
    STABILITE: "stabilité",
    MAINTIEN: "maintien",
    LEGERETE: "légèreté",
    CONFORT: "confort",
    DURABILITE: "durabilité",
    REACTIVITE: "réactivité"
  };
  return m[c] || c.toLowerCase();
}


function soleText(s) {
  return { CHEVRONS: "Chevrons", OMNI: "Omni", MIXTE: "Mixte" }[s] || "À confirmer";
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
    if (group.dataset.name === "surface") updateSoleAdvice();
  });
});


function updateSoleAdvice() {
  const advice = $("sole-advice");
  if (!advice) return;
  const surface = selectedSegment("surface");
  advice.textContent = {
    EXTERIEUR: "Semelle conseillée : chevrons, pour accrocher dans le sable du gazon synthétique.",
    INDOOR: "Semelle conseillée : mixte (chevrons + plots), la plus sûre sur les terrains couverts, souvent moins sablés.",
    INCONNU: "Semelle conseillée : mixte, la plus polyvalente si tu changes de club ou de terrain."
  }[surface];
}


/* =========================================================
   PRIORITÉS
   ========================================================= */

function fillPriorities() {
  const selects = [$("priority1"), $("priority2"), $("priority3")];
  const defaults = ["ADHERENCE", "STABILITE", "CONFORT"];

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
    level: selectedSegment("level"),
    frequency: selectedSegment("frequency"),
    surface: selectedSegment("surface"),
    style: $("style").value,
    foot: selectedSegment("foot"),
    budget: Number($("budget").value),
    brand: $("brand").value,
    gender: selectedSegment("gender"),
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
  const style = STYLE_MODS[p.style] || zero;
  const level = LEVEL_MODS[p.level] || zero;
  const frequency = FREQUENCY_MODS[p.frequency] || zero;

  return CRITERIA.map((criterion, i) => {
    const priorityIndex = p.priorities.indexOf(criterion);
    const pm = priorityIndex >= 0 ? PRIORITY_MULT[priorityIndex] : 1;
    return (1 + style[i] + level[i] + frequency[i]) * pm;
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
    AMORTI: mbpIcon("alert") + " Amorti plutôt ferme",
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

function compute(shoe, p) {
  const weights = playerWeights(p);
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const personalized = shoe.scores.reduce((sum, v, i) => sum + v * weights[i], 0) / weightSum;

  const surface = (SOLE_FIT[p.surface] || SOLE_FIT.INCONNU)[shoe.sole] ?? SOLE_UNKNOWN_FIT;

  const foot = shoe.foot === "UNIVERSEL" || shoe.foot === p.foot ? 100 : 50;

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


/* Homme / femme / peu importe : filtre de la base, sans effet sur le score. */
function matchesGender(shoe, gender) {
  if (gender === "FEMME") return shoe.gender !== "HOMME";
  if (gender === "HOMME") return shoe.gender !== "FEMME";
  return true;
}


/* =========================================================
   AFFICHAGE DES RÉSULTATS
   (remplacé par le Top 3 de top3-padel.js)
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
    sport: "padel",
    affiliate: isAffiliate ? "yes" : "no",
    merchant: merchant
  });

  /* Événement supplémentaire pour les liens affiliés. */
  if (isAffiliate) {
    gtag("event", "affiliate_click", {
      product_name: productName,
      brand: productBrand,
      rank: rank,
      sport: "padel",
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
  if (typeof gtag === "function") gtag("event", "questionnaire_start", { sport: "padel" });
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

  /* « Femme » : la version femme (lien, prix, photo) remplace la version homme quand elle existe. */
  const pool = SHOES
    .filter(s => matchesGender(s, p.gender))
    .map(s => (p.gender === "FEMME" && s.women ? { ...s, ...s.women } : s));

  mbpLoader({
    steps: [
      "Analyse de ton profil de joueur",
      `Comparaison des ${pool.length} modèles padel`,
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
        sport: "padel",
        level: p.level,
        frequency: p.frequency,
        surface: p.surface,
        style: p.style,
        foot: p.foot,
        budget: p.budget,
        brand: p.brand,
        gender: p.gender,
        top1: rankedResults[0]?.name || "",
        top2: rankedResults[1]?.name || "",
        top3: rankedResults[2]?.name || ""
      });
    }

    $("result-summary").textContent =
      `Semelle conseillée pour ton terrain : ${soleText(ADVISED_SOLE[p.surface]).toLowerCase()}.`;

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
updateSoleAdvice();
