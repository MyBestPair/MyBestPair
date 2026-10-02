/* Éléments d'interface partagés : icônes SVG (icons.svg) et écran de chargement. */
(function () {
  const base = new URL(".", document.currentScript.src).href;
  const sprite = base + "icons.svg";

  /* Icône SVG du sprite, ex. mbpIcon("trophy") ou mbpIcon("alert", "ico-warn"). */
  window.mbpIcon = function (name, extraClass) {
    return `<svg class="ico${extraClass ? " " + extraClass : ""}" aria-hidden="true" focusable="false"><use href="${sprite}#${name}"></use></svg>`;
  };

  /* Pastille de classement 1 / 2 / 3. */
  window.mbpRank = function (n) {
    const variant = n >= 1 && n <= 3 ? n : "n";
    return `<span class="rank-badge rank-badge-${variant}" aria-hidden="true">${n}</span>`;
  };

  let running = false;

  /*
   * Affiche l'écran « Analyse de ton profil » puis exécute done().
   * options : { title, subtitle, steps: [texte, ...], duration (ms) }
   */
  window.mbpLoader = function (options, done) {
    if (running) return;
    running = true;

    const opts = options || {};
    const steps = opts.steps || [
      "Analyse de ton profil",
      "Comparaison des modèles",
      "Calcul de ton Top 3"
    ];
    const reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduceMotion ? 600 : (opts.duration || 2000);

    const el = document.createElement("div");
    el.className = "mbp-loader";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.innerHTML = `
      <div class="mbp-loader-card">
        <div class="mbp-loader-stage" aria-hidden="true">
          <span class="mbp-loader-speed"></span>
          <span class="mbp-loader-speed"></span>
          <span class="mbp-loader-speed"></span>
          <img class="mbp-loader-shoe" src="${base}shoe-realistic.webp" alt="" width="150" height="78">
          <span class="mbp-loader-ground"></span>
        </div>
        <p class="mbp-loader-title">${opts.title || "On cherche ta meilleure paire…"}</p>
        <p class="mbp-loader-sub">${opts.subtitle || "MyBestPair compare ton profil à chaque modèle."}</p>
        <div class="mbp-loader-bar"><span></span></div>
        <ul class="mbp-loader-steps">
          ${steps.map(s => `<li>${window.mbpIcon("check")}<span>${s}</span></li>`).join("")}
        </ul>
      </div>`;

    document.body.appendChild(el);
    document.body.classList.add("mbp-loading");

    const bar = el.querySelector(".mbp-loader-bar span");
    const items = el.querySelectorAll(".mbp-loader-steps li");
    bar.style.transitionDuration = duration + "ms";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add("is-visible");
        bar.style.width = "100%";
      });
    });

    const stepTime = duration / items.length;
    items.forEach((li, i) => {
      setTimeout(() => {
        if (i > 0) {
          items[i - 1].classList.remove("is-active");
          items[i - 1].classList.add("is-done");
        }
        li.classList.add("is-active");
      }, i * stepTime);
    });

    setTimeout(() => {
      const last = items[items.length - 1];
      if (last) {
        last.classList.remove("is-active");
        last.classList.add("is-done");
      }
    }, duration - 120);

    setTimeout(() => {
      document.body.classList.remove("mbp-loading");
      try {
        done();
      } finally {
        el.classList.remove("is-visible");
        setTimeout(() => {
          el.remove();
          running = false;
        }, 260);
      }
    }, duration + 150);
  };
})();
