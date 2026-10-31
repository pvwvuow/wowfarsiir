/* wowfarsi - Talent Tree search: finds talents/spells by name (or description),
   lists them, and puts a green halo around the matching nodes on the open tree.
   Needs talents.js (window.__tt) and talent-search.css. */
"use strict";
(function () {
  var CLASSES = [
    ["death-knight", "Death Knight"], ["demon-hunter", "Demon Hunter"], ["druid", "Druid"],
    ["evoker", "Evoker"], ["hunter", "Hunter"], ["mage", "Mage"], ["monk", "Monk"],
    ["paladin", "Paladin"], ["priest", "Priest"], ["rogue", "Rogue"], ["shaman", "Shaman"],
    ["warlock", "Warlock"], ["warrior", "Warrior"]
  ];
  var NS = "http://www.w3.org/2000/svg";

  /* ---------- pure helpers (also used by the tests) ---------- */
  function norm(s) {
    return String(s == null ? "" : s)
      .replace(/\|[cC][0-9A-Fa-f]{8}|\|[rR]/g, " ")
      .replace(/\$\{[^}]*\}|\$<[^>]*>|\$[@\w]+|[\[\]]/g, " ")
      .replace(/[\u200c\u200d\u064b-\u065f\u0670]/g, "")
      .replace(/\u064a/g, "\u06cc").replace(/\u0643/g, "\u06a9")
      .replace(/[\u06f0-\u06f9]/g, function (c) { return String(c.charCodeAt(0) - 0x06f0); })
      .replace(/[\u0660-\u0669]/g, function (c) { return String(c.charCodeAt(0) - 0x0660); })
      .toLowerCase().replace(/\s+/g, " ").trim();
  }

  function build(slug, data) {
    var out = [], seen = {};
    var cname = data.className || slug;
    (data.specs || []).forEach(function (spec, si) {
      (spec.nodes || []).forEach(function (node) {
        (node.en || []).forEach(function (e, ei) {
          if (!e || !e.n) return;
          var shared = node.g === "class"; // class nodes repeat in every spec
          var key = (shared ? "c" : si) + ":" + node.id + ":" + ei;
          if (seen[key]) return;
          seen[key] = 1;
          out.push({
            slug: slug, cls: cname, spec: si, specName: shared ? "" : (spec.specName || ""),
            node: node.id, g: node.g, name: e.n,
            n: norm(e.n), t: norm((e.d || "") + " " + (e.f || ""))
          });
        });
      });
    });
    return out;
  }

  /* names first; description matches are only used for the halo when no name matched */
  function search(list, q) {
    var toks = norm(q).split(" ").filter(Boolean);
    var names = [], desc = [];
    if (!toks.length) return { names: names, desc: desc };
    list.forEach(function (x) {
      if (toks.every(function (t) { return x.n.indexOf(t) >= 0; })) names.push(x);
      else if (toks.every(function (t) { return (x.n + " " + x.t).indexOf(t) >= 0; })) desc.push(x);
    });
    return { names: names, desc: desc };
  }

  window.__ttSearch = { norm: norm, build: build, search: search };

  /* ---------- UI (browser only) ---------- */
  var TT = window.__tt;
  if (!TT || typeof document === "undefined") return;

  var entries = {}, treeLoads = {};
  var mode = "class", query = "", res = { names: [], desc: [] };
  var hitIds = new Set(), focusId = null, seq = 0, listOpen = false;
  var el = {};

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fa(n) { return Number(n).toLocaleString("fa-IR"); }

  function getEntries(slug) {
    if (entries[slug]) return Promise.resolve(entries[slug]);
    if (treeLoads[slug]) return treeLoads[slug];
    var st = TT.state;
    var p;
    if (st && st.slug === slug && st.data && !st.loading) p = Promise.resolve(st.data);
    else p = fetch("trees/" + slug + ".json").then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
    treeLoads[slug] = p.then(function (d) { entries[slug] = build(slug, d); return entries[slug]; })
      .catch(function () { delete treeLoads[slug]; entries[slug] = []; return []; });
    return treeLoads[slug];
  }

  function currentHits() {
    var st = TT.state, ids = new Set();
    var pick = res.names.length ? res.names : res.desc;
    pick.forEach(function (x) {
      if (x.slug === st.slug && (x.g === "class" || x.spec === st.specIdx)) ids.add(x.node);
    });
    return ids;
  }

  function ensureGlow(svg) {
    if (svg.querySelector("#tts-glow")) return;
    var defs = svg.querySelector("defs");
    if (!defs) { defs = document.createElementNS(NS, "defs"); svg.insertBefore(defs, svg.firstChild); }
    var f = document.createElementNS(NS, "filter");
    f.setAttribute("id", "tts-glow");
    f.setAttribute("x", "-60%"); f.setAttribute("y", "-60%");
    f.setAttribute("width", "220%"); f.setAttribute("height", "220%");
    var b = document.createElementNS(NS, "feGaussianBlur");
    b.setAttribute("stdDeviation", "0.11");
    f.appendChild(b);
    defs.appendChild(f);
  }

  function applyHalo() {
    var canvas = el.canvas;
    if (!canvas) return;
    var svg = canvas.querySelector("svg");
    if (!svg) return;
    hitIds = currentHits();
    Array.prototype.forEach.call(svg.querySelectorAll(".tts-halo"), function (n) { n.parentNode.removeChild(n); });
    canvas.classList.toggle("tts-on", hitIds.size > 0);
    if (hitIds.size) ensureGlow(svg);
    Array.prototype.forEach.call(svg.querySelectorAll(".tt-node"), function (g) {
      var id = Number(g.getAttribute("data-node"));
      var hit = hitIds.has(id);
      g.classList.toggle("tt-hit", hit);
      if (!hit) return;
      var glow = document.createElementNS(NS, "circle");
      glow.setAttribute("class", "tts-halo tts-halo-glow");
      glow.setAttribute("r", "0.42");
      glow.setAttribute("filter", "url(#tts-glow)");
      var ring = document.createElementNS(NS, "circle");
      ring.setAttribute("class", "tts-halo tts-halo-ring" + (id === focusId ? " tts-focus" : ""));
      ring.setAttribute("r", "0.4");
      g.insertBefore(ring, g.firstChild);
      g.insertBefore(glow, g.firstChild);
    });
  }

  function renderList() {
    var names = res.names, desc = res.desc;
    var shownDesc = names.length ? [] : desc;
    var items = names.slice(0, 40).map(function (x) { return { x: x, d: false }; })
      .concat(shownDesc.slice(0, 20).map(function (x) { return { x: x, d: true }; }));
    var total = names.length || desc.length;
    if (!query.trim()) {
      el.count.textContent = "";
    } else if (!total) {
      el.count.textContent = "چیزی پیدا نشد" + (mode === "class" ? " — «همهٔ کلاس‌ها» را هم امتحان کن" : "");
    } else {
      var here = hitIds.size;
      el.count.textContent = fa(total) + " مورد پیدا شد" + (here ? " · " + fa(here) + " مورد روی درخت باز، با هالهٔ سبز" : " · روی این اسپک نیست؛ از فهرست انتخاب کن");
    }
    el.list.innerHTML = items.map(function (it, i) {
      var x = it.x;
      var meta = x.cls + (x.specName ? " · " + x.specName : "");
      return '<li data-i="' + i + '" role="option"><b dir="ltr">' + esc(x.name) + '</b>' +
        '<span class="tts-meta" dir="ltr">' + esc(meta) + '</span>' +
        (it.d ? '<span class="tts-badge">در توضیح</span>' : "") + "</li>";
    }).join("");
    el.items = items;
    el.list.hidden = !(listOpen && items.length);
    el.clear.hidden = !query;
  }

  function refresh() {
    var my = ++seq;
    if (!query.trim()) {
      res = { names: [], desc: [] };
      applyHalo(); renderList();
      return Promise.resolve();
    }
    var slugs = mode === "all" ? CLASSES.map(function (c) { return c[0]; }) : [TT.state.slug];
    var needLoad = slugs.some(function (s) { return !entries[s]; });
    if (needLoad) el.count.textContent = "در حال بارگذاری…";
    return Promise.all(slugs.map(getEntries)).then(function (lists) {
      if (my !== seq) return;
      var all = [].concat.apply([], lists);
      res = search(all, query);
      applyHalo(); renderList();
    });
  }

  function waitFor(cond, ms) {
    return new Promise(function (resolve) {
      var t0 = Date.now();
      (function tick() {
        if (cond() || Date.now() - t0 > (ms || 6000)) return resolve();
        setTimeout(tick, 80);
      })();
    });
  }

  function go(item) {
    var st = TT.state;
    focusId = item.node;
    listOpen = false;
    var p = Promise.resolve();
    if (item.slug !== st.slug) {
      TT.switchClass(item.slug);
      p = waitFor(function () { return TT.state.slug === item.slug && !TT.state.loading && TT.state.data; });
    }
    p.then(function () {
      if (item.g !== "class" && item.spec !== TT.state.specIdx) {
        TT.switchSpec(item.spec);
        return waitFor(function () { return TT.state.specIdx === item.spec; });
      }
    }).then(function () {
      refresh();
      if (el.canvas && el.canvas.scrollIntoView) el.canvas.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }

  function mount() {
    el.canvas = document.getElementById("tt-canvas");
    var frame = document.querySelector(".tt-frame");
    if (!el.canvas || !frame || !frame.parentNode) return;
    var box = document.createElement("div");
    box.className = "tts";
    box.innerHTML =
      '<div class="tts-row">' +
      '<label class="tts-input"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
      '<input id="tts-input" type="text" dir="auto" autocomplete="off" spellcheck="false" placeholder="جست\u200cوجوی تلنت یا اسپل… (مثلاً Fade یا شیلد)" aria-label="جست\u200cوجوی تلنت یا اسپل">' +
      '<button type="button" class="tts-clear" aria-label="پاک کردن" hidden>\u00d7</button></label>' +
      '<label class="tts-all"><input type="checkbox" id="tts-all"> همهٔ کلاس\u200cها</label>' +
      '</div>' +
      '<p class="tts-count" aria-live="polite"></p>' +
      '<ul class="tts-list" role="listbox" hidden></ul>';
    frame.parentNode.insertBefore(box, frame);
    el.box = box;
    el.input = box.querySelector("#tts-input");
    el.all = box.querySelector("#tts-all");
    el.clear = box.querySelector(".tts-clear");
    el.count = box.querySelector(".tts-count");
    el.list = box.querySelector(".tts-list");

    var timer = null;
    el.input.addEventListener("input", function () {
      query = el.input.value; focusId = null; listOpen = true;
      clearTimeout(timer);
      timer = setTimeout(refresh, 140);
    });
    el.input.addEventListener("focus", function () { listOpen = true; renderList(); });
    el.input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && el.items && el.items.length) { e.preventDefault(); go(el.items[0].x); }
      else if (e.key === "Escape") { listOpen = false; renderList(); el.input.blur(); }
    });
    el.clear.addEventListener("click", function () {
      el.input.value = ""; query = ""; focusId = null; refresh(); el.input.focus();
    });
    el.all.addEventListener("change", function () { mode = el.all.checked ? "all" : "class"; focusId = null; refresh(); });
    el.list.addEventListener("mousedown", function (e) { e.preventDefault(); }); // keep focus until click lands
    el.list.addEventListener("click", function (e) {
      var li = e.target.closest ? e.target.closest("li") : null;
      if (!li || !el.items) return;
      var it = el.items[Number(li.getAttribute("data-i"))];
      if (it) go(it.x);
    });
    document.addEventListener("click", function (e) {
      if (!el.box.contains(e.target)) { listOpen = false; renderList(); }
    });

    // the canvas is rebuilt on every class/spec switch: redo the halo (and the hit count) each time
    var raf = 0;
    new MutationObserver(function () {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = 0; if (query.trim()) refresh(); else applyHalo(); });
    }).observe(el.canvas, { childList: true });
  }

  ready(mount);
})();
