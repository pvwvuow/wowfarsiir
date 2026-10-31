/* wowfarsi - mixed Persian/English text fix.
   In a right-to-left sentence a run of English words ("Blinding Sleet", "Mind Freeze", "Mythic+") must be an
   isolated left-to-right island, otherwise the browser shuffles the words and punctuation around it.
   This wraps every Latin run inside Persian sentences of tooltips and guides in <bdi class="lt">.
   Runs on all pages that load support.js; also watches tooltips that are re-rendered on hover. */
"use strict";
(function () {
  var FA = /[\u0600-\u06FF]/;
  var LAT = /[A-Za-z][A-Za-z0-9'\u2019\-]*\+?(?: [A-Za-z][A-Za-z0-9'\u2019\-]*\+?)*/g;
  /* elements whose text is Persian prose (processed when they contain Persian letters) */
  var SEL = [".rt-p", ".rt-ul li", ".rt-steps li", ".rt-cd > div", ".rt-card p", ".rt-call", ".rt-kv span", ".rt-lead",
    ".rt-item .fx", ".rt-item .sub", ".rt-tip p", ".ttip-fa p", ".ttip-desc", ".rt-sec h3", ".rt-map .note",
    ".rt-meta span", ".nw-desc", ".nw-lede", ".footer-note"].join(",");
  /* short labels that can be pure English but still carry a sign like "+" (Mythic+) */
  var LABEL = ".rt-tabs a,.rt-tile b,.rt-mtabs button,.rt-card h4,.rt-crumb span";
  var SKIP = "bdi.lt,.sp,.it,code,.tk,script,style,[dir=ltr]";
  var running = false, obs = null;

  function fixNode(el, force) {
    if (!el || el.nodeType !== 1) return;
    var txt = el.textContent || "";
    if (!force && !FA.test(txt)) return;
    if (force && !FA.test(txt) && txt.indexOf("+") < 0) return;
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var todo = [], n;
    while ((n = w.nextNode())) {
      var p = n.parentNode;
      if (!p || !n.nodeValue || !/[A-Za-z]/.test(n.nodeValue)) continue;
      var sk = p.closest ? p.closest(SKIP) : null;
      if (sk && sk !== el) continue;
      todo.push(n);
    }
    todo.forEach(function (t) {
      var s = t.nodeValue, last = 0, m, frag = document.createDocumentFragment(), hit = false;
      LAT.lastIndex = 0;
      while ((m = LAT.exec(s))) {
        hit = true;
        if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
        var b = document.createElement("bdi");
        b.className = "lt";
        b.textContent = m[0];
        frag.appendChild(b);
        last = m.index + m[0].length;
      }
      if (!hit) return;
      if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
      t.parentNode.replaceChild(frag, t);
    });
  }

  function scan(root) {
    if (!root) return;
    if (root.nodeType === 3) root = root.parentElement;
    if (!root || root.nodeType !== 1) return;
    var host = root.closest ? root.closest(SEL) : null;
    if (host) fixNode(host, false);
    else {
      if (root.matches && root.matches(SEL)) fixNode(root, false);
      Array.prototype.forEach.call(root.querySelectorAll(SEL), function (e) { fixNode(e, false); });
    }
    var lab = root.closest ? root.closest(LABEL) : null;
    if (lab) fixNode(lab, true);
    else {
      if (root.matches && root.matches(LABEL)) fixNode(root, true);
      Array.prototype.forEach.call(root.querySelectorAll(LABEL), function (e) { fixNode(e, true); });
    }
  }

  function start() {
    scan(document.body);
    if (!window.MutationObserver) return;
    var queue = [];
    obs = new MutationObserver(function (recs) {
      recs.forEach(function (r) { Array.prototype.forEach.call(r.addedNodes, function (n) { queue.push(n); }); });
      if (running || !queue.length) return;
      running = true;
      requestAnimationFrame(function () {
        obs.disconnect();
        var q = queue; queue = [];
        q.forEach(scan);
        obs.observe(document.body, { childList: true, subtree: true });
        running = false;
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
