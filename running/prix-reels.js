/* MYBESTPAIR — prix réels (Route et Trail)
 * Chargé après route-app.js / trail-app.js.
 * Le budget (note, badge, alerte) est comparé au meilleur prix relevé chez les marchands
 * dans la pointure du visiteur (à 0,5 près) et son rayon. Sans offre chiffrée : prix indicatif du modèle.
 * La date du relevé est donnée par l'attribut data-offers-date de la balise <script>.
 */
(function () {
  const OFFERS_DATE = (document.currentScript && document.currentScript.dataset.offersDate) || "";
  const shortDate = OFFERS_DATE.slice(0, 5);

  function realPrice(shoe, p) {
    const target = Number(p.pointure);
    const o = selectedMerchantOffers(shoe, p).find(x =>
      !x.legacy && Number.isFinite(Number(x.price)) && sizeDistance(x, target) <= 0.5001);
    return o ? { prix: Number(o.price), source: "offre" } : { prix: shoe.prix, source: "catalogue" };
  }

  function withRealPrice(shoe, p) {
    const rp = realPrice(shoe, p);
    return { ...shoe, prix: rp.prix, prixCatalogue: shoe.prix, prixSource: rp.source };
  }

  // Route : calculate() ; Trail : calc()
  if (typeof calculate === "function") {
    const original = calculate;
    calculate = function (shoe, p) { return original(withRealPrice(shoe, p), p); };
  }
  if (typeof calc === "function") {
    const original = calc;
    calc = function (shoe, p) { return original(withRealPrice(shoe, p), p); };
  }

  // Disponibilité : on parle d'un relevé daté, pas d'un stock en direct.
  if (typeof formatSizes === "function" && shortDate) {
    formatSizes = function (o, target) {
      if (!o.sizes?.length) return "Pointures à vérifier";
      const sizes = [...new Set(o.sizes.map(Number))].sort((a, b) => a - b);
      if (sizes.some(s => Math.abs(s - target) < 0.001))
        return `✓ Ta pointure ${String(target).replace(".", ",")} était en stock au ${shortDate}`;
      const near = sizes.filter(s => Math.abs(s - target) <= 0.5001);
      const shown = (near.length ? near : sizes.slice(0, 5)).map(s => String(s).replace(".", ","));
      return `${shown.length > 1 ? "Pointures proches en stock" : "Pointure proche en stock"} au ${shortDate} : ${shown.join(" · ")}`;
    };
  }

  // Carte : date du relevé sous « Où trouver », mention « prix indicatif » si aucune offre chiffrée.
  function decorate(html, shoe) {
    if (OFFERS_DATE) {
      html = html.replace("🛒 Où trouver cette chaussure ?</div>",
        `🛒 Où trouver cette chaussure ?</div><div class="offers-date" style="font-size:12px;color:#647087;margin:2px 0 8px">Prix et stocks relevés le ${OFFERS_DATE}, à vérifier chez le marchand.</div>`);
    }
    if (shoe.prixSource === "catalogue") {
      html = html.replace(/(💰 [\d\s]+ €)(<\/span>)/, "$1 (prix indicatif)$2");
    }
    return html;
  }
  if (typeof cardHTML === "function") {
    const original = cardHTML;
    cardHTML = function (shoe, index, p) { return decorate(original(shoe, index, p), shoe); };
  }
  if (typeof card === "function") {
    const original = card;
    card = function (s, i, p) { return decorate(original(s, i, p), s); };
  }
})();
