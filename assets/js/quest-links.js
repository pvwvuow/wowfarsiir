/* quest-links.js - makes quest rows on the NPC page, the Forever item card and the dungeon page
   open OUR quest page (quest.html?id=<id>) instead of Wowhead, and puts the golden "!" in front of every
   quest row (the same mark the quest page uses). Same idea as npc-links.js: idempotent, re-runs after
   every repaint (MutationObserver). */
(function () {
  'use strict';
  var RE = /^https?:\/\/www\.wowhead\.com\/classic\/quest=(\d+)(?:[/?#].*)?$/;
  var CSS = 'html body .q-bang{flex:0 0 auto;display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;'
    + 'font-style:normal;font-weight:900;font-size:13px;line-height:1;font-family:Georgia,"Times New Roman",serif;'
    + 'color:#1a1306;background:radial-gradient(circle at 35% 30%,#ffe9a0,#f0c75e 60%,#c9a232);'
    + 'box-shadow:0 0 8px rgba(240,199,94,.55),inset 0 0 0 1px rgba(26,19,6,.35)}';
  function css() {
    var s;
    if (document.getElementById('wf-qbang-css')) return;
    s = document.createElement('style');
    s.id = 'wf-qbang-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  function run() {
    var as = document.querySelectorAll('a[href*="wowhead.com/classic/quest="]'), i, m, rows, b, lead;
    for (i = 0; i < as.length; i++) {
      if (as[i].classList.contains('btn')) continue; /* keep explicit "Wowhead" buttons */
      m = RE.exec(as[i].getAttribute('href') || '');
      if (!m) continue;
      as[i].setAttribute('href', 'quest.html?id=' + m[1]);
      as[i].removeAttribute('target');
      as[i].removeAttribute('rel');
    }
    /* every quest row gets the "!" (rows that already have one, or the item page's own mark, are left alone) */
    rows = document.querySelectorAll('a.fex-npc[href^="quest.html?id="]');
    for (i = 0; i < rows.length; i++) {
      if (rows[i].querySelector('.q-bang,.fex-qm')) continue;
      b = document.createElement('i');
      b.className = 'q-bang';
      b.setAttribute('aria-hidden', 'true');
      b.textContent = '!';
      lead = rows[i].firstElementChild;
      if (lead && lead.classList.contains('fex-med')) rows[i].replaceChild(b, lead);
      else rows[i].insertBefore(b, rows[i].firstChild);
    }
  }
  function start() {
    var t = 0;
    css();
    run();
    if (!window.MutationObserver) return;
    new MutationObserver(function () { clearTimeout(t); t = setTimeout(run, 40); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
