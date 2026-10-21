/* MyBestPair — ambiance commune à tout le site : fond vivant selon le moment de la journée, et animations.
   Chargé dans le <head> de chaque page, avant l'affichage, pour que les couleurs soient bonnes dès le départ.
   Ne touche ni aux liens, ni aux mesures GA4 : uniquement le fond de page et des animations.
   Fond vivant : 3 grandes taches de couleur qui dérivent lentement derrière le contenu, dans les bleus du site, assez profonds pour que les textes blancs et bleus restent lisibles ;
   leurs couleurs suivent l'heure du visiteur (mêmes 8 moments que l'horloge de l'accueil).
   Pages à fond foncé : fond bleu profond ; pages à fond clair (fiches, catalogues) : version pastel.
   Les animations sont coupées si le visiteur a demandé à les réduire ; les couleurs restent. */
(function () {
  var root = document.documentElement;
  var MOMENTS = [[6, 'nuit'], [9, 'aube'], [12, 'matin'], [14, 'midi'], [17, 'apres-midi'], [19, 'fin-de-journee'], [21, 'crepuscule'], [24, 'soir']];

  function update() {
    var d = new Date(), h = d.getHours() + d.getMinutes() / 60, i = 0;
    while (h >= MOMENTS[i][0]) i++;
    root.setAttribute('data-moment', MOMENTS[i][1]);
  }
  update();
  setInterval(update, 60000);

  // --sky-base : fond ; --sky-1, --sky-2, --sky-3 : les 3 taches de couleur
  var css = [
    '@property --sky-base { syntax:"<color>"; inherits:true; initial-value:#051b3f; }',
    '@property --sky-1 { syntax:"<color>"; inherits:true; initial-value:#12407f; }',
    '@property --sky-2 { syntax:"<color>"; inherits:true; initial-value:#1d5fbf; }',
    '@property --sky-3 { syntax:"<color>"; inherits:true; initial-value:#0a2a5c; }',
    ':root { --sky-base:#051b3f; --sky-1:#12407f; --sky-2:#1d5fbf; --sky-3:#0a2a5c; transition:--sky-base 4s ease, --sky-1 4s ease, --sky-2 4s ease, --sky-3 4s ease; }',
    ':root[data-moment="nuit"]           { --sky-base:#01050f; --sky-1:#0a1f52; --sky-2:#1a1550; --sky-3:#032838; }', /* 0 h – 6 h : presque noir bleuté */
    ':root[data-moment="aube"]           { --sky-base:#071a40; --sky-1:#1a4d9a; --sky-2:#2a3f8f; --sky-3:#0b4a7a; }', /* 6 h – 9 h : bleu qui s'éclaircit */
    ':root[data-moment="matin"]          { --sky-base:#082660; --sky-1:#0d47a8; --sky-2:#0a5a9e; --sky-3:#123c8c; }', /* 9 h – 12 h : bleu roi */
    ':root[data-moment="midi"]           { --sky-base:#0a2d70; --sky-1:#0f50b8; --sky-2:#0b62a8; --sky-3:#1546a0; }', /* 12 h – 14 h : bleu le plus lumineux */
    ':root[data-moment="apres-midi"]     { --sky-base:#082a66; --sky-1:#0b5a8c; --sky-2:#0e4aa8; --sky-3:#076278; }', /* 14 h – 17 h : bleu et turquoise */
    ':root[data-moment="fin-de-journee"] { --sky-base:#08205a; --sky-1:#2a3fae; --sky-2:#3b2f9e; --sky-3:#0e4aa8; }', /* 17 h – 19 h : bleu indigo */
    ':root[data-moment="crepuscule"]     { --sky-base:#0a1640; --sky-1:#3a2a8a; --sky-2:#4a2a7a; --sky-3:#1f3a9a; }', /* 19 h – 21 h : indigo et violet */
    /* 21 h – minuit (soir) : bleu nuit actuel du site, valeurs de :root */

    'html.amb-on { background:var(--sky-base); }',
    'html.amb-on body { background:transparent !important; }',
    '.amb-sky { position:fixed; inset:0; z-index:-1; pointer-events:none; overflow:hidden; background:var(--sky-base); }',
    '.amb-sky i { position:absolute; width:95vmax; height:95vmax; border-radius:50%; will-change:transform; }',
    '.amb-sky i:nth-child(1) { left:-35vmax; top:-40vmax; background:radial-gradient(closest-side, var(--sky-1), transparent); animation:amb-b1 24s ease-in-out infinite alternate; }',
    '.amb-sky i:nth-child(2) { right:-40vmax; top:-5vmax; background:radial-gradient(closest-side, var(--sky-2), transparent); animation:amb-b2 30s ease-in-out infinite alternate; }',
    '.amb-sky i:nth-child(3) { left:-15vmax; bottom:-50vmax; background:radial-gradient(closest-side, var(--sky-3), transparent); animation:amb-b3 36s ease-in-out infinite alternate; }',
    '@keyframes amb-b1 { to { transform:translate(35vmax, 30vmax) scale(1.25); } }',
    '@keyframes amb-b2 { to { transform:translate(-30vmax, 35vmax) scale(.85); } }',
    '@keyframes amb-b3 { to { transform:translate(25vmax, -40vmax) scale(1.15); } }',
    /* Pages à fond clair : même mouvement, en pastel, pour garder les textes lisibles */
    'html.amb-on.amb-clair { background:#eef3fb; }',
    '.amb-clair .amb-sky { background:#eef3fb; }',
    '.amb-clair .amb-sky i { opacity:.45; }',

    /* Titre principal : arrive en glissant */
    'h1 { animation:amb-title .8s cubic-bezier(.2,.7,.2,1) both; }',
    '@keyframes amb-title { from { opacity:.15; translate:0 14px; } to { opacity:1; translate:0 0; } }',

    /* Blocs qui apparaissent au défilement (seulement ceux sous l\'écran au chargement) */
    '.amb-wait { opacity:0; }',
    '.amb-in { animation:amb-rise .7s cubic-bezier(.2,.7,.2,1) var(--amb-delay, 0s) backwards; }',
    '@keyframes amb-rise { from { opacity:0; translate:0 22px; } to { opacity:1; translate:0 0; } }',

    /* Top 3 : les cartes arrivent l\'une après l\'autre */
    '.t3 > * { animation:amb-rise .6s cubic-bezier(.2,.7,.2,1) backwards; }',
    '.t3 > :nth-child(2) { animation-delay:.12s; } .t3 > :nth-child(3) { animation-delay:.24s; } .t3 > :nth-child(4) { animation-delay:.36s; } .t3 > :nth-child(n+5) { animation-delay:.48s; }',

    /* Cartes cliquables : légère montée au survol */
    '@media (hover:hover) { .catalogue-grid > a, .hub-grid > a, .cards > article { transition:translate .25s ease, box-shadow .25s ease; }',
    '  .catalogue-grid > a:hover, .hub-grid > a:hover, .cards > article:hover { translate:0 -4px; box-shadow:0 14px 30px rgba(10,40,90,.22); } }',

    '@media (prefers-reduced-motion: reduce) { :root { transition:none; } .amb-sky i, h1, .amb-in, .t3 > * { animation:none; } .catalogue-grid > a, .hub-grid > a, .cards > article { transition:none; } }',
    '@media print { .amb-sky { display:none; } html.amb-on, html.amb-on body { background:#fff !important; } .amb-wait { opacity:1; } }'
  ].join('\n');
  var style = document.createElement('style');
  style.id = 'ambiance-css';
  style.textContent = css;
  document.head.appendChild(style);

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Clarté du fond d'origine de la page (couleur, ou première couleur de son dégradé)
  function isLight(el) {
    var cs = getComputedStyle(el), c = cs.backgroundColor;
    if (/rgba\(.*,\s*0\)$/.test(c) || c === 'transparent') c = (cs.backgroundImage.match(/rgba?\([^)]*\)|#[0-9a-f]{3,6}/i) || ['rgb(255,255,255)'])[0];
    var m = c.match(/\d+(\.\d+)?/g);
    if (!m) return true;
    return 0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2] > 140;
  }

  function start() {
    var body = document.body;
    if (isLight(body)) root.classList.add('amb-clair');
    var sky = document.createElement('div');
    sky.className = 'amb-sky';
    sky.setAttribute('aria-hidden', 'true');
    sky.innerHTML = '<i></i><i></i><i></i>';
    body.insertBefore(sky, body.firstChild);
    root.classList.add('amb-on');

    if (reduce || !('IntersectionObserver' in window)) return;

    // Apparition au défilement : blocs de contenu, hors questionnaire, menus et Top 3
    var SEL = 'h2, h3, p, li, details, figure, table, article, .card, .catalogue-grid > *, .hub-grid > *, .cards > *';
    var SKIP = 'form, nav, header, [role="dialog"], .t3, #cards, .clock-sport, .amb-wait';
    var found = document.querySelectorAll(SEL), targets = [], limit = window.innerHeight;
    for (var j = 0; j < found.length; j++) {
      var el = found[j];
      if (el.closest(SKIP) || el.querySelector('input, select, textarea')) continue;
      if (el.getBoundingClientRect().top <= limit || !el.offsetParent) continue;
      el.classList.add('amb-wait');
      targets.push(el);
    }
    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target;
        io.unobserve(t);
        t.style.setProperty('--amb-delay', Math.min(n++, 5) * 0.07 + 's');
        t.classList.remove('amb-wait');
        t.classList.add('amb-in');
        t.addEventListener('animationend', function done(ev) {
          if (ev.target !== t) return;
          t.classList.remove('amb-in');
          t.style.removeProperty('--amb-delay');
          t.removeEventListener('animationend', done);
        });
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
