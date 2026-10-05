/* Nouveau Top 3 MyBestPair — version Basket (podium + comparateur).
 * Remplace render() de app.js : même classement (compute + tri de app.js),
 * nouvel affichage. Utilise les styles de running/top3.css.
 * Le lien marchand garde .product-link dans un bloc .shoe-card.rankN avec .shoe-name :
 * le suivi GA4 (product_click / affiliate_click) de app.js continue de marcher.
 * S'installe au DOMContentLoaded, avant ou après app.js.
 */
(function () {
  const LABELS = {
    TRACTION: "Traction", AMORTI: "Amorti", REACTIVITE: "Réactivité", STABILITE: "Stabilité",
    MAINTIEN: "Maintien", LEGERETE: "Légèreté", CONFORT: "Confort", DURABILITE: "Durabilité"
  };
  const POSITIONS = { MENEUR: "Meneur", ARRIERE: "Arrière", AILIER: "Ailier", "AILIER FORT": "Ailier fort", PIVOT: "Pivot" };
  const STYLES = { RAPIDE: "Jeu rapide", PUISSANT: "Jeu puissant", EXPLOSIF: "Jeu explosif", POLYVALENT: "Jeu polyvalent", SHOOTEUR: "Shooteur", DEFENSEUR: "Défenseur" };
  const FEET = { ETROIT: "Pied étroit", STANDARD: "Pied standard", LARGE: "Pied large", UNIVERSEL: "Tous pieds" };
  const FEET_SHORT = { ETROIT: "Étroit", STANDARD: "Standard", LARGE: "Large", UNIVERSEL: "Tous pieds" };
  const SURFACES = { INDOOR: "Indoor", OUTDOOR: "Outdoor", "INDOOR/OUTDOOR": "Indoor + outdoor" };

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (n, d = 1) => Number(n).toFixed(d).replace(/\.0+$/, "").replace(".", ",");
  const price = (n) => (Number.isInteger(n) ? String(n) : Number(n).toFixed(2).replace(".", ",")) + " €";
  const slug = (v) => String(v).normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const score1 = (r) => Math.round(r.final * 10) / 10;
  const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  const CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  const BALL = '<svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5v19M5.3 5.3c3.2 3 3.2 10.4 0 13.4M18.7 5.3c-3.2 3-3.2 10.4 0 13.4"/></svg>';

  function shopName(url) {
    const u = String(url || "").toLowerCase();
    if (u.includes("linksynergy.com") || u.includes("decathlon.fr")) return "Decathlon";
    if (u.includes("awin1.com") || u.includes("basket-center.fr")) return "Basket Center";
    if (u.includes("basket4ballers.com")) return "Basket4Ballers";
    if (u.includes("nike.com")) return "Nike";
    if (u.includes("newbalance.fr")) return "New Balance";
    if (u.includes("wayofwade.com")) return "Way of Wade";
    if (u.includes("anta")) return "ANTA";
    if (u.includes("shinzo.paris")) return "Shinzo";
    return "le revendeur";
  }
  const fullName = (r) => (r.name.toUpperCase().startsWith(r.brand.toUpperCase() + " ") ? r.name : r.brand + " " + r.name);
  const shortName = (r) => (r.name.toUpperCase().startsWith(r.brand.toUpperCase() + " ") ? r.name.slice(r.brand.length).trim() : r.name);
  const note = (r, c) => r.scores[CRITERIA.indexOf(c)];

  function install() {
    if (typeof SHOES === "undefined" || typeof compute !== "function" || !document.getElementById("cards")) return;
    let sel = 0;

    function tags(list, p) {
      return list.map((r, i) => {
        if (i === 0) return "N°1 pour ton profil";
        const top = list.slice(0, 3);
        const uniqueBest = (val, higher) => {
          const vals = top.map(val);
          const b = higher ? Math.max(...vals) : Math.min(...vals);
          return i < 3 && vals[i] === b && vals.filter((v) => v === b).length === 1;
        };
        for (const c of p.priorities) if (uniqueBest((x) => note(x, c), true)) return "La meilleure en " + LABELS[c].toLowerCase();
        if (uniqueBest((x) => x.price, false)) return "Le meilleur prix du Top 3";
        if (i >= 3) return i + 1 + "e de ton classement";
        return "Aussi faite pour toi";
      });
    }

    function budgetChip(r, p) {
      if (r.price <= p.budget) return '<span class="t3-budget">Dans ton budget</span>';
      if (r.price <= p.budget + 20) return '<span class="t3-budget warn">Coup de cœur (+20 € max)</span>';
      return '<span class="t3-budget out">Hors budget</span>';
    }

    function card(r, i, p, tag) {
      const s = score1(r), deg = Math.round(s * 3.6);
      const bars = p.priorities.map((c) => {
        const v = note(r, c);
        return `<div class="t3-bar"><span>${esc(LABELS[c])}</span><div class="t3-track"><div class="t3-fill" style="width:${v * 10}%"></div></div><span style="text-align:right">${num(v)}</span></div>`;
      }).join("");
      const min = Math.min(...r.scores);
      const weak = min < 8 ? LABELS[CRITERIA[r.scores.indexOf(min)]] : "";
      const rankClass = i < 3 ? "rank" + (i + 1) : "other";
      const shop = shopName(r.link);
      const fiche = "modeles/" + slug(fullName(r)) + "/";
      const offer = r.link
        ? `<a class="product-link t3-cta" href="${esc(r.link)}" target="_blank" rel="noopener noreferrer sponsored">Voir chez ${esc(shop)} ${ARROW}</a>`
        : `<span class="product-link disabled t3-cta">Lien bientôt disponible</span>`;
      return `<article class="t3-card" id="t3-panel" role="tabpanel" aria-label="${esc(fullName(r))}">
        <div class="t3-plate t3-plate-text r${Math.min(i + 1, 3)}">
          <span class="t3-tag">${CHECK}${esc(tag)}</span>
          ${budgetChip(r, p)}
          <div class="t3-plate-brand">${BALL}<span>${esc(r.brand.toUpperCase())}</span></div>
        </div>
        <div class="t3-body">
          <div class="t3-head">
            <div><div class="t3-brand">${esc(r.brand.toUpperCase())} · BASKET</div><h3 class="t3-name">${esc(shortName(r))}</h3></div>
            <div class="t3-ring" style="background:conic-gradient(#195cff 0 ${deg}deg,#dfe6f5 ${deg}deg 360deg)" aria-label="Score ${num(s)} sur 100">
              <div class="t3-ring-in"><div class="t3-ring-val">${num(s)}</div><div class="t3-ring-max">/ 100</div></div>
            </div>
          </div>
          <div><div class="t3-sub">Sur tes 3 priorités</div>${bars}</div>
          <div class="t3-specs">
            <div class="t3-spec"><span>Surface</span><strong>${esc(SURFACES[r.surface] || r.surface)}</strong></div>
            <div class="t3-spec"><span>Pied</span><strong>${esc(FEET_SHORT[r.foot] || r.foot)}</strong></div>
            <div class="t3-spec"><span>Point fort</span><strong>${esc(LABELS[r.strengths[0]] || "")}</strong></div>
          </div>
          ${weak ? `<p class="t3-note"><b>À savoir :</b> ${esc(weak.toLowerCase())} en retrait (${num(min)}/10).</p>` : ""}
          <div class="t3-offer shoe-card t3-trk ${rankClass}">
            <span class="shoe-name" hidden>${esc(r.name)}</span>
            <div class="t3-offer-top">
              <div><div class="t3-offer-label">OÙ L'ACHETER</div><div class="t3-offer-meta">${esc(shop)} · coloris et pointures sur le site</div></div>
              <div class="t3-price">${price(r.price)}</div>
            </div>
            ${offer}
          </div>
          <a class="t3-fiche" href="${fiche}">Voir la fiche complète →</a>
        </div>
      </article>`;
    }

    function compare(top, p) {
      const cell = (txt, best, i) => `<div class="t3-cell${best ? " best" : ""}${i === sel ? " sel" : ""}">${txt}</div>`;
      const row = (lab, vals, bestIdx) => `<div class="t3-row"><div class="t3-row-label">${esc(lab)}</div>${vals.map((v, i) => cell(v, bestIdx.includes(i), i)).join("")}</div>`;
      const bestOf = (vals, higher) => {
        const b = higher ? Math.max(...vals) : Math.min(...vals);
        const idx = vals.map((v, i) => (v === b ? i : -1)).filter((i) => i >= 0);
        return idx.length === vals.length ? [] : idx;
      };
      const head = `<div class="t3-row head"><div></div>${top.map((r, i) => cell(esc(shortName(r)), false, i)).join("")}</div>`;
      const scores = top.map(score1), prices = top.map((r) => r.price);
      const pr = p.priorities.map((c) => { const v = top.map((r) => note(r, c)); return row(LABELS[c] + " /10", v.map((x) => num(x)), bestOf(v, true)); }).join("");
      return `<section class="t3-compare" aria-label="Comparer les 3 paires">
        <h3>Ton Top 3 en un coup d'œil</h3>
        <p>En bleu : la meilleure valeur du Top 3.</p>
        ${head}
        ${row("Score", scores.map((x) => num(x)), bestOf(scores, true))}
        ${row("Prix", prices.map(price), bestOf(prices, false))}
        ${pr}
        ${row("Surface", top.map((r) => esc(SURFACES[r.surface] || r.surface)), [])}
        ${row("Pied", top.map((r) => esc(FEET_SHORT[r.foot] || r.foot)), [])}
      </section>`;
    }

    window.render = function () {
      const p = profile();
      const list = rankedResults.slice(0, shownCount);
      if (!list.length) { document.getElementById("cards").innerHTML = ""; return; }
      if (sel >= list.length) sel = 0;
      const tagList = tags(list, p);
      const chips = [POSITIONS[p.position] || p.position, STYLES[p.style] || p.style, SURFACES[p.surface] || p.surface, FEET[p.foot] || p.foot, "Budget " + p.budget + " €"]
        .map((c) => `<span class="t3-chip">${esc(c)}</span>`).join("");
      const tabs = list.map((r, i) => `<button type="button" class="t3-tab" role="tab" aria-selected="${i === sel}" aria-controls="t3-panel" data-t3="${i}">
          <span class="t3-medal ${i < 3 ? "r" + (i + 1) : "rx"}">${i + 1}</span>
          <span class="t3-tab-brand">${esc(r.brand.toUpperCase())}</span>
          <span class="t3-tab-name">${esc(shortName(r))}</span>
          <span class="t3-tab-price">${price(r.price)}</span>
          <span class="t3-tab-score">${num(score1(r))}/100</span>
        </button>`).join("");
      const box = document.getElementById("cards");
      box.innerHTML = `<div class="t3 t3-basket">
        <div class="t3-band"><div class="t3-band-title">TON PROFIL</div><div class="t3-chips">${chips}</div></div>
        <div class="t3-tabs" role="tablist" aria-label="Choisir une paire">${tabs}</div>
        ${card(list[sel], sel, p, tagList[sel])}
        ${compare(rankedResults.slice(0, 3), p)}
        <p class="t3-legal">Certains liens sont affiliés : MyBestPair peut toucher une commission si tu achètes, sans surcoût pour toi. Le classement n'en dépend pas.</p>
      </div>`;
      box.querySelectorAll(".t3-tab").forEach((b) => b.addEventListener("click", () => {
        sel = Number(b.dataset.t3);
        window.render();
        const t = box.querySelector(".t3-tab[data-t3='" + sel + "']");
        if (t) t.focus({ preventScroll: true });
        if (typeof gtag === "function") gtag("event", "top3_tab", { sport: "basketball", rank: sel + 1, product_name: list[sel].name });
      }));
      const more = document.getElementById("more-btn");
      if (more) more.hidden = shownCount >= Math.min(6, rankedResults.length);
    };

    /* Nouveau calcul = retour sur la n°1. */
    const form = document.getElementById("profile-form");
    if (form) form.addEventListener("submit", () => { sel = 0; }, true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
})();
