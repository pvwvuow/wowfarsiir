/* ============================================================
   news-body.js — wowheadFA news v2 body renderer + item tooltips
   (runtime mirror of tools/news_blocks.py — keep the two in sync)

   - article.html (dynamic fallback) and news.html (reader overlay)
     call NB.renderBody(body_fa) for structured v2 blocks.
   - Static news/*.html pages have server-rendered HTML + inline
     window.NEWS_TIPS; they only need NB.initTips() for hover cards.
   v=20261104a
   ============================================================ */
(function () {
"use strict";

var QCOL = {0:"#b4b4b4",1:"#ffffff",2:"#1eff00",3:"#3a9bff",4:"#c06cff",5:"#ff8000",6:"#e6cc80",7:"#00cc98"};
var QFA = ["ضعیف","معمولی","غیرمعمول","کمیاب","حماسی","افسانه‌ای","آرتیفکت","وارثی"];
var SLOT_FA = {head:"سر",neck:"گردن",shoulder:"شانه",back:"شنل",chest:"سینه",wrist:"مچ",hands:"دست",waist:"کمربند",legs:"پا",feet:"چکمه",finger:"انگشتر",trinket:"ترینکت",weapon:"سلاح","off-hand":"آف‌هند",tabard:"تابارد",shirt:"پیراهن",bag:"کیسه",gem:"سنگ",consumable:"مصرفی",recipe:"دستور",housing:"خانه‌داری",quest:"کوئست",misc:"متفرقه",materials:"مواد اولیه"};
var BIND_FA = {pickup:"هنگام برداشتن متصل می‌شود",boe:"هنگام فروش یا پوشیدن متصل می‌شود",equip:"هنگام تجهیز متصل می‌شود",onuse:"هنگام استفاده متصل می‌شود"};
var ZAM = "https://wow.zamimg.com/images/wow/icons/large/";

var TIPS = {};      /* id -> compact tip (see news_blocks.compact_tip) */
var TIPS_P = null;  /* lazy fetch promise for news/tips.json */

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  });
}
function faNum(v) { return String(v == null ? "" : v).replace(/[0-9]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹".charAt(+d); }); }

/* ---------- tips ---------- */
function mergeTips(items) {
  if (items && typeof items === "object") {
    Object.keys(items).forEach(function (k) { TIPS[String(k)] = items[k]; });
  }
}
if (window.NEWS_TIPS) mergeTips(window.NEWS_TIPS);

function loadTips(url) {
  if (!TIPS_P) {
    TIPS_P = fetch(url + "?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { mergeTips(d && d.items); })
      .catch(function () {});
  }
  return TIPS_P;
}

/* id can be int or EN name (resolved against TIPS names) */
function resolveId(val) {
  var s = String(val == null ? "" : val).trim().replace(/’/g, "'");
  if (/^\d{1,8}$/.test(s)) return TIPS[s] ? s : null;
  var k = s.toLowerCase();
  for (var id in TIPS) {
    if ((TIPS[id].n || "").toLowerCase().replace(/’/g, "'") === k) return id;
  }
  return null;
}
function itemHref(id, tip, base) {
  base = base || "";
  return tip && tip.u ? base + "item/" + tip.u : base + "item.html?id=" + encodeURIComponent(id);
}
function iconImg(ic, cls) {
  if (!ic) return "";
  return '<img class="' + (cls || "nb-ic") + '" src="icons/large/' + esc(ic) + '.jpg" alt="" loading="lazy"' +
    ' onerror="this.onerror=null;this.src=\'' + ZAM + esc(ic) + '.jpg\'">';
}
function qOf(tip) { return tip && tip.q >= 0 && tip.q <= 7 ? tip.q : 4; }

function mkChip(id, tip, label, base) {
  if (!tip) return esc(label);
  return '<a class="nb-it q' + qOf(tip) + '" data-it="' + esc(id) + '" href="' + esc(itemHref(id, tip, base)) + '">' +
    iconImg(tip.ic) + "<span>" + esc(label || tip.n) + "</span></a>";
}

var MARKER = /\[\[item:([^\]|]+?)(?:\|([^\]]+))?\]\]/g;

function linkText(text, base) {
  text = String(text == null ? "" : text);
  var out = "", last = 0, m;
  MARKER.lastIndex = 0;
  while ((m = MARKER.exec(text))) {
    out += autoLink(text.slice(last, m.index), base);
    var id = resolveId(m[1]);
    out += id ? mkChip(id, TIPS[id], (m[2] || "").trim() || TIPS[id].n, base)
              : esc((m[2] || m[1]).trim());
    last = MARKER.lastIndex;
  }
  return out + autoLink(text.slice(last), base);
}

/* auto-link known EN names present in TIPS (longest first, word-bounded) */
function autoLink(text, base) {
  var names = [];
  for (var id in TIPS) {
    var n = TIPS[id].n || "";
    if (n.length >= 4 && text.indexOf(n) >= 0) names.push(n);
  }
  if (!names.length) return esc(text);
  names.sort(function (a, b) { return b.length - a.length; });
  var pat = new RegExp("(?<![A-Za-z0-9])(" + names.map(function (n) {
    return n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("|") + ")(?![A-Za-z0-9])", "g");
  return esc(text).replace(pat, function (m0) {
    var id = resolveId(m0);
    return id ? mkChip(id, TIPS[id], m0, base) : m0;
  });
}

/* ---------- v2 blocks -> html (mirror of news_blocks.render_body) ---------- */
function clean(s) { return String(s == null ? "" : s).replace(/\s+/g, " ").trim(); }

function renderBody(body, base) {
  if (!Array.isArray(body)) body = [body];
  var out = [];
  body.forEach(function (b) {
    if (typeof b === "string") {
      if (clean(b)) out.push("<p>" + linkText(clean(b), base) + "</p>");
      return;
    }
    if (!b || typeof b !== "object") return;
    var t = String(b.t || "p").toLowerCase();
    if (t === "p" || (t !== "h" && t !== "ul" && t !== "ol" && t !== "quote" &&
                      t !== "note" && t !== "table" && t !== "img" && t !== "item")) {
      var x = clean(b.x || b.text || (typeof b === "object" ? JSON.stringify(b) : b));
      if (x) out.push("<p>" + linkText(x, base) + "</p>");
    } else if (t === "h") {
      if (clean(b.x)) out.push('<h2 class="ar-h2">' + linkText(clean(b.x), base) + "</h2>");
    } else if (t === "ul" || t === "ol") {
      var xs = (b.xs || b.items || []).map(clean).filter(Boolean);
      if (xs.length) out.push("<" + t + ' class="ar-' + t + '">' +
        xs.map(function (x) { return "<li>" + linkText(x, base) + "</li>"; }).join("") + "</" + t + ">");
    } else if (t === "quote") {
      if (clean(b.x)) out.push('<blockquote class="ar-quote"><p>' + linkText(clean(b.x), base) + "</p>" +
        (b.by ? "<cite>" + esc(clean(b.by)) + "</cite>" : "") + "</blockquote>");
    } else if (t === "note") {
      var kind = ["tip","warn","info"].indexOf(b.kind) >= 0 ? b.kind : "tip";
      var ic = {tip:"💡", warn:"⚠️", info:"ℹ️"}[kind];
      if (clean(b.x)) out.push('<div class="ar-note ar-note--' + kind + '">' +
        '<span class="ar-note-ic" aria-hidden="true">' + ic + "</span><p>" +
        linkText(clean(b.x), base) + "</p></div>");
    } else if (t === "table") {
      var head = (b.head || []).map(clean).filter(Boolean);
      var rows = (b.rows || []).filter(function (r) { return Array.isArray(r) && r.length; });
      if (head.length && rows.length) {
        out.push('<div class="ar-table-wrap"><table class="ar-table"><thead><tr>' +
          head.map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("") +
          "</tr></thead><tbody>" +
          rows.map(function (r) { return "<tr>" + r.map(function (c) {
            return "<td>" + linkText(clean(c), base) + "</td>"; }).join("") + "</tr>"; }).join("") +
          "</tbody></table></div>");
      }
    } else if (t === "img") {
      if (/^https:\/\/[\w.-]+\//.test(String(b.src || ""))) {
        out.push('<figure class="ar-fig"><img src="' + esc(b.src) + '" alt="' +
          esc(b.cap || "") + '" loading="lazy" referrerpolicy="no-referrer">' +
          (b.cap ? "<figcaption>" + esc(clean(b.cap)) + "</figcaption>" : "") + "</figure>");
      }
    } else if (t === "item") {
      var ids = Array.isArray(b.ids) ? b.ids : (b.id != null ? [b.id] : []);
      if (!ids.length && b.name) { var rid = resolveId(b.name); if (rid) ids = [rid]; else ids = [b.name]; }
      ids.slice(0, 4).forEach(function (i) { out.push(itemCard(i, base)); });
    }
  });
  return out.join("");
}

function itemCard(id, base) {
  var tip = TIPS[String(id)];
  if (!tip) {
    return '<div class="item-card nb-card"><div class="nb-head"><span class="nb-name q4" dir="ltr">#' +
      esc(id) + '</span></div><p class="nb-missing">این آیتم تازه است و خودکار به دیتابیس wowfarsi اضافه می‌شود.</p></div>';
  }
  var q = qOf(tip), rows = "";
  function row(k, v) { if (v) rows += "<tr><th>" + k + ":</th><td class=\"ltr\">" + v + "</td></tr>"; }
  row("آیل‌ول", tip.il ? faNum(tip.il) : "");
  row("اسلات", tip.sl ? SLOT_FA[tip.sl] + " · " + esc(tip.sl) : "");
  row("سطح لازم", tip.rl ? faNum(tip.rl) : "");
  if (tip.w && tip.w.d) rows += '<tr><th>آسیب:</th><td class="ltr">' + esc(tip.w.d) +
    " (سرعت " + esc(tip.w.s || "—") + ", DPS " + esc(tip.w.p || "—") + ")</td></tr>";
  var st = (tip.st || []).map(function (s) {
    return '<div class="nb-st">+' + esc(s[1]) + " " + esc(s[0]) + "</div>"; }).join("");
  var fx = (tip.fx || []).map(function (e) {
    var t = (e[0] || e[1] || "").trim();
    return t ? '<div class="nb-fx">' + esc(t) + "</div>" : ""; }).join("");
  return '<div class="item-card nb-card" data-it="' + esc(id) + '">' +
    '<div class="nb-head"><a class="nb-name q' + q + '" href="' + esc(itemHref(id, tip, base)) +
    '" data-it="' + esc(id) + '">' + esc(tip.n) + "</a>" + iconImg(tip.ic) + "</div>" +
    '<table class="nb-rows">' + rows + "</table>" + st + fx +
    '<p class="nb-hint">کلیک = صفحهٔ کامل آیتم</p></div>';
}

/* ---------- hover / tap tooltips (same UX as the retail section) ---------- */
function tipHtml(id) {
  var tip = TIPS[String(id)];
  if (!tip) return "";
  var q = qOf(tip);
  var h = '<p class="tn" style="color:' + (QCOL[q] || QCOL[4]) + '">' + esc(tip.n) + "</p>";
  var bits = [];
  bits.push(QFA[q]);
  if (tip.il) bits.push("آیل‌ول " + faNum(tip.il));
  if (tip.sl) bits.push(SLOT_FA[tip.sl] || tip.sl);
  if (bits.length) h += '<p class="en" style="direction:rtl;text-align:right">' + esc(bits.join(" · ")) + "</p>";
  (tip.st || []).forEach(function (s) { h += '<p class="st">+' + esc(s[1]) + " " + esc(s[0]) + "</p>"; });
  (tip.fx || []).forEach(function (e) {
    var t = (e[0] || e[1] || "").trim();
    if (t) h += '<p class="fx">' + esc(t) + "</p>";
  });
  if (tip.w && tip.w.d) h += '<p class="st">' + esc(tip.w.d) + " · " + esc(tip.w.s) + "s · DPS " + esc(tip.w.p) + "</p>";
  return h + '<p class="hint">کلیک = صفحهٔ کامل آیتم</p>';
}

function initTips() {
  if (document.getElementById("nb-tip")) return;
  var tip = document.createElement("div");
  tip.id = "nb-tip";
  tip.style.display = "none";
  document.body.appendChild(tip);
  var cur = null;
  function place(x, y) {
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var px = x + 16, py = y + 16;
    if (px + w > window.innerWidth - 8) px = x - w - 16;
    if (py + h > window.innerHeight - 8) py = Math.max(8, y - h - 16);
    tip.style.left = Math.max(8, px) + "px";
    tip.style.top = Math.max(8, py) + "px";
  }
  function show(el, x, y) {
    var html = tipHtml(el.getAttribute("data-it"));
    if (!html) return;
    cur = el;
    tip.innerHTML = html;
    tip.style.display = "block";
    place(x, y);
  }
  function hide() { cur = null; tip.style.display = "none"; }
  document.addEventListener("mouseover", function (e) {
    var el = e.target.closest && e.target.closest("[data-it]");
    if (el && TIPS[String(el.getAttribute("data-it"))]) show(el, e.pageX, e.pageY);
    else if (cur) hide();
  });
  document.addEventListener("mousemove", function (e) {
    if (cur) place(e.pageX, e.pageY);
  });
  document.addEventListener("mouseout", function (e) {
    var el = e.target.closest && e.target.closest("[data-it]");
    if (el && el === cur) hide();
  });
  document.addEventListener("touchstart", function (e) {
    var el = e.target.closest && e.target.closest("[data-it]");
    if (el && TIPS[String(el.getAttribute("data-it"))]) {
      var t = e.touches[0];
      show(el, t.pageX, t.pageY);
    } else hide();
  }, { passive: true });
}

/* lead figures: the article's own thumbnail/images INSIDE the body
   (owner request 2026-10-31: «تصاویر تامنیل توی خود خبر باشه»).
   Empty when the writer already embedded an img block - no duplicates. */
function leadFigures(a) {
  a = a || {};
  var body = a.body_fa || [];
  for (var i = 0; i < body.length; i++) {
    if (body[i] && typeof body[i] === "object" && body[i].t === "img") return "";
  }
  var seen = {}, figs = [];
  var imgs = [];
  if (a.thumb) imgs.push({ src: a.thumb, cap: "" });
  (a.images || []).forEach(function (im) { imgs.push(im || {}); });
  for (var j = 0; j < imgs.length; j++) {
    var src = String(imgs[j].src || "").trim();
    if (src.indexOf("https://") !== 0 || seen[src]) continue;
    seen[src] = 1;
    var cap = String(imgs[j].cap || "").trim();
    figs.push('<figure class="ar-fig"><img src="' + esc(src.slice(0, 500)) +
      '" alt="" loading="lazy" referrerpolicy="no-referrer">' +
      (cap ? "<figcaption>" + esc(cap) + "</figcaption>" : "") + "</figure>");
  }
  return figs.join("");
}

window.NB = {
  esc: esc, faNum: faNum, TIPS: TIPS, mergeTips: mergeTips, loadTips: loadTips,
  resolveId: resolveId, linkText: linkText, renderBody: renderBody,
  leadFigures: leadFigures,
  initTips: initTips, itemCard: itemCard,
};
/* static pages: tooltips are ready right after DOM is in */
if (document.readyState !== "loading") initTips();
else document.addEventListener("DOMContentLoaded", initTips);
})();
