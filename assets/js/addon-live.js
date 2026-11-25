/* wowfarsi - addon page: the newest published WoWFA Forever build, read live from GitHub
   (pvwvuow/wowfarsi-addon releases, tags forever-v*). Every new release shows here by itself,
   no site rebuild needed. The last good answer is cached, the HTML holds a static fallback. */
(function () {
  'use strict';
  var API = 'https://api.github.com/repos/pvwvuow/wowfarsi-addon/releases?per_page=40';
  var KEY = 'wfa-addon-release-v1';
  var MAX_AGE = 10 * 60 * 1000;

  function $(id) { return document.getElementById(id); }
  function pick(list) {
    if (!Array.isArray(list)) return null;
    for (var i = 0; i < list.length; i++) {
      var r = list[i];
      if (r && !r.draft && /^forever-v/.test(r.tag_name || '')) return r;
    }
    return null;
  }
  function slim(r) {
    var zip = null;
    (r.assets || []).forEach(function (a) {
      if (!zip && /\.zip$/i.test(a.name || '')) zip = a;
    });
    return {
      ver: String(r.tag_name).replace(/^forever-v/, ''),
      date: r.published_at,
      url: r.html_url,
      zip: zip ? zip.browser_download_url : null,
      size: zip ? zip.size : 0,
      body: r.body || ''
    };
  }
  function render(x) {
    if (!x) return;
    if ($('ad-ver')) $('ad-ver').textContent = x.ver;
    if ($('ad-date') && x.date) {
      try {
        $('ad-date').textContent = 'منتشرشده در ' + new Date(x.date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
      } catch (e) { /* keep the fallback */ }
    }
    if ($('ad-dl') && x.zip) $('ad-dl').href = x.zip;
    if ($('ad-gh') && x.url) $('ad-gh').href = x.url;
    if ($('ad-size') && x.size) $('ad-size').textContent = (x.size / 1048576).toFixed(1) + ' MB';
    if ($('ad-notes') && x.body) {
      var t = x.body.replace(/\r/g, '').replace(/\n*Data from ForeverDB\.net\s*$/i, '').trim();
      $('ad-notes').textContent = t;
    }
  }
  var cached = null;
  try { cached = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { cached = null; }
  if (cached && cached.x) render(cached.x);
  if (cached && cached.t && Date.now() - cached.t < MAX_AGE) return;
  if (!window.fetch) return;
  fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (list) {
      var r = pick(list);
      if (!r) return;
      var x = slim(r);
      render(x);
      try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), x: x })); } catch (e) { /* private mode */ }
    })
    .catch(function () { /* offline or rate limited: the cache / fallback stays */ });
})();
