/* tr-badge.js v3 - the two-part section marker (the owner's two stars), minimal edition
   Every section title carries one or two small DOTS, no text (owner: dots only, no text):
     circle  = does Persian EXIST for this section?  full (filled green) / part (half amber) / none (grey ring)
     diamond = does the section obey the translation-style (tr.js) switches? on (blue) / part (half amber) / off (coral ring)
               v3: shown to EVERYONE (owner: users may want to know what each translation points to), no close link.
               Clicking the diamond opens the drawer and flashes the switch that owns (or should own) the section.
   The legend (meaning only, no counters) lives INSIDE the page hero, pinned bottom-left (WFTRB.legend()).
   Dots are <span>, never <i>: panel headers style every <i> as their rule line (the v2 'dash' bug).
   Hover a dot for the detail (title attribute). Planned third state: source text changed (Watchtower class B). */
(function () {
  'use strict';
  var audit = true;
  try { localStorage.removeItem('wf-tr-audit'); } catch (e) { /* ignore */ }

  var FA = { full: '\u0641\u0627\u0631\u0633\u06cc \u06a9\u0627\u0645\u0644', part: '\u0641\u0627\u0631\u0633\u06cc \u0646\u06cc\u0645\u0647', none: '\u0641\u0627\u0631\u0633\u06cc \u0646\u062f\u0627\u0631\u062f' };
  var SW = { on: '\u0647\u0648\u0634\u0645\u0646\u062f \u0648\u0635\u0644', part: '\u0647\u0648\u0634\u0645\u0646\u062f \u0646\u06cc\u0645\u0647', off: '\u0647\u0648\u0634\u0645\u0646\u062f \u0648\u0635\u0644 \u0646\u06cc\u0633\u062a' };
  var FA_S = { full: '\u06a9\u0627\u0645\u0644', part: '\u0646\u06cc\u0645\u0647', none: '\u0646\u062f\u0627\u0631\u062f' };
  var SW_S = { on: '\u0648\u0635\u0644', part: '\u0646\u06cc\u0645\u0647', off: '\u0648\u0635\u0644 \u0646\u06cc\u0633\u062a' };
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
    var t = FA[fa] + (b.faNote ? ' \u00b7 ' + b.faNote : ''), h;
    h = '<span class="trb"><span class="trb-d trb-f-' + fa + '" role="img" aria-label="' + esc(FA[fa]) + '" title="' + esc(t) + '"></span>';
    if (audit) {
      t = SW[sw] + (b.swNote ? ' \u00b7 ' + b.swNote : '') + (k ? ' \u00b7 \u06a9\u0644\u06cc\u06a9: \u0646\u0645\u0627\u06cc\u0634 \u06a9\u0644\u06cc\u062f \u062f\u0631 \u0633\u0628\u06a9 \u062a\u0631\u062c\u0645\u0647' : '');
      h += '<button type="button" class="trb-k trb-s-' + sw + '"' + (k ? ' data-trb-k="' + k + '"' : '')
        + ' aria-label="' + esc(SW[sw]) + '" title="' + esc(t) + '"></button>';
    }
    return h + '</span>';
  }
  function item(cls, word) {
    return '<span class="trb-li"><span class="' + cls + '" aria-hidden="true"></span>' + word + '</span>';
  }
  /* legend (meaning only), rendered inside the hero (bottom-left) */
  function legend(list) {
    if (list && !list.length) return '';
    var h = '<div class="trb-leg" role="note"><div class="trb-lr"><span class="trb-lt">\u0641\u0627\u0631\u0633\u06cc</span>'
      + item('trb-d trb-f-full', FA_S.full)
      + item('trb-d trb-f-part', FA_S.part)
      + item('trb-d trb-f-none', FA_S.none) + '</div>';
    if (audit) {
      h += '<div class="trb-lr"><span class="trb-lt">\u0647\u0648\u0634\u0645\u0646\u062f</span>'
        + item('trb-kd trb-s-on', SW_S.on)
        + item('trb-kd trb-s-part', SW_S.part)
        + item('trb-kd trb-s-off', SW_S.off) + '</div>';
    }
    return h + '</div>';
  }

  var G = '#5fd39a', A = '#e8c069', N = '#b4bccb', BLU = '#7cc4ff', R = '#ff8a7a';
  var CSS = ''
    + '.trb{display:inline-flex!important;align-items:center;gap:3px;margin-inline-start:8px;padding:0!important;flex:0 0 auto!important;vertical-align:middle;line-height:1}'
    + '.trb-d{display:inline-block!important;width:9px!important;height:9px!important;min-width:0!important;padding:0!important;border:0!important;border-radius:50%!important;flex:0 0 auto!important;margin:0!important;cursor:help}'
    + '.trb-f-full{background:' + G + ';box-shadow:0 0 6px rgba(95,211,154,.5)}'
    + '.trb-f-part{background:linear-gradient(90deg,' + A + ' 50%,transparent 50%);box-shadow:inset 0 0 0 1.5px ' + A + '}'
    + '.trb-f-none{box-shadow:inset 0 0 0 1.5px ' + N + ';background:rgba(180,188,203,.12)}'
    + '.trb-k{display:inline-grid;place-items:center;width:16px;height:16px;padding:0;margin:0;border:0;background:none;cursor:pointer}'
    + '.trb-k::after,.trb-kd{content:"";display:inline-block;width:7px;height:7px;border-radius:1px;transform:rotate(45deg);flex:0 0 auto;margin:0 2px}'
    + '.trb-k.trb-s-on::after,.trb-kd.trb-s-on{background:' + BLU + ';box-shadow:0 0 6px rgba(124,196,255,.55)}'
    + '.trb-k.trb-s-part::after,.trb-kd.trb-s-part{background:linear-gradient(135deg,' + A + ' 50%,transparent 50%);box-shadow:inset 0 0 0 1.5px ' + A + '}'
    + '.trb-k.trb-s-off::after,.trb-kd.trb-s-off{box-shadow:inset 0 0 0 1.5px ' + R + '}'
    + '.trb-k:hover::after{filter:brightness(1.25)}.trb-k:focus-visible{outline:1px solid ' + BLU + ';outline-offset:1px;border-radius:3px}'
    + '.trb-leg{display:flex;flex-direction:column;align-items:flex-end;gap:4px;margin-top:12px;font-size:12px;line-height:1.6;color:#a9a392}'
    + '.fex-hero:has(.trb-leg){position:relative}'
    + '@media (min-width:760px){.trb-leg{position:absolute;inset-inline-end:22px;bottom:16px;margin:0;max-width:46%;z-index:2}}'
    + '.trb-lr{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:2px 14px}'
    + '.trb-lt{color:#cfc8b4;margin-inline-end:2px}'
    + '.trb-li{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}.trb-li .trb-d{cursor:default}'
    + '';
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

  window.WFTRB = { audit: function () { return audit; }, badge: badge, legend: legend,
    summary: function () { return ''; }, label: label, FA: FA, SW: SW };
})();
