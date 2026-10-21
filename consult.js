(function () {
  var cfg = window.HHE_CONFIG || {};

  // Instagram button: point it at the real profile, or hide it until there is one.
  document.querySelectorAll("[data-instagram]").forEach(function (a) {
    if (cfg.instagramUrl) { a.href = cfg.instagramUrl; a.target = "_blank"; a.rel = "noopener"; }
    else { a.hidden = true; }
  });

  var form = document.getElementById("consult-form");
  if (!form) return;
  var status = document.getElementById("form-status");
  var button = form.querySelector('button[type="submit"]');

  function say(msg, tone) {
    status.textContent = msg;
    status.style.color = tone === "error" ? "#A3305F" : "#6E5F55";
  }

  function values() {
    var d = new FormData(form);
    var text = function (k) { return (d.get(k) || "").toString().trim(); };
    return {
      name: text("name"),
      email: text("email"),
      phone: text("phone") || null,
      city: text("city") || null,
      services: d.getAll("services").map(String),
      message: text("message"),
      website: text("website") // honeypot: people never see this field
    };
  }

  function check() {
    var ok = true, first = null;
    ["cf-name", "cf-email", "cf-message"].forEach(function (id) {
      var el = document.getElementById(id);
      var bad = !el.checkValidity();
      el.setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad && !first) first = el;
      ok = ok && !bad;
    });
    if (first) {
      first.focus();
      say(first.id === "cf-email" && first.value
        ? "That email address doesn't look quite right."
        : "Please add your name, email, and a little about the space.", "error");
    }
    return ok;
  }

  function thanks(name) {
    var card = document.getElementById("consult-card");
    var first = name ? ", " + name.split(" ")[0] : "";
    card.innerHTML = "";
    var box = document.createElement("div");
    box.setAttribute("role", "status");
    box.style.cssText = "padding:40px 28px;display:flex;flex-direction:column;gap:12px;text-align:center;align-items:center";
    var h = document.createElement("p");
    h.style.cssText = "margin:0;font-style:italic;font-size:2rem;line-height:1;color:#A3305F";
    h.textContent = "ribbit! got it.";
    var p = document.createElement("p");
    p.style.cssText = "margin:0;font-weight:600;font-size:1.25rem;line-height:1.35;max-width:28rem";
    p.textContent = "Thanks" + first + ". Your request is in, and Emma will be in touch soon to set up your free consult.";
    box.appendChild(h); box.appendChild(p);
    card.appendChild(box);
  }

  function mailtoFallback(v) {
    if (!cfg.contactEmail) {
      say("The form isn't connected yet. Please check back soon!", "error");
      return;
    }
    var subject = "Consult request from " + v.name;
    var body = v.message +
      "\n\nHelp with: " + (v.services.length ? v.services.join(", ") : "not sure yet") +
      "\n\n" + v.name + " (" + v.email + ")" +
      (v.phone ? "\n" + v.phone : "") + (v.city ? "\n" + v.city : "");
    window.location.href = "mailto:" + cfg.contactEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    say("Opening your email app to send this. If nothing opens, write to " + cfg.contactEmail + ".");
  }

  form.addEventListener("input", function (e) {
    if (e.target.getAttribute("aria-invalid") === "true" && e.target.checkValidity()) {
      e.target.setAttribute("aria-invalid", "false");
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = values();
    if (v.website) { thanks(v.name); return; } // a bot filled the hidden field
    if (!check()) return;
    if (!cfg.supabaseUrl || !cfg.supabaseAnonKey) { mailtoFallback(v); return; }

    button.disabled = true;
    say("Sending…");
    fetch(cfg.supabaseUrl.replace(/\/$/, "") + "/rest/v1/hoppy_consult_requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: cfg.supabaseAnonKey,
        Authorization: "Bearer " + cfg.supabaseAnonKey,
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        name: v.name,
        email: v.email,
        phone: v.phone,
        city: v.city,
        services: v.services,
        message: v.message,
        page: location.pathname
      })
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      thanks(v.name);
    }).catch(function () {
      button.disabled = false;
      say("Hmm, that didn't go through. Please try again" + (cfg.contactEmail ? ", or email " + cfg.contactEmail : "") + ".", "error");
    });
  });
})();
