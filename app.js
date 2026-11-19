(function () {
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Wire the buttons that point at CONFIG urls.
  const map = {
    signup: CONFIG.groupUrl || CONFIG.formUrl, group: CONFIG.groupUrl || CONFIG.formUrl,
    form: CONFIG.formUrl, optin: CONFIG.optInUrl, feedback: CONFIG.feedbackUrl,
  };
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
      el.textContent = "Link coming soon";
    }
  });

  // Contact email, WhatsApp and social links. Anything not set in config.js is removed.
  $$("[data-email]").forEach((el) => {
    if (CONFIG.contactEmail) {
      el.href = "mailto:" + CONFIG.contactEmail + (el.dataset.subject ? "?subject=" + encodeURIComponent(el.dataset.subject) : "");
      if (!el.dataset.keep) el.textContent = CONFIG.contactEmail;
    } else el.remove();
  });
  if (!CONFIG.contactEmail) $$("[data-if-email]").forEach((el) => el.remove());
  $$("[data-wa]").forEach((el) => {
    if (!CONFIG.whatsappNumber) return el.remove();
    el.href = "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent("Hi Arun, I would like to join the Pingo closed test.");
    el.target = "_blank"; el.rel = "noopener";
  });
  const socials = { linkedin: CONFIG.linkedinUrl, facebook: CONFIG.facebookUrl, instagram: CONFIG.instagramUrl };
  $$("[data-social]").forEach((el) => {
    const u = socials[el.dataset.social];
    if (u) { el.href = u; el.target = "_blank"; el.rel = "noopener"; } else el.remove();
  });
  $$("[data-hide-if-empty]").forEach((box) => { if (!box.querySelector("a")) box.hidden = true; });

  // Open / closed status.
  $$("[data-status]").forEach((el) => {
    el.textContent = CONFIG.testOpen ? "Closed test is open: volunteers wanted" : "Closed test opens soon";
  });

  // Share buttons.
  const pageUrl = (CONFIG.siteUrl || location.href).split("#")[0];
  const msg = "I'm helping test Pingo, an Android reminder app for water, medicine, meals and work. They need 12 volunteers for a 14-day test: ";
  const links = {
    whatsapp: "https://wa.me/?text=" + encodeURIComponent(msg + pageUrl),
    linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(pageUrl),
    facebook: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(pageUrl),
  };
  $$("[data-share]").forEach((el) => {
    const k = el.dataset.share;
    if (links[k]) { el.href = links[k]; el.target = "_blank"; el.rel = "noopener"; }
    if (k === "copy") {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const done = () => { const t = el.textContent; el.textContent = "Link copied"; setTimeout(() => (el.textContent = t), 1800); };
        if (navigator.clipboard) navigator.clipboard.writeText(pageUrl).then(done, done); else done();
      });
    }
  });

  // Wall of Thanks: a slow moving strip of names and roles, no counts. Real testers from config.js replace the sample names.
  const wall = $("#wallgrid");
  if (wall) {
    const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    const PAL = [["#ffd93a", "#ff9f43"], ["#7be0b0", "#38b6a0"], ["#9ad0ff", "#6e9bff"], ["#f5a3c7", "#e46aa0"], ["#c3b1ff", "#8d7bff"], ["#ffb48a", "#ff7a59"]];
    const SAMPLES = [
      { name: "Riya Sharma", role: "College Student" },
      { name: "Karan Mehta", role: "IT Professional" },
      { name: "Arjun Nair", role: "Engineering Student" },
      { name: "Priya Verma", role: "Software Engineer" },
    ];
    const useSamples = TESTERS.length === 0;
    const people = useSamples ? SAMPLES : TESTERS;
    const chip = (t, i) => {
      const el = t.link ? document.createElement("a") : document.createElement("div");
      el.className = "chip";
      if (t.link) { el.href = t.link; el.target = "_blank"; el.rel = "noopener"; }
      const c = PAL[i % PAL.length];
      const av = document.createElement("span"); av.className = "av"; av.textContent = initials(t.name);
      av.style.background = "linear-gradient(135deg," + c[0] + "," + c[1] + ")";
      const box = document.createElement("div");
      const nm = document.createElement("b"); nm.textContent = t.name;
      const rl = document.createElement("span"); rl.className = "role"; rl.textContent = [t.role, t.org].filter(Boolean).join(", ");
      box.append(nm, rl); el.append(av, box);
      return el;
    };
    // Build each row twice so the loop is seamless; a short list is repeated first so the strip never runs empty.
    const row = (list, rev, i0) => {
      let base = list.slice();
      while (base.length < 8) base = base.concat(list);
      const wrap = document.createElement("div"); wrap.className = "marq" + (rev ? " rev" : "");
      const track = document.createElement("div"); track.className = "track";
      [0, 1].forEach((k) => base.forEach((t, i) => { const c = chip(t, i + i0); if (k) c.setAttribute("aria-hidden", "true"); track.appendChild(c); }));
      wrap.appendChild(track);
      return wrap;
    };
    wall.append(row(people, false, 0));
    const note = $("#wallnote");
    if (note) note.hidden = !useSamples;
  }

  // Mobile dock: a Join button that stays in reach, and steps aside while the Join section is on screen.
  const dock = $("#dock"), joinSec = $("#join");
  if (dock && joinSec && "IntersectionObserver" in window) {
    new IntersectionObserver((en) => dock.classList.toggle("off", en[0].isIntersecting)).observe(joinSec);
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
