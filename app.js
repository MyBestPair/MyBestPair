const $ = (id) => document.getElementById(id);

const FLEX_BUDGET = 20;

const FINAL_WEIGHTS = {
  tech: 0.77,
  surface: 0.10,
  foot: 0.08,
  brand: 0.05
};

const PRIORITY_MULT = [1.5, 1.25, 1.1];

let rankedResults = [];
let shownCount = 3;


/* =========================================================
   OUTILS
========================================================= */

function stripAccentsUpper(s) {
  return String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}


function titleCriterion(c) {
  const m = {
    TRACTION: "traction",
    AMORTI: "amorti",
    REACTIVITE: "réactivité",
    STABILITE: "stabilité",
    MAINTIEN: "maintien",
    LEGERETE: "légèreté",
    CONFORT: "confort",
    DURABILITE: "durabilité"
  };

  return m[c] || c.toLowerCase();
}


function euro(n) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2
  }).format(n);
}


function formatNote(n) {
  return Number.isInteger(n)
    ? String(n)
    : String(n).replace(".", ",");
}


function selectedSegment(name) {
  return document.querySelector(
    `.segmented[data-name="${name}"] .seg.active`
  ).dataset.value;
}


/* =========================================================
   ANALYTICS — DÉBUT DU QUESTIONNAIRE
========================================================= */

let questionnaireStarted = false;

function trackQuestionnaireStart() {

  if (questionnaireStarted) return;

  questionnaireStarted = true;

  if (typeof gtag === "function") {

    gtag("event", "questionnaire_start", {
      sport: "basketball"
    });

  }

}


/* =========================================================
   BOUTONS SEGMENTÉS
========================================================= */

document.querySelectorAll(".segmented").forEach(group => {

  group.addEventListener("click", e => {

    const btn = e.target.closest(".seg");

    if (!btn) return;

    trackQuestionnaireStart();

    group
      .querySelectorAll(".seg")
      .forEach(x => x.classList.remove("active"));

    btn.classList.add("active");

  });

});


/* =========================================================
   PRIORITÉS
========================================================= */

function fillPriorities() {

  const selects = [
    $("priority1"),
    $("priority2"),
    $("priority3")
  ];

  const defaults = [
    "TRACTION",
    "LEGERETE",
    "REACTIVITE"
  ];

  selects.forEach((sel, i) => {

    sel.innerHTML = CRITERIA
      .map(c =>
        `<option value="${c}">
          ${titleCriterion(c).replace(/^./, x => x.toUpperCase())}
        </option>`
      )
      .join("");

    sel.value = defaults[i];

  });


  selects.forEach(sel => {

    sel.addEventListener("change", () => {

      trackQuestionnaireStart();

      validatePriorityUI();

    });

  });


  validatePriorityUI();

}


function validatePriorityUI() {

  const vals = [
    $("priority1").value,
    $("priority2").value,
    $("priority3").value
  ];

  const dup = new Set(vals).size !== 3;

  $("form-error").hidden = !dup;

  $("form-error").textContent = dup
    ? "Choisis trois priorités différentes pour obtenir une recommandation fiable."
    : "";

}


/* =========================================================
   PROFIL
========================================================= */

function profile() {

  return {

    position: $("position").value,

    surface: selectedSegment("surface"),

    budget: Number($("budget").value),

    foot: selectedSegment("foot"),

    brand: $("brand").value,

    style: $("style").value,

    priorities: [
      $("priority1").value,
      $("priority2").value,
      $("priority3").value
    ]

  };

}


/* =========================================================
   BUDGET
========================================================= */

function budgetCompat(price, budget) {

  if (price <= budget) return 100;

  if (price <= budget + FLEX_BUDGET) {

    return (
      100 -
      ((price - budget) / FLEX_BUDGET) * 20
    );

  }

  return Math.max(
    0,
    80 -
      ((price - (budget + FLEX_BUDGET)) / FLEX_BUDGET) * 40
  );

}


function budgetStatus(price, budget) {

  if (price <= budget) {

    return {
      text: "✅ Dans le budget",
      key: "in"
    };

  }

  if (price <= budget + FLEX_BUDGET) {

    return {
      text: "❤️ Coup de cœur",
      key: "heart"
    };

  }

  return {
    text: "⚠️ Hors budget",
    key: "out"
  };

}


/* =========================================================
   PONDÉRATION
========================================================= */

function playerWeights(p) {

  const mods =
    STYLE_MODS[p.style] ||
    Array(8).fill(0);

  return CRITERIA.map((criterion, i) => {

    const priorityIndex =
      p.priorities.indexOf(criterion);

    const pm =
      priorityIndex >= 0
        ? PRIORITY_MULT[priorityIndex]
        : 1;

    return (1 + mods[i]) * pm;

  });

}


/* =========================================================
   POINT À SAVOIR
========================================================= */

function weakestMessage(scores) {

  const min = Math.min(...scores);

  if (min >= 8) {

    return {
      text: "💚 Profil très équilibré",
      balanced: true
    };

  }

  const idx = scores.indexOf(min);

  const c = CRITERIA[idx];

  const specific = {

    LEGERETE:
      "⚠️ Modèle plutôt lourd",

    DURABILITE:
      "⚠️ Durabilité plus limitée",

    AMORTI:
      "⚠️ Amorti plutôt ferme",

    CONFORT:
      "⚠️ Confort un peu en retrait"

  };

  return {

    text:
      specific[c] ||
      `⚠️ ${titleCriterion(c).replace(/^./, x => x.toUpperCase())} en retrait`,

    balanced: false

  };

}


/* =========================================================
   POINTS FORTS
========================================================= */

function strengths(scores) {

  return scores
    .map((v, i) => ({
      v,
      i
    }))
    .sort(
      (a, b) =>
        b.v - a.v ||
        a.i - b.i
    )
    .slice(0, 3)
    .map(x => CRITERIA[x.i]);

}


/* =========================================================
   CALCUL DU SCORE
========================================================= */

function compute(shoe, p) {

  const weights =
    playerWeights(p);

  const weightSum =
    weights.reduce(
      (a, b) => a + b,
      0
    );

  const personalized =

    shoe.scores.reduce(
      (sum, v, i) =>
        sum + v * weights[i],
      0
    ) / weightSum;


  const surface =

    shoe.surface === "INDOOR/OUTDOOR" ||
    shoe.surface === p.surface

      ? 100
      : 0;


  const foot =

    shoe.foot === "UNIVERSEL" ||
    shoe.foot === p.foot

      ? 100
      : 50;


  const hasBrandPreference =
    p.brand !== "AUCUNE";


  const brand =

    !hasBrandPreference ||

    stripAccentsUpper(shoe.scoreBrand) ===
    stripAccentsUpper(p.brand)

      ? 100
      : 0;


  const final =

    personalized *
      10 *
      FINAL_WEIGHTS.tech +

    surface *
      FINAL_WEIGHTS.surface +

    foot *
      FINAL_WEIGHTS.foot +

    brand *
      FINAL_WEIGHTS.brand;


  const priorityNotes =

    p.priorities.map(
      c =>
        shoe.scores[
          CRITERIA.indexOf(c)
        ]
    );


  const avg =

    priorityNotes.reduce(
      (a, b) => a + b,
      0
    ) / 3;


  const prefix =

    avg >= 9
      ? "Correspondance exceptionnelle"

      : avg >= 8.5
      ? "Excellente correspondance"

      : avg >= 8
      ? "Très bonne correspondance"

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

    final,

    priorityNotes,

    why,

    strengths:
      strengths(shoe.scores),

    watch:
      weakestMessage(shoe.scores),

    budgetStatus:
      budgetStatus(
        shoe.price,
        p.budget
      )

  };

}


/* =========================================================
   TEXTES
========================================================= */

function surfaceText(s) {

  return s === "INDOOR/OUTDOOR"
    ? "Indoor / Outdoor"

    : s === "INDOOR"
    ? "Indoor"

    : "Outdoor";

}


function footText(v) {

  return v >= 90
    ? "Excellent"

    : v >= 75
    ? "Compatible"

    : v >= 60
    ? "Correct"

    : "Peu adapté";

}


function brandText(v) {

  return v >= 90
    ? "Excellente"

    : v >= 75
    ? "Très bonne"

    : v >= 60
    ? "Bonne"

    : "Faible";

}


function surfaceFit(v) {

  return v >= 90
    ? "✅ Idéale"

    : v >= 75
    ? "👍 Très adaptée"

    : v >= 60
    ? "🟡 Compatible"

    : "⚠️ Peu adaptée";

}


/* =========================================================
   CARTES — DESIGN ORIGINAL
========================================================= */

function cardHTML(r, idx) {

  const rank = idx + 1;

  const klass =
    rank === 1
      ? "rank1"

      : rank === 2
      ? "rank2"

      : rank === 3
      ? "rank3"

      : "";


  const medal =
    rank === 1
      ? "🥇"

      : rank === 2
      ? "🥈"

      : rank === 3
      ? "🥉"

      : `#${rank}`;


  const recommendationLabel =
    rank === 1
      ? "TA RECOMMANDATION"

      : rank === 2
      ? "2e RECOMMANDATION"

      : rank === 3
      ? "3e RECOMMANDATION"

      : `${rank}e RECOMMANDATION`;


  const productName =
    r.name || r.modele || "";


  const link = r.link

    ? `
      <a
        class="product-link"
        href="${r.link}"
        target="_blank"
        rel="noopener sponsored"
        data-product-name="${productName}"
        data-product-brand="${r.brand || r.scoreBrand || ""}"
        data-rank="${rank}"
      >
        👟 Voir les coloris & disponibilités
      </a>
    `

    : `
      <span class="product-link disabled">
        Lien bientôt disponible
      </span>
    `;


  return `

    <article class="shoe-card ${klass}">

      <div class="recommendation-label">
        ${medal} ${recommendationLabel}
      </div>


      <div class="shoe-content">


        <div class="shoe-header">

          <div>

            <h3 class="shoe-name">
              ${productName}
            </h3>

            <div class="shoe-brand">
              ${r.brand || r.scoreBrand || ""}
            </div>

          </div>


          <div class="score">

            <strong>
              ${r.final.toFixed(1)}
            </strong>

            <span>
              /100
            </span>

            <small>
              SCORE MYBESTPAIR
            </small>

          </div>

        </div>


        <div class="price-row">

          <strong class="price">
            ${euro(r.price)}
          </strong>

          <span
            class="budget-status ${r.budgetStatus.key}"
          >
            ${r.budgetStatus.text}
          </span>

        </div>


        <div class="compatibility">

          <div class="info">

            🏀 Surface :

            <strong>
              ${surfaceText(r.surface)}
            </strong>

          </div>


          <div class="info">

            👟 Compatibilité surface :

            <strong>
              ${surfaceFit(r.surfaceCompat)}
            </strong>

          </div>


          <div class="info">

            🦶 Compatibilité pied :

            <strong>
              ${footText(r.footCompat)}
            </strong>

          </div>


          <div class="info">

            ⭐ Affinité marque :

            <strong>

              ${
                r.hasBrandPreference

                  ? brandText(
                      r.brandCompat
                    )

                  : "Aucune préférence"
              }

            </strong>

          </div>

        </div>


        <div class="analysis">


          <div class="strengths">

            <strong>
              ✅ POINTS FORTS
            </strong>

            <br>

            ${
              r.strengths

                .map(titleCriterion)

                .map(
                  x => x.toUpperCase()
                )

                .join(" · ")
            }

          </div>


          <div
            class="watch ${
              r.watch.balanced
                ? "balanced"
                : ""
            }"
          >

            ${r.watch.text}

          </div>


          <div class="why">

            <strong>
              💡 Pourquoi cette chaussure ?
            </strong>

            <br>

            ${r.why}

          </div>


        </div>


        ${link}


      </div>

    </article>

  `;

}


/* =========================================================
   AFFICHAGE
========================================================= */

function render() {

  $("cards").innerHTML =

    rankedResults

      .slice(
        0,
        shownCount
      )

      .map(cardHTML)

      .join("");


  $("more-btn").hidden =

    shownCount >=
    Math.min(
      6,
      rankedResults.length
    );

}


/* =========================================================
   ANALYTICS — CLIC PRODUIT / AFFILIATION
========================================================= */

document.addEventListener(
  "click",
  e => {

    const link =
      e.target.closest(
        ".product-link"
      );


    if (!link) return;


    if (
      link.classList.contains(
        "disabled"
      )
    ) return;


    if (
      typeof gtag !== "function"
    ) return;


    const productName =
      link.dataset.productName || "";


    const productBrand =
      link.dataset.productBrand || "";


    const rank =
      Number(
        link.dataset.rank || 0
      );


    const href =
      link.href || "";


    const isRakuten =
      href.includes(
        "click.linksynergy.com"
      );


    const isAwin =
      href.includes(
        "awin1.com"
      );


    const isKwanko =

      href.includes(
        "zof.endurance-store.fr"
      ) ||

      href.includes(
        "kwanko.com"
      );


    const isAffiliate =
      isRakuten ||
      isAwin ||
      isKwanko;


    let affiliateNetwork = "";


    if (isKwanko) {

      affiliateNetwork =
        "kwanko";

    }

    else if (isRakuten) {

      affiliateNetwork =
        "rakuten";

    }

    else if (isAwin) {

      affiliateNetwork =
        "awin";

    }


    gtag(
      "event",
      "product_click",
      {

        product_name:
          productName,

        product_brand:
          productBrand,

        rank:
          rank,

        sport:
          "basketball",

        affiliate:
          isAffiliate
            ? "yes"
            : "no"

      }
    );


    if (isAffiliate) {

      gtag(
        "event",
        "affiliate_click",
        {

          product_name:
            productName,

          product_brand:
            productBrand,

          rank:
            rank,

          sport:
            "basketball",

          affiliate_network:
            affiliateNetwork

        }
      );

    }

  }
);


/* =========================================================
   ANALYTICS — INTERACTIONS QUESTIONNAIRE
========================================================= */

const profileForm =
  $("profile-form");


if (profileForm) {

  profileForm.addEventListener(
    "click",
    trackQuestionnaireStart
  );

  profileForm.addEventListener(
    "input",
    trackQuestionnaireStart
  );

  profileForm.addEventListener(
    "change",
    trackQuestionnaireStart
  );

}


/* =========================================================
   VALIDATION
========================================================= */

$("profile-form")
  .addEventListener(
    "submit",
    e => {

      e.preventDefault();


      trackQuestionnaireStart();


      validatePriorityUI();


      const p =
        profile();


      if (
        new Set(
          p.priorities
        ).size !== 3
      )

        return;


      if (
        !Number.isFinite(
          p.budget
        ) ||
        p.budget <= 0
      ) {

        $("form-error").hidden =
          false;

        $("form-error").textContent =
          "Entre un budget supérieur à 0 €.";

        return;

      }


      $("form-error").hidden =
        true;


      rankedResults =

        SHOES

          .map(
            s => compute(
              s,
              p
            )
          )

          .sort(
            (a, b) =>
              b.final -
              a.final
          );


      shownCount = 3;


      render();


      /* =====================================================
         ANALYTICS — RECOMMANDATION GÉNÉRÉE
      ===================================================== */

      if (
        typeof gtag ===
        "function"
      ) {

        gtag(
          "event",
          "recommendation_generated",
          {

            sport:
              "basketball",

            position:
              p.position,

            surface:
              p.surface,

            budget:
              p.budget,

            foot:
              p.foot,

            brand:
              p.brand,

            top_1:
              rankedResults[0]?.name ||
              rankedResults[0]?.modele ||
              "",

            top_2:
              rankedResults[1]?.name ||
              rankedResults[1]?.modele ||
              "",

            top_3:
              rankedResults[2]?.name ||
              rankedResults[2]?.modele ||
              ""

          }
        );

      }


      $("result-summary")
        .textContent =

          `Profil : ${
            p.position.toLowerCase()
          } · ` +

          `${
            p.surface.toLowerCase()
          } · ` +

          `${euro(
            p.budget
          )} · ` +

          `pied ${
            p.foot.toLowerCase()
          }`;


      $("results-section").hidden =
        false;


      $("results-section")
        .scrollIntoView(
          {

            behavior:
              "smooth",

            block:
              "start"

          }
        );

    }
  );


/* =========================================================
   VOIR 3 AUTRES MODÈLES
========================================================= */

$("more-btn")
  .addEventListener(
    "click",
    () => {

      shownCount = 6;

      render();

    }
  );


/* =========================================================
   MODIFIER MON PROFIL
========================================================= */

$("edit-btn")
  .addEventListener(
    "click",
    () => {

      $("profile-section")
        .scrollIntoView(
          {

            behavior:
              "smooth",

            block:
              "start"

          }
        );

    }
  );


/* =========================================================
   INITIALISATION
========================================================= */

fillPriorities();
