/* npc-ext.js - NPC page extras on top of npc.js (it only watches #npc-root and works after every repaint):
   1) trainer spells: no Wowhead link any more. Each spell shows its game icon, the Persian / English name,
      the level, and links to our spellbook; a small tooltip pops up on hover (or focus) with the description.
   2) quest rows: the Persian quest title (namesQuest switch) with the English one under it.
   Data: data/forever/db/spells.json (same file the spellbook reads), i18n/quest-fa-titles.json (as quest.js). */
(function () {
  'use strict';
  var root = document.getElementById('npc-root');
  if (!root) return;
  var WF = window.WFTR || null;
  var SPV = '20261103a', QV = '20261103d';
  /* unconfirmed server-hotfix overlay (spells.json rows carry row.hf): gold badge on the
     trainer-spell row + a line in the hover tooltip; disappears by itself on retirement */
  var HF_BADGE = '\u0647\u0627\u062a\u200c\u0641\u06cc\u06a9\u0633 \u06f3 \u0646\u0648\u0627\u0645\u0628\u0631 \u00b7 \u062a\u0627\u06cc\u06cc\u062f\u0646\u0634\u062f\u0647';
  var HF_TITLE = '\u0645\u0646\u0628\u0639: \u0641\u0646\u200c\u0633\u0627\u06cc\u062a \u2014 \u0628\u0644\u06cc\u0632\u0627\u0631\u062f \u0628\u0631\u0627\u06cc \u0627\u06cc\u0646 \u0647\u0627\u062a\u200c\u0641\u06cc\u06a9\u0633 \u06cc\u0627\u062f\u062f\u0627\u0634\u062a \u0645\u0646\u062a\u0634\u0631 \u0646\u06a9\u0631\u062f\u0647 \u0627\u0633\u062a';
  var HF_LINE = '\u0627\u06cc\u0646 \u0627\u0639\u062f\u0627\u062f \u0628\u0627 \u0647\u0627\u062a\u200c\u0641\u06cc\u06a9\u0633 \u0633\u0631\u0648\u0631 \u062f\u0631 \u06f3 \u0646\u0648\u0627\u0645\u0628\u0631 \u0639\u0648\u0636 \u0634\u062f\u0647\u200c\u0627\u0646\u062f \u2014 \u0627\u0632 \u06cc\u06a9 \u0641\u0646\u200c\u0633\u0627\u06cc\u062a\u061b \u0628\u0644\u06cc\u0632\u0627\u0631\u062f \u06cc\u0627\u062f\u062f\u0627\u0634\u062a \u0631\u0633\u0645\u06cc \u0645\u0646\u062a\u0634\u0631 \u0646\u06a9\u0631\u062f\u0647 \u0627\u0633\u062a.';
  function hfOn(s) { return !!(s && s.hf && s.hf.status === 'unconfirmed'); }
  function hfBadge() {
    return '<span class="hf-un" title="' + HF_TITLE + '" style="direction:rtl;display:inline-block;margin-inline-start:.35rem;padding:0 7px;border-radius:999px;font-size:.62rem;font-weight:800;line-height:1.7;vertical-align:middle;color:#3a2703;background:linear-gradient(135deg,#f8dd8f,#d9a53a);border:1px solid #b8860b;white-space:nowrap">' + HF_BADGE + '</span>';
  }
  var SPD = null, FAT = null, loading = null, timer = 0, tip = null, cur = null;
  var ZAM = 'https://wow.zamimg.com/images/wow/icons/large/';
  var CSS = 'html body .npc-sp .npc-ic{width:30px;height:30px;border-radius:6px;border:1px solid rgba(240,199,94,.35);flex:0 0 auto}'
    + 'html body .npc-sp .fex-lv{margin-inline-start:auto}'
    + 'html body .npc-sptip{position:fixed;z-index:500;max-width:21rem;padding:.75rem .95rem .8rem;pointer-events:none;font-size:.86rem;line-height:1.9;'
    + 'color:var(--parch,#ece7f3);background:linear-gradient(165deg,rgba(27,22,35,.97),rgba(9,12,22,.98));border:1px solid rgba(240,199,94,.4);border-radius:10px;'
    + 'box-shadow:0 14px 40px rgba(0,0,0,.6);display:none}'
    + 'html body .npc-sptip .tn{display:flex;align-items:center;gap:.55rem;margin:0 0 .25rem;font-weight:800;font-size:.95rem;color:var(--gold-1,#f6e0a3)}'
    + 'html body .npc-sptip .tn img{width:32px;height:32px;border-radius:6px;border:1px solid rgba(240,199,94,.45)}'
    + 'html body .npc-sptip .ts{margin:0 0 .3rem;font-size:.72rem;color:var(--mut,#8e97ab)}'
    + 'html body .npc-sptip .tb{margin:0}'
    + 'html body .npc-sptip .rt-en{direction:ltr;text-align:left}';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function faNum(v) { return String(v).replace(/[0-9]/g, function (d) { return '\u06f0\u06f1\u06f2\u06f3\u06f4\u06f5\u06f6\u06f7\u06f8\u06f9'.charAt(+d); }); }
  function on(k) { try { return WF && WF.on ? !!WF.on(k) : true; } catch (e) { return true; } }
  function getJ(url) { return fetch(url).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }
  function injectCss() {
    var s;
    if (document.getElementById('wf-npcext-css')) return;
    s = document.createElement('style');
    s.id = 'wf-npcext-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------- data ---------- */
  function ensure() {
    if (SPD && FAT) return Promise.resolve();
    if (!loading) {
      loading = Promise.all([
        getJ('data/forever/db/spells.json?v=' + SPV),
        getJ('data/forever/i18n/quest-fa-titles.json?v=' + QV)
      ]).then(function (r) {
        var m = {};
        if (r[0] && r[0].classes) r[0].classes.forEach(function (c) {
          (c.spells || []).forEach(function (s) {
            var o = m[s.n];
            /* one entry per name: the lowest rank (the one a trainer shows first) */
            if (!o || (s.r || 0) < (o.s.r || 0)) m[s.n] = { cls: c.cls, s: s };
          });
        });
        SPD = m;
        FAT = (r[1] && r[1].t) || {};
      });
    }
    return loading;
  }

  /* ---------- trainer spells ---------- */
  function spellNameParts(s) {
    var fa = on('namesSpell') && s.fn;
    return { main: fa ? s.fn : s.n, sub: fa ? s.n : '' };
  }
  function decorateSpells() {
    var as = root.querySelectorAll('a[href*="wowhead.com/classic/spell="]'), i, a, nmEl, name, d, p, lv, h;
    for (i = 0; i < as.length; i++) {
      a = as[i];
      if (a.classList.contains('btn')) continue;
      nmEl = a.querySelector('.fex-npc-nm');
      name = nmEl ? nmEl.textContent.trim() : '';
      d = name && SPD ? SPD[name] : null;
      a.removeAttribute('target');
      a.removeAttribute('rel');
      if (!d) { a.removeAttribute('href'); continue; } /* not in the spellbook data: a plain row, no Wowhead link */
      p = spellNameParts(d.s);
      lv = d.s.lv != null ? '<span class="fex-lv">' + (on('uiLabels') ? '\u0633\u0637\u062d ' + faNum(d.s.lv) : 'Lv ' + d.s.lv) + '</span>' : '';
      h = '<img class="npc-ic" src="icons/large/' + esc(d.s.icon) + '.jpg" data-ic="' + esc(d.s.icon) + '" alt="" loading="lazy">'
        + '<span class="fex-npc-nm' + (on('namesSpell') && d.s.fn ? '' : ' rt-en') + '"' + (on('namesSpell') && d.s.fn ? '' : ' dir="ltr"') + '>' + esc(p.main) + '</span>'
        + (p.sub ? '<span class="fex-sub rt-en" dir="ltr">' + esc(p.sub) + '</span>' : '') + lv
        + (hfOn(d.s) ? hfBadge() : '');
      a.setAttribute('href', 'spellbook.html#' + d.cls);
      a.classList.add('npc-sp');
      a.setAttribute('data-sp', name);
      a.innerHTML = h;
    }
  }

  /* ---------- quest rows: Persian title ---------- */
  function decorateQuests() {
    var rows = root.querySelectorAll('a.fex-npc[href^="quest.html?id="]'), i, a, m, t, nm, en;
    if (!on('namesQuest')) return;
    for (i = 0; i < rows.length; i++) {
      a = rows[i];
      if (a.getAttribute('data-qfa')) continue;
      m = /id=(\d+)/.exec(a.getAttribute('href'));
      t = m && FAT ? FAT[m[1]] : '';
      nm = a.querySelector('.fex-npc-nm');
      if (!t || !nm) continue;
      en = nm.textContent;
      nm.classList.remove('rt-en');
      nm.removeAttribute('dir');
      nm.textContent = String(t).replace(/\{\{(?:npc|zn|it|sp|ob|qs|cls|tm):([^|{}]*)\|([^|{}]*)\}\}/g, '$2');
      if (!nm.nextElementSibling || !nm.nextElementSibling.classList.contains('fex-sub')) {
        nm.insertAdjacentHTML('afterend', '<span class="fex-sub rt-en" dir="ltr">' + esc(en) + '</span>');
      }
      a.setAttribute('data-qfa', '1');
    }
  }

  /* ---------- tooltip ---------- */
  function tipHtml(a) {
    var d = SPD && SPD[a.getAttribute('data-sp')], s, p, txt, h, meta = [];
    if (!d) return '';
    s = d.s;
    p = spellNameParts(s);
    if (s.t) meta.push(esc(s.t));
    if (s.lv != null) meta.push(on('uiLabels') ? '\u0633\u0637\u062d ' + faNum(s.lv) : 'Level ' + s.lv);
    if (s.r) meta.push(on('uiLabels') ? faNum(s.r) + ' \u0631\u062f\u0647' : 'Rank ' + s.r);
    h = '<p class="tn"><img src="icons/large/' + esc(s.icon) + '.jpg" alt=""><span>' + esc(p.main)
      + (p.sub ? ' <span class="rt-en" dir="ltr" style="font-weight:400;font-size:.78rem;color:var(--mut,#8e97ab)">' + esc(p.sub) + '</span>' : '') + '</span></p>'
      + (meta.length ? '<p class="ts">' + meta.join(' \u00b7 ') + '</p>' : '');
    if (on('textDesc') && s.ftip) {
      txt = esc(s.ftip);
      if (window.WFTR && WFTR.faTokens) txt = WFTR.faTokens(txt);
      h += '<p class="tb">' + txt + '</p>';
    } else if (s.tip) {
      h += '<p class="tb rt-en" dir="ltr">' + esc(s.tip) + '</p>';
    }
    if (hfOn(s)) h += '<p class="tb" style="margin:.3rem 0 0;font-size:.74rem;color:#f0cf7a">\u26a0 ' + HF_LINE + '</p>';
    return h;
  }
  function place(x, y) {
    var w = tip.offsetWidth, h = tip.offsetHeight, L = x + 16, T = y + 18;
    if (L + w > window.innerWidth - 8) L = Math.max(8, x - w - 16);
    if (T + h > window.innerHeight - 8) T = Math.max(8, y - h - 12);
    tip.style.left = L + 'px';
    tip.style.top = T + 'px';
  }
  function show(a, x, y) {
    var h = tipHtml(a);
    if (!h) return;
    if (!tip) { tip = document.createElement('div'); tip.className = 'npc-sptip'; tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip); }
    tip.innerHTML = h;
    tip.style.display = 'block';
    cur = a;
    place(x, y);
  }
  function hide() { if (tip) tip.style.display = 'none'; cur = null; }
  root.addEventListener('mouseover', function (e) {
    var a = e.target.closest ? e.target.closest('.npc-sp') : null;
    if (a) show(a, e.clientX, e.clientY);
  });
  root.addEventListener('mousemove', function (e) { if (cur && tip) place(e.clientX, e.clientY); });
  root.addEventListener('mouseout', function (e) {
    var a = e.target.closest ? e.target.closest('.npc-sp') : null;
    if (a && !(e.relatedTarget && a.contains(e.relatedTarget))) hide();
  });
  root.addEventListener('focusin', function (e) {
    var a = e.target.closest ? e.target.closest('.npc-sp') : null, r;
    if (a) { r = a.getBoundingClientRect(); show(a, r.left + 20, r.top + 10); }
  });
  root.addEventListener('focusout', hide);
  window.addEventListener('scroll', hide, { passive: true });

  /* ---------- run after every repaint ---------- */
  function run() {
    var needs = root.querySelector('a[href*="wowhead.com/classic/spell="], a.fex-npc[href^="quest.html?id="]:not([data-qfa])');
    if (!needs) return;
    ensure().then(function () { decorateSpells(); decorateQuests(); });
  }
  injectCss();
  run();
  new MutationObserver(function () { clearTimeout(timer); timer = setTimeout(run, 50); }).observe(root, { childList: true, subtree: true });
})();
