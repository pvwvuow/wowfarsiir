/* forever-market.js: the Forever market & professions page (forever-market.html).
   Data layer (written by tools/wowgg_sync.py, synced every 6 h from the public wow.gg API):
     data/forever/market/index.json      {base, slugs, meta{slug:{canonical_url,updated,rows,fields}}, history[dates]}
     data/forever/market/{slug}.json     {slug, source, canonical_url, updated, fields, rows[{id,name,price,qty,cat,rank,cost,x}]}
     data/forever/market/names.json      {items{id:[en,fa]}, prof{en:fa}}
     data/forever/i18n/market-fa.json    {texts{en:fa}}          (pack kind: market-text)
   Everything is optional: without data the page shows an empty state and still
   shows the "Source: wow.gg" attribution (CC BY 4.0). */
(function () {
  "use strict";
  var V = "20261102a";
  var OUT = "data/forever/market/";

  function jget(url) {
    return fetch(url + "?v=" + V).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status + " " + url);
      return r.json();
    });
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function num(n) { // Latin digits with thousand separators
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /* ---- money: copper -> gold/silver/copper with icons ---- */
  function money(c) {
    if (c == null) return '<span class="fm-trend-flat">—</span>';
    c = Math.round(c);
    var g = Math.floor(c / 10000), s = Math.floor((c % 10000) / 100), p = c % 100, out = "";
    if (g) out += '<span class="m"><i class="fm-coin fm-g"></i>' + num(g) + "</span>";
    if (s || (g && p)) out += '<span class="m"><i class="fm-coin fm-s"></i>' + num(s) + "</span>";
    if (p || (!g && !s)) out += '<span class="m"><i class="fm-coin fm-c"></i>' + num(p) + "</span>";
    return '<span class="fm-money">' + out + "</span>";
  }

  function median(a) {
    if (!a.length) return null;
    var s = a.slice().sort(function (x, y) { return x - y; });
    return s[Math.floor(s.length / 2)];
  }
  function pct(from, to) {
    if (!from || from === to) return null;
    return Math.round((to - from) * 1000 / from) / 10;
  }
  function trendHtml(p) {
    if (p == null) return '<span class="fm-trend-flat">—</span>';
    var cls = p > 0 ? "fm-trend-up" : (p < 0 ? "fm-trend-down" : "fm-trend-flat");
    var arrow = p > 0 ? "▲" : (p < 0 ? "▼" : "＝");
    return '<span class="' + cls + '">' + arrow + " " + Math.abs(p) + "٪</span>";
  }

  /* ---- tabs ---- */
  function tabs() {
    var t1 = document.getElementById("tab-market"), t2 = document.getElementById("tab-prof");
    var p1 = document.getElementById("panel-market"), p2 = document.getElementById("panel-prof");
    function sel(on1) {
      t1.classList.toggle("is-active", on1); t2.classList.toggle("is-active", !on1);
      t1.setAttribute("aria-selected", on1); t2.setAttribute("aria-selected", !on1);
      p1.hidden = !on1; p2.hidden = on1;
    }
    t1.addEventListener("click", function () { sel(true); });
    t2.addEventListener("click", function () { sel(false); });
  }

  var S = {
    idx: null, names: { items: {}, prof: {} }, tx: {},
    items: [],   // grouped market rows: {id, en, fa, cat, min, med, qty}
    profs: [],   // prof rows: {name, cat, rank, cost, price}
    hist: {}     // id -> [{day, med}]
  };

  function tx(s) { return S.tx[s] || S.names.prof[s] || s; }
  function itemName(id, fallback) {
    var r = S.names.items[String(id)];
    if (r && r[1]) return r[1];
    if (r && r[0]) return r[0];
    return fallback || ("#" + id);
  }
  function itemEn(id) {
    var r = S.names.items[String(id)];
    return (r && r[0]) || "";
  }

  function load() {
    var strip = document.getElementById("fm-strip");
    strip.innerHTML = "در حال بارگذاری…";
    return jget(OUT + "index.json").then(function (idx) {
      S.idx = idx;
      var jobs = idx.slugs.map(function (slug) {
        return jget(OUT + slug + ".json").catch(function () { return null; });
      });
      return Promise.all(jobs).then(function (dumps) {
        var opt = [jget(OUT + "names.json").catch(function () { return null; }),
                   jget("data/forever/i18n/market-fa.json").catch(function () { return null; })];
        return Promise.all(opt).then(function (o) {
          if (o[0]) S.names = o[0];
          if (o[1] && o[1].texts) S.tx = o[1].texts;
          dumps.forEach(function (d) { if (d) ingest(d); });
          return loadHistory();
        });
      });
    });
  }

  function ingest(d) {
    var isProf = /prof|recipe/i.test(d.slug || "");
    d.rows.forEach(function (r) {
      if (isProf) {
        if (!r.name) return;
        S.profs.push({ name: tx(r.name) === r.name ? r.name : tx(r.name),
                       cat: r.cat ? tx(r.cat) : "", rank: r.rank, cost: r.cost, price: r.price });
      } else if (r.id != null) {
        S.items.push({ id: r.id, name: r.name || "", cat: r.cat ? tx(r.cat) : "",
                       price: r.price, qty: r.qty });
      }
    });
  }

  function loadHistory() {
    var days = (S.idx.history || []).slice(-35);
    var slugs = (S.idx.slugs || []).filter(function (s) { return !/prof|recipe/i.test(s); });
    var jobs = [];
    days.forEach(function (day) {
      slugs.forEach(function (slug) {
        jobs.push(jget(OUT + "history/" + day + "/" + slug + ".json")
          .then(function (h) {
            Object.keys(h.items || {}).forEach(function (id) {
              var rec = h.items[id];
              if (!S.hist[id]) S.hist[id] = [];
              S.hist[id].push({ day: day, med: rec[0] });
            });
          }).catch(function () {}));
      });
    });
    return Promise.all(jobs);
  }

  /* ---- group market rows per item: min / median / qty ---- */
  function groupItems() {
    var by = {};
    S.items.forEach(function (r) {
      var g = by[r.id] || (by[r.id] = { id: r.id, cat: r.cat, prices: [], qty: 0 });
      if (r.price != null) g.prices.push(r.price);
      if (r.qty) g.qty += r.qty;
      if (r.cat && !g.cat) g.cat = r.cat;
    });
    return Object.keys(by).map(function (k) {
      var g = by[k];
      g.min = g.prices.length ? Math.min.apply(null, g.prices) : null;
      g.med = median(g.prices);
      var h = (S.hist[String(g.id)] || []).slice().sort(function (a, b) { return a.day < b.day ? -1 : 1; });
      g.med7 = pct(pickPast(h, 7), g.med);
      g.med30 = pct(pickPast(h, 30), g.med);
      g.deal = (g.min != null && g.med && g.min < g.med * 0.7) ? Math.round((1 - g.min / g.med) * 100) : null;
      return g;
    }).filter(function (g) { return g.min != null || g.med != null || g.qty; });
  }
  function pickPast(h, nDays) {
    if (!h || h.length < 2) return null;
    var last = h[h.length - 1];
    for (var i = h.length - 2; i >= 0; i--) {
      var d = (new Date(last.day) - new Date(h[i].day)) / 86400000;
      if (d >= nDays) return h[i].med;
    }
    return h[0].med; // oldest known point inside the window
  }

  /* ---- market tab ---- */
  function fillCat(selId, cats) {
    var sel = document.getElementById(selId);
    sel.innerHTML = '<option value="">همه</option>' + cats.map(function (c) {
      return '<option value="' + esc(c) + '">' + esc(c || "بدون دسته") + "</option>";
    }).join("");
  }
  function renderMarket() {
    var rows = groupItems();
    var cats = {};
    rows.forEach(function (g) { if (g.cat) cats[g.cat] = 1; });
    fillCat("fm-cat", Object.keys(cats).sort());
    var q = document.getElementById("fm-q").value.trim().toLowerCase();
    var cat = document.getElementById("fm-cat").value;
    var min = parseFloat(document.getElementById("fm-min").value) || 0;
    var sort = document.getElementById("fm-sort").value;
    var list = rows.filter(function (g) {
      var en = itemEn(g.id);
      if (q && (itemName(g.id).toLowerCase().indexOf(q) < 0 && en.toLowerCase().indexOf(q) < 0 &&
                String(g.id).indexOf(q) < 0)) return false;
      if (cat && g.cat !== cat) return false;
      if (min && ((g.med || 0) < min * 10000 && (g.min || 0) < min * 10000)) return false;
      return true;
    });
    list.sort(function (a, b) {
      if (sort === "name") return itemName(a.id).localeCompare(itemName(b.id), "fa");
      if (sort === "median-asc") return (a.med || 0) - (b.med || 0);
      if (sort === "median-desc") return (b.med || 0) - (a.med || 0);
      return (a.deal || 0) - (b.deal || 0) || (b.med || 0) - (a.med || 0);
    });
    var tb = document.getElementById("fm-rows");
    tb.innerHTML = list.map(function (g) {
      return "<tr>" +
        '<td><a class="fm-name fm-itemlink" href="item.html?ver=forever&id=' + encodeURIComponent(g.id) + '">' +
        esc(itemName(g.id)) + "</a>" +
        (g.deal != null ? '<span class="fm-deal">' + g.deal + "٪ زیر میانه</span>" : "") +
        (itemEn(g.id) && itemEn(g.id) !== itemName(g.id) ? '<span class="fm-en">' + esc(itemEn(g.id)) + "</span>" : "") +
        "</td>" +
        "<td>" + (g.cat ? '<span class="fm-cat">' + esc(g.cat) + "</span>" : "—") + "</td>" +
        '<td class="num">' + money(g.min) + "</td>" +
        '<td class="num">' + money(g.med) + "</td>" +
        '<td class="num">' + (g.qty ? num(g.qty) : "—") + "</td>" +
        "<td>" + trendHtml(g.med7) + "</td>" +
        "<td>" + trendHtml(g.med30) + "</td></tr>";
    }).join("");
    document.getElementById("fm-empty").hidden = list.length > 0;
    var meds = rows.map(function (g) { return g.med; }).filter(function (x) { return x != null; });
    document.getElementById("fm-strip").innerHTML = "<b>" + num(list.length) + "</b> آیتم نمایش‌داده‌شده از <b>" + num(rows.length) +
      "</b> · میانهٔ کل بازار: " + money(meds.length ? median(meds) : null);
  }

  /* ---- professions tab ---- */
  function renderProf() {
    var cats = {};
    S.profs.forEach(function (r) { if (r.cat) cats[r.cat] = 1; });
    fillCat("fp-cat", Object.keys(cats).sort());
    var q = document.getElementById("fp-q").value.trim().toLowerCase();
    var cat = document.getElementById("fp-cat").value;
    var onlyProfit = document.getElementById("fp-profit").checked;
    var sort = document.getElementById("fp-sort").value;
    var list = S.profs.filter(function (r) {
      if (q && r.name.toLowerCase().indexOf(q) < 0 && String(r.rank || "").indexOf(q) < 0) return false;
      if (cat && r.cat !== cat) return false;
      if (onlyProfit && !(r.price != null && r.cost != null && r.price - r.cost > 0)) return false;
      return true;
    });
    list.sort(function (a, b) {
      if (sort === "name") return a.name.localeCompare(b.name, "fa");
      if (sort === "cost-asc") return (a.cost || 0) - (b.cost || 0);
      return (b.price - b.cost || 0) - (a.price - a.cost || 0);
    });
    var tb = document.getElementById("fp-rows");
    tb.innerHTML = list.map(function (r) {
      var profit = (r.price != null && r.cost != null) ? r.price - r.cost : null;
      var pc = profit != null && r.cost ? Math.round(profit * 100 / r.cost) : null;
      return "<tr>" +
        '<td><span class="fm-name">' + esc(r.name) + "</span></td>" +
        "<td>" + (r.cat ? '<span class="fm-cat">' + esc(r.cat) + "</span>" : "—") + "</td>" +
        '<td class="num">' + (r.rank != null ? num(r.rank) : "—") + "</td>" +
        '<td class="num">' + money(r.cost) + "</td>" +
        '<td class="num">' + money(r.price) + "</td>" +
        '<td class="num ' + (profit > 0 ? "fm-profit-pos" : (profit < 0 ? "fm-profit-neg" : "fm-trend-flat")) + '">' +
        money(profit) + (pc != null ? ' <small>(' + (pc > 0 ? "+" : "") + pc + "٪)</small>" : "") + "</td></tr>";
    }).join("");
    document.getElementById("fp-empty").hidden = list.length > 0;
    document.getElementById("fp-strip").innerHTML = "<b>" + num(list.length) + "</b> دستور از <b>" +
      num(S.profs.length) + "</b>";
  }

  /* ---- source footer (CC BY 4.0: visible attribution is required) ---- */
  function source() {
    var el = document.getElementById("fm-src");
    var meta = (S.idx && S.idx.meta) || {};
    var parts = Object.keys(meta).map(function (slug) {
      var m = meta[slug];
      return '<a href="' + esc(m.canonical_url) + '" target="_blank" rel="noreferrer">' + esc(slug) +
        "</a> · به‌روزرسانی: " + esc(m.updated || "—");
    });
    if (!parts.length) parts = ['<a href="https://wow.gg/developers" target="_blank" rel="noreferrer">wow.gg</a>'];
    el.innerHTML = "داده‌های مارکت این صفحه از " + parts.join(" · ") +
      ' <span dir="ltr">(CC BY 4.0)</span> گردآوری شده است.';
  }

  function bind(selId, fn) {
    document.getElementById(selId).addEventListener("input", fn);
    document.getElementById(selId).addEventListener("change", fn);
  }

  function boot() {
    tabs();
    bind("fm-q", renderMarket); bind("fm-cat", renderMarket); bind("fm-min", renderMarket); bind("fm-sort", renderMarket);
    bind("fp-q", renderProf); bind("fp-cat", renderProf); bind("fp-profit", renderProf); bind("fp-sort", renderProf);
    load().then(function () {
      try { renderMarket(); } catch (e) { console.error("market render:", e); }
      try { renderProf(); } catch (e) { console.error("prof render:", e); }
      try { source(); } catch (e) { console.error("source:", e); }
    }).catch(function (e) {
      console.error("market load:", e);
      document.getElementById("fm-strip").innerHTML = "";
      document.getElementById("fm-empty").hidden = false;
      document.getElementById("fp-empty").hidden = false;
      document.getElementById("fm-src").innerHTML =
        'داده‌های مارکت این صفحه از <a href="https://wow.gg/developers" target="_blank" rel="noreferrer">wow.gg</a>' +
        ' <span dir="ltr">(CC BY 4.0)</span> گردآوری شده است.';
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
