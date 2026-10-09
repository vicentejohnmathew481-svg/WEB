(function () {
  var root = document.documentElement;

  // Text size buttons
  var size = 100;
  function applySize() { root.style.fontSize = size + "%"; }
  document.getElementById("larger").addEventListener("click", function () { size = Math.min(size + 10, 160); applySize(); });
  document.getElementById("smaller").addEventListener("click", function () { size = Math.max(size - 10, 80); applySize(); });

  // Dark / light mode
  var themeBtn = document.getElementById("theme");
  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function syncTheme() {
    var d = isDark();
    themeBtn.setAttribute("aria-pressed", String(d));
    themeBtn.textContent = d ? "Light mode" : "Dark mode";
  }
  themeBtn.addEventListener("click", function () {
    root.setAttribute("data-theme", isDark() ? "light" : "dark");
    syncTheme();
  });
  syncTheme();

  // Accessible form validation
  var form = document.getElementById("form");
  var status = document.getElementById("status");
  var rules = {
    name: function (v) { return v.trim() ? "" : "Enter your name."; },
    email: function (v) {
      if (!v.trim()) return "Enter your email address.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email, like name@email.com.";
    },
    msg: function (v) { return v.trim().length >= 10 ? "" : "Write a message of at least 10 characters."; }
  };
  function check(id) {
    var el = document.getElementById(id), msg = rules[id](el.value);
    document.getElementById(id + "-e").textContent = msg;
    if (msg) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
    return !msg;
  }
  Object.keys(rules).forEach(function (id) {
    document.getElementById(id).addEventListener("blur", function () { check(id); });
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = [];
    Object.keys(rules).forEach(function (id) { if (!check(id)) bad.push(id); });
    if (bad.length) {
      status.textContent = "There " + (bad.length > 1 ? "are " + bad.length + " problems" : "is 1 problem") + " with the form. Fix the marked fields and try again.";
      document.getElementById(bad[0]).focus();
    } else {
      status.textContent = "Thank you. Your message was received (demo only).";
      status.focus();
      form.reset();
    }
  });
})();
