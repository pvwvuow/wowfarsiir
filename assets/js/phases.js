/* phases.js: locked-content phase label, driven by data/forever/phases.json (W7, lane-c).
   No date text lives in code: unlock (ISO) + unlockFa (display) come from phases.json.
   The label disappears automatically when today >= unlock.

   Two entry points:
   1. Script tag (static pages):
        <div id="phase-notice-host"></div>                       (optional, exact spot)
        <script src="assets/js/phases.js?v=20261105a" data-mapid="469"></script>
      Root pages use src="assets/js/..."; nested pages use src="../assets/js/..." —
      the site prefix is derived from the script src itself.
   2. Programmatic (dynamic viewers):
        window.wfPhase.mount(container, mapid) */
(function () {
  var V = "20261105a", loaded = null;

  function style() {
    var st = document.createElement("style");
    st.setAttribute("data-wfphase", "1"); /* one shared style, not one per mount */
    st.textContent = ".phase-notice{display:inline-flex;align-items:center;gap:.45em;margin:.2em 0 .6em;padding:.3em .8em;"
      + "border:1px solid rgba(255,190,80,.45);border-radius:999px;background:rgba(255,190,80,.10);"
      + "color:#ffd489;font-size:.85em;line-height:1.6}"
      + ".phase-notice i{width:.6em;height:.6em;border-radius:50%;background:#ffb54d;flex:none;display:inline-block}";
    document.head.appendChild(st);
  }

  function data() {
    if (loaded) return loaded;
    var base = "";
    var s = document.currentScript;
    if (s && s.getAttribute("src")) base = s.getAttribute("src").replace(/assets\/js\/phases\.js.*$/, "");
    loaded = fetch(base + "data/forever/phases.json?v=" + V)
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
    return loaded;
  }

  /* earliest future phase that lists mapid, or null when open / unknown */
  function phaseFor(ph, mapid) {
    if (!ph || !ph.phases || mapid == null) return null;
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var best = null, bestD = null;
    for (var i = 0; i < ph.phases.length; i++) {
      var p = ph.phases[i];
      if (!p || !p.unlock || (p.instances || []).indexOf(+mapid) === -1) continue;
      var d = new Date(p.unlock + "T00:00:00");
      if (isNaN(d) || d <= today) continue; /* already open: no label */
      if (!bestD || d < bestD) { best = p; bestD = d; }
    }
    return best;
  }

  function mount(host, mapid, opts) {
    opts = opts || {};
    return data().then(function (ph) {
      var p = phaseFor(ph, mapid);
      if (!p) return false;
      if (!document.querySelector("style[data-wfphase]")) style();
      var el = document.createElement("p");
      el.className = "phase-notice";
      el.setAttribute("role", "note");
      el.innerHTML = "<i aria-hidden='true'></i>از " + (p.unlockFa || p.unlock) + " باز می‌شود";
      if (opts.prepend && host.firstChild) host.insertBefore(el, host.firstChild);
      else host.appendChild(el);
      return true;
    });
  }

  window.wfPhase = { mount: mount, phaseFor: function (ph, mapid) { return phaseFor(ph, mapid); } };

  var s = document.currentScript;
  if (!s) return;
  var mapid = parseInt(s.getAttribute("data-mapid") || "", 10);
  if (!mapid) return;
  var host = document.getElementById("phase-notice-host");
  if (!host) {
    var h1 = document.querySelector("main h1, h1");
    host = h1 ? h1.parentNode : document.body;
    mount(host, mapid, { prepend: !!h1 });
  } else {
    mount(host, mapid);
  }
})();
