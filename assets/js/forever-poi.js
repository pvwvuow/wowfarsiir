/* =========================================================
   wowfarsi — Forever world map: layers (forever-poi.js)
   A button with the site logo sits top-right on the live map. It opens a
   drop-down of everything the map can show (services, trainers, vendors,
   world); the visitor ticks what he wants. Default: nothing.
   Points: data/forever/db/poi/map-<slug>.json  [cat, x%, y%, ref, name, fac, lvl, cl]
   Categories + counts: data/forever/db/poi/index.json. Icons: the game's own
   (assets/img/map-icons). Continent maps show nothing: points appear only
   on a zone / city / battleground map.
   forever.js is untouched: this file watches the map image (src, transform,
   class) and lays one layer over it that follows the same pan / zoom.
   ========================================================= */
"use strict";
(function () {
  var box = document.getElementById("fmap");
  var cv = box && box.querySelector(".fmap-cv");
  if (!box || !cv) return;
  var V = "20261103a", DB = "data/forever/db/poi/", IC = "assets/img/map-icons/", KEY = "wf_poi_sel_v1";
  var CONT = { "kalimdor": 1, "eastern-kingdoms": 1 };
  var SMALL = { "herb": 1, "ore": 1, "fishing-hole": 1, "chest": 1, "rare": 1, "cooking-fire": 1, "forge-anvil": 1 };
  var IDX = null, CATS = {}, DATA = {}, OPEN = { services: 1 }, SEL = {}, cur = "", failed = false;

  function fa(n) { return Number(n).toLocaleString("fa-IR"); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icon2x(f) { return f.replace(".png", "@2x.png"); }
  try { (JSON.parse(localStorage.getItem(KEY) || "[]") || []).forEach(function (k) { SEL[k] = 1; }); } catch (_) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(Object.keys(SEL))); } catch (_) {} }

  /* ---------- DOM ---------- */
  var layer = document.createElement("div");
  layer.className = "fpoi-layer";
  layer.hidden = true;
  box.insertBefore(layer, cv.nextSibling);

  var ui = document.createElement("div");
  ui.className = "fpoi-ui";
  ui.innerHTML = '<button type="button" class="fpoi-btn" aria-haspopup="true" aria-expanded="false" aria-label="لایه‌های نقشه">'
    + '<img src="assets/img/logo.webp" alt="" width="22" height="22"><span>لایه‌ها</span><b class="fpoi-n" hidden></b>'
    + '<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>'
    + '<div class="fpoi-menu" hidden></div>';
  box.appendChild(ui);
  var btn = ui.querySelector(".fpoi-btn"), menu = ui.querySelector(".fpoi-menu"), badge = ui.querySelector(".fpoi-n");

  /* the map frame owns pointer / wheel / key handlers (drag, zoom, right-click): keep them away from the layer UI */
  ["pointerdown", "pointerup", "pointermove", "wheel", "dblclick", "contextmenu", "touchstart", "touchmove", "touchend", "keydown"].forEach(function (t) {
    ui.addEventListener(t, function (e) {
      if (t === "keydown" && e.key === "Escape") { setOpen(false); btn.focus(); }
      e.stopPropagation();
    });
  });
  function setOpen(on) {
    menu.hidden = !on;
    btn.setAttribute("aria-expanded", on ? "true" : "false");
    ui.classList.toggle("open", !!on);
  }
  btn.addEventListener("click", function (e) { e.stopPropagation(); setOpen(menu.hidden); });
  document.addEventListener("click", function (e) { if (!menu.hidden && !ui.contains(e.target)) setOpen(false); });
  menu.addEventListener("toggle", function (e) {
    var d = e.target;
    if (d && d.classList && d.classList.contains("fpoi-g")) { if (d.open) OPEN[d.getAttribute("data-g")] = 1; else delete OPEN[d.getAttribute("data-g")]; }
  }, true);

  /* ---------- data ---------- */
  function loadMap(slug) {
    if (DATA[slug]) return Promise.resolve(DATA[slug]);
    return fetch(DB + "map-" + slug + ".json?v=" + V)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) { DATA[slug] = (j && j.pts) || []; return DATA[slug]; })
      .catch(function () { DATA[slug] = []; return DATA[slug]; });
  }
  fetch(DB + "index.json?v=" + V)
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (j) {
      IDX = j;
      (j.cats || []).forEach(function (c) { CATS[c.key] = c; });
      refresh();
    })
    .catch(function () { failed = true; renderMenu(); });

  /* ---------- menu ---------- */
  function counts() {
    var n = {};
    (DATA[cur] || []).forEach(function (p) { n[p[0]] = (n[p[0]] || 0) + 1; });
    return n;
  }
  function selTotal() { return Object.keys(SEL).filter(function (k) { return CATS[k]; }).length; }
  function renderMenu() {
    var h = "", n, groups, st = menu.scrollTop;
    if (failed) { menu.innerHTML = '<p class="fpoi-note">لایه‌ها بارگذاری نشد؛ بعداً دوباره امتحان کن.</p>'; return; }
    if (!IDX) { menu.innerHTML = '<p class="fpoi-note">در حال بارگذاری…</p>'; return; }
    if (CONT[cur]) {
      menu.innerHTML = '<p class="fpoi-note">نقاط فقط روی نقشهٔ هر زون یا شهر نشان داده می‌شود؛ روی قاره نه. یک زون را باز کن.</p>';
      return;
    }
    n = counts();
    groups = IDX.groups || [];
    groups.forEach(function (g) {
      var rows = "", have = 0, on = 0;
      (IDX.cats || []).forEach(function (c) {
        if (c.group !== g.key || !n[c.key]) return;
        have++;
        if (SEL[c.key]) on++;
        rows += '<label class="fpoi-r"><input type="checkbox" data-k="' + esc(c.key) + '"' + (SEL[c.key] ? " checked" : "") + '>'
          + '<span class="fpoi-ic">' + (c.icon ? '<img src="' + IC + esc(c.icon) + '" srcset="' + IC + esc(c.icon) + " 1x, " + IC + esc(icon2x(c.icon)) + ' 2x" alt="" width="20" height="20">' : "<i></i>") + "</span>"
          + "<b>" + esc(c.fa) + '</b><small>' + fa(n[c.key]) + "</small></label>";
      });
      if (!have) return;
      h += '<details class="fpoi-g" data-g="' + esc(g.key) + '"' + (OPEN[g.key] ? " open" : "") + '><summary><span>' + esc(g.fa) + "</span><em>"
        + fa(on) + "/" + fa(have) + '</em></summary><div class="fpoi-gb"><button type="button" class="fpoi-all" data-g="' + esc(g.key) + '">'
        + (on === have ? "هیچ‌کدام" : "همه") + "</button>" + rows + "</div></details>";
    });
    if (!h) h = '<p class="fpoi-note">برای این نقشه نقطه‌ای ثبت نشده.</p>';
    else h += '<div class="fpoi-ft"><button type="button" class="fpoi-clr"' + (selTotal() ? "" : " disabled") + ">پاک کردن همه</button></div>";
    menu.innerHTML = h;
    menu.scrollTop = st;
  }
  menu.addEventListener("change", function (e) {
    var k = e.target && e.target.getAttribute && e.target.getAttribute("data-k");
    if (!k) return;
    if (e.target.checked) SEL[k] = 1; else delete SEL[k];
    save(); renderMenu(); renderPins();
  });
  menu.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("button") : null, g, all = true, cs = [];
    if (!b) return;
    if (b.classList.contains("fpoi-clr")) { SEL = {}; save(); renderMenu(); renderPins(); return; }
    if (b.classList.contains("fpoi-all")) {
      g = b.getAttribute("data-g");
      (IDX.cats || []).forEach(function (c) { if (c.group === g && counts()[c.key]) { cs.push(c.key); if (!SEL[c.key]) all = false; } });
      cs.forEach(function (k) { if (all) delete SEL[k]; else SEL[k] = 1; });
      save(); renderMenu(); renderPins();
    }
  });

  /* ---------- pins ---------- */
  var FAC = { A: "اتحاد", H: "هورد" };
  function pin(p, c) {
    var e, tip = (p[4] ? p[4] + " · " : "") + c.fa + (p[6] ? " · سطح " + fa(p[6]) : "") + (FAC[p[5]] ? " · " + FAC[p[5]] : "");
    if (c.icon) {
      e = document.createElement("img");
      e.src = IC + c.icon;
      e.srcset = IC + c.icon + " 1x, " + IC + icon2x(c.icon) + " 2x";
      e.alt = ""; e.draggable = false;
    } else {
      e = document.createElement("i");
    }
    e.className = "fpoi-p" + (SMALL[p[0]] ? " sm" : "") + (c.icon ? "" : " dm");
    e.style.left = p[1] + "%";
    e.style.top = p[2] + "%";
    e.title = tip;
    return e;
  }
  function renderPins() {
    var pts = CONT[cur] ? [] : (DATA[cur] || []), f = document.createDocumentFragment(), tot = selTotal();
    layer.textContent = "";
    pts.forEach(function (p) {
      var c = CATS[p[0]];
      if (c && SEL[p[0]]) f.appendChild(pin(p, c));
    });
    layer.appendChild(f);
    badge.hidden = !tot;
    badge.textContent = fa(tot);
    updateVis();
  }
  function updateVis() {
    layer.hidden = !!CONT[cur] || !cv.classList.contains("ld") || !layer.firstChild;
  }

  /* ---------- follow the map (pan / zoom / which map) ---------- */
  var lastT = "";
  function sync() {
    var t = cv.style.transform || "", m;
    if (t === lastT) return;
    lastT = t;
    layer.style.transform = t;
    m = t.match(/scale\(([^)]+)\)/);
    if (m && +m[1] > 0) layer.style.setProperty("--inv", (1 / +m[1]).toFixed(4));
  }
  function refresh() {
    var slug = cur;
    if (!slug) return;
    if (CONT[slug]) { renderMenu(); renderPins(); return; }
    loadMap(slug).then(function () {
      if (cur !== slug) return;
      renderMenu(); renderPins();
    });
  }
  function slugCheck() {
    var m = (cv.getAttribute("src") || "").match(/forever\/([a-z0-9-]+)\.jpg/), s = m ? m[1] : "";
    if (!s || s === cur) return;
    cur = s;
    layer.textContent = "";
    layer.hidden = true;
    renderMenu();
    if (IDX) refresh();
  }
  new MutationObserver(function () { slugCheck(); sync(); updateVis(); })
    .observe(cv, { attributes: true, attributeFilter: ["src", "style", "class"] });
  slugCheck(); sync(); renderMenu();
})();
