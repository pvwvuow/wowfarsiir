/* tr-prof.js v1 - saved translation styles + the quick style bar (global, every page)
   ------------------------------------------------------------------------------------
   Owner's plan: the quick bar reads  English / \u0641\u0627\u0631\u0633\u06cc / \u0633\u0628\u06a9 \u06f1 / \u0633\u0628\u06a9 \u06f2 / \u0633\u0628\u06a9 \u06f3  (max 3 saved styles).
   Clicking English or \u0641\u0627\u0631\u0633\u06cc must NEVER wreck a custom style:
     - a saved style is changed ONLY by an explicit action (save / replace / rename / delete);
     - the last unsaved mix is stashed automatically ("\u0633\u0641\u0627\u0631\u0634\u06cc" chip) before anything replaces it,
       so English -> back to your mix is one tap.
   Storage: localStorage "wf-tr-prof" = {v:1, last:"WF4-...", p:[{n:name, c:"WF4-..."}]}.
   Every style is stored as its WF4 share code (tr.js format), so a saved style IS shareable as-is.
   English = WF4 code with every switch off, \u0641\u0627\u0631\u0633\u06cc = every switch on (same bits tr.js emits).
   API (window.WFTRP): bar(extraClass) -> html of the quick bar (pages place it, clicks are delegated here),
   use(slot), save(), list(), refresh().  The drawer / studio root view gets a "\u0633\u0628\u06a9\u200c\u0647\u0627\u06cc \u0645\u0646" block injected
   after the presets (save, apply, replace with the current mix, rename, delete). tr.js is untouched. */
(function () {
  'use strict';
  /* nav-menu.js may inject tr.js and this file on pages that forgot them: wait (max 6 s) for WFTR */
  if (!window.WFTR) {
    var tries = 0, poll = setInterval(function () {
      if (window.WFTR || ++tries > 60) { clearInterval(poll); if (window.WFTR) start(); }
    }, 100);
    return;
  }
  start();
  function start() {
  var WF = window.WFTR;
  if (!WF || !WF.code || !WF.applyCode || window.WFTRP) return;
  var KEY = 'wf-tr-prof', MAX = 3;
  /* tr.js SHARE_KEYS order (14 frozen + namesClass); only the COUNT matters here */
  var NBITS = 15;
  function b36(n) { return Number(n).toString(36); }
  function chk(s) { /* tr.js wf4check v2 (prime 37) */
    var h1 = 0, h2 = 0, i, v;
    for (i = 0; i < s.length; i++) {
      v = parseInt(s.charAt(i), 36);
      if (!isFinite(v) || v < 0) v = 0;
      h1 = (h1 + v * (i + 1)) % 37;
      h2 = (h2 + v * (i + 3)) % 37;
    }
    return ('00' + b36(h1 * 37 + h2)).slice(-3);
  }
  function enc(bits) { var p = b36(bits); return 'WF4-' + p + '-' + chk('WF4-' + p); }
  var EN = enc(0), FA = enc(Math.pow(2, NBITS) - 1);
  function nc(c) { return String(c || '').trim().toLowerCase(); }
  function faNum(v) { return String(v).replace(/[0-9]/g, function (d) { return '\u06f0\u06f1\u06f2\u06f3\u06f4\u06f5\u06f6\u06f7\u06f8\u06f9'.charAt(+d); }); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (s && s.v === 1) {
        return { v: 1, last: typeof s.last === 'string' ? s.last : '',
          p: (Array.isArray(s.p) ? s.p : []).filter(function (x) { return x && typeof x.c === 'string' && /^WF4-/i.test(x.c); })
            .slice(0, MAX).map(function (x) { return { n: String(x.n || '').slice(0, 20), c: x.c }; }) };
      }
    } catch (e) { /* private mode etc. */ }
    return { v: 1, last: '', p: [] };
  }
  var st = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } }
  function cur() { return nc(WF.code()); }
  function slotOf(c) {
    var i;
    c = nc(c);
    if (c === nc(EN)) return 'en';
    if (c === nc(FA)) return 'fa';
    for (i = 0; i < st.p.length; i++) if (nc(st.p[i].c) === c) return 'p' + i;
    return '';
  }
  function pname(i) { return st.p[i].n || ('\u0633\u0628\u06a9 ' + faNum(i + 1)); }
  /* stash the current mix when it is not one of the named slots (called before every switch + on every change) */
  function remember() {
    if (slotOf(cur()) === '') { st.last = WF.code(); save(); }
  }
  var lock = false;
  function use(s) {
    var c = '';
    if (s === 'en') c = EN;
    else if (s === 'fa') c = FA;
    else if (s === 'last') c = st.last;
    else if (/^p[0-9]$/.test(s) && st.p[+s.slice(1)]) c = st.p[+s.slice(1)].c;
    if (!c || nc(c) === cur()) return false;
    remember();
    lock = true;
    var ok = WF.applyCode(c);
    lock = false;
    refresh();
    return ok;
  }
  function saveNew() {
    var c = WF.code();
    if (st.p.length >= MAX || slotOf(c) !== '') return false;
    st.p.push({ n: '', c: c });
    if (nc(st.last) === nc(c)) st.last = '';
    save(); refresh();
    return true;
  }
  function replaceWith(i) {
    var c = WF.code();
    if (!st.p[i] || slotOf(c) !== '') return false;
    st.p[i].c = c;
    if (nc(st.last) === nc(c)) st.last = '';
    save(); refresh();
    return true;
  }
  function rename(i, n) {
    if (!st.p[i]) return;
    st.p[i].n = String(n || '').replace(/\s+/g, ' ').trim().slice(0, 20);
    save(); refresh();
  }
  function del(i) {
    if (!st.p[i]) return;
    var gone = st.p.splice(i, 1)[0];
    /* the deleted style stays reachable once as the "\u0633\u0641\u0627\u0631\u0634\u06cc" chip if it is what you are wearing now */
    if (gone && nc(gone.c) === cur()) st.last = gone.c;
    save(); refresh();
  }

  /* ---------- the quick bar ---------- */
  function btn(s, label, on, attr) {
    return '<button type="button" data-s="' + s + '"' + (on ? ' class="on" aria-pressed="true"' : ' aria-pressed="false"') + (attr ? ' ' + attr : '') + '>' + esc(label) + '</button>';
  }
  var ICON = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>';
  function bar(cls) {
    var c = cur(), s = slotOf(c), h, i, ls;
    h = '<div class="wftr-pb' + (cls ? ' ' + esc(cls) : '') + '" data-c="' + esc(cls || '') + '" role="group" aria-label="\u0633\u0628\u06a9 \u062a\u0631\u062c\u0645\u0647">';
    h += btn('en', 'English', s === 'en', 'dir="ltr"');
    h += btn('fa', '\u0641\u0627\u0631\u0633\u06cc', s === 'fa');
    for (i = 0; i < st.p.length; i++) h += btn('p' + i, pname(i), s === 'p' + i);
    ls = st.last ? slotOf(st.last) : 'x';
    if (st.last && ls === '') h += btn('last', '\u0633\u0641\u0627\u0631\u0634\u06cc', nc(st.last) === c, 'title="\u0622\u062e\u0631\u06cc\u0646 \u062a\u0631\u06a9\u06cc\u0628 \u0630\u062e\u06cc\u0631\u0647\u200c\u0646\u0634\u062f\u0647\u0654 \u062a\u0648"');
    if (s === '' && st.p.length < MAX) h += '<button type="button" data-s="save" class="trp-add" title="\u0647\u0645\u06cc\u0646 \u062a\u0631\u06a9\u06cc\u0628 \u0631\u0627 \u0628\u0647\u200c\u0639\u0646\u0648\u0627\u0646 \u06cc\u06a9 \u0633\u0628\u06a9 \u0630\u062e\u06cc\u0631\u0647 \u06a9\u0646">+ \u0630\u062e\u06cc\u0631\u0647</button>';
    h += '<button type="button" data-s="menu" class="trp-set" title="\u0633\u0628\u06a9\u200c\u0647\u0627\u06cc \u0645\u0646: \u0630\u062e\u06cc\u0631\u0647\u060c \u062a\u063a\u06cc\u06cc\u0631 \u0646\u0627\u0645\u060c \u062d\u0630\u0641" aria-label="\u0645\u062f\u06cc\u0631\u06cc\u062a \u0633\u0628\u06a9\u200c\u0647\u0627">' + ICON + '</button>';
    return h + '</div>';
  }

  /* ---------- "\u0633\u0628\u06a9\u200c\u0647\u0627\u06cc \u0645\u0646" block inside the drawer / studio root view ---------- */
  function boxInner() {
    return '<p class="stmenu-cap">\u0633\u0628\u06a9\u200c\u0647\u0627\u06cc \u0645\u0646</p>'
      + '<p class="trp-hint">\u062a\u0627 ' + faNum(MAX) + ' \u0633\u0628\u06a9 \u0630\u062e\u06cc\u0631\u0647 \u06a9\u0646. \u062f\u06a9\u0645\u0647\u200c\u0647\u0627\u06cc English \u0648 \u0641\u0627\u0631\u0633\u06cc \u0647\u06cc\u0686\u200c\u0648\u0642\u062a \u0633\u0628\u06a9\u200c\u0647\u0627\u06cc \u0630\u062e\u06cc\u0631\u0647\u200c\u0634\u062f\u0647\u200c\u0627\u062a \u0631\u0627 \u067e\u0627\u06a9 \u0646\u0645\u06cc\u200c\u06a9\u0646\u0646\u062f.</p>'
      + '<div class="trp-list"></div>'
      + '<button type="button" class="trp-b trp-savebtn"></button>';
  }
  function listHtml() {
    var c = cur(), s = slotOf(c), h = '', i, on;
    if (!st.p.length) h = '<p class="trp-empty">\u0647\u0646\u0648\u0632 \u0633\u0628\u06a9\u06cc \u0630\u062e\u06cc\u0631\u0647 \u0646\u06a9\u0631\u062f\u0647\u200c\u0627\u06cc. \u0633\u0648\u0626\u06cc\u0686\u200c\u0647\u0627 \u0631\u0627 \u062a\u0646\u0638\u06cc\u0645 \u06a9\u0646 \u0648 \u00ab\u0630\u062e\u06cc\u0631\u0647\u00bb \u0631\u0627 \u0628\u0632\u0646.</p>';
    for (i = 0; i < st.p.length; i++) {
      on = s === 'p' + i;
      h += '<div class="trp-row' + (on ? ' on' : '') + '" data-i="' + i + '">'
        + '<input class="trp-name" type="text" maxlength="20" value="' + esc(pname(i)) + '" aria-label="\u0646\u0627\u0645 \u0633\u0628\u06a9" spellcheck="false">'
        + '<button type="button" class="trp-b trp-use"' + (on ? ' disabled' : '') + '>' + (on ? '\u0641\u0639\u0627\u0644' : '\u0627\u0639\u0645\u0627\u0644') + '</button>'
        + (s === '' ? '<button type="button" class="trp-b trp-over" title="\u062a\u0631\u06a9\u06cc\u0628 \u0641\u0639\u0644\u06cc \u0631\u0648\u06cc \u0627\u06cc\u0646 \u0633\u0628\u06a9 \u0630\u062e\u06cc\u0631\u0647 \u0634\u0648\u062f">\u062c\u0627\u06cc\u06af\u0632\u06cc\u0646\u06cc</button>' : '')
        + '<button type="button" class="trp-b trp-del">\u062d\u0630\u0641</button></div>';
    }
    return h;
  }
  function saveLabel() {
    var s = slotOf(cur());
    if (s === 'en' || s === 'fa') return ['\u0627\u06cc\u0646 \u062a\u0631\u06a9\u06cc\u0628 \u0647\u0645\u0627\u0646 ' + (s === 'en' ? 'English' : '\u0641\u0627\u0631\u0633\u06cc') + ' \u0627\u0633\u062a', true];
    if (s) return ['\u0627\u06cc\u0646 \u062a\u0631\u06a9\u06cc\u0628 \u0627\u0644\u0627\u0646 \u0630\u062e\u06cc\u0631\u0647 \u0627\u0633\u062a', true];
    if (st.p.length >= MAX) return ['\u062c\u0627 \u067e\u0631 \u0627\u0633\u062a (\u062d\u062f\u0627\u06a9\u062b\u0631 ' + faNum(MAX) + ' \u0633\u0628\u06a9)', true];
    return ['\u0630\u062e\u06cc\u0631\u0647\u0654 \u062a\u0631\u06a9\u06cc\u0628 \u0641\u0639\u0644\u06cc \u0628\u0647\u200c\u0639\u0646\u0648\u0627\u0646 \u0633\u0628\u06a9 \u062a\u0627\u0632\u0647', false];
  }
  function renderBoxes() {
    var sig = JSON.stringify([st.p, cur()]), sl = saveLabel();
    [].slice.call(document.querySelectorAll('.trp-box')).forEach(function (box) {
      if (box._sig === sig) return;
      var act = document.activeElement;
      if (act && act.classList && act.classList.contains('trp-name') && box.contains(act)) return; /* never steal a rename in progress */
      box._sig = sig;
      box.querySelector('.trp-list').innerHTML = listHtml();
      var sb = box.querySelector('.trp-savebtn');
      sb.textContent = sl[0];
      sb.disabled = sl[1];
    });
  }
  function inject() {
    [].slice.call(document.querySelectorAll('.stmenu-root:not([data-trp])')).forEach(function (root) {
      var pres = root.querySelector('.tr-presets'), box = document.createElement('div');
      root.setAttribute('data-trp', '1');
      box.className = 'trp-box';
      box.innerHTML = boxInner();
      if (pres && pres.parentNode === root) root.insertBefore(box, pres.nextSibling);
      else root.appendChild(box);
    });
    renderBoxes();
  }
  function refresh() {
    [].slice.call(document.querySelectorAll('.wftr-pb')).forEach(function (el) {
      el.outerHTML = bar(el.getAttribute('data-c') || '');
    });
    renderBoxes();
  }
  function openMenu() {
    var d = document.getElementById('wf-tr-drawer'), box;
    if (WF.openDrawer) WF.openDrawer();
    if (!d) return;
    inject();
    [].slice.call(d.querySelectorAll('.stmenu-view')).forEach(function (v) {
      v.hidden = v.getAttribute('data-view') !== 'root';
    });
    d.setAttribute('data-cur', 'root');
    box = d.querySelector('.trp-box');
    if (!box) return;
    try { box.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { box.scrollIntoView(); }
    box.classList.remove('trp-flash');
    void box.offsetWidth;
    box.classList.add('trp-flash');
  }

  /* ---------- events (delegated: bars are re-rendered by their pages) ---------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target && ev.target.closest ? ev.target : null, b, row, i;
    if (!t) return;
    b = t.closest('.wftr-pb button[data-s]');
    if (b) {
      var s = b.getAttribute('data-s');
      if (s === 'save') saveNew();
      else if (s === 'menu') openMenu();
      else use(s);
      return;
    }
    b = t.closest('.trp-box button');
    if (!b) return;
    if (b.classList.contains('trp-savebtn')) { saveNew(); return; }
    row = b.closest('.trp-row');
    if (!row) return;
    i = +row.getAttribute('data-i');
    if (b.classList.contains('trp-use')) use('p' + i);
    else if (b.classList.contains('trp-over')) replaceWith(i);
    else if (b.classList.contains('trp-del')) {
      if (b.hasAttribute('data-sure')) del(i);
      else {
        b.setAttribute('data-sure', '1');
        b.textContent = '\u0645\u0637\u0645\u0626\u0646\u06cc\u061f';
        setTimeout(function () { if (b.isConnected) { b.removeAttribute('data-sure'); b.textContent = '\u062d\u0630\u0641'; } }, 2600);
      }
    }
  });
  document.addEventListener('change', function (ev) {
    var t = ev.target, row;
    if (!t || !t.classList || !t.classList.contains('trp-name')) return;
    row = t.closest('.trp-row');
    if (row) { t.blur(); rename(+row.getAttribute('data-i'), t.value); }
  });
  document.addEventListener('keydown', function (ev) {
    var t = ev.target;
    if (ev.key === 'Enter' && t && t.classList && t.classList.contains('trp-name')) t.blur();
  });
  window.addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    st = load(); refresh();
  });
  /* registered BEFORE the page scripts (tr-prof.js loads right after tr.js), so the stash and the
     bar state are current when quest.js / quest-list.js repaint on the same change */
  WF.onChange(function () { if (!lock) remember(); refresh(); });

  /* ---------- styles (self-contained: the bar lives on any page) ---------- */
  function css() {
    if (document.getElementById('trp-css')) return;
    var s = document.createElement('style');
    s.id = 'trp-css';
    s.textContent = ''
      + '.wftr-pb{display:inline-flex;flex-wrap:wrap;align-items:center;gap:.25rem;margin:.2rem 0 .9rem;padding:.24rem;border:1px solid rgba(214,178,94,.26);border-radius:999px;background:rgba(20,16,10,.55)}'
      + '.wftr-pb button{cursor:pointer;font-family:inherit;font-size:12px;line-height:1.7;padding:.05rem .8rem;border-radius:999px;border:1px solid transparent;background:transparent;color:#bdb7a6;transition:color .2s,background .2s,border-color .2s}'
      + '.wftr-pb button:hover{color:#f6e0a3}'
      + '.wftr-pb button.on{color:#f6e0a3;background:rgba(240,199,94,.13);border-color:rgba(240,199,94,.5)}'
      + '.wftr-pb button[dir="ltr"]{font-family:"Cinzel","Times New Roman",serif;letter-spacing:.04em}'
      + '.wftr-pb .trp-add{color:#d8bf80;border:1px dashed rgba(240,199,94,.34)}'
      + '.wftr-pb .trp-set{display:inline-grid;place-items:center;padding:.15rem .5rem;color:#8e97ab}'
      + '.wftr-pb .trp-set svg{display:block}'
      + '.trp-box{margin:.5rem 0 1rem;padding:.2rem 0}'
      + '.trp-hint{margin:.1rem 0 .55rem;font-size:11.5px;line-height:1.9;color:#8e97ab}'
      + '.trp-row{display:flex;align-items:center;gap:.4rem;padding:.35rem 0;border-bottom:1px solid rgba(240,199,94,.12)}'
      + '.trp-name{flex:1 1 auto;min-width:0;font:inherit;font-size:13px;color:#e8e1cd;background:transparent;border:0;border-bottom:1px solid rgba(240,199,94,.28);border-radius:0;padding:.25rem .15rem;outline:none}'
      + '.trp-name:focus{border-bottom-color:rgba(246,224,163,.95)}'
      + '.trp-row.on .trp-name{color:#f6e0a3}'
      + '.trp-b{flex:none;cursor:pointer;font:inherit;font-size:11.5px;line-height:1.7;padding:.05rem .6rem;color:#bdb7a6;background:transparent;border:1px solid rgba(240,199,94,.26);border-radius:999px;transition:color .2s,border-color .2s}'
      + '.trp-b:hover{color:#f6e0a3;border-color:rgba(240,199,94,.6)}'
      + '.trp-b:disabled{cursor:default;opacity:.55}'
      + '.trp-row.on .trp-use{opacity:1;color:#f6e0a3;background:rgba(240,199,94,.13);border-color:rgba(240,199,94,.5)}'
      + '.trp-del[data-sure]{color:#ff8a7a;border-color:rgba(255,138,122,.6)}'
      + '.trp-savebtn{display:block;width:100%;margin-top:.65rem;padding:.35rem .6rem}'
      + '.trp-empty{margin:.2rem 0;font-size:12px;color:#8e97ab}'
      + '.trp-flash{animation:trpF 1.3s ease}'
      + '@keyframes trpF{0%,100%{background:transparent}30%{background:rgba(240,199,94,.14)}}'
      + '@media (prefers-reduced-motion:reduce){.wftr-pb button,.trp-b{transition:none}.trp-flash{animation:none}}';
    (document.head || document.documentElement).appendChild(s);
  }
  css();
  function boot() {
    inject();
    if (window.MutationObserver && document.body) {
      new MutationObserver(function () {
        if (document.querySelector('.stmenu-root:not([data-trp])')) inject();
      }).observe(document.body, { childList: true, subtree: true });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.WFTRP = {
    bar: bar, use: use, save: saveNew, refresh: refresh, openMenu: openMenu,
    list: function () { return st.p.map(function (p, i) { return { name: pname(i), code: p.c }; }); },
    EN: EN, FA: FA
  };
  }
})();
