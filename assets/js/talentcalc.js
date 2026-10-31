/* =========================================================
   wowfarsi — Forever talent calculator (fa) · v4
   Retail-style tree: ONE SVG canvas with all three spec
   trees side by side (like the retail Class/Spec/Hero zones),
   circular icon nodes with status rings, vertical column
   connectors on the REAL tree grid (pos = [row, col] from the
   foreverchanges layout — every talent owns a fixed column,
   like the classic in-game tree), per-tree lock lines,
   pan & zoom, hover tooltip (hold / shift+click pins it).
   Data: data/forever/db/{class}.json + classes.json
   Click = +1 · right-click = −1 · hold / shift+click = details.
   Popular builds, copy link, saved builds (localStorage),
   talent order (which point at which level), +5 legacy perk.
   ========================================================= */
"use strict";
(function () {
  var root = document.getElementById("fc-root");
  if (!root) return;

  var ZAM = "https://wow.zamimg.com/images/wow/icons/large/";
  var ST_FA = { same: "همان کلاسیک", changed: "تغییرکرده", new: "جدید در Forever", earlier: "زودتر از کلاسیک", was_talent: "قبلاً تلنت بود", talent: "همراه تلنت", moved: "جابه‌جاشده" };
  var RING = { same: "#5f6d85", changed: "#a9883c", new: "#8fd4a4", earlier: "#8fb4e8", was_talent: "#c9a2e8", moved: "#c9a2e8", talent: "#e89b8f" };
  var SAVE_KEY = "wf-forever-builds";
  var MAXPTS = 51;

  /* geometry (viewBox units — same scale language as talents.js) */
  var NODE_R = 0.34, ICON_FILL = 0.9, COL = 1.7, ROW = 1.72, TOP = 1.35, GAP = 1.05;
  var PAD_X = NODE_R + 0.31; /* node inset from the zone frame edge */
  var MIN_K = 0.5, MAX_K = 3.5;
  var HINT = "کشیدن = جابه‌جایی · اسکرول = زوم · کلیک = +۱ امتیاز · راست‌کلیک = −۱ · نگه‌داشتن (یا شیفت+کلیک) = توضیح";

  var INDEX = null, DATA = null;
  var state = { cls: "warrior", spent: [0, 0, 0], pts: {}, legacy: false };
  var view = null, vb = null, panningActive = false;
  var pinnedKey = null; /* "t|name" */
  var GEO = null;       /* last layout: {pos:{key:{x,y}}, frames:[{t,x,w}]} */
  var pendingDefault = false;
  var broken = new Set();

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function getJSON(u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
  function faNum(s) { return String(s).replace(/[0-9]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹"[+d]; }); }
  function iconUrl(ic) { return ic ? "icons/large/" + ic + ".jpg" : null; }
  function key(t, name) { return t + "|" + name; }
  function spentIn(t) { return state.spent[t] || 0; }
  function totalSpent() { return state.spent[0] + state.spent[1] + state.spent[2]; }
  function tierReq(ti0) { return ti0 * 5; } /* tier 1..7 → 0,5,10,15,20,25,30 */

  function eachNode(t, fn) {
    var tr = DATA.trees[t];
    for (var i = 0; i < tr.tiers.length; i++)
      for (var j = 0; j < tr.tiers[i].length; j++) fn(tr.tiers[i][j], i, j);
  }
  function maxRanks(t, name) {
    var out = 1;
    eachNode(t, function (x) { if (x.n === name) out = x.r || 1; });
    return out;
  }
  function spentOn(t, name) { return state.pts[key(t, name)] || 0; }
  function treeLabel(tr) {
    /* v4.1: spec/tree names answer the namesClass switch — OFF shows EN */
    if (window.WFTR && !WFTR.on("namesClass") && tr.n) return tr.n;
    var m = String(tr.fa || "").match(/^(.*\S)\s+[A-Za-z]+$/);
    return m ? m[1] : tr.fa;
  }
  function classLabel(c) {
    if (window.WFTR && !WFTR.on("namesClass") && c.name) return c.name;
    return c.fa;
  }

  /* =========================================================
     layout — REAL grid positions (x.pos = [row, col], 1-based,
     from the foreverchanges tree layout). Every talent owns a
     fixed column; tiers are rows; nodes never shift per tier,
     so the tree reads as clean vertical columns.
     ========================================================= */
  function localLayout(t) {
    var tr = DATA.trees[t], pos = {};
    var cols = tr.cols || 1, rows = tr.tiers.length;
    tr.tiers.forEach(function (tier) {
      tier.forEach(function (x) {
        var p = x.pos || [1, 1];
        pos[x.n] = { x: (p[1] - 1) * COL + PAD_X, y: TOP + (p[0] - 1) * ROW };
      });
    });
    return {
      pos: pos,
      w: (cols - 1) * COL + PAD_X * 2,
      h: TOP + (rows - 1) * ROW + NODE_R + 0.35
    };
  }

  function computeGeo() {
    var frames = [], offX = 0;
    DATA.trees.forEach(function (tr, t) {
      var L = localLayout(t);
      var f = { t: t, x: offX, w: L.w, h: L.h, pos: L.pos };
      frames.push(f);
      offX += L.w + GAP;
    });
    var pos = {};
    frames.forEach(function (f) {
      Object.keys(f.pos).forEach(function (n) {
        pos[key(f.t, n)] = { x: f.pos[n].x + f.x, y: f.pos[n].y };
      });
    });
    return { frames: frames, pos: pos, totalW: offX - GAP, totalH: Math.max.apply(null, frames.map(function (f) { return f.h; })) };
  }

  /* connectors: straight vertical lines through each column,
     joining consecutive occupied cells (they span empty rows,
     exactly like the classic in-game tree). Zero crossings. */
  function treeEdges(t) {
    var byCol = {};
    eachNode(t, function (x) {
      var c = (x.pos || [1, 1])[1];
      (byCol[c] = byCol[c] || []).push(x);
    });
    var edges = [];
    Object.keys(byCol).forEach(function (c) {
      var col = byCol[c].slice().sort(function (a, b) { return a.pos[0] - b.pos[0]; });
      for (var i = 1; i < col.length; i++) edges.push({ from: col[i - 1].n, to: col[i].n });
    });
    return edges;
  }

  /* =========================================================
     svg builders
     ========================================================= */
  function nodeSVG(t, x, ti, p) {
    var have = spentOn(t, x.n), max = x.r || 1;
    var locked = spentIn(t) < tierReq(ti);
    var cls = "fc-node st-" + (x.st || "same") + (locked ? " locked" : "") + (have >= max ? " maxed" : have > 0 ? " spent" : "");
    var id = "cir-" + t + "-" + ti + "-" + x.n.replace(/[^a-zA-Z0-9]/g, "_");
    var ir = NODE_R * ICON_FILL, s = ir * 2;
    var parts = ['<g class="' + cls + '" data-t="' + t + '" data-n="' + esc(x.n) + '" transform="translate(' + p.x.toFixed(3) + " " + p.y.toFixed(3) + ')">'];
    if (have > 0) parts.push('<circle class="nd-glow" r="' + (NODE_R * 1.42).toFixed(3) + '"/>');
    parts.push('<circle class="nd-body" r="' + NODE_R + '" stroke="' + (RING[x.st] || RING.same) + '"/>');
    if (iconUrl(x.ic) && !broken.has(x.ic)) {
      parts.push('<clipPath id="' + id + '"><circle cx="0" cy="0" r="' + ir.toFixed(3) + '"/></clipPath>');
      parts.push('<image href="' + iconUrl(x.ic) + '" x="' + (-ir).toFixed(3) + '" y="' + (-ir).toFixed(3) + '" width="' + s.toFixed(3) + '" height="' + s.toFixed(3) +
        '" clip-path="url(#' + id + ')" preserveAspectRatio="xMidYMid slice" data-bid="' + esc(x.ic) + '" data-fallback="' + ZAM + esc(x.ic) + '.jpg" data-letter="' + esc((x.n[0] || "?").toUpperCase()) + '"/>');
    } else {
      parts.push('<text class="fc-letter" x="0" y="0.02" text-anchor="middle" dominant-baseline="middle" font-size="0.26">' + esc((x.n[0] || "?").toUpperCase()) + "</text>");
    }
    if (max > 1 && have > 0) {
      parts.push('<circle class="nd-rank' + (have >= max ? " full" : "") + '" cx="' + (NODE_R * 0.78).toFixed(3) + '" cy="' + (NODE_R * 0.78).toFixed(3) + '" r="0.135"/>');
      parts.push('<text class="nd-rank-t" x="' + (NODE_R * 0.78).toFixed(3) + '" y="' + (NODE_R * 0.78 + 0.048).toFixed(3) + '">' + faNum(have) + "</text>");
    }
    parts.push('<circle r="' + (NODE_R * 1.18).toFixed(3) + '" fill="transparent"/>');
    parts.push("</g>");
    return parts.join("");
  }

  function treeFrameSVG(f) {
    var t = f.t, tr = DATA.trees[t], spent = spentIn(t);
    var parts = [];

    /* zone frame + header */
    parts.push('<rect class="fc-zone" x="' + f.x.toFixed(3) + '" y="0" width="' + f.w.toFixed(3) + '" height="' + f.h.toFixed(3) + '"/>');
    parts.push('<text class="fc-zone-head" x="' + (f.x + 0.28).toFixed(3) + '" y="0.44">' + esc(treeLabel(tr)) + "</text>");
    parts.push('<text class="fc-zone-pts' + (spent >= MAXPTS ? " full" : "") + '" x="' + (f.x + f.w - 0.28).toFixed(3) + '" y="0.44" text-anchor="end">' + spent + " / " + MAXPTS + "</text>");
    parts.push('<line class="fc-zone-rule" x1="' + (f.x + 0.28).toFixed(3) + '" y1="0.62" x2="' + (f.x + f.w - 0.28).toFixed(3) + '" y2="0.62"/>');

    /* lock line: first tier whose gate is not paid yet */
    var firstLocked = -1;
    for (var i = 0; i < tr.tiers.length; i++) if (spent < tierReq(i)) { firstLocked = i; break; }
    if (firstLocked > 0) {
      var ly = TOP + (firstLocked - 0.5) * ROW;
      parts.push('<line class="fc-lock-line" x1="' + (f.x + 0.4).toFixed(3) + '" y1="' + ly.toFixed(3) + '" x2="' + (f.x + f.w - 0.4).toFixed(3) + '" y2="' + ly.toFixed(3) + '"/>');
      parts.push('<text class="fc-lock-label" x="' + (f.x + f.w / 2).toFixed(3) + '" y="' + (ly - 0.14).toFixed(3) + '" text-anchor="middle">نیازمند ' + faNum(tierReq(firstLocked)) + " امتیاز در این درخت</text>");
    }

    /* column connectors first (under nodes) */
    treeEdges(t).forEach(function (e) {
      var a = GEO.pos[key(t, e.from)], b = GEO.pos[key(t, e.to)];
      if (!a || !b) return;
      parts.push('<line class="fc-edge' + (spentOn(t, e.from) > 0 ? " lit" : "") + '" x1="' + a.x.toFixed(3) + '" y1="' + (a.y + NODE_R).toFixed(3) + '" x2="' + b.x.toFixed(3) + '" y2="' + (b.y - NODE_R).toFixed(3) + '"/>');
    });

    /* nodes (top-to-bottom) */
    var order = [];
    eachNode(t, function (x, ti) { order.push({ x: x, ti: ti, p: GEO.pos[key(t, x.n)] }); });
    order.sort(function (a, c) { return (a.p.y - c.p.y) || (a.p.x - c.p.x); });
    order.forEach(function (o) { parts.push(nodeSVG(t, o.x, o.ti, o.p)); });

    return parts.join("");
  }

  function buildTreeSVG() {
    GEO = computeGeo();
    var pad = 0.35;
    vb = { x: -pad, y: -pad, w: GEO.totalW + pad * 2, h: GEO.totalH + pad * 2 };
    pendingDefault = !view; /* default view needs the mounted canvas width */
    if (!view) view = { k: 1, x: 0, y: 0 };

    var parts = [];
    parts.push('<svg viewBox="' + vb.x.toFixed(3) + " " + vb.y.toFixed(3) + " " + vb.w.toFixed(3) + " " + vb.h.toFixed(3) + '" preserveAspectRatio="xMidYMid meet">');
    parts.push('<g id="fc-view"><g id="fc-inner" transform="translate(' + view.x.toFixed(3) + " " + view.y.toFixed(3) + ') scale(' + view.k.toFixed(4) + ')">');
    DATA.trees.forEach(function (tr, t) { parts.push(treeFrameSVG(GEO.frames[t])); });
    parts.push("</g></g></svg>");
    return parts.join("");
  }

  /* =========================================================
     panels around the tree
     ========================================================= */
  function classTabs() {
    return '<div class="tt-class-tabs fc-classes">' + INDEX.classes.map(function (c) {
      var active = c.slug === state.cls;
      return '<button type="button" class="tt-class-tab fc-cls' + (active ? " on" : "") + '" data-c="' + c.slug + '" aria-pressed="' + active + '">' +
        '<span style="display:inline-block;' + (active ? "box-shadow:0 0 34px " + c.color + "66, 0 0 12px rgba(240,199,94,0.35);border-radius:9999px" : "") + '">' +
        '<span class="wf-crest" style="width:52px;height:52px;' + (active ? "box-shadow:0 0 24px " + c.color + "80" : "") + '">' +
        '<span class="wf-crest-in" style="width:100%;height:100%">' +
        '<img src="icons/large/' + esc(c.icon) + '.jpg" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" ' +
        'onerror="if(!this.dataset.f){this.dataset.f=1;this.src=\'' + ZAM + esc(c.icon) + '.jpg\'}else{this.style.display=\'none\'}">' +
        "</span></span></span>" +
        '<span class="label" dir="rtl" style="' + (active ? "color:" + c.color : "") + '">' + esc(classLabel(c)) + "</span>" +
        "</button>";
    }).join("") + "</div>";
  }

  function canvasPanel() {
    return '<div class="tt-frame fc-frame"><div class="fc-panel">' +
      '<div class="tt-canvas fc-canvas" id="fc-canvas">' + buildTreeSVG() + "</div>" +
      '<div class="tt-toolbar fc-toolbar" dir="ltr">' +
      '<button class="tt-zoom-btn" id="fc-zoom-out" aria-label="کوچک‌نمایی"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"/></svg></button>' +
      '<span class="tt-zoom-val" id="fc-zoom-val">100%</span>' +
      '<button class="tt-zoom-btn" id="fc-zoom-in" aria-label="بزرگ‌نمایی"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg></button>' +
      '<button class="tt-zoom-btn" id="fc-zoom-reset" aria-label="بازنشانی نما"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="m22 12-4-4 4-4"/></svg></button>' +
      "</div>" +
      '<div class="tt-tip fc-tip" id="fc-tip" style="display:none"></div>' +
      '<div class="tt-hint fc-hint">' + HINT + "</div>" +
      "</div></div>";
  }

  function legend() {
    var items = [
      ["same", "همان کلاسیک"], ["changed", "تغییرکرده"], ["new", "جدید در Forever"], ["moved", "جابه‌جاشده"],
    ];
    return '<div class="tt-legend fc-legend" dir="rtl">' +
      items.map(function (it) {
        return '<span class="lg"><span class="swatch" style="border-color:' + RING[it[0]] + '"></span>' + it[1] + "</span>";
      }).join("") +
      '<span class="lg"><span class="swatch" style="border-color:rgba(240,199,94,.9);background:rgba(240,199,94,.25)"></span>امتیاز خرج‌شده</span>' +
      '<span class="lg"><span class="swatch" style="border-color:#5f6d85;opacity:.4"></span>قفل تا پر شدن امتیاز تیرهای بالاتر</span>' +
      "</div>";
  }

  function foot() {
    var left = MAXPTS + (state.legacy ? 5 : 0) - totalSpent();
    return '<div class="fs-foot">' +
      '<span class="fs-points">' + faNum(left) + " امتیاز مانده <small>از " + faNum(MAXPTS + (state.legacy ? 5 : 0)) + "</small></span>" +
      '<button type="button" class="fs-tab" id="fc-legacy"' + (state.legacy ? " on" : "") + ">مزیت «تالنتی» +۵</button>" +
      '<button type="button" class="fs-tab" id="fc-reset">ریست</button>' +
      '<button type="button" class="fs-tab" id="fc-link">کپی لینک بیلد</button>' +
      '<button type="button" class="fs-tab" id="fc-text">کپی متنی</button>' +
      '<button type="button" class="fs-tab" id="fc-save">ذخیرهٔ بیلد</button>' +
      '<button type="button" class="fs-tab" id="fc-show-saves">بیلدهای من</button>' +
      "</div>";
  }

  function popularRow() {
    if (!DATA.popular || !DATA.popular.length) return "";
    return '<div class="fs-pop">' + DATA.popular.map(function (p, i) {
      return '<button type="button" data-pop=\'' + esc(JSON.stringify(p.points)) + "'>بیلد محبوب " + esc(treeLabel(DATA.trees[i] || { fa: "" })) + ' <b dir="ltr">' + p.points.join("/") + "</b></button>";
    }).join("") + "</div>";
  }

  function orderList() {
    var items = [];
    for (var lv = 10; lv <= 60; lv++) {
      var k = lv - 9;
      if (k > totalSpent()) break;
      items.push("<li>" + faNum(k) + " <i>لِوِل " + faNum(lv) + "</i></li>");
    }
    if (!items.length) return '<div class="fs-order"><h4>ترتیب امتیازها</h4><p style="color:#79818f;font-size:.85rem">یک امتیاز خرج کن تا اینجا با لِوِلِ هر امتیاز نمایش داده شود.</p></div>';
    return '<div class="fs-order"><h4>ترتیب امتیازها — کدام امتیاز در کدام لِوِل</h4><ol>' + items.join("") + "</ol></div>";
  }

  /* =========================================================
     mutations
     ========================================================= */
  function spend(t, name, dir) {
    var max = maxRanks(t, name), have = spentOn(t, name);
    var next = have + dir;
    if (next < 0 || next > max) return false;
    if (dir > 0) {
      if (totalSpent() >= MAXPTS + (state.legacy ? 5 : 0)) return false;
      var ti = -1;
      eachNode(t, function (x, i) { if (x.n === name) ti = i; });
      if (ti < 0 || spentIn(t) < tierReq(ti)) return false;
    }
    state.pts[key(t, name)] = next;
    state.spent[t] = spentIn(t) + dir;
    return true;
  }
  function reset() { state.pts = {}; state.spent = [0, 0, 0]; pinnedKey = null; }

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
        var k = 0;
        treeStr.split(".").forEach(function (tierStr) {
          for (var j = 0; j < tierStr.length; j++) {
            var want = +tierStr[j], node = DATA.trees[i].tiers[k] && DATA.trees[i].tiers[k][j];
            if (!node) break;
            var n = Math.min(want, node.r || 1);
            if (n > 0) { state.pts[key(i, node.n)] = n; state.spent[i] += n; }
          }
          k++;
        });
      });
      return true;
    } catch (e) { return false; }
  }

  function applyPopular(pts) {
    reset();
    pts.forEach(function (P, t) {
      var tr = DATA.trees[t], left = P;
      for (var ti = 0; ti < tr.tiers.length && left > 0; ti++) {
        if (state.spent[t] < tierReq(ti)) break;
        for (var j = 0; j < tr.tiers[ti].length && left > 0; j++) {
          var x = tr.tiers[ti][j], max = x.r || 1, take = Math.min(max, left);
          if (take > 0) { state.pts[key(t, x.n)] = take; state.spent[t] += take; left -= take; }
        }
      }
    });
  }

  function saved() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "[]"); } catch (e) { return []; } }
  function saveBuild(name) {
    var all = saved();
    all.unshift({ cls: state.cls, name: name || ("بیلد " + (all.length + 1)), str: buildStr(), at: Date.now() });
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(all.slice(0, 20))); } catch (e) {}
  }

  /* =========================================================
     tooltip — hover follows the cursor, hold / shift+click pins
     ========================================================= */
  function nodeData(t, name) {
    var found = null;
    eachNode(t, function (x, ti) { if (x.n === name && !found) found = { x: x, ti: ti }; });
    return found;
  }
  /* FA text may carry build-time WFTR markers ({{sp:EN|FA}}, {{tm:EN|FA}}, …
     written by tools/markerize_talents.py) — resolve them per the user's
     switches so embedded ability names + glossary terms flip to EN when
     their switch is OFF (same contract as spellbook.js faHTML). Without
     this the سبک ترجمه switches had NO effect on talent descriptions. */
  function faHTML(t) {
    var html = esc(t);
    return (window.WFTR && WFTR.faTokens) ? WFTR.faTokens(html) : html;
  }
  function tipHTML(t, name) {
    var nd = nodeData(t, name);
    if (!nd) return "";
    var x = nd.x, have = spentOn(t, name), max = x.r || 1;
    var chip = '<span class="fs-chip ' + esc(x.st || "same") + '">' + esc(ST_FA[x.st] || x.st) + "</span>";
    return '<p class="ttip-name" dir="rtl">' + esc(x.fa) + ' <span class="ttip-en" dir="ltr">' + esc(x.n) + "</span></p>" +
      '<div class="ttip-badges" dir="rtl">' + chip +
      (max > 1 ? '<span class="ttip-badge b-rank">رنک ' + faNum(have) + "/" + faNum(max) + "</span>" : "") +
      '<span class="ttip-badge">' + esc(treeLabel(DATA.trees[t])) + " · تیر " + faNum(nd.ti + 1) + "</span>" +
      '<span class="ttip-badge b-req">درگاه: ' + faNum(tierReq(nd.ti)) + " امتیاز</span></div>" +
      (x.dFa ? '<div class="ttip-fa"><span class="fa-tag">فارسی</span><p dir="rtl">' + faHTML(x.dFa) + "</p></div>" : "") +
      (x.d ? '<p class="ttip-desc" dir="ltr">' + esc(x.d) + "</p>" : "") +
      '<div class="ttip-act" dir="ltr">' +
      '<button type="button" class="ttip-btn" data-act="minus">−</button>' +
      '<button type="button" class="ttip-btn ttip-plus" data-act="plus">+۱</button>' +
      (pinnedKey ? '<button type="button" class="ttip-btn" data-act="close">بستن</button>' : "") +
      "</div>";
  }

  function showTip(k, atNode) {
    var tip = document.getElementById("fc-tip"), el = document.getElementById("fc-canvas");
    if (!tip || !el || !GEO) return;
    var t = +k.split("|")[0], name = k.split("|")[1];
    tip.innerHTML = tipHTML(t, name);
    tip.setAttribute("data-key", k);
    tip.style.display = "block";
    if (atNode) {
      var p = GEO.pos[k];
      var svg = el.querySelector("svg");
      if (p && svg) {
        var ctm = svg.getScreenCTM();
        if (ctm && view) {
          var pt = new DOMPoint(p.x * view.k + view.x, p.y * view.k + view.y).matrixTransform(ctm);
          var r = el.getBoundingClientRect();
          clampTip(tip, pt.x - r.left + 12, pt.y - r.top, r);
        }
      }
    }
  }
  function clampTip(tip, px, py, rect) {
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var x = px + 16, y = py + 14;
    if (x + w > rect.width - 8) x = px - w - 16;
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
     pan & zoom (same feel as the retail tree page)
     ========================================================= */
  function clampView(v) {
    if (!vb) return v;
    var mx = vb.w * 0.2, my = vb.h * 0.2;
    var minX = vb.x + mx - v.k * (vb.x + vb.w), maxX = vb.x + vb.w - mx - v.k * vb.x;
    var minY = vb.y + my - v.k * (vb.y + vb.h), maxY = vb.y + vb.h - my - v.k * vb.y;
    return { k: v.k, x: Math.min(maxX, Math.max(minX, v.x)), y: Math.min(maxY, Math.max(minY, v.y)) };
  }
  /* desktop: fit everything. phone: start zoomed on the first tree. */
  function defaultView() {
    if (!vb || !GEO) return { k: 1, x: 0, y: 0 };
    var el = document.getElementById("fc-canvas");
    var w = el ? el.clientWidth : 1000, h = el ? el.clientHeight : 600;
    if (w >= 760) return { k: 1, x: 0, y: 0 };
    var fit = Math.min(w / vb.w, h / vb.h);          /* px per unit at k=1 */
    var f = GEO.frames[0];
    var want = w / (f.w + GAP * 1.6);                /* desired px per unit */
    var k = Math.min(MAX_K, Math.max(1, want / fit));
    var ux = f.x + f.w / 2, uy = Math.min(GEO.totalH * 0.35, TOP + 2.2 * ROW);
    return clampView({ k: k, x: vb.x + vb.w / 2 - k * ux, y: vb.y + vb.h / 2 - k * uy });
  }
  function setView(v) {
    view = clampView(v);
    var inner = document.getElementById("fc-inner");
    if (inner) inner.setAttribute("transform", "translate(" + view.x.toFixed(3) + " " + view.y.toFixed(3) + ") scale(" + view.k.toFixed(4) + ")");
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
  function bindCanvas() {
    var el = document.getElementById("fc-canvas");
    if (!el) return;
    var pan = null, holdT = null;

    el.addEventListener("wheel", function (e) {
      e.preventDefault();
      var svg = el.querySelector("svg");
      if (!svg || !view) return;
      var ctm = svg.getScreenCTM();
      if (!ctm) return;
      var pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      var k2 = Math.min(MAX_K, Math.max(MIN_K, view.k * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0016))));
      resetTip();
      setView({ k: k2, x: pt.x - ((pt.x - view.x) * k2) / view.k, y: pt.y - ((pt.y - view.y) * k2) / view.k });
    }, { passive: false });

    el.addEventListener("pointerdown", function (e) {
      if (!view) return;
      if (e.button !== 0) return;
      pan = { id: e.pointerId, cx: e.clientX, cy: e.clientY, moved: false };
      /* long-press = pinned tooltip (touch) */
      var g = e.target.closest && e.target.closest(".fc-node");
      if (g && !pinnedKey) {
        holdT = setTimeout(function () {
          holdT = null;
          pan = null;
          pinnedKey = g.getAttribute("data-t") + "|" + g.getAttribute("data-n");
          showTip(pinnedKey, true);
        }, 430);
      }
    });
    el.addEventListener("pointermove", function (e) {
      if (!pan || pan.id !== e.pointerId) {
        /* hover-follow tooltip (mouse only) */
        if (e.pointerType === "mouse" && !pinnedKey && !panningActive) {
          var g2 = e.target.closest && e.target.closest(".fc-node");
          var tip = document.getElementById("fc-tip"), r = el.getBoundingClientRect();
          if (g2) {
            var k2v = g2.getAttribute("data-t") + "|" + g2.getAttribute("data-n");
            if (tip && tip.getAttribute("data-key") !== k2v) { tip.innerHTML = tipHTML(+k2v.split("|")[0], k2v.split("|")[1]); tip.setAttribute("data-key", k2v); }
            if (tip) { tip.style.display = "block"; clampTip(tip, e.clientX - r.left, e.clientY - r.top, r); }
          } else if (!pinnedKey && tip) { tip.style.display = "none"; tip.removeAttribute("data-key"); }
        }
        return;
      }
      if (holdT) { clearTimeout(holdT); holdT = null; }
      if (!pan.moved && Math.hypot(e.clientX - pan.cx, e.clientY - pan.cy) > 5) {
        pan.moved = true;
        panningActive = true;
        el.classList.add("is-panning");
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
        hideTip();
      }
      if (!pan.moved) return;
      var svg = el.querySelector("svg");
      var ctm = svg && svg.getScreenCTM();
      if (!ctm) return;
      var scale = Math.hypot(ctm.a, ctm.b);
      var dx = (e.clientX - pan.cx) / scale, dy = (e.clientY - pan.cy) / scale;
      pan.cx = e.clientX; pan.cy = e.clientY;
      setView({ k: view.k, x: view.x + dx, y: view.y + dy });
    });
    function endPan() {
      if (holdT) { clearTimeout(holdT); holdT = null; }
      pan = null; panningActive = false;
      el.classList.remove("is-panning");
    }
    el.addEventListener("pointerup", endPan);
    el.addEventListener("pointercancel", endPan);
    el.addEventListener("lostpointercapture", endPan);
    el.addEventListener("pointerleave", function () { if (!pinnedKey) hideTip(); });

    document.getElementById("fc-zoom-out").addEventListener("click", function () { zoomBy(1 / 1.25); });
    document.getElementById("fc-zoom-in").addEventListener("click", function () { zoomBy(1.25); });
    document.getElementById("fc-zoom-reset").addEventListener("click", function () { resetTip(); view = null; setView(defaultView()); });
  }

  /* icon fallback: local → zamimg → letter */
  function bindIconFallback() {
    var el = document.getElementById("fc-canvas");
    if (!el) return;
    el.addEventListener("error", function (e) {
      var img = e.target;
      if (!(img instanceof SVGImageElement)) return;
      var bid = img.getAttribute("data-bid"), fb = img.getAttribute("data-fallback");
      if (fb && img.getAttribute("href") !== fb) { img.setAttribute("href", fb); return; }
      broken.add(bid);
      var letter = img.getAttribute("data-letter");
      if (letter) {
        var t = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t.setAttribute("class", "fc-letter");
        t.setAttribute("x", "0"); t.setAttribute("y", "0.02");
        t.setAttribute("text-anchor", "middle"); t.setAttribute("dominant-baseline", "middle");
        t.setAttribute("font-size", "0.26");
        t.textContent = letter;
        img.parentNode.insertBefore(t, img);
      }
      img.style.display = "none";
    }, true);
  }

  /* =========================================================
     render
     ========================================================= */
  function render() {
    root.innerHTML = classTabs() + canvasPanel() + legend() + foot() + popularRow() + orderList();
    bindCanvas();
    bindIconFallback();
    if (pendingDefault) { pendingDefault = false; view = null; setView(defaultView()); }
    if (pinnedKey) showTip(pinnedKey, true);
    if (history.replaceState) history.replaceState(null, "", "forever-talents.html?class=" + state.cls + (totalSpent() ? "&b=" + buildStr() : ""));
  }
  function renderSafe() {
    if (!DATA || !INDEX) {
      root.innerHTML = INDEX ? classTabs() : '<p style="text-align:center;color:#79818f;padding:3rem 0">در حال بارگذاری کالکولیتور…</p>';
      return;
    }
    render();
  }

  /* ---------- events ---------- */
  root.addEventListener("click", function (e) {
    var act = e.target.closest && e.target.closest(".ttip-btn");
    if (act) {
      var a = act.getAttribute("data-act"), k = pinnedKey;
      if (a === "plus" && k) { if (spend(+k.split("|")[0], k.split("|")[1], 1)) render(); }
      else if (a === "minus" && k) { if (spend(+k.split("|")[0], k.split("|")[1], -1)) render(); }
      else if (a === "close") { resetTip(); }
      return;
    }
    var cls = e.target.closest(".fc-cls");
    if (cls) { state.cls = cls.getAttribute("data-c"); reset(); view = null; load(state.cls); return; }
    var pop = e.target.closest("[data-pop]");
    if (pop) { applyPopular(JSON.parse(pop.getAttribute("data-pop"))); view = null; render(); return; }
    if (e.target.id === "fc-reset") { reset(); view = null; render(); return; }
    if (e.target.id === "fc-legacy") { state.legacy = !state.legacy; render(); return; }
    if (e.target.id === "fc-link") {
      var u = location.origin + location.pathname + "?class=" + state.cls + "&b=" + buildStr();
      (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(function () { flash("لینک بیلد کپی شد"); }, function () { prompt("لینک بیلد:", u); });
      return;
    }
    if (e.target.id === "fc-text") {
      var lines = DATA.trees.map(function (t, i) {
        return treeLabel(t) + ": " + state.spent[i] + " — " + t.tiers.map(function (tier) {
          return tier.filter(function (x) { return spentOn(i, x.n) > 0; })
            .map(function (x) { return x.fa + " " + spentOn(i, x.n); }).join("، ");
        }).filter(Boolean).join(" | ");
      }).join("\n");
      (navigator.clipboard ? navigator.clipboard.writeText(lines) : Promise.reject()).then(function () { flash("بیلد متنی کپی شد"); }, function () { prompt("بیلد متنی:", lines); });
      return;
    }
    if (e.target.id === "fc-save") {
      var nm = prompt("نام بیلد:", "بیلد " + treeLabel(DATA.trees[0]));
      if (nm != null) { saveBuild(nm); flash("بیلد ذخیره شد"); }
      return;
    }
    if (e.target.id === "fc-show-saves") {
      var all = saved().filter(function (b) { return b.cls === state.cls; });
      alert(all.length ? all.map(function (b) { return b.name + " — " + b.str; }).join("\n") : "هنوز بیلدی برای این کلاس ذخیره نکرده‌ای.");
      return;
    }
    /* node clicks: drag-guarded spend, shift+click pins */
    var canvas = e.target.closest && e.target.closest("#fc-canvas");
    if (canvas) {
      var node = e.target.closest(".fc-node");
      if (node) {
        var t = +node.getAttribute("data-t"), name = node.getAttribute("data-n"), k = key(t, name);
        if (e.shiftKey) { pinnedKey = k; showTip(k, true); return; }
        if (spend(t, name, 1)) { render(); return; }
        /* explain why the point was refused */
        var nd = nodeData(t, name);
        if (nd && spentIn(t) < tierReq(nd.ti)) flash("این تیر قفل است — اول " + faNum(tierReq(nd.ti)) + " امتیاز در این درخت خرج کن");
        else if (totalSpent() >= MAXPTS + (state.legacy ? 5 : 0)) flash("امتیازی برای خرج کردن نمانده است");
        return;
      }
      if (pinnedKey) resetTip();
    }
  });
  root.addEventListener("contextmenu", function (e) {
    var node = e.target.closest && e.target.closest(".fc-node");
    if (node) {
      e.preventDefault();
      var t = +node.getAttribute("data-t"), name = node.getAttribute("data-n");
      if (spend(t, name, -1)) render();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") resetTip();
  });

  var flashT = null;
  function flash(msg) {
    var d = document.createElement("div");
    d.textContent = msg;
    d.style.cssText = "position:fixed;bottom:1.4rem;left:50%;transform:translateX(-50%);z-index:99;background:#2c2413;color:#f5e7c8;border:1px solid rgba(224,185,84,.5);padding:.5rem 1.1rem;border-radius:999px;font-size:.85rem";
    document.body.appendChild(d);
    clearTimeout(flashT);
    flashT = setTimeout(function () { d.remove(); }, 1800);
  }

  /* ---------- load ---------- */
  function load(cls) {
    renderSafe();
    getJSON("data/forever/db/" + cls + ".json").then(function (d) {
      DATA = d;
      var m = location.search.match(/[?&]b=([0-9.\-]+)/);
      if (m) parseStr(m[1]);
      view = null;
      render();
    }, function () {
      root.innerHTML = (INDEX ? classTabs() : "") + '<p style="text-align:center;color:#79818f;padding:3rem 0">بارگذاری دادهٔ این کلاس ناموفق بود.</p>';
    });
  }

  getJSON("data/forever/db/classes.json").then(function (ix) {
    INDEX = ix;
    var m = location.search.match(/[?&]class=([a-z-]+)/);
    if (m && INDEX.classes.some(function (c) { return c.slug === m[1]; })) state.cls = m[1];
    load(state.cls);
  });
  /* سبک ترجمه switch flips re-render an open tooltip in place (content
     only — position/pin state stays). tr.js is injected ASYNC by
     nav-menu.js, so window.WFTR may not exist when this IIFE runs — poll
     for it (cap ~7s), register the listener once it's there. */
  (function whenTr(tries) {
    if (window.WFTR && WFTR.onChange) {
      WFTR.onChange(function () {
        var tip = document.getElementById("fc-tip");
        if (tip && tip.style.display === "block" && tip.getAttribute("data-key") && DATA) {
          showTip(tip.getAttribute("data-key"), false);
        }
        if (DATA) render(); /* namesClass flips tree + class labels (v4.1) */
      });
    } else if (tries < 48) {
      setTimeout(function () { whenTr(tries + 1); }, 150);
    }
  })(0);
})();
