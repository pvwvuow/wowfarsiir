/* wowfarsi - support layer: nav link + floating button on every page, donate page logic */
"use strict";
(function () {
  var page = location.pathname.split("/").pop() || "index.html";
  var onDonate = page === "donate.html";
  /* pages living in a sub-directory (news/<id>-<slug>.html) need ../ prefixes;
     without this the injected nav links / donate float point into /news/ and 404 */
  var BASE = (function () { var m = location.pathname.match(/^\/(?:news|guides|item)\//); if (!m) return ""; var rest = location.pathname.slice(m[0].length); return "../".repeat(1 + (rest.match(/[/]/g) || []).length); })();

  function fa(n) { return Number(n).toLocaleString("fa-IR"); }
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  function set(id, text) {
    var el = document.getElementById(id);
    if (el && text != null) el.textContent = text;
  }

  /* extra stylesheets: loaded last so they win over the page sheets
     (pages that already link them in their own head are skipped) */
  function loadSheet(name, v) {
    if (document.querySelector('link[href*="' + name + '"]')) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = BASE + "assets/css/" + name + "?v=" + v;
    document.head.appendChild(l);
  }
  /* the float + nav link this script injects are styled by support.css —
     any page that loads support.js but forgets the stylesheet (forever.html
     did) used to render the button as raw jumbled markup */
  loadSheet("support.css", "20261031a");
  loadSheet("panels.css", "20261030a");
  if (page === "news.html" || page === "article.html") loadSheet("article.css", "20261025j");

  /* support.css loads async on pages that don't link it — until it lands the
     float would render raw inside the page flow and jumble the loading page.
     This inline block is live the same tick the script runs and pins the
     button to its corner; support.css then just adds the cosmetics. */
  if (!document.getElementById("dn-crit")) {
    var crit = document.createElement("style");
    crit.id = "dn-crit";
    crit.textContent =
      "html body .dn-float{position:fixed;right:18px;left:auto;bottom:22px;z-index:70;" +
      "display:flex;flex-direction:column;align-items:center;gap:8px;text-decoration:none}";
    (document.head || document.documentElement).appendChild(crit);
  }

  /* news list: every card opens the article's own static page (news/<id>-<slug>.html, built by
     tools/build_news.py); the slug is read from the card's wowheadFA link. Without it we fall
     back to the dynamic article.html?id=... page. */
  function articleUrl(el) {
    var id = el.getAttribute("data-read");
    var card = el.closest ? el.closest(".nw-card") : null;
    var src = card && card.querySelector('a[href*="/article/"]');
    var m = src && src.getAttribute("href").match(/\/article\/([^\/?#]+)\.html/);
    return m ? "news/" + m[1] + ".html" : "article.html?id=" + encodeURIComponent(id);
  }
  function newsLinks() {
    if (page !== "news.html") return;
    var m = location.hash.match(/^#read-(\d+)$/);
    if (m) { location.replace("article.html?id=" + m[1]); return; }
    var q = new URLSearchParams(location.search).get("q");
    var inp = document.getElementById("nw-search");
    if (q && inp) inp.value = q;
    document.addEventListener("click", function (e) {
      var t = e.target && e.target.closest ? e.target.closest("[data-read]") : null;
      if (!t) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      location.href = articleUrl(t);
    }, true);
    var grid = document.getElementById("nw-grid");
    if (grid && window.MutationObserver) {
      new MutationObserver(function () {
        Array.prototype.forEach.call(grid.querySelectorAll("a[data-read]"), function (a) {
          a.setAttribute("href", articleUrl(a));
        });
      }).observe(grid, { childList: true });
    }
  }
  newsLinks();

  /* article pages (dynamic article.html and static news/<id>-<slug>.html): rarity-coloured
     item cards with a big preview image, built by items.js from news.json */
  function loadItems() {
    var onStatic = /[/]news[/][0-9]+-[^/]*[.]html$/.test(location.pathname);
    if (page !== "article.html" && !onStatic) return;
    var s = document.createElement("script");
    s.src = (onStatic ? "../" : "") + "assets/js/items.js?v=20261026a";
    s.defer = true;
    document.body.appendChild(s);
  }

  /* extra scripts: bidi.js isolates English words inside Persian sentences (tooltips, guides);
     retail-ext.js adds the rating cards and the talent map on Retail guide pages */
  function loadExtras() {
    var base = /[/]news[/]/.test(location.pathname) ? "../" : "";
    function add(src) {
      var s = document.createElement("script");
      s.src = base + src;
      s.defer = true;
      document.body.appendChild(s);
    }
    add("assets/js/bidi.js?v=20261026b");
    if (document.body.getAttribute("data-rt") === "guide") add("assets/js/retail-ext.js?v=20261026b");
  }

  /* the wowfa repo is private (visitors would get a 404): every link to it goes to the
     public addon repo, where the Releases with the download live */
  var ADDON_REPO = "https://github.com/pvwvuow/wowfarsi-addon";
  function fixRepoLinks() {
    Array.prototype.forEach.call(document.querySelectorAll('a[href^="https://github.com/pvwvuow/wowfa"]'), function (a) {
      var h = a.getAttribute("href").replace(/\/+$/, "");
      if (h === "https://github.com/pvwvuow/wowfa") a.setAttribute("href", ADDON_REPO);
    });
  }

  /* put a nav link in place if the page's own nav does not have it yet */
  function ensureLink(nav, file, text, afterFile) {
    if (nav.querySelector('a[href$="' + file + '"]')) return;
    var a = document.createElement("a");
    a.href = BASE + file;
    a.textContent = text;
    var ref = afterFile && nav.querySelector('a[href$="' + afterFile + '"]');
    if (ref && ref.nextSibling) nav.insertBefore(a, ref.nextSibling);
    else nav.appendChild(a);
  }

  /* every page shows the same nav: retired tabs (classes / worlds / roadmap /
     quests — quests merged into the status page) are dropped, and the canonical
     items are ensured: addon / news / status */
  function fixNav() {
    var nav = document.querySelector(".nav-links");
    if (!nav) return;
    Array.prototype.forEach.call(nav.querySelectorAll("a"), function (a) {
      var h = a.getAttribute("href") || "";
      if (/#(?:classes|worlds|roadmap|progress|contribute)$/.test(h) || /[/]quests\.html$/.test(h)) {
        a.parentNode.removeChild(a);
      } else if (/#sync$/.test(h)) {
        a.setAttribute("href", page === "index.html" ? "#top" : "index.html");
        a.textContent = "خانه";
      }
    });
    ensureLink(nav, "addon.html", "افزونه", "talents.html");
    ensureLink(nav, "news.html", "wowheadFA", "addon.html");
    ensureLink(nav, "status.html", "وضعیت ترجمه", "news.html");
    /* Forever tools: spellbook + talent calculator, matching the nav on
       spellbook.html — every page shows the same canonical items */
    ensureLink(nav, "spellbook.html", "کتاب اسپل‌ها", "index.html");
    ensureLink(nav, "forever-talents.html", "تلنت‌های فورور", "spellbook.html");
  }

  function addNavLink() {
    var nav = document.querySelector(".nav-links");
    if (!nav || nav.querySelector(".dn-nav")) return;
    var a = document.createElement("a");
    a.href = BASE + "donate.html";
    a.className = "dn-nav" + (onDonate ? " is-active" : "");
    a.textContent = "حمایت";
    nav.appendChild(a);
  }

  function addFloat() {
    if (onDonate || document.querySelector(".dn-float")) return;
    var a = document.createElement("a");
    a.className = "dn-float";
    a.href = BASE + "donate.html";
    a.setAttribute("aria-label", "حمایت از پروژهٔ wowfarsi");
    a.innerHTML = '<span class="dn-float-tag">حمایت از پروژه</span>' +
      '<span class="dn-float-orb"><img src="' + BASE + 'assets/img/logo.webp" alt=""><span class="dn-float-heart" aria-hidden="true">♥</span></span>';
    document.body.appendChild(a);
  }

  /* home page: the ember-red support button next to the other hero buttons
     (user: «دکمه حمایت از پروژه رو قرمز و فانتزی کن») */
  function addHeroSupport() {
    var box = document.querySelector(".hero-ctas");
    if (!box || box.querySelector(".dn-hero-link")) return;
    var a = document.createElement("a");
    a.href = "donate.html";
    a.className = "btn btn-ember dn-hero-link";
    a.innerHTML = '<span class="ember-heart" aria-hidden="true">♥</span> حمایت از پروژه';
    box.appendChild(a);
  }

  function initDonate() {
    var btn = document.getElementById("dn-copy");
    var addr = document.getElementById("dn-addr");
    if (btn && addr) {
      btn.addEventListener("click", function () {
        var text = addr.textContent.trim();
        function done() {
          btn.textContent = "کپی شد ✓";
          setTimeout(function () { btn.textContent = "کپی آدرس"; }, 2000);
        }
        function fallback() {
          var r = document.createRange();
          r.selectNodeContents(addr);
          var s = window.getSelection();
          s.removeAllRanges();
          s.addRange(r);
          try { if (document.execCommand("copy")) done(); } catch (e) { /* selection stays highlighted */ }
        }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
        else fallback();
      });
    }
    /* data/donations.json: toman_total / toman_count come from the Reymit API job,
       usdt_total / usdt_count are edited by hand. Old keys (total_usdt, supporters) still work. */
    fetch("data/donations.json?v=" + Date.now())
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; })
      .then(function (D) {
        if (!D) return;
        var usdt = D.usdt_total != null ? D.usdt_total : (D.total_usdt || 0);
        var count = (D.toman_count || 0) + (D.usdt_count || 0);
        if (!count && D.supporters) count = D.supporters;
        set("dn-start", D.start_fa);
        set("dn-toman", fa(D.toman_total || 0));
        set("dn-usdt", fa(usdt) + " USDT");
        set("dn-total", fa(usdt) + " USDT");
        set("dn-count", fa(count));
        set("dn-updated", D.updated_fa);
      });
  }

  ready(function () {
    fixRepoLinks();
    fixNav();
    addNavLink();
    addFloat();
    addHeroSupport();
    loadItems();
    loadExtras();
    if (onDonate) initDonate();
  });
})();
