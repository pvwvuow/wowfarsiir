/* tr-badge.js v1 - the two-part section badge (the owner's two stars)
   part 1 (fa: full / part / none) : does Persian EXIST for this section? (everyone sees it)
   part 2 (sw: on / part / off)   : does the section obey the translation-style (tr.js) switches?
          (audit mode only: ?tr-audit=1 turns it on, ?tr-audit=0 off; stored in localStorage wf-tr-audit)
   Clicking part 2 opens the translation-style drawer and flashes the switch that owns (or should own) the section.
   Pages call WFTRB.badge({fa, faNote, sw, swNote, key}) and WFTRB.summary(list).
   Planned third state: source text changed (Watchtower class B, stale translation). */
(function () {
  'use strict';
  var KEY = 'wf-tr-audit', audit = false, m;
  try {
    m = location.search.match(/[?&]tr-audit=([01])/);
    if (m) localStorage.setItem(KEY, m[1]);
    audit = localStorage.getItem(KEY) === '1';
  } catch (e) { audit = /[?&]tr-audit=1/.test(location.search); }

  var FA = { full: '\u0641\u0627\u0631\u0633\u06cc \u06a9\u0627\u0645\u0644', part: '\u0641\u0627\u0631\u0633\u06cc \u0646\u06cc\u0645\u0647', none: '\u0641\u0627\u0631\u0633\u06cc \u0646\u062f\u0627\u0631\u062f' };
  var SW = { on: '\u0647\u0648\u0634\u0645\u0646\u062f \u0648\u0635\u0644', part: '\u0647\u0648\u0634\u0645\u0646\u062f \u0646\u06cc\u0645\u0647', off: '\u0647\u0648\u0634\u0645\u0646\u062f \u0648\u0635\u0644 \u0646\u06cc\u0633\u062a' };
  /* same labels as the tr.js drawer rows */
  var LBL = {
    namesItem: '\u0627\u0633\u0645 \u0622\u06cc\u062a\u0645\u200c\u0647\u0627 \u0648 \u0633\u062a\u200c\u0647\u0627', namesSpell: '\u0627\u0633\u0645 \u0627\u0633\u067e\u0644\u200c\u0647\u0627 \u0648 \u0627\u0633\u062a\u0639\u062f\u0627\u062f\u0647\u0627', namesClass: '\u0627\u0633\u0645 \u06a9\u0644\u0627\u0633\u200c\u0647\u0627 \u0648 \u0634\u0627\u062e\u0647\u200c\u0647\u0627',
    namesNpc: '\u0627\u0633\u0645 \u0634\u062e\u0635\u06cc\u062a\u200c\u0647\u0627 \u0648 \u0645\u0648\u062c\u0648\u062f\u0647\u0627', namesZone: '\u0627\u0633\u0645 \u0645\u0646\u0627\u0637\u0642 \u0648 \u062f\u0627\u0646\u062c\u0646\u200c\u0647\u0627', namesQuest: '\u0639\u0646\u0648\u0627\u0646 \u06a9\u0648\u0626\u0633\u062a\u200c\u0647\u0627',
    namesObj: '\u0627\u0633\u0645 \u0622\u0628\u062c\u06a9\u062a\u200c\u0647\u0627', terms: '\u0627\u0635\u0637\u0644\u0627\u062d\u200c\u0647\u0627\u06cc \u0628\u0627\u0632\u06cc', textDesc: '\u062a\u0648\u0636\u06cc\u062d\u0627\u062a \u0648 \u0627\u0641\u06a9\u062a\u200c\u0647\u0627', textStats: '\u0622\u0645\u0627\u0631 \u0648 \u0627\u0639\u062f\u0627\u062f',
    textReq: '\u0646\u06cc\u0627\u0632\u0645\u0646\u062f\u06cc\u200c\u0647\u0627', textBind: '\u0627\u062a\u0635\u0627\u0644 \u0648 \u06cc\u06a9\u062a\u0627\u06cc\u06cc', textDetail: '\u062c\u0632\u0626\u06cc\u0627\u062a \u0622\u06cc\u062a\u0645', textFlavor: '\u0645\u062a\u0646\u200c\u0647\u0627\u06cc \u062a\u0632\u0626\u06cc\u0646\u06cc',
    uiLabels: '\u0628\u0631\u0686\u0633\u0628\u200c\u0647\u0627\u06cc \u0631\u0627\u0628\u0637 \u0633\u0627\u06cc\u062a'
  };
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function faNum(v) { return String(v).replace(/[0-9]/g, function (d) { return '\u06f0\u06f1\u06f2\u06f3\u06f4\u06f5\u06f6\u06f7\u06f8\u06f9'.charAt(+d); }); }
  function label(k) { return LBL[k] || k; }

  function badge(b) {
    var fa = FA[b.fa] ? b.fa : 'none', sw = SW[b.sw] ? b.sw : 'off', k = String(b.key || '').replace(/[^A-Za-z]/g, '');
    var h = '<span class="trb">'
      + '<span class="trb-fa trb-' + fa + '" title="' + esc(b.faNote || FA[fa]) + '"><i aria-hidden="true"></i>' + FA[fa] + '</span>';
    if (audit) {
      h += '<button type="button" class="trb-sw trb-' + sw + '"' + (k ? ' data-trb-k="' + k + '"' : '')
        + ' title="' + esc((b.swNote || SW[sw]) + (k ? ' \u00b7 \u06a9\u0644\u06cc\u06a9: \u0646\u0645\u0627\u06cc\u0634 \u06a9\u0644\u06cc\u062f \u062f\u0631 \u0633\u0628\u06a9 \u062a\u0631\u062c\u0645\u0647' : '')) + '">'
        + '<i aria-hidden="true"></i>' + SW[sw] + '</button>';
    }
    return h + '</span>';
  }
  function cnt(list, f, v) { var n = 0, i; for (i = 0; i < list.length; i++) if (list[i][f] === v) n++; return n; }
  function summary(list) {
    if (!audit || !list || !list.length) return '';
    var url = location.pathname + (location.search.replace(/([?&])tr-audit=[01]&?/, '$1').replace(/[?&]$/, '') || '');
    url += (url.indexOf('?') < 0 ? '?' : '&') + 'tr-audit=0';
    return '<div class="trb-sum" role="note"><b>\u0628\u0631\u0631\u0633\u06cc \u062a\u0631\u062c\u0645\u0647\u0654 \u0627\u06cc\u0646 \u0635\u0641\u062d\u0647</b>'
      + '<span>' + faNum(list.length) + ' \u0628\u062e\u0634</span>'
      + '<span class="trb-g">\u0641\u0627\u0631\u0633\u06cc: <em class="trb-full">' + faNum(cnt(list, 'fa', 'full')) + ' \u06a9\u0627\u0645\u0644</em>'
      + '<em class="trb-part">' + faNum(cnt(list, 'fa', 'part')) + ' \u0646\u06cc\u0645\u0647</em>'
      + '<em class="trb-none">' + faNum(cnt(list, 'fa', 'none')) + ' \u0646\u062f\u0627\u0631\u062f</em></span>'
      + '<span class="trb-g">\u0647\u0648\u0634\u0645\u0646\u062f: <em class="trb-on">' + faNum(cnt(list, 'sw', 'on')) + ' \u0648\u0635\u0644</em>'
      + '<em class="trb-part">' + faNum(cnt(list, 'sw', 'part')) + ' \u0646\u06cc\u0645\u0647</em>'
      + '<em class="trb-off">' + faNum(cnt(list, 'sw', 'off')) + ' \u0648\u0635\u0644 \u0646\u06cc\u0633\u062a</em></span>'
      + '<a class="trb-x" href="' + esc(url) + '">\u0628\u0633\u062a\u0646 \u062d\u0627\u0644\u062a \u0628\u0631\u0631\u0633\u06cc</a></div>';
  }

  var CSS = ''
    + '.trb{display:inline-flex;align-items:center;gap:6px;flex:0 0 auto;margin-inline-start:10px;vertical-align:middle;'
    + 'font-size:12px;line-height:1.5;font-weight:500;letter-spacing:0;text-transform:none;white-space:nowrap}'
    + '.trb>span,.trb>button{display:inline-flex;align-items:center;gap:5px;padding:1px 8px 1px 9px;border-radius:999px;'
    + 'border:1px solid currentColor;background:transparent;font:inherit;color:inherit;cursor:default}'
    + '.trb i{width:6px;height:6px;border-radius:50%;background:currentColor;flex:0 0 auto}'
    + '.trb-fa.trb-full{color:#5fd39a;background:rgba(95,211,154,.10);border-color:rgba(95,211,154,.38)}'
    + '.trb-fa.trb-part{color:#e8c069;background:rgba(232,192,105,.10);border-color:rgba(232,192,105,.38)}'
    + '.trb-fa.trb-part i{background:linear-gradient(90deg,currentColor 50%,transparent 50%);box-shadow:inset 0 0 0 1px currentColor}'
    + '.trb-fa.trb-none{color:#9aa3b5;background:rgba(154,163,181,.08);border-color:rgba(154,163,181,.30)}'
    + '.trb-fa.trb-none i{background:transparent;box-shadow:inset 0 0 0 1px currentColor}'
    + '.trb-sw{cursor:pointer!important}'
    + '.trb-sw.trb-on{color:#7cc4ff;background:rgba(124,196,255,.10);border-color:rgba(124,196,255,.40)}'
    + '.trb-sw.trb-part{color:#e8c069;background:rgba(232,192,105,.08);border-color:rgba(232,192,105,.40);border-style:dashed}'
    + '.trb-sw.trb-off{color:#ff8a7a;background:rgba(255,138,122,.08);border-color:rgba(255,138,122,.45);border-style:dashed}'
    + '.trb-sw.trb-off i{background:transparent;box-shadow:inset 0 0 0 1px currentColor}'
    + '.trb-sw:hover{filter:brightness(1.18)}.trb-sw:focus-visible{outline:2px solid currentColor;outline-offset:2px}'
    + '.fex-sh:has(.trb),.fex-ph:has(.trb){flex-wrap:wrap;row-gap:6px}'
    + '.trb-hero{margin:8px 0 2px}.trb-hero .trb{margin-inline-start:0}'
    + '.trb-sum{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;margin:12px 0;padding:10px 14px;border-radius:12px;'
    + 'border:1px dashed rgba(124,196,255,.40);background:rgba(10,18,34,.62);font-size:14px;line-height:1.6;color:#d9e2f2}'
    + '.trb-sum b{color:#7cc4ff;font-weight:700}.trb-sum em{font-style:normal;margin-inline-start:6px}'
    + '.trb-sum .trb-full{color:#5fd39a}.trb-sum .trb-part{color:#e8c069}.trb-sum .trb-none{color:#9aa3b5}'
    + '.trb-sum .trb-on{color:#7cc4ff}.trb-sum .trb-off{color:#ff8a7a}'
    + '.trb-sum .trb-x{margin-inline-start:auto;color:#9aa3b5;font-size:13px}';
  function css() {
    if (document.getElementById('trb-css')) return;
    var st = document.createElement('style');
    st.id = 'trb-css';
    st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }
  css();
  document.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('[data-trb-k]') : null;
    if (!b) return;
    ev.preventDefault();
    ev.stopPropagation();
    if (window.WFTR && window.WFTR.flash) window.WFTR.flash(b.getAttribute('data-trb-k'));
  }, true);

  window.WFTRB = { audit: function () { return audit; }, badge: badge, summary: summary, label: label, FA: FA, SW: SW };
})();
