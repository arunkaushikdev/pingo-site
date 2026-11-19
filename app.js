/*
 * Everything you need to edit lives in this CONFIG block.
 * Leave a value as "" and its button shows "Opens soon" instead of a dead link.
 */
const CONFIG = {
  // Google Form (or any form) that collects each volunteer's Gmail address.
  signupUrl: "",
  // The "Join on the web" opt-in link from Play Console -> Closed testing -> Testers (appears after the first release is approved).
  optInUrl: "",
  // Where testers send bugs and ideas (Google Form, WhatsApp group invite, etc.).
  feedbackUrl: "",
  // Contact email shown in the footer and on the privacy page.
  contactEmail: "",
  // How many volunteers have joined so far. 0 hides the counter.
  testersJoined: 0,
  testersNeeded: 12,
};

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Wire the buttons that point at CONFIG urls.
  const map = { signup: CONFIG.signupUrl, optin: CONFIG.optInUrl, feedback: CONFIG.feedbackUrl };
  $$("[data-link]").forEach((el) => {
    const url = map[el.dataset.link];
    if (url) {
      el.href = url;
      el.target = "_blank";
      el.rel = "noopener";
    } else {
      el.setAttribute("aria-disabled", "true");
      el.removeAttribute("href");
      el.dataset.label = el.textContent;
      el.textContent = "Opens soon";
    }
  });

  // Contact email.
  $$("[data-email]").forEach((el) => {
    if (CONFIG.contactEmail) {
      el.href = "mailto:" + CONFIG.contactEmail;
      el.textContent = CONFIG.contactEmail;
    } else {
      el.remove();
    }
  });

  // Tester counter.
  const meter = $("#meter");
  if (meter) {
    if (CONFIG.testersJoined > 0) {
      const pct = Math.min(100, Math.round((CONFIG.testersJoined / CONFIG.testersNeeded) * 100));
      $("#meterText").textContent = CONFIG.testersJoined + " of " + CONFIG.testersNeeded + " testers have joined";
      $("#meterBar").style.width = pct + "%";
    } else {
      meter.hidden = true;
    }
  }

  // Share with a friend (WhatsApp / native share sheet).
  const share = $("#share");
  if (share) {
    const text = "I'm helping test Pingo, a reminder app for food, meds, water and work. They need a few testers: " + location.href.split("#")[0];
    share.href = "https://wa.me/?text=" + encodeURIComponent(text);
    share.target = "_blank";
    share.rel = "noopener";
    if (navigator.share) {
      share.addEventListener("click", (e) => {
        e.preventDefault();
        navigator.share({ title: "Pingo closed test", text, url: location.href.split("#")[0] }).catch(() => {});
      });
    }
  }

  // Test plan checkboxes remember their state on this device only.
  const KEY = "pingo-testplan";
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}
  $$(".tests input").forEach((box) => {
    box.checked = !!saved[box.id];
    box.addEventListener("change", () => {
      saved[box.id] = box.checked;
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
    });
  });

  // Gentle reveal on scroll.
  const items = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("in"));
  }

  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
