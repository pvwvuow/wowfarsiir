/* =========================================================
   wowfarsi — Forever talent calculator (fa) · v6
   Same language as the retail Talent Tree page and the item
   card (site.css / fantasy.css): hairlines that fade out,
   ring + dot ornaments, little diamonds, no boxes.
   ONE SVG canvas, the three trees as framed zones side by
   side, retail-size circular icons on a TIGHT grid
   (pos = [row, col]). Node states: locked (dim, grey ring) ·
   available (bronze ring) · spent (gold) · maxed (bright gold
   halo). Active abilities wear a dashed outer ring (like the
   retail hero gate). Spending a point sends a gold burst;
   switching class/tree fades the tree in tier by tier.
   No fake connectors: arrows only for a real prerequisite
   (optional node field `req` = talent name).
   Phone: one tree at a time (tree chips), no panning needed.
   Click = +1 · right-click = −1 · hold / shift+click = details.
   Data: data/forever/db/{class}.json + classes.json
   ========================================================= */
"use strict";
(function () {
  var root = document.getElementById("fc-root");
  if (!root) return;

  var ZAM = "https://wow.zamimg.com/images/wow/icons/large/";
  var ST_FA = { same: "همان کلاسیک", changed: "تغییرکرده", new: "جدید در Forever", earlier: "زودتر از کلاسیک", was_talent: "قبلاً تلنت بود", talent: "همراه تلنت", moved: "جابه‌جاشده" };
  var PIP = { new: "#8fd4a4", moved: "#c9a2e8", was_talent: "#c9a2e8" }; /* "changed" lives in the tooltip only (most nodes are) */
  var SAVE_KEY = "wf-forever-builds";
  var MAXPTS = 51;

  /* geometry (viewBox units). Node pitch ≈ 1.5 × node diameter,
     the same density as the retail tree (v4 was 2.5×). */
  var R = 0.34, ICON = 0.9, COL = 1.04, ROW = 1.02;
  var PAD_X = 0.62, HEAD = 1.22, PAD_B = 0.56, GAP = 0.42;
  var MIN_K = 0.6, MAX_K = 3.5, PHONE = 760;
  var HINT = "کلیک = +۱ امتیاز · راست‌کلیک = −۱ · نگه‌داشتن یا شیفت+کلیک = توضیح · Ctrl+اسکرول یا دکمه‌ها = زوم";

  var INDEX = null, DATA = null, ACTIVE = null;
  var state = { cls: "warrior", spent: [0, 0, 0], pts: {}, order: [], legacy: false, tree: 0, saves: false };
  var popKey = null, enterAnim = true; /* one-shot effects for the next render */
  var view = null, vb = null, panningActive = false, phone = false;
  var pinnedKey = null;
  var GEO = null;
  var broken = new Set();

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function getJSON(u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
  function faNum(s) { return String(s).replace(/[0-9]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹"[+d]; }); }
  function iconUrl(ic) { return ic ? "icons/large/" + ic + ".jpg" : null; }
  function key(t, name) { return t + "|" + name; }
  function spentIn(t) { return state.spent[t] || 0; }
  function totalSpent() { return state.spent[0] + state.spent[1] + state.spent[2]; }
  function budget() { return MAXPTS + (state.legacy ? 5 : 0); }
  function tierReq(ti) { return ti * 5; }
  function f3(n) { return (+n).toFixed(3); }

  function eachNode(t, fn) {
    var tr = DATA.trees[t];
    for (var i = 0; i < tr.tiers.length; i++)
      for (var j = 0; j < tr.tiers[i].length; j++) fn(tr.tiers[i][j], i, j);
  }
  function nodeData(t, name) {
    var found = null;
    eachNode(t, function (x, ti) { if (x.n === name && !found) found = { x: x, ti: ti }; });
    return found;
  }
  function maxRanks(t, name) { var nd = nodeData(t, name); return nd ? nd.x.r || 1 : 1; }
  function spentOn(t, name) { return state.pts[key(t, name)] || 0; }
  /* classic gate: tier i needs i*5 points spent in the tiers ABOVE it */
  function pointsBelow(t, ti, pts) {
    var s = 0;
    eachNode(t, function (x, i) { if (i < ti) s += (pts || state.pts)[key(t, x.n)] || 0; });
    return s;
  }
  function isActive(x) { return !!(ACTIVE && ACTIVE[x.n]); }

  function wfName(en, fallback) {
    if (window.WFTR && WFTR.on && !WFTR.on("namesClass") && en) return en;
    if (window.WFCLS && WFCLS.name) return WFCLS.name(en, fallback);
    return fallback || en;
  }
  function treeLabel(tr) {
    var m = String(tr.fa || "").match(/^(.*\S)\s+[A-Za-z]+$/);
    return wfName(tr.n, m ? m[1] : tr.fa);
  }
  function classLabel(c) { return wfName(c.name, c.fa); }

  /* =========================================================
     layout
     ========================================================= */
  function frameOf(t, x0) {
    var tr = DATA.trees[t], pos = {};
    var cols = tr.cols || 4, rows = tr.tiers.length;
    tr.tiers.forEach(function (tier) {
      tier.forEach(function (x) {
        var p = x.pos || [1, 1];
        pos[x.n] = { x: x0 + PAD_X + (p[1] - 1) * COL, y: HEAD + R + 0.18 + (p[0] - 1) * ROW };
      });
    });
    return { t: t, x: x0, w: (cols - 1) * COL + PAD_X * 2, h: HEAD + R + 0.18 + (rows - 1) * ROW + R + PAD_B, pos: pos };
  }
  function computeGeo() {
    var list = phone ? [state.tree] : DATA.trees.map(function (_, t) { return t; });
    var frames = [], offX = 0, pos = {};
    list.forEach(function (t) {
      var f = frameOf(t, offX);
      frames.push(f);
      Object.keys(f.pos).forEach(function (n) { pos[key(t, n)] = f.pos[n]; });
      offX += f.w + GAP;
    });
    return { frames: frames, pos: pos, totalW: offX - GAP, totalH: Math.max.apply(null, frames.map(function (f) { return f.h; })) };
  }

  /* =========================================================
     svg builders
     ========================================================= */
  function nodeState(t, x, ti) {
    var have = spentOn(t, x.n), max = x.r || 1;
    if (have >= max) return "maxed";
    var reqOk = !x.req || spentOn(t, x.req) >= maxRanks(t, x.req);
    var open = pointsBelow(t, ti) >= tierReq(ti) && reqOk;
    if (!open) return have > 0 ? "spent" : "locked";
    if (totalSpent() >= budget()) return have > 0 ? "spent" : "full";
    return have > 0 ? "spent avail" : "avail";
  }

  function nodeSVG(t, x, ti, p) {
    var have = spentOn(t, x.n), max = x.r || 1;
    var st = nodeState(t, x, ti), act = isActive(x), k = key(t, x.n);
    var id = "fc-" + t + "-" + String(x.n).replace(/[^a-zA-Z0-9]/g, "_");
    var ir = R * ICON;
    var parts = ['<g class="fc-node ' + st + (act ? " act" : "") + '" data-t="' + t + '" data-n="' + esc(x.n) + '" transform="translate(' + f3(p.x) + " " + f3(p.y) + ')">'];
    parts.push('<g class="nd-in" style="--d:' + (ti * 45) + 'ms">');
    if (have > 0) parts.push('<circle class="nd-halo" r="' + f3(R * 1.34) + '"/>');
    if (act) parts.push('<circle class="nd-gate" r="' + f3(R + 0.085) + '"/>');
    parts.push('<circle class="nd-body" r="' + f3(R) + '"/>');
    parts.push('<clipPath id="' + id + '"><circle r="' + f3(ir) + '"/></clipPath>');
    if (iconUrl(x.ic) && !broken.has(x.ic)) {
      parts.push('<image href="' + iconUrl(x.ic) + '" x="' + f3(-ir) + '" y="' + f3(-ir) + '" width="' + f3(2 * ir) + '" height="' + f3(2 * ir) +
        '" clip-path="url(#' + id + ')" preserveAspectRatio="xMidYMid slice" data-bid="' + esc(x.ic) + '" data-fallback="' + ZAM + esc(x.ic) + '.jpg" data-letter="' + esc((x.n[0] || "?").toUpperCase()) + '"/>');
    } else {
      parts.push('<text class="fc-letter" x="0" y="0.02" text-anchor="middle" dominant-baseline="middle" font-size="0.26">' + esc((x.n[0] || "?").toUpperCase()) + "</text>");
    }
    parts.push('<circle class="nd-ring" r="' + f3(R) + '"/>');
    if (popKey === k) parts.push('<circle class="nd-burst" r="' + f3(R) + '"/>');
    if (PIP[x.st]) parts.push('<rect class="nd-pip" x="-0.05" y="-0.05" width="0.1" height="0.1" transform="translate(' + f3(-R * 0.72) + " " + f3(-R * 0.72) + ') rotate(45)" fill="' + PIP[x.st] + '"/>');
    if (max > 1) {
      var c = R * 0.76;
      parts.push('<circle class="nd-rank" cx="' + f3(c) + '" cy="' + f3(c) + '" r="0.125"/>');
      parts.push('<text class="nd-rank-t" x="' + f3(c) + '" y="' + f3(c + 0.012) + '">' + faNum(have > 0 ? have : max) + "</text>");
    }
    parts.push('<circle r="' + f3(R * 1.2) + '" fill="transparent"/>');
    parts.push("</g></g>");
    return parts.join("");
  }

  function frameSVG(f) {
    var t = f.t, tr = DATA.trees[t], spent = spentIn(t), parts = [];
    var x1 = f.x + 0.3, x2 = f.x + f.w - 0.3;
    parts.push('<rect class="fc-zone" x="' + f3(f.x) + '" y="0" width="' + f3(f.w) + '" height="' + f3(f.h) + '" rx="0.24"/>');
    /* header (RTL): Persian name + small-caps EN on the right, points on the left */
    parts.push('<text class="fc-zone-head" x="' + f3(x2) + '" y="0.5" text-anchor="end">' + esc(treeLabel(tr)) + "</text>");
    parts.push('<text class="fc-zone-en" x="' + f3(x2) + '" y="0.78" text-anchor="end">' + esc(tr.n || "") + "</text>");
    parts.push('<text class="fc-zone-pts' + (spent > 0 ? " on" : "") + '" x="' + f3(x1) + '" y="0.56">' + spent + "</text>");
    /* the rule doubles as a progress thread with a diamond at its tip (fantasy.css cp-fill) */
    var ry = 0.98, bw = x2 - x1, frac = Math.min(1, spent / MAXPTS);
    parts.push('<line class="fc-rule" x1="' + f3(x1) + '" y1="' + ry + '" x2="' + f3(x2) + '" y2="' + ry + '"/>');
    if (frac > 0) {
      var tipX = x2 - bw * frac;
      parts.push('<line class="fc-thread" x1="' + f3(x2) + '" y1="' + ry + '" x2="' + f3(tipX) + '" y2="' + ry + '"/>');
      parts.push('<rect class="fc-thread-tip" x="-0.045" y="-0.045" width="0.09" height="0.09" transform="translate(' + f3(tipX) + " " + ry + ') rotate(45)"/>');
    }

    /* gate line: first tier still locked (retail "spend N more");
       the count lives in the header so it never covers a rank pill */
    for (var i = 1; i < tr.tiers.length; i++) {
      var need = tierReq(i) - pointsBelow(t, i);
      if (need > 0) {
        var ly = HEAD + R + 0.18 + (i - 0.5) * ROW + 0.04;
        parts.push('<line class="fc-lock-line" x1="' + f3(f.x + 0.2) + '" y1="' + f3(ly) + '" x2="' + f3(f.x + f.w - 0.2) + '" y2="' + f3(ly) + '"/>');
        parts.push('<rect class="fc-lock-gem" x="-0.04" y="-0.04" width="0.08" height="0.08" transform="translate(' + f3(f.x + f.w / 2) + " " + f3(ly) + ') rotate(45)"/>');
        parts.push('<text class="fc-lock-label" direction="rtl" text-anchor="end" x="' + f3(x1) + '" y="0.8">' + faNum(need) + " امتیاز تا ردیف " + faNum(i + 1) + "</text>");
        break;
      }
    }

    /* prerequisite arrows (only when the data names one) */
    eachNode(t, function (x) {
      if (!x.req) return;
      var a = GEO.pos[key(t, x.req)], b = GEO.pos[key(t, x.n)];
      if (!a || !b) return;
      var dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy);
      if (L < 1e-6) return;
      var ux = dx / L, uy = dy / L, lit = spentOn(t, x.req) >= maxRanks(t, x.req);
      parts.push('<line class="fc-edge' + (lit ? " lit" : "") + '" x1="' + f3(a.x + ux * (R + 0.04)) + '" y1="' + f3(a.y + uy * (R + 0.04)) + '" x2="' + f3(b.x - ux * (R + 0.12)) + '" y2="' + f3(b.y - uy * (R + 0.12)) + '" marker-end="url(#fc-arrow' + (lit ? "-lit" : "") + ')"/>');
    });

    var order = [];
    eachNode(t, function (x, ti) { order.push({ x: x, ti: ti, p: GEO.pos[key(t, x.n)] }); });
    order.sort(function (a, c) { return (a.p.y - c.p.y) || (a.p.x - c.p.x); });
    order.forEach(function (o) { parts.push(nodeSVG(t, o.x, o.ti, o.p)); });
    return parts.join("");
  }

  function buildTreeSVG() {
    GEO = computeGeo();
    var pad = 0.12;
    vb = { x: -pad, y: -pad, w: GEO.totalW + pad * 2, h: GEO.totalH + pad * 2 };
    if (!view) view = { k: 1, x: 0, y: 0 };
    var parts = ['<svg viewBox="' + f3(vb.x) + " " + f3(vb.y) + " " + f3(vb.w) + " " + f3(vb.h) + '" preserveAspectRatio="xMidYMid meet">'];
    parts.push('<defs><marker id="fc-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10z" fill="rgba(160,170,190,.55)"/></marker>' +
      '<marker id="fc-arrow-lit" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10z" fill="#f0c75e"/></marker></defs>');
    parts.push('<g id="fc-inner" transform="translate(' + f3(view.x) + " " + f3(view.y) + ") scale(" + view.k.toFixed(4) + ')">');
    parts.push('<g class="' + (enterAnim ? "fc-enter" : "") + '">');
    GEO.frames.forEach(function (f) { parts.push(frameSVG(f)); });
    parts.push("</g></g></svg>");
    return parts.join("");
  }

  /* =========================================================
     panels around the tree
     ========================================================= */
  function classTabs() {
    return '<div class="tt-class-tabs fc-classes">' + INDEX.classes.map(function (c) {
      var on = c.slug === state.cls;
      return '<button type="button" class="tt-class-tab fc-cls" data-c="' + c.slug + '" aria-pressed="' + on + '">' +
        '<span style="display:inline-block;border-radius:9999px;' + (on ? "box-shadow:0 0 34px " + c.color + "66, 0 0 12px rgba(240,199,94,0.35)" : "") + '">' +
        '<span class="wf-crest" style="width:52px;height:52px;' + (on ? "box-shadow:0 0 24px " + c.color + "80" : "") + '">' +
        '<span class="wf-crest-in" style="width:100%;height:100%">' +
        '<img src="icons/large/' + esc(c.icon) + '.jpg" alt="" onerror="if(!this.dataset.f){this.dataset.f=1;this.src=\'' + ZAM + esc(c.icon) + '.jpg\'}else{this.style.display=\'none\'}">' +
        "</span></span></span>" +
        '<span class="label" dir="rtl" style="' + (on ? "color:" + c.color : "") + '">' + esc(classLabel(c)) + "</span></button>";
    }).join("") + "</div>";
  }

  /* build summary — the item-card header language: eyebrow between
     fading lines, the classic split in gold Cinzel, quiet stats */
  function summary() {
    var c = INDEX.classes.filter(function (k) { return k.slug === state.cls; })[0] || { color: "#f0c75e", name: "" };
    var left = budget() - totalSpent(), lvl = totalSpent() ? Math.min(60, 9 + Math.max(0, totalSpent() - (state.legacy ? 5 : 0))) : 0;
    return '<div class="fc-sum" style="--cc:' + c.color + '">' +
      '<p class="fc-eyebrow font-cinzel" dir="ltr"><span></span>Forever · ' + esc(c.name || "") + ' · Talent Build<span></span></p>' +
      '<div class="fc-split" dir="ltr">' + DATA.trees.map(function (t, i) {
        return '<b class="' + (state.spent[i] ? "on" : "") + '" title="' + esc(treeLabel(t)) + '">' + state.spent[i] + "</b>";
      }).join('<i aria-hidden="true"></i>') + "</div>" +
      '<div class="fc-stats">' +
      '<div><b>' + faNum(left) + "</b><span>امتیاز مانده</span></div>" +
      '<div><b>' + faNum(totalSpent()) + "</b><span>از " + faNum(budget()) + " خرج شده</span></div>" +
      '<div><b>' + (lvl ? faNum(lvl) : "—") + "</b><span>لِوِل لازم</span></div>" +
      "</div></div>";
  }

  function treeChips() {
    return '<div class="fc-trees" role="tablist">' + DATA.trees.map(function (t, i) {
      return '<button type="button" class="tt-chip fc-tree-chip" data-tree="' + i + '" data-active="' + (i === state.tree) + '">' +
        esc(treeLabel(t)) + ' <span class="pts">' + state.spent[i] + "</span></button>";
    }).join("") + "</div>";
  }

  function canvasPanel() {
    return '<div class="tt-frame fc-frame"><div class="fc-panel">' +
      '<div class="tt-canvas fc-canvas" id="fc-canvas">' + buildTreeSVG() + "</div>" +
      '<div class="tt-tip fc-tip" id="fc-tip" style="display:none"></div>' +
      "</div>" +
      '<div class="tt-toolbar fc-toolbar" dir="ltr">' +
      '<button class="tt-zoom-btn" id="fc-zoom-out" aria-label="کوچک‌نمایی"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"/></svg></button>' +
      '<span class="tt-zoom-val" id="fc-zoom-val">100%</span>' +
      '<button class="tt-zoom-btn" id="fc-zoom-in" aria-label="بزرگ‌نمایی"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg></button>' +
      '<button class="tt-zoom-btn" id="fc-zoom-reset" aria-label="بازنشانی نما"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="m22 12-4-4 4-4"/></svg></button>' +
      "</div>" +
      '<div class="tt-hint fc-hint">' + HINT + "</div></div>";
  }

  function legend() {
    var gem = function (c) { return '<i class="gem" style="background:' + c + ';box-shadow:0 0 6px ' + c + '"></i>'; };
    return '<div class="tt-legend fc-legend" dir="rtl">' +
      '<span class="lg"><span class="swatch" style="border-color:#a9883c"></span>قابل خرید</span>' +
      '<span class="lg"><span class="swatch" style="border-color:#f6e0a3;box-shadow:0 0 8px rgba(240,199,94,.6)"></span>خرج‌شده</span>' +
      '<span class="lg"><span class="swatch" style="border-color:#3a4252;opacity:.7"></span>قفل</span>' +
      '<span class="lg"><span class="swatch" style="border-color:#8a6a2a;border-style:dashed"></span>توانایی فعال</span>' +
      '<span class="lg">' + gem(PIP.new) + "جدید در Forever</span>" +
      '<span class="lg">' + gem(PIP.moved) + "جابه‌جاشده</span>" +
      "</div>";
  }

  function actions() {
    return '<div class="fs-foot">' +
      '<button type="button" class="btn btn-stone btn-sm' + (state.legacy ? " on" : "") + '" id="fc-legacy" aria-pressed="' + state.legacy + '">مزیت «تالنتی» +۵</button>' +
      '<button type="button" class="btn btn-stone btn-sm" id="fc-link">کپی لینک بیلد</button>' +
      '<button type="button" class="btn btn-stone btn-sm" id="fc-text">کپی متنی</button>' +
      '<button type="button" class="btn btn-stone btn-sm" id="fc-save">ذخیرهٔ بیلد</button>' +
      '<button type="button" class="btn btn-stone btn-sm' + (state.saves ? " on" : "") + '" id="fc-show-saves">بیلدهای من</button>' +
      '<button type="button" class="btn btn-stone btn-sm fc-reset" id="fc-reset">ریست</button>' +
      "</div>" + (state.saves ? savesPanel() : "");
  }

  function savesPanel() {
    var all = saved(), mine = [];
    all.forEach(function (b, i) { if (b.cls === state.cls) mine.push({ b: b, i: i }); });
    if (!mine.length) return '<div class="fc-saves"><p class="fc-empty">هنوز بیلدی برای این کلاس ذخیره نکرده‌ای.</p></div>';
    return '<div class="fc-saves wf-ledger">' + mine.map(function (o) {
      var split = o.b.str.split("-").map(function (s2) { return s2.replace(/\./g, "").split("").reduce(function (a, d) { return a + (+d || 0); }, 0); }).join(" · ");
      return '<div class="fc-save"><i class="gem"></i><b>' + esc(o.b.name) + '</b><span class="font-cinzel" dir="ltr">' + split + "</span>" +
        '<button type="button" class="fc-link-btn" data-load="' + o.i + '">بارگذاری</button>' +
        '<button type="button" class="fc-link-btn fc-del" data-del="' + o.i + '" aria-label="حذف">حذف</button></div>';
    }).join("") + "</div>";
  }

  function popularRow() {
    if (!DATA.popular || !DATA.popular.length) return "";
    return '<div class="fc-block"><div class="fc-cap"><span></span>بیلدهای محبوب<span></span></div><div class="fs-pop">' + DATA.popular.map(function (p) {
      var i = DATA.trees.map(function (t) { return t.n; }).indexOf(p.tree);
      return '<button type="button" class="tt-chip" data-pop=\'' + esc(JSON.stringify(p.points)) + "'>" + esc(treeLabel(DATA.trees[i >= 0 ? i : 0])) + ' <span class="pts" dir="ltr">' + p.points.join(" · ") + "</span></button>";
    }).join("") + "</div></div>";
  }

  function orderList() {
    var head = '<div class="fc-cap"><span></span>ترتیب امتیازها<span></span></div>';
    if (!state.order.length) return '<div class="fc-block">' + head + '<p class="fc-empty">هر امتیازی که بدهی اینجا با لِوِلش ثبت می‌شود؛ اولین امتیاز در لِوِل ۱۰.</p></div>';
    var bonus = state.legacy ? 5 : 0, seen = {};
    var items = state.order.map(function (k, idx) {
      var t = +k.split("|")[0], name = k.split("|")[1], nd = nodeData(t, name);
      seen[k] = (seen[k] || 0) + 1;
      var lv = idx < bonus ? "مزیت" : faNum(Math.min(60, 10 + idx - bonus));
      return '<li><i>' + lv + "</i><span>" + esc(nd ? nd.x.fa : name) + "</span>" + ((nd && (nd.x.r || 1) > 1) ? '<small dir="ltr">' + seen[k] + "/" + nd.x.r + "</small>" : "") + "</li>";
    });
    return '<div class="fc-block">' + head + '<ol class="fc-order wf-ledger">' + items.join("") + "</ol></div>";
  }

  /* =========================================================
     rules + mutations
     ========================================================= */
  function canAdd(t, name) {
    var nd = nodeData(t, name);
    if (!nd) return "x";
    if (spentOn(t, name) >= (nd.x.r || 1)) return "max";
    if (totalSpent() >= budget()) return "budget";
    if (pointsBelow(t, nd.ti) < tierReq(nd.ti)) return "tier";
    if (nd.x.req && spentOn(t, nd.x.req) < maxRanks(t, nd.x.req)) return "req";
    return "";
  }
  /* removing a point must not strand a deeper tier or a dependent talent */
  function canRemove(t, name) {
    if (spentOn(t, name) <= 0) return "zero";
    var pts = Object.assign({}, state.pts);
    pts[key(t, name)] -= 1;
    var bad = "";
    eachNode(t, function (x, ti) {
      if (bad || !(pts[key(t, x.n)] > 0)) return;
      if (ti > 0 && pointsBelow(t, ti, pts) < tierReq(ti)) bad = "tier";
      else if (x.req && (pts[key(t, x.req)] || 0) < maxRanks(t, x.req)) bad = "req";
    });
    return bad;
  }
  function spend(t, name, dir) {
    var k = key(t, name);
    if (dir > 0) {
      if (canAdd(t, name)) return false;
      state.pts[k] = spentOn(t, name) + 1;
      state.spent[t] += 1;
      state.order.push(k);
      popKey = k;
    } else {
      if (canRemove(t, name)) return false;
      state.pts[k] -= 1;
      state.spent[t] -= 1;
      var at = state.order.lastIndexOf(k);
      if (at >= 0) state.order.splice(at, 1);
    }
    return true;
  }
  function reset() { state.pts = {}; state.spent = [0, 0, 0]; state.order = []; pinnedKey = null; }
  /* order for builds that arrive without one (link / popular / saved) */
  function synthOrder() {
    state.order = [];
    DATA.trees.forEach(function (tr, t) {
      eachNode(t, function (x) { for (var r = 0; r < spentOn(t, x.n); r++) state.order.push(key(t, x.n)); });
    });
  }

  function buildStr() {
    return DATA.trees.map(function (t, i) {
      return t.tiers.map(function (tier) {
        return tier.map(function (x) { return state.pts[key(i, x.n)] || 0; }).join("");
      }).join(".");
    }).join("-");
  }
  function parseStr(s) {
    try {
      reset();
      s.split("-").forEach(function (treeStr, i) {
        if (!DATA.trees[i]) return;
        treeStr.split(".").forEach(function (tierStr, k) {
          var tier = DATA.trees[i].tiers[k];
          if (!tier) return;
          for (var j = 0; j < tierStr.length && j < tier.length; j++) {
            var n = Math.min(+tierStr[j] || 0, tier[j].r || 1);
            if (n > 0) { state.pts[key(i, tier[j].n)] = n; state.spent[i] += n; }
          }
        });
      });
      synthOrder();
      return true;
    } catch (e) { reset(); return false; }
  }
  function applyPopular(pts) {
    reset();
    pts.forEach(function (P, t) {
      var tr = DATA.trees[t], left = P;
      function take(x, cap) {
        if (left <= 0 || (x.req && spentOn(t, x.req) < maxRanks(t, x.req))) return;
        var have = spentOn(t, x.n), n = Math.min((x.r || 1) - have, left, cap);
        if (n <= 0) return;
        state.pts[key(t, x.n)] = have + n; state.spent[t] += n; left -= n;
      }
      function tierSum(ti) { var s2 = 0; tr.tiers[ti].forEach(function (x) { s2 += spentOn(t, x.n); }); return s2; }
      /* pass 1: walk down paying exactly the 5-point gate per tier;
         single-rank actives first (they are the tree's key abilities) */
      for (var ti = 0; ti < tr.tiers.length && left > 0; ti++) {
        if (pointsBelow(t, ti) < tierReq(ti)) break;
        var tier = tr.tiers[ti].slice().sort(function (a2, b2) { return (isActive(b2) ? 1 : 0) - (isActive(a2) ? 1 : 0); });
        var last = ti === tr.tiers.length - 1;
        tier.forEach(function (x) {
          var gap = tierReq(ti + 1) - pointsBelow(t, ti) - tierSum(ti); /* cumulative gate deficit */
          if (last) take(x, 99); else if (gap > 0) take(x, gap);
        });
        /* a thin tier (e.g. 1+3 ranks) cannot pay its gate alone: top up from the tiers above */
        for (var up = 0; up < ti && !last; up++) tr.tiers[up].forEach(function (x) {
          var gap2 = tierReq(ti + 1) - pointsBelow(t, ti + 1);
          if (gap2 > 0) take(x, gap2);
        });
      }
      /* pass 2: spend what is left top-down */
      for (var t2 = 0; t2 < tr.tiers.length && left > 0; t2++) {
        if (pointsBelow(t, t2) < tierReq(t2)) break;
        tr.tiers[t2].forEach(function (x) { take(x, 99); });
      }
    });
    synthOrder();
  }

  function saved() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "[]"); } catch (e) { return []; } }
  function writeSaves(all) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(all.slice(0, 30))); } catch (e) {} }
  function saveBuild(name) {
    var all = saved();
    all.unshift({ cls: state.cls, name: name || ("بیلد " + (all.length + 1)), str: buildStr(), legacy: state.legacy, at: Date.now() });
    writeSaves(all);
  }

  /* =========================================================
     tooltip
     ========================================================= */
  function faHTML(t) {
    var html = esc(t).replace(/\n/g, "<br>");
    return (window.WFTR && WFTR.faTokens) ? WFTR.faTokens(html) : html;
  }
  function tipHTML(t, name) {
    var nd = nodeData(t, name);
    if (!nd) return "";
    var x = nd.x, have = spentOn(t, name), max = x.r || 1;
    var why = canAdd(t, name), need = tierReq(nd.ti) - pointsBelow(t, nd.ti);
    var reqLine = why === "tier" ? '<p class="ttip-lock" dir="rtl">قفل: ' + faNum(need) + " امتیاز دیگر در " + esc(treeLabel(DATA.trees[t])) + " لازم است</p>"
      : why === "req" ? '<p class="ttip-lock" dir="rtl">اول «' + esc((nodeData(t, x.req) || { x: { fa: x.req } }).x.fa) + "» را کامل کن</p>" : "";
    return '<p class="ttip-name" dir="rtl">' + esc(x.fa) + ' <span class="ttip-en" dir="ltr">' + esc(x.n) + "</span></p>" +
      '<div class="ttip-badges" dir="rtl">' +
      '<span class="fs-chip ' + esc(x.st || "same") + '">' + esc(ST_FA[x.st] || x.st || "") + "</span>" +
      '<span class="ttip-badge b-rank">رنک ' + faNum(have) + "/" + faNum(max) + "</span>" +
      (isActive(x) ? '<span class="ttip-badge">توانایی فعال</span>' : "") +
      '<span class="ttip-badge">ردیف ' + faNum(nd.ti + 1) + "</span></div>" +
      reqLine +
      (x.dFa ? '<div class="ttip-fa"><p dir="rtl">' + faHTML(x.dFa) + "</p></div>" : "") +
      (x.d ? '<p class="ttip-desc" dir="ltr">' + esc(x.d).replace(/\n/g, "<br>") + "</p>" : "") +
      (pinnedKey ? '<div class="ttip-act" dir="ltr">' +
        '<button type="button" class="ttip-btn" data-act="minus">−</button>' +
        '<button type="button" class="ttip-btn ttip-plus" data-act="plus">+۱</button>' +
        '<button type="button" class="ttip-btn" data-act="close">بستن</button></div>' : "");
  }
  function showTip(k, atNode) {
    var tip = document.getElementById("fc-tip"), el = document.getElementById("fc-canvas");
    if (!tip || !el || !GEO) return;
    tip.innerHTML = tipHTML(+k.split("|")[0], k.split("|")[1]);
    tip.setAttribute("data-key", k);
    tip.classList.toggle("pinned", !!pinnedKey);
    tip.style.display = "block";
    if (!atNode) return;
    var p = GEO.pos[k], svg = el.querySelector("svg");
    if (!p || !svg || !view) return;
    var ctm = svg.getScreenCTM();
    if (!ctm) return;
    var pt = new DOMPoint(p.x * view.k + view.x, p.y * view.k + view.y).matrixTransform(ctm);
    var rr = el.getBoundingClientRect();
    clampTip(tip, pt.x - rr.left + 14, pt.y - rr.top, rr);
  }
  function clampTip(tip, px, py, rect) {
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var x = px + 18, y = py + 14;
    if (x + w > rect.width - 8) x = px - w - 18;
    if (y + h > rect.height - 8) y = py - h - 14;
    tip.style.left = Math.max(8, Math.min(x, Math.max(8, rect.width - w - 8))) + "px";
    tip.style.top = Math.max(8, Math.min(y, Math.max(8, rect.height - h - 8))) + "px";
  }
  function hideTip() {
    var tip = document.getElementById("fc-tip");
    if (tip) { tip.style.display = "none"; tip.removeAttribute("data-key"); }
  }
  function resetTip() { pinnedKey = null; hideTip(); }

  /* =========================================================
     pan & zoom
     ========================================================= */
  function clampView(v) {
    if (!vb) return v;
    var mx = vb.w * 0.25, my = vb.h * 0.25;
    var minX = vb.x + mx - v.k * (vb.x + vb.w), maxX = vb.x + vb.w - mx - v.k * vb.x;
    var minY = vb.y + my - v.k * (vb.y + vb.h), maxY = vb.y + vb.h - my - v.k * vb.y;
    if (v.k <= 1.0001) return { k: v.k, x: (1 - v.k) * (vb.x + vb.w / 2), y: (1 - v.k) * (vb.y + vb.h / 2) };
    return { k: v.k, x: Math.min(maxX, Math.max(minX, v.x)), y: Math.min(maxY, Math.max(minY, v.y)) };
  }
  function setView(v) {
    view = clampView(v);
    var inner = document.getElementById("fc-inner");
    if (inner) inner.setAttribute("transform", "translate(" + f3(view.x) + " " + f3(view.y) + ") scale(" + view.k.toFixed(4) + ")");
    var val = document.getElementById("fc-zoom-val");
    if (val) val.textContent = Math.round(view.k * 100) + "%";
  }
  function zoomBy(f) {
    if (!view || !vb) return;
    var k2 = Math.min(MAX_K, Math.max(MIN_K, view.k * f));
    var cx = vb.x + vb.w / 2, cy = vb.y + vb.h / 2;
    resetTip();
    setView({ k: k2, x: cx - ((cx - view.x) * k2) / view.k, y: cy - ((cy - view.y) * k2) / view.k });
  }
  /* the canvas takes the tree's own aspect, so k=1 fills it edge to edge */
  function sizeCanvas() {
    var el = document.getElementById("fc-canvas");
    if (!el || !vb) return;
    var w = el.clientWidth || 1000;
    var h = Math.round(w * vb.h / vb.w);
    el.style.height = Math.max(360, Math.min(phone ? 820 : 900, h)) + "px";
  }
  function bindCanvas() {
    var el = document.getElementById("fc-canvas");
    if (!el) return;
    var pan = null, holdT = null;
    el.addEventListener("wheel", function (e) {
      if (!e.ctrlKey && view && view.k <= 1.0001) return; /* fit zoom: the page keeps scrolling (Ctrl+wheel / pinch zooms) */
      e.preventDefault();
      var svg = el.querySelector("svg"), ctm = svg && svg.getScreenCTM();
      if (!ctm || !view) return;
      var pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      var k2 = Math.min(MAX_K, Math.max(MIN_K, view.k * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0016))));
      resetTip();
      setView({ k: k2, x: pt.x - ((pt.x - view.x) * k2) / view.k, y: pt.y - ((pt.y - view.y) * k2) / view.k });
    }, { passive: false });
    el.addEventListener("pointerdown", function (e) {
      if (!view || e.button !== 0) return;
      pan = { id: e.pointerId, cx: e.clientX, cy: e.clientY, moved: false };
      var g = e.target.closest && e.target.closest(".fc-node");
      if (g) {
        holdT = setTimeout(function () {
          holdT = null; pan = null;
          pinnedKey = g.getAttribute("data-t") + "|" + g.getAttribute("data-n");
          el.setAttribute("data-held", "1");
          showTip(pinnedKey, true);
        }, 430);
      }
    });
    el.addEventListener("pointermove", function (e) {
      if (!pan || pan.id !== e.pointerId) {
        if (e.pointerType === "mouse" && !pinnedKey && !panningActive) {
          var g2 = e.target.closest && e.target.closest(".fc-node");
          var tip = document.getElementById("fc-tip"), rr = el.getBoundingClientRect();
          if (g2 && tip) {
            var kv = g2.getAttribute("data-t") + "|" + g2.getAttribute("data-n");
            if (tip.getAttribute("data-key") !== kv) { tip.innerHTML = tipHTML(+kv.split("|")[0], kv.split("|")[1]); tip.setAttribute("data-key", kv); tip.classList.remove("pinned"); }
            tip.style.display = "block";
            clampTip(tip, e.clientX - rr.left, e.clientY - rr.top, rr);
          } else if (tip) hideTip();
        }
        return;
      }
      if (!pan.moved && Math.hypot(e.clientX - pan.cx, e.clientY - pan.cy) > 6) {
        if (holdT) { clearTimeout(holdT); holdT = null; }
        if (view.k <= 1.0001) return; /* nothing to pan at fit zoom */
        pan.moved = true; panningActive = true;
        el.classList.add("is-panning");
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
        hideTip();
      }
      if (!pan.moved) return;
      var svg = el.querySelector("svg"), ctm = svg && svg.getScreenCTM();
      if (!ctm) return;
      var sc = Math.hypot(ctm.a, ctm.b);
      var dx = (e.clientX - pan.cx) / sc, dy = (e.clientY - pan.cy) / sc;
      pan.cx = e.clientX; pan.cy = e.clientY;
      setView({ k: view.k, x: view.x + dx, y: view.y + dy });
    });
    function endPan() {
      if (holdT) { clearTimeout(holdT); holdT = null; }
      if (pan && pan.moved) el.setAttribute("data-dragged", "1");
      pan = null; panningActive = false;
      el.classList.remove("is-panning");
    }
    el.addEventListener("pointerup", endPan);
    el.addEventListener("pointercancel", endPan);
    el.addEventListener("pointerleave", function () { if (!pinnedKey) hideTip(); });
    document.getElementById("fc-zoom-out").addEventListener("click", function () { zoomBy(1 / 1.25); });
    document.getElementById("fc-zoom-in").addEventListener("click", function () { zoomBy(1.25); });
    document.getElementById("fc-zoom-reset").addEventListener("click", function () { resetTip(); setView({ k: 1, x: 0, y: 0 }); });
  }
  function bindIconFallback() {
    var el = document.getElementById("fc-canvas");
    if (!el) return;
    el.addEventListener("error", function (e) {
      var img = e.target;
      if (!(img instanceof SVGImageElement)) return;
      var fb = img.getAttribute("data-fallback");
      if (fb && img.getAttribute("href") !== fb) { img.setAttribute("href", fb); return; }
      broken.add(img.getAttribute("data-bid"));
      var letter = img.getAttribute("data-letter");
      if (letter) {
        var t = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t.setAttribute("class", "fc-letter");
        t.setAttribute("x", "0"); t.setAttribute("y", "0.02");
        t.setAttribute("text-anchor", "middle"); t.setAttribute("dominant-baseline", "middle");
        t.setAttribute("font-size", "0.28");
        t.textContent = letter;
        img.parentNode.insertBefore(t, img);
      }
      img.style.display = "none";
    }, true);
  }

  /* =========================================================
     render
     ========================================================= */
  function render(keepView) {
    phone = (root.clientWidth || window.innerWidth) < PHONE;
    if (!keepView) view = null;
    var oldK = view;
    root.innerHTML = classTabs() + summary() + treeChips() + canvasPanel() + legend() + actions() + popularRow() + orderList();
    root.classList.toggle("fc-phone", phone);
    var cc = INDEX.classes.filter(function (c) { return c.slug === state.cls; })[0];
    if (cc && root.style && root.style.setProperty) root.style.setProperty("--cc", cc.color);
    sizeCanvas();
    bindCanvas();
    bindIconFallback();
    setView(oldK || { k: 1, x: 0, y: 0 });
    popKey = null; enterAnim = false;
    if (pinnedKey) showTip(pinnedKey, true);
    if (history.replaceState) history.replaceState(null, "", "forever-talents.html?class=" + state.cls + (totalSpent() ? "&b=" + buildStr() : "") + (state.legacy ? "&l=1" : ""));
  }
  function loading(msg) {
    root.innerHTML = (INDEX ? classTabs() : "") + '<p class="fc-loading">' + (msg || "در حال بارگذاری کالکولیتور…") + "</p>";
  }

  /* ---------- events ---------- */
  root.addEventListener("click", function (e) {
    var tgt = e.target;
    var act = tgt.closest && tgt.closest(".ttip-btn");
    if (act) {
      var a = act.getAttribute("data-act"), k = pinnedKey;
      if (a === "close") { resetTip(); return; }
      if (k && spend(+k.split("|")[0], k.split("|")[1], a === "plus" ? 1 : -1)) render(true);
      else if (k) refuse(+k.split("|")[0], k.split("|")[1], a === "plus" ? 1 : -1);
      return;
    }
    var cls = tgt.closest(".fc-cls");
    if (cls) { if (cls.getAttribute("data-c") !== state.cls) { state.cls = cls.getAttribute("data-c"); state.tree = 0; state.saves = false; reset(); load(state.cls); } return; }
    var chip = tgt.closest(".fc-tree-chip");
    if (chip) { state.tree = +chip.getAttribute("data-tree"); resetTip(); enterAnim = true; render(); return; }
    var pop = tgt.closest("[data-pop]");
    if (pop) { applyPopular(JSON.parse(pop.getAttribute("data-pop"))); enterAnim = true; render(); flash("بیلد محبوب بارگذاری شد"); return; }
    var ld = tgt.closest("[data-load]");
    if (ld) { var b = saved()[+ld.getAttribute("data-load")]; if (b) { state.legacy = !!b.legacy; parseStr(b.str); render(); flash("«" + b.name + "» بارگذاری شد"); } return; }
    var del = tgt.closest("[data-del]");
    if (del) { var all = saved(); all.splice(+del.getAttribute("data-del"), 1); writeSaves(all); render(true); return; }
    var btn = tgt.closest("button"), id = btn && btn.id;
    if (id === "fc-reset") { reset(); render(); return; }
    if (id === "fc-legacy") {
      if (state.legacy && totalSpent() > MAXPTS) { flash("اول " + faNum(totalSpent() - MAXPTS) + " امتیاز پس بگیر"); return; }
      state.legacy = !state.legacy; render(true); return;
    }
    if (id === "fc-link") {
      var u = location.origin + location.pathname + "?class=" + state.cls + "&b=" + buildStr() + (state.legacy ? "&l=1" : "");
      copy(u, "لینک بیلد کپی شد", "لینک بیلد:"); return;
    }
    if (id === "fc-text") {
      var lines = DATA.trees.map(function (t, i) {
        var picked = [];
        eachNode(i, function (x) { if (spentOn(i, x.n) > 0) picked.push(x.fa + " " + spentOn(i, x.n) + "/" + (x.r || 1)); });
        return treeLabel(t) + " (" + state.spent[i] + "): " + (picked.join("، ") || "-");
      }).join("\n");
      copy(lines, "بیلد متنی کپی شد", "بیلد متنی:"); return;
    }
    if (id === "fc-save") {
      var nm = prompt("نام بیلد:", "بیلد " + DATA.trees.map(function (_, i) { return state.spent[i]; }).join("/"));
      if (nm != null) { saveBuild(nm); state.saves = true; render(true); flash("بیلد ذخیره شد"); }
      return;
    }
    if (id === "fc-show-saves") { state.saves = !state.saves; render(true); return; }

    var canvas = tgt.closest && tgt.closest("#fc-canvas");
    if (canvas) {
      if (canvas.getAttribute("data-dragged") || canvas.getAttribute("data-held")) { canvas.removeAttribute("data-dragged"); canvas.removeAttribute("data-held"); return; }
      var node = tgt.closest(".fc-node");
      if (node) {
        var t = +node.getAttribute("data-t"), name = node.getAttribute("data-n");
        if (e.shiftKey) { pinnedKey = key(t, name); showTip(pinnedKey, true); return; }
        if (spend(t, name, 1)) { pinnedKey = null; render(true); } else refuse(t, name, 1);
        return;
      }
      if (pinnedKey) resetTip();
    }
  });
  function refuse(t, name, dir) {
    var why = dir > 0 ? canAdd(t, name) : canRemove(t, name), nd = nodeData(t, name);
    var msg = {
      tier: dir > 0 ? "این ردیف قفل است، " + faNum(tierReq(nd.ti) - pointsBelow(t, nd.ti)) + " امتیاز دیگر در این درخت لازم است" : "اول امتیازهای ردیف‌های پایین‌تر را پس بگیر",
      req: dir > 0 ? "اول پیش‌نیاز این تلنت را کامل کن" : "یک تلنت دیگر به این وابسته است",
      budget: "امتیازی برای خرج کردن نمانده است",
      max: "این تلنت کامل است"
    }[why];
    if (msg) flash(msg);
  }
  root.addEventListener("contextmenu", function (e) {
    var node = e.target.closest && e.target.closest(".fc-node");
    if (!node) return;
    e.preventDefault();
    var t = +node.getAttribute("data-t"), name = node.getAttribute("data-n");
    if (spend(t, name, -1)) render(true); else refuse(t, name, -1);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") resetTip(); });
  var rT = null;
  window.addEventListener("resize", function () {
    clearTimeout(rT);
    rT = setTimeout(function () {
      if (!DATA) return;
      if (((root.clientWidth || window.innerWidth) < PHONE) !== phone) render(); else sizeCanvas();
    }, 150);
  });

  function copy(txt, ok, ask) {
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { flash(ok); }, function () { prompt(ask, txt); });
  }
  var flashT = null, flashEl = null;
  function flash(msg) {
    if (flashEl) flashEl.remove();
    flashEl = document.createElement("div");
    flashEl.className = "fc-flash";
    flashEl.textContent = msg;
    document.body.appendChild(flashEl);
    clearTimeout(flashT);
    flashT = setTimeout(function () { if (flashEl) { flashEl.remove(); flashEl = null; } }, 2000);
  }

  /* ---------- load ---------- */
  function load(cls) {
    loading();
    getJSON("data/forever/db/" + cls + ".json").then(function (d) {
      DATA = d;
      enterAnim = true;
      ACTIVE = {};
      (d.spells || []).forEach(function (s) { if (s.st === "talent") ACTIVE[s.n] = 1; });
      var m = location.search.match(/[?&]b=([0-9.\-]+)/);
      if (m && location.search.indexOf("class=" + cls) >= 0) parseStr(m[1]);
      render();
    }, function () { loading("بارگذاری دادهٔ این کلاس ناموفق بود."); });
  }
  getJSON("data/forever/db/classes.json").then(function (ix) {
    INDEX = ix;
    var m = location.search.match(/[?&]class=([a-z-]+)/);
    if (m && INDEX.classes.some(function (c) { return c.slug === m[1]; })) state.cls = m[1];
    if (/[?&]l=1/.test(location.search)) state.legacy = true;
    load(state.cls);
  }, function () { loading("بارگذاری فهرست کلاس‌ها ناموفق بود."); });

  (function whenTr(tries) {
    if (window.WFTR && WFTR.onChange) {
      WFTR.onChange(function () { if (DATA) render(true); });
    } else if (tries < 48) setTimeout(function () { whenTr(tries + 1); }, 150);
  })(0);
  window.__fc = { state: state, spend: spend, canAdd: canAdd, canRemove: canRemove, buildStr: buildStr, parseStr: parseStr, applyPopular: applyPopular, render: render };
})();
