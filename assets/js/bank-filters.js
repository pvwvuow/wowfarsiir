/* bank-filters.js - Forever item bank (item.html?ver=forever, no id): source + minimum drop chance filters
   (Issue #195, plan phase 6). Kept OUT of retail.js (same approach as npc-links.js).
   Data: data/forever/db/src-facets.json {facets: {itemId: [mask, bestChancePercent|null, zoneKey|null]}}
         mask bits: 1 drop, 2 boss, 4 rare, 8 elite, 16 dungeon, 32 raid, 64 vendor, 128 quest, 256 object/chest
         (512 crafted is never set in the facets, so there is no chip for it)
         data/forever/db/search-index.json {items: [...]} - the same catalog the bank uses.
   When no filter is active the native bank table is untouched. When a chip / minimum chance /
   name is set, the native table is hidden and this script shows its own result table built from the
   catalog + facets (best drop chance first, "show more" paging). The chance is the BEST chance of the
   item on any creature; the facets carry no per-creature rank, so "boss + 10%" means: sourced from a
   boss AND best chance >= 10%. Everything is lazy: nothing is downloaded until a filter is used. */
(function () {
  'use strict';
  var V = '20261201b', DB = 'data/forever/db/';
  var P = new URLSearchParams(location.search);
  var CHIPS = [
    [1, 'دراپ'], [2, 'باس'], [4, 'کمیاب'], [8, 'الیت'], [16, 'دانجن'],
    [32, 'ریید'], [64, 'وندور'], [128, 'کوئست'], [256, 'صندوق / شیء']
  ];
  var QN = ['#9d9d9d', '#ffffff', '#1eff00', '#0070dd', '#a335ee', '#ff8000', '#e6cc80'];
  var ST = { sel: 0, min: '', q: '', shown: 100 };
  var FAC = null, ITEMS = null, ZN = {}, loading = null, failed = false, last = [], dbt = 0;
  var cache = {};

  function forever() {
    var v = P.get('ver');
    if (v !== 'forever' && v !== 'retail') { try { v = localStorage.getItem('itv-ver'); } catch (e) { v = null; } }
    return v === 'forever';
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function faNum(v) { return String(v).replace(/[0-9]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.charAt(+d); }).replace('.', '٫'); }
  function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  function getJSON(url) {
    if (!cache[url]) {
      cache[url] = fetch(url + '?v=' + V).then(function (r) {
        if (!r.ok) throw new Error(url + ' ' + r.status);
        return r.json();
      });
    }
    return cache[url];
  }
  function opt(url) { return getJSON(url).catch(function () { return null; }); }

  /* ---------- pure logic (exported for the self test) ---------- */
  function toList(items) {
    var out = [], k;
    if (Array.isArray(items)) return items;
    for (k in items) {
      if (Object.prototype.hasOwnProperty.call(items, k) && items[k] && typeof items[k] === 'object') {
        if (items[k].id == null) items[k].id = +k;
        out.push(items[k]);
      }
    }
    return out;
  }
  function filterItems(list, fac, st) {
    var min = parseFloat(st.min), q = String(st.q || '').toLowerCase().trim(), out = [], i, it, f, id, nm;
    for (i = 0; i < list.length; i++) {
      it = list[i];
      id = it.id;
      f = fac[id];
      if (st.sel || !isNaN(min)) {
        if (!f) continue;
        if (st.sel && !(f[0] & st.sel)) continue;
        if (!isNaN(min) && min > 0 && (f[1] == null || f[1] < min)) continue;
      }
      if (q) {
        nm = String(it.name || it.n || '').toLowerCase();
        if (nm.indexOf(q) < 0 && String(id) !== q) continue;
      }
      out.push(it);
    }
    out.sort(function (a, b) {
      var fa = fac[a.id], fb = fac[b.id], ca = fa && fa[1] != null ? fa[1] : -1, cb = fb && fb[1] != null ? fb[1] : -1;
      return cb - ca || (b.ilvl || 0) - (a.ilvl || 0) || (String(a.name || '') < String(b.name || '') ? -1 : 1);
    });
    return out;
  }
  function active() { return !!(ST.sel || (ST.min !== '' && parseFloat(ST.min) > 0) || ST.q.trim()); }

  /* ---------- ui ---------- */
  function css() {
    if (document.getElementById('bf-css')) return;
    var s = document.createElement('style');
    s.id = 'bf-css';
    s.textContent = '.bf-panel{margin:0 0 1rem;padding:.8rem .9rem;border:1px solid rgba(214,178,94,.26);border-radius:10px;background:rgba(20,16,10,.55)}'
      + '.bf-h{font-size:12.5px;color:#d8bf80;margin:0 0 .45rem}'
      + '.bf-chips{display:flex;flex-wrap:wrap;gap:.35rem;margin:0 0 .6rem}'
      + '.bf-chip{cursor:pointer;font-family:inherit;font-size:12px;line-height:1.7;padding:.12rem .7rem;border-radius:999px;border:1px solid rgba(214,178,94,.28);background:transparent;color:#bdb7a6}'
      + '.bf-chip:hover{color:#f6e0a3}.bf-chip.on{color:#f6e0a3;background:rgba(240,199,94,.13);border-color:rgba(240,199,94,.55)}'
      + '.bf-row{display:flex;flex-wrap:wrap;gap:.6rem;align-items:flex-end}'
      + '.bf-f{display:flex;flex-direction:column;gap:.2rem;font-size:12px;color:#bdb7a6}'
      + '.bf-in{font-family:inherit;font-size:13px;padding:.3rem .5rem;border-radius:6px;border:1px solid rgba(214,178,94,.28);background:rgba(10,8,5,.6);color:#e8e1cd;width:7.5rem}'
      + '.bf-in.bf-q{width:11rem}.bf-reset{cursor:pointer;font-family:inherit;font-size:12px;padding:.3rem .8rem;border-radius:6px;border:1px solid rgba(214,178,94,.28);background:transparent;color:#bdb7a6}'
      + '.bf-note{margin:.5rem 0 0;font-size:11.5px;color:#9a9484;line-height:1.8}'
      + '.bf-res{margin:0 0 1rem}.bf-cnt{margin:0 0 .5rem;font-size:13px;color:#d8bf80}'
      + '.bf-tbl{width:100%;border-collapse:collapse;font-size:13px}.bf-tbl th{font-weight:600;color:#bdb7a6;text-align:right;padding:.35rem .5rem;border-bottom:1px solid rgba(214,178,94,.22)}'
      + '.bf-tbl td{padding:.3rem .5rem;border-bottom:1px solid rgba(214,178,94,.08);vertical-align:middle}'
      + '.bf-ic{width:28px;height:28px;border-radius:5px;vertical-align:middle;margin-inline-end:.5rem}.bf-nm{text-decoration:none;font-weight:600}.bf-nm:hover{text-decoration:underline}'
      + '.bf-src{display:inline-block;margin:0 0 0 .2rem;padding:0 .45rem;border-radius:999px;font-size:11px;border:1px solid rgba(214,178,94,.25);color:#bdb7a6}'
      + '.bf-ch{color:#f6e0a3;font-weight:600}.bf-more{cursor:pointer;margin:.7rem auto 0;display:block;font-family:inherit;font-size:13px;padding:.35rem 1.2rem;border-radius:8px;border:1px solid rgba(214,178,94,.35);background:transparent;color:#f6e0a3}'
      + '.bf-none{color:#9a9484;padding:1rem 0}';
    document.head.appendChild(s);
  }
  function panelHtml() {
    return '<div class="bf-h">منبع آیتم</div><div class="bf-chips">'
      + CHIPS.map(function (c) {
        return '<button type="button" class="bf-chip' + (ST.sel & c[0] ? ' on' : '') + '" data-m="' + c[0] + '" aria-pressed="' + (ST.sel & c[0] ? 'true' : 'false') + '">' + c[1] + '</button>';
      }).join('') + '</div><div class="bf-row">'
      + '<label class="bf-f">حداقل شانس دراپ (٪)<input id="bf-min" class="bf-in" type="number" min="0" max="100" step="0.1" value="' + esc(ST.min) + '"></label>'
      + '<label class="bf-f">نام یا شناسه<input id="bf-q" class="bf-in bf-q" type="search" autocomplete="off" value="' + esc(ST.q) + '"></label>'
      + '<button type="button" class="bf-reset" id="bf-reset">پاک‌کردن فیلترها</button></div>'
      + '<p class="bf-note">شانس دراپ = بهترین شانس آیتم روی هر موجود. وقتی فیلتر روشن است، جدول بالاتر از این فهرست جایگزین می‌شود.</p>';
  }
  function ensure() {
    if (!forever() || P.get('id')) return;
    var wrap = document.querySelector('.db-table-wrap'), side = document.querySelector('.db-ah .db-side'), box = document.getElementById('bf-panel'), host;
    if (!wrap) return;
    if (!box) {
      css();
      box = document.createElement('div');
      box.id = 'bf-panel';
      box.className = 'bf-panel';
      box.innerHTML = panelHtml();
      host = side || wrap.parentNode;
      if (side) side.insertBefore(box, side.firstChild);
      else host.insertBefore(box, wrap);
    }
    if (!document.getElementById('bf-res')) {
      var res = document.createElement('section');
      res.id = 'bf-res';
      res.className = 'bf-res';
      res.hidden = true;
      wrap.parentNode.insertBefore(res, wrap);
    }
    if (active()) natives(false);
  }
  function natives(show) {
    ['.db-table-wrap', '.db-more-wrap', '.db-count'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el && el.style.display !== (show ? '' : 'none')) el.style.display = show ? '' : 'none';
    });
  }
  function zoneName(k) {
    var z = ZN[k];
    if (z) return z.fa || z.name;
    return k ? String(k).replace(/^sort:/, '').replace(/-/g, ' ') : '';
  }
  function srcChips(m) {
    return CHIPS.filter(function (c) { return m & c[0]; }).map(function (c) { return '<span class="bf-src">' + c[1] + '</span>'; }).join('');
  }
  function row(it) {
    var f = FAC[it.id] || [0, null, null], q = it.q != null ? it.q : 1, ic = it.icon || it.ic;
    if (!/^[\w.-]+$/.test(String(ic == null ? '' : ic))) ic = '';
    return '<tr><td>' + (ic ? '<img class="bf-ic" src="icons/large/' + esc(ic) + '.jpg" data-ic="' + esc(ic) + '" alt="" loading="lazy">' : '')
      + '<a class="bf-nm" style="color:' + (QN[q] || QN[1]) + '" dir="ltr" href="item.html?ver=forever&amp;id=' + esc(it.id) + '">' + esc(it.name || it.n || ('#' + it.id)) + '</a></td>'
      + '<td>' + (it.ilvl ? faNum(it.ilvl) : '') + '</td><td>' + (it.rlvl ? faNum(it.rlvl) : '') + '</td>'
      + '<td>' + srcChips(f[0]) + '</td><td class="bf-ch">' + (f[1] != null ? faNum(Math.round(f[1] * 100) / 100) + '٪' : '') + '</td>'
      + '<td>' + esc(zoneName(f[2])) + '</td></tr>';
  }
  function render() {
    var res = document.getElementById('bf-res'), h;
    if (!res) return;
    if (!active()) { res.hidden = true; res.innerHTML = ''; natives(true); return; }
    natives(false);
    res.hidden = false;
    if (failed) { res.innerHTML = '<p class="bf-none">فهرست منبع‌ها بارگذاری نشد. یکی از فیلترها را عوض کن تا دوباره امتحان شود.</p>'; return; }
    if (!FAC || !ITEMS) { res.innerHTML = '<p class="bf-none">در حال بارگذاری…</p>'; return; }
    last = filterItems(ITEMS, FAC, ST);
    h = '<p class="bf-cnt">' + faNum(last.length) + ' آیتم</p>';
    if (!last.length) h += '<p class="bf-none">آیتمی با این فیلترها پیدا نشد.</p>';
    else {
      h += '<table class="bf-tbl"><thead><tr><th scope="col">نام</th><th scope="col">آیتم‌لول</th><th scope="col">سطح لازم</th><th scope="col">منبع</th><th scope="col">شانس</th><th scope="col">منطقه</th></tr></thead><tbody>'
        + last.slice(0, ST.shown).map(row).join('') + '</tbody></table>';
      if (last.length > ST.shown) h += '<button type="button" class="bf-more" id="bf-more">نمایش بیشتر</button>';
    }
    res.innerHTML = h;
  }
  function load() {
    if (loading) return loading;
    failed = false;
    loading = Promise.all([getJSON(DB + 'src-facets.json'), getJSON(DB + 'search-index.json'), opt(DB + 'zones-meta.json')]).then(function (r) {
      var zs = r[2] && r[2].zones;
      FAC = (r[0] && r[0].facets) || r[0] || {};
      ITEMS = toList((r[1] && (r[1].items || r[1])) || []);
      if (zs) (Array.isArray(zs) ? zs : Object.keys(zs).map(function (k) { return zs[k]; })).forEach(function (z) {
        ZN[slug(z.name)] = z;
        if (z.slug) ZN[z.slug] = z;
      });
    }).catch(function () { failed = true; loading = null; });
    return loading;
  }
  function refresh() {
    ensure();
    if (active()) { render(); load().then(render); } else render();
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('.bf-chip, #bf-reset, #bf-more') : null, panel;
    if (!b) return;
    if (b.id === 'bf-more') { ST.shown += 100; render(); return; }
    if (b.id === 'bf-reset') {
      ST.sel = 0; ST.min = ''; ST.q = ''; ST.shown = 100;
      panel = document.getElementById('bf-panel');
      if (panel) panel.innerHTML = panelHtml();
      refresh();
      return;
    }
    ST.sel ^= +b.getAttribute('data-m');
    ST.shown = 100;
    b.classList.toggle('on', !!(ST.sel & +b.getAttribute('data-m')));
    b.setAttribute('aria-pressed', (ST.sel & +b.getAttribute('data-m')) ? 'true' : 'false');
    refresh();
  });
  document.addEventListener('input', function (ev) {
    var t = ev.target;
    if (!t) return;
    if (t.id === 'bf-min') ST.min = t.value;
    else if (t.id === 'bf-q') ST.q = t.value;
    else return;
    ST.shown = 100;
    clearTimeout(dbt);
    dbt = setTimeout(refresh, 150);
  });
  /* icon fallback without inline handlers: first failure retries on the wow CDN, second failure gives up */
  document.addEventListener('error', function (ev) {
    var im = ev.target;
    if (!im || im.tagName !== 'IMG' || !im.classList || !im.classList.contains('bf-ic') || im.getAttribute('data-fb')) return;
    im.setAttribute('data-fb', '1');
    im.src = 'https://wow.zamimg.com/images/wow/icons/large/' + im.getAttribute('data-ic') + '.jpg';
  }, true);

  if (typeof module !== 'undefined' && module.exports) { module.exports = { filterItems: filterItems, toList: toList }; return; }
  if (!forever() || P.get('id')) return;
  function start() {
    var t = 0;
    ensure();
    if (!window.MutationObserver) return;
    new MutationObserver(function () { clearTimeout(t); t = setTimeout(ensure, 60); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
