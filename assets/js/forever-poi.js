/* =========================================================
   wowfarsi — Forever world map: layers (forever-poi.js)
   A button with the site logo sits top-right on the live map. It opens a
   drop-down of everything the map can show (services, trainers, vendors,
   world); the visitor ticks what he wants. Default: nothing.
   Points: data/forever/db/poi/map-<slug>.json  [cat, x%, y%, ref, name, fac, lvl, cl]
   Categories + counts: data/forever/db/poi/index.json. Icons: the game's own
   (assets/img/map-icons). Continent maps show zone names instead of points: points appear only
   on a zone / city / battleground map.
   On a continent map the same layer shows the English name of every zone / city at its exact
   position (data/forever/db/poi/zone-labels.json); a click opens that zone's map.
   forever.js is untouched: this file watches the map image (src, transform,
   class) and lays one layer over it that follows the same pan / zoom. The layer is NOT scaled with
   the map (that would blur pins and names): it is made as big as the zoomed map and only translated,
   so every pin and name keeps its own crisp size at any zoom.
   ========================================================= */
"use strict";
(function () {
  var box = document.getElementById("fmap");
  var cv = box && box.querySelector(".fmap-cv");
  if (!box || !cv) return;
  var V = "20261103d", DB = "data/forever/db/poi/", IC = "assets/img/map-icons/", KEY = "wf_poi_sel_v1";
  var CONT = { "kalimdor": 1, "eastern-kingdoms": 1 };
  var SMALL = { "herb": 1, "ore": 1, "fishing-hole": 1, "chest": 1, "rare": 1, "cooking-fire": 1, "forge-anvil": 1 };
  var ZL = null, IDX = null, CATS = {}, DATA = {}, OPEN = { services: 1 }, SEL = {}, cur = "", failed = false;

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
  var zl = document.createElement("div");
  zl.className = "fpoi-layer fpoi-zl";
  zl.hidden = true;
  box.insertBefore(zl, layer.nextSibling);

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
      menu.innerHTML = '<p class="fpoi-note">نقاط فقط روی نقشهٔ هر زون یا شهر نشان داده می‌شود؛ روی قاره نه. روی نام یک زون کلیک کن تا باز شود.</p>';
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
          + "<b>" + esc(c.fa) + '<i dir="ltr">' + esc(c.en) + '</i></b><small>' + fa(n[c.key]) + "</small></label>";
      });
      if (!have) return;
      h += '<details class="fpoi-g" data-g="' + esc(g.key) + '"' + (OPEN[g.key] ? " open" : "") + '><summary><span>' + esc(g.fa) + ' <i dir="ltr">' + esc(g.en) + "</i></span><em>"
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
    var ld = cv.classList.contains("ld");
    layer.hidden = !!CONT[cur] || !ld || !layer.firstChild;
    zl.hidden = !CONT[cur] || !ld || !zl.firstChild;
  }

  /* ---------- zone names on a continent map ---------- */
  function renderZones() {
    var f = document.createDocumentFragment();
    zl.textContent = "";
    if (CONT[cur] && ZL && ZL[cur]) {
      ZL[cur].forEach(function (z) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "fpoi-z" + (z[4] === "c" ? " city" : "");
        b.setAttribute("data-s", z[0]);
        b.setAttribute("dir", "ltr");
        b.style.left = z[2] + "%";
        b.style.top = z[3] + "%";
        b.textContent = z[1];
        if (z[4] === "c") { b.title = z[1]; b.setAttribute("aria-label", z[1]); }   /* a city is a marker; its name shows on hover */
        f.appendChild(b);
      });
    }
    zl.appendChild(f);
    updateVis();
  }
  function loadZones() {
    if (ZL) { renderZones(); return; }
    fetch(DB + "zone-labels.json?v=" + V)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) { ZL = j || {}; renderZones(); })
      .catch(function () { ZL = {}; });
  }
  function goZone(slug) {
    var b = document.querySelector('#fmap-menu .fmap-mi[data-slug="' + slug + '"]');
    if (b) b.click();
  }
  /* a click on a name: the map frame captures the pointer for dragging, so a plain click event never reaches the
     button. Remember where the press started and open the zone when it ends within a few pixels. */
  var dn = null, lastGo = 0;
  box.addEventListener("pointerdown", function (e) {
    var t = e.target && e.target.closest ? e.target.closest(".fpoi-z") : null;
    dn = t ? { x: e.clientX, y: e.clientY, t: t } : null;
  }, true);
  box.addEventListener("pointerup", function (e) {
    var d = dn;
    dn = null;
    if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) return;
    lastGo = Date.now();
    goZone(d.t.getAttribute("data-s"));
  }, true);
  zl.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest(".fpoi-z") : null;
    if (t && Date.now() - lastGo > 500) goZone(t.getAttribute("data-s"));   /* keyboard (Enter / Space) */
  });

  /* ---------- follow the map (pan / zoom / which map) ---------- */
  var lastT = "";
  function sync() {
    var t = cv.style.transform || "", m, k, tr;
    if (t === lastT) return;
    lastT = t;
    m = t.match(/translate3d\(\s*(-?[0-9.e+-]+)px\s*,\s*(-?[0-9.e+-]+)px/);
    k = t.match(/scale\(([^)]+)\)/);
    if (!m || !k || !(+k[1] > 0)) return;
    tr = "translate(" + Math.round(+m[1]) + "px," + Math.round(+m[2]) + "px)";
    [layer, zl].forEach(function (L) {
      L.style.transform = tr;
      L.style.width = (+k[1] * 100).toFixed(3) + "%";
      L.style.height = (+k[1] * 100).toFixed(3) + "%";
    });
  }
  function refresh() {
    var slug = cur;
    if (!slug) return;
    if (CONT[slug]) { renderMenu(); renderPins(); loadZones(); return; }
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
    zl.textContent = "";
    zl.hidden = true;
    renderMenu();
    if (IDX) refresh();
    else if (CONT[s]) loadZones();
  }
  new MutationObserver(function () { slugCheck(); sync(); updateVis(); })
    .observe(cv, { attributes: true, attributeFilter: ["src", "style", "class"] });
  slugCheck(); sync(); renderMenu();
})();
