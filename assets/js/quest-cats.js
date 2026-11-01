/* quest-cats.js: quest index keys that start with "sort:" are CATEGORIES (class quests, profession quests, seasonal ...),
   not zones. This helper tells the quest list and the quest page which is which and gives each one a Persian name.
   Class names come from the one site table (WFCLS, clsnames.js, so a custom name from the translation room wins); the same
   canon names are the fallback while clsnames.js has not loaded yet.
   window.WFQCAT = { isCat(key), group(key), name(key), groupName(key), label(key), order(key) } */
(function () {
  'use strict';
  var Z = String.fromCharCode(0x200c);
  function zw(s) { return String(s).split('~').join(Z); }
  var CL = { warrior: 'Warrior', paladin: 'Paladin', hunter: 'Hunter', rogue: 'Rogue', priest: 'Priest', shaman: 'Shaman', mage: 'Mage', warlock: 'Warlock', druid: 'Druid' };
  var CF = { warrior: 'جنگاور', paladin: 'پالادین', hunter: 'شکارچی', rogue: 'راهزن', priest: 'روحانی', shaman: 'شمن', mage: 'جادوگر', warlock: 'احضارکننده', druid: 'دروئید' };
  var PR = { alchemy: 'کیمیاگری', blacksmithing: 'آهنگری', cooking: 'آشپزی', enchanting: zw('افسون~گری'), engineering: 'مهندسی',
    'first-aid': zw('کمک~های اولیه'), fishing: 'ماهیگیری', herbalism: zw('گیاه~شناسی'), leatherworking: zw('چرم~دوزی'), mining: zw('معدن~کاری'),
    skinning: zw('پوست~کنی'), tailoring: 'خیاطی', poisons: 'زهرها', jewelcrafting: 'جواهرسازی' };
  var OT = { seasonal: zw('رویدادهای فصلی'), special: 'ویژه', riding: zw('سوارکاری'), pvp: 'PvP', reputation: 'اعتبار' };
  var GN = { 'class': 'کلاس', prof: 'حرفه', other: 'دسته' };
  var GO = { 'class': 0, prof: 1, other: 2 };
  function cap(s) { return String(s || '').replace(/-/g, ' ').replace(/(^| )[a-z]/g, function (c) { return c.toUpperCase(); }); }
  function isCat(key) { return String(key == null ? '' : key).indexOf('sort:') === 0; }
  function sl(key) { return String(key).slice(5); }
  function group(key) { var s = sl(key); return CL[s] ? 'class' : PR[s] ? 'prof' : 'other'; }
  function name(key) {
    var s = sl(key), g = group(key), w;
    if (g === 'class') {
      w = window.WFCLS && window.WFCLS.name ? window.WFCLS.name(CL[s], '') : '';
      return w || CF[s];
    }
    if (g === 'prof') return PR[s];
    return OT[s] || cap(s);
  }
  window.WFQCAT = {
    isCat: isCat,
    group: group,
    name: name,
    groupName: function (key) { return GN[group(key)]; },
    label: function (key) { return GN[group(key)] + ' · ' + name(key); },
    order: function (key) { return GO[group(key)]; }
  };
})();
