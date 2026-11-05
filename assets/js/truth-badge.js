/* truth-badge.js - Forever item pages: how sure we are about this page (Brain 5 Nov 2026,
   wow-ops docs/RISK_AUDIT.md R1 R3 R13). Reads data/forever/db/truth-<id % 24>.json written by
   tools/item_truth.py and puts one line above the item card: absent / hidden / changed / same.
   Stat type ids: 3 Agi 4 Str 5 Int 6 Spi 7 Sta; others are shown as their Forever id until named. */
(function () {
  var T = {
  absent: "\u0627\u06cc\u0646 \u0622\u06cc\u062a\u0645 \u062f\u0631 \u0641\u0627\u06cc\u0644\u200c\u0647\u0627\u06cc \u0628\u0627\u0632\u06cc Forever \u067e\u06cc\u062f\u0627 \u0646\u0634\u062f\u061b \u0645\u0645\u06a9\u0646 \u0627\u0633\u062a \u062f\u0631 Forever \u0648\u062c\u0648\u062f \u0646\u062f\u0627\u0634\u062a\u0647 \u0628\u0627\u0634\u062f.",
  hidden: "Forever \u062c\u0632\u0626\u06cc\u0627\u062a \u0627\u06cc\u0646 \u0622\u06cc\u062a\u0645 \u0631\u0627 \u067e\u0646\u0647\u0627\u0646 \u06a9\u0631\u062f\u0647 \u0648 \u0633\u0631\u0648\u0631 \u0641\u0642\u0637 \u062f\u0627\u062e\u0644 \u0628\u0627\u0632\u06cc \u0645\u06cc\u200c\u0641\u0631\u0633\u062a\u062f\u061b \u0639\u062f\u062f\u0647\u0627\u06cc \u0627\u06cc\u0646 \u0635\u0641\u062d\u0647 \u0627\u0632 \u06a9\u0644\u0627\u0633\u06cc\u06a9 \u0627\u0633\u062a \u0648 \u0645\u0645\u06a9\u0646 \u0627\u0633\u062a \u062f\u0631 Forever \u0641\u0631\u0642 \u06a9\u0646\u062f.",
  changed: "\u0627\u06cc\u0646 \u0622\u06cc\u062a\u0645 \u062f\u0631 Forever \u062a\u063a\u06cc\u06cc\u0631 \u06a9\u0631\u062f\u0647\u061b \u0639\u062f\u062f \u0627\u0633\u062a\u062a\u200c\u0647\u0627\u06cc \u0627\u06cc\u0646 \u0635\u0641\u062d\u0647 \u0647\u0646\u0648\u0632 \u0627\u0632 \u06a9\u0644\u0627\u0633\u06cc\u06a9 \u0627\u0633\u062a.",
  same: "\u0628\u0627 \u0641\u0627\u06cc\u0644\u200c\u0647\u0627\u06cc \u0628\u0627\u0632\u06cc Forever \u0628\u0631\u0631\u0633\u06cc \u0634\u062f\u061b \u0639\u062f\u062f \u0627\u0633\u062a\u062a\u200c\u0647\u0627 \u0627\u0632 \u06a9\u0644\u0627\u0633\u06cc\u06a9 \u0627\u0633\u062a \u0648 \u0647\u0646\u0648\u0632 \u062f\u0627\u062e\u0644 \u0628\u0627\u0632\u06cc \u062a\u0623\u06cc\u06cc\u062f \u0646\u0634\u062f\u0647.",
  ilvl: "\u0622\u06cc\u062a\u0645\u200c\u0644\u0648\u0644",
  req: "\u0633\u0637\u062d \u0644\u0627\u0632\u0645",
  q: "\u06a9\u06cc\u0641\u06cc\u062a",
  sell: "\u0642\u06cc\u0645\u062a \u0641\u0631\u0648\u0634",
  stats: "\u0627\u0633\u062a\u062a\u200c\u0647\u0627",
  x: "\u0627\u0633\u062a\u062a \u062a\u0627\u0632\u0647 \u062f\u0631 Forever",
  site: "\u0627\u06cc\u0646 \u0635\u0641\u062d\u0647",
  ff: "Forever",
  src: "\u0645\u0646\u0628\u0639: \u0641\u0627\u06cc\u0644\u200c\u0647\u0627\u06cc \u0628\u0627\u0632\u06cc Forever",
  srcc: "\u0645\u0646\u0628\u0639: \u062f\u0627\u062f\u0647\u0654 \u0633\u0631\u0648\u0631 Forever (\u06a9\u0634 \u0628\u0627\u0632\u06cc)",
  none: "\u0628\u062f\u0648\u0646 \u0627\u0633\u062a\u062a"
  };
  var NAMES = {3: "Agility", 4: "Strength", 5: "Intellect", 6: "Spirit", 7: "Stamina", 32: "Critical Strike",
               36: "Haste", 31: "Hit", 45: "Spell Power"};
  var p = new URLSearchParams(location.search);
  var id = p.get("id") || (document.body && document.body.getAttribute("data-item-id"));
  var ver = p.get("ver") || (document.body && document.body.getAttribute("data-ver"));
  if (ver !== "forever" || !id || !/^\d+$/.test(id)) return;
  var COL = {absent: "#d9534f", hidden: "#d9534f", changed: "#e0a030", same: "#8a9a6a"};
  function el(tag, css, txt) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (txt != null) e.textContent = txt; return e; }
  function fmt(k, v) {
    if (k === "sell" && typeof v === "number") return Math.floor(v / 10000) + "g " + Math.floor(v % 10000 / 100) + "s " + (v % 100) + "c";
    if (Object.prototype.toString.call(v) === "[object Array]") return v.length ? v.join("\u060c ") : T.none;
    return String(v);
  }
  function badge(ent) {
    var box = el("div", "margin:0 0 .8rem;padding:.6rem .85rem;border-radius:10px;font-size:13px;line-height:1.9;" +
      "background:rgba(20,16,10,.72);border:1px solid " + COL[ent.s] + ";color:#e9e1cc");
    box.className = "truth-badge truth-" + ent.s;
    box.appendChild(el("div", "color:" + COL[ent.s] + ";font-weight:700", T[ent.s]));
    var d = ent.d || {};
    Object.keys(d).forEach(function (k) {
      box.appendChild(el("div", "", (T[k] || k) + ": " + T.site + " " + fmt(k, d[k][0]) + " \u2190 " + T.ff + " " + fmt(k, d[k][1])));
    });
    if (ent.x && ent.x.length) {
      box.appendChild(el("div", "", T.x + ": " + ent.x.map(function (t) { return NAMES[t] || ("#" + t); }).join("\u060c ")));
    }
    if (ent.s !== "absent") box.appendChild(el("div", "font-size:11.5px;color:#bdb7a6", ent.src === "cache" ? T.srcc : T.src));
    return box;
  }
  function place(node) {
    var root = document.getElementById("rt-root");
    if (!root || !root.firstChild) return false;
    if (!root.querySelector(".truth-badge")) root.insertBefore(node, root.firstChild);
    return true;
  }
  fetch("data/forever/db/truth-" + (+id % 24) + ".json")
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) {
      var ent = j && j.items && j.items[id];
      if (!ent || !T[ent.s]) return;
      var node = badge(ent);
      if (place(node)) return;
      var mo = new MutationObserver(function () { if (place(node)) mo.disconnect(); });
      mo.observe(document.body, {childList: true, subtree: true});
      setTimeout(function () { mo.disconnect(); }, 15000);
    })
    .catch(function () {});
})();
