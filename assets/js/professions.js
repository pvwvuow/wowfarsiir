/* wowfarsi - Forever professions: hub (professions.html) + detail (profession.html?p=slug).
   Data: data/forever/db/prof-index.json and prof-<slug>.json (see docs/PROFESSIONS_DATA.md). Icons: icons/large/<name>.jpg
   Every UI string is Persian via \u escapes; names follow data/forever/glossary.json. Item/recipe names show Persian when the data has it, else English. */
"use strict";
(function () {
  var FA = {"hubTitle": "\u067e\u0631\u0648\u0641\u0634\u0646\u200c\u0647\u0627", "hubSub": "\u0647\u0645\u0647\u0654 \u067e\u0631\u0648\u0641\u0634\u0646\u200c\u0647\u0627\u06cc \u0641\u0648\u0631\u0648\u0631: \u062f\u0633\u062a\u0648\u0631\u0627\u0644\u0639\u0645\u0644\u200c\u0647\u0627\u060c \u0645\u0648\u0627\u062f\u060c \u0622\u06cc\u062a\u0645\u200c\u0647\u0627 \u0648 \u0645\u0633\u06cc\u0631 \u0644\u0650\u0648\u0650\u0644\u200c\u0622\u067e\u060c \u0628\u0627 \u0622\u06cc\u06a9\u0648\u0646", "hubHint": "\u06cc\u06a9 \u067e\u0631\u0648\u0641\u0634\u0646 \u0631\u0627 \u0627\u0646\u062a\u062e\u0627\u0628 \u06a9\u0646 \u062a\u0627 \u062f\u0633\u062a\u0648\u0631\u0627\u0644\u0639\u0645\u0644\u200c\u0647\u0627 \u0648 \u0645\u0648\u0627\u062f \u0648 \u0645\u0633\u06cc\u0631 \u0627\u0631\u062a\u0642\u0627\u06cc\u0634 \u0631\u0627 \u0628\u0628\u06cc\u0646\u06cc.", "crafting": "\u067e\u0631\u0648\u0641\u0634\u0646\u200c\u0647\u0627\u06cc \u0633\u0627\u062e\u062a", "gathering": "\u062c\u0645\u0639\u200c\u0622\u0648\u0631\u06cc", "secondary": "\u0641\u0631\u0639\u06cc", "recipes": "\u062f\u0633\u062a\u0648\u0631\u0627\u0644\u0639\u0645\u0644\u200c\u0647\u0627", "leveling": "\u0645\u0633\u06cc\u0631 \u0644\u0650\u0648\u0650\u0644\u200c\u0622\u067e", "sources": "\u0645\u0646\u0627\u0628\u0639 \u0648 \u0646\u0648\u062f\u0647\u0627", "trainers": "\u0645\u0631\u0628\u06cc\u200c\u0647\u0627", "search": "\u062c\u0633\u062a\u200c\u0648\u062c\u0648\u06cc \u062f\u0633\u062a\u0648\u0631\u0627\u0644\u0639\u0645\u0644\u060c \u0622\u06cc\u062a\u0645 \u06cc\u0627 \u0645\u0627\u062f\u0647\u2026", "all": "\u0647\u0645\u0647", "rank": "\u0631\u0646\u06a9", "source": "\u0645\u0646\u0628\u0639", "quality": "\u06a9\u06cc\u0641\u06cc\u062a", "sort": "\u0645\u0631\u062a\u0628\u200c\u0633\u0627\u0632\u06cc", "sortSkill": "\u0645\u0647\u0627\u0631\u062a", "sortName": "\u0646\u0627\u0645", "sortQ": "\u06a9\u06cc\u0641\u06cc\u062a", "grid": "\u06a9\u0627\u0631\u062a", "table": "\u062c\u062f\u0648\u0644", "trainer": "\u0645\u0631\u0628\u06cc", "vendor": "\u0641\u0631\u0648\u0634\u0646\u062f\u0647", "drop": "\u062f\u0631\u0627\u067e", "quest": "\u06a9\u0648\u0626\u0633\u062a", "world": "\u062f\u0646\u06cc\u0627\u06cc \u0628\u0627\u0632\u06cc", "discovery": "\u06a9\u0634\u0641", "unknown": "\u0646\u0627\u0645\u0634\u062e\u0635", "r1": "\u0634\u0627\u06af\u0631\u062f", "r2": "\u06a9\u0627\u0631\u062f\u0627\u0646", "r3": "\u0645\u0627\u0647\u0631", "r4": "\u0627\u0633\u062a\u0627\u062f", "cOrange": "\u0646\u0627\u0631\u0646\u062c\u06cc: \u0627\u0631\u062a\u0642\u0627\u06cc \u062a\u0636\u0645\u06cc\u0646\u06cc", "cYellow": "\u0632\u0631\u062f: \u0627\u062d\u062a\u0645\u0627\u0644 \u0628\u0627\u0644\u0627", "cGreen": "\u0633\u0628\u0632: \u0627\u062d\u062a\u0645\u0627\u0644 \u06a9\u0645", "cGray": "\u062e\u0627\u06a9\u0633\u062a\u0631\u06cc: \u0628\u062f\u0648\u0646 \u0627\u0631\u062a\u0642\u0627", "recipeWord": "\u062f\u0633\u062a\u0648\u0631\u0627\u0644\u0639\u0645\u0644", "back": "\u0628\u0627\u0632\u06af\u0634\u062a \u0628\u0647 \u067e\u0631\u0648\u0641\u0634\u0646\u200c\u0647\u0627", "loading": "\u062f\u0631 \u062d\u0627\u0644 \u0628\u0627\u0631\u06af\u0630\u0627\u0631\u06cc\u2026", "noData": "\u062f\u06cc\u062a\u0627\u06cc \u0627\u06cc\u0646 \u067e\u0631\u0648\u0641\u0634\u0646 \u0647\u0646\u0648\u0632 \u0631\u0648\u06cc \u0633\u0627\u06cc\u062a \u0646\u06cc\u0627\u0645\u062f\u0647. \u0628\u0647\u200c\u0632\u0648\u062f\u06cc.", "none": "\u0686\u06cc\u0632\u06cc \u067e\u06cc\u062f\u0627 \u0646\u0634\u062f.", "curSkill": "\u0645\u0647\u0627\u0631\u062a \u0641\u0639\u0644\u06cc", "goal": "\u0647\u062f\u0641", "plan": "\u0633\u0627\u062e\u062a \u0645\u0633\u06cc\u0631", "craft": "\u0628\u0633\u0627\u0632", "from": "\u0627\u0632", "to": "\u062a\u0627", "total": "\u0645\u0648\u0627\u062f \u0644\u0627\u0632\u0645 (\u062c\u0645\u0639 \u06a9\u0644)", "levelNote": "\u0645\u0633\u06cc\u0631 \u0628\u0631 \u067e\u0627\u06cc\u0647\u0654 \u0645\u0648\u0627\u062f \u0627\u0633\u062a\u060c \u0646\u0647 \u0642\u06cc\u0645\u062a. \u062f\u0631 \u0628\u0627\u0632\u0647\u0654 \u0632\u0631\u062f \u06af\u0627\u0647\u06cc \u0686\u0646\u062f \u0628\u0627\u0631 \u0628\u06cc\u0634\u062a\u0631 \u0644\u0627\u0632\u0645 \u0645\u06cc\u200c\u0634\u0648\u062f.", "credit": "\u062f\u0627\u062f\u0647 \u0627\u0632 ForeverDB.net", "build": "\u0628\u06cc\u0644\u062f", "needSkill": "\u0646\u06cc\u0627\u0632 \u0628\u0647 \u0645\u0647\u0627\u0631\u062a", "reagents": "\u0645\u0648\u0627\u062f \u0644\u0627\u0632\u0645", "creates": "\u0645\u06cc\u200c\u0633\u0627\u0632\u062f", "zones": "\u0632\u0648\u0646\u200c\u0647\u0627", "skillNeeded": "\u0645\u0647\u0627\u0631\u062a \u0644\u0627\u0632\u0645", "nodes": "\u0646\u0648\u062f\u0647\u0627", "noNodes": "\u0646\u0648\u062f\u06cc \u0628\u0631\u0627\u06cc \u0627\u06cc\u0646 \u067e\u0631\u0648\u0641\u0634\u0646 \u062b\u0628\u062a \u0646\u0634\u062f\u0647.", "noTrainers": "\u0645\u0631\u0628\u06cc\u200c\u0627\u06cc \u0628\u0631\u0627\u06cc \u0627\u06cc\u0646 \u067e\u0631\u0648\u0641\u0634\u0646 \u062b\u0628\u062a \u0646\u0634\u062f\u0647.", "ranksTitle": "\u0631\u0646\u06a9\u200c\u0647\u0627\u06cc \u0645\u0647\u0627\u0631\u062a", "shown": "\u0646\u0645\u0627\u06cc\u0634", "of": "\u0627\u0632", "metaTitle": "\u067e\u0631\u0648\u0641\u0634\u0646\u200c\u0647\u0627\u06cc \u0641\u0648\u0631\u0648\u0631 \u2014 wowfarsi"};
  var PN = {"alchemy": "\u06a9\u06cc\u0645\u06cc\u0627\u06af\u0631\u06cc", "blacksmithing": "\u0622\u0647\u0646\u06af\u0631\u06cc", "enchanting": "\u0627\u0641\u0633\u0648\u0646\u200c\u06af\u0631\u06cc", "engineering": "\u0645\u0647\u0646\u062f\u0633\u06cc", "leatherworking": "\u0686\u0631\u0645\u200c\u062f\u0648\u0632\u06cc", "tailoring": "\u062e\u06cc\u0627\u0637\u06cc", "herbalism": "\u06af\u06cc\u0627\u0647\u200c\u0634\u0646\u0627\u0633\u06cc", "mining": "\u0645\u0639\u062f\u0646\u200c\u06a9\u0627\u0631\u06cc", "skinning": "\u067e\u0648\u0633\u062a\u200c\u06a9\u0646\u06cc", "cooking": "\u0622\u0634\u067e\u0632\u06cc", "first-aid": "\u06a9\u0645\u06a9\u200c\u0647\u0627\u06cc \u0627\u0648\u0644\u06cc\u0647", "fishing": "\u0645\u0627\u0647\u06cc\u06af\u06cc\u0631\u06cc"};
  /* slug, English, group, emblem icon, accent */
  var PROFS = [
    ["alchemy", "Alchemy", "crafting", "trade_alchemy", "#8ad66b"],
    ["blacksmithing", "Blacksmithing", "crafting", "trade_blacksmithing", "#ff8a3d"],
    ["enchanting", "Enchanting", "crafting", "trade_engraving", "#b184ff"],
    ["engineering", "Engineering", "crafting", "trade_engineering", "#e0b04a"],
    ["leatherworking", "Leatherworking", "crafting", "trade_leatherworking", "#c28a56"],
    ["tailoring", "Tailoring", "crafting", "trade_tailoring", "#6fb4ff"],
    ["herbalism", "Herbalism", "gathering", "trade_herbalism", "#5fd070"],
    ["mining", "Mining", "gathering", "trade_mining", "#aab4c2"],
    ["skinning", "Skinning", "gathering", "inv_misc_pelt_wolf_01", "#d9cdb0"],
    ["cooking", "Cooking", "secondary", "inv_misc_food_15", "#ff6a4a"],
    ["first-aid", "First Aid", "secondary", "spell_holy_sealofsacrifice", "#e8e2d0"],
    ["fishing", "Fishing", "secondary", "trade_fishing", "#4fd1c5"]
  ];
  var QC = ["#9d9d9d", "#ffffff", "#1eff00", "#0070dd", "#a335ee", "#ff8000"];
  var DB = "data/forever/db/";
  var ICON = "icons/large/";
  var PAGE = 60;
  var DEF_RANKS = [{ n: FA.r1, lo: 1, hi: 75 }, { n: FA.r2, lo: 75, hi: 150 }, { n: FA.r3, lo: 150, hi: 225 }, { n: FA.r4, lo: 225, hi: 300 }];
  var root = document.getElementById("pf-root");
  if (!root) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function info(slug) {
    for (var i = 0; i < PROFS.length; i++) if (PROFS[i][0] === slug) return PROFS[i];
    return null;
  }
  function getJSON(u) {
    return fetch(u).then(function (r) { return r.ok ? r.json() : Promise.reject(new Error("http " + r.status)); });
  }
  function icn(name, q, cls, qty) {
    var n = String(name || "").replace(/[^a-zA-Z0-9_.\-]/g, "").toLowerCase();
    var c = "pf-ic" + (cls ? " " + cls : "") + (q != null && q !== "" && +q >= 0 && +q <= 5 ? " q" + (+q) : "");
    var badge = qty > 1 ? "<em>" + (+qty) + "</em>" : "";
    if (!n) return '<span class="' + c + ' pf-ic-miss">' + badge + "</span>";
    if (!/\.(jpg|png|webp)$/.test(n)) n += ".jpg";
    return '<span class="' + c + '"><img src="' + ICON + n + '" alt="" loading="lazy" decoding="async" onerror="this.parentNode.className+=\' pf-ic-miss\';this.remove()">' + badge + "</span>";
  }
  function nm(o) {
    var fa = o && o.fa ? o.fa : "", en = o && o.n ? o.n : "";
    return { main: fa || en, sub: fa && en && fa !== en ? en : "" };
  }
  function setBuild(b, obs) {
    var el = document.getElementById("pf-build");
    if (el && b) el.textContent = b;
    var cr = document.getElementById("pf-credit");
    if (cr && obs) cr.innerHTML = '<span class="pf-credit"><a href="https://foreverdb.net" target="_blank" rel="noopener">' + FA.credit + "</a></span>";
  }
  function orn() { return '<div class="pf-orn"><i></i><b></b><i></i></div>'; }

  /* ---------------- hub ---------------- */
  function renderHub() {
    document.title = FA.metaTitle;
    root.innerHTML = '<p class="pf-load">' + FA.loading + "</p>";
    getJSON(DB + "prof-index.json").catch(function () { return null; }).then(function (idx) {
      var meta = {};
      ((idx && idx.profs) || []).forEach(function (p) { meta[p.slug] = p; });
      var groups = [["crafting", FA.crafting, "Crafting"], ["gathering", FA.gathering, "Gathering"], ["secondary", FA.secondary, "Secondary"]];
      var h = '<div class="pf-title"><p class="pf-en font-cinzel" dir="ltr">WoW Forever \u00b7 Professions</p>' + orn() +
        "<h1>" + FA.hubTitle + '</h1><p class="pf-sub">' + FA.hubSub + "</p></div>";
      groups.forEach(function (g) {
        h += '<section class="pf-group"><div class="pf-gh"><span class="pf-gl"></span><h3>' + g[1] + '</h3><span class="pf-gen font-cinzel" dir="ltr">' + g[2] + '</span><span class="pf-gl"></span></div><div class="pf-cards">';
        PROFS.filter(function (p) { return p[2] === g[0]; }).forEach(function (p) {
          var m = meta[p[0]] || {};
          var chips = "";
          if (m.count) chips += '<span class="pf-chip">' + (+m.count) + " " + FA.recipeWord + "</span>";
          if (m.max) chips += '<span class="pf-chip">' + (+m.max) + "</span>";
          h += '<a class="pf-card" style="--ac:' + p[4] + '" href="profession.html?p=' + p[0] + '"><span class="pf-emb">' + icn(m.icon || p[3], "", "pf-ic-lg") + "</span>" +
            "<b>" + PN[p[0]] + '</b><span class="pf-en font-cinzel" dir="ltr">' + p[1] + "</span>" + (chips ? '<span class="pf-meta">' + chips + "</span>" : "") + "</a>";
        });
        h += "</div></section>";
      });
      h += '<p class="pf-empty">' + FA.hubHint + "</p>";
      root.innerHTML = h;
      setBuild(idx && idx.build, false);
    });
  }

  /* ---------------- detail ---------------- */
  var S = null;
  var tip = null;

  function rankOf(r, ranks) {
    var k = 0;
    for (var i = 0; i < ranks.length; i++) if ((r.rk || 0) >= ranks[i].lo) k = i;
    return k;
  }
  function color(th, s) {
    if (!th || th.length < 4) return "x";
    return s < th[1] ? "o" : s < th[2] ? "y" : s < th[3] ? "g" : "x";
  }
  function chips(th) {
    if (!th || th.length < 4) return "";
    return '<span class="pf-sk" dir="ltr"><span class="pf-ch o">' + th[0] + '</span><span class="pf-ch y">' + th[1] + '</span><span class="pf-ch g">' + th[2] + '</span><span class="pf-ch x">' + th[3] + "</span></span>";
  }
  function srcBadge(r) {
    var k = r.src && FA[r.src] ? r.src : "unknown";
    return '<span class="pf-src' + (r.obs ? " obs" : "") + '">' + FA[k] + "</span>";
  }
  function reagentsHTML(r) {
    return (r.re || []).map(function (g) {
      var n = nm(g);
      return '<a class="pf-rg" href="item.html?id=' + (+g.id) + '" title="' + esc(n.main) + '">' + icn(g.ic, g.q, "", g.c) + "</a>";
    }).join("");
  }
  function recipeName(r) {
    var it = r.it || null;
    var n = nm(it && (it.n || it.fa) ? it : r);
    var main = it && it.id ? '<a href="item.html?id=' + (+it.id) + '">' + esc(n.main) + "</a>" : '<span class="pf-n1">' + esc(n.main) + "</span>";
    return '<span class="pf-nm">' + main + (n.sub ? "<small>" + esc(n.sub) + "</small>" : "") + "</span>";
  }
  function recipeIcon(r) {
    var it = r.it || null;
    return icn((it && it.ic) || r.ic, it && it.q, "", it && it.c);
  }
  function cardHTML(r) {
    return '<article class="pf-rc" data-id="' + (+r.id) + '" tabindex="0"><div class="pf-rt">' + recipeIcon(r) + recipeName(r) + srcBadge(r) + "</div>" +
      chips(r.th) + '<div class="pf-re">' + reagentsHTML(r) + "</div></article>";
  }
  function rowHTML(r) {
    return '<tr data-id="' + (+r.id) + '"><td><div class="pf-rt">' + recipeIcon(r) + recipeName(r) + "</div></td><td>" + chips(r.th) + '</td><td><div class="pf-re">' + reagentsHTML(r) + "</div></td><td>" + srcBadge(r) + "</td></tr>";
  }

  function haystack(r) {
    var a = [r.n, r.fa, r.it && r.it.n, r.it && r.it.fa];
    (r.re || []).forEach(function (g) { a.push(g.n, g.fa); });
    return a.filter(Boolean).join(" ").toLowerCase();
  }
  function filtered() {
    var q = S.q.trim().toLowerCase();
    var list = S.data.recipes.filter(function (r) {
      if (S.rank !== "" && rankOf(r, S.ranks) !== +S.rank) return false;
      if (S.src && (r.src || "unknown") !== S.src) return false;
      if (S.qual !== "" && (!r.it || +r.it.q !== +S.qual)) return false;
      if (q && r._h.indexOf(q) < 0) return false;
      return true;
    });
    list.sort(function (a, b) {
      if (S.sort === "name") return String(nm(a.it && a.it.n ? a.it : a).main).localeCompare(String(nm(b.it && b.it.n ? b.it : b).main));
      if (S.sort === "q") return ((b.it && b.it.q) || 0) - ((a.it && a.it.q) || 0) || (a.rk || 0) - (b.rk || 0);
      return (a.rk || 0) - (b.rk || 0) || (a.th ? a.th[1] : 0) - (b.th ? b.th[1] : 0);
    });
    return list;
  }

  function paintList() {
    var box = document.getElementById("pf-list");
    if (!box) return;
    var list = filtered();
    var n = Math.min(S.limit, list.length);
    var shown = list.slice(0, n);
    var h;
    if (!list.length) h = '<p class="pf-empty">' + FA.none + "</p>";
    else if (S.view === "table") h = '<div class="pf-tw"><table class="pf-tb"><thead><tr><th>' + FA.recipes + "</th><th>" + FA.sortSkill + "</th><th>" + FA.reagents + "</th><th>" + FA.source + "</th></tr></thead><tbody>" + shown.map(rowHTML).join("") + "</tbody></table></div>";
    else h = '<div class="pf-grid">' + shown.map(cardHTML).join("") + "</div>";
    if (n < list.length) h += '<button type="button" class="pf-btn alt pf-more" id="pf-more">' + FA.shown + " " + n + " " + FA.of + " " + list.length + " +</button>";
    box.innerHTML = h;
    var mb = document.getElementById("pf-more");
    if (mb) mb.onclick = function () { S.limit += PAGE * 2; paintList(); };
    var f = S.focus ? box.querySelector('[data-id="' + (+S.focus) + '"]') : null;
    if (S.focus && !f && n < list.length) {
      var pos = list.findIndex(function (r) { return String(r.id) === String(S.focus); });
      if (pos >= 0) { S.limit = pos + 1; paintList(); return; }
    }
    if (f) {
      f.classList.add("pf-flash");
      f.scrollIntoView({ block: "center", behavior: "smooth" });
      S.focus = null;
    }
  }

  function opt(v, t, sel) { return '<option value="' + esc(v) + '"' + (String(sel) === String(v) ? " selected" : "") + ">" + esc(t) + "</option>"; }

  function recipesTab(pane) {
    var srcs = {};
    S.data.recipes.forEach(function (r) { srcs[r.src || "unknown"] = 1; });
    var h = '<div class="pf-bar"><input type="search" id="pf-q" placeholder="' + esc(FA.search) + '" value="' + esc(S.q) + '">' +
      '<select id="pf-rank">' + opt("", FA.rank + ": " + FA.all, S.rank) + S.ranks.map(function (r, i) { return opt(i, r.n + " (" + r.lo + "-" + r.hi + ")", S.rank); }).join("") + "</select>" +
      '<select id="pf-src">' + opt("", FA.source + ": " + FA.all, S.src) + Object.keys(srcs).map(function (k) { return opt(k, FA[k] || k, S.src); }).join("") + "</select>" +
      '<select id="pf-qual">' + opt("", FA.quality + ": " + FA.all, S.qual) + ["0", "1", "2", "3", "4", "5"].map(function (k) { return opt(k, k, S.qual); }).join("") + "</select>" +
      '<select id="pf-sort">' + opt("skill", FA.sort + ": " + FA.sortSkill, S.sort) + opt("name", FA.sort + ": " + FA.sortName, S.sort) + opt("q", FA.sort + ": " + FA.sortQ, S.sort) + "</select>" +
      '<span class="pf-seg"><button type="button" data-v="grid" class="' + (S.view === "grid" ? "on" : "") + '">' + FA.grid + '</button><button type="button" data-v="table" class="' + (S.view === "table" ? "on" : "") + '">' + FA.table + "</button></span></div>" +
      '<div class="pf-legend"><span><i class="pf-dot o"></i>' + FA.cOrange + '</span><span><i class="pf-dot y"></i>' + FA.cYellow + '</span><span><i class="pf-dot g"></i>' + FA.cGreen + '</span><span><i class="pf-dot x"></i>' + FA.cGray + '</span></div><div id="pf-list"></div>';
    pane.innerHTML = h;
    var t = null;
    document.getElementById("pf-q").addEventListener("input", function (e) {
      S.q = e.target.value;
      clearTimeout(t);
      t = setTimeout(function () { S.limit = PAGE; paintList(); }, 120);
    });
    [["pf-rank", "rank"], ["pf-src", "src"], ["pf-qual", "qual"], ["pf-sort", "sort"]].forEach(function (p) {
      document.getElementById(p[0]).addEventListener("change", function (e) { S[p[1]] = e.target.value; S.limit = PAGE; paintList(); });
    });
    Array.prototype.forEach.call(pane.querySelectorAll(".pf-seg button"), function (b) {
      b.addEventListener("click", function () {
        S.view = b.getAttribute("data-v");
        Array.prototype.forEach.call(pane.querySelectorAll(".pf-seg button"), function (x) { x.classList.toggle("on", x === b); });
        paintList();
      });
    });
    paintList();
  }

  /* leveling path from the real thresholds (materials, not prices) */
  function plan(start, goal) {
    var rs = S.data.recipes.filter(function (r) { return r.th && r.th.length >= 4; });
    var steps = [], s = start, guard = 0;
    function cost(r) { return (r.re || []).reduce(function (a, g) { return a + (+g.c || 1); }, 0); }
    while (s < goal && guard++ < 400) {
      var best = null, kind = "";
      ["o", "y"].forEach(function (k) {
        if (best) return;
        var c = rs.filter(function (r) { return (r.rk || 0) <= s && color(r.th, s) === k; });
        if (!c.length) return;
        c.sort(function (a, b) { return cost(a) / Math.max(1, (k === "o" ? a.th[1] : a.th[2]) - s) - cost(b) / Math.max(1, (k === "o" ? b.th[1] : b.th[2]) - s); });
        best = c[0]; kind = k;
      });
      if (!best) { steps.push({ gap: s }); break; }
      var end = Math.min(goal, kind === "o" ? best.th[1] : best.th[2]);
      if (end <= s) end = s + 1;
      steps.push({ r: best, from: s, to: end, k: kind });
      s = end;
    }
    return steps;
  }
  function levelingTab(pane) {
    var top = S.ranks.length ? S.ranks[S.ranks.length - 1].hi : 300;
    pane.innerHTML = '<div class="pf-bar"><label>' + FA.curSkill + ' <input type="number" id="pf-from" min="1" max="' + (top - 1) + '" value="1"></label>' +
      '<label>' + FA.goal + ' <input type="number" id="pf-to" min="2" max="' + top + '" value="' + top + '"></label>' +
      '<button type="button" class="pf-btn" id="pf-go">' + FA.plan + '</button></div><div id="pf-plan"></div><p class="pf-note">' + FA.levelNote + "</p>";
    function go() {
      var a = Math.max(1, +document.getElementById("pf-from").value || 1);
      var b = Math.min(top, +document.getElementById("pf-to").value || top);
      var steps = plan(a, b), tot = {}, h = '<div class="pf-steps">';
      steps.forEach(function (st) {
        if (st.gap != null) { h += '<div class="pf-step"><span class="pf-gap">' + FA.from + " " + st.gap + " \u2192 ?</span></div>"; return; }
        var r = st.r, cnt = st.to - st.from;
        h += '<div class="pf-step"><span class="pf-dot ' + st.k + '"></span>' + recipeIcon(r) + recipeName(r) +
          '<span class="pf-range"><span>' + st.from + " \u2192 " + st.to + '</span><span class="pf-ch ' + st.k + '">\u00d7' + cnt + "</span></span>" +
          '<div class="pf-re" style="flex-basis:100%">' + (r.re || []).map(function (g) {
            var key = g.id; tot[key] = tot[key] || { g: g, c: 0 }; tot[key].c += cnt * (+g.c || 1);
            return '<a class="pf-rg" href="item.html?id=' + (+g.id) + '" title="' + esc(nm(g).main) + '">' + icn(g.ic, g.q, "", (+g.c || 1) * cnt) + "</a>";
          }).join("") + "</div></div>";
      });
      h += "</div>";
      var keys = Object.keys(tot);
      if (keys.length) {
        h += '<div class="pf-tot"><h4>' + FA.total + '</h4><div class="pf-re">' + keys.map(function (k) {
          var t = tot[k];
          return '<a class="pf-rg" href="item.html?id=' + (+t.g.id) + '" title="' + esc(nm(t.g).main) + " \u00d7" + t.c + '">' + icn(t.g.ic, t.g.q, "", t.c) + "</a>";
        }).join("") + "</div></div>";
      }
      document.getElementById("pf-plan").innerHTML = h;
    }
    document.getElementById("pf-go").addEventListener("click", go);
    go();
  }

  function sourcesTab(pane) {
    var nodes = S.data.nodes || [];
    if (!nodes.length) { pane.innerHTML = '<p class="pf-empty">' + FA.noNodes + "</p>"; return; }
    pane.innerHTML = '<div class="pf-nodes">' + nodes.map(function (n) {
      var x = nm(n);
      return '<div class="pf-nd">' + icn(n.ic, n.q, "") + "<div><b>" + esc(x.main) + "</b>" + (x.sub ? '<small dir="ltr">' + esc(x.sub) + "</small>" : "") +
        (n.skill ? "<small>" + FA.skillNeeded + ": " + (+n.skill) + "</small>" : "") +
        (n.zones && n.zones.length ? "<small>" + FA.zones + ": " + esc(n.zones.join("\u060c ")) + "</small>" : "") + "</div></div>";
    }).join("") + "</div>";
  }
  function trainersTab(pane) {
    var tr = S.data.trainers || [];
    if (!tr.length) { pane.innerHTML = '<p class="pf-empty">' + FA.noTrainers + "</p>"; return; }
    pane.innerHTML = '<div class="pf-nodes">' + tr.map(function (t) {
      var x = nm(t);
      return '<div class="pf-nd">' + icn("", "", "") + "<div><b>" + esc(x.main) + "</b>" + (x.sub ? '<small dir="ltr">' + esc(x.sub) + "</small>" : "") +
        (t.zone ? "<small>" + esc(t.zone) + "</small>" : "") + (t.rank ? "<small>" + esc(t.rank) + "</small>" : "") + "</div></div>";
    }).join("") + "</div>";
  }

  function ensureTip() {
    if (tip) return tip;
    tip = document.createElement("div");
    tip.className = "pf-tip";
    document.body.appendChild(tip);
    return tip;
  }
  function tipHTML(r) {
    var it = r.it || null, n = nm(it && (it.n || it.fa) ? it : r);
    var qc = QC[it && it.q != null ? +it.q : 1] || QC[1];
    var h = '<b style="color:' + qc + '">' + esc(n.main) + "</b>";
    if (n.sub) h += '<div dir="ltr" style="color:#8f8571;text-align:right">' + esc(n.sub) + "</div>";
    h += '<div class="pf-tl"><span>' + FA.needSkill + "</span><span>" + (+r.rk || 0) + "</span></div>";
    if (r.th && r.th.length >= 4) h += chips(r.th);
    if (r.re && r.re.length) h += '<div style="margin-top:.4rem">' + FA.reagents + ":</div>" + r.re.map(function (g) { return "<div>" + (+g.c || 1) + "\u00d7 " + esc(nm(g).main) + "</div>"; }).join("");
    return h;
  }
  function bindTip(pane) {
    var byId = {};
    S.data.recipes.forEach(function (r) { byId[r.id] = r; });
    function host(el) { return el && el.closest ? el.closest("[data-id]") : null; }
    pane.addEventListener("mouseover", function (e) {
      var el = host(e.target); if (!el) return;
      var r = byId[el.getAttribute("data-id")]; if (!r) return;
      var t = ensureTip(); t.innerHTML = tipHTML(r); t.style.display = "block";
    });
    pane.addEventListener("mousemove", function (e) {
      if (!tip || tip.style.display !== "block") return;
      var x = e.clientX + 16, y = e.clientY + 16, w = tip.offsetWidth, h = tip.offsetHeight;
      if (x + w > window.innerWidth - 8) x = e.clientX - w - 16;
      if (y + h > window.innerHeight - 8) y = e.clientY - h - 16;
      tip.style.left = Math.max(8, x) + "px"; tip.style.top = Math.max(8, y) + "px";
    });
    pane.addEventListener("mouseout", function (e) {
      if (!tip) return;
      var from = host(e.target), to = host(e.relatedTarget);
      if (from && from !== to) tip.style.display = "none";
    });
  }

  function showTab(name) {
    S.tab = name;
    var pane = document.getElementById("pf-pane");
    Array.prototype.forEach.call(document.querySelectorAll(".pf-tab"), function (b) { b.classList.toggle("on", b.getAttribute("data-t") === name); });
    if (tip) tip.style.display = "none";
    if (name === "recipes") recipesTab(pane);
    else if (name === "leveling") levelingTab(pane);
    else if (name === "sources") sourcesTab(pane);
    else trainersTab(pane);
  }

  function heroHTML(p, d) {
    var ranks = (d && d.ranks && d.ranks.length ? d.ranks : DEF_RANKS);
    var meta = "";
    if (d && d.recipes && d.recipes.length) meta += '<span class="pf-chip">' + d.recipes.length + " " + FA.recipeWord + "</span>";
    if (d && d.build) meta += '<span class="pf-chip" dir="ltr">' + FA.build + " " + esc(d.build) + "</span>";
    return '<a class="pf-back" href="professions.html">\u2192 ' + FA.back + '</a><section class="pf-hero" style="--ac:' + p[4] + '"><span class="pf-emb">' + icn((d && d.icon) || p[3], "", "pf-ic-lg") + "</span>" +
      '<div><h1>' + PN[p[0]] + '</h1><div class="pf-en font-cinzel" dir="ltr">' + p[1] + '</div><div class="pf-meta">' + meta + "</div></div>" +
      '<div style="flex-basis:100%"><div class="pf-ranks" aria-label="' + esc(FA.ranksTitle) + '">' + ranks.map(function (r) {
        return '<div class="pf-md"><span class="pf-md-c">' + (+r.hi) + "</span><b>" + esc(r.n) + '</b><i dir="ltr">' + (+r.lo) + " - " + (+r.hi) + "</i></div>";
      }).join("") + "</div></div></section>";
  }

  function renderDetail() {
    var qs = new URLSearchParams(location.search);
    var slug = qs.get("p") || "";
    var p = info(slug);
    if (!p) { location.replace("professions.html"); return; }
    document.title = PN[slug] + " \u2014 wowfarsi";
    root.innerHTML = heroHTML(p, null) + '<p class="pf-load">' + FA.loading + "</p>";
    getJSON(DB + "prof-" + slug + ".json").then(function (d) { return d; }, function () { return null; }).then(function (d) {
      if (!d || !(d.recipes || d.nodes || d.trainers)) {
        root.innerHTML = heroHTML(p, null) + '<p class="pf-empty">' + FA.noData + "</p>";
        return;
      }
      d.recipes = d.recipes || [];
      d.recipes.forEach(function (r) { r._h = haystack(r); });
      var ranks = d.ranks && d.ranks.length ? d.ranks : DEF_RANKS;
      S = { slug: slug, p: p, data: d, ranks: ranks, q: qs.get("q") || "", rank: "", src: "", qual: "", sort: "skill", view: "grid", limit: PAGE, focus: qs.get("r"), tab: "" };
      var tabs = [];
      if (d.recipes.length) { tabs.push(["recipes", FA.recipes]); tabs.push(["leveling", FA.leveling]); }
      if ((d.nodes || []).length) tabs.push(["sources", FA.sources]);
      if ((d.trainers || []).length) tabs.push(["trainers", FA.trainers]);
      if (!tabs.length) { root.innerHTML = heroHTML(p, d) + '<p class="pf-empty">' + FA.noData + "</p>"; return; }
      root.innerHTML = heroHTML(p, d) + '<div class="pf-tabs" role="tablist">' + tabs.map(function (t) { return '<button type="button" class="pf-tab" role="tab" data-t="' + t[0] + '">' + t[1] + "</button>"; }).join("") + '</div><div id="pf-pane"></div>';
      root.style.setProperty("--ac", p[4]);
      Array.prototype.forEach.call(root.querySelectorAll(".pf-tab"), function (b) { b.addEventListener("click", function () { showTab(b.getAttribute("data-t")); }); });
      bindTip(document.getElementById("pf-pane"));
      var obs = d.recipes.some(function (r) { return r.obs; }) || (d.nodes || []).some(function (n) { return n.obs; }) || (d.trainers || []).some(function (t) { return t.obs; });
      setBuild(d.build, obs);
      showTab(tabs[0][0]);
    });
  }

  if (root.getAttribute("data-mode") === "detail") renderDetail(); else renderHub();
})();
