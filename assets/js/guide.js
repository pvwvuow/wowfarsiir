/* wowfarsi — static guide pages: hero-tab switching + TOC scrollspy.
   Design language: retail dropdown menu (fading hairlines, ring + dot).
   Without JS every hero panel stays visible (SEO / no-JS fallback). */
(function () {
  "use strict";

  /* ---------- hero tabs (rotation) ---------- */
  function activate(btn) {
    var wrap = btn.closest("[data-hero-tabs]");
    if (!wrap) return;
    Array.prototype.forEach.call(wrap.querySelectorAll(".ht-tab"), function (x) {
      var on = x === btn;
      x.classList.toggle("is-on", on);
      x.setAttribute("aria-selected", on ? "true" : "false");
    });
    Array.prototype.forEach.call(wrap.querySelectorAll(".ht-panel"), function (p) {
      p.classList.toggle("is-on", p.id === "ht-" + btn.getAttribute("data-ht"));
    });
  }
  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? e.target.closest(".ht-tab") : null;
    if (t) activate(t);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    var t = e.target && e.target.closest ? e.target.closest(".ht-tab") : null;
    if (!t) return;
    var wrap = t.closest("[data-hero-tabs]");
    if (!wrap) return;
    var tabs = Array.prototype.slice.call(wrap.querySelectorAll(".ht-tab"));
    var i = tabs.indexOf(t) + (e.key === "ArrowLeft" ? -1 : 1);
    var next = tabs[(i + tabs.length) % tabs.length];
    if (next) { activate(next); next.focus(); }
  });
  /* JS mode: hide inactive panels only when scripting works */
  Array.prototype.forEach.call(document.querySelectorAll("[data-hero-tabs]"), function (w) {
    w.classList.add("js");
  });

  /* ---------- hero panel sub-tabs (تک‌هدف / چندهدف) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-sub-tabs]"), function (w) {
    w.classList.add("js");
  });
  function subActivate(btn) {
    var wrap = btn.closest("[data-sub-tabs]");
    if (!wrap) return;
    Array.prototype.forEach.call(wrap.querySelectorAll(".st-tab"), function (x) {
      var on = x === btn;
      x.classList.toggle("is-on", on);
      x.setAttribute("aria-selected", on ? "true" : "false");
    });
    Array.prototype.forEach.call(wrap.querySelectorAll(".st-panel"), function (p) {
      p.classList.toggle("is-on", p.getAttribute("data-stp") === btn.getAttribute("data-st"));
    });
  }
  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? e.target.closest(".st-tab") : null;
    if (t) subActivate(t);
  });

  /* ---------- rotation selector + why toggles (delegated, once) ---------- */
  document.addEventListener("click", function (e) {
    if (!e.target || !e.target.closest) return;
    var whyb = e.target.closest(".rt-whyb");
    if (whyb) {
      var li = whyb.parentNode;
      var open = !li.classList.contains("open");
      li.classList.toggle("open", open);
      var why = li.querySelector(".rt-why");
      if (why) { if (open) why.removeAttribute("hidden"); else why.setAttribute("hidden", ""); }
      whyb.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    var btn = e.target.closest(".rt-sel button");
    if (!btn) return;
    var row = btn.closest(".rt-selrow"), sel = btn.closest("[data-rt-sel]");
    if (!row || !sel) return;
    if (row.getAttribute("data-k") === "talents") {
      btn.classList.toggle("on");
      btn.setAttribute("aria-pressed", btn.classList.contains("on") ? "true" : "false");
    } else {
      Array.prototype.forEach.call(row.querySelectorAll("button"), function (x) { x.classList.toggle("on", x === btn); });
    }
    /* apply filter: state from DOM, scope = same section */
    var st = { hero: null, content: null, talents: {} };
    Array.prototype.forEach.call(sel.querySelectorAll(".rt-selrow"), function (r) {
      var k = r.getAttribute("data-k");
      if (k === "talents") {
        Array.prototype.forEach.call(r.querySelectorAll("button"), function (b2) { st.talents[b2.getAttribute("data-v")] = b2.classList.contains("on"); });
      } else {
        var on = r.querySelector("button.on") || r.querySelector("button");
        if (on) st[k] = on.getAttribute("data-v");
      }
    });
    var scope = sel.closest("section") || document;
    Array.prototype.forEach.call(scope.querySelectorAll(".rt-prio li[data-when]"), function (li) {
      var w = null;
      try { w = JSON.parse(li.getAttribute("data-when")); } catch (err) {}
      var ok = true;
      if (w && w.hero && w.hero.length && st.hero) ok = w.hero.indexOf(st.hero) > -1;
      if (w && ok && w.content && w.content.length && st.content) ok = w.content.indexOf(st.content) > -1;
      if (w && ok && w.talents && w.talents.length) ok = w.talents.every(function (tn) { return !!st.talents[tn]; });
      li.hidden = !ok;
    });
  });

  /* ---------- TOC scrollspy: the gold dot follows the section in view ---------- */
  var toc = document.querySelector(".rt-toc");
  if (!toc || !window.IntersectionObserver) return;
  var links = {};
  Array.prototype.forEach.call(toc.querySelectorAll("a[href^='#']"), function (a) {
    links[a.getAttribute("href").slice(1)] = a;
  });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (en.isIntersecting && links[en.target.id]) {
        Object.keys(links).forEach(function (k) { links[k].classList.remove("on"); });
        links[en.target.id].classList.add("on");
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  Array.prototype.forEach.call(document.querySelectorAll("section[id]"), function (s) {
    io.observe(s);
  });
})();
