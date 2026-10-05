/* Nouveau Top 3 MyBestPair (podium + comparateur).
 * Chargé après route-app.js : remplace showResults() pour afficher le Top 3
 * au nouveau format. Le calcul des scores (calculate) et le choix des offres
 * (selectedMerchantOffers) restent ceux de route-app.js.
 * Les liens marchands gardent la classe .shoe-link et leurs data-* :
 * le suivi GA4 (product_click / affiliate_click) de route-app.js continue de marcher.
 */
(function () {
  if (typeof SHOES === "undefined" || typeof calculate !== "function") return;

  const PHOTOS = {"ASICS Novablast 6": "https://photo.i-run.fr/asics-novablast-6-chaussures-homme-867790-1-gs.jpg", "ASICS Superblast 3": "https://photo.i-run.fr/asics-superblast-3-chaussures-homme-859621-1-gs.jpg", "ASICS Magic Speed 5": "https://photo.i-run.fr/asics-magic-speed-5-chaussures-homme-835266-1-gs.jpg", "Nike Pegasus 42": "https://photo.i-run.fr/nike-pegasus-42-chaussures-homme-855256-1-gs.jpg", "Nike Vomero Plus": "https://photo.i-run.fr/nike-vomero-plus-chaussures-homme-799236-1-gs.jpg", "Adidas Adizero EVO SL": "https://photo.i-run.fr/adidas-adizero-evo-sl-chaussures-homme-829990-1-gs.jpg", "Adidas Adios Pro 4": "https://photo.i-run.fr/adidas-adizero-adios-pro-4-chaussures-homme-767704-1-gs.jpg", "HOKA Clifton 11": "https://photo.i-run.fr/hoka-one-one-clifton-11-chaussures-homme-870809-1-gs.jpg", "HOKA Mach 7": "https://photo.i-run.fr/hoka-one-one-mach-7-chaussures-homme-843600-1-gs.jpg", "HOKA Bondi 9": "https://photo.i-run.fr/hoka-one-one-bondi-9-chaussures-homme-766108-1-gs.jpg", "Saucony Ride 19": "https://photo.i-run.fr/saucony-ride-19-chaussures-homme-829999-1-gs.jpg", "Saucony Endorphin Speed 5": "https://photo.i-run.fr/saucony-endorphin-speed-5-chaussures-homme-837045-1-gs.jpg", "New Balance 1080 v15": "https://photo.i-run.fr/new-balance-1080-v15-chaussures-homme-830954-1-gs.jpg", "Brooks Adrenaline GTS 25": "https://photo.i-run.fr/brooks-adrenaline-gts-25-chaussures-homme-825737-1-gs.jpg", "PUMA Deviate Nitro 4": "https://photo.i-run.fr/puma-deviate-nitro-4-chaussures-homme-840511-1-gs.jpg", "PUMA Fast-R Nitro Elite 3": "https://photo.i-run.fr/puma-fast-r-nitro-elite-3-chaussures-homme-813562-1-gs.jpg", "Mizuno Wave Rider 29": "https://photo.i-run.fr/mizuno-wave-rider-29-chaussures-homme-837298-1-gs.jpg", "Mizuno Neo Vista 2": "https://photo.i-run.fr/mizuno-neo-vista-2-chaussures-homme-837329-1-gs.jpg", "Nike Vomero 18": "https://photo.i-run.fr/nike-vomero-18-chaussures-homme-784310-1-gs.jpg", "Nike Structure 26": "https://photo.i-run.fr/nike-structure-26-chaussures-homme-792284-1-gs.jpg", "Nike Zoom Fly 6": "https://photo.i-run.fr/nike-zoom-fly-6-chaussures-homme-784229-1-gs.jpg", "ASICS Gel-Nimbus 28": "https://photo.i-run.fr/asics-gel-nimbus-28-chaussures-homme-828221-1-gs.jpg", "ASICS Gel-Kayano 32": "https://photo.i-run.fr/asics-gel-kayano-32-chaussures-homme-787699-1-gs.jpg", "ASICS GT-2000 14": "https://photo.i-run.fr/asics-gt-2000-14-chaussures-homme-799877-1-gs.jpg", "ASICS Metaspeed Sky Tokyo": "https://photo.i-run.fr/asics-metaspeed-sky-tokyo-chaussures-homme-795421-1-gs.jpg", "Adidas Adizero Boston 13": "https://photo.i-run.fr/adidas-adizero-boston-13-chaussures-homme-788689-1-gs.jpg", "Adidas Supernova Rise 3": "https://photo.i-run.fr/adidas-supernova-rise-3-chaussures-homme-825929-1-gs.jpg", "Adidas Adistar 4": "https://photo.i-run.fr/adidas-adistar-4-chaussures-homme-837268-1-gs.jpg", "Adidas Adizero Adios 9": "https://photo.i-run.fr/adidas-adizero-adios-9-chaussures-homme-834577-1-gs.jpg", "Brooks Ghost 17": "https://photo.i-run.fr/brooks-ghost-17-chaussures-homme-826118-1-gs.jpg", "Brooks Glycerin 23": "https://photo.i-run.fr/brooks-glycerin-23-chaussures-homme-829739-1-gs.jpg", "Brooks Hyperion Max 3": "https://photo.i-run.fr/brooks-hyperion-max-3-chaussures-homme-792381-1-gs.jpg", "Brooks Ghost Max 3": "https://photo.i-run.fr/brooks-ghost-max-3-chaussures-homme-798957-1-gs.jpg", "Saucony Triumph 23": "https://photo.i-run.fr/saucony-triumph-23-chaussures-homme-790917-1-gs.jpg", "Saucony Guide 18": "https://photo.i-run.fr/saucony-guide-18-chaussures-homme-762005-1-gs.jpg", "Saucony Endorphin Pro 4": "https://photo.i-run.fr/saucony-endorphin-pro-4-chaussures-homme-761468-1-gs.jpg", "New Balance FuelCell Rebel v5": "https://photo.i-run.fr/new-balance-fuelcell-rebel-v5-chaussures-homme-833327-1-gs.jpg", "New Balance Fresh Foam X More v6": "https://photo.i-run.fr/new-balance-fresh-foam-x-more-v6-chaussures-homme-803659-1-gs.jpg", "New Balance FuelCell SC Elite v5": "https://photo.i-run.fr/new-balance-supercomp-elite-v5-chaussures-homme-799019-1-gs.jpg", "PUMA Velocity Nitro 4": "https://photo.i-run.fr/puma-velocity-nitro-4-chaussures-homme-840485-1-gs.jpg", "PUMA MagMax Nitro 2": "https://photo.i-run.fr/puma-magmax-nitro-2-chaussures-homme-829392-1-gs.jpg", "PUMA ForeverRun Nitro 2": "https://photo.i-run.fr/puma-foreverrun-nitro-2-chaussures-de-sport-femme-795069-1-gs.jpg", "Mizuno Wave Sky 9": "https://photo.i-run.fr/mizuno-wave-sky-9-chaussures-homme-800251-1-gs.jpg", "Mizuno Wave Inspire 22": "https://photo.i-run.fr/mizuno-wave-inspire-22-chaussures-homme-837483-1-gs.jpg", "Mizuno Neo Zen 2": "https://photo.i-run.fr/mizuno-neo-zen-2-chaussures-homme-837343-1-gs.jpg", "On Cloudsurfer 2": "https://photo.i-run.fr/on-running-cloudsurfer-2-chaussures-homme-759327-1-gs.jpg", "On Cloudmonster 2": "https://photo.i-run.fr/on-running-cloudmonster-2-chaussures-homme-691283-1-gs.jpg"};
  const FALLBACK_PHOTO = "../../shoe-realistic.webp";

  const LABELS = {
    "ENTRAÎNEMENT": "Entraînement", "CONFORT": "Confort", "POLYVALENT": "Polyvalent",
    "PERFORMANCE": "Performance", "COMPÉTITION": "Compétition",
    "5 KM": "5 km", "10 KM": "10 km", "SEMI-MARATHON": "Semi-marathon", "MARATHON": "Marathon",
    "ÉTROIT": "Pied étroit", "STANDARD": "Pied standard", "LARGE": "Pied large",
    "AMORTI": "Amorti", "DYNAMISME": "Dynamisme", "STABILITE": "Stabilité",
    "DURABILITE": "Durabilité", "LÉGÈRETÉ": "Légèreté"
  };
  const TYPES = { "DAILY": "Daily", "TEMPO": "Tempo", "MAX CUSHION": "Max cushion", "RACE": "Compétition", "POLYVALENTE": "Polyvalente" };
  const SHOPS = { "I-RUN": "i-Run", "ENDURANCE-STORE": "Endurance Store", "EKOSPORT": "Ekosport", "DECATHLON": "Decathlon", "LE REVENDEUR": "le revendeur" };

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (n, d = 1) => Number(n).toFixed(d).replace(/\.0+$/, "").replace(".", ",");
  const euro = (n) => (Number.isInteger(n) ? String(n) : Number(n).toFixed(2).replace(".", ",")) + " €";
  const label = (v) => LABELS[v] || v;
  const shop = (m) => SHOPS[m] || m;
  const slug = (v) => String(v).normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const score1 = (s) => Math.round(s.final * 10) / 10;
  const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  const CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  function photo(shoe) { return PHOTOS[shoe.modele] || FALLBACK_PHOTO; }
  function shortName(shoe) {
    const n = shoe.modele.toUpperCase().startsWith(shoe.marque.toUpperCase() + " ") ? shoe.modele.slice(shoe.marque.length).trim() : shoe.modele;
    return n || shoe.modele;
  }

  /* Ordre : score arrondi au dixième, puis priorité n°1, n°2, n°3, puis prix. */
  function rank(list, p) {
    const pv = (s, k) => priorityValue(s, k);
    return list.sort((a, b) =>
      score1(b) - score1(a) ||
      pv(b, p.priorite1) - pv(a, p.priorite1) ||
      pv(b, p.priorite2) - pv(a, p.priorite2) ||
      pv(b, p.priorite3) - pv(a, p.priorite3) ||
      a.prix - b.prix);
  }

  function offersInfo(shoe, p) {
    const offers = selectedMerchantOffers(shoe, p);
    const target = Number(p.pointure);
    return offers.map((o) => {
      let size = "pointure à vérifier", exact = false, near = "";
      if (!o.legacy && o.sizes && o.sizes.length) {
        const sizes = [...new Set(o.sizes.map(Number))];
        exact = sizes.some((s) => Math.abs(s - target) < 0.001);
        const close = sizes.filter((s) => Math.abs(s - target) <= 0.5001).sort((a, b) => Math.abs(a - target) - Math.abs(b - target));
        if (exact) size = "ta pointure " + num(target);
        else if (close.length) { near = sizeLabel(close[0]); size = "pointure " + near; }
        else size = "pointure " + num(target) + " indisponible";
      }
      return { ...o, shopName: shop(o.merchant), size, exact, near };
    });
  }

  function budgetChip(shoe, p) {
    if (shoe.prix <= p.budget) return '<span class="t3-budget">Dans ton budget</span>';
    if (shoe.prix <= p.budget + 20) return '<span class="t3-budget warn">Un peu au-dessus du budget</span>';
    return '<span class="t3-budget out">Hors budget</span>';
  }

  /* Ce qui distingue chaque paire dans le Top 3 (uniquement des faits du catalogue). */
  function tags(top, infos, p) {
    const out = [];
    const keys = [p.priorite1, p.priorite2, p.priorite3];
    const priceOf = (i) => (infos[i][0] && infos[i][0].price != null ? infos[i][0].price : top[i].prix);
    top.forEach((s, i) => {
      if (i === 0) { out.push("N°1 pour ton profil"); return; }
      const uniqueBest = (val, higher) => {
        const vals = top.map((_, j) => val(j));
        const best = higher ? Math.max(...vals) : Math.min(...vals);
        return vals[i] === best && vals.filter((v) => v === best).length === 1;
      };
      for (const k of keys) {
        if (uniqueBest((j) => priorityValue(top[j], k), true)) { out.push("La meilleure en " + label(k).toLowerCase()); return; }
      }
      if (uniqueBest(priceOf, false)) { out.push("Le meilleur prix du Top 3"); return; }
      if (uniqueBest((j) => top[j].poidsChaussure, false)) { out.push("La plus légère du Top 3"); return; }
      if (infos[i][0] && infos[i][0].exact && !(infos[0][0] && infos[0][0].exact)) { out.push("Ta pointure disponible"); return; }
      out.push("Aussi faite pour toi");
    });
    return out;
  }

  function card(shoe, i, p, info, tag) {
    const s = score1(shoe);
    const deg = Math.round(s * 3.6);
    const pr = [p.priorite1, p.priorite2, p.priorite3];
    const bars = pr.map((k) => {
      const v = priorityValue(shoe, k);
      return `<div class="t3-bar"><span>${esc(label(k))}</span><div class="t3-track"><div class="t3-fill" style="width:${v * 10}%"></div></div><span style="text-align:right">${num(v)}</span></div>`;
    }).join("");
    const weak = weakPoint(shoe);
    const best = info[0];
    const other = info[1];
    const linkAttrs = (o, extra) => `class="shoe-link ${extra}" href="${esc(o.link)}" target="_blank" rel="noopener noreferrer sponsored" data-product-name="${esc(shoe.modele)}" data-product-brand="${esc(shoe.marque)}" data-rank="${i + 1}" data-merchant="${esc(o.key)}"`;
    let offer = "";
    if (best) {
      offer = `<div class="t3-offer">
        <div class="t3-offer-top">
          <div><div class="t3-offer-label">MEILLEURE OFFRE</div><div class="t3-offer-meta">${esc(best.shopName)} · ${esc(best.size)}</div></div>
          ${best.price != null ? `<div class="t3-price">${euro(best.price)}</div>` : ""}
        </div>
        <a ${linkAttrs(best, "t3-cta")}>Voir l'offre ${esc(best.shopName)} ${ARROW}</a>
        ${other ? `<a ${linkAttrs(other, "t3-other")}>1 autre offre${other.price != null ? " : " + euro(other.price) : ""} chez ${esc(other.shopName)}${other.exact && !best.exact ? " (ta pointure)" : ""}</a>` : ""}
      </div>`;
    }
    return `<article class="t3-card" id="t3-panel" role="tabpanel" aria-label="${esc(shoe.modele)}">
      <div class="t3-plate r${i + 1}">
        <span class="t3-tag">${CHECK}${esc(tag)}</span>
        ${budgetChip(shoe, p)}
        <img src="${esc(photo(shoe))}" alt="${esc(shoe.modele)}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_PHOTO}'">
      </div>
      <div class="t3-body">
        <div class="t3-head">
          <div><div class="t3-brand">${esc(shoe.marque)} · ${esc(TYPES[shoe.type] || shoe.type)}</div><h3 class="t3-name">${esc(shortName(shoe))}</h3></div>
          <div class="t3-ring" style="background:conic-gradient(#195cff 0 ${deg}deg,#dfe6f5 ${deg}deg 360deg)" aria-label="Score ${num(s)} sur 100">
            <div class="t3-ring-in"><div class="t3-ring-val">${num(s)}</div><div class="t3-ring-max">/ 100</div></div>
          </div>
        </div>
        <div><div class="t3-sub">Sur tes 3 priorités</div>${bars}</div>
        <div class="t3-specs">
          <div class="t3-spec"><span>Poids</span><strong>${Math.round(shoe.poidsChaussure)} g</strong></div>
          <div class="t3-spec"><span>Distances</span><strong>${esc(shoe.distance.replace("-", "–"))}</strong></div>
          <div class="t3-spec"><span>Plaque</span><strong>${shoe.carbone === "OUI" ? "Carbone" : "Sans carbone"}</strong></div>
        </div>
        ${weak ? `<p class="t3-note"><b>À savoir :</b> ${esc(label(weak.replace("STABILITÉ", "STABILITE").replace("DURABILITÉ", "DURABILITE")).toLowerCase())} plus modeste que ses autres points forts.</p>` : ""}
        ${offer}
        <a class="t3-fiche" href="modeles/${slug(shoe.modele)}/">Voir la fiche complète →</a>
      </div>
    </article>`;
  }

  function compare(top, infos, p, sel) {
    const cell = (txt, best, i) => `<div class="t3-cell${best ? " best" : ""}${i === sel ? " sel" : ""}">${txt}</div>`;
    const row = (lab, vals, bestIdx) => `<div class="t3-row"><div class="t3-row-label">${esc(lab)}</div>${vals.map((v, i) => cell(v, bestIdx.includes(i), i)).join("")}</div>`;
    const bestOf = (vals, higher) => {
      const ok = vals.filter((v) => v != null);
      if (!ok.length) return [];
      const b = higher ? Math.max(...ok) : Math.min(...ok);
      const idx = vals.map((v, i) => (v === b ? i : -1)).filter((i) => i >= 0);
      return idx.length === vals.length ? [] : idx;
    };
    const scores = top.map(score1);
    const prices = top.map((s, i) => (infos[i][0] && infos[i][0].price != null ? infos[i][0].price : null));
    const weights = top.map((s) => s.poidsChaussure);
    const head = `<div class="t3-row head"><div></div>${top.map((s, i) => cell(esc(shortName(s)), false, i)).join("")}</div>`;
    const prRows = [p.priorite1, p.priorite2, p.priorite3].map((k) => {
      const v = top.map((s) => priorityValue(s, k));
      return row(label(k) + " /10", v.map((x) => num(x)), bestOf(v, true));
    }).join("");
    const sizes = top.map((s, i) => { const o = infos[i][0]; return !o ? "—" : o.exact ? "Oui" : o.near ? o.near : (o.legacy ? "À vérifier" : "Non"); });
    return `<section class="t3-compare" aria-label="Comparer les 3 paires">
      <h3>Les 3 en un coup d'œil</h3>
      <p>En bleu : la meilleure valeur du Top 3.</p>
      ${head}
      ${row("Score", scores.map((x) => num(x)), bestOf(scores, true))}
      ${row("Prix", prices.map((x) => (x == null ? "—" : euro(x))), bestOf(prices, false))}
      ${row("Poids", weights.map((x) => Math.round(x) + " g"), bestOf(weights, false))}
      ${prRows}
      ${row("Distances", top.map((s) => esc(s.distance.replace("-", "–"))), [])}
      ${row("Pointure " + num(p.pointure), sizes, sizes.map((x, i) => (x === "Oui" ? i : -1)).filter((i) => i >= 0).length < 3 ? sizes.map((x, i) => (x === "Oui" ? i : -1)).filter((i) => i >= 0) : [])}
    </section>`;
  }

  function render(state) {
    const { top, infos, tagList, p, sel } = state;
    const chips = [label(p.objectif), label(p.distance), p.allure.replace(/\s*\/KM/i, " /km"), p.poids + " kg", label(p.typePied), "Budget " + p.budget + " €"]
      .map((c) => `<span class="t3-chip">${esc(c)}</span>`).join("");
    const tabs = top.map((s, i) => `<button type="button" class="t3-tab" role="tab" aria-selected="${i === sel}" aria-controls="t3-panel" data-t3="${i}">
        <span class="t3-medal r${i + 1}">${i + 1}</span>
        <img src="${esc(photo(s))}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_PHOTO}'">
        <span class="t3-tab-brand">${esc(s.marque)}</span>
        <span class="t3-tab-name">${esc(shortName(s))}</span>
        <span class="t3-tab-score">${num(score1(s))}/100</span>
      </button>`).join("");
    $("#podium").innerHTML = `<div class="t3">
      <div class="t3-band"><div class="t3-band-title">TON PROFIL</div><div class="t3-chips">${chips}</div></div>
      <div class="t3-tabs" role="tablist" aria-label="Choisir une paire du Top 3">${tabs}</div>
      ${card(top[sel], sel, p, infos[sel], tagList[sel])}
      ${compare(top, infos, p, sel)}
      <p class="t3-legal">Liens affiliés : MyBestPair touche une commission si tu achètes, sans surcoût pour toi. Le classement n'en dépend pas.</p>
    </div>`;
    $$("#podium .t3-tab").forEach((b) => b.addEventListener("click", () => {
      state.sel = Number(b.dataset.t3);
      render(state);
      const t = $("#podium .t3-tab[data-t3='" + state.sel + "']");
      if (t) t.focus({ preventScroll: true });
      if (typeof gtag === "function") gtag("event", "top3_tab", { sport: "running_route", rank: state.sel + 1, product_name: top[state.sel].modele });
    }));
  }

  window.showResults = function (p) {
    const ranking = rank(SHOES.map((shoe) => calculate(shoe, p)).filter((shoe) => shoe.eligible), p);

    if (!ranking.length) {
      $("#errorBox").style.display = "block";
      $("#errorBox").textContent = "Aucune chaussure de la base n'est compatible avec le poids indiqué.";
      return;
    }

    const top = ranking.slice(0, 3);
    const infos = top.map((s) => offersInfo(s, p));
    render({ top, infos, tagList: tags(top, infos, p), p, sel: 0 });
    $("#resultsSub").textContent = `${ranking.length} modèles compatibles analysés sur les ${SHOES.length} références Route.`;

    const budgetNotice = $("#budgetNotice");
    const overBudget = top.filter((shoe) => shoe.prix > p.budget);
    const clearlyOverBudget = top.filter((shoe) => shoe.prix > p.budget + 20);
    budgetNotice.className = "budget-notice";
    if (clearlyOverBudget.length >= 2) {
      budgetNotice.innerHTML = `${mbpIcon("bulb", "ico-gold")} <strong>Ton budget limite les options pour ton profil.</strong><br>
        Les modèles les plus adaptés dépassent actuellement ton budget de <strong>${p.budget} €</strong>.
        MYBESTPAIR privilégie la compatibilité avec ta pratique et tes priorités plutôt que de te recommander
        une chaussure moins adaptée uniquement pour respecter ton budget.`;
      budgetNotice.style.display = "block";
    } else if (overBudget.length >= 1) {
      budgetNotice.classList.add("is-soft");
      budgetNotice.innerHTML = `${mbpIcon("bulb", "ico-gold")} <strong>Certaines recommandations dépassent légèrement ton budget.</strong><br>
        Ton budget est bien pris en compte, mais un modèle un peu plus cher peut apparaître dans ton Top 3
        lorsqu'il correspond mieux à ton profil.`;
      budgetNotice.style.display = "block";
    } else {
      budgetNotice.innerHTML = "";
      budgetNotice.style.display = "none";
    }

    $("#results").style.display = "block";

    if (typeof gtag === "function") {
      gtag("event", "recommendation_generated", {
        sport: "running_route",
        compatible_models: ranking.length,
        top_1: top[0]?.modele || "",
        top_2: top[1]?.modele || "",
        top_3: top[2]?.modele || ""
      });
    }

    try { localStorage.setItem("myshoesRouteProfil", JSON.stringify(p)); } catch (e) {}
    $("#results").scrollIntoView({ behavior: "smooth", block: "start" });
  };
})();
