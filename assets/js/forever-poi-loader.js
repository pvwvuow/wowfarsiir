/* wowfarsi: loads the Forever map layers (forever-poi.css / .js) at the version in assets/poi-ver.txt.
   The version file is fetched fresh each time (unique query), so a new layers build reaches visitors at once
   without editing forever.html. */
(function () {
  "use strict";
  if (!document.getElementById("fmap")) return;
  function go(v) {
    var l = document.createElement("link"), s = document.createElement("script");
    v = String(v || "").trim().replace(/[^0-9a-zA-Z]/g, "") || "0";
    l.rel = "stylesheet";
    l.href = "assets/css/forever-poi.css?v=" + v;
    document.head.appendChild(l);
    s.src = "assets/js/forever-poi.js?v=" + v;
    document.body.appendChild(s);
  }
  fetch("assets/poi-ver.txt?t=" + Date.now(), { cache: "no-store" })
    .then(function (r) { return r.ok ? r.text() : "0"; })
    .catch(function () { return "0"; })
    .then(go);
})();
