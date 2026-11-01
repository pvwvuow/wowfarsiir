/* =========================================================
   wowfarsi — Forever Spellbook (spellbook.html)
   Data: data/forever/db/spells.json (EN + FA + icons, build 1.60.1.70685)
   Language: WFTR switches (namesSpell / textDesc / terms) via tr.js
   ========================================================= */
(function () {
  "use strict";
  var DATA_V = "20261115c"; /* spells.json fetch bust — bump when the data changes */
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var FA = "۰۱۲۳۴۵۶۷۸۹";
  var fa = function (s) { return String(s).replace(/\d/g, function (d) { return FA[+d]; }); };

  var ST = {
    same: ["همسان با کلاسیک", "است"],
    changed: ["تغییرکرده نسبت به کلاسیک", "دارد"],
    new: ["تازه در فورور", "است"],
    talent: ["تلنت (با نقطهٔ تلنت می‌آید)", "است"],
    was_talent: ["پیش‌تر تلنت بود؛ اکنون آموزشی", "است"],
    earlier: ["زودتر از کلاسیک آموزش داده می‌شود", "می‌شود"],
    renamed: ["نامش عوض شده", "شده"],
    races: ["برای نژادهای بیشتر باز شده", "است"],
    removed: ["در فورور حذف شده", "شده"]
  };
  var CHIP_ORDER = ["all", "changed", "new", "talent", "earlier", "renamed", "races", "same", "removed"];
  var LVL_BANDS = [[1, 19], [20, 39], [40, 59], [60, 60]];
  var FKEY = "wf-sb-fav";

  var DATA = null, CLS = null, TAB = "all";
  var state = { q: "", st: "all", lvl: "all", sort: "lv", fav: false, tl: false };

  /* ---------- data ---------- */
  function load() {
    return fetch("data/forever/db/spells.json?v=" + DATA_V)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  }

  /* ---------- helpers ---------- */
  function cur() { for (var i = 0; i < DATA.classes.length; i++) if (DATA.classes[i].cls === CLS) return DATA.classes[i]; }
  function trOn(k) { return window.WFTR ? WFTR.on(k) : true; }
  /* v3.10: class + spec names answer the namesClass switch («اسم کلاس‌ها و
     شاخه‌ها» in the سبک ترجمه drawer) — ON: Persian, OFF: English.
     v3.11: the Persian side comes from the ONE class-name table
     (assets/js/clsnames.js, WFCLS: site canon + the user's own names from
     the custom room); the data field is only the fallback */
  function clsFa(en, f) { return window.WFCLS ? WFCLS.name(en, f) : f; }
  function tabLabel(t) { return trOn("namesClass") && t.fa ? clsFa(t.en, t.fa) : t.en; }
  function classLabel(c) {
    var n = c.cls || "";
    var en = n.charAt(0).toUpperCase() + n.slice(1);
    if (trOn("namesClass") && c.fa) return clsFa(en, c.fa);
    return en;
  }
  function spellName(s) {
    if (trOn("namesSpell") && s.fn) return s.fn;
    return s.n;
  }
  function spellNameHTML(s) {
    var fa_on = trOn("namesSpell") && s.fn;
    var main = fa_on ? s.fn : s.n;
    var alt = fa_on ? '<span class="rt-en" dir="ltr">' + esc(s.n) + "</span>" : (s.fn ? '<span style="font-size:.78rem;color:var(--mut)">' + esc(s.fn) + "</span>" : "");
    return esc(main) + " " + alt;
  }
  function faHTML(t) {
    /* FA text may carry build-time WFTR markers ({{sp:EN|FA}}, {{tm:EN|FA}})
       written by tools/markerize_spells.py — resolve them per the user's
       switches so embedded spell/talent names + glossary terms flip to EN
       when their switch is OFF (manager: names must live in the main
       categories everywhere, including mid-sentence) */
    var html = esc(t);
    return (window.WFTR && WFTR.faTokens) ? WFTR.faTokens(html) : html;
  }
  function bare(t) { return String(t == null ? "" : t).replace(/\{\{[^}]*\}\}/g, ""); }
  function tipHTML(txt, ftxt) {
    var use_fa = trOn("textDesc") && ftxt;
    var t = use_fa ? ftxt : txt;
    if (!t) return "";
    if (use_fa) return faHTML(t);
    return '<span class="rt-en" dir="ltr">' + esc(t) + "</span>";
  }
  function reqHTML(s) {
    if (!s.req) return "";
    var use_fa = trOn("textReq") !== false && s.freq;
    var t = use_fa ? s.freq : s.req;
    if (use_fa) return faHTML(t);
    return '<span class="rt-en" dir="ltr">' + esc(t) + "</span>";
  }
  function chgHTML(s) {
    if (!s.chg) return "";
    var use_fa = trOn("terms") !== false && s.fchg;
    var t = use_fa ? s.fchg : s.chg;
    if (use_fa) return faHTML(t);
    return '<span class="rt-en" dir="ltr">' + esc(t) + "</span>";
  }
  function favs() { try { return JSON.parse(localStorage.getItem(FKEY) || "{}"); } catch (e) { return {}; } }
  function toggleFav(key) {
    var f = favs();
    if (f[key]) delete f[key]; else f[key] = 1;
    try { localStorage.setItem(FKEY, JSON.stringify(f)); } catch (e) {}
  }
  function iconSrc(ic) {
    return "icons/large/" + ic + ".jpg";
  }

  /* ---------- filters ---------- */
  function passes(s) {
    if (TAB !== "all" && s.t !== TAB) return false;
    if (state.st !== "all" && s.s !== state.st) return false;
    if (state.fav && !favs()[CLS + "|" + s.n]) return false;
    if (state.lvl !== "all") {
      if (state.lvl === "tl") { if (!(s.lv == null || s.s === "talent")) return false; }
      else {
        var b = state.lvl.split("-"); var lo = +b[0], hi = +b[1];
        if (s.lv == null || s.lv < lo || s.lv > hi) return false;
      }
    }
    if (state.q) {
      var q = state.q.toLowerCase();
      if (s.n.toLowerCase().indexOf(q) < 0 && (!s.fn || s.fn.indexOf(state.q) < 0) &&
          !(s.tip || "").toLowerCase().indexOf(q) >= 0 === true ? false : true) {
        /* placeholder — real check below */
      }
      var hitN = s.n.toLowerCase().indexOf(q) >= 0 || (s.fn && s.fn.indexOf(state.q) >= 0);
      var hitT = (s.tip || "").toLowerCase().indexOf(q) >= 0 || bare(s.ftip).indexOf(state.q) >= 0;
      if (!hitN && !hitT) return false;
    }
    return true;
  }
  function cmp(a, b) {
    if (state.sort === "az") return (a.fn || a.n).localeCompare(b.fn || b.n, "fa");
    if (state.sort === "tab") return a.t === b.t ? (a.lv || 99) - (b.lv || 99) : a.t.localeCompare(b.t);
    var la = a.lv == null ? 99 : a.lv, lb = b.lv == null ? 99 : b.lv;
    return la - lb || a.t.localeCompare(b.t);
  }

  /* ---------- render: chrome ---------- */
  function renderClasses() {
    var el = $("sb-classes"); el.innerHTML = "";
    DATA.classes.forEach(function (c) {
      var b = document.createElement("button");
      b.className = "sb-cls" + (c.cls === CLS ? " on" : "");
      b.setAttribute("role", "tab");
      b.innerHTML = '<img src="icons/large/class_' + c.cls + '.jpg" onerror="this.src=\'icons/large/inv_misc_questionmark.jpg\';this.onerror=null" alt="">' +
        "<b>" + esc(classLabel(c)) + "</b>";
      b.onclick = function () { location.hash = c.cls; setClass(c.cls); };
      el.appendChild(b);
    });
  }
  function renderStats() {
    var c = cur(), sp = c.spells, ch = 0, nw = 0, tl = 0;
    sp.forEach(function (s) { if (s.s === "changed") ch++; if (s.s === "new") nw++; if (s.s === "talent") tl++; });
    $("sb-stats").innerHTML =
      '<span class="sb-stat">همهٔ اسپل‌ها <b>' + fa(sp.length) + "</b></span>" +
      '<span class="sb-stat">تغییرکرده <b>' + fa(ch) + "</b></span>" +
      '<span class="sb-stat">تازهٔ فورور <b>' + fa(nw) + "</b></span>" +
      '<span class="sb-stat">تلنتی <b>' + fa(tl) + "</b></span>" +
      '<span class="sb-stat">شاخه‌ها <b>' + fa(c.tabs.length) + "</b></span>";
  }
  function renderTabs() {
    var c = cur(), el = $("sb-tabs"); el.innerHTML = "";
    var mk = function (key, label, n) {
      var b = document.createElement("button");
      b.className = "sb-tab" + (TAB === key ? " on" : "");
      b.innerHTML = esc(label) + (n != null ? "<u>" + fa(n) + "</u>" : "");
      b.onclick = function () { TAB = key; renderTabs(); renderGrid(); };
      el.appendChild(b);
    };
    mk("all", "همهٔ شاخه‌ها", c.spells.length);
    c.tabs.forEach(function (t) {
      var n = c.spells.filter(function (s) { return s.t === t.en; }).length;
      mk(t.en, tabLabel(t), n);
    });
  }
  function renderChips() {
    var el = $("sb-status"); el.innerHTML = "";
    var counts = {};
    cur().spells.forEach(function (s) { counts[s.s] = (counts[s.s] || 0) + 1; });
    CHIP_ORDER.forEach(function (k) {
      var b = document.createElement("button");
      b.className = "sb-chip st-" + k + (state.st === k ? " on" : "");
      b.setAttribute("aria-pressed", state.st === k);
      var lbl = k === "all" ? "همه" : ST[k][0];
      b.textContent = lbl + (k !== "all" && counts[k] ? " · " + fa(counts[k]) : "");
      b.onclick = function () { state.st = state.st === k ? "all" : k; renderChips(); renderGrid(); };
      el.appendChild(b);
    });
  }
  function renderLvlOpts() {
    var el = $("sb-lvl");
    el.innerHTML = '<option value="all">همهٔ سطح‌ها</option>' +
      LVL_BANDS.map(function (b) { return '<option value="' + b[0] + "-" + b[1] + '">سطح ' + fa(b[0]) + "–" + fa(b[1]) + "</option>"; }).join("") +
      '<option value="tl">تلنت‌ها (بدون سطح آموزش)</option>';
    el.value = state.lvl;
  }

  /* ---------- render: grid ---------- */
  function rowHTML(s) {
    var key = CLS + "|" + s.n;
    var f = favs()[key] ? " on" : "";
    var st = ST[s.s] || ST.same;
    return '<div class="sb-row' + (s.s === "removed" ? " st-removed-row" : "") + '" data-n="' + esc(s.n) + '" tabindex="0" role="button">' +
      '<img class="sb-ico" loading="lazy" src="' + iconSrc(s.icon) + '" onerror="this.src=\'icons/large/inv_misc_questionmark.jpg\';this.onerror=null" alt="">' +
      '<div class="sb-main"><div class="sb-name">' + spellNameHTML(s) + "</div>" +
      '<div class="sb-meta"><span class="sb-tag">' + esc(tabFA(s.t)) + "</span>" +
      (s.r ? '<span class="sb-tag">' + fa(s.r) + " رده</span>" : "") +
      (s.lv != null ? '<span class="sb-lv">سطح ' + fa(s.lv) + "</span>" : "") +
      '<span class="sb-tag st-' + s.s + '">' + st[0] + "</span></div></div>" +
      '<div class="sb-right"><button class="sb-favbtn' + f + '" data-fav="' + esc(key) + '" title="نشان‌کردن" aria-label="نشان‌کردن">★</button></div></div>';
  }
  function tabFA(t) {
    var c = cur();
    for (var i = 0; i < c.tabs.length; i++) if (c.tabs[i].en === t) return tabLabel(c.tabs[i]);
    return t;
  }
  function renderGrid() {
    var c = cur();
    var list = c.spells.filter(passes).sort(cmp);
    var el = $("sb-grid");
    $("sb-count").innerHTML = "<b>" + fa(list.length) + "</b> اسپل" + (state.q ? " برای «" + esc(state.q) + "»" : "") + " — روی هر اسپل بزنید";
    if (!list.length) { el.innerHTML = '<div class="sb-empty">چیزی پیدا نشد. فیلترها را ساده‌تر کنید.</div>'; return; }
    if (state.sort === "lv" && !state.q) {
      var html = "", seen = {};
      LVL_BANDS.forEach(function (b) {
        var part = list.filter(function (s) { return s.lv != null && s.lv >= b[0] && s.lv <= b[1]; });
        if (!part.length) return;
        html += '<div class="sb-lvlhead">' + (b[0] === b[1] ? "سطح " + fa(b[0]) : "سطح " + fa(b[0]) + " تا " + fa(b[1])) + " · " + fa(part.length) + " اسپل</div>";
        part.forEach(function (s) { html += rowHTML(s); });
      });
      var rest = list.filter(function (s) { return s.lv == null; });
      if (rest.length) {
        html += '<div class="sb-lvlhead">تلنت‌ها · ' + fa(rest.length) + "</div>";
        rest.forEach(function (s) { html += rowHTML(s); });
      }
      el.innerHTML = html;
    } else {
      el.innerHTML = list.map(rowHTML).join("");
    }
  }

  /* ---------- drawer ---------- */
  var DETAIL = null; /* currently open spell name — for WFTR re-render */
  function openDetail(name) {
    var c = cur(), s = null;
    for (var i = 0; i < c.spells.length; i++) if (c.spells[i].n === name) { s = c.spells[i]; break; }
    if (!s) return;
    DETAIL = name;
    var st = ST[s.s] || ST.same;
    var h = '<div class="sb-dtitle"><img src="' + iconSrc(s.icon) + '" onerror="this.src=\'icons/large/inv_misc_questionmark.jpg\';this.onerror=null" alt="">' +
      "<div><h3>" + spellNameHTML(s) + "</h3></div></div>" +
      '<div class="sb-dmeta"><span class="sb-tag">' + esc(tabFA(s.t)) + "</span>" +
      (s.r ? '<span class="sb-tag">' + fa(s.r) + " رده</span>" : "") +
      (s.lv != null ? '<span class="sb-lv">آموزش از سطح ' + fa(s.lv) + "</span>" : '<span class="sb-lv">با نقطهٔ تلنت</span>') +
      '<span class="sb-tag st-' + s.s + '">' + st[0] + "</span></div>";
    if (s.tip || s.ct) {
      var sameTip = !s.ct || s.ct === s.tip;
      if (s.tip) h += '<div class="sb-block f"><h4>فورور <span dir="ltr" style="opacity:.6">Forever</span></h4><div class="sb-tipline">' + (tipHTML(s.tip, s.ftip) || "—") + "</div>" + (reqHTML(s) ? '<div class="sb-req">' + reqHTML(s) + "</div>" : "") + "</div>";
      if (s.ct && !sameTip) h += '<div class="sb-block c"><h4>کلاسیک <span dir="ltr" style="opacity:.6">Classic</span></h4><div class="sb-tipline">' + (tipHTML(s.ct, s.fct) || "—") + "</div></div>";
    } else {
      h += '<div class="sb-note">توضیحی در داده‌های کلاینت ثبت نشده است.</div>';
    }
    if (s.chg) h += '<div class="sb-block"><div class="sb-chg">✦ تغییر نسبت به کلاسیک: ' + chgHTML(s) + "</div></div>";
    h += '<div class="sb-src">منبع: کلاینت بتای فورور ۱٫۶۰٫۱٫۷۰۶۸۵ در برابر Classic Era ۱٫۱۵٫۹ · مقادیر پایهٔ کلاینت، پیش از تلنت و تجهیز</div>';
    $("sb-detail").innerHTML = h;
    $("sb-drawer").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeDetail() { $("sb-drawer").hidden = true; DETAIL = null; document.body.style.overflow = ""; }

  /* ---------- events ---------- */
  function wire() {
    $("sb-grid").addEventListener("click", function (e) {
      var fb = e.target.closest("[data-fav]");
      if (fb) { e.stopPropagation(); toggleFav(fb.getAttribute("data-fav")); fb.classList.toggle("on"); if (state.fav) renderGrid(); return; }
      var row = e.target.closest(".sb-row");
      if (row) openDetail(row.getAttribute("data-n"));
    });
    $("sb-grid").addEventListener("keydown", function (e) {
      if (e.key === "Enter") { var row = e.target.closest(".sb-row"); if (row) openDetail(row.getAttribute("data-n")); }
    });
    var qt;
    $("sb-q").addEventListener("input", function () {
      clearTimeout(qt); var v = this.value.trim();
      qt = setTimeout(function () { state.q = v; renderGrid(); }, 140);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== $("sb-q")) { e.preventDefault(); $("sb-q").focus(); }
      if (e.key === "Escape" && !$("sb-drawer").hidden) closeDetail();
    });
    $("sb-lvl").addEventListener("change", function () { state.lvl = this.value; renderGrid(); });
    $("sb-sort").addEventListener("change", function () { state.sort = this.value; renderGrid(); });
    $("sb-fav").addEventListener("click", function () {
      state.fav = !state.fav;
      this.classList.toggle("on", state.fav);
      this.setAttribute("aria-pressed", state.fav);
      renderGrid();
    });
    $("sb-tr").addEventListener("click", function () {
      /* v3.4: the translation settings live in the global left-edge drawer */
      if (window.WFTR && WFTR.toggleDrawer) WFTR.toggleDrawer();
    });
    $("sb-close").addEventListener("click", closeDetail);
    $("sb-backdrop").addEventListener("click", closeDetail);
    /* WFTR language flips re-render everything (incl. an open drawer) */
    if (window.WFTR && WFTR.onChange) WFTR.onChange(function () { renderClasses(); renderTabs(); renderChips(); renderGrid(); if (DETAIL && !$("sb-drawer").hidden) openDetail(DETAIL); });
    window.addEventListener("hashchange", function () {
      var h = location.hash.replace("#", "");
      if (h && h !== CLS && DATA.classes.some(function (c) { return c.cls === h; })) setClass(h);
    });
  }

  function setClass(cls) {
    CLS = cls; TAB = "all";
    state.st = "all";
    try { localStorage.setItem("wf-sb-cls", cls); } catch (e) {}
    renderClasses(); renderStats(); renderTabs(); renderChips(); renderLvlOpts(); renderGrid();
  }

  /* ---------- boot ---------- */
  function boot() {
    var h = location.hash.replace("#", "");
    var saved = null;
    try { saved = localStorage.getItem("wf-sb-cls"); } catch (e) {}
    CLS = (h && DATA.classes.some(function (c) { return c.cls === h; })) ? h :
          (saved && DATA.classes.some(function (c) { return c.cls === saved; })) ? saved : DATA.classes[0].cls;
    renderClasses(); renderStats(); renderTabs(); renderChips(); renderLvlOpts(); wire(); renderGrid();
    $("sb-build").textContent = DATA.build + " vs " + DATA.classic;
    if (window.setupReveals) setupReveals();
  }
  load().then(function (d) { DATA = d; boot(); })
    .catch(function (e) { $("sb-grid").innerHTML = '<div class="sb-empty">بارگذاری داده ناموفق بود — صفحه را تازه کنید. <span dir="ltr">' + esc(e) + "</span></div>"; });
})();
