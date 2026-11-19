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
      updateProgress(true);
      if (box.checked && !calm) burst(box);
    });
  });
  const prog = $("#tprog");
  function updateProgress(animate) {
    if (!prog) return;
    const boxes = $$(".tests input"), n = boxes.filter((b) => b.checked).length;
    prog.textContent = n === boxes.length ? "All done. Thank you, you are a star! 🎉" : n + " of " + boxes.length + " done";
    if (animate) { prog.classList.remove("pop"); void prog.offsetWidth; prog.classList.add("pop"); }
  }
  updateProgress(false);
  function burst(el) {
    const r = el.getBoundingClientRect();
    ["✨", "🎉", "✅", "⭐"].forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "confetti"; s.textContent = ch;
      s.style.left = r.left + r.width / 2 + "px"; s.style.top = r.top + r.height / 2 + "px";
      s.style.setProperty("--x", (i - 1.5) * 38 + "px"); s.style.setProperty("--y", -50 - Math.random() * 40 + "px"); s.style.setProperty("--r", (i - 1.5) * 50 + "deg");
      document.body.appendChild(s); setTimeout(() => s.remove(), 1500);
    });
  }

  // Stagger siblings so groups cascade in.
  $$(".grid, .steps, .tests").forEach((g) => [...g.children].forEach((ch, i) => ch.style.setProperty("--d", i * 90 + "ms")));

  // Sticky bar styling and scroll progress.
  const nav = $("#navbar"), bar = $("#progress");
  const onScroll = () => {
    const y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    if (nav) nav.classList.toggle("stuck", y > 20);
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Phone leans toward the pointer (desktop only, skipped when the user prefers less motion).
  const phone = $(".phone");
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (phone && !calm && matchMedia("(hover: hover)").matches) {
    const hero = $(".hero");
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      phone.style.transform = "perspective(900px) rotateY(" + x * 12 + "deg) rotateX(" + -y * 8 + "deg)";
    });
    hero.addEventListener("pointerleave", () => { phone.style.transform = ""; });
  }

  // Drifting icons in the side margins of wide screens.
  const sides = document.createElement("div");
  sides.className = "sides";
  sides.setAttribute("aria-hidden", "true");
  const icons = ["🔔", "✅", "💧", "💊", "⏰", "🔥", "🍱", "📚", "🧾", "🎯"];
  for (let n = 0; n < 16; n++) {
    const el = document.createElement("i");
    el.textContent = icons[n % icons.length];
    const left = n % 2 === 0;
    el.style[left ? "left" : "right"] = 1.5 + Math.random() * 6.5 + "vw";
    el.style.fontSize = 22 + Math.random() * 22 + "px";
    el.style.animationDuration = 22 + Math.random() * 16 + "s";
    el.style.animationDelay = -Math.random() * 30 + "s";
    el.style.setProperty("--sx", (left ? 1 : -1) * (10 + Math.random() * 26) + "px");
    el.style.setProperty("--top", 6 + Math.random() * 88);
    sides.appendChild(el);
  }
  document.body.appendChild(sides);

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
