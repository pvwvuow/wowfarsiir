/* ad-slot.js: one native ad slot (Yektanet position pos-article-text-card-123929) directly under the page title
   (.fex-hero) on the quest / item / NPC / dungeon database pages. Those pages render their hero with JS, so the slot is
   inserted as soon as a hero exists and moved back under it after every re-render (language switch). The same node is
   reused, so an ad that has already loaded is not thrown away. The Yektanet script is already on the page (tr.js); if it
   did not fill the late slot, it is loaded once more. */
(function () {
  'use strict';
  var ID = 'pos-article-text-card-123929';
  var YN = 'https://cdn.yektanet.com/superscript-v2/JIWAxxfW/native-49139/yn_pub.js?v=202601001019';
  var wrap = null, kicked = false;

  function make() {
    wrap = document.createElement('div');
    wrap.className = 'wf-ad-title';
    wrap.style.cssText = 'position:relative;z-index:2;max-width:720px;margin:.6rem auto 1.4rem;min-height:1px';
    wrap.innerHTML = '<div id="' + ID + '"></div>';
  }
  function kick() {
    var slot = document.getElementById(ID), s;
    if (!slot || slot.children.length) return;
    s = document.createElement('script');
    s.async = true;
    s.src = YN + '&r=' + Date.now();
    document.head.appendChild(s);
  }
  function place() {
    var hero = document.querySelector('.fex-hero');
    if (!hero || !hero.parentNode) return;
    if (!wrap) make();
    if (hero.nextSibling === wrap) return;
    hero.parentNode.insertBefore(wrap, hero.nextSibling);
    if (!kicked) { kicked = true; setTimeout(kick, 2000); }
  }

  place();
  new MutationObserver(place).observe(document.body, { childList: true, subtree: true });
})();
