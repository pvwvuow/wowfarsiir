/* WoWFA report page (wowfarsi.ir/report).
   Sending needs no account: the report is POSTed from the browser to a ntfy.sh
   inbox topic (no login, CORS open). The wowheadFA bot (tools/wowfa_reports.py,
   every 30 min) reads the inbox and saves each report in
   pvwvuow/wowheadFA data/wowfa_reports/. ntfy keeps messages 12 h, so the bot
   always sees them. Long reports go as numbered parts (ntfy message limit 4 KB).
   If the inbox cannot be reached, the GitHub issue button appears as plan B.
   The WoWFA.lua file is read in the browser; only its WoWFA_Harvest block is used. */
(function () {
  "use strict";
  var INBOX = "https://ntfy.sh/wowfarsi-rep-q7m3x9k2v8";
  var REPO = "https://github.com/pvwvuow/wowfarsi-addon/issues/new";
  var PART = 3000, MAX_PARTS = 40, DAY_MAX = 15, MAX_URL = 7000;
  var KIND = { bug: "Bug", wrong: "Wrong translation", missing: "Not translated", idea: "Idea", other: "Other" };
  var $ = function (id) { return document.getElementById(id); };
  var harvest = "", busy = false;

  function msg(el, text, cls) { el.textContent = text; el.className = "rp-msg" + (cls ? " " + cls : ""); }
  function faNum(v) { return String(v).replace(/[0-9]/g, function (d) { return "\u06f0\u06f1\u06f2\u06f3\u06f4\u06f5\u06f6\u06f7\u06f8\u06f9".charAt(+d); }); }

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

  /* ---------- daily limit (this device) ---------- */
  function today() { return new Date().toISOString().slice(0, 10); }
  function dayGet() { try { var d = JSON.parse(localStorage.getItem("wf-rep-day")); return d && d.d === today() ? d : { d: today(), n: 0 }; } catch (e) { return { d: today(), n: 0 }; } }
  function dayAdd() { var d = dayGet(); d.n += 1; try { localStorage.setItem("wf-rep-day", JSON.stringify(d)); } catch (e) { /* private mode */ } }

  /* ---------- split into parts of at most PART UTF-8 bytes (never inside a character) ---------- */
  function utf8Len(ch) { var c = ch.codePointAt(0); return c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4; }
  function split(s) {
    var out = [], cur = "", n = 0;
    Array.from(s).forEach(function (ch) {
      var l = utf8Len(ch);
      if (n + l > PART) { out.push(cur); cur = ""; n = 0; }
      cur += ch; n += l;
    });
    if (cur || !out.length) out.push(cur);
    return out;
  }
  function rid() {
    var a = "abcdefghijkmnpqrstuvwxyz23456789", s = "", i, r = new Uint8Array(10);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(r); else for (i = 0; i < 10; i++) r[i] = Math.random() * 256;
    for (i = 0; i < 10; i++) s += a.charAt(r[i] % a.length);
    return s;
  }
  function wait(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }
  function postPart(text, tries) {
    return fetch(INBOX, { method: "POST", body: text, mode: "cors", cache: "no-store" })
      .then(function (r) {
        if (r.ok) return true;
        if (r.status === 429 && tries > 0) return wait(6000).then(function () { return postPart(text, tries - 1); });
        throw new Error("http " + r.status);
      }, function (e) {
        if (tries > 0) return wait(1500).then(function () { return postPart(text, tries - 1); });
        throw e;
      });
  }
  function sendInbox(full, onStep) {
    var parts = split(full), id = rid(), i = 0;
    if (parts.length > MAX_PARTS) return Promise.reject(new Error("too long"));
    function next() {
      if (i >= parts.length) return Promise.resolve(id);
      var head = "WFR1 " + id + " " + (i + 1) + "/" + parts.length + "\n";
      return postPart(head + parts[i], 2).then(function () {
        i += 1; onStep(i, parts.length);
        return i < parts.length ? wait(350).then(next) : id;
      });
    }
    return next();
  }

  /* ---------- plan B: prefilled GitHub issue ---------- */
  function sendGithub() {
    var r = build(), el = $("rp-msg");
    var url = REPO + "?title=" + encodeURIComponent(r.title) + "&body=" + encodeURIComponent(r.body);
    if (url.length <= MAX_URL) {
      window.open(url, "_blank", "noopener");
      msg(el, "\u0635\u0641\u062d\u0647\u0654 \u06af\u06cc\u062a\u200c\u0647\u0627\u0628 \u0628\u0627\u0632 \u0634\u062f\u061b \u062f\u06a9\u0645\u0647\u0654 \u0633\u0628\u0632 Create \u0631\u0627 \u0628\u0632\u0646.", "ok");
      return;
    }
    var w = window.open("about:blank", "_blank");
    copy(r.body).then(function (ok) {
      var hint = ok ? "(Paste the report here: Ctrl+V)" : "";
      var u = REPO + "?title=" + encodeURIComponent(r.title) + "&body=" + encodeURIComponent(hint);
      if (w) { w.opener = null; w.location.href = u; } else { window.location.href = u; }
      msg(el, ok ? "\u06af\u0632\u0627\u0631\u0634 \u0628\u0644\u0646\u062f \u0628\u0648\u062f \u0648 \u06a9\u067e\u06cc \u0634\u062f\u061b \u062f\u0631 \u0635\u0641\u062d\u0647\u0654 \u06af\u06cc\u062a\u200c\u0647\u0627\u0628 Ctrl+V \u0628\u0632\u0646 \u0648 Create \u0631\u0627 \u0628\u0632\u0646."
                 : "\u06af\u0632\u0627\u0631\u0634 \u0628\u0644\u0646\u062f \u0627\u0633\u062a \u0648 \u06a9\u067e\u06cc \u0646\u0634\u062f\u061b \u00ab\u06a9\u067e\u06cc \u0645\u062a\u0646 \u06af\u0632\u0627\u0631\u0634\u00bb \u0631\u0627 \u0628\u0632\u0646 \u0648 \u062f\u0631 \u06af\u06cc\u062a\u200c\u0647\u0627\u0628 \u0628\u0686\u0633\u0628\u0627\u0646.", ok ? "ok" : "err");
    });
  }

  $("rp-file").addEventListener("change", function () {
    var f = this.files && this.files[0], el = $("rp-file-msg");
    harvest = "";
    if (!f) { msg(el, ""); return; }
    if (f.size > 8 * 1024 * 1024) { msg(el, "\u0641\u0627\u06cc\u0644 \u062e\u06cc\u0644\u06cc \u0628\u0632\u0631\u06af \u0627\u0633\u062a.", "err"); return; }
    var rd = new FileReader();
    rd.onload = function () {
      var body = String(rd.result || "");
      harvest = harvestBlock(body);
      var st = statusLines(body);
      if (st.length && !$("rp-status").value.trim()) $("rp-status").value = st.join("\n");
      if (harvest) msg(el, "\u0628\u062e\u0634 WoWFA_Harvest \u067e\u06cc\u062f\u0627 \u0634\u062f (" + faNum(harvest.split("\n").length) + " \u062e\u0637).", "ok");
      else msg(el, "\u062f\u0631 \u0627\u06cc\u0646 \u0641\u0627\u06cc\u0644 \u0628\u062e\u0634 WoWFA_Harvest \u0646\u0628\u0648\u062f. \u062f\u0631 \u0628\u0627\u0632\u06cc /wowfa harvest \u0631\u0627 \u0631\u0648\u0634\u0646 \u06a9\u0646\u060c \u06a9\u0645\u06cc \u0628\u0627\u0632\u06cc \u06a9\u0646 \u0648 /reload \u0628\u0632\u0646.", "err");
    };
    rd.onerror = function () { msg(el, "\u0641\u0627\u06cc\u0644 \u062e\u0648\u0627\u0646\u062f\u0647 \u0646\u0634\u062f.", "err"); };
    rd.readAsText(f);
  });

  $("rp-copy").addEventListener("click", function () {
    var r = build(), el = $("rp-msg");
    if (r.empty) { msg(el, "\u0627\u0648\u0644 \u062a\u0648\u0636\u06cc\u062d \u06cc\u0627 \u062e\u0637 \u0648\u0636\u0639\u06cc\u062a \u0631\u0627 \u0628\u0646\u0648\u06cc\u0633.", "err"); return; }
    copy(r.title + "\n\n" + r.body).then(function (ok) {
      msg(el, ok ? "\u06a9\u067e\u06cc \u0634\u062f." : "\u06a9\u067e\u06cc \u0646\u0634\u062f\u061b \u0645\u062a\u0646 \u0631\u0627 \u062f\u0633\u062a\u06cc \u0627\u0646\u062a\u062e\u0627\u0628 \u06a9\u0646.", ok ? "ok" : "err");
    });
  });

  var gh = $("rp-gh");
  if (gh) gh.addEventListener("click", sendGithub);

  $("rp-send").addEventListener("click", function () {
    var r = build(), el = $("rp-msg"), btn = this, hp = $("rp-hp");
    if (busy) return;
    if (r.empty) { msg(el, "\u0627\u0648\u0644 \u062a\u0648\u0636\u06cc\u062d \u06cc\u0627 \u062e\u0637 \u0648\u0636\u0639\u06cc\u062a \u0631\u0627 \u0628\u0646\u0648\u06cc\u0633.", "err"); return; }
    if (hp && hp.value) { msg(el, "\u2713 \u0627\u0631\u0633\u0627\u0644 \u0634\u062f.", "ok"); return; }
    if (dayGet().n >= DAY_MAX) { msg(el, "\u0627\u0645\u0631\u0648\u0632 \u0627\u0632 \u0627\u06cc\u0646 \u062f\u0633\u062a\u06af\u0627\u0647 \u06af\u0632\u0627\u0631\u0634 \u0632\u06cc\u0627\u062f\u06cc \u0641\u0631\u0633\u062a\u0627\u062f\u0647 \u0634\u062f\u0647\u061b \u0641\u0631\u062f\u0627 \u062f\u0648\u0628\u0627\u0631\u0647 \u0627\u0645\u062a\u062d\u0627\u0646 \u06a9\u0646.", "err"); return; }
    busy = true; btn.disabled = true;
    msg(el, "\u062f\u0631 \u062d\u0627\u0644 \u0627\u0631\u0633\u0627\u0644\u2026");
    sendInbox(r.title + "\n\n" + r.body, function (i, n) {
      if (n > 1) msg(el, "\u062f\u0631 \u062d\u0627\u0644 \u0627\u0631\u0633\u0627\u0644\u2026 " + faNum(i) + " \u0627\u0632 " + faNum(n));
    }).then(function () {
      dayAdd();
      msg(el, "\u2713 \u06af\u0632\u0627\u0631\u0634\u062a \u0631\u0633\u06cc\u062f\u060c \u0645\u0645\u0646\u0648\u0646! \u062f\u0631 \u0646\u0633\u062e\u0647\u0654 \u0628\u0639\u062f\u06cc \u0627\u0641\u0632\u0648\u0646\u0647 \u0627\u0639\u0645\u0627\u0644 \u0645\u06cc\u200c\u0634\u0648\u062f.", "ok");
      $("rp-text").value = "";
    }, function (e) {
      var long = e && e.message === "too long";
      msg(el, long ? "\u06af\u0632\u0627\u0631\u0634 \u0628\u0631\u0627\u06cc \u0627\u0631\u0633\u0627\u0644 \u0645\u0633\u062a\u0642\u06cc\u0645 \u062e\u06cc\u0644\u06cc \u0628\u0644\u0646\u062f \u0627\u0633\u062a\u061b \u0628\u0627 \u062f\u06a9\u0645\u0647\u0654 \u06af\u06cc\u062a\u200c\u0647\u0627\u0628 \u0628\u0641\u0631\u0633\u062a."
                   : "\u0627\u0631\u0633\u0627\u0644 \u0646\u0634\u062f (\u0627\u06cc\u0646\u062a\u0631\u0646\u062a \u06cc\u0627 \u0641\u06cc\u0644\u062a\u0631). \u06cc\u06a9 \u0628\u0627\u0631 \u062f\u06cc\u06af\u0631 \u0628\u0632\u0646\u060c \u06cc\u0627 \u0628\u0627 \u062f\u06a9\u0645\u0647\u0654 \u06af\u06cc\u062a\u200c\u0647\u0627\u0628 \u0628\u0641\u0631\u0633\u062a.", "err");
      if (gh) gh.style.display = "";
    }).then(function () { busy = false; btn.disabled = false; });
  });
})();
