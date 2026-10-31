/* =========================================================
   wowfarsi — Forever page
   1. live world-map viewer — the complete Forever map tree
      (56 maps: 2 continents, zones, cities, battlegrounds
      and the 5 new Forever zones), with game-style breadcrumb
      (parent zone sits to the left, like the in-game map),
      drag pan, wheel zoom to cursor, pinch, dblclick, keyboard
   2. animated counters (IntersectionObserver, Persian digits)
   Map art: the client's own world-map textures from the
   Forever beta (via foreverdb), hosted in /assets/img/maps/forever.
   Quest counts: data/forever/fa-final/index.json (baked below).
   No dependencies.
   ========================================================= */
"use strict";
(function () {
  var V = "20261102a";
  var BASE = (function () {
    var m = location.pathname.match(/^\/(?:news|guides|item|forever)\//);
    if (!m) return "";
    var rest = location.pathname.slice(m[0].length);
    return "../".repeat(1 + (rest.match(/[/]/g) || []).length);
  })();

  function fa(n) { return Number(n).toLocaleString("fa-IR"); }
  function faRange(a, b) { return fa(a) + "–" + fa(b); }

  /* ------------------------------------------------ maps
     k: continent | zone | city | bg — p: parent (the client's
     own map tree) — d/t: translated/total quests — lv: levels
     nw: new in Forever */
  var MAPS = [
    { slug:"kalimdor", fa:"کالیمدور", en:"Kalimdor", k:"continent" },
    { slug:"eastern-kingdoms", fa:"قلمرو شرقی", en:"Eastern Kingdoms", k:"continent" },
    { slug:"durotar", fa:"دوروتار", en:"Durotar", k:"zone", p:"kalimdor", d:27,t:27, lv:[3,10] },
    { slug:"mulgore", fa:"مولگر", en:"Mulgore", k:"zone", p:"kalimdor", d:25,t:25, lv:[3,10] },
    { slug:"the-barrens", fa:"دشت‌های بایر", en:"The Barrens", k:"zone", p:"kalimdor", d:90,t:90, lv:[13,22] },
    { slug:"alterac-mountains", fa:"کوه‌های آلتراک", en:"Alterac Mountains", k:"zone", p:"eastern-kingdoms", d:14,t:14, lv:[31,40] },
    { slug:"arathi-highlands", fa:"ارتفاعات آراتی", en:"Arathi Highlands", k:"zone", p:"eastern-kingdoms", d:48,t:48, lv:[33,40] },
    { slug:"badlands", fa:"بیابان", en:"Badlands", k:"zone", p:"eastern-kingdoms", d:40,t:40, lv:[37,43] },
    { slug:"blasted-lands", fa:"اراضی ویران", en:"Blasted Lands", k:"zone", p:"eastern-kingdoms", d:19,t:19, lv:[47,59] },
    { slug:"tirisfal-glades", fa:"بیشه‌های تیریس‌فال", en:"Tirisfal Glades", k:"zone", p:"eastern-kingdoms", d:33,t:33, lv:[3,10] },
    { slug:"silverpine-forest", fa:"جنگل سیلورپاین", en:"Silverpine Forest", k:"zone", p:"eastern-kingdoms", d:42,t:42, lv:[11,18] },
    { slug:"western-plaguelands", fa:"اراضی طاعون‌زدهٔ غربی", en:"Western Plaguelands", k:"zone", p:"eastern-kingdoms", d:79,t:79, lv:[53,59] },
    { slug:"eastern-plaguelands", fa:"اراضی طاعون‌زدهٔ شرقی", en:"Eastern Plaguelands", k:"zone", p:"eastern-kingdoms", d:65,t:65, lv:[55,60] },
    { slug:"hillsbrad-foothills", fa:"دامنهٔ هیلزبراد", en:"Hillsbrad Foothills", k:"zone", p:"eastern-kingdoms", d:53,t:53, lv:[22,35] },
    { slug:"the-hinterlands", fa:"هینترلندز", en:"The Hinterlands", k:"zone", p:"eastern-kingdoms", d:44,t:44, lv:[43,50] },
    { slug:"dun-morogh", fa:"دون موروغ", en:"Dun Morogh", k:"zone", p:"eastern-kingdoms", d:26,t:26, lv:[3,10] },
    { slug:"searing-gorge", fa:"تنگهٔ سوزان", en:"Searing Gorge", k:"zone", p:"eastern-kingdoms", d:27,t:27, lv:[47,50] },
    { slug:"burning-steppes", fa:"استپ‌های سوزان", en:"Burning Steppes", k:"zone", p:"eastern-kingdoms", d:19,t:19, lv:[52,59] },
    { slug:"elwynn-forest", fa:"جنگل الزوین", en:"Elwynn Forest", k:"zone", p:"eastern-kingdoms", d:33,t:33, lv:[2,10] },
    { slug:"deadwind-pass", fa:"گردنهٔ باد مرگ", en:"Deadwind Pass", k:"zone", p:"eastern-kingdoms", lv:[56,60] },
    { slug:"duskwood", fa:"جنگل تاریک", en:"Duskwood", k:"zone", p:"eastern-kingdoms", d:75,t:75, lv:[20,30] },
    { slug:"loch-modan", fa:"لوک مودان", en:"Loch Modan", k:"zone", p:"eastern-kingdoms", d:40,t:40, lv:[11,26] },
    { slug:"redridge-mountains", fa:"کوه‌های ردریج", en:"Redridge Mountains", k:"zone", p:"eastern-kingdoms", d:36,t:36, lv:[15,26] },
    { slug:"stranglethorn-vale", fa:"درهٔ استرنگل‌تورن", en:"Stranglethorn Vale", k:"zone", p:"eastern-kingdoms", d:105,t:105, lv:[33,46] },
    { slug:"swamp-of-sorrows", fa:"باتلاق اندوه", en:"Swamp of Sorrows", k:"zone", p:"eastern-kingdoms", d:22,t:22, lv:[35,44] },
    { slug:"westfall", fa:"وستفال", en:"Westfall", k:"zone", p:"eastern-kingdoms", d:34,t:34, lv:[10,17] },
    { slug:"wetlands", fa:"تالاب‌ها", en:"Wetlands", k:"zone", p:"eastern-kingdoms", d:40,t:40, lv:[21,30] },
    { slug:"teldrassil", fa:"تلدراسیل", en:"Teldrassil", k:"zone", p:"kalimdor", d:34,t:34, lv:[4,10] },
    { slug:"darkshore", fa:"کرانهٔ تاریک", en:"Darkshore", k:"zone", p:"kalimdor", d:71,t:71, lv:[12,19] },
    { slug:"ashenvale", fa:"اشن‌وِیل", en:"Ashenvale", k:"zone", p:"kalimdor", d:70,t:70, lv:[20,29] },
    { slug:"thousand-needles", fa:"هزار سوزن", en:"Thousand Needles", k:"zone", p:"kalimdor", d:61,t:61, lv:[26,35] },
    { slug:"stonetalon-mountains", fa:"کوه‌های استون‌تالون", en:"Stonetalon Mountains", k:"zone", p:"kalimdor", d:46,t:46, lv:[18,27] },
    { slug:"desolace", fa:"دزوله‌یس", en:"Desolace", k:"zone", p:"kalimdor", d:56,t:56, lv:[33,39] },
    { slug:"feralas", fa:"فرالاس", en:"Feralas", k:"zone", p:"kalimdor", d:72,t:72, lv:[43,50] },
    { slug:"dustwallow-marsh", fa:"باتلاق داست‌والو", en:"Dustwallow Marsh", k:"zone", p:"kalimdor", d:53,t:53, lv:[35,43] },
    { slug:"tanaris", fa:"تاناریس", en:"Tanaris", k:"zone", p:"kalimdor", d:80,t:80, lv:[44,50] },
    { slug:"azshara", fa:"آزشارا", en:"Azshara", k:"zone", p:"kalimdor", d:30,t:30, lv:[50,57] },
    { slug:"felwood", fa:"فل‌وود", en:"Felwood", k:"zone", p:"kalimdor", d:40,t:40, lv:[52,55] },
    { slug:"un-goro-crater", fa:"دهانهٔ اون‌گورو", en:"Un'Goro Crater", k:"zone", p:"kalimdor", d:44,t:44, lv:[51,55] },
    { slug:"moonglade", fa:"مون‌گلید", en:"Moonglade", k:"zone", p:"kalimdor", d:8,t:8, lv:[51,60] },
    { slug:"silithus", fa:"سیلیتوس", en:"Silithus", k:"zone", p:"kalimdor", d:58,t:58, lv:[57,60] },
    { slug:"winterspring", fa:"وینتراسپرینگ", en:"Winterspring", k:"zone", p:"kalimdor", d:44,t:44, lv:[53,60] },
    { slug:"stormwind-city", fa:"شهر استورم‌ویند", en:"Stormwind City", k:"city", p:"eastern-kingdoms", d:75,t:75 },
    { slug:"orgrimmar", fa:"اورگیمار", en:"Orgrimmar", k:"city", p:"kalimdor", d:79,t:79 },
    { slug:"ironforge", fa:"ایرون‌فورج", en:"Ironforge", k:"city", p:"eastern-kingdoms", d:74,t:74 },
    { slug:"thunder-bluff", fa:"تاندر بلوف", en:"Thunder Bluff", k:"city", p:"kalimdor", d:31,t:31 },
    { slug:"darnassus", fa:"دارناسوس", en:"Darnassus", k:"city", p:"kalimdor", d:20,t:20 },
    { slug:"undercity", fa:"شهر زیرین", en:"Undercity", k:"city", p:"eastern-kingdoms", d:24,t:24 },
    { slug:"alterac-valley", fa:"درهٔ آلتراک", en:"Alterac Valley", k:"bg", p:"hillsbrad-foothills", d:48,t:48 },
    { slug:"warsong-gulch", fa:"درهٔ وار‑سونگ", en:"Warsong Gulch", k:"bg", p:"the-barrens", d:26,t:26 },
    { slug:"arathi-basin", fa:"حوضهٔ آراتی", en:"Arathi Basin", k:"bg", p:"arathi-highlands", d:38,t:38 },
    { slug:"mount-hyjal", fa:"کوه هیجال", en:"Mount Hyjal", k:"zone", p:"kalimdor", nw:1 },
    { slug:"zephras-isle", fa:"جزیرهٔ زفراس", en:"Zephras Isle", k:"zone", nw:1, lv:[1,12] },
    { slug:"darkspear-islands", fa:"جزایر نیزهٔ تاریک", en:"Darkspear Islands", k:"bg", p:"kalimdor", nw:1 },
    { slug:"riverglades", fa:"ریورگلیدز", en:"Riverglades", k:"zone", p:"eastern-kingdoms", nw:1 },
    { slug:"shen-dralas", fa:"شن‌درالاس", en:"Shen'dralas", k:"zone", p:"kalimdor", nw:1 }
  ];
  var BY = {};
  MAPS.forEach(function (m) { BY[m.slug] = m; });

  /* menu groups — game-like: continents, their zones, isles, bgs */
  var GROUPS = [
    { fa: "قاره‌ها",        has: function (m) { return m.k === "continent"; } },
    { fa: "قلمرو شرقی",     has: function (m) { return m.p === "eastern-kingdoms"; } },
    { fa: "کالیمدور",       has: function (m) { return m.p === "kalimdor" && m.slug !== "darkspear-islands"; } },
    { fa: "جزایر تازهٔ Forever", has: function (m) { return m.slug === "zephras-isle" || m.slug === "darkspear-islands"; } },
    { fa: "میدان‌های نبرد", has: function (m) { return m.k === "bg" && m.slug !== "darkspear-islands"; } }
  ];

  var KIND_FA = { continent: "قاره", zone: "زون", city: "شهر", bg: "میدان نبرد" };
  var MIN = 1, MAX = 5;
  var IMG = function (slug) {
    return BASE + "assets/img/maps/forever/" + slug + ".jpg?v=" + V;
  };

  /* ------------------------------------------------ map viewer */
  var box = document.getElementById("fmap");
  if (box) {
    var wrap = box.closest(".fmap-wrap");
    var cv = box.querySelector(".fmap-cv");
    var load = box.querySelector(".fmap-load");
    var zoomBox = box.querySelector(".fmap-zoom");
    var zprog = document.getElementById("fv-prog-txt");
    var zbar = document.getElementById("fv-bar-i");
    var crumbP = document.getElementById("fmap-crumb-p");
    var crumbS = document.getElementById("fmap-crumb-sep");
    var crumbC = document.getElementById("fmap-crumb-c");
    var menu = document.getElementById("fmap-menu");

    var x = 0, y = 0, s = 1, cur = null, activeId = null, raf = 0;
    var curMap = null;

    function apply() {
      cv.style.transform = "translate3d(" + x + "px," + y + "px,0) scale(" + s + ")";
      zoomBox.textContent = fa(Math.round(s * 100)) + "٪";
    }
    /* coalesce drag updates into animation frames — no jank */
    function push() {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        clampPan(); apply();
      });
    }
    function clampPan() {
      var bw = box.clientWidth, bh = box.clientHeight;
      var w = bw * s, h = bh * s;
      var minX = bw - w, minY = bh - h;
      if (w <= bw) x = (bw - w) / 2; else x = Math.max(minX, Math.min(0, x));
      if (h <= bh) y = (bh - h) / 2; else y = Math.max(minY, Math.min(0, y));
    }
    function zoomAt(cx, cy, factor) {
      var ns = Math.max(MIN, Math.min(MAX, s * factor));
      if (ns === s) return;
      var k = ns / s;
      x = cx - (cx - x) * k;
      y = cy - (cy - y) * k;
      s = ns;
      clampPan(); apply();
    }
    function reset() { s = 1; x = 0; y = 0; clampPan(); apply(); }
    /* the in-game feel: the map opens slightly zoomed and CENTERED
       so there is pan room in all four directions — no stick */
    function openZoom() {
      s = 1.35;
      x = (box.clientWidth - box.clientWidth * s) / 2;
      y = (box.clientHeight - box.clientHeight * s) / 2;
      apply();
    }

    /* wheel — zoom toward the cursor */
    box.addEventListener("wheel", function (e) {
      e.preventDefault();
      var r = box.getBoundingClientRect();
      zoomAt(e.clientX - r.left, e.clientY - r.top,
             e.deltaY < 0 ? 1.18 : 1 / 1.18);
    }, { passive: false });

    /* drag pan — one tracked pointer, capture + window fallbacks,
       the image itself ignores pointer events so nothing steals it */
    box.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.target.closest(".fmap-crumb")) return;   /* buttons, not a drag */
      activeId = e.pointerId;
      try { box.setPointerCapture(e.pointerId); } catch (_) {}
      cur = { px: e.clientX, py: e.clientY, x: x, y: y };
      box.classList.add("drag");
      e.preventDefault();
    });
    box.addEventListener("pointermove", function (e) {
      if (!cur || e.pointerId !== activeId) return;
      x = cur.x + (e.clientX - cur.px);
      y = cur.y + (e.clientY - cur.py);
      push();
    });
    function endDrag(e) {
      if (e && e.pointerId !== activeId) return;
      activeId = null; cur = null;
      box.classList.remove("drag");
    }
    box.addEventListener("pointerup", endDrag);
    box.addEventListener("pointercancel", endDrag);
    box.addEventListener("lostpointercapture", endDrag);

    /* touch pinch */
    var pinch = null;
    box.addEventListener("touchstart", function (e) {
      if (e.touches.length === 2) {
        var dx = e.touches[0].clientX - e.touches[1].clientX;
        var dy = e.touches[0].clientY - e.touches[1].clientY;
        pinch = {
          d: Math.hypot(dx, dy) || 1,
          s: s,
          cx: (e.touches[0].clientX + e.touches[1].clientX) / 2 - box.getBoundingClientRect().left,
          cy: (e.touches[0].clientY + e.touches[1].clientY) / 2 - box.getBoundingClientRect().top
        };
      }
    }, { passive: true });
    box.addEventListener("touchmove", function (e) {
      if (pinch && e.touches.length === 2) {
        var dx = e.touches[0].clientX - e.touches[1].clientX;
        var dy = e.touches[0].clientY - e.touches[1].clientY;
        var nd = Math.hypot(dx, dy) || 1;
        var target = Math.max(MIN, Math.min(MAX, pinch.s * (nd / pinch.d)));
        if (Math.abs(target - s) > 0.001) zoomAt(pinch.cx, pinch.cy, target / s);
        e.preventDefault();
      }
    }, { passive: false });
    box.addEventListener("touchend", function () { pinch = null; }, { passive: true });

    /* dblclick toggle */
    box.addEventListener("dblclick", function (e) {
      if (e.target.closest(".fmap-crumb") || e.target.closest(".fmap-menu")) return;
      var r = box.getBoundingClientRect();
      if (s > 1.05) reset();
      else zoomAt(e.clientX - r.left, e.clientY - r.top, 2.2);
    });

    /* right-click — the in-game convention: one zoom level out per click.
       While zoomed in it steps back toward the full view; once the map is
       fully out, a sub-map reveals its PARENT map (سر دسته) — Durotar →
       Kalimdor, Alterac Valley → Hillsbrad, exactly like the game map. */
    box.addEventListener("contextmenu", function (e) {
      e.preventDefault();                       /* no browser menu over the map */
      if (e.target.closest(".fmap-crumb") || e.target.closest(".fmap-ctl") ||
          e.target.closest(".fmap-menu")) return;
      if (s > 1.05) {                           /* still zoomed in — level out */
        zoomAt(box.clientWidth / 2, box.clientHeight / 2, 1 / 1.3);
        return;
      }
      if (curMap && curMap.p && BY[curMap.p]) goUp();   /* fully out → parent */
    });

    /* keyboard (when focused) */
    box.addEventListener("keydown", function (e) {
      var step = 40;
      if (e.key === "+" || e.key === "=") zoomAt(box.clientWidth / 2, box.clientHeight / 2, 1.25);
      else if (e.key === "-" || e.key === "_") zoomAt(box.clientWidth / 2, box.clientHeight / 2, 0.8);
      else if (e.key === "0") reset();
      else if (e.key === "ArrowLeft") { x += step; clampPan(); apply(); }
      else if (e.key === "ArrowRight") { x -= step; clampPan(); apply(); }
      else if (e.key === "ArrowUp") { y += step; clampPan(); apply(); }
      else if (e.key === "ArrowDown") { y -= step; clampPan(); apply(); }
      else if (e.key === "Escape") { closeMenu(); }
      else return;
      e.preventDefault();
    });

    /* controls */
    document.getElementById("fmap-zi").addEventListener("click", function () {
      zoomAt(box.clientWidth / 2, box.clientHeight / 2, 1.3);
    });
    document.getElementById("fmap-zo").addEventListener("click", function () {
      zoomAt(box.clientWidth / 2, box.clientHeight / 2, 1 / 1.3);
    });
    document.getElementById("fmap-zr").addEventListener("click", reset);

    window.addEventListener("resize", function () { clampPan(); apply(); });

    /* ---------------------------------------- breadcrumb + menu */
    function goUp() {
      if (curMap && curMap.p && BY[curMap.p]) select(BY[curMap.p]);
    }
    crumbP.addEventListener("click", goUp);

    function openMenu() {
      menu.hidden = false;
      crumbC.setAttribute("aria-expanded", "true");
      var sc = menu.querySelector(".fmap-mi.on");
      if (sc) sc.scrollIntoView({ block: "nearest" });
    }
    function closeMenu() {
      menu.hidden = true;
      crumbC.setAttribute("aria-expanded", "false");
    }
    crumbC.addEventListener("click", function (e) {
      e.stopPropagation();
      if (menu.hidden) openMenu(); else closeMenu();
    });
    document.addEventListener("click", function (e) {
      if (menu.hidden) return;
      if (menu.contains(e.target) || crumbC.contains(e.target)) return;
      closeMenu();
    });
    /* the menu overlays the map: keep its scroll/wheel to itself */
    menu.addEventListener("wheel", function (e) { e.stopPropagation(); });

    function buildMenu() {
      var html = "";
      GROUPS.forEach(function (g) {
        var rows = MAPS.filter(g.has);
        if (!rows.length) return;
        html += '<div class="fmap-mg">' + g.fa + "</div>";
        rows.forEach(function (m) {
          var tag = m.k === "city" ? '<i class="fmap-tag">شهر</i>'
                  : m.k === "bg" ? '<i class="fmap-tag">میدان</i>' : "";
          if (m.nw) tag += '<i class="fmap-tag nw">تازه</i>';
          html += '<button type="button" class="fmap-mi" data-slug="' + m.slug + '">' +
                  "<b>" + m.fa + "</b>" + tag + "<small dir=\"ltr\">" + m.en + "</small></button>";
        });
      });
      menu.innerHTML = html;
      menu.addEventListener("click", function (e) {
        var b = e.target.closest(".fmap-mi");
        if (!b) return;
        closeMenu();
        select(BY[b.getAttribute("data-slug")]);
      });
    }

    /* ---------------------------------------- selection */
    function select(z) {
      if (!z) return;
      curMap = z;
      /* game-style breadcrumb: parent zone sits to the LEFT */
      var parent = z.p && BY[z.p] && BY[z.p].k === "zone" ? BY[z.p] : null;
      crumbP.hidden = !parent;
      crumbS.hidden = !parent;
      if (parent) crumbP.textContent = parent.fa;
      crumbC.innerHTML = z.fa + '<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
      try { history.replaceState(null, "", "#map=" + z.slug); } catch (_) {}

      /* info bar: quest progress when we have counts, else a kind label */
      var lvTxt = z.lv ? " · سطح " + faRange(z.lv[0], z.lv[1]) : "";
      if (z.d != null && z.t) {
        zprog.textContent = fa(z.d) + " از " + fa(z.t) + " کوئست ترجمه شده" + lvTxt;
        var pct = Math.round(z.d / z.t * 100);
        zbar.style.width = pct + "%";
        zbar.parentElement.style.visibility = "visible";
      } else {
        var label = z.nw ? "زون تازهٔ Forever" : KIND_FA[z.k] || "نقشه";
        zprog.textContent = label + lvTxt;
        zbar.style.width = "0";
        zbar.parentElement.style.visibility = "hidden";
      }

      Array.prototype.forEach.call(menu.querySelectorAll(".fmap-mi"), function (b) {
        b.classList.toggle("on", b.getAttribute("data-slug") === z.slug);
      });

      load.classList.remove("off");
      cv.classList.remove("ld");
      cv.src = IMG(z.slug);
    }

    cv.addEventListener("load", function () {
      load.classList.add("off");
      cv.classList.add("ld");
      openZoom();
    });

    buildMenu();

    apply();
    /* deep link: #map=<slug>; else Durotar, the classic horde start */
    var want = (location.hash.match(/^#map=([a-z0-9-]+)/) || [])[1];
    var first = BY[want] || BY.durotar;
    var lazy = function () { select(first); };
    /* lazy: load the first map only when the viewer approaches the viewport */
    if ("IntersectionObserver" in window) {
      var seen = false;
      new IntersectionObserver(function (en, ob) {
        if (en[0].isIntersecting && !seen) {
          seen = true;
          lazy();
          ob.disconnect();
        }
      }, { rootMargin: "400px" }).observe(box);
    } else lazy();
  }

  /* ------------------------------------------- counters */
  function countUp(el) {
    var target = Number(el.getAttribute("data-count") || 0);
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = fa(target); return;
    }
    var t0 = null, DUR = 1400;
    function frame(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / DUR);
      p = 1 - Math.pow(1 - p, 3);                    /* ease-out cubic */
      el.textContent = fa(Math.round(target * p));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var stats = document.querySelectorAll(".fv-stat b[data-count]");
  if (stats.length) {
    if ("IntersectionObserver" in window) {
      var done = false;
      new IntersectionObserver(function (en, ob) {
        if (en[0].isIntersecting && !done) {
          done = true;
          Array.prototype.forEach.call(stats, countUp);
          ob.disconnect();
        }
      }, { threshold: 0.4 }).observe(stats[0]);
    } else Array.prototype.forEach.call(stats, countUp);
  }
})();
