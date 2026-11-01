/* =========================================================
   wowfarsi — index page logic (vanilla, no dependencies)
   ========================================================= */
"use strict";

/* ---------- data snapshot (source: repo data/live 12.1.5.70575) ---------- */
const REPO_URL = "https://github.com/pvwvuow/wowfa";
const PR_URL = "https://github.com/pvwvuow/wowfa/pull/2";
const CLONE_CMD = "git clone https://github.com/pvwvuow/wowfa.git";

/* fa = how Persian gamers say the class (transliteration, not a translation) */
const CLASSES = [
  { id: 1, en: "Warrior", fa: "واریور", color: "#C69B6D", talents: 224, done: 0, specs: [{ n: "Arms", h: "Colossus · Slayer" }, { n: "Fury", h: "Mountain Thane · Slayer" }, { n: "Protection", h: "Colossus · Mountain Thane" }], heroes: ["Colossus", "Mountain Thane", "Slayer"] },
  { id: 2, en: "Paladin", fa: "پالادین", color: "#F48CBA", talents: 265, done: 0, specs: [{ n: "Holy", h: "Herald of the Sun · Lightsmith" }, { n: "Protection", h: "Lightsmith · Templar" }, { n: "Retribution", h: "Herald of the Sun · Templar" }], heroes: ["Herald of the Sun", "Lightsmith", "Templar"] },
  { id: 3, en: "Hunter", fa: "شکارچی", color: "#AAD372", talents: 238, done: 0, specs: [{ n: "Beast Mastery", h: "Dark Ranger · Pack Leader" }, { n: "Marksmanship", h: "Dark Ranger · Sentinel" }, { n: "Survival", h: "Pack Leader · Sentinel" }], heroes: ["Dark Ranger", "Pack Leader", "Sentinel"] },
  { id: 4, en: "Rogue", fa: "راگ", color: "#FFF468", talents: 241, done: 0, specs: [{ n: "Assassination", h: "Deathstalker · Fatebound" }, { n: "Outlaw", h: "Fatebound · Trickster" }, { n: "Subtlety", h: "Deathstalker · Trickster" }], heroes: ["Deathstalker", "Fatebound", "Trickster"] },
  { id: 5, en: "Priest", fa: "روحانی", color: "#EDEDF2", talents: 252, done: 0, specs: [{ n: "Discipline", h: "Oracle · Voidweaver" }, { n: "Holy", h: "Archon · Oracle" }, { n: "Shadow", h: "Archon · Voidweaver" }], heroes: ["Archon", "Oracle", "Voidweaver"] },
  { id: 6, en: "Death Knight", fa: "شوالیهٔ مرگ", color: "#C41E3A", talents: 224, done: 0, specs: [{ n: "Blood", h: "Deathbringer · San'layn" }, { n: "Frost", h: "Deathbringer · Rider of the Apocalypse" }, { n: "Unholy", h: "Rider of the Apocalypse · San'layn" }], heroes: ["Deathbringer", "San'layn", "Rider of the Apocalypse"] },
  { id: 7, en: "Shaman", fa: "شمن", color: "#3D9BFF", talents: 241, done: 0, specs: [{ n: "Elemental", h: "Farseer · Stormbringer" }, { n: "Enhancement", h: "Stormbringer · Totemic" }, { n: "Restoration", h: "Farseer · Totemic" }], heroes: ["Farseer", "Stormbringer", "Totemic"] },
  { id: 8, en: "Mage", fa: "جادوگر", color: "#3FC7EB", talents: 238, done: 0, specs: [{ n: "Arcane", h: "Spellslinger · Sunfury" }, { n: "Fire", h: "Frostfire · Sunfury" }, { n: "Frost", h: "Frostfire · Spellslinger" }], heroes: ["Frostfire", "Spellslinger", "Sunfury"] },
  { id: 9, en: "Warlock", fa: "احضارکننده", color: "#8F8FEF", talents: 230, done: 0, specs: [{ n: "Affliction", h: "Hellcaller · Soul Harvester" }, { n: "Demonology", h: "Diabolist · Soul Harvester" }, { n: "Destruction", h: "Diabolist · Hellcaller" }], heroes: ["Diabolist", "Hellcaller", "Soul Harvester"] },
  { id: 10, en: "Monk", fa: "راهب", color: "#00E68F", talents: 296, done: 0, specs: [{ n: "Brewmaster", h: "Master of Harmony · Shado-Pan" }, { n: "Windwalker", h: "Conduit of the Celestials · Shado-Pan" }, { n: "Mistweaver", h: "Conduit of the Celestials · Master of Harmony" }], heroes: ["Conduit of the Celestials", "Master of Harmony", "Shado-Pan"] },
  { id: 11, en: "Druid", fa: "دروئید", color: "#FF7C0A", talents: 326, done: 0, specs: [{ n: "Balance", h: "Elune's Chosen · Keeper of the Grove" }, { n: "Feral", h: "Druid of the Claw · Wildstalker" }, { n: "Guardian", h: "Druid of the Claw · Elune's Chosen" }, { n: "Restoration", h: "Keeper of the Grove · Wildstalker" }], heroes: ["Elune's Chosen", "Keeper of the Grove", "Druid of the Claw", "Wildstalker"] },
  { id: 12, en: "Demon Hunter", fa: "شکارچی شیطان", color: "#C558E8", talents: 232, done: 232, specs: [{ n: "Havoc", h: "Aldrachi Reaver · Fel-Scarred" }, { n: "Vengeance", h: "Aldrachi Reaver · Annihilator" }, { n: "Devourer", h: "Annihilator · Void-Scarred", isNew: true }], heroes: ["Aldrachi Reaver", "Fel-Scarred", "Annihilator", "Void-Scarred"] },
  { id: 13, en: "Evoker", fa: "ایوکر", color: "#45C4A5", talents: 237, done: 0, specs: [{ n: "Devastation", h: "Flameshaper · Scalecommander" }, { n: "Preservation", h: "Chronowarden · Flameshaper" }, { n: "Augmentation", h: "Chronowarden · Scalecommander" }], heroes: ["Flameshaper", "Scalecommander", "Chronowarden"] },
];

const FA = { total: 3368, done: 238, talentDone: 232, refDone: 6 };

/* ---------- helpers ---------- */
const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const fa = (v) => String(v).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
const faNum = (n) => fa(Number(n).toLocaleString("en-US")).replace(/,/g, "٬");
const pct = (done, total) => (total === 0 ? 0 : Math.round((done / total) * 1000) / 10);
const faPct = (p) => fa(String(p)) + "٪";
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const wfSlug = (en) => en.toLowerCase().replace(/\s+/g, "-");

const CLASS_SLUGS = {
  Warrior: "class_warrior", Paladin: "class_paladin", Hunter: "class_hunter",
  Rogue: "class_rogue", Priest: "class_priest", "Death Knight": "class_deathknight",
  Shaman: "class_shaman", Mage: "class_mage", Warlock: "class_warlock",
  Monk: "class_monk", Druid: "class_druid", "Demon Hunter": "class_demonhunter",
  Evoker: "class_evoker",
};
const classIconUrl = (en) => (CLASS_SLUGS[en] ? `icons/large/${CLASS_SLUGS[en]}.jpg` : null);
const ZAMIMG = (slug) => `https://wow.zamimg.com/images/wow/icons/large/${slug}.jpg`;

function crestHTML(cls, size, selected) {
  const slug = CLASS_SLUGS[cls.en];
  const url = classIconUrl(cls.en);
  const glow = selected ? `box-shadow:0 0 ${Math.round(size * 0.5)}px ${cls.color}73, 0 0 12px rgba(240,199,94,0.35);` : "";
  return `<span class="wf-crest" style="width:${size}px;height:${size}px;${glow}">
    <span class="wf-crest-in" style="width:100%;height:100%">
      <span class="font-cinzel" aria-hidden="true" style="position:absolute;inset:0;display:grid;place-items:center;font-size:${Math.round(size / 3.4)}px;font-weight:700;color:${cls.color};opacity:.9">${esc(cls.en[0])}</span>
      ${url ? `<img src="${url}" alt="" loading="lazy" onerror="this.style.display='none';if('${slug}'){this.onerror=null;this.src='${ZAMIMG(slug)}';this.style.display=''}">` : ""}
      ${selected ? '<span class="wf-crest-ring"></span>' : ""}
    </span>
  </span>`;
}

/* ---------- reveal on scroll ---------- */
function setupReveals(root) {
  const els = (root || document).querySelectorAll(".reveal:not(.is-in)");
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }
  }, { threshold: 0.12 });
  els.forEach((el) => io.observe(el));
}

/* ---------- count-up ---------- */
function countUp(el, target, duration = 1300) {
  const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / duration);
    el.textContent = faNum(Math.round(target * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- hero stats ---------- */
function initHeroStats() {
  const map = [
    ["stat-classes", 13, 1100],
    ["stat-specs", 40, 1300],
    ["stat-talents", 3244, 1700],
    ["stat-heroes", 44, 1500],
  ];
  for (const [id, n, d] of map) {
    const el = document.getElementById(id);
    if (!el) continue;
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { countUp(el, n, d); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
  }
}

/* ---------- real translation progress (counted from trees/<slug>.json) ---------- */
const WF_PROG = {};
function wfCount(tree) {
  const seen = new Set();
  let total = 0, done = 0;
  for (const sp of tree.specs || []) {
    for (const nd of sp.nodes || []) {
      for (const e of nd.en || []) {
        const k = nd.id + ":" + e.sid;
        if (seen.has(k)) continue;
        seen.add(k);
        total++;
        if (e.f) done++;
      }
    }
  }
  return { done, total };
}
function wfStat(c) {
  const p = WF_PROG[wfSlug(c.en)];
  return p ? p : { done: 0, total: c.talents };
}
async function wfLoadProgress() {
  await Promise.allSettled(CLASSES.map(async (c) => {
    try {
      const r = await fetch(`trees/${wfSlug(c.en)}.json`, { cache: "no-cache" });
      if (!r.ok) return;
      WF_PROG[wfSlug(c.en)] = wfCount(await r.json());
    } catch (_) { /* tree file missing: class not built yet */ }
  }));
  renderSpellbook();
  applyProgress();
}

/* ---------- classes section ---------- */
let selClass = CLASSES.find((c) => c.id === 2);
let query = "";

function renderClassCloud() {
  const cloud = document.getElementById("crest-cloud");
  if (!cloud) return;
  const q = query.trim().toLowerCase();
  const list = !q ? CLASSES : CLASSES.filter((c) =>
    c.en.toLowerCase().includes(q) || c.fa.includes(query.trim()) ||
    c.specs.some((s) => s.n.toLowerCase().includes(q))
  );
  const empty = document.getElementById("crest-empty");
  cloud.innerHTML = list.map((c) => `
    <button class="crest-cell" data-id="${c.id}" aria-pressed="${selClass.id === c.id}">
      <span style="display:inline-block">${crestHTML(c, 62, selClass.id === c.id)}</span>
      <span class="crest-name font-cinzel" dir="ltr" style="${selClass.id === c.id ? `color:${c.color}` : ""}">${esc(c.en)}</span>
      <span class="crest-fa">${esc(c.fa)}</span>
    </button>`).join("");
  empty.style.display = list.length ? "none" : "block";
  cloud.querySelectorAll(".crest-cell").forEach((btn) => {
    btn.addEventListener("click", () => {
      selClass = CLASSES.find((c) => c.id === Number(btn.dataset.id));
      renderClassCloud();
      renderSpellbook();
      openClassPortal(selClass, btn);
    });
  });
}

function renderSpellbook() {
  const el = document.getElementById("spellbook");
  if (!el) return;
  const c = selClass;
  const st = wfStat(c);
  const p = pct(st.done, st.total);
  const slug = wfSlug(c.en);
  el.innerHTML = `
    <div class="tome" style="--cc:${c.color}">
      <div class="tome-grid">
        <div class="tome-id">
          ${crestHTML(c, 92, true)}
          <h3 class="font-cinzel" dir="ltr" style="color:${c.color}">${esc(c.en)}</h3>
          <p class="tome-fa">${esc(c.fa)}</p>
          <div class="tome-stats">
            <div><b class="text-gold-grad">${faNum(c.talents)}</b><span>تلنت</span></div>
            <div><b class="text-gold-grad">${fa(c.specs.length)}</b><span>اسپک</span></div>
            <div><b class="text-gold-grad">${fa(c.heroes.length)}</b><span>Hero Tree</span></div>
          </div>
          <div class="tome-meter">
            <div class="tome-meter-line"><i style="width:${p}%"></i></div>
            <p>${p > 0 ? `ترجمه‌شده ${faPct(p)}` : "هنوز ترجمه نشده"}</p>
          </div>
          <a class="btn btn-medallion btn-sm" href="talents.html?class=${slug}">Talent Tree</a>
        </div>
        <div class="tome-specs">
          <p class="tome-cap"><span></span>اسپک‌ها و Hero Tree‌ها<span></span></p>
          ${c.specs.map((s) => `
            <div class="spec-card">
              <i class="spec-gem"></i>
              <div class="spec-body">
                <p class="spec-name font-cinzel">${esc(s.n)}${s.isNew ? '<em class="spec-new">New</em>' : ""}</p>
                <div class="spec-heroes">${s.h.split(" · ").map((h) => `<span class="hero-tag font-cinzel">${esc(h)}</span>`).join("")}</div>
              </div>
            </div>`).join("")}
        </div>
      </div>
    </div>`;
}

/* ---------- class portal: راهنما / تلنت chooser ----------
   Clicking a class crest opens a small fantasy panel offering the two
   paths: the spec guide (first ready guide from data/retail/index.json)
   and the class talent tree. Escape / backdrop / × close it. */
let RT_IX = null; /* data/retail/index.json -> { classSlug: [{slug, ready}, ...] } */

function rtGuideUrl(cls) {
  const slug = wfSlug(cls.en);
  const list = (RT_IX && RT_IX[slug]) || [];
  const spec = list.find((s) => s.ready);
  return spec ? `guide.html?spec=${spec.slug}-${slug}` : null;
}

const IC_BOOK = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>';
const IC_TREE = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>';
const IC_X = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

function closeClassPortal() {
  const portal = document.getElementById("wf-portal");
  if (!portal || !portal.classList.contains("open")) return;
  portal.classList.remove("open");
  document.body.style.overflow = "";
  if (portal._trigger && document.contains(portal._trigger)) {
    portal._trigger.focus({ preventScroll: true });
  }
}

function openClassPortal(c, trigger) {
  let portal = document.getElementById("wf-portal");
  if (!portal) {
    portal = document.createElement("div");
    portal.id = "wf-portal";
    portal.className = "wf-portal";
    portal.innerHTML = `
      <div class="wf-portal-backdrop" data-close></div>
      <div class="wf-portal-card" role="dialog" aria-modal="true" aria-label="راهنما یا تلنت">
        <button type="button" class="wf-portal-x" data-close aria-label="بستن">${IC_X}</button>
        <p class="wf-portal-cap font-cinzel" dir="ltr">Choose your path</p>
        <div class="wf-portal-id"></div>
        <div class="wf-portal-orn" aria-hidden="true"></div>
        <div class="wf-portal-opts"></div>
      </div>`;
    document.body.appendChild(portal);
    portal.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) closeClassPortal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeClassPortal();
    });
  }
  const slug = wfSlug(c.en);
  const gUrl = rtGuideUrl(c);
  portal.querySelector(".wf-portal-card").style.setProperty("--cc", c.color);
  portal.querySelector(".wf-portal-id").innerHTML = `
    ${crestHTML(c, 74, true)}
    <b class="font-cinzel" dir="ltr" style="color:${c.color}">${esc(c.en)}</b>
    <span>${esc(c.fa)}</span>`;
  portal.querySelector(".wf-portal-opts").innerHTML = `
    ${gUrl
      ? `<a class="wf-portal-opt" href="${gUrl}">
           <span class="wf-portal-ic" aria-hidden="true">${IC_BOOK}</span>
           <b>راهنما</b>
           <small>بیلد، روتیشن و گیرِ هر اسپک</small>
           <em class="font-cinzel" dir="ltr">GUIDE</em>
         </a>`
      : `<button type="button" class="wf-portal-opt is-soon" disabled>
           <span class="wf-portal-ic" aria-hidden="true">${IC_BOOK}</span>
           <b>راهنما</b>
           <small>به‌زودی</small>
           <em class="font-cinzel" dir="ltr">SOON</em>
         </button>`}
    <a class="wf-portal-opt" href="talents.html?class=${slug}">
      <span class="wf-portal-ic" aria-hidden="true">${IC_TREE}</span>
      <b>تلنت</b>
      <small>Talent Tree کامل کلاس</small>
      <em class="font-cinzel" dir="ltr">TALENTS</em>
    </a>`;
  portal._trigger = trigger || null;
  portal.classList.add("open");
  document.body.style.overflow = "hidden";
  const card = portal.querySelector(".wf-portal-card");
  if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "-1");
  card.focus({ preventScroll: true });
}

/* ---------- progress ---------- */
function gaugeSVG(value, size) {
  const r = size / 2 - 14;
  const C = 2 * Math.PI * r;
  const dash = C * 0.75;
  const off = dash * (1 - Math.min(100, Math.max(0, value)) / 100);
  return `<svg width="${size}" height="${size}" style="transform:rotate(-225deg)">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="rgba(240,199,94,0.10)" stroke-width="7" stroke-dasharray="${dash} ${C}" stroke-linecap="round"/>
    <circle id="gauge-arc" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#f0c75e" stroke-width="7" stroke-dasharray="${dash} ${C}" stroke-dashoffset="${dash}" stroke-linecap="round" style="transition:stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1);filter:drop-shadow(0 0 8px rgba(240,199,94,0.4))"/>
  </svg>`;
}

let progVisible = false;
let gaugeShown = 0;

function applyProgress() {
  const wrap = document.getElementById("gauge");
  const ledger = document.getElementById("class-progress");
  if (!wrap || !ledger || !progVisible) return;
  const stats = CLASSES.map(wfStat);
  const done = stats.reduce((a, s) => a + s.done, 0);
  const total = stats.reduce((a, s) => a + s.total, 0);
  const overall = pct(done, total);

  const arc = document.getElementById("gauge-arc");
  const r = 228 / 2 - 14, C = 2 * Math.PI * r, dash = C * 0.75;
  arc.style.strokeDashoffset = dash * (1 - overall / 100);
  const el = document.getElementById("gauge-pct");
  const from = gaugeShown, t0 = performance.now(), dur = 1500;
  const tick = (t) => {
    const k = Math.min(1, (t - t0) / dur);
    const v = from + (overall - from) * (1 - Math.pow(1 - k, 3));
    el.textContent = fa(v.toFixed(1));
    if (k < 1) requestAnimationFrame(tick); else gaugeShown = overall;
  };
  requestAnimationFrame(tick);
  document.getElementById("gauge-sub").textContent = `${faNum(done)} از ${faNum(total)} تلنت`;

  ledger.querySelectorAll(".class-progress").forEach((row, i) => {
    const s = stats[i];
    const p = pct(s.done, s.total);
    const f = row.querySelector(".cp-fill");
    f.dataset.w = p;
    setTimeout(() => { f.style.width = p + "%"; }, 80 + i * 40);
    row.querySelector(".cp-pct").textContent = faPct(p);
  });
}

function initProgress() {
  const wrap = document.getElementById("gauge");
  if (wrap) {
    wrap.innerHTML = `${gaugeSVG(0, 228)}
      <div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center">
        <div>
          <p class="text-gold-grad gauge-num"><span id="gauge-pct">۰</span>٪</p>
          <p class="gauge-cap">ترجمه‌شده</p>
        </div>
      </div>`;
  }
  const ledger = document.getElementById("class-progress");
  if (ledger) {
    ledger.innerHTML = CLASSES.map((cl) => `
      <div class="class-progress">
        <span class="cp-dot" style="border:1px solid ${cl.color};background:${cl.color}2e"></span>
        <span class="cp-name font-cinzel" dir="ltr">${esc(cl.en)}</span>
        <div class="cp-track"><div class="cp-fill" data-w="0" style="--c:${cl.color}"></div></div>
        <span class="cp-pct">${faPct(0)}</span>
      </div>`).join("");
  }
  const sect = document.getElementById("progress");
  if (sect) {
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { progVisible = true; applyProgress(); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(sect);
  }
}

/* ---------- copy button ---------- */
function initCopy() {
  const code = document.getElementById("clone-cmd");
  const btn = document.getElementById("copy-btn");
  if (!code || !btn) return;
  code.textContent = CLONE_CMD;
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CLONE_CMD);
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f0c75e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
      setTimeout(() => {
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
      }, 1600);
    } catch (_) { /* clipboard unavailable */ }
  });
}

/* ---------- embers (deterministic) ---------- */
const EMBERS = [
  [4, 0, 12, 4, 0.45, 38], [12, 3.5, 14, 3, 0.35, -26], [21, 7, 11, 2, 0.5, 44],
  [30, 1.6, 13, 3, 0.4, -34], [39, 9, 15, 4, 0.3, 22], [48, 5, 12, 2, 0.55, -40],
  [57, 0.8, 14, 3, 0.38, 30], [66, 6.2, 11, 4, 0.42, -24], [74, 2.4, 13, 2, 0.5, 36],
  [83, 8, 15, 3, 0.32, -30], [91, 4.2, 12, 4, 0.44, 26], [97, 10.5, 14, 2, 0.36, -38],
];
function initEmbers() {
  const host = document.getElementById("embers");
  if (!host) return;
  host.innerHTML = EMBERS.map(([l, d, t, s, o, dr], i) =>
    `<span class="wf-ember" style="left:${l}%;bottom:-5vh;width:${s}px;height:${s}px;animation-delay:${d}s;animation-duration:${t}s;--ember-op:${o};--ember-drift:${dr}px"></span>`
  ).join("");
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initEmbers();
  initHeroStats();
  renderClassCloud();
  renderSpellbook();
  initProgress();
  initCopy();
  setupReveals();
  const search = document.getElementById("class-search");
  if (search) search.addEventListener("input", (e) => { query = e.target.value; renderClassCloud(); });
  if (document.getElementById("spellbook") || document.getElementById("class-progress")) wfLoadProgress();
  fetch("data/retail/index.json")
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null)
    .then((d) => { if (d && d.specs) RT_IX = d.specs; });
});

/* ---------- shared nav extras: pages added after the HTML was written ---------- */
(function addNavExtras() {
  var extras = [["spellbook.html", "کتاب اسپل‌ها"], ["status.html", "وضعیت ترجمه"]];
  var nav = document.querySelector(".nav-links");
  if (!nav || nav.dataset.canonical === "1") return;   /* nav-menu.js owns the nav */
  /* sub-directory pages (news/*.html) carry ../ hrefs — match the suffix and
     prefix any link we add, or the nav gets a duplicate entry that 404s */
  var BASE = (function () { var m = location.pathname.match(/^\/(?:news|guides|item)\//); if (!m) return ""; var rest = location.pathname.slice(m[0].length); return "../".repeat(1 + (rest.match(/[/]/g) || []).length); })();
  extras.forEach(function (e) {
    if (nav.querySelector('a[href$="' + e[0] + '"]')) return;
    var a = document.createElement("a");
    a.href = BASE + e[0];
    a.textContent = e[1];
    nav.appendChild(a);
  });
})();
