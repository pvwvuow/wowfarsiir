/* status-forever.js: "ترجمهٔ Forever" section of status.html.
   Reads data/forever/coverage.json (built by tools/translation_coverage.py) and draws one bar per site
   section (items, tooltips per category, NPC/zone/quest names on item pages, NPC pages, zones, quests, spells).
   Each row names the translation switch that controls it, so a low bar says exactly what to translate,
   and lists real pages (item pages, NPC pages) that are still English so you can open and look. */
(function () {
  'use strict';
  var anchor = document.getElementById('quests');
  if (!anchor) return;
  function fa(n) { return Number(n).toLocaleString('fa-IR'); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function bar(name, done, total, pct, sw, ltr) {
    return '<div class="st-head"><span class="st-name' + (ltr ? ' font-cinzel' : '') + '"' + (ltr ? ' dir="ltr"' : '') + '>' + esc(name) + '</span>' +
      '<span class="st-track"><i style="width:' + Math.min(100, pct) + '%"></i></span>' +
      '<span class="st-pct">' + fa(pct) + '٪</span></div>' +
      '<div style="font-size:13px;opacity:.75;margin:.15rem 0 .1rem;display:flex;gap:.8rem;flex-wrap:wrap"><span>' + fa(done) + ' از ' + fa(total) + '</span>' +
      (sw ? '<span dir="ltr">switch: ' + esc(sw) + '</span>' : '') + '</div>';
  }
  function detail(x) {
    var h = '';
    if (x.note) h += '<p style="margin:.4rem 0;font-size:13.5px;opacity:.85">' + esc(x.note) + '</p>';
    if (x.groups && x.groups.length) {
      h += '<div class="st-list" style="margin:.4rem 0">' + x.groups.map(function (g) {
        return '<div class="st-row">' + bar(g.fa, g.done, g.total, g.pct, g.switch, false) + '</div>';
      }).join('') + '</div>';
    }
    if (x.samples && x.samples.length) {
      h += '<h4>صفحه‌هایی که همین الان انگلیسی‌اند (' + fa(x.samples.length) + ' نمونهٔ بدتر)</h4><ul>' + x.samples.map(function (m) {
        return '<li><a href="' + esc(m.u) + '" target="_blank" rel="noopener"><b dir="ltr">' + esc(m.l) + '</b></a>' +
          (m.w ? ' <span dir="ltr" style="opacity:.75;font-size:12.5px">' + esc(m.w) + '</span>' : '') + '<i>' + fa(m.n) + ' مورد</i></li>';
      }).join('') + '</ul>';
    }
    if (x.missing && x.missing.length) {
      h += '<h4>بیشترین موارد بدون فارسی (' + fa(x.missing.length) + ' مورد اول)</h4><ul>' + x.missing.map(function (m) {
        return '<li><b dir="ltr">' + esc(m.k) + '</b><i>' + fa(m.n) + '×</i></li>';
      }).join('') + '</ul>';
    }
    return h ? '<details><summary><span class="st-chip">جزئیات</span></summary><div class="st-detail">' + h + '</div></details>' : '';
  }
  function render(D) {
    var rows = D.sections.map(function (x) {
      return '<div class="st-row">' + bar(x.fa, x.done, x.total, x.pct, x.switch, false) + detail(x) + '</div>';
    }).join('');
    var ent = (D.entities || []).map(function (e) {
      return '<span class="st-chip' + (e.done === e.total ? ' st-ok' : ' st-warn') + '" dir="ltr">' + esc(e.fa) + ' ' + fa(e.done) + '/' + fa(e.total) + '</span>';
    }).join(' ');
    var when = '';
    try { when = new Date(D.generated).toLocaleString('fa-IR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Tehran' }); } catch (e) { when = D.generated; }
    var sec = document.createElement('section');
    sec.className = 'section';
    sec.id = 'forever-cov';
    sec.style.paddingTop = '4.5rem';
    sec.innerHTML = '<div class="bg-scrim" aria-hidden="true"></div>' +
      '<div class="sect-head"><div class="sect-head-row"><span class="wf-sect-line"></span><span class="wf-sect-dot"></span><h2>ترجمهٔ Forever</h2><span class="wf-sect-dot"></span><span class="wf-sect-line"></span></div>' +
      '<p class="sect-en font-cinzel" dir="ltr">Forever Translation Coverage</p></div>' +
      '<div class="st-wrap"><p class="st-lead">شمارش دقیق هر بخش از سایت Forever؛ هر ردیف می‌گوید کدام سوئیچ حالت ترجمه آن را کنترل می‌کند، و در «جزئیات» لینک صفحه‌هایی که هنوز انگلیسی‌اند. آخرین شمارش: ' + esc(when) +
      (D.build ? ' · بیلد <span dir="ltr">' + esc(D.build) + '</span>' : '') + '.</p>' +
      '<div class="st-list">' + rows + '</div>' +
      (ent ? '<h3 class="qs-h">بانک موجودیت‌ها (entities.json)</h3><p style="display:flex;flex-wrap:wrap;gap:.4rem">' + ent + '</p>' : '') +
      '<div class="st-legend"><p>اعداد را ربات <b dir="ltr">tools/translation_coverage.py</b> می‌شمارد (بدون هوش مصنوعی)، فقط خوانده‌های واقعی داده؛ خط یا نامی «فارسی» حساب می‌شود که مقدار فارسی غیرخالی داشته باشد. کوئست هنوز صفحهٔ مستقل ندارد؛ نمونه‌های کوئست صفحهٔ آیتم‌هایی‌اند که آن کوئست را نشان می‌دهند.</p></div></div>';
    anchor.parentNode.insertBefore(sec, anchor.nextSibling);
    var jump = document.querySelector('.st-jump');
    if (jump) {
      var a = document.createElement('a');
      a.href = '#forever-cov'; a.className = 'btn btn-medallion btn-sm'; a.textContent = 'ترجمهٔ Forever';
      jump.appendChild(a);
    }
  }
  fetch('data/forever/coverage.json?v=' + Date.now()).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }).then(function (D) {
    if (D && D.sections && D.sections.length) render(D);
  });
})();
