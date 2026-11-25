/* wowfarsi: the 14k page (25 Nov 2026). data/14k.json is refreshed every 5 minutes by the
   update-14k workflow (tools/update_14k.py): the channel feed + the live check. */
"use strict";
(function () {
  var ID = /^[\w-]{11}$/;
  var grid = document.getElementById("k14-grid");
  var liveBox = document.getElementById("k14-live");
  var liveTitle = document.getElementById("k14-live-title");
  var logo = document.getElementById("k14-logo");
  if (!grid || !liveBox) return;

  var img = logo && logo.querySelector("img");
  if (img) {
    var bad = function () { logo.classList.add("no-img"); };
    img.addEventListener("error", bad);
    if (img.complete && img.naturalWidth === 0) bad();
  }

  var fmt;
  try {
    fmt = new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" });
  } catch (e) { fmt = null; }
  function dateFa(s) {
    var d = new Date(s);
    if (isNaN(d.getTime())) return "";
    return fmt ? fmt.format(d) : d.toLocaleDateString();
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function card(v, liveId) {
    var a = el("a", "k14-card" + (v.id === liveId ? " is-live" : ""));
    a.href = "https://www.youtube.com/watch?v=" + v.id;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    var th = el("span", "k14-th");
    var im = el("img");
    im.loading = "lazy";
    im.alt = "";
    im.src = "https://i.ytimg.com/vi/" + v.id + "/mqdefault.jpg";
    im.addEventListener("error", function () { im.style.visibility = "hidden"; });
    th.appendChild(im);
    th.appendChild(el("i", "k14-play"));
    if (v.id === liveId) th.appendChild(el("span", "k14-badge", "LIVE"));
    a.appendChild(th);
    a.appendChild(el("span", "k14-ct", v.title));
    a.appendChild(el("span", "k14-cd", dateFa(v.published)));
    return a;
  }
  function render(d) {
    var live = d && d.live && d.live.on && ID.test(d.live.id || "") ? d.live : null;
    if (live) {
      liveBox.hidden = false;
      liveBox.href = "https://www.youtube.com/watch?v=" + live.id;
      liveTitle.textContent = live.title || "";
    } else {
      liveBox.hidden = true;
    }
    var vids = ((d && d.videos) || []).filter(function (v) { return v && ID.test(v.id || "") && v.title; });
    grid.textContent = "";
    if (!vids.length) {
      grid.appendChild(el("p", "k14-empty", "هنوز ویدیویی بارگذاری نشده؛ از دکمهٔ کانال به یوتیوب برو."));
      return;
    }
    vids.forEach(function (v) { grid.appendChild(card(v, live && live.id)); });
  }
  function load() {
    fetch("data/14k.json?t=" + Math.floor(Date.now() / 60000), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d) render(d); })
      .catch(function () {});
  }
  load();
  setInterval(load, 120000);
})();
