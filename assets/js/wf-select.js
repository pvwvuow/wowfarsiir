/* wf-select.js: replaces native <select class="npcl-in"> (filter bars on the quest / NPC lists) with the site's own
   fantasy dropdown: fading hairline panel, soft fade-in, search for long lists, keyboard, outside click.
   The native select stays in the DOM (hidden) and gets a bubbling 'change' event, so existing handlers keep working. */
(function () {
  'use strict';
  var SEL = 'select.npcl-in', open = null, uid = 0;
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function nz(s) {
    var o = '', i, c;
    s = String(s == null ? '' : s);
    for (i = 0; i < s.length; i++) {
      c = s.charCodeAt(i);
      if (c === 0x64a) c = 0x6cc;
      else if (c === 0x643) c = 0x6a9;
      else if (c === 0x200c) c = 32;
      o += String.fromCharCode(c);
    }
    return o.toLowerCase().trim();
  }
  function label(sel) {
    var o = sel.options[sel.selectedIndex];
    return o ? o.text : '';
  }
  function closeAll() {
    if (!open) return;
    open.pop.classList.remove('on');
    open.btn.setAttribute('aria-expanded', 'false');
    open.pop.hidden = true;
    open.btn.focus({ preventScroll: true });
    open = null;
  }
  function place(o) {
    var r = o.btn.getBoundingClientRect(), pop = o.pop, vh = window.innerHeight, below = vh - r.bottom, w = Math.max(r.width, 220);
    pop.style.minWidth = w + 'px';
    pop.style.left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8)) + 'px';
    if (below < 260 && r.top > below) {
      pop.classList.add('up');
      pop.style.top = 'auto';
      pop.style.bottom = (vh - r.top + 6) + 'px';
      pop.style.maxHeight = Math.min(340, r.top - 16) + 'px';
    } else {
      pop.classList.remove('up');
      pop.style.bottom = 'auto';
      pop.style.top = (r.bottom + 6) + 'px';
      pop.style.maxHeight = Math.min(340, below - 16) + 'px';
    }
  }
  function fill(o, q) {
    var sel = o.sel, h = '', i, opt, t, shown = 0;
    q = nz(q || '');
    for (i = 0; i < sel.options.length; i++) {
      opt = sel.options[i];
      t = opt.text;
      if (q && nz(t).indexOf(q) < 0) continue;
      shown++;
      h += '<li role="option" data-i="' + i + '" id="' + o.id + '-' + i + '"' + (i === sel.selectedIndex ? ' class="sel" aria-selected="true"' : '') + '>' + esc(t) + '</li>';
    }
    o.list.innerHTML = h || '<li class="none">' + 'چیزی پیدا نشد' + '</li>';
    o.act = -1;
    return shown;
  }
  function elTop(o, el) {
    return el.getBoundingClientRect().top - o.list.getBoundingClientRect().top + o.list.scrollTop;
  }
  function setAct(o, k) {
    var items = o.list.querySelectorAll('li[data-i]'), el;
    if (!items.length) return;
    k = (k + items.length) % items.length;
    Array.prototype.forEach.call(items, function (e) { e.classList.remove('act'); });
    el = items[k];
    el.classList.add('act');
    o.act = k;
    var top = elTop(o, el), bot = top + el.offsetHeight;
    if (top < o.list.scrollTop) o.list.scrollTop = top;
    else if (bot > o.list.scrollTop + o.list.clientHeight) o.list.scrollTop = bot - o.list.clientHeight;
  }
  function choose(o, i) {
    o.sel.selectedIndex = +i;
    o.txt.textContent = label(o.sel);
    o.wrap.classList.toggle('has', !!o.sel.value);
    o.sel.dispatchEvent(new Event('change', { bubbles: true }));
    closeAll();
  }
  function show(o) {
    if (open && open !== o) closeAll();
    o.pop.hidden = false;
    fill(o, '');
    if (o.search) o.search.value = '';
    place(o);
    requestAnimationFrame(function () {
      o.pop.classList.add('on');
      var cur = o.list.querySelector('li.sel');
      if (cur) { o.list.scrollTop = Math.max(0, elTop(o, cur) - o.list.clientHeight / 2 + cur.offsetHeight / 2); }
      if (o.search) o.search.focus({ preventScroll: true });
    });
    o.btn.setAttribute('aria-expanded', 'true');
    open = o;
  }
  function build(sel) {
    var o = { sel: sel, id: 'wfs' + (++uid) }, lab, many = sel.options.length > 12;
    var wrap = document.createElement('div');
    wrap.className = 'wfs' + (sel.value ? ' has' : '');
    wrap.innerHTML = '<button type="button" class="wfs-btn" aria-haspopup="listbox" aria-expanded="false"><span class="wfs-t"></span>'
      + '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>'
      + '<div class="wfs-pop" role="listbox" hidden>' + (many ? '<div class="wfs-s"><input type="search" autocomplete="off" placeholder="' + 'جست' + String.fromCharCode(0x200c) + 'وجو' + '"></div>' : '')
      + '<ul></ul></div>';
    sel.parentNode.insertBefore(wrap, sel.nextSibling);
    sel.classList.add('wfs-native');
    sel.tabIndex = -1;
    sel.setAttribute('aria-hidden', 'true');
    o.wrap = wrap;
    o.btn = wrap.querySelector('.wfs-btn');
    o.txt = wrap.querySelector('.wfs-t');
    o.pop = wrap.querySelector('.wfs-pop');
    o.list = wrap.querySelector('ul');
    o.search = wrap.querySelector('input');
    o.txt.textContent = label(sel);
    lab = sel.id ? document.querySelector('label[for="' + sel.id + '"]') : null;
    if (lab) o.btn.setAttribute('aria-label', lab.textContent);
    o.btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      if (open === o) closeAll(); else show(o);
    });
    o.btn.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') { ev.preventDefault(); if (open !== o) show(o); }
    });
    o.list.addEventListener('click', function (ev) {
      var li = ev.target && ev.target.closest ? ev.target.closest('li[data-i]') : null;
      if (li) choose(o, li.getAttribute('data-i'));
    });
    o.list.addEventListener('mousemove', function (ev) {
      var li = ev.target && ev.target.closest ? ev.target.closest('li[data-i]') : null;
      if (!li) return;
      Array.prototype.forEach.call(o.list.querySelectorAll('li.act'), function (e) { e.classList.remove('act'); });
      li.classList.add('act');
    });
    o.pop.addEventListener('keydown', function (ev) {
      var act;
      if (ev.key === 'Escape') { ev.preventDefault(); closeAll(); }
      else if (ev.key === 'ArrowDown') { ev.preventDefault(); setAct(o, o.act + 1); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); setAct(o, o.act < 0 ? -1 : o.act - 1); }
      else if (ev.key === 'Enter') {
        act = o.list.querySelector('li.act') || o.list.querySelector('li[data-i]');
        if (act) { ev.preventDefault(); choose(o, act.getAttribute('data-i')); }
      }
    });
    if (o.search) o.search.addEventListener('input', function () { fill(o, o.search.value); setAct(o, 0); });
    sel.addEventListener('change', function () { o.txt.textContent = label(sel); wrap.classList.toggle('has', !!sel.value); });
    sel._wfs = o;
  }
  function enhance(rootEl) {
    Array.prototype.forEach.call((rootEl || document).querySelectorAll(SEL), function (s) { if (!s._wfs) build(s); });
  }
  document.addEventListener('mousedown', function (ev) {
    if (open && !open.wrap.contains(ev.target)) closeAll();
  });
  window.addEventListener('resize', function () { if (open) place(open); });
  window.addEventListener('scroll', function (ev) {
    if (open && !(ev.target && open.pop.contains(ev.target))) place(open);
  }, true);
  enhance(document);
  new MutationObserver(function (muts) {
    var k, added;
    for (k = 0; k < muts.length; k++) {
      added = muts[k].addedNodes;
      if (added && added.length) { enhance(document); return; }
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
