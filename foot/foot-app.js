/* Moteur MyBestPair — version Foot.
 * Même moteur que app.js (Basket) et rugby-app.js : même pondération finale, même marge
 * « coup de cœur » de 20 €, mêmes multiplicateurs de priorités et même départage des égalités.
 * Adaptations Foot : on raisonne par profil (poste, style de jeu, niveau) pour ajuster le poids
 * des 8 critères ; la part « surface » compare les crampons au terrain et au type de crampons choisi ;
 * homme / femme / enfant filtre la base. La commission n'intervient jamais.
 * Données : foot/shoes-foot.js (CRITERIA, SHOES, POSITION_MODS, STYLE_MODS, LEVEL_MODS).
 */
const MYBESTPAIR_VERSION = "1.0";

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

/* Catégories de crampons des modèles : FG (moulés, herbe sèche), MG (multi-terrain : herbe et synthétique),
 * SG (vissés, herbe grasse), TF (stabilisé). */

/* Crampons conseillés selon le terrain, quand le joueur répond « je ne sais pas » (sur 100).
 * Sec : moulés FG. Gras : vissés SG, ou multi-terrain. Synthétique : AG / multi-terrain (les vissés y sont souvent interdits).
 * Stabilisé : TF. */
const TERRAIN_FIT = {
  SEC: { FG: 100, MG: 95, SG: 50, TF: 35 },
  GRAS: { SG: 100, MG: 70, FG: 60, TF: 15 },
  SYNTHETIQUE: { MG: 100, TF: 70, FG: 60, SG: 10 },
  STABILISE: { TF: 100, MG: 50, FG: 30, SG: 10 },
  INCONNU: { MG: 100, FG: 85, SG: 60, TF: 60 }
};

/* Quand le joueur choisit son type de crampons : son choix d'abord, les multi-terrain restent proches.
 * AG (synthétique) : les modèles MG sont faits pour ; des FG dépannent mais s'usent plus vite. */
const STUDS_FIT = {
  FG: { FG: 100, MG: 90, SG: 45, TF: 30 },
  SG: { SG: 100, MG: 60, FG: 55, TF: 15 },
  MG: { MG: 100, FG: 80, SG: 35, TF: 40 },
  AG: { MG: 100, TF: 70, FG: 60, SG: 10 },
  TF: { TF: 100, MG: 55, FG: 35, SG: 10 }
};

const ADVISED_STUDS = { SEC: "FG", GRAS: "SG", SYNTHETIQUE: "AG", STABILISE: "TF", INCONNU: "MG" };

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
    TOUCHER: "toucher de balle",
    FRAPPE: "frappe",
    LEGERETE: "légèreté",
    DYNAMISME: "dynamisme",
    MAINTIEN: "maintien",
    CONFORT: "confort",
    DURABILITE: "durabilité"
  };
  return m[c] || c.toLowerCase();
}


function studsText(s) {
  return {
    FG: "Moulés FG (herbe sèche)",
    SG: "Vissés SG (herbe grasse)",
    MG: "Multi-terrain MG (herbe et synthétique)",
    AG: "AG ou multi-terrain (synthétique)",
    TF: "Stabilisé TF"
  }[s] || "À confirmer";
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
  if (terrain === "SYNTHETIQUE" && studs === "SG") {
    advice.textContent = "Attention : les crampons vissés sont souvent interdits sur synthétique. Vérifie le règlement de ton club : des AG ou multi-terrain sont plus sûrs.";
    advice.classList.add("warn");
    return;
  }
  advice.classList.remove("warn");
  if (studs !== "INCONNU") { advice.textContent = ""; return; }
  advice.textContent = {
    SEC: "Crampons conseillés : moulés FG, faits pour l’herbe naturelle sèche. Les multi-terrain (MG) vont aussi.",
    GRAS: "Crampons conseillés : vissés SG, pour accrocher dans l’herbe grasse et la boue. Les multi-terrain (MG) dépannent.",
    SYNTHETIQUE: "Crampons conseillés : AG ou multi-terrain (MG). Les vissés sont souvent interdits sur synthétique.",
    STABILISE: "Crampons conseillés : stabilisé (TF), avec de petits picots pour la terre et les terrains durs.",
    INCONNU: "Crampons conseillés : multi-terrain (MG), les plus polyvalents entre herbe et synthétique."
  }[terrain];
}


/* =========================================================
   PRIORITÉS
   ========================================================= */

function fillPriorities() {
  const selects = [$("priority1"), $("priority2"), $("priority3")];
  const defaults = ["ACCROCHE", "TOUCHER", "CONFORT"];

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

  return CRITERIA.map((criterion, i) => {
    const priorityIndex = p.priorities.indexOf(criterion);
    const pm = priorityIndex >= 0 ? PRIORITY_MULT[priorityIndex] : 1;
    return Math.max(0.3, 1 + position[i] + style[i] + level[i]) * pm;
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
    TOUCHER: mbpIcon("alert") + " Toucher de balle moins fin",
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
    /* Vissés sur synthétique : souvent interdits, on ne les recommande pas. */
    if (p.terrain === "SYNTHETIQUE" && shoe.studs === "SG") fit = Math.min(fit, 10);
    return fit;
  }
  return (TERRAIN_FIT[p.terrain] || TERRAIN_FIT.INCONNU)[shoe.studs] ?? 60;
}


function compute(shoe, p) {
  const weights = playerWeights(p);
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const personalized = shoe.scores.reduce((sum, v, i) => sum + v * weights[i], 0) / weightSum;

  const surface = studsCompat(shoe, p);

  /* Pied : 100 si même chaussant ; 75 si chaussant voisin ; 50 si opposé
   * (pied large dans une chaussure étroite, comme beaucoup de modèles vitesse, ou l'inverse). */
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
   (remplacé par le Top 3 de top3-foot.js)
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
    sport: "foot",
    affiliate: isAffiliate ? "yes" : "no",
    merchant: merchant
  });

  /* Événement supplémentaire pour les liens affiliés. */
  if (isAffiliate) {
    gtag("event", "affiliate_click", {
      product_name: productName,
      brand: productBrand,
      rank: rank,
      sport: "foot",
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
  if (typeof gtag === "function") gtag("event", "questionnaire_start", { sport: "foot" });
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
      `Comparaison des ${pool.length} modèles foot`,
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
        sport: "foot",
        position: p.position,
        style: p.style,
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
      `Crampons ${p.studs !== "INCONNU" ? "choisis" : "conseillés pour ton terrain"} : ${studsText(advised)}.`;

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
