/* clsnames.js v1 (2026-11-01) - wowfarsi: the ONE class + spec name table
   ------------------------------------------------------------------------
   Why (the user): class names had no single variable and six places
   disagreed (glossary + classes.json: Rogue/Mage/Priest/Warrior written as
   transliterations, tr.js CLASSES with meaning-based names, item tooltips
   and Retail data with a third set). Rogue = rahzan, Mage = jadugar; every
   name must be editable in the custom translation room (translate.html).

   DATA (the block between the WFCLS-JSON comments) = the site canon:
     13 classes (9 Forever + 4 Midnight-only) with their Forever tabs and
     Midnight specs ("w": f = Forever, r = Midnight/Retail), plus the
     Forever skill tabs. "safe" = wrong spellings that are ALWAYS this class;
     "paired" = spellings that are only fixed when the English text next to
     them names the class (e.g. a word that is also a normal NPC noun).
     tools/class_names.py reads THIS block and pushes it into the glossary,
     classes.json, spells.json, the 9 class files, every {{cls:EN|FA}}
     marker and the item tooltips: a rename happens ONCE, here.
     (ASCII file: Persian is \u-escaped so pushes stay byte-exact; the
     readable table lives in docs/CLASS_NAMES.md.)

   Runtime (no engine change in tr.js):
     WFCLS.name(en, fallback) = the user's own name (custom room) > the canon
       > the data fallback. Used by spellbook.js class/tab labels.
     WFTR.faTokens() gets the FA side of every {{cls:EN|FA}} marker rewritten
       through WFCLS.name before tr.js resolves the namesClass switch.
     WFTR.CLASSES (retail.js chips) follows the table (Evoker added).
     Works whichever of tr.js / clsnames.js loads first (window.WFTR setter).
     The namesClass menu row example + count follow the table too.
   Editor: translate.html #cls-room - per-user names (localStorage
     wf-cls-ov), live preview through WFTR.faTokens, JSON export so a
     proposal can become the canon: python3 tools/class_names.py --canon
     <exported.json> --apply.
*/
(function () {
  "use strict";
  var DATA = /*WFCLS-JSON*/{"v": 1, "updated": "2026-11-01",
 "classes": [
  {"en": "Warrior", "slug": "warrior", "color": "#C69B6D", "fa": "\u062c\u0646\u06af\u0627\u0648\u0631", "forever": true, "safe": ["\u0648\u0627\u0631\u06cc\u0631"], "paired": ["\u062c\u0646\u06af\u062c\u0648"], "specs": [["Arms", "\u0633\u0644\u0627\u062d\u200c\u0647\u0627", "fr"], ["Fury", "\u062e\u0634\u0645", "fr"], ["Protection", "\u062d\u0641\u0627\u0638\u062a", "fr"]]},
  {"en": "Paladin", "slug": "paladin", "color": "#F48CBA", "fa": "\u067e\u0627\u0644\u0627\u062f\u06cc\u0646", "forever": true, "safe": ["\u067e\u0627\u0644\u0627\u062a\u06cc\u0646"], "paired": [], "specs": [["Holy", "\u0645\u0642\u062f\u0633", "fr"], ["Protection", "\u062d\u0641\u0627\u0638\u062a", "fr"], ["Retribution", "\u06a9\u06cc\u0641\u0631", "fr"]]},
  {"en": "Hunter", "slug": "hunter", "color": "#AAD372", "fa": "\u0634\u06a9\u0627\u0631\u0686\u06cc", "forever": true, "safe": ["\u0647\u0627\u0646\u062a\u0631"], "paired": [], "specs": [["Beast Mastery", "\u0627\u0633\u062a\u0627\u062f\u06cc \u062d\u06cc\u0648\u0627\u0646", "fr"], ["Marksmanship", "\u062a\u06cc\u0631\u0627\u0646\u062f\u0627\u0632\u06cc", "fr"], ["Survival", "\u0628\u0642\u0627", "fr"]]},
  {"en": "Rogue", "slug": "rogue", "color": "#FFF468", "fa": "\u0631\u0627\u0647\u0632\u0646", "forever": true, "safe": ["\u0631\u0648\u06af"], "paired": ["\u0631\u0647\u0632\u0646"], "specs": [["Assassination", "\u062a\u0631\u0648\u0631", "fr"], ["Combat", "\u0646\u0628\u0631\u062f", "f"], ["Outlaw", "\u06cc\u0627\u063a\u06cc", "r"], ["Subtlety", "\u0632\u06cc\u0631\u06a9\u06cc", "fr"]]},
  {"en": "Priest", "slug": "priest", "color": "#FFFFFF", "fa": "\u0631\u0648\u062d\u0627\u0646\u06cc", "forever": true, "safe": ["\u067e\u0631\u06cc\u0633\u062a"], "paired": ["\u06a9\u0627\u0647\u0646"], "specs": [["Discipline", "\u0627\u0646\u0636\u0628\u0627\u0637", "fr"], ["Holy", "\u0645\u0642\u062f\u0633", "fr"], ["Shadow Magic", "\u062c\u0627\u062f\u0648\u06cc \u0633\u0627\u06cc\u0647", "f"], ["Shadow", "\u0633\u0627\u06cc\u0647", "r"]]},
  {"en": "Shaman", "slug": "shaman", "color": "#0070DD", "fa": "\u0634\u0645\u0646", "forever": true, "safe": ["\u0634\u0627\u0645\u0627\u0646"], "paired": [], "specs": [["Elemental Combat", "\u0646\u0628\u0631\u062f \u0628\u0646\u06cc\u0627\u062f\u06cc", "f"], ["Elemental", "\u0628\u0646\u06cc\u0627\u062f\u06cc", "r"], ["Enhancement", "\u062a\u0642\u0648\u06cc\u062a", "fr"], ["Restoration", "\u0628\u0627\u0632\u0633\u0627\u0632\u06cc", "fr"]]},
  {"en": "Mage", "slug": "mage", "color": "#3FC7EB", "fa": "\u062c\u0627\u062f\u0648\u06af\u0631", "forever": true, "safe": ["\u062c\u0627\u062f\u0648\u0645\u0646\u062f", "\u0645\u06cc\u062c", "\u0645\u0650\u06cc\u062c", "\u0645\u062c"], "paired": [], "specs": [["Arcane", "\u0627\u0633\u0631\u0627\u0631", "fr"], ["Fire", "\u0622\u062a\u0634", "fr"], ["Frost", "\u06cc\u062e", "fr"]]},
  {"en": "Warlock", "slug": "warlock", "color": "#8788EE", "fa": "\u0627\u062d\u0636\u0627\u0631\u06a9\u0646\u0646\u062f\u0647", "forever": true, "safe": ["\u0648\u0627\u0631\u0644\u0627\u06a9"], "paired": ["\u062c\u0627\u062f\u0648\u06af\u0631 \u0633\u06cc\u0627\u0647"], "specs": [["Affliction", "\u0631\u0646\u062c\u200c\u0631\u0633\u0627\u0646\u06cc", "fr"], ["Demonology", "\u0627\u0647\u0631\u06cc\u0645\u0646\u200c\u0634\u0646\u0627\u0633\u06cc", "fr"], ["Destruction", "\u0646\u0627\u0628\u0648\u062f\u06cc", "fr"]]},
  {"en": "Druid", "slug": "druid", "color": "#FF7C0A", "fa": "\u062f\u0631\u0648\u0626\u06cc\u062f", "forever": true, "safe": ["\u062f\u0631\u0648\u06cc\u06cc\u062f", "\u062f\u0631\u0648\u06cc\u062f"], "paired": [], "specs": [["Balance", "\u062a\u0639\u0627\u062f\u0644", "fr"], ["Feral Combat", "\u0646\u0628\u0631\u062f \u0648\u062d\u0634\u06cc", "f"], ["Feral", "\u0648\u062d\u0634\u06cc", "r"], ["Guardian", "\u0646\u06af\u0647\u0628\u0627\u0646", "r"], ["Restoration", "\u0628\u0627\u0632\u0633\u0627\u0632\u06cc", "fr"]]},
  {"en": "Death Knight", "slug": "death-knight", "color": "#E0405A", "fa": "\u0634\u0648\u0627\u0644\u06cc\u0647\u0654 \u0645\u0631\u06af", "forever": false, "safe": ["\u0634\u0648\u0627\u0644\u06cc\u0647\u200c\u06cc \u0645\u0631\u06af", "\u0634\u0648\u0627\u0644\u06cc\u0647 \u06cc \u0645\u0631\u06af", "\u0634\u0648\u0627\u0644\u06cc\u0647 \u0645\u0631\u06af", "\u062f\u062b\u200c\u0646\u0627\u06cc\u062a", "\u062f\u062b \u0646\u0627\u06cc\u062a"], "paired": [], "specs": [["Blood", "\u062e\u0648\u0646", "r"], ["Frost", "\u06cc\u062e", "r"], ["Unholy", "\u0646\u0627\u0645\u0642\u062f\u0633", "r"]]},
  {"en": "Demon Hunter", "slug": "demon-hunter", "color": "#C558E8", "fa": "\u0634\u06a9\u0627\u0631\u0686\u06cc \u0634\u06cc\u0637\u0627\u0646", "forever": false, "safe": ["\u062f\u06cc\u0645\u0646 \u0647\u0627\u0646\u062a\u0631", "\u062f\u06cc\u0645\u0646\u200c\u0647\u0627\u0646\u062a\u0631"], "paired": ["\u0634\u06a9\u0627\u0631\u0686\u06cc \u0627\u0647\u0631\u06cc\u0645\u0646"], "specs": [["Havoc", "\u0648\u06cc\u0631\u0627\u0646\u06cc", "r"], ["Vengeance", "\u0627\u0646\u062a\u0642\u0627\u0645", "r"], ["Devourer", "\u0628\u0644\u0639\u0646\u062f\u0647", "r"]]},
  {"en": "Monk", "slug": "monk", "color": "#00FF98", "fa": "\u0631\u0627\u0647\u0628", "forever": false, "safe": ["\u0645\u0627\u0646\u06a9"], "paired": [], "specs": [["Brewmaster", "\u0627\u0633\u062a\u0627\u062f \u062f\u0645\u200c\u0646\u0648\u0634", "r"], ["Mistweaver", "\u0645\u0647\u200c\u0628\u0627\u0641", "r"], ["Windwalker", "\u0628\u0627\u062f\u067e\u06cc\u0645\u0627", "r"]]},
  {"en": "Evoker", "slug": "evoker", "color": "#33937F", "fa": "\u0627\u0698\u062f\u0647\u0627\u062e\u0648\u0627\u0646", "forever": false, "safe": ["\u0627\u06cc\u0648\u0648\u06a9\u0631", "\u0627\u0648\u0648\u06a9\u0631"], "paired": [], "specs": [["Devastation", "\u0648\u06cc\u0631\u0627\u0646\u06af\u0631\u06cc", "r"], ["Preservation", "\u067e\u0627\u0633\u062f\u0627\u0631\u06cc", "r"], ["Augmentation", "\u062a\u0648\u0627\u0646\u200c\u0627\u0641\u0632\u0627\u06cc\u06cc", "r"]]}
 ],
 "skills": [
  ["Beast Training", "\u0622\u0645\u0648\u0632\u0634 \u062d\u06cc\u0648\u0627\u0646"],
  ["Comprehension", "\u0641\u0647\u0645 \u0627\u0633\u06a9\u0631\u0648\u0644"],
  ["Lockpicking", "\u06a9\u0644\u06cc\u062f\u0632\u0646\u06cc"],
  ["Poisons", "\u0632\u0647\u0631\u0647\u0627"],
  ["Mounts", "\u0645\u0631\u06a9\u0628\u200c\u0647\u0627"]
 ]}/*END-WFCLS-JSON*/;
  var KEY = "wf-cls-ov";
  var CANON = {}, META = {}, ORDER = [];
  function lk(s) { return String(s == null ? "" : s).trim().toLowerCase(); }
  function addName(en, fa, kind, cls) {
    var k = lk(en);
    if (META[k]) { if (cls && META[k].classes.indexOf(cls) < 0) META[k].classes.push(cls); return; }
    CANON[k] = fa;
    META[k] = { en: en, kind: kind, classes: cls ? [cls] : [] };
    ORDER.push(en);
  }
  DATA.classes.forEach(function (c) {
    addName(c.en, c.fa, "class", null);
    (c.specs || []).forEach(function (s) { addName(s[0], s[1], "spec", c.en); });
  });
  (DATA.skills || []).forEach(function (s) { addName(s[0], s[1], "skill", null); });

  var ov = loadOv();
  var listeners = [];
  var TR = null;
  function loadOv() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || "{}"), r = {}, k;
      if (o && typeof o === "object") for (k in o) if (typeof o[k] === "string" && META[lk(k)]) r[lk(k)] = o[k];
      return r;
    } catch (e) { return {}; }
  }
  function saveOv() {
    try {
      if (Object.keys(ov).length) localStorage.setItem(KEY, JSON.stringify(ov));
      else localStorage.removeItem(KEY);
    } catch (e) { /* private mode */ }
  }
  function clean(s) {
    return String(s == null ? "" : s).replace(/[{}|<>\x00-\x1f]/g, "").replace(/\s+/g, " ").trim().slice(0, 40);
  }
  function canon(en) { return CANON[lk(en)] || ""; }
  function own(en) { var v = ov[lk(en)]; return typeof v === "string" ? v : ""; }
  function name(en, fallback) { return own(en) || canon(en) || (fallback == null ? "" : String(fallback)); }
  function faNum(v) { return String(v).replace(/[0-9]/g, function (d) { return "\u06f0\u06f1\u06f2\u06f3\u06f4\u06f5\u06f6\u06f7\u06f8\u06f9".charAt(+d); }); }
  function escH(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function unesc(s) { return String(s).replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&"); }

  /* ---------- change propagation ---------- */
  function changed(noRender) {
    syncClasses(TR);
    for (var i = 0; i < listeners.length; i++) try { listeners[i](); } catch (e) { /* keep going */ }
    fixMenus();
    /* re-render every page renderer: setMode(current) keeps the switches
       exactly as they are and fires tr.js's onChange listeners */
    if (!noRender && TR && TR.setMode && TR.mode) TR.setMode(TR.mode());
  }
  function set(en, fa) {
    var k = lk(en), v = clean(fa);
    if (!META[k]) return false;
    if (!v || v === CANON[k]) delete ov[k]; else ov[k] = v;
    saveOv(); changed();
    return true;
  }
  function reset(en) {
    if (en == null) ov = {}; else delete ov[lk(en)];
    saveOv(); changed();
  }
  function exportObj() {
    var names = {}, k;
    for (k in ov) names[META[k].en] = ov[k];
    return { v: 1, kind: "wowfarsi-class-names", names: names };
  }

  /* ---------- tr.js integration ---------- */
  var CLS_RE = /\{\{cls:([^|}]*)\|([^}]*)\}\}/g;
  function rewrite(txt) {
    return String(txt).replace(CLS_RE, function (m, en, fa) {
      var k = lk(unesc(en));
      if (!META[k]) return m;
      return "{{cls:" + en + "|" + escH(name(META[k].en, unesc(fa))) + "}}";
    });
  }
  function syncClasses(tr) {
    if (!tr || !tr.CLASSES) return;
    DATA.classes.forEach(function (c) { tr.CLASSES[c.en] = name(c.en, tr.CLASSES[c.en]); });
  }
  function patch(tr) {
    if (!tr || tr.__wfcls) return;
    tr.__wfcls = 1;
    TR = tr;
    var orig = tr.faTokens;
    if (typeof orig === "function") {
      tr.faTokens = function (txt, linker) { return orig.call(tr, rewrite(txt), linker); };
    }
    tr.className = name;
    syncClasses(tr);
    if (Object.keys(ov).length && tr.setMode && tr.mode) setTimeout(function () { tr.setMode(tr.mode()); }, 0);
  }
  if (window.WFTR) patch(window.WFTR);
  else {
    var held;
    try {
      Object.defineProperty(window, "WFTR", {
        configurable: true, enumerable: true,
        get: function () { return held; },
        set: function (v) { held = v; patch(v); }
      });
    } catch (e) {
      var tries = 0, iv = setInterval(function () {
        if (window.WFTR || ++tries > 200) { clearInterval(iv); patch(window.WFTR); }
      }, 50);
    }
  }

  /* ---------- the namesClass menu row (drawer + studio) ---------- */
  function sample() { return [name("Warrior"), name("Mage"), name("Rogue"), name("Beast Mastery")].join("\u060c "); }
  function fixMenus() {
    if (typeof document === "undefined" || !document.querySelectorAll) return;
    var rows = document.querySelectorAll(".tr-row-namesClass"), i, s = sample(), cnt = faNum(ORDER.length);
    for (i = 0; i < rows.length; i++) {
      var ex = rows[i].querySelector(".tr-ex");
      if (ex && ex.textContent !== s) ex.textContent = s;
      var n = rows[i].querySelector(".tr-n");
      if (n && n.textContent !== cnt) n.textContent = cnt;
      if (document.getElementById("cls-room") && rows[i].closest && rows[i].closest("#str-menu") &&
          !rows[i].querySelector(".wfcls-jump")) {
        var lbl = rows[i].querySelector(".tr-lbl");
        if (lbl) lbl.insertAdjacentHTML("beforeend", '<a class="wfcls-jump" href="#cls-room">\u0648\u06cc\u0631\u0627\u06cc\u0634 \u0627\u0633\u0645\u200c\u0647\u0627 \u2193</a>');
      }
    }
  }

  /* ---------- the editor (translate.html #cls-room) ---------- */
  var WHERE = { f: "\u0641\u0648\u0631\u0648\u0631", r: "\u0645\u06cc\u062f\u0646\u0627\u06cc\u062a", fr: "\u0641\u0648\u0631\u0648\u0631 \u00b7 \u0645\u06cc\u062f\u0646\u0627\u06cc\u062a" };
  var CSS = ".wfcls-room{position:relative;z-index:2;margin:2.2rem 0 0;padding:1.4rem;border:1px solid rgba(240,199,94,.16);border-radius:16px;background:rgba(12,10,8,.6);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}"
    + ".wfcls-head h2{margin:0 0 .35rem;font-size:1.15rem;color:#f0c75e}"
    + ".wfcls-head p{margin:0 0 .9rem;font-size:.86rem;line-height:1.9;color:#c3bdb0}"
    + ".wfcls-bar,.wfcls-foot{display:flex;flex-wrap:wrap;gap:.6rem;align-items:center}"
    + ".wfcls-bar{margin-bottom:.8rem}.wfcls-foot{margin-top:1rem}"
    + ".wfcls-btn{font:inherit;font-size:.82rem;padding:.42rem .85rem;border-radius:999px;border:1px solid rgba(240,199,94,.35);background:rgba(240,199,94,.08);color:#f0e6cf;cursor:pointer}"
    + ".wfcls-btn:hover{background:rgba(240,199,94,.16)}"
    + ".wfcls-sw[aria-pressed=\"true\"]{background:rgba(240,199,94,.22);color:#f0c75e}"
    + ".wfcls-q{flex:1 1 200px;min-width:0;font:inherit;font-size:.85rem;padding:.42rem .85rem;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.35);color:#eee}"
    + ".wfcls-cnt,.wfcls-msg{font-size:.78rem;color:#9a937f}.wfcls-msg.ok{color:#9fd88b}"
    + ".wfcls-prev{display:grid;gap:.25rem;padding:.7rem .9rem;margin-bottom:1rem;border-radius:12px;background:rgba(0,0,0,.35);font-size:.88rem;line-height:1.8}"
    + ".wfcls-prev small{display:inline-block;min-width:5.2rem;color:#8d8676;margin-inline-end:.6rem;font-size:.74rem}"
    + ".wfcls-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:.8rem}"
    + ".wfcls-card{border:1px solid rgba(255,255,255,.08);border-top:2px solid var(--c,#f0c75e);border-radius:12px;padding:.75rem .8rem;background:rgba(0,0,0,.28)}"
    + ".wfcls-card[hidden]{display:none}"
    + ".wfcls-ch{display:flex;align-items:center;gap:.45rem;margin-bottom:.55rem}"
    + ".wfcls-ch b{color:var(--c,#f0c75e);font-size:.95rem}"
    + ".wfcls-ch small{margin-inline-start:auto;font-size:.7rem;color:#8d8676}"
    + ".wfcls-dot{width:.55rem;height:.55rem;border-radius:50%;background:var(--c,#f0c75e);box-shadow:0 0 8px var(--c,#f0c75e)}"
    + ".wfcls-f{display:grid;grid-template-columns:minmax(4.5rem,38%) 1fr 1.6rem;align-items:center;gap:.4rem;margin:.28rem 0}"
    + ".wfcls-main{padding-bottom:.5rem;margin-bottom:.45rem;border-bottom:1px dashed rgba(255,255,255,.09)}"
    + ".wfcls-l{font-size:.78rem;color:#a9a290;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"
    + ".wfcls-f input{width:100%;box-sizing:border-box;min-width:0;font:inherit;font-size:.86rem;padding:.32rem .55rem;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.4);color:#f2ead6}"
    + ".wfcls-f input::placeholder{color:#d8cfb8;opacity:.7}"
    + ".wfcls-f input.has{border-color:rgba(240,199,94,.6);color:#f0c75e}"
    + ".wfcls-f button{font:inherit;width:1.6rem;height:1.8rem;border-radius:8px;border:0;background:transparent;color:#8d8676;cursor:pointer;visibility:hidden}"
    + ".wfcls-f input.has+button{visibility:visible}.wfcls-f button:hover{color:#f0c75e}"
    + ".wfcls-jump{display:block;margin-top:.2rem;font-size:.74rem;color:#f0c75e;text-decoration:none}"
    + "@media (max-width:560px){.wfcls-room{padding:1rem}.wfcls-f{grid-template-columns:minmax(4rem,36%) 1fr 1.6rem}}";
  function injectCss() {
    if (document.getElementById("wfcls-css")) return;
    var st = document.createElement("style");
    st.id = "wfcls-css";
    st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }
  function field(en, label, cls, title) {
    var k = lk(en), v = own(en);
    return '<div class="wfcls-f' + (cls ? " " + cls : "") + '">'
      + '<span class="wfcls-l"' + (title ? ' title="' + escH(title) + '"' : "") + (cls ? "" : ' dir="ltr"') + ">" + escH(label) + "</span>"
      + '<input type="text" maxlength="40" dir="rtl" data-k="' + escH(k) + '" class="' + (v ? "has" : "") + '"'
      + ' placeholder="' + escH(CANON[k]) + '" value="' + escH(v) + '" aria-label="' + escH(META[k].en) + '">'
      + '<button type="button" data-reset="' + escH(k) + '" title="\u0628\u0631\u06af\u0631\u062f\u0627\u0646\u062f\u0646 \u0628\u0647 \u0627\u0633\u0645 \u0633\u0627\u06cc\u062a" aria-label="\u0628\u0631\u06af\u0631\u062f\u0627\u0646\u062f\u0646">\u21ba</button>'
      + "</div>";
  }
  function cardHtml(title, color, badge, mainEn, rows) {
    var words = [title];
    if (mainEn) words.push(CANON[lk(mainEn)]);
    rows.forEach(function (r) { words.push(r[0], CANON[lk(r[0])]); });
    var h = '<div class="wfcls-card" style="--c:' + escH(color) + '" data-s="' + escH(words.join(" ").toLowerCase()) + '">'
      + '<div class="wfcls-ch"><i class="wfcls-dot" aria-hidden="true"></i><b dir="ltr">' + escH(title) + "</b><small>" + escH(badge) + "</small></div>";
    if (mainEn) h += field(mainEn, "\u0627\u0633\u0645 \u06a9\u0644\u0627\u0633", "wfcls-main");
    rows.forEach(function (r) { h += field(r[0], r[0], "", r[1]); });
    return h + "</div>";
  }
  function editorHtml() {
    var h = '<div class="wfcls-head"><h2>\u0627\u0633\u0645 \u06a9\u0644\u0627\u0633\u200c\u0647\u0627 \u0648 \u0634\u0627\u062e\u0647\u200c\u0647\u0627</h2>'
      + "<p>\u06cc\u06a9 \u062c\u062f\u0648\u0644 \u0648\u0627\u062d\u062f \u0628\u0631\u0627\u06cc \u06a9\u0644 \u0633\u0627\u06cc\u062a: \u062a\u0648\u0644\u062a\u06cc\u067e\u200c\u0647\u0627\u060c \u06a9\u062a\u0627\u0628 \u0627\u0633\u067e\u0644\u060c \u062a\u0644\u0646\u062a\u200c\u0647\u0627 \u0648 Midnight \u0647\u0645\u0647 \u0627\u0633\u0645 \u06a9\u0644\u0627\u0633 \u0648 \u0634\u0627\u062e\u0647 \u0631\u0627 \u0627\u0632 \u0647\u0645\u06cc\u0646\u200c\u062c\u0627 \u0645\u06cc\u200c\u06af\u06cc\u0631\u0646\u062f. "
      + "\u062e\u0627\u0646\u0647\u0654 \u062e\u0627\u0644\u06cc \u06cc\u0639\u0646\u06cc \u0627\u0633\u0645 \u067e\u06cc\u0634\u200c\u0641\u0631\u0636 \u0633\u0627\u06cc\u062a\u061b \u0627\u06af\u0631 \u0627\u0633\u0645 \u062f\u06cc\u06af\u0631\u06cc \u062f\u0648\u0633\u062a \u062f\u0627\u0631\u06cc \u0628\u0646\u0648\u06cc\u0633\u060c \u0647\u0645\u0627\u0646 \u0644\u062d\u0638\u0647 \u0647\u0645\u0647\u200c\u062c\u0627\u06cc \u0633\u0627\u06cc\u062a \u0628\u0631\u0627\u06cc \u062e\u0648\u062f\u062a \u0639\u0648\u0636 \u0645\u06cc\u200c\u0634\u0648\u062f.</p>"
      + '<div class="wfcls-bar"><button type="button" class="wfcls-btn wfcls-sw" aria-pressed="false"></button>'
      + '<input type="search" class="wfcls-q" placeholder="\u062c\u0633\u062a\u062c\u0648\u06cc \u06a9\u0644\u0627\u0633 \u06cc\u0627 \u0634\u0627\u062e\u0647\u2026" aria-label="\u062c\u0633\u062a\u062c\u0648\u06cc \u06a9\u0644\u0627\u0633 \u06cc\u0627 \u0634\u0627\u062e\u0647">'
      + '<span class="wfcls-cnt"></span></div>'
      + '<div class="wfcls-prev" aria-live="polite"></div></div>';
    h += '<div class="wfcls-grid">';
    DATA.classes.forEach(function (c) {
      var rows = (c.specs || []).map(function (s) { return [s[0], WHERE[s[2]] || ""]; });
      h += cardHtml(c.en, c.color, c.forever ? "\u0641\u0648\u0631\u0648\u0631 \u00b7 \u0645\u06cc\u062f\u0646\u0627\u06cc\u062a" : "\u0645\u06cc\u062f\u0646\u0627\u06cc\u062a", c.en, rows);
    });
    if (DATA.skills && DATA.skills.length) {
      h += cardHtml("Forever skills", "#b9a77a", "\u0634\u0627\u062e\u0647\u200c\u0647\u0627\u06cc \u0645\u0647\u0627\u0631\u062a\u06cc \u0641\u0648\u0631\u0648\u0631", null,
        DATA.skills.map(function (s) { return [s[0], "\u0641\u0648\u0631\u0648\u0631"]; }));
    }
    h += "</div>";
    h += '<div class="wfcls-foot"><button type="button" class="wfcls-btn wfcls-copy">\u06a9\u067e\u06cc \u0627\u0633\u0645\u200c\u0647\u0627\u06cc \u0645\u0646 (\u067e\u06cc\u0634\u0646\u0647\u0627\u062f \u0628\u0631\u0627\u06cc \u0633\u0627\u06cc\u062a)</button>'
      + '<button type="button" class="wfcls-btn wfcls-all">\u0647\u0645\u0647 \u0628\u0647 \u0627\u0633\u0645 \u067e\u06cc\u0634\u200c\u0641\u0631\u0636 \u0633\u0627\u06cc\u062a</button>'
      + '<span class="wfcls-msg" hidden></span></div>';
    return h;
  }
  function mk(en) { return "{{cls:" + META[lk(en)].en + "|" + canon(en) + "}}"; }
  function previewHtml() {
    var lines = [
      ["\u062e\u0637 \u06a9\u0644\u0627\u0633\u200c\u0647\u0627", "\u06a9\u0644\u0627\u0633\u200c\u0647\u0627: " + mk("Mage") + "\u060c " + mk("Warlock") + "\u060c " + mk("Priest")],
      ["\u0646\u06cc\u0627\u0632\u0645\u0646\u062f\u06cc", "\u0646\u06cc\u0627\u0632\u0645\u0646\u062f " + mk("Rogue") + " \u00b7 \u0646\u06cc\u0627\u0632\u0645\u0646\u062f " + mk("Warrior")],
      ["\u0634\u0627\u062e\u0647", "\u0634\u0627\u062e\u0647\u0654 " + mk("Fire") + " (" + mk("Mage") + ") \u00b7 \u0634\u0627\u062e\u0647\u0654 " + mk("Beast Mastery") + " (" + mk("Hunter") + ")"]
    ];
    return lines.map(function (l) {
      var t = escH(l[1]);
      var html = TR && TR.faTokens ? TR.faTokens(t) : escH(rewrite(l[1]).replace(CLS_RE, "$2"));
      return "<div><small>" + escH(l[0]) + "</small>" + html + "</div>";
    }).join("");
  }
  function mountEditor(el) {
    if (!el || el.__wfcls) return;
    el.__wfcls = 1;
    injectCss();
    if (!el.classList.contains("wfcls-room")) el.classList.add("wfcls-room");
    el.innerHTML = editorHtml();
    var sw = el.querySelector(".wfcls-sw"), prev = el.querySelector(".wfcls-prev");
    var cntEl = el.querySelector(".wfcls-cnt"), msg = el.querySelector(".wfcls-msg");
    var timers = {}, msgT = null;
    function say(t, ok) {
      msg.hidden = false; msg.textContent = t; msg.className = "wfcls-msg" + (ok ? " ok" : "");
      clearTimeout(msgT); msgT = setTimeout(function () { msg.hidden = true; }, 2800);
    }
    function paint() {
      var on = !TR || !TR.on || TR.on("namesClass");
      sw.setAttribute("aria-pressed", on ? "true" : "false");
      sw.textContent = on ? "\u06a9\u0644\u06cc\u062f \u00ab\u0627\u0633\u0645 \u06a9\u0644\u0627\u0633\u200c\u0647\u0627 \u0648 \u0634\u0627\u062e\u0647\u200c\u0647\u0627\u00bb: \u0631\u0648\u0634\u0646" : "\u06a9\u0644\u06cc\u062f \u00ab\u0627\u0633\u0645 \u06a9\u0644\u0627\u0633\u200c\u0647\u0627 \u0648 \u0634\u0627\u062e\u0647\u200c\u0647\u0627\u00bb: \u062e\u0627\u0645\u0648\u0634 (\u0627\u0633\u0645\u200c\u0647\u0627 \u0627\u0646\u06af\u0644\u06cc\u0633\u06cc\u200c\u0627\u0646\u062f)";
      prev.innerHTML = previewHtml();
      var n = Object.keys(ov).length;
      cntEl.textContent = n ? faNum(n) + " \u0627\u0633\u0645 \u0627\u0632 \u062e\u0648\u062f\u062a" : "\u0647\u0645\u0647 \u0627\u0633\u0645 \u067e\u06cc\u0634\u200c\u0641\u0631\u0636 \u0633\u0627\u06cc\u062a";
    }
    function syncInputs(k, v) {
      [].slice.call(el.querySelectorAll('input[data-k="' + k.replace(/"/g, "") + '"]')).forEach(function (inp) {
        if (inp.value !== v) inp.value = v;
        inp.className = v ? "has" : "";
      });
    }
    el.addEventListener("input", function (e) {
      var inp = e.target;
      if (!inp || !inp.getAttribute || !inp.getAttribute("data-k")) return;
      var k = inp.getAttribute("data-k");
      var v = clean(inp.value);
      inp.className = v && v !== CANON[k] ? "has" : "";
      [].slice.call(el.querySelectorAll('input[data-k="' + k.replace(/"/g, "") + '"]')).forEach(function (o) {
        if (o !== inp) { o.value = inp.value; o.className = inp.className; }
      });
      clearTimeout(timers[k]);
      timers[k] = setTimeout(function () { set(META[k].en, v); paint(); }, 280);
    });
    el.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("button") : null;
      if (!b) return;
      var rk = b.getAttribute("data-reset");
      if (rk) { clearTimeout(timers[rk]); reset(META[rk].en); syncInputs(rk, ""); paint(); return; }
      if (b.classList.contains("wfcls-sw")) { if (TR && TR.toggle) TR.toggle("namesClass"); paint(); return; }
      if (b.classList.contains("wfcls-all")) {
        reset();
        [].slice.call(el.querySelectorAll("input[data-k]")).forEach(function (i) { i.value = ""; i.className = ""; });
        paint(); say("\u0647\u0645\u0647 \u0628\u0647 \u0627\u0633\u0645 \u067e\u06cc\u0634\u200c\u0641\u0631\u0636 \u0633\u0627\u06cc\u062a \u0628\u0631\u06af\u0634\u062a \u2713", true); return;
      }
      if (b.classList.contains("wfcls-copy")) {
        var n = Object.keys(ov).length;
        if (!n) { say("\u0647\u0646\u0648\u0632 \u0627\u0633\u0645\u06cc \u0639\u0648\u0636 \u0646\u06a9\u0631\u062f\u0647\u200c\u0627\u06cc", false); return; }
        var txt = JSON.stringify(exportObj(), null, 1);
        var done = function () { say("\u06a9\u067e\u06cc \u0634\u062f \u2713 \u0627\u06af\u0631 \u0641\u06a9\u0631 \u0645\u06cc\u200c\u06a9\u0646\u06cc \u0627\u0633\u0645 \u0628\u0647\u062a\u0631\u06cc \u0627\u0633\u062a \u0628\u0631\u0627\u06cc \u0645\u0627 \u0628\u0641\u0631\u0633\u062a", true); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { fallbackCopy(txt); done(); });
        else { fallbackCopy(txt); done(); }
      }
    });
    el.querySelector(".wfcls-q").addEventListener("input", function () {
      var q = this.value.trim().toLowerCase();
      [].slice.call(el.querySelectorAll(".wfcls-card")).forEach(function (c) {
        c.hidden = !!q && c.getAttribute("data-s").indexOf(q) < 0;
      });
    });
    if (TR && TR.onChange) TR.onChange(paint);
    listeners.push(paint);
    paint();
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  /* ---------- boot ---------- */
  if (typeof window.addEventListener === "function") {
    window.addEventListener("storage", function (e) {
      if (e.key !== KEY) return;
      ov = loadOv();
      changed();
    });
  }
  function boot() {
    var room = document.getElementById("cls-room");
    if (room) mountEditor(room);
    fixMenus();
    if (window.MutationObserver && document.body) {
      var pend = false;
      var mo = new MutationObserver(function () {
        if (pend) return;
        pend = true;
        setTimeout(function () { pend = false; fixMenus(); }, 60);
      });
      mo.observe(document.body, { childList: true, subtree: true });
      setTimeout(function () { mo.disconnect(); }, 20000);
    }
  }
  if (typeof document !== "undefined" && document.addEventListener) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
  }

  window.WFCLS = {
    name: name,
    canon: canon,
    own: own,
    set: set,
    reset: reset,
    list: function () { return ORDER.map(function (en) { var m = META[lk(en)]; return { en: en, kind: m.kind, classes: m.classes.slice(), canon: CANON[lk(en)], own: own(en) }; }); },
    overrides: function () { return exportObj().names; },
    exportJson: function () { return JSON.stringify(exportObj(), null, 1); },
    onChange: function (cb) { listeners.push(cb); },
    rewrite: rewrite,
    mountEditor: mountEditor,
    DATA: DATA
  };
})();
