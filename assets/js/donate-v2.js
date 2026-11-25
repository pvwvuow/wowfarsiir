/* wowfarsi - donate page v3 (25 Nov 2026): everything on the page comes from data/donations.json
   (the static HTML is the fallback). supporters = every supporter in the order they came;
   older files without it fall back to first/top. Names and messages go in as text, never HTML. */
(function () {
  "use strict";
  var D10 = "۰۱۲۳۴۵۶۷۸۹";
  function fa(s) { return String(s).replace(/\d/g, function (d) { return D10[+d]; }); }
  function num(n) { return fa(Math.round(Number(n) || 0).toLocaleString("en-US")).replace(/,/g, "٬"); }
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function countUp(node, target) {
    if (!node) return;
    if (still || !window.requestAnimationFrame) { node.textContent = num(target); return; }
    var t0 = performance.now(), dur = 1800;
    (function tick(t) {
      var k = Math.min(1, (t - t0) / dur);
      node.textContent = num(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }

  function supporters(D) {
    if (Array.isArray(D.supporters) && D.supporters.length) return D.supporters;
    var out = [];
    if (D.first && D.first.name) out.push(D.first);
    if (D.top && D.top.name && !(D.first && D.top.name === D.first.name && D.top.amount === D.first.amount)) out.push(D.top);
    return out;
  }

  function renderNames(list) {
    var ol = $("dv-names");
    if (!ol || !list.length) return;
    var top = 0;
    list.forEach(function (s, i) { if ((+s.amount || 0) > (+list[top].amount || 0)) top = i; });
    ol.textContent = "";
    list.forEach(function (s, i) {
      var li = el("li", "dv-row" + (i === top && list.length > 1 ? " is-top" : ""));
      li.appendChild(el("span", "dv-no", fa(i + 1)));
      var who = el("div", "dv-who");
      who.appendChild(el("b", null, s.name || ""));
      if (i === 0) who.appendChild(el("span", "dv-tag", "نخستین حامی"));
      if (i === top && list.length > 1) who.appendChild(el("span", "dv-tag dv-tag-top", "♛ بزرگ‌ترین حمایت"));
      if (s.msg) who.appendChild(el("em", null, s.msg));
      li.appendChild(who);
      var amt = el("div", "dv-amt");
      amt.appendChild(el("b", null, num(s.amount) + " تومان"));
      if (s.date_fa) amt.appendChild(el("small", null, s.date_fa));
      li.appendChild(amt);
      ol.appendChild(li);
    });
    watch(ol.querySelectorAll(".dv-row"), 120);
  }

  var io = null;
  function watch(nodes, stagger) {
    if (!("IntersectionObserver" in window) || still) { [].forEach.call(nodes, function (n) { n.classList.add("is-in"); }); return; }
    if (!io) io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var n = e.target;
        setTimeout(function () { n.classList.add("is-in"); }, +(n.dataset.dvDelay || 0));
        io.unobserve(n);
      });
    }, { threshold: 0.15 });
    [].forEach.call(nodes, function (n, i) { if (stagger) n.dataset.dvDelay = i * stagger; io.observe(n); });
  }

  function boot() {
    watch(document.querySelectorAll(".dv-reveal"));
    var total = $("dv-total");
    fetch("data/donations.json?v=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; })
      .then(function (D) {
        if (!D) return;
        countUp(total, D.toman_total || 0);
        if ($("dv-count")) $("dv-count").textContent = fa(D.toman_count || 0);
        if ($("dv-start") && D.start_fa) $("dv-start").textContent = D.start_fa;
        if ($("dv-upd") && D.updated_fa) $("dv-upd").textContent = D.updated_fa;
        if ($("dv-usdt")) $("dv-usdt").textContent = fa(D.usdt_total || 0) + " USDT";
        renderNames(supporters(D));
      });
    var btn = $("dv-copy"), addr = $("dv-addr");
    if (btn && addr) btn.addEventListener("click", function () {
      var txt = addr.textContent.trim();
      var lab = btn.querySelector(".dv-btn-in") || btn;
      function done(ok) { lab.textContent = ok ? "کپی شد ✓" : "کپی نشد؛ دستی انتخاب کن"; setTimeout(function () { lab.textContent = "کپی آدرس"; }, 2200); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { done(true); }, function () { done(false); });
      else {
        try { var r = document.createRange(); r.selectNodeContents(addr); var s = getSelection(); s.removeAllRanges(); s.addRange(r); done(document.execCommand("copy")); } catch (e) { done(false); }
      }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
