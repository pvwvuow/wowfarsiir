/* =========================================================
   wowfarsi — Forever Patch Notes (patch-notes.html)
   Source data: data/forever/patchnotes.json — written by the
   wowfarsi update agent (agent/README.md) from foreverchanges.pro.
   UI is Persian; the note text stays the official EN source
   (dir=ltr blocks) until a reviewed translation pass lands.
   Language flips follow WFTR switches (namesClass for the
   class/spec labels; textDesc/terms for markerized FA text).
   ========================================================= */
"use strict";
(function () {
  var root = document.getElementById("pn-root");
  if (!root) return;

  var ST = { q: "", kind: "all", cls: "all", loaded: false, data: null };
  var CLS_FA = { warrior: "جنگاور", hunter: "شکارچی", mage: "جادوگر", rogue: "راهزن",
    priest: "روحانی", warlock: "احضارکننده", paladin: "پالادین", druid: "دروئید",
    shaman: "شمن" };
  var CLS_EN = { warrior: "Warrior", hunter: "Hunter", mage: "Mage", rogue: "Rogue",
    priest: "Priest", warlock: "Warlock", paladin: "Paladin", druid: "Druid",
    shaman: "Shaman" };
  var CLS_COLOR = { warrior: "#C69B6D", paladin: "#F48CBA", hunter: "#AAD372",
    rogue: "#FFF468", priest: "#FFFFFF", shaman: "#0070DD", mage: "#3FC7EB",
    warlock: "#8788EE", druid: "#FF7C0A" };
  var RACE_FA = { human: "انسان", dwarf: "دورف", "night elf": "الف شب",
    gnome: "گنوم", orc: "اورک", undead: "مرده‌متحرک", tauren: "تورن",
    troll: "ترول", skyborne: "آسمان‌زاد" };
  var KIND_FA = { hotfix: "هات‌فیکس", build: "بیلد", announced: "اعلامی برای عرضه" };
  var MONTHS_FA = ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه",
    "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"];
  var KINDS = [["all", "همه"], ["hotfix", "هات‌فیکس"], ["build", "بیلد"],
    ["announced", "اعلامی"]];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fa(s) { return String(s).replace(/[0-9]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹"[+d]; }); }
  function on(k) { return window.WFTR ? WFTR.on(k) : true; }
  function clsLabel(slug) {
    return on("namesClass") ? (CLS_FA[slug] || slug) : (CLS_EN[slug] || slug);
  }
  function fmtDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return esc(iso || "");
    return fa(+m[3]) + " " + MONTHS_FA[+m[2] - 1] + " " + fa(m[1]);
  }
  function groupLabel(g) {
    if (g[0] === "class") return clsLabel(g[1]);
    if (g[0] === "race") return on("namesClass") ? (RACE_FA[g[1]] || g[1]) : g[1];
    return "آیتم‌ها و سایر کلمات";
  }
  function groupColor(g) {
    return g[0] === "class" ? (CLS_COLOR[g[1]] || "var(--gold-2)") : "var(--gold-3)";
  }
  function trHtml(s) {
    var h = esc(s);
    return (window.WFTR && WFTR.faTokens) ? WFTR.faTokens(h) : h;
  }

  /* ---------------- toolbar ---------------- */
  function renderChips() {
    var el = document.getElementById("pn-kinds");
    el.innerHTML = KINDS.map(function (k) {
      return '<button class="pn-chip' + (ST.kind === k[0] ? " on" : "") +
        '" data-kind="' + k[0] + '" aria-pressed="' + (ST.kind === k[0]) + '">' + k[1] + "</button>";
    }).join("");
  }

  /* ---------------- entry card ---------------- */
  function passEntry(e) {
    if (ST.kind !== "all" && e.kind !== ST.kind) return false;
    if (ST.cls !== "all") {
      var hit = (e.sections || []).some(function (s) { return s.group[1] === ST.cls; });
      if (!hit) return false;
    }
    if (ST.q) {
      var q = ST.q.toLowerCase();
      var hay = [e.prose, e.build, e.kind].join(" ").toLowerCase() + " " +
        (e.sections || []).map(function (s) {
          return s.spec + " " + s.changes.map(function (c) { return c.name + " " + c.text; }).join(" ");
        }).join(" ") + " " + (e.items || []).map(function (i) { return i.name; }).join(" ");
      if (hay.toLowerCase().indexOf(q) < 0) return false;
    }
    return true;
  }

  function changeHTML(c) {
    var tag = c.tag ? '<i class="pn-tag">' + esc({ "new talent": "تلنت جدید", moved: "جابه‌جایی", removed: "حذف", new: "جدید" }[c.tag] || c.tag) + "</i>" : "";
    return '<li class="pn-ch pn-' + esc(c.kind) + '">' +
      '<span class="pn-mark" aria-hidden="true">' + (c.kind === "buff" ? "▲" : c.kind === "nerf" ? "▼" : "◆") + "</span>" +
      '<div class="pn-chbody" dir="ltr"><b class="pn-chname">' + esc(c.name) + "</b>" + tag +
      '<span class="pn-chtext">' + esc(c.text) + "</span></div></li>";
  }

  function entryHTML(e) {
    var nch = (e.sections || []).reduce(function (a, s) { return a + s.changes.length; }, 0);
    var h = '<article class="pn-entry" id="' + esc(e.id) + '">' +
      '<header class="pn-ehead">' +
      '<h3 class="pn-date">' + fmtDate(e.date) + "</h3>" +
      '<span class="pn-kind pn-kind-' + esc(e.kind) + '">' + (KIND_FA[e.kind] || esc(e.kind)) +
      (e.build ? ' <b dir="ltr">' + esc(e.build) + "</b>" : "") +
      (e.current ? '<i class="pn-cur">نسخهٔ جاری</i>' : "") + "</span>" +
      (nch ? '<span class="pn-count">' + fa(nch) + " تغییر</span>" : "") +
      "</header>";
    if (e.prose) h += '<p class="pn-prose" dir="ltr">' + esc(e.prose) + "</p>";
    (e.sections || []).forEach(function (s) {
      if (!s.changes.length) return;
      h += '<section class="pn-sec">' +
        '<h4 class="pn-grp"><i class="pn-dot" style="background:' + groupColor(s.group) + '"></i>' +
        esc(groupLabel(s.group)) +
        (s.spec && s.spec !== "General" ? '<small dir="ltr">' + esc(s.spec) + "</small>" : "") + "</h4>" +
        '<ul class="pn-list">' + s.changes.map(changeHTML).join("") + "</ul></section>";
    });
    if ((e.items || []).length) {
      h += '<section class="pn-sec"><h4 class="pn-grp"><i class="pn-dot"></i>آیتم‌ها</h4><ul class="pn-list">' +
        e.items.map(function (i) {
          return '<li class="pn-ch pn-item"><span class="pn-mark">▣</span>' +
            '<div class="pn-chbody" dir="ltr"><b class="pn-chname">' + esc(i.name) + "</b></div></li>";
        }).join("") + "</ul></section>";
    }
    return h + "</article>";
  }

  /* ---------------- render ---------------- */
  function render() {
    renderChips();
    if (!ST.loaded) return;
    var list = (ST.data.entries || []).filter(passEntry);
    document.getElementById("pn-count").textContent =
      fa(list.length) + " مورد از " + fa((ST.data.entries || []).length);
    document.getElementById("pn-updated").textContent = ST.data.updated
      ? "آخرین همگام‌سازی: " + esc(ST.data.updated) : "";
    document.getElementById("pn-list").innerHTML = list.length
      ? list.map(entryHTML).join("")
      : '<div class="pn-empty"><p>چیزی با این فیلترها پیدا نشد.</p></div>';
  }

  function setClassOptions() {
    var el = document.getElementById("pn-cls");
    var opts = [['all', "همهٔ کلاس‌ها"]].concat(
      Object.keys(CLS_FA).map(function (c) { return [c, CLS_FA[c]]; }));
    el.innerHTML = opts.map(function (o) {
      return '<option value="' + o[0] + '">' + o[1] + "</option>";
    }).join("");
    el.value = ST.cls;
  }

  /* ---------------- boot ---------------- */
  function wire() {
    document.getElementById("pn-kinds").addEventListener("click", function (e) {
      var b = e.target.closest("[data-kind]");
      if (!b) return;
      ST.kind = b.getAttribute("data-kind");
      render();
    });
    document.getElementById("pn-cls").addEventListener("change", function (e) {
      ST.cls = e.target.value; render();
    });
    document.getElementById("pn-q").addEventListener("input", function (e) {
      ST.q = e.target.value.trim(); render();
    });
    if (window.WFTR && WFTR.onChange) WFTR.onChange(render);
  }

  setClassOptions();
  render();
  wire();
  fetch("data/forever/patchnotes.json")
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (d) {
      ST.data = d; ST.loaded = true; render();
      var h = location.hash.replace("#", "");
      if (h) {
        var el = document.getElementById(h);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    })
    .catch(function () {
      document.getElementById("pn-list").innerHTML =
        '<div class="pn-empty"><p>بارگذاری پچ‌نوت‌ها ناموفق بود — کمی بعد دوباره تلاش کنید.</p></div>';
    });
})();
