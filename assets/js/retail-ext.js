/* =========================================================
   wowfarsi - Retail extras (loaded by support.js on guide pages)
   1. rating rows -> one tidy card of tiles
   2. Persian sentences that were forced left-to-right -> right-to-left
   3. talent map: decodes the build's import string and lights up the talents it takes
      (selected = lit, not taken = dim), with a copy button for the string.
      Builds with hero + content fields get a Hero Tree x Content selector (up to 6 builds).
   4. Diminishing Returns card from <slug>.extra.json (dr block)
   Optional overlay data/retail/guides/<slug>.extra.json: { builds: [...], dr: [...], dr_note }
   The import string is the game's own loadout format: version (8 bits), spec id (16), tree hash (128),
   then per tree node, in the game's node order (data/retail/node-order.json, hidden nodes included):
   selected(1) [purchased(1) [partial(1) [ranks(6)]] choice(1) [index(2)]]. Decoded in the browser.
   ========================================================= */
"use strict";
(function () {
  if (document.body.getAttribute("data-rt") !== "guide") return;
  var rootEl = document.getElementById("rt-root");
  if (!rootEl) return;
  var FA = /[\u0600-\u06FF]/;
  var ZAM = "https://wow.zamimg.com/images/wow/icons/large/";
  var DEBUG = /[?&]debug=1/.test(location.search);
  var done = false, drDone = false, extraP = null;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function css(href) {
    if (document.querySelector('link[href*="' + href.split("?")[0] + '"]')) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }
  css("assets/css/retail-ext.css?v=20261026b");
  css("assets/css/retail-ext-b.css?v=20261026d");
  function slugOf() { return new URLSearchParams(location.search).get("spec") || "frost-death-knight"; }
  function extra() {
    if (!extraP) extraP = fetch("data/retail/guides/" + slugOf() + ".extra.json?v=20261026d").then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
    return extraP;
  }

  /* ---------- 1. rating card ---------- */
  function ratings() {
    Array.prototype.forEach.call(rootEl.querySelectorAll(".rt-rate:not(.rt-ratecard)"), function (box) {
      var tiles = Array.prototype.map.call(box.children, function (d) {
        var k = d.querySelector(".k"), v = d.querySelector(".v");
        if (!k || !v) return "";
        var n = v.querySelectorAll("i.f").length;
        var txt = (v.firstChild && v.firstChild.nodeValue || "").trim();
        var bar = "";
        for (var i = 1; i <= 5; i++) bar += "<i" + (i <= n ? ' class="f"' : "") + "></i>";
        return '<div class="rt-tile l' + n + '"><b>' + esc(k.textContent) + "</b><strong>" + esc(txt) + '</strong><span class="rt-bar">' + bar + "</span></div>";
      }).join("");
      box.className = "rt-ratecard";
      box.innerHTML = tiles;
    });
  }

  /* ---------- 2. direction of Persian text that was marked left-to-right ---------- */
  function dirs() {
    Array.prototype.forEach.call(rootEl.querySelectorAll(".rt-kv span.rt-en, .rt-card h4.rt-en"), function (el) {
      if (FA.test(el.textContent)) { el.classList.remove("rt-en"); el.style.direction = "rtl"; el.style.unicodeBidi = "isolate"; }
    });
  }

  /* ---------- 4. Diminishing Returns card ---------- */
  function drCard() {
    var sec = document.getElementById("stats");
    if (!sec || drDone) return;
    drDone = true;
    extra().then(function (ex) {
      if (!ex.dr || !ex.dr.length || sec.querySelector(".rt-dr")) return;
      var rows = ex.dr.map(function (r) {
        return '<div class="rt-drr"><b>' + esc(r.stat) + '</b><div class="rt-drp">' + (r.points || []).map(function (p) {
          return "<span><em>" + esc(p.rating) + "</em><i>" + esc(p.pct) + "%</i></span>";
        }).join("") + "</div></div>";
      }).join("");
      var card = document.createElement("div");
      card.className = "rt-dr";
      card.innerHTML = "<h3>نقطه‌های Diminishing Returns</h3>" + (ex.dr_note ? '<p class="note">' + esc(ex.dr_note) + "</p>" : "") + rows;
      var old = null;
      Array.prototype.forEach.call(sec.querySelectorAll("p"), function (p) { if (!old && p.textContent.indexOf("Diminishing Returns") > -1 && p.textContent.indexOf("1380") > -1) old = p; });
      if (old) { old.parentNode.insertBefore(card, old); old.parentNode.removeChild(old); } else sec.appendChild(card);
    });
  }

  /* ---------- 3. talent map ---------- */
  var B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  function Reader(str) {
    var bits = [];
    for (var i = 0; i < str.length; i++) {
      var v = B64.indexOf(str.charAt(i));
      if (v < 0) continue;
      for (var b = 0; b < 6; b++) bits.push((v >> b) & 1);
    }
    this.bits = bits;
    this.pos = 0;
  }
  Reader.prototype.read = function (n) {
    var v = 0;
    for (var i = 0; i < n; i++) {
      if (this.pos >= this.bits.length) { this.over = true; return 0; }
      v += this.bits[this.pos++] * Math.pow(2, i);
    }
    return v;
  };
  function decode(code, spec, order) {
    var r = new Reader(code);
    r.read(8);
    var specId = r.read(16);
    r.read(128);
    var byId = {};
    spec.nodes.forEach(function (n) { byId[n.id] = n; });
    var ids = order && order.length ? order : spec.nodes.map(function (n) { return n.id; }).sort(function (a, b) { return a - b; });
    var state = {};
    ids.forEach(function (id) {
      if (r.read(1) !== 1) return;
      var n = byId[id] || { r: 1 }, st = { rank: n.r || 1, choice: 0, free: true };
      if (r.read(1) === 1) {
        st.free = false;
        if (r.read(1) === 1) st.rank = r.read(6);
        if (r.read(1) === 1) st.choice = r.read(2);
      }
      state[id] = st;
    });
    var left = r.bits.length - r.pos;
    return { specId: specId, state: state, ok: !r.over && specId === spec.specId && left < 8, left: left };
  }

  function panel(title, nodes, state, cls) {
    if (!nodes.length) return "";
    var K = 92, R = 27, P = 46, ids = {};
    nodes.forEach(function (n) { ids[n.id] = n; });
    var xs = nodes.map(function (n) { return n.x; }), ys = nodes.map(function (n) { return n.y; });
    var minx = Math.min.apply(null, xs), miny = Math.min.apply(null, ys);
    var W = (Math.max.apply(null, xs) - minx) * K + P * 2, H = (Math.max.apply(null, ys) - miny) * K + P * 2;
    function X(n) { return ((n.x - minx) * K + P).toFixed(1); }
    function Y(n) { return ((n.y - miny) * K + P).toFixed(1); }
    var edges = "", body = "";
    nodes.forEach(function (n) {
      (n.nx || []).forEach(function (t) {
        var m = ids[t];
        if (!m) return;
        var on = state[n.id] && state[t];
        edges += '<line class="e' + (on ? " on" : "") + '" x1="' + X(n) + '" y1="' + Y(n) + '" x2="' + X(m) + '" y2="' + Y(m) + '"/>';
      });
    });
    nodes.forEach(function (n) {
      var st = state[n.id], on = !!st;
      var entries = n.en || [];
      var isChoice = n.t === "choice" && entries.length > 1;
      var e = isChoice ? entries[on ? Math.min(st.choice, entries.length - 1) : 0] : entries[0];
      if (!e) return;
      var cp = "cp" + n.id;
      body += '<g class="sp ' + (on ? "on" : "off") + " " + cls + '" data-sp="' + esc(e.n) + '" transform="translate(' + X(n) + " " + Y(n) + ')">' +
        '<circle class="ring" r="' + R + '"/><clipPath id="' + cp + '"><circle r="' + (R - 3) + '"/></clipPath>' +
        (e.ic ? '<image href="icons/large/' + esc(e.ic) + '.jpg" data-fb="' + ZAM + esc(e.ic) + '.jpg" x="' + -(R - 3) + '" y="' + -(R - 3) + '" width="' + (R - 3) * 2 + '" height="' + (R - 3) * 2 + '" clip-path="url(#' + cp + ')" preserveAspectRatio="xMidYMid slice"/>' : "") +
        (isChoice ? '<line class="ch" x1="0" y1="' + -(R - 3) + '" x2="0" y2="' + (R - 3) + '"/>' : "") +
        (on && n.r > 1 ? '<circle class="bd" cx="' + R * 0.8 + '" cy="' + R * 0.8 + '" r="13"/><text class="bt" x="' + R * 0.8 + '" y="' + R * 0.8 + '">' + st.rank + "</text>" : "") +
        "</g>";
    });
    return '<div class="rt-mp"><h4>' + esc(title) + '</h4><svg viewBox="0 0 ' + W.toFixed(0) + " " + H.toFixed(0) + '" role="img" aria-label="' + esc(title) + '">' + edges + body + "</svg></div>";
  }

  function fallbackIcons(host) {
    host.addEventListener("error", function (ev) {
      var img = ev.target;
      if (!(img instanceof SVGImageElement)) return;
      var fb = img.getAttribute("data-fb");
      if (fb && img.getAttribute("href") !== fb) img.setAttribute("href", fb);
      else img.style.display = "none";
    }, true);
  }

  function drawBuild(host, build, spec, order) {
    var d = decode(build.code, spec, order);
    var grid = host.querySelector(".rt-mgrid"), stat = host.querySelector(".rt-mstat");
    if (!d.ok) {
      grid.innerHTML = '<p class="note" style="grid-column:1/-1">نمایش دیداری این بیلد ممکن نشد (دیتای ترتیب نودهای این اسپک هنوز اضافه نشده). کد import بالا را مستقیم در بازی بچسبان.</p>';
      stat.textContent = DEBUG ? "decode failed: spec " + d.specId + " / expected " + spec.specId + " / bits left " + d.left : "";
      return;
    }
    var cls = spec.nodes.filter(function (n) { return n.g === "class"; });
    var spc = spec.nodes.filter(function (n) { return n.g === "spec"; });
    var heroCount = {};
    spec.nodes.forEach(function (n) { if (n.g === "hero" && n.st != null && d.state[n.id]) heroCount[n.st] = (heroCount[n.st] || 0) + 1; });
    var hid = Object.keys(heroCount).sort(function (a, b) { return heroCount[b] - heroCount[a]; })[0];
    var hero = spec.nodes.filter(function (n) { return n.g === "hero" && n.st != null && String(n.st) === hid; });
    var hname = ((spec.heroes || []).filter(function (h) { return String(h.id) === hid; })[0] || {}).name || "Hero";
    function pts(list) { return list.reduce(function (a, n) { var s = d.state[n.id]; return a + (s && !s.free ? s.rank : 0); }, 0); }
    grid.innerHTML = panel("Class Talents", cls, d.state, "class") + panel("Hero · " + hname, hero, d.state, "hero") + panel("Spec Talents", spc, d.state, "spec");
    stat.innerHTML = "Class <b>" + pts(cls) + "</b> · Hero <b>" + pts(hero) + "</b> · Spec <b>" + pts(spc) + "</b>" + (DEBUG ? " · nodes " + Object.keys(d.state).length + " · bits left " + d.left : "");
    Array.prototype.forEach.call(host.querySelectorAll(".rt-mtabs button"), function (b) { b.classList.toggle("on", b.getAttribute("data-b") === String(build.i)); });
    host.querySelector(".rt-copy").setAttribute("data-code", build.code);
  }

  function uniq(list, key, label) {
    var seen = {}, out = [];
    list.forEach(function (b) { if (!seen[b[key]]) { seen[b[key]] = 1; out.push({ id: b[key], label: b[label] || b[key] }); } });
    return out;
  }

  function talentMap() {
    var sec = document.getElementById("talents");
    if (!sec || sec.querySelector(".rt-map")) return false;
    var anchor = null;
    Array.prototype.forEach.call(sec.querySelectorAll(".rt-cards"), function (c) { if (!anchor && c.querySelector(".rt-code")) anchor = c; });
    if (!anchor) return false;
    var slug = slugOf();
    Promise.all([fetch("data/retail/guides/" + slug + ".json").then(function (r) { return r.json(); }), extra()]).then(function (gx) {
      var g = gx[0], ex = gx[1] || {};
      var tal = g.sections.filter(function (s) { return s.id === "talents"; })[0];
      var bl = tal && tal.blocks.filter(function (b) { return b.t === "builds"; })[0];
      var src = ex.builds && ex.builds.length ? ex.builds : (bl ? bl.items : []);
      if (!src.length) return;
      var orderP = fetch("data/retail/node-order.json").then(function (r) { return r.json(); }).catch(function () { return {}; });
      var treeP = fetch("trees/" + g.class + ".json").then(function (r) { return r.json(); });
      return Promise.all([treeP, orderP]).then(function (res) {
        var tree = res[0], spec = tree.specs[(g.spec_no || 1) - 1], order = res[1][String(spec.specId)] || null;
        var builds = src.map(function (b, i) { var o = {}; for (var k in b) o[k] = b[k]; o.i = i; o.note = b.x; return o; });
        var multi = builds.some(function (b) { return b.hero && b.content; });
        var host = document.createElement("div");
        host.className = "rt-map";
        var head = "<h3>نقشهٔ تلنت‌های بیلد</h3>";
        var sel;
        if (multi) {
          var heroes = uniq(builds, "hero", "hero_label"), conts = uniq(builds, "content", "content_label");
          sel = '<div class="rt-sel"><div class="rt-selrow" data-k="hero"><span>Hero Tree</span>' + heroes.map(function (h) { return '<button type="button" data-v="' + esc(h.id) + '">' + esc(h.label) + "</button>"; }).join("") +
            '</div><div class="rt-selrow" data-k="content"><span>محتوا</span>' + conts.map(function (c) { return '<button type="button" data-v="' + esc(c.id) + '">' + esc(c.label) + "</button>"; }).join("") + "</div></div>" +
            '<p class="rt-bnote"></p><code class="rt-bcode"></code>';
        } else {
          sel = '<div class="rt-mtabs">' + builds.map(function (b) { return '<button type="button" data-b="' + b.i + '">' + esc(b.title) + (b.tag ? "<small>" + esc(b.tag) + "</small>" : "") + "</button>"; }).join("") + "</div>";
        }
        host.innerHTML = head + sel +
          '<div class="rt-mbar"><span class="rt-mstat"></span><button type="button" class="rt-copy" data-code="">کپی رشتهٔ import</button></div>' +
          '<div class="rt-mgrid"></div>' +
          '<p class="note"><i class="on"></i>روشن = در این بیلد گرفته می‌شود · <i class="off"></i>خاموش = گرفته نمی‌شود. موس را روی هر تلنت ببر تا توضیح فارسی‌اش را ببینی؛ عدد گوشهٔ آیکن = تعداد پوینتی که می‌گذاری.</p>';
        anchor.insertAdjacentElement("afterend", host);
        if (multi) anchor.style.display = "none";
        fallbackIcons(host);
        if (multi) {
          var cur = { hero: builds[0].hero, content: builds[0].content };
          var show = function () {
            var b = builds.filter(function (x) { return x.hero === cur.hero && x.content === cur.content; })[0] || builds.filter(function (x) { return x.hero === cur.hero; })[0] || builds[0];
            cur.hero = b.hero; cur.content = b.content;
            Array.prototype.forEach.call(host.querySelectorAll(".rt-selrow"), function (row) {
              var k = row.getAttribute("data-k");
              Array.prototype.forEach.call(row.querySelectorAll("button"), function (btn) {
                var v = btn.getAttribute("data-v");
                btn.classList.toggle("on", cur[k] === v);
                var has = builds.filter(function (x) { return k === "hero" ? (x.hero === v && x.rec) : (x.content === v && x.hero === cur.hero && x.rec); }).length;
                var tag = btn.querySelector("small");
                if (has && !tag) btn.insertAdjacentHTML("beforeend", "<small>★ پیشنهادی</small>");
                if (!has && tag) btn.removeChild(tag);
              });
            });
            host.querySelector(".rt-bnote").textContent = b.note || "";
            host.querySelector(".rt-bcode").textContent = b.code;
            drawBuild(host, b, spec, order);
          };
          host.querySelector(".rt-sel").addEventListener("click", function (e) {
            var btn = e.target.closest ? e.target.closest("button[data-v]") : null;
            if (!btn) return;
            cur[btn.parentNode.getAttribute("data-k")] = btn.getAttribute("data-v");
            show();
          });
          show();
        } else {
          host.querySelector(".rt-mtabs").addEventListener("click", function (e) {
            var b = e.target.closest ? e.target.closest("button[data-b]") : null;
            if (b) drawBuild(host, builds[Number(b.getAttribute("data-b"))], spec, order);
          });
          drawBuild(host, builds[0], spec, order);
        }
      });
    }).catch(function () { /* the map is a bonus: the cards above still work */ });
    return true;
  }

  function run() {
    ratings();
    dirs();
    drCard();
    if (!done && talentMap()) done = true;
  }
  if (window.MutationObserver) new MutationObserver(function () { run(); }).observe(rootEl, { childList: true });
  run();
})();
