/* Load audience measurement only after the choice saved on the home page. */
(function () {
  const consentKey = "myshoes_analytics_consent";
  const gaId = "G-8CZ831W067";
  window.gtag = function () {};

  try {
    if (localStorage.getItem(consentKey) !== "accepted") return;
  } catch (error) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + gaId;
  document.head.appendChild(script);
  window.gtag("js", new Date());
  window.gtag("config", gaId, { anonymize_ip: true });
})();
