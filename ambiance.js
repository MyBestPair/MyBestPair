/* MyBestPair — effets communs à tout le site, dans l'esprit de boutique.mybestpair.fr.
   Chargé dans le <head> de chaque page. Ne touche ni aux liens, ni aux mesures GA4 : uniquement de l'affichage.
   - grands titres (h1) en Archivo étroit, en majuscules, qui montent ligne par ligne derrière un cache ;
   - blocs qui se dévoilent du bas au défilement (cartes, fiches, sections) ;
   - grain photo léger sur toute la page ;
   - sur ordinateur, curseur rond qui grossit sur les éléments cliquables (« Voir » sur les cartes) ;
   - Top 3 : cartes l'une après l'autre.
   Les animations sont coupées si le visiteur a demandé à les réduire.
   - pages des sports : photo d'en-tête découverte à travers le monogramme, bandeau des critères qui défile (styles dans ui.css) ;
   - fiches : barres de notes qui se remplissent (styles dans modeles.css).
   Les effets propres à l'accueil (ouverture, bandeau, monogramme) sont dans index.html. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches;
  root.classList.add('amb-on');
  if (reduce) root.classList.add('amb-calme');
  // Titres cachés jusqu'à leur découpage, pour éviter qu'ils clignotent ; sécurité si le script s'arrête
  setTimeout(function () { root.classList.add('amb-pret'); }, 2500);

  var font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..100,700..900&display=swap';
  document.head.appendChild(font);

  var OUT = 'cubic-bezier(.16,1,.3,1)';
  var css = [
    /* Titres */
    'html.amb-on:not(.amb-pret) h1 { opacity:0; }',
    'html.amb-on h1 { font-family:"Archivo","Arial Narrow",Arial,sans-serif; font-weight:900; font-variation-settings:"wdth" 64; font-stretch:64%; text-transform:uppercase; letter-spacing:0; line-height:.9; }',
    'html.amb-on h1.amb-long { font-size:clamp(2.3rem, 6.4vw, 4rem) !important; line-height:.92; max-width:22ch; }',
    'amb-ln { display:block; overflow:hidden; padding:.08em 0 .06em; margin:-.08em 0 -.06em; }',
    'amb-li { display:block; transform:translateY(110%); transition:transform 1s ' + OUT + '; }',
    '.amb-up amb-li { transform:none; }',
    '.amb-up amb-ln:nth-child(2) amb-li { transition-delay:.09s; } .amb-up amb-ln:nth-child(3) amb-li { transition-delay:.18s; } .amb-up amb-ln:nth-child(n+4) amb-li { transition-delay:.27s; }',

    /* Blocs dévoilés du bas (cartes) et textes qui montent */
    '.amb-rv { clip-path:inset(100% 0 0 0 round 14px); transform:translateY(40px); }',
    '.amb-rv.amb-go { clip-path:inset(0 0 0 0 round 0); transform:none; transition:clip-path 1.1s ' + OUT + ' var(--amb-delay, 0s), transform 1.1s ' + OUT + ' var(--amb-delay, 0s); }',
    '.amb-tx { opacity:0; transform:translateY(24px); }',
    '.amb-tx.amb-go { opacity:1; transform:none; transition:opacity .8s ease var(--amb-delay, 0s), transform .9s ' + OUT + ' var(--amb-delay, 0s); }',

    /* Top 3 : les cartes arrivent l\'une après l\'autre */
    '@keyframes amb-rise { from { opacity:0; translate:0 30px; } to { opacity:1; translate:0 0; } }',
    '.t3 > * { animation:amb-rise .8s ' + OUT + ' backwards; }',
    '.t3 > :nth-child(2) { animation-delay:.12s; } .t3 > :nth-child(3) { animation-delay:.24s; } .t3 > :nth-child(4) { animation-delay:.36s; } .t3 > :nth-child(n+5) { animation-delay:.48s; }',

    /* Grain photo */
    '.amb-grain { position:fixed; inset:0; z-index:2147482000; pointer-events:none; opacity:.06; mix-blend-mode:overlay;',
    '  background-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'180\' height=\'180\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'.85\' numOctaves=\'2\' stitchTiles=\'stitch\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\'/></svg>"); }',

    /* Curseur (ordinateur) */
    '.amb-cur { position:fixed; left:0; top:0; z-index:2147483000; width:12px; height:12px; margin:-6px 0 0 -6px; border-radius:50%; background:#1681ff; pointer-events:none; display:grid; place-items:center; opacity:0;',
    '  transition:width .35s ' + OUT + ', height .35s ' + OUT + ', margin .35s ' + OUT + ', opacity .3s; }',
    '.amb-cur span { font:700 11px Arial, sans-serif; letter-spacing:.1em; text-transform:uppercase; color:#fff; opacity:0; transition:opacity .2s; }',
    '.amb-cur.amb-mid { width:34px; height:34px; margin:-17px 0 0 -17px; background:rgba(22,129,255,.35); }',
    '.amb-cur.amb-big { width:74px; height:74px; margin:-37px 0 0 -37px; background:#1681ff; }',
    '.amb-cur.amb-big span { opacity:1; }',

    'html.amb-calme amb-li, html.amb-calme .amb-rv, html.amb-calme .amb-tx { transform:none !important; clip-path:none !important; opacity:1 !important; transition:none !important; }',
    'html.amb-calme .t3 > * { animation:none; }',
    '@media print { .amb-grain, .amb-cur { display:none; } amb-li, .amb-rv, .amb-tx { transform:none !important; clip-path:none !important; opacity:1 !important; } }'
  ].join('\n');
  var style = document.createElement('style');
  style.id = 'ambiance-css';
  style.textContent = css;
  document.head.appendChild(style);

  // Découpe un titre en lignes : chaque morceau de texte et chaque bloc deviennent une ligne qui monte
  function splitTitle(h) {
    if (h.querySelector('amb-ln')) return;
    var lines = [], cur = null;
    Array.prototype.slice.call(h.childNodes).forEach(function (n) {
      var block = n.nodeType === 1 && getComputedStyle(n).display === 'block';
      if (block) { lines.push([n]); cur = null; return; }
      if (n.nodeType === 3 && !n.textContent.trim() && !cur) return;
      if (!cur) { cur = []; lines.push(cur); }
      cur.push(n);
    });
    lines.forEach(function (nodes) {
      var ln = document.createElement('amb-ln'), li = document.createElement('amb-li');
      ln.appendChild(li);
      h.insertBefore(ln, nodes[0]);
      nodes.forEach(function (n) { li.appendChild(n); });
    });
  }

  function start() {
    var body = document.body;
    var grain = document.createElement('div');
    grain.className = 'amb-grain';
    grain.setAttribute('aria-hidden', 'true');
    body.appendChild(grain);

    // Titres principaux
    var titles = document.querySelectorAll('h1');
    for (var i = 0; i < titles.length; i++) {
      // Titres longs (Black Friday, guides, comparatifs) : un peu plus petits pour rester lisibles
      if (titles[i].textContent.replace(/\s+/g, ' ').trim().length > 48) titles[i].classList.add('amb-long');
      splitTitle(titles[i]);
      if (reduce) titles[i].classList.add('amb-up');
    }
    root.classList.add('amb-pret');
    if (!reduce) {
      // L'accueil lance son titre à la fin de l'ouverture (window.ambTitles), les autres pages tout de suite
      window.ambTitles = function () {
        for (var k = 0; k < titles.length; k++) titles[k].classList.add('amb-up');
      };
      if (!root.classList.contains('amb-ouverture')) requestAnimationFrame(function () { requestAnimationFrame(window.ambTitles); });
    }

    // Curseur
    if (!touch && !reduce) {
      var c = document.createElement('div'), label = document.createElement('span');
      c.className = 'amb-cur';
      c.setAttribute('aria-hidden', 'true');
      label.textContent = 'Voir';
      c.appendChild(label);
      body.appendChild(c);
      var x = -100, y = -100, tx = -100, ty = -100;
      document.addEventListener('mousemove', function (e) {
        tx = e.clientX; ty = e.clientY;
        c.style.opacity = 1;
        var big = e.target.closest && e.target.closest('.card, .model-tile, .clock-sport, .sport-card, .hub-card, .catalogue-grid > a');
        var mid = !big && e.target.closest && e.target.closest('a, button, summary, label, [role="button"]');
        c.classList.toggle('amb-big', !!big);
        c.classList.toggle('amb-mid', !!mid);
      }, { passive: true });
      document.addEventListener('mouseleave', function () { c.style.opacity = 0; });
      (function loop() {
        x += (tx - x) * 0.2; y += (ty - y) * 0.2;
        c.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        requestAnimationFrame(loop);
      })();
    }

    // Pages des sports : photo d'en-tête découverte à travers le monogramme, bandeau des critères qui défile
    var heroPhoto = document.querySelector('header.hero > .hero-photo');
    if (heroPhoto) {
      var me = document.querySelector('script[src$="ambiance.js"]');
      var base = me ? me.getAttribute('src').replace(/ambiance\.js$/, '') : '';
      if (!reduce) {
        var hole = document.createElement('span');
        hole.className = 'hole';
        hole.setAttribute('aria-hidden', 'true');
        heroPhoto.appendChild(hole);
        setTimeout(function () { heroPhoto.classList.add('open'); }, 350);
      }
      var words = [];
      document.querySelectorAll('#priority1 option, [data-key="priorite1"] .option').forEach(function (o) { if (o.textContent.trim()) words.push(o.textContent.trim()); });
      if (words.length < 4) {
        var kick = document.querySelector('.hero-kicker');
        if (kick) words.push(kick.textContent.trim());
        document.querySelectorAll('.hero-chip').forEach(function (c) { words.push(c.textContent.trim()); });
      }
      var band = document.createElement('div'), track = document.createElement('div');
      band.className = 'sport-marq';
      band.setAttribute('aria-hidden', 'true');
      for (var r = 0; r < 2; r++) words.forEach(function (wd) {
        var sp = document.createElement('span'), im = document.createElement('img');
        sp.textContent = wd;
        im.src = base + 'images/horloge/monogramme.webp';
        im.alt = '';
        track.appendChild(sp);
        track.appendChild(im);
      });
      band.appendChild(track);
      heroPhoto.parentNode.insertAdjacentElement('afterend', band);
    }

    // Fiches : les barres de notes se remplissent quand elles arrivent à l'écran
    var scores = document.querySelectorAll('.scores');
    if (reduce || !('IntersectionObserver' in window)) scores.forEach(function (sc) { sc.classList.add('amb-fill'); });
    else {
      var so = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('amb-fill'); so.unobserve(e.target); } });
      }, { threshold: 0.3 });
      scores.forEach(function (sc) { so.observe(sc); });
    }

    if (reduce || !('IntersectionObserver' in window)) return;

    // Apparitions au défilement (seulement ce qui est sous l'écran au chargement), hors questionnaire et menus
    var CARDS = 'article, .card, .model-tile, .catalogue-grid > *, .hub-grid > *, figure, .panel, section.card';
    var TEXT = 'h2, h3, p, li, details, table, .section-title';
    var SKIP = 'form, nav, header, footer, [role="dialog"], .t3, #cards, .clock-sport, .amb-rv, .amb-tx';
    var targets = [], limit = window.innerHeight;
    document.querySelectorAll(CARDS + ', ' + TEXT).forEach(function (el) {
      if (el.closest(SKIP) || el.querySelector('input, select, textarea')) return;
      if (el.getBoundingClientRect().top <= limit || !el.offsetParent) return;
      el.classList.add(el.matches(CARDS) ? 'amb-rv' : 'amb-tx');
      targets.push(el);
    });
    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target;
        io.unobserve(t);
        t.style.setProperty('--amb-delay', Math.min(n++, 5) * 0.08 + 's');
        t.classList.add('amb-go');
        setTimeout(function () {
          t.classList.remove('amb-rv', 'amb-tx', 'amb-go');
          t.style.removeProperty('--amb-delay');
        }, 1700);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
