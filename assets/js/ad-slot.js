/* ad-slot.js: one native ad slot (Yektanet position pos-article-text-card-123929) directly under the page title
   (.fex-hero) on the quest / item / NPC / dungeon database pages.
   The slot div ships in the static HTML (so the ad script finds it at load time) and this script MOVES it under the
   hero as soon as the JS-rendered hero exists, and again after every re-render (language switch). The same node is
   reused, so an ad that has already loaded is not thrown away. */
(function () {
  'use strict';
  var ID = 'pos-article-text-card-123929';
  var wrap = document.querySelector('.wf-ad-title');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'wf-ad-title';
    wrap.innerHTML = '<div id="' + ID + '"></div>';
  }
  wrap.style.cssText = 'position:relative;z-index:2;max-width:720px;margin:.6rem auto 1.4rem;min-height:1px';

  function place() {
    var hero = document.querySelector('.fex-hero');
    if (!hero || !hero.parentNode) return;
    if (hero.nextSibling === wrap) return;
    hero.parentNode.insertBefore(wrap, hero.nextSibling);
  }

  place();
  new MutationObserver(place).observe(document.body, { childList: true, subtree: true });
})();
