/* studio-suggest.js — «کمک به ترجمه»: the community tab of the custom room.
   Search a word / name / sentence (English or Persian), see the CURRENT
   Persian, and suggest a better one. A suggestion never touches the site
   directly: it goes to a review box; once a reviewer accepts it, it is fixed
   everywhere (same data files the site already serves).
   Backend: data/forever/i18n/suggest.json {endpoint,key,table} = a Supabase
   REST table with an insert-only anon key (see docs/TRANSLATION_SUGGEST.md).
   Empty endpoint = suggestions stay on THIS device and the tab says so.
   Data used (all already on the site):
     entities.json  (spells, NPCs, zones, terms, item refs ...)
     shared.json    (sentence patterns)
     search-index.json (item names, English)  +  fa-N.json shard (item FA name)
   studio.js calls WFSuggest.html() / WFSuggest.wire(root) for the tab. */
(function () {
  'use strict';
  var V = '20261116a', DB_V = '20261110o';
  var HAS_FA = /[\u0600-\u06FF]/;
  var LS_SENT = 'wf-sugg-sent', LS_DAY = 'wf-sugg-day', DAY_MAX = 30, MAX_ROWS = 40;
  var TYPE_LB = { spell: 'اسپل', skill: 'مهارت', talent_tree: 'درخت تلنت', zone: 'منطقه', creature: 'موجود',
    creature_type: 'نوع موجود', npc: 'NPC', faction: 'فکشن', item_ref: 'آیتم / ست', term: 'اصطلاح',
    sentence: 'جمله', item: 'آیتم', text: 'متن دلخواه' };
  var S = { q: '', pairs: null, loading: false, items: null, itemsSt: 0, cfg: {}, cfgP: null, res: [], root: null, t: 0 };
  var shards = {};

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function nz(s) {
    return String(s == null ? '' : s).replace(/\u064a/g, '\u06cc').replace(/\u0643/g, '\u06a9')
      .replace(/[\u200c\u200e\u200f]/g, ' ').toLowerCase().trim();
  }
  function faNum(v) { return String(v).replace(/[0-9]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.charAt(+d); }); }
  function jget(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); });
  }
  function lsGet(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  function today() { return new Date().toISOString().slice(0, 10); }

  /* ---------- data ---------- */
  function walk(o, out, t, d) {
    var ks, i, x, en, fa;
    if (!o || typeof o !== 'object' || d > 4) return;
    if (Array.isArray(o)) {
      for (i = 0; i < o.length; i++) {
        x = o[i];
        if (x && typeof x === 'object' && !Array.isArray(x)) {
          en = x.en || x.EN || x.source || x.k; fa = x.fa || x.FA || x.target || x.v;
          if (typeof en === 'string' && typeof fa === 'string' && HAS_FA.test(fa)) out.push({ k: en, fa: fa, t: t });
          else walk(x, out, t, d + 1);
        }
      }
      return;
    }
    ks = Object.keys(o);
    for (i = 0; i < ks.length; i++) {
      if (ks[i].charAt(0) === '_') continue;
      x = o[ks[i]];
      if (typeof x === 'string') { if (/[A-Za-z]/.test(ks[i]) && HAS_FA.test(x)) out.push({ k: ks[i], fa: x, t: t }); }
      else walk(x, out, t, d + 1);
    }
  }
  function loadPairs(cb) {
    var out = [], seen = {};
    var p1 = jget('data/forever/i18n/entities.json?v=' + V).then(function (j) {
      var T = (j && j.types) || {};
      Object.keys(T).forEach(function (ty) {
        var m = T[ty] || {};
        Object.keys(m).forEach(function (k) { if (typeof m[k] === 'string') out.push({ k: k, fa: m[k], t: ty }); });
      });
      if (j && j.shared_new) walk(j.shared_new, out, 'sentence', 0);
    }).catch(function () { /* optional */ });
    var p2 = jget('data/forever/i18n/shared.json?v=' + V).then(function (j) { walk(j, out, 'sentence', 0); })
      .catch(function () { /* optional */ });
    Promise.all([p1, p2]).then(function () {
      S.pairs = out.filter(function (p) {
        var id = p.t + '|' + p.k + '|' + p.fa;
        if (seen[id]) return false;
        seen[id] = 1; p.nk = nz(p.k); p.nf = nz(p.fa);
        return true;
      });
      S.loading = false;
      cb();
    });
  }
  function findItems(o, d) {
    var k, r, s, i;
    if (!o || typeof o !== 'object' || d > 3) return null;
    if (Array.isArray(o)) {
      s = o[0];
      if (s && typeof s === 'object' && !Array.isArray(s) && s.id != null && typeof (s.name || s.n) === 'string') {
        return o.map(function (x) { return { id: x.id, name: String(x.name || x.n || '') }; });
      }
      if (Array.isArray(s) && s.length > 1 && typeof s[1] === 'string' && /^\d+$/.test(String(s[0]))) {
        return o.map(function (x) { return { id: x[0], name: String(x[1]) }; });
      }
      return null;
    }
    k = Object.keys(o);
    if (k.length > 100 && /^\d+$/.test(k[0])) {
      s = o[k[0]];
      if (typeof s === 'string') return k.map(function (i2) { return { id: i2, name: String(o[i2]) }; });
      if (Array.isArray(s) && typeof s[0] === 'string') return k.map(function (i2) { return { id: i2, name: String(o[i2][0]) }; });
    }
    for (i = 0; i < k.length; i++) { r = findItems(o[k[i]], d + 1); if (r) return r; }
    return null;
  }
  function loadItems() {
    S.itemsSt = 1;
    jget('data/forever/db/search-index.json?v=' + DB_V).then(function (j) {
      var a = findItems(j, 0);
      S.items = a ? a.filter(function (x) { return x.name; }).map(function (x) { return { id: x.id, name: x.name, nl: nz(x.name) }; }) : null;
      S.itemsSt = S.items && S.items.length ? 2 : -1;
      renderRes();
    }).catch(function () { S.itemsSt = -1; renderRes(); });
  }
  function itemFa(id, cb) {
    var n = Number(id) % 24, key = 'fa-' + n;
    var p = shards[key] || (shards[key] = jget('data/forever/db/fa-' + n + '.json?v=' + DB_V));
    p.then(function (j) { var o = j && j[String(id)]; cb(o && o.n ? String(o.n) : ''); })
      .catch(function () { cb(null); });
  }

  /* ---------- search ---------- */
  function runSearch() {
    var q = S.q.trim(), nq = nz(q), res = [], hit = [], ih = [];
    if (nq.length < 2) return res;
    if (S.pairs) {
      S.pairs.forEach(function (p) {
        var s = -1;
        if (p.nk === nq || p.nf === nq) s = 0;
        else if (p.nk.indexOf(nq) === 0 || p.nf.indexOf(nq) === 0) s = 1;
        else if (p.nk.indexOf(nq) >= 0 || p.nf.indexOf(nq) >= 0) s = 2;
        if (s >= 0) hit.push({ s: s, len: p.k.length, p: p });
      });
      hit.sort(function (a, b) { return a.s - b.s || a.len - b.len; });
      hit.slice(0, MAX_ROWS).forEach(function (h) { res.push(h.p); });
    }
    if (S.items && nq.length >= 3 && !HAS_FA.test(q)) {
      S.items.forEach(function (it) {
        var i = it.nl.indexOf(nq);
        if (i >= 0) ih.push({ s: i === 0 ? (it.nl === nq ? 0 : 1) : 2, len: it.name.length, it: it });
      });
      ih.sort(function (a, b) { return a.s - b.s || a.len - b.len; });
      ih.slice(0, 25).forEach(function (h) { res.push({ k: h.it.name, id: h.it.id, t: 'item', fa: undefined }); });
    }
    res.push({ k: q, t: 'text', fa: '', free: true });
    return res;
  }
  function rowHtml(r, i) {
    var fa;
    if (r.free) fa = '<div class="sg-fa none">ترجمه‌ای که دنبالش هستی اینجا نیست؟ متن بالا رو خودت ترجمه کن و بفرست.</div>';
    else if (r.t === 'item' && r.fa === undefined) fa = '<div class="sg-fa none">ترجمهٔ فعلی با زدن دکمه نشان داده می‌شود.</div>';
    else if (!r.fa) fa = '<div class="sg-fa none">هنوز ترجمه نشده.</div>';
    else fa = '<div class="sg-fa" dir="rtl">' + esc(r.fa) + '</div>';
    return '<div class="sg-row" data-i="' + i + '"><div class="sg-top"><span class="sg-type">' + esc(TYPE_LB[r.t] || r.t)
      + '</span><span class="sg-en" dir="ltr">' + esc(r.k) + '</span></div>' + fa
      + '<button type="button" class="sg-btn" data-act="open">' + (r.free ? 'ترجمهٔ خودم رو می‌نویسم' : 'ترجمه غلطه؟ درستش رو بنویس')
      + '</button><div class="sg-slot"></div></div>';
  }
  function renderRes() {
    var box = S.root && S.root.querySelector('#sg-res'), q = nz(S.q), h = '', i;
    if (!box) return;
    if (q.length < 2) {
      box.innerHTML = '<p class="sg-hint">اسم یه آیتم، اسپل، NPC یا منطقه رو بنویس، یا یه کلمه و جملهٔ کوتاه. انگلیسی یا فارسی فرقی نمی‌کنه؛ ترجمهٔ فعلی رو می‌بینی و اگه غلط بود درستش رو می‌فرستی.</p>';
      S.res = [];
      return;
    }
    if (!S.pairs) { box.innerHTML = '<p class="sg-hint">در حال بارگیری واژه‌ها…</p>'; S.res = []; return; }
    S.res = runSearch();
    for (i = 0; i < S.res.length; i++) h += rowHtml(S.res[i], i);
    if (S.itemsSt === 1) h += '<p class="sg-hint">فهرست آیتم‌ها هنوز در حال بارگیری است…</p>';
    else if (S.itemsSt === -1) h += '<p class="sg-hint">فهرست آیتم‌ها خوانده نشد؛ جست‌وجوی آیتم فعلاً در دسترس نیست.</p>';
    box.innerHTML = h;
  }
  function need() {
    var q = nz(S.q);
    if (!S.pairs && !S.loading) { S.loading = true; loadPairs(renderRes); }
    if (S.itemsSt === 0 && q.length >= 3 && /[a-z]/.test(q)) loadItems();
  }
  function update() { if (nz(S.q).length >= 2) need(); renderRes(); }

  /* ---------- suggest ---------- */
  function formHtml() {
    return '<div class="sg-form"><label>ترجمهٔ درست (فارسی)</label>'
      + '<textarea class="sg-ta" rows="2" dir="rtl" maxlength="500"></textarea>'
      + '<label>توضیح، اختیاری (چرا ترجمهٔ فعلی غلطه؟)</label>'
      + '<input class="sg-note" type="text" dir="rtl" maxlength="300">'
      + '<input class="sg-hp" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">'
      + '<div class="sg-act"><button type="button" class="sg-btn go" data-act="send">ارسال برای بررسی</button>'
      + '<button type="button" class="sg-btn" data-act="close">بستن</button></div>'
      + '<p class="sg-msg" aria-live="polite"></p></div>';
  }
  function openForm(row, r, slot) {
    var ta;
    if (!slot.querySelector('.sg-form')) slot.innerHTML = formHtml();
    ta = slot.querySelector('.sg-ta');
    if (ta) ta.focus();
    if (r.t === 'item' && r.fa === undefined) {
      itemFa(r.id, function (fa) {
        var el = row.querySelector('.sg-fa');
        r.fa = fa == null ? '' : fa;
        if (!el) return;
        if (r.fa) { el.className = 'sg-fa'; el.setAttribute('dir', 'rtl'); el.textContent = r.fa; }
        else { el.className = 'sg-fa none'; el.textContent = fa == null ? 'ترجمهٔ فعلی خوانده نشد.' : 'هنوز ترجمه نشده.'; }
      });
    }
  }
  function post(rec) {
    var c = S.cfg || {};
    if (!c.endpoint || !c.key) return Promise.resolve('local');
    return fetch(String(c.endpoint).replace(/\/+$/, '') + '/rest/v1/' + (c.table || 'suggestions'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: c.key, Authorization: 'Bearer ' + c.key, Prefer: 'return=minimal' },
      body: JSON.stringify(rec)
    }).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return 'sent'; });
  }
  function remember(rec, st) {
    var list = lsGet(LS_SENT, []), day = lsGet(LS_DAY, {});
    list.push({ kind: rec.kind, key: rec.key, item_id: rec.item_id, current_fa: rec.current_fa, suggested: rec.suggested, note: rec.note, ts: new Date().toISOString(), st: st });
    lsSet(LS_SENT, list.slice(-200));
    if (day.d !== today()) day = { d: today(), n: 0 };
    day.n += 1;
    lsSet(LS_DAY, day);
    foot();
  }
  function send(row, r, slot) {
    var ta = slot.querySelector('.sg-ta'), nt = slot.querySelector('.sg-note'), hp = slot.querySelector('.sg-hp');
    var msg = slot.querySelector('.sg-msg'), btn = slot.querySelector('[data-act="send"]'), val, day, rec;
    function say(t, bad) { msg.textContent = t; msg.className = 'sg-msg ' + (bad ? 'err' : 'ok'); }
    if (!ta || !msg) return;
    val = ta.value.trim();
    if (!val) { say('ترجمهٔ پیشنهادی رو بنویس.', true); return; }
    if (val === (r.fa || '')) { say('این همون ترجمهٔ فعلیه.', true); return; }
    day = lsGet(LS_DAY, {});
    if (day.d === today() && day.n >= DAY_MAX) { say('سهمیهٔ امروز پر شده؛ فردا ادامه بده.', true); return; }
    if (hp && hp.value) { slot.innerHTML = ''; return; }
    rec = { kind: r.t, key: String(r.k).slice(0, 400), item_id: isFinite(Number(r.id)) && r.id != null ? Number(r.id) : null,
      current_fa: String(r.fa || '').slice(0, 600), suggested: val.slice(0, 600), note: (nt && nt.value.trim().slice(0, 600)) || null };
    if (btn) btn.disabled = true;
    post(rec).then(function (mode) {
      remember(rec, mode);
      slot.innerHTML = '<p class="sg-msg ok">' + (mode === 'sent'
        ? '✓ برای بررسی ثبت شد؛ ممنون که کمک کردی.'
        : '✓ ذخیره شد، ولی صندوق بررسی هنوز به سرور وصل نیست و پیشنهاد فعلاً فقط روی همین دستگاه مونده.') + '</p>';
    }).catch(function () {
      remember(rec, 'local');
      slot.innerHTML = '<p class="sg-msg err">سرور در دسترس نبود؛ پیشنهاد روی همین دستگاه ذخیره شد.</p>';
    });
  }
  function copyQueue(b) {
    var list = lsGet(LS_SENT, []).filter(function (x) { return x.st === 'local'; }), txt = JSON.stringify(list, null, 1);
    function done() { b.textContent = 'کپی شد ✓'; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () {});
  }
  function foot() {
    var el = S.root && S.root.querySelector('#sg-foot'), sent = lsGet(LS_SENT, []), loc, h;
    if (!el) return;
    loc = sent.filter(function (x) { return x.st === 'local'; }).length;
    h = 'پیشنهادها اول می‌رن توی صندوق بررسی؛ اگه درست باشن، همه‌جای سایت اصلاح می‌شن.';
    if (!(S.cfg && S.cfg.endpoint)) h += ' صندوق بررسی هنوز به سرور وصل نیست و پیشنهادها فعلاً روی همین دستگاه می‌مونن.';
    if (sent.length) h += ' پیشنهادهای ثبت‌شدهٔ تو: ' + faNum(sent.length) + '.';
    el.textContent = h;
    if (loc) el.insertAdjacentHTML('beforeend', ' <button type="button" class="sg-btn" data-act="copy">کپی پیشنهادهای ذخیره‌شده</button>');
  }
  function onClick(ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('[data-act]') : null, row, r, slot, act;
    if (!b || !S.root || !S.root.contains(b)) return;
    act = b.getAttribute('data-act');
    if (act === 'copy') { copyQueue(b); return; }
    row = b.closest('.sg-row');
    r = row ? S.res[+row.getAttribute('data-i')] : null;
    if (!row || !r) return;
    slot = row.querySelector('.sg-slot');
    if (act === 'close') slot.innerHTML = '';
    else if (act === 'open') openForm(row, r, slot);
    else if (act === 'send') send(row, r, slot);
  }

  /* ---------- tab API (called by studio.js) ---------- */
  function html() {
    return '<div class="str-card sg"><p class="pv-demo-badge real">کمک به ترجمه — ترجمهٔ غلط دیدی؟ درستش رو برامون بنویس</p>'
      + '<input id="sg-q" class="ent-search" type="search" autocomplete="off" placeholder="اسم آیتم، اسپل، NPC، منطقه، یا هر کلمه و جمله‌ای (انگلیسی یا فارسی)…" aria-label="جست‌وجوی ترجمه">'
      + '<div id="sg-res"></div><p class="str-note" id="sg-foot"></p></div>';
  }
  function wire(root) {
    var inp;
    S.root = root;
    if (!root.__sg) { root.__sg = 1; root.addEventListener('click', onClick); }
    inp = root.querySelector('#sg-q');
    if (!inp) return;
    inp.value = S.q;
    inp.addEventListener('input', function () {
      S.q = inp.value;
      clearTimeout(S.t);
      S.t = setTimeout(update, 160);
    });
    if (!S.cfgP) {
      S.cfgP = jget('data/forever/i18n/suggest.json?v=' + V).then(function (c) { S.cfg = c || {}; foot(); })
        .catch(function () { S.cfg = {}; });
    }
    foot();
    update();
  }
  window.WFSuggest = { html: html, wire: wire };
})();
