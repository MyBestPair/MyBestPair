/* MyBestPair — ambiance commune à tout le site : couleurs selon le moment de la journée et animations.
   Chargé dans le <head> de chaque page, avant l'affichage, pour que les couleurs soient bonnes dès le départ.
   Ne touche ni aux liens, ni aux mesures GA4 : uniquement des couleurs et des animations.
   Moments et couleurs : les mêmes que l'horloge de l'accueil (planche de couleurs du logo).
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

  // --m-glow : couleur du moment sur fond foncé ; --m-soft : sa version claire ; --m-deep : sur fond clair
  var css = [
    '@property --m-glow { syntax:"<color>"; inherits:true; initial-value:#8fbaff; }',
    '@property --m-soft { syntax:"<color>"; inherits:true; initial-value:#cfe0ff; }',
    '@property --m-deep { syntax:"<color>"; inherits:true; initial-value:#1f7cff; }',
    ':root { --m-glow:#8fbaff; --m-soft:#cfe0ff; --m-deep:#1f7cff; transition:--m-glow 3s ease, --m-soft 3s ease, --m-deep 3s ease; }',
    ':root[data-moment="nuit"]           { --m-glow:#d9f23e; --m-soft:#f2fbb8; --m-deep:#141414; }',
    ':root[data-moment="aube"]           { --m-glow:#a9cdee; --m-soft:#e4eff9; --m-deep:#0b2545; }',
    ':root[data-moment="matin"]          { --m-glow:#5b9bff; --m-soft:#c9dcff; --m-deep:#0b55d9; }',
    ':root[data-moment="midi"]           { --m-glow:#ff7a45; --m-soft:#ffd2bd; --m-deep:#c8461e; }',
    ':root[data-moment="apres-midi"]     { --m-glow:#a9c4a8; --m-soft:#e2eadc; --m-deep:#4a5c4d; }',
    ':root[data-moment="fin-de-journee"] { --m-glow:#e0d0b8; --m-soft:#f3ece2; --m-deep:#2f3b24; }',
    ':root[data-moment="crepuscule"]     { --m-glow:#d9a9bf; --m-soft:#f4dee8; --m-deep:#7a5f6c; }',
    '::selection { background:var(--m-glow); color:#0b0b0b; }',

    /* Logo : le monogramme prend la couleur du moment, le nom garde sa couleur ; un reflet passe à l'arrivée */
    'img.amb-logo { object-position:-99999px 0; -webkit-mask:var(--amb-src) 0 0 / 100% 100% no-repeat; mask:var(--amb-src) 0 0 / 100% 100% no-repeat;',
    '  background:linear-gradient(105deg, transparent 42%, rgba(255,255,255,.85) 50%, transparent 58%) 130% 0 / 250% 100% no-repeat, linear-gradient(90deg, var(--m-glow) 37.7%, #fff 37.7%);',
    '  animation:amb-sheen 1.8s ease .4s both; }',
    'img.amb-logo.amb-marine { background:linear-gradient(105deg, transparent 42%, rgba(255,255,255,.7) 50%, transparent 58%) 130% 0 / 250% 100% no-repeat, linear-gradient(90deg, var(--m-deep) 37.7%, #061d45 37.7%); }',
    '@media (hover:hover) { a:hover > img.amb-logo { animation:amb-sheen 1.2s ease both; } }',
    '@keyframes amb-sheen { from { background-position:130% 0, 0 0; } to { background-position:-30% 0, 0 0; } }',

    /* Barre de lecture en haut de page, aux couleurs du moment, avec un reflet qui circule */
    '.amb-bar { position:fixed; left:0; top:0; z-index:2147483000; width:100%; height:3px; pointer-events:none; transform-origin:0 50%; transform:scaleX(var(--amb-progress, 0));',
    '  background:linear-gradient(90deg, var(--m-glow), var(--m-soft), var(--m-glow)) 0 0 / 200% 100%; animation:amb-flow 4s linear infinite; }',
    '@keyframes amb-flow { to { background-position:-200% 0; } }',

    /* Lueur douce aux couleurs du moment, derrière le contenu (visible sur les fonds de page) */
    '.amb-glow { position:fixed; inset:-20vmax; z-index:-1; pointer-events:none;',
    '  background:radial-gradient(40vmax 30vmax at 85% 18%, color-mix(in srgb, var(--m-glow) 22%, transparent), transparent 70%), radial-gradient(36vmax 28vmax at 10% 85%, color-mix(in srgb, var(--m-glow) 12%, transparent), transparent 70%);',
    '  animation:amb-drift 22s ease-in-out infinite alternate; }',
    '@keyframes amb-drift { to { transform:translate(-6vmax, 5vmax) rotate(8deg); } }',

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
    '  .catalogue-grid > a:hover, .hub-grid > a:hover, .cards > article:hover { translate:0 -4px; box-shadow:0 14px 30px color-mix(in srgb, var(--m-deep) 22%, transparent); } }',

    '@media (prefers-reduced-motion: reduce) { :root { transition:none; } img.amb-logo, .amb-bar, .amb-glow, h1, .amb-in, .t3 > * { animation:none; } .catalogue-grid > a, .hub-grid > a, .cards > article { transition:none; } }',
    '@media print { .amb-bar, .amb-glow { display:none; } .amb-wait { opacity:1; } }'
  ].join('\n');
  var style = document.createElement('style');
  style.id = 'ambiance-css';
  style.textContent = css;
  document.head.appendChild(style);

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function start() {
    var body = document.body;

    // Logos : recoloriés en gardant le même fichier (il sert de masque)
    var logos = document.querySelectorAll('img[src$="logo-mybestpair.webp"], img[src$="logo-mybestpair-marine.webp"]');
    for (var i = 0; i < logos.length; i++) {
      logos[i].style.setProperty('--amb-src', 'url("' + logos[i].src + '")');
      logos[i].classList.add('amb-logo');
      if (/marine/.test(logos[i].getAttribute('src'))) logos[i].classList.add('amb-marine');
    }

    // Bandeaux foncés en haut de page : lumière du moment dans le coin (ajoutée à leur ombre existante)
    var heads = document.querySelectorAll('header.hero, .hero-copy');
    for (var k = 0; k < heads.length; k++) {
      var shadow = getComputedStyle(heads[k]).boxShadow;
      heads[k].style.boxShadow = 'inset -70px 70px 140px -50px color-mix(in srgb, var(--m-glow) 45%, transparent)' + (shadow && shadow !== 'none' ? ', ' + shadow : '');
    }

    var glow = document.createElement('div');
    glow.className = 'amb-glow';
    glow.setAttribute('aria-hidden', 'true');
    body.insertBefore(glow, body.firstChild);

    var bar = document.createElement('div');
    bar.className = 'amb-bar';
    bar.setAttribute('aria-hidden', 'true');
    body.appendChild(bar);
    var ticking = false;
    function progress() {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty('--amb-progress', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : 0);
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(progress); } }, { passive: true });
    window.addEventListener('resize', progress);
    progress();

    if (reduce || !('IntersectionObserver' in window)) return;

    // Apparition au défilement : blocs de contenu, hors questionnaire, menus et Top 3
    var SEL = 'h2, h3, p, li, details, figure, table, article, .card, .catalogue-grid > *, .hub-grid > *, .cards > *';
    var SKIP = 'form, nav, header, [role="dialog"], .t3, #cards, .clock-sport, .amb-wait';
    var found = document.querySelectorAll(SEL), targets = [], limit = window.innerHeight;
    for (var j = 0; j < found.length; j++) {
      var el = found[j];
      if (el.closest(SKIP) || el.querySelector('input, select, textarea')) continue;
      var top = el.getBoundingClientRect().top;
      if (top <= limit || !el.offsetParent) continue;
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
