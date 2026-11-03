/* =========================================================
   wowfarsi — THE canonical header nav (single source of truth)

   Every page (static HTML, JS shells, news/item/guides) ends up
   with the SAME nav, in the SAME order:

     خانه · Midnight ▾ · Forever · wowheadFA · آیتم‌ها
           · افزونه · وضعیت ترجمه · حمایت

   Midnight is a click-driven dropdown ("golden thread" choreography):

     Midnight ▾
       ├─ آیتم‌ها  -> 8 categories
       ├─ کلاس‌ها  -> 13 -> specs
       │             ├─ راهنما
       │             └─ تلنت‌ها
       └─ صفحهٔ Midnight / آیتم‌ها

   Forever is a PLAIN LINK to forever.html: that page is the hub (every
   Forever section as grouped cards: map, dungeons, quests, NPCs, items,
   talents, spellbook, patch notes ...). The old long dropdown is gone.

   How consistency is guaranteed:
     1. this script REWRITES .nav-links on every page (nav.dataset
        .canonical = "1") — whatever static markup the page had is
        replaced by the canonical items in canonical order;
     2. support.js fixNav() may run before OR after us and re-add
        retired plain links — a MutationObserver removes any plain
        link that lives inside a dropdown, so the nav never dupes;
     3. retail.js chrome() builds the same canonical order for the
        JS-only shells (retail/db/items/guide).

   No dependencies; include once per page before </body>.
   ========================================================= */
"use strict";
(function () {
  var V = "20261115b";
  /* pages living in a sub-directory (news/<id>-<slug>.html, item/<id>-<slug>.html,
     guides/<spec>/index.html) need ../ prefixes; without this the injected CSS,
     the spec fetch and every panel link 404 there */
  var BASE = (function () {
    var m = location.pathname.match(/^\/(?:news|guides|item)\//);
    if (!m) return "";
    var rest = location.pathname.slice(m[0].length);
    return "../".repeat(1 + (rest.match(/[/]/g) || []).length);
  })();

  if (!document.getElementById("rtx-crit")) {
    var crit = document.createElement("style");
    crit.id = "rtx-crit";
    crit.textContent =
      ".rtx-wrap{position:relative;display:inline-flex}" +
      ".rtx-trigger{display:inline-flex;align-items:center;gap:.3rem;background:none;border:0;padding:.4rem .1rem;font:inherit;font-size:13px;color:#c3bdb0;cursor:pointer;position:relative;transition:color .2s ease}" +
      ".rtx-trigger .chev{transition:transform .25s ease;opacity:.7}" +
      ".rtx-plumb{display:none}" +
      ".rtx-panel{position:absolute;top:calc(100% + 1px);inset-inline-start:12px;width:296px;max-width:calc(100vw - 24px);opacity:0;visibility:hidden;pointer-events:none;z-index:5}";
    (document.head || document.documentElement).appendChild(crit);
  }
  if (!document.getElementById("rtx-css")) {
    var css = document.createElement("link");
    css.id = "rtx-css";
    css.rel = "stylesheet";
    css.href = BASE + "assets/css/nav-menu.css?v=" + V;
    document.head.appendChild(css);
  }

  /* ---------- v3.7: the سبک ترجمه button on EVERY page ----------
     tr.js (the global translation-style drawer) used to be included by 3
     pages only, so the rest of the site had no سبک ترجمه button and every
     new page needed its own <script> tag. nav-menu.js runs on every page
     (static HTML, JS shells, news/item pages — future templates included),
     so it is the natural loader: inject tr.js once if the page forgot it.
     tr.js then injects its own stylesheet and mounts the left-edge drawer;
     the studio room (translate.html) is skipped by tr.js's own guards. */
  if (!document.querySelector('script[src*="tr.js"]')) {
    var trLoader = document.createElement("script");
    trLoader.src = BASE + "assets/js/tr.js"; /* versionless: tr.js bumps its own tags; Pages max-age=600 keeps staleness ≤10min */
    trLoader.async = false; /* ordered: tr-prof.js below needs WFTR first */
    document.head.appendChild(trLoader);
  }
  /* saved translation styles (tr-prof.js: «سبک‌های من» in the drawer + the quick bar English · فارسی · سبک ۱/۲/۳)
     ride along on every page; it waits for WFTR itself if tr.js is still loading */
  if (!document.querySelector('script[src*="tr-prof.js"]')) {
    var profLoader = document.createElement("script");
    profLoader.src = BASE + "assets/js/tr-prof.js";
    profLoader.async = false;
    document.head.appendChild(profLoader);
  }
  /* the ONE class/spec name table (assets/js/clsnames.js, WFCLS) rides along
     with tr.js on every page; it patches WFTR whichever of the two loads first */
  if (!document.querySelector('script[src*="clsnames.js"]')) {
    var clsLoader = document.createElement("script");
    clsLoader.src = BASE + "assets/js/clsnames.js";
    document.head.appendChild(clsLoader);
  }

  var nav = document.querySelector(".nav-links");
  var header = document.querySelector("header.nav");
  if (!nav || !header) return;
  if (nav.dataset.canonical === "1") return; // already canonical

  /* ------------------------------------------------ paths */
  var path = location.pathname;
  function onPage(f) { return new RegExp("[/]" + f.replace(/\./g, "\\.") + "$").test(path); }
  var M_MID = onPage("retail.html") || onPage("db.html") || onPage("guide.html") ||
              onPage("item.html") || /^\/item\//.test(path) || /^\/guides\//.test(path);
  var M_FVR = onPage("forever.html") || onPage("forever-talents.html") ||
              onPage("spellbook.html") || onPage("patch-notes.html") || onPage("items.html") ||
              onPage("quest.html") || onPage("quests.html") || onPage("npc.html") || onPage("dungeon.html") ||
              onPage("professions.html") || onPage("profession.html");
  var M_PROF = onPage("professions.html") || onPage("profession.html");
  var M_NEWS = onPage("news.html") || onPage("article.html") || onPage("news-translate.html") || /^\/news\//.test(path);
  var ON_INDEX = /\/(?:index\.html)?$/.test(path) && !M_MID && !M_FVR && !M_NEWS;
  var ACT = " is-active";

  /* ------------------------------------------------ dropdown data */
  var CATS = [
    ["gear", "گیر و سلاح", "Gear & Weapons"],
    ["gems", "سنگ‌ها", "Gems"],
    ["materials", "مواد اولیه", "Materials"],
    ["consumables", "مصرفی‌ها", "Consumables"],
    ["recipes", "دستورها", "Recipes"],
    ["housing", "خانه‌داری", "Housing"],
    ["quest", "کوئست", "Quest"],
    ["misc", "متفرقه", "Misc"]
  ];
  var CLASSES = [
    ["death-knight", "Death Knight", "#E0405A"],
    ["demon-hunter", "Demon Hunter", "#C558E8"],
    ["druid", "Druid", "#FF7C0A"],
    ["evoker", "Evoker", "#33937F"],
    ["hunter", "Hunter", "#AAD372"],
    ["mage", "Mage", "#3FC7EB"],
    ["monk", "Monk", "#00FF98"],
    ["paladin", "Paladin", "#F48CBA"],
    ["priest", "Priest", "#FFFFFF"],
    ["rogue", "Rogue", "#FFF468"],
    ["shaman", "Shaman", "#0070DD"],
    ["warlock", "Warlock", "#8788EE"],
    ["warrior", "Warrior", "#C69B6D"]
  ];
  var ROLE_FA = { tank: "تانک", healer: "هیلر", dps: "دِیلر" };
  var LVL_W = { root: 296, items: 560, classes: 520, specs: 470 };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function specSlug(s) { return String(s || "").toLowerCase().replace(/\s+/g, "-"); }
  var CHEV_D = '<svg class="chev" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  var CHEV_L = '<svg class="chev" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
  var CHEV_R = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';

  /* ================================================ 1) canonical nav */
  nav.dataset.canonical = "1";
  var html =
    '<a href="' + (ON_INDEX ? "#top" : BASE + "index.html") + '">خانه</a>' +
    '<span class="rtx-wrap" data-dd="midnight"></span>' +
    '<a href="' + BASE + 'forever.html"' + (M_FVR && !M_PROF ? ' class="is-active"' : "") + '>Forever</a>' +
    '<a href="' + BASE + 'professions.html"' + (M_PROF ? ' class="is-active"' : "") + '>حرفه‌ها</a>' +
    '<a href="' + BASE + 'news.html"' + (M_NEWS ? ' class="is-active"' : "") + '>wowheadFA</a>' +
    '<a href="' + BASE + 'item.html"' + (onPage("item.html") || onPage("db.html") ? ' class="is-active"' : "") + '>آیتم‌ها</a>' +
    '<a href="' + BASE + 'addon.html"' + (onPage("addon.html") ? ' class="is-active"' : "") + '>افزونه</a>' +
    '<a href="' + BASE + 'status.html"' + (onPage("status.html") ? ' class="is-active"' : "") + '>وضعیت ترجمه</a>' +
    '<a href="' + BASE + 'donate.html" class="dn-nav' + (onPage("donate.html") ? " is-active" : "") + '">حمایت</a>';
  nav.innerHTML = html;

  var DROPDOWNS = {};

  /* ================================================ 2) dropdown factory */
  function buildDropdown(id, label, active, widths, levelsHtml) {
    var wrap = nav.querySelector('[data-dd="' + id + '"]');
    if (!wrap) return null;
    wrap.innerHTML =
      '<button type="button" id="rtx-trigger-' + id + '" class="rtx-trigger' + (active ? ACT : "") + '"' +
      ' aria-expanded="false" aria-haspopup="true">' + label + " " + CHEV_D + "</button>" +
      '<i class="rtx-plumb" aria-hidden="true"></i>';
    var panel = document.createElement("div");
    panel.className = "rtx-panel";
    panel.id = "rtx-panel-" + id;
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML =
      '<div class="rtx-fl" aria-hidden="true"><i class="rg"></i><b class="dt"></b></div>' +
      '<div class="rtx-view">' + levelsHtml + "</div>";
    header.appendChild(panel);

    var view = panel.querySelector(".rtx-view");
    var plumb = wrap.querySelector(".rtx-plumb");
    var LV = {};
    Array.prototype.forEach.call(panel.querySelectorAll(".rtx-lvl"), function (el) {
      LV[el.getAttribute("data-lvl")] = { el: el };
    });

    var d = {
      id: id, wrap: wrap, panel: panel, trigger: wrap.querySelector("button"),
      plumb: plumb, LV: LV, widths: widths || {},
      open: false, cur: "root", swapT: null, closeT: null
    };
    DROPDOWNS[id] = d;

    function placeFor(lvl) {
      var hr = header.getBoundingClientRect();
      var wr = wrap.getBoundingClientRect();
      var W = Math.min(d.widths[lvl] || 296, hr.width - 24);
      var x0 = hr.right - wr.right;                     /* RTL: panel start ~ trigger start */
      var x = Math.max(12, Math.min(x0, hr.width - 12 - W));
      panel.style.width = W + "px";
      panel.style.insetInlineStart = x + "px";
      plumb.style.height = Math.max(10, hr.bottom - wr.bottom + 3) + "px";
    }
    d._placeFor = placeFor;
    function measure(lvl) { view.style.height = d.LV[lvl].el.offsetHeight + "px"; }

    function goLevel(lvl, dir) {
      if (lvl === d.cur || !d.LV[lvl]) return;
      var fwd = dir !== -1;
      var from = d.LV[d.cur], to = d.LV[lvl];
      placeFor(lvl); measure(lvl);
      to.el.classList.add("act", fwd ? "enter-l" : "enter-r");
      void to.el.offsetWidth;                           /* flush */
      to.el.classList.remove("enter-l", "enter-r");
      from.el.classList.remove("act");
      from.el.classList.add(fwd ? "exit-r" : "exit-l");
      clearTimeout(d.swapT);
      d.swapT = setTimeout(function () { from.el.classList.remove("exit-r", "exit-l"); }, 330);
      d.cur = lvl;
    }
    function resetRoot() {
      clearTimeout(d.swapT);
      Object.keys(d.LV).forEach(function (k) {
        d.LV[k].el.classList.remove("act", "enter-l", "enter-r", "exit-l", "exit-r");
      });
      d.LV.root.el.classList.add("act");
      d.cur = "root";
      measure("root");
      if (id === "midnight" && specRendered) {
        panel.querySelector("#rtx-spec-list").innerHTML = "";
        specRendered = false;
      }
    }
    d._resetRoot = resetRoot;

    function setOpen(v) {
      if (v === d.open) return;
      d.open = v;
      wrap.classList.toggle("open", v);
      panel.classList.toggle("open", v);
      panel.setAttribute("aria-hidden", v ? "false" : "true");
      d.trigger.setAttribute("aria-expanded", v ? "true" : "false");
      if (v) {
        /* opening one dropdown closes the other */
        Object.keys(DROPDOWNS).forEach(function (k) {
          if (k !== id && DROPDOWNS[k].open) DROPDOWNS[k]._setOpen(false);
        });
        clearTimeout(d.closeT);
        panel.classList.add("noanim");
        resetRoot();
        placeFor("root");
        void panel.offsetWidth;                         /* apply instantly, then animate in */
        panel.classList.remove("noanim");
        if (id === "midnight") ensureSpecData();        /* warm the spec counts */
      } else {
        d.closeT = setTimeout(function () {
          panel.classList.add("noanim");
          resetRoot();
          panel.classList.remove("noanim");
        }, 300);
      }
    }
    d._setOpen = setOpen;

    d.trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(!d.open);
    });
    panel.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (link) { setOpen(false); return; }             /* real links navigate */
      var go = e.target.closest("[data-go]");
      if (go) { goLevel(go.getAttribute("data-go"), go.hasAttribute("data-back") ? -1 : 1); return; }
      var clsBtn = e.target.closest(".rtx-cls");
      if (clsBtn) openSpecs(clsBtn.getAttribute("data-slug"));
    });

    /* specs (Midnight only) */
    var specData = null, specPromise = null, specRendered = false;
    function ensureSpecData() {
      if (specPromise) return specPromise;
      specPromise = fetch(BASE + "data/retail/index.json")
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (dd) {
          specData = (dd && dd.specs) || {};
          fillSpecCounts();
          return specData;
        })
        .catch(function () { specData = {}; return specData; });
      return specPromise;
    }
    function fillSpecCounts() {
      Array.prototype.forEach.call(panel.querySelectorAll(".rtx-cls"), function (b) {
        var list = (specData || {})[b.getAttribute("data-slug")];
        var n = list && list.length ? list.length : null;
        b.querySelector(".rtx-cc").textContent = n ? n + " SPECS" : "SPECS";
      });
    }
    function openSpecs(slug) {
      if (id !== "midnight") return;
      if (specData) renderSpecs(slug);
      else ensureSpecData().then(function () { renderSpecs(slug); });
    }
    function renderSpecs(slug) {
      var cls = null;
      for (var i = 0; i < CLASSES.length; i++) if (CLASSES[i][0] === slug) cls = CLASSES[i];
      var list = (specData || {})[slug];
      if (!list || !list.length) {
        location.href = BASE + "talents.html?class=" + encodeURIComponent(slug);
        return;
      }
      panel.querySelector("#rtx-spec-ttl").textContent = cls ? cls[1] : slug;
      var ttl = panel.querySelector("#rtx-spec-ttl");
      ttl.style.color = cls ? cls[2] : "";
      panel.querySelector("#rtx-spec-list").innerHTML = list.map(function (s) {
        var tUrl = BASE + "talents.html?class=" + encodeURIComponent(slug) +
          "&spec=" + encodeURIComponent(specSlug(s.en || s.slug));
        var gUrl = BASE + "guide.html?spec=" + encodeURIComponent(s.slug + "-" + slug);
        return '<div class="rtx-spec">' +
          '<span class="rtx-sn"><b dir="ltr">' + esc(s.en || s.slug) + "</b>" +
          '<small class="rtx-role">' + esc(ROLE_FA[s.role] || s.role || "") + "</small></span>" +
          '<span class="rtx-acts">' +
          (s.ready ? '<a class="rtx-act rtx-act-d" href="' + gUrl + '">راهنما</a>' : "") +
          '<a class="rtx-act" href="' + tUrl + '">تلنت‌ها</a>' +
          "</span></div>";
      }).join("");
      specRendered = true;
      goLevel("specs", 1);
    }

    return d;
  }

  document.addEventListener("click", function (e) {
    Object.keys(DROPDOWNS).forEach(function (k) {
      var d = DROPDOWNS[k];
      if (!d.open) return;
      if (d.panel.contains(e.target) || d.wrap.contains(e.target)) return;
      d._setOpen(false);
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    Object.keys(DROPDOWNS).forEach(function (k) {
      if (DROPDOWNS[k].open) DROPDOWNS[k]._setOpen(false);
    });
  });
  window.addEventListener("resize", function () {
    Object.keys(DROPDOWNS).forEach(function (k) {
      var d = DROPDOWNS[k];
      if (d.open) { d._placeFor(d.cur); }
    });
  });

  /* ================================================ 3) Midnight dropdown */
  buildDropdown("midnight", "Midnight", M_MID, LVL_W,
    '<div class="rtx-lvl" data-lvl="root">' +
      '<button type="button" class="rtx-big" data-go="items">' +
        '<i class="rtx-d" aria-hidden="true"></i>' +
        '<span class="rtx-bt"><b>آیتم‌ها</b><small dir="ltr">ITEM DATABASE</small></span>' + CHEV_L +
      "</button>" +
      '<button type="button" class="rtx-big" data-go="classes">' +
        '<i class="rtx-d" aria-hidden="true"></i>' +
        '<span class="rtx-bt"><b>کلاس‌ها</b><small dir="ltr">CLASSES · SPECS</small></span>' + CHEV_L +
      "</button>" +
      '<div class="rtx-sep" aria-hidden="true"></div>' +
      '<a class="rtx-mini" href="' + BASE + 'retail.html">صفحهٔ Midnight<small dir="ltr">MIDNIGHT 12.1.5</small></a>' +
      '<a class="rtx-mini" href="' + BASE + 'item.html?ver=retail">بانک آیتم‌ها<small dir="ltr">ITEM BANK</small></a>' +
    "</div>" +
    '<div class="rtx-lvl" data-lvl="items">' +
      '<div class="rtx-hd">' +
        '<button type="button" class="rtx-back" data-go="root" data-back>' + CHEV_R + "بازگشت</button>" +
        '<b class="rtx-ttl">آیتم‌ها</b>' +
        '<small class="rtx-cap" dir="ltr">CATEGORIES</small>' +
      "</div>" +
      '<div class="rtx-g2">' + CATS.map(function (c) {
        return '<a class="rtx-cell" href="' + BASE + 'item.html?ver=retail&cat=' + c[0] + '">' +
          '<span class="rtx-l1"><i class="rtx-d" aria-hidden="true"></i><b>' + c[1] + "</b></span>" +
          '<small dir="ltr">' + esc(c[2]) + "</small></a>";
      }).join("") + "</div>" +
    "</div>" +
    '<div class="rtx-lvl" data-lvl="classes">' +
      '<div class="rtx-hd">' +
        '<button type="button" class="rtx-back" data-go="root" data-back>' + CHEV_R + "بازگشت</button>" +
        '<b class="rtx-ttl">کلاس‌ها</b>' +
        '<small class="rtx-cap" dir="ltr">CHOOSE A CLASS</small>' +
      "</div>" +
      '<div class="rtx-g3">' + CLASSES.map(function (c) {
        return '<button type="button" class="rtx-cell rtx-cls" data-slug="' + c[0] + '" style="--cls:' + c[2] + '">' +
          '<span class="rtx-l1"><i class="rtx-d" aria-hidden="true"></i><b class="rtx-cn" dir="ltr">' + esc(c[1]) + "</b></span>" +
          '<small class="rtx-cc" dir="ltr">SPECS</small></button>';
      }).join("") + "</div>" +
    "</div>" +
    '<div class="rtx-lvl" data-lvl="specs">' +
      '<div class="rtx-hd">' +
        '<button type="button" class="rtx-back" data-go="classes" data-back>' + CHEV_R + "کلاس‌ها</button>" +
        '<b class="rtx-ttl rtx-ttl-cls" dir="ltr" id="rtx-spec-ttl"></b>' +
        '<small class="rtx-cap" dir="ltr">SPECS</small>' +
      "</div>" +
      '<div class="rtx-specs" id="rtx-spec-list"></div>' +
    "</div>");

  /* ================================================ 4) keep it canonical
     support.js fixNav() may run after us (DOMContentLoaded) and re-add
     plain links that now live inside the Midnight dropdown — remove them again.
     (forever.html is NOT in this list: the Forever nav item is a plain link on purpose.) */
  var DD_OWNED = /(?:^|[/])(?:retail|spellbook|forever-talents|patch-notes)\.html(?:[?#].*)?$/;
  function dropOwned() {
    Array.prototype.forEach.call(nav.querySelectorAll("a"), function (a) {
      var h = a.getAttribute("href") || "";
      if (DD_OWNED.test(h)) a.parentNode.removeChild(a);
    });
  }
  dropOwned();
  if (window.MutationObserver) {
    new MutationObserver(dropOwned).observe(nav, { childList: true });
  }
})();
