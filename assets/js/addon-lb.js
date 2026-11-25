/* wowfarsi - addon page screenshot viewer (25 Nov 2026, the owner: a click on a
   screenshot opens it big on the same page, no new tab).
   Plain click = viewer; ctrl/cmd/shift/middle click still opens the file in a
   new tab like a normal link. Esc / click outside / x closes; arrows, the side
   buttons and a swipe move between shots (RTL: next is on the left). */
"use strict";
(function () {
  var shots = [].slice.call(document.querySelectorAll(".ad-shot"));
  if (!shots.length) return;

  var css = document.createElement("style");
  css.textContent =
    ".ad-shot{cursor:zoom-in}" +
    ".ad-lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;" +
    "background:rgba(4,4,8,.92);padding:3.2rem 3.6rem 2.6rem;opacity:0;transition:opacity .18s ease}" +
    ".ad-lb.on{opacity:1}" +
    ".ad-lb[hidden]{display:none}" +
    ".ad-lb figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:.7rem;max-width:100%;max-height:100%}" +
    ".ad-lb img{max-width:100%;max-height:calc(100vh - 7rem);border-radius:8px;border:1px solid rgba(240,199,94,.35);" +
    "box-shadow:0 10px 50px rgba(0,0,0,.6);background:#07070a;cursor:default}" +
    ".ad-lb figcaption{color:#e8dfc8;font-size:.9rem;text-align:center;line-height:1.7}" +
    ".ad-lb button{position:absolute;background:rgba(20,18,14,.75);color:#f0c75e;border:1px solid rgba(240,199,94,.4);" +
    "border-radius:50%;width:44px;height:44px;font-size:24px;line-height:1;cursor:pointer;display:flex;" +
    "align-items:center;justify-content:center;transition:background .15s,border-color .15s}" +
    ".ad-lb button:hover,.ad-lb button:focus-visible{background:rgba(60,48,20,.9);border-color:#f0c75e;outline:none}" +
    ".ad-lb .ad-lb-x{top:14px;right:14px}" +
    ".ad-lb .ad-lb-prev{right:10px;top:50%;transform:translateY(-50%)}" +
    ".ad-lb .ad-lb-next{left:10px;top:50%;transform:translateY(-50%)}" +
    "html.ad-lb-lock,html.ad-lb-lock body{overflow:hidden}" +
    "@media(max-width:600px){.ad-lb{padding:3.2rem .6rem 2.4rem}.ad-lb .ad-lb-prev,.ad-lb .ad-lb-next{top:auto;bottom:10px;transform:none}}";
  document.head.appendChild(css);

  var lb = document.createElement("div");
  lb.className = "ad-lb";
  lb.hidden = true;
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "\u0646\u0645\u0627\u06cc\u0634 \u0639\u06a9\u0633");
  lb.innerHTML =
    '<button type="button" class="ad-lb-x" aria-label="\u0628\u0633\u062a\u0646">\u00d7</button>' +
    '<button type="button" class="ad-lb-prev" aria-label="\u0639\u06a9\u0633 \u0642\u0628\u0644\u06cc">\u203a</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button type="button" class="ad-lb-next" aria-label="\u0639\u06a9\u0633 \u0628\u0639\u062f\u06cc">\u2039</button>';
  document.body.appendChild(lb);

  var im = lb.querySelector("img");
  var cap = lb.querySelector("figcaption");
  var cur = 0, x0 = null, y0 = null, back = null;

  function show(i) {
    cur = (i + shots.length) % shots.length;
    var a = shots[cur];
    var t = a.querySelector("img");
    var s = a.querySelector("span");
    im.src = (t && (t.currentSrc || t.src)) || a.href;
    im.alt = t ? t.alt : "";
    cap.textContent = (cur + 1) + " / " + shots.length + (s ? "  \u00b7  " + s.textContent : "");
  }
  function open(i) {
    back = document.activeElement;
    show(i);
    lb.hidden = false;
    document.documentElement.classList.add("ad-lb-lock");
    requestAnimationFrame(function () { lb.classList.add("on"); });
    lb.querySelector(".ad-lb-x").focus();
  }
  function close() {
    lb.classList.remove("on");
    lb.hidden = true;
    document.documentElement.classList.remove("ad-lb-lock");
    im.removeAttribute("src");
    if (back && back.focus) back.focus();
  }

  shots.forEach(function (a, i) {
    a.addEventListener("click", function (e) {
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      open(i);
    });
  });
  lb.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest(".ad-lb-next")) { show(cur + 1); return; }
    if (t.closest(".ad-lb-prev")) { show(cur - 1); return; }
    if (t === im || t === cap) return;
    close();
  });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); show(cur + 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); show(cur - 1); }
    else if (e.key === "Tab") {
      /* keep focus inside the viewer */
      var b = [].slice.call(lb.querySelectorAll("button"));
      var k = b.indexOf(document.activeElement);
      e.preventDefault();
      b[(k + (e.shiftKey ? -1 : 1) + b.length) % b.length].focus();
    }
  });
  lb.addEventListener("touchstart", function (e) {
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
  }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    var dy = e.changedTouches[0].clientY - y0;
    x0 = y0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(dx > 0 ? cur + 1 : cur - 1);
  }, { passive: true });
})();
