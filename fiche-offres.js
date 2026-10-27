/* Fiches modèles : bloc « Où l'acheter ».
 * - Les liens Kwanko sont écrits ir:/es:/ek:CODE dans la page (jamais en clair, règle 5 de CLAUDE.md)
 *   et reconstruits ici, comme kwankoLink() dans route-app.js / trail-app.js.
 * - Chaque clic envoie product_click et, pour un lien affilié, affiliate_click avec les mêmes
 *   paramètres que les questionnaires (rank = 0 : clic depuis une fiche, hors Top 3).
 */
(function () {
  var HOSTS = { ir: "rf.nur-i.xsf", es: "rf.erots-ecnarudne.foz", ek: "rf.tropsoke.azi" };
  Object.keys(HOSTS).forEach(function (k) { HOSTS[k] = HOSTS[k].split("").reverse().join(""); });
  function rebuild(v) {
    var m = /^(ir|es|ek):(.+)$/.exec(v || "");
    return m ? "https://" + HOSTS[m[1]] + "/?" + m[2] : v;
  }
  function isKwanko(href) {
    return Object.keys(HOSTS).some(function (k) { return href.indexOf(HOSTS[k]) !== -1; }) || href.indexOf("kwanko.com") !== -1;
  }
  document.querySelectorAll(".buy a[data-k]").forEach(function (a) { a.href = rebuild(a.getAttribute("data-k")); });
  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest(".buy .shoe-link");
    if (!link || typeof gtag !== "function") return;
    var href = link.href || "";
    var rakuten = href.indexOf("click.linksynergy.com") !== -1;
    var awin = href.indexOf("awin1.com") !== -1;
    var kwanko = isKwanko(href);
    var network = kwanko ? "kwanko" : (rakuten ? "rakuten" : (awin ? "awin" : ""));
    var params = {
      product_name: link.dataset.productName || "",
      brand: link.dataset.productBrand || "",
      rank: 0,
      sport: link.dataset.sport || "",
      merchant: link.dataset.merchant || ""
    };
    gtag("event", "product_click", Object.assign({ affiliate: network ? "yes" : "no" }, params));
    if (network) gtag("event", "affiliate_click", Object.assign({ affiliate_network: network }, params));
  });
})();
