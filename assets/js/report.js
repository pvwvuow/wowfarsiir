/* WoWFA report page: builds a GitHub issue in pvwvuow/wowfarsi-addon (no backend).
   The WoWFA.lua file is read in the browser; only its WoWFA_Harvest block is used. */
(function () {
  "use strict";
  var REPO = "https://github.com/pvwvuow/wowfarsi-addon/issues/new";
  var MAX_URL = 7000;
  var KIND = { bug: "Bug", wrong: "Wrong translation", missing: "Not translated", idea: "Idea", other: "Other" };
  var $ = function (id) { return document.getElementById(id); };
  var harvest = "";

  function msg(el, text, cls) { el.textContent = text; el.className = "rp-msg" + (cls ? " " + cls : ""); }

  function kind() {
    var r = document.querySelector('#rp-kind input:checked');
    return r ? r.value : "other";
  }

  // top-level WoWFA_Harvest = { ... } block of a SavedVariables file
  function harvestBlock(body) {
    var out = [], keep = false, lines = body.split(/\r?\n/);
    for (var i = 0; i < lines.length; i++) {
      var m = /^([A-Za-z_][A-Za-z0-9_]*)\s*=/.exec(lines[i]);
      if (m) keep = m[1] === "WoWFA_Harvest";
      if (keep) out.push(lines[i]);
    }
    return out.join("\n").trim();
  }

  function statusLines(body) {
    return body.split(/\r?\n/).map(function (l) { return l.trim(); })
      .filter(function (l) { return l.indexOf("WoWFA ") === 0; });
  }

  function build() {
    var text = $("rp-text").value.trim();
    var status = $("rp-status").value.trim();
    var head = statusLines(status)[0] || "";
    var ver = (/^WoWFA\s+(\S+)/.exec(head) || [])[1] || "";
    var short = (text || head || "").replace(/\s+/g, " ").slice(0, 60);
    var title = "[" + KIND[kind()] + "] " + (ver ? ver + " " : "") + (short || "report");
    var body = "**Type:** " + KIND[kind()] + "\n\n";
    if (text) body += "### Description\n" + text + "\n\n";
    if (status) body += "### Status line\n```\n" + status + "\n```\n\n";
    if (harvest) body += "### WoWFA_Harvest\n```lua\n" + harvest + "\n```\n\n";
    body += "_Sent from wowfarsi.ir/report_";
    return { title: title, body: body, empty: !text && !status && !harvest };
  }

  function copy(s) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(s).then(function () { return true; }, function () { return fallback(s); });
    }
    return Promise.resolve(fallback(s));
  }
  function fallback(s) {
    var t = document.createElement("textarea");
    t.value = s; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0";
    document.body.appendChild(t); t.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(t);
    return ok;
  }

  $("rp-file").addEventListener("change", function () {
    var f = this.files && this.files[0], el = $("rp-file-msg");
    harvest = "";
    if (!f) { msg(el, ""); return; }
    if (f.size > 8 * 1024 * 1024) { msg(el, "فایل خیلی بزرگ است.", "err"); return; }
    var rd = new FileReader();
    rd.onload = function () {
      var body = String(rd.result || "");
      harvest = harvestBlock(body);
      var st = statusLines(body);
      if (st.length && !$("rp-status").value.trim()) $("rp-status").value = st.join("\n");
      if (harvest) msg(el, "بخش WoWFA_Harvest پیدا شد (" + harvest.split("\n").length + " خط).", "ok");
      else msg(el, "در این فایل بخش WoWFA_Harvest نبود. در بازی /wowfa harvest را روشن کن، کمی بازی کن و /reload بزن.", "err");
    };
    rd.onerror = function () { msg(el, "فایل خوانده نشد.", "err"); };
    rd.readAsText(f);
  });

  $("rp-copy").addEventListener("click", function () {
    var r = build(), el = $("rp-msg");
    if (r.empty) { msg(el, "اول توضیح یا خط وضعیت را بنویس.", "err"); return; }
    copy(r.title + "\n\n" + r.body).then(function (ok) {
      msg(el, ok ? "کپی شد." : "کپی نشد؛ متن را دستی انتخاب کن.", ok ? "ok" : "err");
    });
  });

  $("rp-send").addEventListener("click", function () {
    var r = build(), el = $("rp-msg");
    if (r.empty) { msg(el, "اول توضیح یا خط وضعیت را بنویس.", "err"); return; }
    var url = REPO + "?title=" + encodeURIComponent(r.title) + "&body=" + encodeURIComponent(r.body);
    if (url.length <= MAX_URL) {
      window.open(url, "_blank", "noopener");
      msg(el, "صفحهٔ گیت‌هاب باز شد؛ دکمهٔ سبز Create را بزن.", "ok");
      return;
    }
    // too long for a link: copy the body, open the issue with the title only
    var w = window.open("about:blank", "_blank");
    copy(r.body).then(function (ok) {
      var hint = ok ? "(Paste the report here: Ctrl+V)" : "";
      var u = REPO + "?title=" + encodeURIComponent(r.title) + "&body=" + encodeURIComponent(hint);
      if (w) { w.opener = null; w.location.href = u; } else { window.location.href = u; }
      msg(el, ok ? "گزارش بلند بود و کپی شد؛ در صفحهٔ گیت‌هاب Ctrl+V بزن و Create را بزن."
                 : "گزارش بلند است و کپی نشد؛ «کپی متن گزارش» را بزن و در گیت‌هاب بچسبان.", ok ? "ok" : "err");
    });
  });
})();
