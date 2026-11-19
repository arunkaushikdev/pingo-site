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
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
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



  // Hero phone: endless loop through four scenes. Nothing shakes; each scene replays its own entrance.
  const glass = $("#hglass");
  if (glass && !calm) {
    const scenes = $$(".hs", glass), clock = $("#hclock");
    const lens = [5800, 7400, 6200, 7000], times = ["7:00", "7:01", "9:00", "9:02"];
    let k = 0;
    const show = (n) => {
      scenes.forEach((s, i) => {
        if (i === n) { s.classList.remove("on"); void s.offsetWidth; s.classList.add("on"); }
        else s.classList.remove("on");
      });
      glass.classList.toggle("light", n > 0);
      clock.textContent = times[n];
    };
    const tick = () => { show(k); const d = lens[k]; k = (k + 1) % scenes.length; setTimeout(tick, d); };
    tick();
  }

  // Nav: blur when scrolled, dark text-on-night when over dark sections.
  const nav = $("#nav");
  const darkEls = $$(".day, .night, footer");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("stuck", scrollY > 20);
    const probe = 32;
    let dark = false;
    const day = $("#day");
    darkEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top <= probe && r.bottom >= probe) {
        dark = el === day ? ["5", "6"].includes(day.dataset.stage) : true;
      }
    });
    nav.classList.toggle("dark", dark);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // A day with Pingo: the step nearest the middle of the screen sets the stage.
  const day = $("#day");
  if (day) {
    const steps = $$(".step", day), times = $$(".bigtime span", day), scrs = $$(".scr", day), rail = $$(".rail li", day);
    let cur = 0;
    const setStage = (i) => {
      if (i === cur) return;
      cur = i;
      day.dataset.stage = i;
      steps.forEach((s) => s.classList.toggle("act", s.dataset.i == i));
      times.forEach((t) => t.classList.toggle("on", t.dataset.i == i));
      rail.forEach((t) => t.classList.toggle("on", t.dataset.i == i));
      scrs.forEach((s) => {
        const on = s.dataset.s == i;
        // remove then re-add so the screen's own animations replay each visit
        if (on && !s.classList.contains("on")) { s.classList.remove("on"); void s.offsetWidth; }
        s.classList.toggle("on", on);
      });
      onScroll();
    };
    steps[0] && steps[0].classList.add("act");
    cur = 1;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) setStage(+en.target.dataset.i); });
      }, { rootMargin: "-45% 0px -45% 0px" });
      steps.forEach((s) => io.observe(s));
    }
    rail.forEach((li) => {
      li.addEventListener("click", (e) => {
        e.preventDefault();
        const t = $("#s" + li.dataset.i);
        if (t) t.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "center" });
      });
    });
  }

  // 14-day dots light up one by one when they come into view.
  const dots = $("#dots");
  if (dots) {
    for (let n = 1; n <= 14; n++) {
      const d = document.createElement("span");
      d.textContent = n;
      if (n === 14) d.className = "last";
      dots.appendChild(d);
    }
    const lightUp = () => {
      const all = [...dots.children];
      all.forEach((d, i) => setTimeout(() => d.classList.add("lit"), calm ? 0 : i * 110));
    };
    if ("IntersectionObserver" in window) {
      const io2 = new IntersectionObserver((en) => { if (en[0].isIntersecting) { lightUp(); io2.disconnect(); } }, { threshold: 0.6 });
      io2.observe(dots);
    } else lightUp();
  }

  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
