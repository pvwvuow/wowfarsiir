/* =========================================================
   wowfarsi - talent trees page (vanilla, no dependencies)
   v8: bigger icons, readable descriptions (spell tokens are
   resolved/cleaned), safer pan & zoom, no frame overlaps.
   Tabs switch on click only.
   Tooltip: hover follows the cursor, click pins it (touch OK).
   Zoom: mouse wheel over the tree (or pinch on a trackpad), buttons.
   ========================================================= */
"use strict";
(function () {
const TABS = [
  { slug: "death-knight", en: "Death Knight", color: "#E0405A" },
  { slug: "demon-hunter", en: "Demon Hunter", color: "#C558E8" },
  { slug: "druid", en: "Druid", color: "#FF7C0A" },
  { slug: "evoker", en: "Evoker", color: "#33937F" },
  { slug: "hunter", en: "Hunter", color: "#AAD372" },
  { slug: "mage", en: "Mage", color: "#3FC7EB" },
  { slug: "monk", en: "Monk", color: "#00FF98" },
  { slug: "paladin", en: "Paladin", color: "#F48CBA" },
  { slug: "priest", en: "Priest", color: "#FFFFFF" },
  { slug: "rogue", en: "Rogue", color: "#FFF468" },
  { slug: "shaman", en: "Shaman", color: "#0070DD" },
  { slug: "warlock", en: "Warlock", color: "#8788EE" },
  { slug: "warrior", en: "Warrior", color: "#C69B6D" },
];

const CLASS_SLUGS = {
  "Death Knight": "class_deathknight", "Demon Hunter": "class_demonhunter", Druid: "class_druid",
  Evoker: "class_evoker", Hunter: "class_hunter", Mage: "class_mage", Monk: "class_monk",
  Paladin: "class_paladin", Priest: "class_priest", Rogue: "class_rogue", Shaman: "class_shaman",
  Warlock: "class_warlock", Warrior: "class_warrior",
};
const ZAMIMG = (ic) => `https://wow.zamimg.com/images/wow/icons/large/${ic}.jpg`;
const iconUrl = (ic) => (ic ? `icons/large/${ic}.jpg` : null);

const KIND_LABEL = { active: "Active", passive: "Passive", tierrank: "Tiered", subtree: "Hero Tree" };
const GROUP_RING = { class: "#5f6d85", spec: "#a9883c", hero: "#6f95c9" };
const NODE_R = 0.27;
const GATE_R = 0.30;
const ICON_FILL = 0.9; // icon radius as a fraction of the node radius
const MIN_K = 0.55, MAX_K = 4;
const HINT = "کشیدن = جابه‌جایی · اسکرول = زوم · هاور = توضیح · کلیک = سنجاق";

let loadToken = 0;      // guards against out-of-order class loads
let panningActive = false;
let tipCtl = { hide() {}, reset() {} }; // replaced by initTooltip()

const cache = new Map();
function loadTree(slug) {
  if (cache.has(slug)) return Promise.resolve(cache.get(slug));
  return fetch(`trees/${slug}.json`)
    .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then((d) => { cache.set(slug, d); return d; });
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- state ---------- */
const state = {
  slug: "paladin",
  data: null,
  specIdx: 0,
  view: null,        // null = "use the default view for this layout"
  vb: null,          // current svg viewBox {x,y,w,h}
  layout: null,
  broken: new Set(),
  loading: true,
};

/* =========================================================
   Spell text cleaner
   Descriptions come from the game's raw spell strings:
   $s1, ${$d/$t1}, $?c1[a][b], $@spelldesc123, |cFFFFFFFF...|r.
   The page has no spell database, so:
   - spec conditionals ($?c1[..][..]) are resolved for the open spec
   - other conditionals take their "else" branch (base behaviour)
   - compound conditions ($?a1&?s2[..], c1|c2) are evaluated the same way:
     only cN (spec) terms are known, every other term counts as false
   - $?s<id> with a spell id the page does not know can never count as
     known, so it always takes the else branch (a non-existent spell must
     never resolve to its [then] text)
   - values that only the game can compute become a small "X" chip
   - references to other spells and colour codes are dropped
   ========================================================= */
const PH = "\u0001";

function findClose(s, i) { // s[i] === "[" -> index of its matching "]"
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    const c = s[j];
    if (c === "[") depth++;
    else if (c === "]") { depth--; if (depth === 0) return j; }
  }
  return -1;
}

function evalTerm(term, specNo) {
  const neg = term.startsWith("!");
  const body = neg ? term.slice(1) : term;
  let val = false;
  const m = /^c(\d)$/.exec(body);
  if (m) val = Number(m[1]) === specNo;
  // s<id>/a<id> terms: no spell database here, so an unknown spell id stays
  // false — a non-existent spell must never resolve to the [then] branch
  return neg ? !val : val;
}

/* "a137031&?s14914", "!c1&c2", "c1|c3": | separates alternatives, & joins terms */
function evalCond(cond, specNo) {
  return cond.split("|").some((alt) =>
    alt.split("&").every((t) => evalTerm(t.replace(/^\?/, ""), specNo)));
}

function resolveConds(s, specNo) {
  let guard = 0;
  while (guard++ < 300) {
    const at = s.indexOf("$?");
    if (at < 0) break;
    let i = at + 2;
    let chosen = null;
    let ok = true;
    let end = i;
    for (;;) {
      const cm = /^((?:!?[a-zA-Z]*\d*)(?:[&|]\??!?[a-zA-Z]*\d*)*)\[/.exec(s.slice(i));
      if (!cm) { ok = false; break; }
      const open = i + cm[1].length;
      const close = findClose(s, open);
      if (close < 0) { ok = false; break; }
      if (chosen === null && evalCond(cm[1], specNo)) chosen = s.slice(open + 1, close);
      i = close + 1;
      if (s[i] === "?") { i += 1; continue; }
      // the else-branch may follow after whitespace/newlines (the game allows it)
      const ws = /^\s*(?=\[)/.exec(s.slice(i));
      if (ws) {
        const bo = i + ws[0].length;
        const c2 = findClose(s, bo);
        if (c2 < 0) { ok = false; break; }
        if (chosen === null) chosen = s.slice(bo + 1, c2);
        i = c2 + 1;
      }
      end = i;
      break;
    }
    if (!ok) { s = s.slice(0, at) + s.slice(at + 2); continue; }
    s = s.slice(0, at) + (chosen == null ? "" : chosen) + s.slice(end);
  }
  return s;
}

function replaceBraces(s) { // ${ ... } (nested) -> placeholder
  let out = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "$" && s[i + 1] === "{") {
      let depth = 0, j = i + 1;
      for (; j < s.length; j++) {
        if (s[j] === "{") depth++;
        else if (s[j] === "}") { depth--; if (depth === 0) break; }
      }
      out += PH;
      i = j;
    } else {
      out += s[i];
    }
  }
  return out;
}

function formatDesc(raw, specNo) {
  if (!raw) return [];
  let s = String(raw).replace(/\r/g, "");
  s = s.replace(/\|c[0-9a-fA-F]{8}/g, "").replace(/\|[rR]/g, "");
  s = s.replace(/\$@spell(?:icon|name|desc|aura)\d+/g, "");
  s = s.replace(/\$[Ll]([^:;\[\]$]*):[^;]*;/g, "$1");
  s = resolveConds(s, specNo);
  s = replaceBraces(s);
  s = s.replace(/\$<[^>]*>/g, PH);
  s = s.replace(/\$\d*[a-zA-Z]+\d*/g, PH);
  s = s.replace(/\$\?/g, "");
  s = s.replace(new RegExp(PH + "\\.\\d(?!\\d)", "g"), PH);
  s = s.replace(new RegExp(PH + "{2,}", "g"), PH);
  return s.split(/\n+/)
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .filter((l) => l && !/^[:\s·.\-]+$/.test(l))
    .map((l) => {
      /* v2: resolve build-time WFTR markers ({{sp:EN|FA}}, {{tm:EN|FA}}, …)
         per the سبک ترجمه switches — same contract as spellbook.js /
         talentcalc.js faHTML. Must run on the plain escaped line BEFORE
         the PH replacement (faTokens expects text, not HTML). */
      const safe = (window.WFTR && WFTR.faTokens) ? WFTR.faTokens(esc(l)) : esc(l);
      return safe.replace(new RegExp(PH, "g"), '<span class="tk" title="بسته به آمار شخصیتت توی بازی محاسبه می‌شود"></span>');
    });
}

/* ---------- geometry ---------- */
function bbox(nodes, pad = 0.55) {
  if (!nodes.length) return { x: 0, y: 0, w: 1, h: 1 };
  const xs = nodes.map((n) => n.x), ys = nodes.map((n) => n.y);
  const x = Math.min(...xs) - pad, y = Math.min(...ys) - pad;
  return { x, y, w: Math.max(...xs) + pad - x, h: Math.max(...ys) + pad - y };
}

function padBox(b, left, top, right, bottom) {
  return { x: b.x - left, y: b.y - top, w: b.w + left + right, h: b.h + top + bottom };
}

function edgeCoords(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const L = Math.hypot(dx, dy);
  if (L < 1e-6) return null;
  const r1 = a.t === "subtree" ? GATE_R + 0.01 : NODE_R;
  const r2 = b.t === "subtree" ? GATE_R + 0.01 : NODE_R;
  const t1 = r1 / L, t2 = r2 / L;
  return { x1: a.x + dx * t1, y1: a.y + dy * t1, x2: b.x - dx * t2, y2: b.y - dy * t2 };
}

/* ---------- svg builders ---------- */
function frameRect(b, cls, extra = "") {
  return `<rect class="tt-zone-frame ${cls}" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="0.24" ${extra}/>`;
}

function letterOf(node, e0) {
  return ((e0 && e0.n ? e0.n[0] : node.n[0]) || "?").toUpperCase();
}

function letterSVG(x, y, letter, size) {
  return `<text class="tt-letter" x="${x}" y="${y + 0.02}" text-anchor="middle" dominant-baseline="middle" font-size="${size}" fill="#8b93a6" font-family="Cinzel,serif">${esc(letter)}</text>`;
}

function nodeIcon(node, data) {
  const isChoice = node.t === "choice" && node.en.length > 1;
  const isGate = node.t === "subtree";
  const r = isGate ? GATE_R : NODE_R;
  const ir = r * ICON_FILL;          // visible icon radius
  const s = ir * 2;                  // image box
  const dp = (state.layout && state.layout.pos.get(node.id)) || node;
  const cx = dp.x, cy = dp.y;
  const e0 = node.en[0];
  let imgs = "";
  if (isChoice) {
    // two half-discs, split by a hairline. Coordinates are display coords (dp).
    node.en.slice(0, 2).forEach((e, i) => {
      const key = node.id + ":" + i;
      const url = iconUrl(e.ic) && !state.broken.has(key);
      const path = i === 0
        ? `M${cx} ${cy - ir}A${ir} ${ir} 0 0 0 ${cx} ${cy + ir}Z`
        : `M${cx} ${cy - ir}A${ir} ${ir} 0 0 1 ${cx} ${cy + ir}Z`;
      if (url) {
        imgs += `<clipPath id="half-${node.id}-${i}"><path d="${path}"/></clipPath>
        <image href="${iconUrl(e.ic)}" x="${cx - ir}" y="${cy - ir}" width="${s}" height="${s}" clip-path="url(#half-${node.id}-${i})" preserveAspectRatio="xMidYMid slice" data-bid="${key}" data-fallback="${ZAMIMG(e.ic)}"/>`;
      } else {
        imgs += letterSVG(cx + (i === 0 ? -ir * 0.45 : ir * 0.45), cy, letterOf(node, e), 0.17);
      }
    });
    imgs += `<line x1="${cx}" y1="${cy - ir}" x2="${cx}" y2="${cy + ir}" stroke="rgba(4,6,11,0.9)" stroke-width="0.03"/>`;
  } else {
    const ic = node.t === "subtree" ? CLASS_SLUGS[data.className] : e0 && e0.ic;
    const url = ic && !state.broken.has(String(node.id));
    if (url) {
      imgs += `<clipPath id="cir-${node.id}"><circle cx="${cx}" cy="${cy}" r="${ir}"/></clipPath>
      <image href="${iconUrl(ic)}" x="${cx - ir}" y="${cy - ir}" width="${s}" height="${s}" clip-path="url(#cir-${node.id})" preserveAspectRatio="xMidYMid slice" data-bid="${node.id}" data-fallback="${ZAMIMG(ic)}" data-letter="${esc(letterOf(node, e0))}" data-cx="${cx}" data-cy="${cy}"/>`;
    } else {
      imgs += letterSVG(cx, cy, letterOf(node, e0), 0.26);
    }
  }
  return imgs;
}

function nodeSVG(node, data) {
  const isChoice = node.t === "choice" && node.en.length > 1;
  const isGate = node.t === "subtree";
  const ring = isGate ? "#e0b954" : GROUP_RING[node.g] || "#5f6d85";
  const r = isGate ? GATE_R : NODE_R;
  const p = (state.layout && state.layout.pos.get(node.id)) || { x: node.x, y: node.y };
  const parts = [];
  parts.push(`<g class="tt-node" data-node="${node.id}" transform="translate(${p.x} ${p.y})">`);
  if (isGate) parts.push(`<circle class="tt-gate-ring" r="${r + 0.10}"/>`);
  parts.push(`<circle class="nd-body" r="${r}" fill="#0c1220" stroke="${ring}" stroke-width="0.045"/>`);
  // icon group translated back so clips can use absolute display coords
  parts.push(`<g transform="translate(${-p.x} ${-p.y})">${nodeIcon(node, data)}</g>`);
  if (node.r > 1 && !isChoice) {
    parts.push(`<circle cx="${r * 0.78}" cy="${r * 0.78}" r="0.125" fill="#0c1220" stroke="${ring}" stroke-width="0.026"/>`);
    parts.push(`<text x="${r * 0.78}" y="${r * 0.78 + 0.05}" text-anchor="middle" font-size="0.165" font-weight="700" fill="#e8e3d6" font-family="Vazirmatn,Tahoma,sans-serif">${node.r}</text>`);
  }
  parts.push(`<circle r="${r * 1.18}" fill="transparent"/>`);
  parts.push(`</g>`);
  return parts.join("");
}

/* Normalized 3-column layout (like the in-game tree browser):
   every zone is translated onto its own grid, the two hero trees are
   stacked inside the middle column, so ANY spec renders tidy. */
function layoutSpec(spec) {
  const nodes = spec.nodes;
  const classN = nodes.filter((n) => n.g === "class");
  const specN = nodes.filter((n) => n.g === "spec");
  const gate = nodes.find((n) => n.g === "hero" && n.st == null);
  const heroTrees = [];
  for (const h of spec.heroes) {
    const ns = nodes.filter((n) => n.g === "hero" && n.st === h.id);
    if (ns.length) heroTrees.push({ id: h.id, name: h.name, nodes: ns, b: bbox(ns, 0) });
  }

  const pos = new Map(); // id -> {x,y} display coords
  const GAP_X = 1.6;     // zone frames are padded 0.5 each side -> 0.6 clear gap
  const TOP = 0;

  // column 1: class
  let cb = null, cw = 0;
  if (classN.length) {
    cb = bbox(classN, 0);
    cw = cb.w;
    for (const n of classN) pos.set(n.id, { x: n.x - cb.x, y: n.y - cb.y + TOP });
  }

  // column 2: hero trees stacked + gate above
  let hw = 0;
  const heroFrames = [];
  if (heroTrees.length) {
    hw = Math.max(...heroTrees.map((t) => t.b.w));
    let y = TOP + (gate ? 1.15 : 0);
    const heroX = (classN.length ? cw + GAP_X : 0);
    for (const t of heroTrees) {
      const fy = y;
      // centre narrower trees inside the column
      const fx = heroX + (hw - t.b.w) / 2;
      for (const n of t.nodes) pos.set(n.id, { x: n.x - t.b.x + fx, y: n.y - t.b.y + fy });
      heroFrames.push({ id: t.id, name: t.name, b: { x: heroX - 0.3, y: fy - 0.58, w: hw + 0.6, h: t.b.h + 0.88 } });
      y = fy + t.b.h + 1.05;
    }
    if (gate) pos.set(gate.id, { x: heroX + hw / 2, y: TOP + 0.3 });
  }

  // column 3: spec
  let sb = null;
  const specX = (classN.length ? cw + GAP_X : 0) + (heroTrees.length ? hw + GAP_X : 0);
  if (specN.length) {
    sb = bbox(specN, 0);
    for (const n of specN) pos.set(n.id, { x: n.x - sb.x + specX, y: n.y - sb.y + TOP });
  }

  // display-space zone bboxes
  const dBox = (ns) => {
    const xs = ns.map((n) => pos.get(n.id).x), ys = ns.map((n) => pos.get(n.id).y);
    return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
  };
  const classB = classN.length ? padBox(dBox(classN), 0.5, 0.95, 0.5, 0.5) : null;
  const specB = specN.length ? padBox(dBox(specN), 0.5, 0.95, 0.5, 0.5) : null;
  const allHero = nodes.filter((n) => n.g === "hero");
  const heroB = allHero.length ? padBox(dBox(allHero), 0.5, 0.95, 0.5, 0.5) : null;

  return { pos, classB, heroB, specB, heroFrames, hasGate: !!gate };
}

/* ---------- view helpers ---------- */
function clampView(v) {
  const b = state.vb;
  if (!b) return v;
  const mx = b.w * 0.2, my = b.h * 0.2; // always keep part of the tree on screen
  const minX = b.x + mx - v.k * (b.x + b.w), maxX = b.x + b.w - mx - v.k * b.x;
  const minY = b.y + my - v.k * (b.y + b.h), maxY = b.y + b.h - my - v.k * b.y;
  return { k: v.k, x: Math.min(maxX, Math.max(minX, v.x)), y: Math.min(maxY, Math.max(minY, v.y)) };
}

/* desktop: fit everything. phone: start zoomed on the class tree (drag to move). */
function defaultView() {
  const b = state.vb, L = state.layout;
  const el = document.getElementById("tt-canvas");
  const w = el ? el.clientWidth : 1000;
  if (!b || !L || !L.classB || w >= 760) return { k: 1, x: 0, y: 0 };
  const k = 2.1;
  const ux = L.classB.x + L.classB.w / 2, uy = L.classB.y + 3.2;
  return clampView({ k, x: b.x + b.w / 2 - k * ux, y: b.y + b.h * 0.42 - k * uy });
}

/* ---------- full canvas svg ---------- */
function buildCanvasSVG(data, spec) {
  const L = layoutSpec(spec);
  state.layout = L;

  const zones = [
    { g: "class", label: "Class Talents", b: L.classB },
    { g: "hero", label: "Hero Talents", b: L.heroB },
    { g: "spec", label: "Spec Talents", b: L.specB },
  ].filter((z) => z.b);

  // viewBox = union of all frames (+ margin) so nothing clips
  const all = { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity };
  for (const z of [...zones.map((z) => z.b), ...L.heroFrames.map((f) => f.b)]) {
    all.x = Math.min(all.x, z.x); all.y = Math.min(all.y, z.y);
    all.x2 = Math.max(all.x2, z.x + z.w); all.y2 = Math.max(all.y2, z.y + z.h);
  }
  const vb = { x: all.x - 0.22, y: all.y - 0.22, w: all.x2 - all.x + 0.44, h: all.y2 - all.y + 0.44 };
  state.vb = vb;
  if (!state.view) state.view = defaultView();

  // edges in display space
  const byId = new Map(spec.nodes.map((n) => [n.id, n]));
  const P = (id) => L.pos.get(id);
  const edges = [];
  for (const n of spec.nodes) for (const t of n.nx || []) {
    const b = byId.get(t), pa = P(n.id), pb = P(t);
    if (!b || !pa || !pb) continue;
    // keep edges inside their own zone/tree: cross-zone links (hero gate)
    // would cut across the stacked hero trees and read as glitches
    if (n.g !== b.g || n.st !== b.st) continue;
    const c = edgeCoords({ x: pa.x, y: pa.y, t: n.t }, { x: pb.x, y: pb.y, t: b.t });
    if (c) edges.push(c);
  }

  const svg = [];
  svg.push(`<svg viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}" preserveAspectRatio="xMidYMid meet">`);
  svg.push(`<g id="tt-view" class="tt-view"><g transform="translate(${state.view.x} ${state.view.y}) scale(${state.view.k})" id="tt-inner">`);

  // zone frames + headers (hairline rect + small caps label + rule)
  for (const z of zones) {
    svg.push(frameRect(z.b, `g-${z.g}`));
    svg.push(`<text class="tt-zone-head ${z.g === "hero" ? "g-hero" : ""}" x="${(z.b.x + 0.26).toFixed(3)}" y="${(z.b.y + 0.42).toFixed(3)}">${z.label}</text>`);
    svg.push(`<line class="tt-zone-rule" x1="${(z.b.x + 0.26).toFixed(3)}" y1="${(z.b.y + 0.58).toFixed(3)}" x2="${(z.b.x + z.b.w - 0.26).toFixed(3)}" y2="${(z.b.y + 0.58).toFixed(3)}"/>`);
  }
  // hero tree name labels (flourish lines drawn after mount, once measurable)
  for (const hf of L.heroFrames) {
    svg.push(`<text class="tt-hero-label" data-lx="${(hf.b.x + hf.b.w / 2).toFixed(3)}" data-ly="${(hf.b.y + 0.27).toFixed(3)}" data-fw="${hf.b.w.toFixed(3)}" x="${(hf.b.x + hf.b.w / 2).toFixed(3)}" y="${(hf.b.y + 0.27).toFixed(3)}" text-anchor="middle">${esc(hf.name)}</text>`);
  }

  // edges first (under nodes)
  svg.push(edges.map((e) => `<line class="tt-edge" x1="${e.x1.toFixed(3)}" y1="${e.y1.toFixed(3)}" x2="${e.x2.toFixed(3)}" y2="${e.y2.toFixed(3)}"/>`).join(""));

  // nodes at display coords (paint top-to-bottom so lower nodes overlap upward)
  const sorted = [...spec.nodes].sort((a, b) => (P(a.id).y - P(b.id).y) || (P(a.id).x - P(b.id).x));
  svg.push(sorted.map((n) => nodeSVG(n, data)).join(""));

  svg.push(`</g></g></svg>`);
  return svg.join("");
}

/* ---------- tooltip ---------- */
function tipHTML(node, data, spec) {
  const specNo = state.specIdx + 1;
  const isChoice = node.t === "choice" && node.en.length > 1;
  const entries = isChoice ? node.en : node.en.slice(0, 1);
  const heroName = node.st != null ? (spec.heroes.find((h) => h.id === node.st) || {}).name : null;
  const badges = [];
  if (heroName) badges.push(`<span class="ttip-badge b-blue">${esc(heroName)}</span>`);
  if (isChoice) badges.push(`<span class="ttip-badge b-blue">Choice Node</span>`);
  if (!isChoice) for (const e of entries) if (KIND_LABEL[e.k]) badges.push(`<span class="ttip-badge">${KIND_LABEL[e.k]}</span>`);
  if (node.r > 1) badges.push(`<span class="ttip-badge b-rank">Rank ${node.r}</span>`);
  badges.push(`<span class="ttip-cls">${esc(data.className)}</span>`);

  // one block per entry: choice nodes show both options, each with its own text
  const blocks = entries.map((e) => {
    const en = formatDesc(e.d, specNo);
    const fa = formatDesc(e.f, specNo);
    let h = "";
    if (isChoice) {
      h += `<p class="ttip-sub" dir="ltr">${esc(e.n)}${KIND_LABEL[e.k] ? ` <span class="ttip-kind">${KIND_LABEL[e.k]}</span>` : ""}</p>`;
    }
    h += en.map((l) => `<p class="ttip-desc" dir="ltr">${l}</p>`).join("");
    if (fa.length) {
      h += `<div class="ttip-fa"><span class="fa-tag">فارسی</span>${fa.map((l) => `<p dir="rtl">${l}</p>`).join("")}</div>`;
    }
    return `<div class="ttip-entry">${h}</div>`;
  }).join("");

  const gateLine = node.t === "subtree"
    ? `<p class="ttip-desc" dir="ltr" style="color:#8fb4e8">Hero talent trees: ${esc(node.en.map((e) => e.n).join(" · "))}</p>`
    : "";

  const title = isChoice ? node.n : (node.en[0] ? node.en[0].n : node.n);
  return `
    <p class="ttip-name font-cinzel" dir="ltr">${esc(title)}</p>
    <div class="ttip-badges" dir="ltr">${badges.join("")}</div>
    ${blocks}${gateLine}`;
}

/* ---------- pan & zoom ---------- */
const canvasEl = () => document.getElementById("tt-canvas");

function setView(v) {
  v = clampView(v);
  state.view = v;
  const inner = document.getElementById("tt-inner");
  if (inner) inner.setAttribute("transform", `translate(${v.x} ${v.y}) scale(${v.k})`);
  const val = document.getElementById("tt-zoom-val");
  if (val) val.textContent = `${Math.round(v.k * 100)}%`;
}

function initCanvasInteractions() {
  const el = canvasEl();
  let pan = null;

  // Mouse wheel zooms the tree around the cursor (trackpad pinch sends ctrl+wheel).
  el.addEventListener("wheel", (e) => {
    e.preventDefault();
    tipCtl.reset();
    const svg = el.querySelector("svg");
    if (!svg || !state.view) return;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const v = state.view;
    const k2 = Math.min(MAX_K, Math.max(MIN_K, v.k * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0016))));
    setView({ k: k2, x: pt.x - ((pt.x - v.x) * k2) / v.k, y: pt.y - ((pt.y - v.y) * k2) / v.k });
  }, { passive: false });

  el.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || !state.view) return;
    pan = { id: e.pointerId, cx: e.clientX, cy: e.clientY, moved: false };
  });
  el.addEventListener("pointermove", (e) => {
    if (!pan || pan.id !== e.pointerId) return;
    // capture only AFTER real movement, so plain clicks still hit the nodes
    if (!pan.moved && Math.hypot(e.clientX - pan.cx, e.clientY - pan.cy) > 5) {
      pan.moved = true;
      panningActive = true;
      el.classList.add("is-panning");
      try { el.setPointerCapture(e.pointerId); } catch (_) { /* already released */ }
      tipCtl.reset();
    }
    if (!pan.moved) return;
    const svg = el.querySelector("svg");
    const ctm = svg && svg.getScreenCTM();
    if (!ctm) return;
    const scale = Math.hypot(ctm.a, ctm.b);
    const dx = (e.clientX - pan.cx) / scale, dy = (e.clientY - pan.cy) / scale;
    pan.cx = e.clientX; pan.cy = e.clientY;
    setView({ ...state.view, x: state.view.x + dx, y: state.view.y + dy });
  });
  const endPan = () => {
    pan = null; panningActive = false; el.classList.remove("is-panning");
  };
  el.addEventListener("pointerup", endPan);
  el.addEventListener("pointercancel", endPan);
  el.addEventListener("lostpointercapture", endPan);

  document.getElementById("tt-zoom-out").addEventListener("click", () => zoomBy(1 / 1.25));
  document.getElementById("tt-zoom-in").addEventListener("click", () => zoomBy(1.25));
  document.getElementById("tt-zoom-reset").addEventListener("click", () => {
    if (!state.vb) return;
    tipCtl.reset();
    setView(defaultView());
  });
}

function zoomBy(f) {
  const v = state.view;
  if (!v || !state.vb) return;
  const k2 = Math.min(MAX_K, Math.max(MIN_K, v.k * f));
  const b = state.vb; // zoom around the centre of the viewBox
  const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
  tipCtl.reset();
  setView({
    k: k2,
    x: cx - ((cx - v.x) * k2) / v.k,
    y: cy - ((cy - v.y) * k2) / v.k,
  });
}

/* ---------- tooltip: hover follows the cursor, click pins it ---------- */
function initTooltip() {
  const el = canvasEl();
  const tip = document.getElementById("tt-tip");
  let hoverNode = null;   // follows the mouse
  let pinnedId = null;    // locked by click / tap (until unpin)

  function nodeFromEvent(e) {
    const g = e.target.closest && e.target.closest(".tt-node");
    if (!g || !state.data) return null;
    const id = Number(g.dataset.node);
    return state.data.specs[state.specIdx].nodes.find((n) => n.id === id) || null;
  }

  function show(node) {
    const spec = state.data.specs[state.specIdx];
    tip.innerHTML = tipHTML(node, state.data, spec);
    tip.style.display = "block";
  }
  function hide() { tip.style.display = "none"; }

  function clamp(px, py) {
    const r = el.getBoundingClientRect();
    const w = tip.offsetWidth, h = tip.offsetHeight;
    // prefer right/below the cursor; flip to the other side when it would not fit
    let x = px + 16, y = py + 14;
    if (x + w > r.width - 8) x = px - w - 16;
    if (y + h > r.height - 8) y = py - h - 14;
    tip.style.left = `${Math.min(Math.max(x, 8), Math.max(8, r.width - w - 8))}px`;
    tip.style.top = `${Math.min(Math.max(y, 8), Math.max(8, r.height - h - 8))}px`;
  }
  function positionTip(e) {
    const r = el.getBoundingClientRect();
    clamp(e.clientX - r.left, e.clientY - r.top);
  }
  function positionAtNode(node) {
    const svg = el.querySelector("svg");
    if (!svg) return;
    const p = (state.layout && state.layout.pos.get(node.id)) || { x: node.x, y: node.y };
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const v = state.view; // node units -> zoomed user units -> screen
    const pt = new DOMPoint(p.x * v.k + v.x, p.y * v.k + v.y).matrixTransform(ctm);
    const r = el.getBoundingClientRect();
    clamp(pt.x - r.left + 10, pt.y - r.top);
  }

  el.addEventListener("pointerover", (e) => {
    if (panningActive || pinnedId != null) return;
    const n = nodeFromEvent(e);
    if (!n) {
      // coming back from the tooltip itself (e.g. the stat chip) to empty canvas
      const rel = e.relatedTarget;
      if (rel && rel.closest && rel.closest("#tt-tip") && hoverNode) {
        hoverNode = null;
        hide();
      }
      return;
    }
    if (n === hoverNode) return;
    hoverNode = n;
    show(n);
    positionTip(e);
  });
  el.addEventListener("pointermove", (e) => {
    if (panningActive || pinnedId != null || !hoverNode) return;
    positionTip(e);
  });
  el.addEventListener("pointerout", (e) => {
    if (!hoverNode) return;
    const rel = e.relatedTarget;
    if (rel && rel.closest && rel.closest("#tt-tip")) return; // moving onto the tooltip (stat chip) keeps it open
    const from = e.target.closest && e.target.closest(".tt-node");
    const to = rel && rel.closest && rel.closest(".tt-node");
    if (from && to && from === to) return; // hopping between children of the same node
    hoverNode = null;
    if (pinnedId == null) hide();
  });
  el.addEventListener("pointerleave", () => {
    hoverNode = null;
    if (pinnedId == null) hide();
  });

  let downPt = null;
  el.addEventListener("pointerdown", (e) => { downPt = { x: e.clientX, y: e.clientY }; });
  el.addEventListener("click", (e) => {
    const dragged = downPt && Math.hypot(e.clientX - downPt.x, e.clientY - downPt.y) > 8;
    downPt = null;
    if (dragged) return; // that was a pan, not a click
    const n = nodeFromEvent(e);
    if (!n) { pinnedId = null; hoverNode = null; hide(); return; }
    if (pinnedId === n.id) { pinnedId = null; hoverNode = null; hide(); return; }
    pinnedId = n.id;
    hoverNode = null;
    show(n);
    positionAtNode(n);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { pinnedId = null; hoverNode = null; hide(); }
  });

  /* سبک ترجمه switch flips re-render the open tooltip in place (content
     only — position/pin stays); markers inside FA descriptions resolve
     per the switches (same contract as spellbook / talentcalc). tr.js is
     injected ASYNC by nav-menu.js, so poll for window.WFTR (cap ~7s). */
  (function whenTr(tries) {
    if (window.WFTR && WFTR.onChange) {
      WFTR.onChange(() => {
        if (tip.style.display !== "block" || !state.data) return;
        const curId = pinnedId != null ? pinnedId : (hoverNode && hoverNode.id);
        if (curId == null) return;
        const cur = state.data.specs[state.specIdx].nodes.find((n) => n.id === curId);
        if (cur) show(cur);
      });
    } else if (tries < 48) {
      setTimeout(() => whenTr(tries + 1), 150);
    }
  })(0);

  return {
    hide,
    reset() { hoverNode = null; pinnedId = null; hide(); },
  };
}

/* ---------- icon fallback (local -> zamimg -> letter) ---------- */
function initIconFallback() {
  const el = canvasEl();
  el.addEventListener("error", (e) => {
    const img = e.target;
    if (!(img instanceof SVGImageElement)) return;
    const bid = img.getAttribute("data-bid");
    const fb = img.getAttribute("data-fallback");
    if (fb && img.getAttribute("href") !== fb) {
      img.setAttribute("href", fb);
      return;
    }
    state.broken.add(bid);
    const letter = img.getAttribute("data-letter");
    const cx = img.getAttribute("data-cx"), cy = img.getAttribute("data-cy");
    if (letter && cx != null && cy != null) {
      const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
      t.setAttribute("class", "tt-letter");
      t.setAttribute("x", cx);
      t.setAttribute("y", String(Number(cy) + 0.02));
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("dominant-baseline", "middle");
      t.setAttribute("font-size", "0.26");
      t.setAttribute("fill", "#8b93a6");
      t.setAttribute("font-family", "Cinzel,serif");
      t.textContent = letter;
      img.parentNode.insertBefore(t, img);
    }
    img.style.display = "none";
  }, true);
}

/* ---------- tabs (click switching) ---------- */
function switchSpec(idx, viaHover) {
  if (!state.data || idx === state.specIdx) return;
  const dir = idx > state.specIdx ? "enter-l" : "enter-r";
  state.specIdx = idx;
  state.view = null; // new layout: use the default view
  tipCtl.reset();
  renderSpecChips();
  renderCanvasAnimated(dir);
  if (viaHover) blurActive();
}

function switchClass(slug, viaHover) {
  if (slug === state.slug) return;
  const token = ++loadToken; // invalidate any in-flight load
  const oldSpecCount = state.data ? state.data.specs.length : 0;
  state.slug = slug;
  state.specIdx = 0;
  state.loading = true;
  state.view = null;
  renderClassTabs();
  document.getElementById("tt-spec-bar").style.visibility = "hidden";
  showSkeleton();
  loadTree(slug).then((d) => {
    if (token !== loadToken) return; // a newer switch superseded this one
    state.data = d;
    state.loading = false;
    renderSpecChips();
    renderCanvasAnimated(oldSpecCount ? "enter-l" : "");
    if (viaHover) blurActive();
  }).catch(() => {
    if (token !== loadToken) return;
    state.loading = false;
    canvasEl().innerHTML = `<div class="tt-error">بارگذاری Talent Tree ناموفق بود. دوباره تلاش کن.</div>`;
  });
}

function blurActive() {
  const a = document.activeElement;
  if (a && a.blur) a.blur();
}

function renderClassTabs() {
  const host = document.getElementById("tt-class-tabs");
  host.innerHTML = TABS.map((t) => {
    const active = t.slug === state.slug;
    return `<button class="tt-class-tab" data-slug="${t.slug}" aria-pressed="${active}">
      <span style="display:inline-block;${active ? `box-shadow:0 0 34px ${t.color}66, 0 0 12px rgba(240,199,94,0.35);border-radius:9999px` : ""}">
        <span class="wf-crest" style="width:58px;height:58px;${active ? `box-shadow:0 0 24px ${t.color}80` : ""}">
          <span class="wf-crest-in" style="width:100%;height:100%">
            <span class="font-cinzel" style="position:absolute;inset:0;display:grid;place-items:center;font-size:17px;font-weight:700;color:${t.color};opacity:.9">${t.en[0]}</span>
            <img src="icons/large/${CLASS_SLUGS[t.en]}.jpg" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'">
          </span>
        </span>
      </span>
      <span class="label font-cinzel" dir="ltr" style="${active ? `color:${t.color}` : ""}">${t.en}</span>
    </button>`;
  }).join("");
  host.querySelectorAll(".tt-class-tab").forEach((btn) => {
    const slug = btn.dataset.slug;
    btn.addEventListener("click", () => switchClass(slug, false));
  });
}

function renderSpecChips() {
  const bar = document.getElementById("tt-spec-bar");
  if (!state.data) { bar.style.visibility = "hidden"; return; }
  bar.style.visibility = "visible";
  bar.innerHTML = `
    <div class="tt-spec-chips">
      ${state.data.specs.map((s, i) => `<button class="tt-chip" data-i="${i}" data-active="${i === state.specIdx}">${esc(s.specName)}</button>`).join("")}
    </div>`;
  bar.querySelectorAll(".tt-chip").forEach((chip) => {
    const i = Number(chip.dataset.i);
    chip.addEventListener("click", () => switchSpec(i, false));
  });
}

function showSkeleton() {
  state.view = null;
  tipCtl.reset();
  canvasEl().innerHTML = `<div class="tt-skeleton"><p><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="animate-pulse-soft"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>Talent Tree در حال بارگذاری…</p></div>`;
  document.getElementById("tt-tip").style.display = "none";
  document.getElementById("tt-build").textContent = "";
}

function renderCanvasAnimated(enterCls) {
  const el = canvasEl();
  const spec = state.data.specs[state.specIdx];
  el.innerHTML = buildCanvasSVG(state.data, spec);
  document.getElementById("tt-build").textContent = state.data.build || "";
  setView(state.view);
  decorateHeroLabels();
  const view = document.getElementById("tt-view");
  if (view && enterCls) {
    view.classList.add(enterCls);
    requestAnimationFrame(() => requestAnimationFrame(() => view.classList.remove(enterCls)));
  }
}

/* hero tree names get the logo flourish: --o name o--
   Long names are squeezed to fit; lines never leave the hero frame.
   (measured after mount; re-runs once webfonts are ready) */
function decorateHeroLabels() {
  const svg = canvasEl().querySelector("svg");
  if (!svg) return;
  const NS = "http://www.w3.org/2000/svg";
  const host = svg.querySelector("#tt-inner") || svg;
  for (const g of svg.querySelectorAll(".tt-hero-flourish")) g.remove();
  for (const t of svg.querySelectorAll("text.tt-hero-label")) {
    const fw = parseFloat(t.dataset.fw) || 3;
    t.removeAttribute("textLength");
    let len = 0;
    try { len = t.getComputedTextLength(); } catch (_) { continue; }
    if (!len) continue;
    const maxLen = fw - 0.5;
    if (len > maxLen) {
      t.setAttribute("textLength", maxLen.toFixed(3));
      t.setAttribute("lengthAdjust", "spacingAndGlyphs");
      len = maxLen;
    }
    const room = (fw - len) / 2 - 0.14;       // free space each side, inside the frame
    if (room < 0.12) continue;
    const cx = parseFloat(t.dataset.lx);
    const cy = parseFloat(t.dataset.ly) - 0.062; // optical mid of small caps
    const y = cy.toFixed(3);
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "tt-hero-flourish");
    const mk = (tag, attrs) => {
      const el = document.createElementNS(NS, tag);
      for (const k in attrs) el.setAttribute(k, attrs[k]);
      return el;
    };
    g.appendChild(mk("circle", { cx: (cx - len / 2 - 0.09).toFixed(3), cy: y, r: "0.034" }));
    g.appendChild(mk("circle", { cx: (cx + len / 2 + 0.09).toFixed(3), cy: y, r: "0.034" }));
    const lineLen = Math.min(0.36, room - 0.16);
    if (lineLen > 0.05) {
      g.appendChild(mk("line", { x1: (cx - len / 2 - 0.16 - lineLen).toFixed(3), y1: y, x2: (cx - len / 2 - 0.16).toFixed(3), y2: y }));
      g.appendChild(mk("line", { x1: (cx + len / 2 + 0.16).toFixed(3), y1: y, x2: (cx + len / 2 + 0.16 + lineLen).toFixed(3), y2: y }));
    }
    host.insertBefore(g, t);
  }
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // ?class=paladin|mage|demon-hunter  ·  ?spec=fury|beast-mastery (deep link from the Retail menu)
  const params = new URLSearchParams(location.search);
  const want = params.get("class");
  if (want && TABS.some((t) => t.slug === want)) state.slug = want;
  const wantSpec = (params.get("spec") || "").toLowerCase();

  const hint = document.querySelector(".tt-hint");
  if (hint) hint.textContent = HINT;

  renderClassTabs();
  renderSpecChips();
  showSkeleton();
  initCanvasInteractions();
  tipCtl = initTooltip();
  initIconFallback();

  const bootToken = ++loadToken;
  loadTree(state.slug).then((d) => {
    if (bootToken !== loadToken) return;
    state.data = d;
    state.loading = false;
    if (wantSpec) {
      const si = d.specs.findIndex(
        (s) => String(s.specName || "").toLowerCase().replace(/\s+/g, "-") === wantSpec,
      );
      if (si >= 0) state.specIdx = si;
    }
    renderSpecChips();
    renderCanvasAnimated("");
  }).catch(() => {
    if (bootToken !== loadToken) return;
    state.loading = false;
    canvasEl().innerHTML = `<div class="tt-error">بارگذاری Talent Tree ناموفق بود. دوباره تلاش کن.</div>`;
  });

  // hero-label flourishes are measured pre-font-load; re-measure once ready
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { if (state.data && !state.loading) decorateHeroLabels(); });
  }
});

  window.__tt = { state: state, switchClass: switchClass, switchSpec: switchSpec, formatDesc: formatDesc };
})();
