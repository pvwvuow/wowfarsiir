/* quest-links.js - makes quest rows on the NPC page and the Forever item card
   open OUR quest page (quest.html?id=<id>) instead of Wowhead. Same idea as
   npc-links.js: idempotent, re-runs after every repaint (MutationObserver). */
(function () {
  'use strict';
  var RE = /^https?:\/\/www\.wowhead\.com\/classic\/quest=(\d+)(?:[/?#].*)?$/;
  function run() {
    var as = document.querySelectorAll('a[href*="wowhead.com/classic/quest="]'), i, m;
    for (i = 0; i < as.length; i++) {
      if (as[i].classList.contains('btn')) continue; /* keep explicit "Wowhead" buttons */
      m = RE.exec(as[i].getAttribute('href') || '');
      if (!m) continue;
      as[i].setAttribute('href', 'quest.html?id=' + m[1]);
      as[i].removeAttribute('target');
      as[i].removeAttribute('rel');
    }
  }
  function start() {
    var t = 0;
    run();
    if (!window.MutationObserver) return;
    new MutationObserver(function () { clearTimeout(t); t = setTimeout(run, 40); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
