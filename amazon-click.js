/* Amazon Partenaires (nov. 2026) : suivi GA4 des clics vers Amazon, dans un événement à part (amazon_click).
 * L'événement affiliate_click et ses paramètres ne sont pas modifiés (règle 3 de CLAUDE.md).
 * Fonctionne sur les fiches (data-product-name, data-sport) et dans les Top 3 Basket / Rugby (.shoe-card.rankN .shoe-name). */
(function () {
  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest('a[href*="amazon.fr"]');
    if (!link || typeof gtag !== "function") return;
    var card = link.closest(".shoe-card");
    var rank = 0;
    [1, 2, 3].forEach(function (n) { if (card && card.classList.contains("rank" + n)) rank = n; });
    var nameEl = card && card.querySelector(".shoe-name");
    var path = location.pathname;
    gtag("event", "amazon_click", {
      product_name: link.dataset.productName || (nameEl ? nameEl.textContent.trim() : ""),
      brand: link.dataset.productBrand || "",
      rank: rank,
      sport: link.dataset.sport || (path.indexOf("/rugby/") === 0 ? "rugby" : path.indexOf("/basket/") === 0 ? "basketball" : "")
    });
  });
})();
