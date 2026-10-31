/* wowfarsi - item/decor cards: rarity colour + big preview image, built from news.json items[] */
"use strict";
(function () {
  var onStatic = /[/]news[/][0-9]+-[^/]*[.]html$/.test(location.pathname);
  var base = onStatic ? "../" : "";
  var id = onStatic ? (location.pathname.match(/[/]news[/]([0-9]+)-/) || [])[1]
                    : new URLSearchParams(location.search).get("id");
  if (!id) return;

  var SOURCES = [
    "https://pvwvuow.github.io/wowheadFA/news.json",
    "https://raw.githubusercontent.com/pvwvuow/wowheadFA/main/docs/news.json"
  ];
  var QN = ["poor", "common", "uncommon", "rare", "epic", "legendary", "artifact", "heirloom", "token"];
  var QFA = {
    poor: "\u0636\u0639\u06cc\u0641",
    common: "\u0645\u0639\u0645\u0648\u0644\u06cc",
    uncommon: "\u063a\u06cc\u0631\u0645\u0639\u0645\u0648\u0644",
    rare: "\u06a9\u0645\u06cc\u0627\u0628",
    epic: "\u062d\u0645\u0627\u0633\u06cc",
    legendary: "\u0627\u0641\u0633\u0627\u0646\u0647\u200c\u0627\u06cc",
    artifact: "\u0622\u0631\u062a\u06cc\u0641\u06a9\u062a",
    heirloom: "\u0645\u06cc\u0631\u0627\u062b\u06cc",
    token: "\u062a\u0648\u06a9\u0646"
  };
  var TITLE = "\u0622\u06cc\u062a\u0645\u200c\u0647\u0627 \u0648 \u062c\u0632\u06cc\u06cc\u0627\u062a";
  var BUDGET = "\u0638\u0631\u0641\u06cc\u062a \u062f\u06a9\u0648\u0631";
  var FAD = "\u06f0\u06f1\u06f2\u06f3\u06f4\u06f5\u06f6\u06f7\u06f8\u06f9";
  var SIGIL = '<svg class="ic-sigil" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6 58 32 32 58 6 32Z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M32 18 46 32 32 46 18 32Z" fill="currentColor" opacity=".35"/><circle cx="32" cy="32" r="3" fill="currentColor"/></svg>';

  if (!document.querySelector('link[href*="items.css"]')) {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = base + "assets/css/items.css?v=20261026a";
    document.head.appendChild(l);
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function normQ(v) {
    if (v == null || v === "") return "";
    var s = String(v).toLowerCase();
    if (/^q[0-9]+$/.test(s)) s = s.slice(1);
    if (/^[0-9]+$/.test(s)) return QN[+s] || "";
    return QFA[s] ? s : "";
  }
  function okImg(u) {
    u = String(u || "");
    return u.indexOf("https://wow.zamimg.com/") === 0 && u.indexOf('"') < 0 ? u : "";
  }
  function val(v) {
    v = String(v);
    var latin = /[A-Za-z]/.test(v), arabic = /[\u0600-\u06FF]/.test(v);
    return latin && !arabic ? '<span class="ltr">' + esc(v) + "</span>" : esc(v);
  }
  function chips(spec) {
    var out = [];
    spec.forEach(function (s) {
      s = String(s).trim();
      var m = s.match(/^([0-9]+)[ ]+([+][0-9].*)$/);
      if (m) {
        out.push('<span class="ic-chip"><b>' + m[1].replace(/[0-9]/g, function (d) { return FAD.charAt(+d); }) + "</b> " + BUDGET + "</span>");
        out.push('<span class="ic-chip ltr">' + esc(m[2]) + "</span>");
      } else if (s) {
        out.push('<span class="ic-chip ltr">' + esc(s) + "</span>");
      }
    });
    return out.join("");
  }
  function itemsHTML(list) {
    var cards = [];
    list.forEach(function (blk) {
      var it = (blk && blk.item) || {};
      var name = it.name || "", rows = it.rows || [], spec = it.spec || [];
      if (!name && !rows.length && !spec.length) return;
      var q = normQ(it.quality);
      var img = okImg(it.image) || okImg(it.icon);
      var media = img
        ? '<img src="' + esc(img) + '" alt="' + esc(name) + '" width="172" height="172" loading="lazy" decoding="async" onerror="this.style.visibility=&quot;hidden&quot;">'
        : SIGIL;
      var pill = q ? '<span class="ic-rar">' + QFA[q] + "</span>" : "";
      var rowsHtml = rows.map(function (r) {
        return "<dt>" + esc(r[0]) + ":</dt><dd>" + val(r[1]) + "</dd>";
      }).join("");
      var sp = chips(spec);
      cards.push('<div class="ic' + (q ? " q-" + q : "") + '"><div class="ic-media">' + media + "</div>" +
        '<div class="ic-body"><div class="ic-head"><h3 class="ic-name" dir="ltr">' + esc(name) + "</h3>" + pill + "</div>" +
        '<div class="ic-orn"></div><dl class="ic-rows">' + rowsHtml + "</dl>" +
        (sp ? '<div class="ic-spec">' + sp + "</div>" : "") + "</div></div>");
    });
    return cards.length ? '<section class="ic-wrap"><div class="ic-title">' + TITLE + "</div>" + cards.join("") + "</section>" : "";
  }

  function place(html) {
    var body = document.querySelector(".ar-body");
    if (!body) return false;
    if (body.querySelector(".ic-wrap")) return true;
    Array.prototype.forEach.call(body.querySelectorAll(".ar-items-title,.item-card"), function (n) {
      n.parentNode.removeChild(n);
    });
    body.insertAdjacentHTML("beforeend", html);
    return true;
  }

  function load(i) {
    if (i >= SOURCES.length) return Promise.reject(new Error("no source"));
    return fetch(SOURCES[i] + "?t=" + Date.now(), { cache: "no-store" }).then(function (r) {
      return r.ok ? r.json() : Promise.reject(new Error("http"));
    }).then(function (j) {
      return Array.isArray(j.published) ? j : Promise.reject(new Error("shape"));
    }).catch(function () { return load(i + 1); });
  }

  load(0).then(function (data) {
    var a = null;
    for (var k = 0; k < data.published.length; k++) {
      if (String(data.published[k].id) === String(id)) { a = data.published[k]; break; }
    }
    if (!a || !a.items || !a.items.length) return;
    var html = itemsHTML(a.items);
    if (!html || place(html)) return;
    if (!window.MutationObserver) return;
    var mo = new MutationObserver(function () { if (place(html)) mo.disconnect(); });
    mo.observe(document.getElementById("ar-root") || document.body, { childList: true, subtree: true });
  }).catch(function () { /* keep the plain cards */ });
})();
