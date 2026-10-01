/* ============================================================
   NISA MAKEOVER — script.js
   Simple WhatsApp Booking — No Calendly, No Backend
   ============================================================ */

const WA_NUMBER = "917993323149"; // +91 79933 23149

document.addEventListener("DOMContentLoaded", () => {

  /* ── 1. NAVBAR SCROLL ── */
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 60);
    });
  }

  /* ── 2. HAMBURGER ── */
  const hamburger  = document.getElementById("hamburger");
  const mobileNav  = document.getElementById("mobileNav");
  const mobileClose = document.getElementById("mobileClose");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      mobileNav.classList.toggle("open");
      document.body.style.overflow = mobileNav.classList.contains("open") ? "hidden" : "";
    });
  }

  if (mobileClose) mobileClose.addEventListener("click", closeMobileNav);
  document.querySelectorAll(".mobile-link").forEach(l => l.addEventListener("click", closeMobileNav));

  function closeMobileNav() {
    hamburger.classList.remove("open");
    mobileNav.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ── 3. SCROLL REVEAL ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll(".reveal")];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add("visible"), idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  /* ── 4. SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]:not(.island-item)').forEach(a => {
    a.addEventListener("click", e => {
      const href = a.getAttribute("href");
      if (href === "#booking" || href === "#register") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
      }
    });
  });

  /* ── 5. ACTIVE NAV & FLOATING DYNAMIC ISLAND SCROLL-SPY ── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  const islandItems = document.querySelectorAll(".floating-island-nav .island-item");

  function setIslandActive(targetId) {
    if (!islandItems.length) return;
    islandItems.forEach(item => {
      if (item.getAttribute("data-target") === targetId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  function onScrollSpy() {
    const scrollPos = window.scrollY;
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // Standard header nav links
    let cur = "";
    sections.forEach(s => {
      if (scrollPos >= s.offsetTop - 140) cur = s.id;
    });
    navLinks.forEach(l => {
      l.style.color = l.getAttribute("href") === `#${cur}` ? "var(--gold)" : "";
    });

    // Floating Dynamic Island Menu
    if (islandItems.length > 0) {
      // 1. Bottom of page check
      if (scrollPos + winHeight >= docHeight - 90) {
        const lastItem = islandItems[islandItems.length - 1];
        const lastTarget = lastItem.getAttribute("data-target");
        if (lastTarget) {
          setIslandActive(lastTarget);
          return;
        }
      }

      // 2. Dynamic section detection based on active page's island targets
      let activeTarget = islandItems[0].getAttribute("data-target") || "hero";
      islandItems.forEach(item => {
        const targetId = item.getAttribute("data-target");
        if (targetId) {
          const el = document.getElementById(targetId);
          if (el && scrollPos >= el.offsetTop - 240) {
            activeTarget = targetId;
          }
        }
      });
      setIslandActive(activeTarget);
    }
  }

  window.addEventListener("scroll", onScrollSpy, { passive: true });
  onScrollSpy(); // Initial check on page load

  // Floating Island click handling
  islandItems.forEach(item => {
    const href = item.getAttribute("href");
    if (href && href.startsWith("#")) {
      item.addEventListener("click", e => {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const targetOffset = target.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: targetOffset, behavior: "smooth" });
          setIslandActive(item.getAttribute("data-target"));
        }
      });
    }
  });

  /* ── 6. MIN DATE ── */
  const dateInput = document.getElementById("pdate");
  if (dateInput) dateInput.setAttribute("min", new Date().toISOString().split("T")[0]);

  /* ══════════════════════════════════════════════
     3-STEP BOOKING FORM
  ══════════════════════════════════════════════ */

  let currentStep = 1;

  /* Mode Toggle (Home / Studio) */
  const modeBtns = document.querySelectorAll(".mode-btn");
  const serviceModeInput = document.getElementById("serviceMode");
  const addressField = document.getElementById("address-field");

  modeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      modeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      serviceModeInput.value = btn.dataset.mode;
      addressField.style.display = btn.dataset.mode === "Home Service" ? "flex" : "none";
    });
  });

  /* Service Pills */
  const pills = document.querySelectorAll(".pill");
  const serviceInput = document.getElementById("service");

  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("selected"));
      pill.classList.add("selected");
      serviceInput.value = pill.dataset.service;
    });
  });

  /* Step Navigation */
  document.querySelectorAll(".next-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const nextStep = parseInt(btn.dataset.next);
      if (validateStep(currentStep)) goToStep(nextStep);
    });
  });

  document.querySelectorAll(".back-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      goToStep(parseInt(btn.dataset.back));
    });
  });

  function goToStep(n) {
    document.querySelectorAll(".form-step").forEach(s => s.classList.add("hidden"));
    document.getElementById(`step${n}`).classList.remove("hidden");

    // Update step indicators
    document.querySelectorAll(".step").forEach(s => {
      const sn = parseInt(s.dataset.step);
      s.classList.remove("active", "done");
      if (sn === n) s.classList.add("active");
      else if (sn < n) s.classList.add("done");
    });

    currentStep = n;

    // Build summary on step 3
    if (n === 3) buildSummary();

    // Scroll to booking form top (inside modal or on page)
    const modalInner = document.querySelector(".app-modal-inner");
    if (modalInner && document.getElementById("appointmentModal")?.classList.contains("active")) {
      modalInner.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const bookingCard = document.querySelector(".booking-card") || document.getElementById("booking");
      if (bookingCard) window.scrollTo({ top: bookingCard.getBoundingClientRect().top + window.scrollY - 30, behavior: "smooth" });
    }
  }

  /* Validation */
  function validateStep(step) {
    if (step === 1) {
      const name   = document.getElementById("fname").value.trim();
      const mobile = document.getElementById("mobile").value.trim();
      const mode   = serviceModeInput.value;
      const addr   = document.getElementById("address").value.trim();

      if (!name) { showToast("⚠️ Please enter your name."); return false; }
      if (!mobile || mobile.replace(/\D/g,'').length < 10) { showToast("⚠️ Please enter a valid 10-digit mobile number."); return false; }
      if (mode === "Home Service" && !addr) { showToast("⚠️ Please enter your address for home service."); return false; }
      return true;
    }
    if (step === 2) {
      const service = serviceInput.value;
      const date    = document.getElementById("pdate").value;
      const time    = document.getElementById("ptime").value;

      if (!service) { showToast("⚠️ Please select a service."); return false; }
      if (!date)    { showToast("⚠️ Please select a preferred date."); return false; }
      if (!time)    { showToast("⚠️ Please select a preferred time slot."); return false; }
      return true;
    }
    return true;
  }

  /* Build Summary */
  function buildSummary() {
    const name    = document.getElementById("fname").value.trim();
    const mobile  = document.getElementById("mobile").value.trim();
    const service = serviceInput.value;
    const mode    = serviceModeInput.value;
    const date    = document.getElementById("pdate").value;
    const time    = document.getElementById("ptime").value;
    const address = document.getElementById("address").value.trim();
    const notes   = document.getElementById("notes").value.trim();

    const formattedDate = new Date(date).toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" });

    const items = [
      { label: "Name",         value: name },
      { label: "Mobile",       value: mobile },
      { label: "Service",      value: service },
      { label: "Mode",         value: mode },
      { label: "Date",         value: formattedDate },
      { label: "Time",         value: time },
    ];
    if (mode === "Home Service" && address) items.push({ label: "Address", value: address });
    if (notes) items.push({ label: "Notes", value: notes });

    const grid = document.getElementById("summaryGrid");
    grid.innerHTML = items.map(i => `
      <div class="summary-item">
        <label>${i.label}</label>
        <p>${i.value}</p>
      </div>
    `).join("");
  }

  /* WhatsApp Submit */
  const bookingSubmit = document.getElementById("bookingSubmit");
  if (bookingSubmit) {
    bookingSubmit.addEventListener("click", () => {
    const name    = document.getElementById("fname").value.trim();
    const mobile  = document.getElementById("mobile").value.trim();
    const service = serviceInput.value;
    const mode    = serviceModeInput.value;
    const date    = document.getElementById("pdate").value;
    const time    = document.getElementById("ptime").value;
    const address = document.getElementById("address").value.trim();
    const notes   = document.getElementById("notes").value.trim();

    const formattedDate = new Date(date).toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" });

    let msg = `Hello NISA MAKEOVER 💄\n\n`;
    msg += `I would like to book an appointment.\n\n`;
    msg += `*Name:* ${name}\n`;
    msg += `*Mobile:* ${mobile}\n`;
    msg += `*Service:* ${service}\n`;
    msg += `*Mode:* ${mode}\n`;
    msg += `*Date:* ${formattedDate}\n`;
    msg += `*Time:* ${time}\n`;
    if (mode === "Home Service" && address) msg += `*Address:* ${address}\n`;
    if (notes) msg += `*Notes:* ${notes}\n`;
    msg += `\nPlease confirm my slot. Thank you! ✨`;

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    });
  }

  /* ══════════════════════════════════════════════
     POPUP MODALS — APPOINTMENT & WORKSHOP
  ══════════════════════════════════════════════ */

  window.openAppointmentModal = function(selectedService, selectedMode) {
    const modal = document.getElementById("appointmentModal");
    if (!modal) return;

    if (selectedMode) {
      const modeBtns = document.querySelectorAll(".mode-btn");
      const serviceModeInput = document.getElementById("serviceMode");
      const addressField = document.getElementById("address-field");
      modeBtns.forEach(b => {
        if (b.dataset.mode === selectedMode) {
          b.classList.add("active");
          if (serviceModeInput) serviceModeInput.value = selectedMode;
          if (addressField) addressField.style.display = selectedMode === "Home Service" ? "flex" : "none";
        } else {
          b.classList.remove("active");
        }
      });
    }

    if (selectedService) {
      const pills = document.querySelectorAll(".pill");
      const serviceInput = document.getElementById("service");
      pills.forEach(pill => {
        if (pill.dataset.service === selectedService) {
          pill.classList.add("selected");
          if (serviceInput) serviceInput.value = selectedService;
        } else {
          pill.classList.remove("selected");
        }
      });
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    if (window.lucide) lucide.createIcons();
  };

  window.closeAppointmentModal = function(e) {
    if (e && e.target !== document.getElementById("appointmentModal") && !e.target.closest(".app-modal-close")) return;
    const modal = document.getElementById("appointmentModal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  window.openWorkshopModal = function() {
    const modal = document.getElementById("workshopModal");
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
      if (window.lucide) lucide.createIcons();
    } else {
      window.location.href = "workshop.html#register";
    }
  };

  window.openWorkshopModal = function() {
    const modal = document.getElementById("workshopModal");
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
      if (window.lucide) lucide.createIcons();
      clearWsErrors();
      setTimeout(() => {
        const nameInput = document.getElementById("wsName");
        if (nameInput) nameInput.focus();
      }, 200);
    } else {
      window.location.href = "workshop.html#register";
    }
  };

  window.closeWorkshopModal = function(e) {
    if (e && e.target !== document.getElementById("workshopModal") && !e.target.closest(".ws-modal-close")) return;
    const modal = document.getElementById("workshopModal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
      clearWsErrors();
    }
  };

  function clearWsErrors() {
    ['wsName', 'wsPhone', 'wsCity', 'wsExp'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('input-error');
    });
    const errBox = document.getElementById('wsFormError');
    if (errBox) {
      errBox.style.display = 'none';
      errBox.textContent = '';
    }
  }

  function showWsError(msg, firstInputToFocus) {
    const errBox = document.getElementById('wsFormError');
    if (errBox) {
      errBox.innerHTML = msg;
      errBox.style.display = 'block';
    }
    showToast("⚠️ Form Incomplete: Please fill in all required fields.");
    if (firstInputToFocus) {
      firstInputToFocus.focus();
    }
  }

  // Auto clear field error styling on input/change
  ['wsName', 'wsPhone', 'wsCity', 'wsExp'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('input-error');
        const errBox = document.getElementById('wsFormError');
        if (errBox) errBox.style.display = 'none';
      });
      el.addEventListener('change', () => {
        el.classList.remove('input-error');
        const errBox = document.getElementById('wsFormError');
        if (errBox) errBox.style.display = 'none';
      });
    }
  });

  // Intercept all links targeting #booking to open the Appointment popup directly
  document.querySelectorAll('a[href="#booking"]').forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      closeMobileNav();
      const isHome = a.textContent.toLowerCase().includes("home");
      openAppointmentModal(null, isHome ? "Home Service" : null);
    });
  });

  // Intercept all links targeting #register to open the Workshop popup directly
  document.querySelectorAll('a[href="#register"], a[href="workshop.html#register"]').forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      closeMobileNav();
      openWorkshopModal();
    });
  });

  // Global Escape key listener
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeAppointmentModal();
      closeWorkshopModal();
      if (typeof closeServiceModal === "function") closeServiceModal();
    }
  });

  // Check URL hash on page load
  if (window.location.hash === "#booking") {
    setTimeout(() => {
      openAppointmentModal();
      history.replaceState(null, null, ' ');
    }, 250);
  } else if (window.location.hash === "#register") {
    setTimeout(() => {
      openWorkshopModal();
      history.replaceState(null, null, ' ');
    }, 250);
  }

  // Workshop Form submission handler for index.html
  const wsSubmitBtn = document.getElementById("wsSubmit");
  const wsForm = document.getElementById("workshopForm");

  if (wsSubmitBtn) {
    wsSubmitBtn.addEventListener("click", handleHomeWorkshopSubmit);
  }

  if (wsForm) {
    wsForm.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        handleHomeWorkshopSubmit();
      }
    });
  }

  function handleHomeWorkshopSubmit() {
    clearWsErrors();

    const nameEl  = document.getElementById("wsName");
    const phoneEl = document.getElementById("wsPhone");
    const cityEl  = document.getElementById("wsCity");
    const expEl   = document.getElementById("wsExp");
    const msgEl   = document.getElementById("wsMessage");

    const name   = nameEl ? nameEl.value.trim() : "";
    const phone  = phoneEl ? phoneEl.value.trim() : "";
    const city   = cityEl ? cityEl.value.trim() : "";
    const exp    = expEl ? expEl.value.trim() : "";
    const msgVal = msgEl ? msgEl.value.trim() : "";

    let hasError = false;
    let firstFocusEl = null;

    if (!name || name.length < 2) {
      if (nameEl) nameEl.classList.add("input-error");
      if (!firstFocusEl) firstFocusEl = nameEl;
      hasError = true;
    }

    const digitsOnly = phone.replace(/\D/g, "");
    if (!digitsOnly || digitsOnly.length < 10) {
      if (phoneEl) phoneEl.classList.add("input-error");
      if (!firstFocusEl) firstFocusEl = phoneEl;
      hasError = true;
    }

    if (!city || city.length < 2) {
      if (cityEl) cityEl.classList.add("input-error");
      if (!firstFocusEl) firstFocusEl = cityEl;
      hasError = true;
    }

    if (!exp) {
      if (expEl) expEl.classList.add("input-error");
      if (!firstFocusEl) firstFocusEl = expEl;
      hasError = true;
    }

    if (hasError) {
      showWsError("⚠️ <strong>Form Incomplete:</strong> Please fill in your Full Name, 10-digit WhatsApp Number, City, and Experience level.", firstFocusEl);
      return;
    }

    const messageDisplay = msgVal || "None";

    let message = `Hello NISA MAKEOVER,\n\n`;
    message += `*1-DAY BRIDAL MAKEUP MASTERCLASS REGISTRATION*\n`;
    message += `Theme: Wedding × Reception Artistry\n`;
    message += `📅 Date: 11 October 2026\n`;
    message += `⏰ Time: 11:00 AM – 5:00 PM\n\n`;
    message += `Participant Details:\n`;
    message += `• Full Name: ${name}\n`;
    message += `• WhatsApp: ${phone}\n`;
    message += `• City: ${city}\n`;
    message += `• Experience: ${exp}\n`;
    message += `• Questions/Notes: ${messageDisplay}\n\n`;
    message += `Special Offer Fee: ₹4,999 Only / Person (Regular ₹15,000)\n`;
    message += `Included: Digital Certificate of Participation\n\n`;
    message += `Venue:\n`;
    message += `Pillar No. 242, Near Fish Building, Attapur Road, Hyderabad\n\n`;
    message += `Please confirm seat availability and payment instructions.`;

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    showToast("✨ Opening WhatsApp with your registration details...");
  }

  /* ══════════════════════════════════════════════════════════
     MASTERCLASS COUNTDOWN & AUTO-EXPIRY (11 OCT 2026)
     Auto-removes masterclass button from Home Page after 11 Oct
  ══════════════════════════════════════════════════════════ */
  const MASTERCLASS_START_DATE = new Date("2026-10-11T11:00:00+05:30");
  const MASTERCLASS_END_DATE   = new Date("2026-10-11T17:00:00+05:30");

  function manageHomeMasterclass() {
    const now = new Date();
    // After 11 Oct 5:00 PM, automatically hide masterclass buttons completely!
    if (now > MASTERCLASS_END_DATE) {
      document.querySelectorAll(".masterclass-expire-target, .btn-hero-workshop, #homeWorkshopTimer").forEach(el => {
        el.style.display = "none";
      });
      return;
    }

    const diff = MASTERCLASS_START_DATE - now;
    if (diff <= 0) {
      document.querySelectorAll("#bookingSecTimer, #wsModalTimer, .ws-modal-live-timer").forEach(el => {
        el.textContent = "SESSION IN PROGRESS!";
      });
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    const pad = n => String(n).padStart(2, '0');
    const timerText = `${pad(d)}d : ${pad(h)}h : ${pad(m)}m : ${pad(s)}s`;

    document.querySelectorAll("#bookingSecTimer, #wsModalTimer, .ws-modal-live-timer").forEach(el => {
      el.textContent = timerText;
    });
  }

  manageHomeMasterclass();
  setInterval(manageHomeMasterclass, 1000);

});

/* Toast */
function showToast(msg) {
  document.querySelector(".toast")?.remove();
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  t.style.cssText = `position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--black-light);border:1px solid rgba(201,168,76,0.4);color:var(--ivory);padding:14px 28px;border-radius:4px;font-family:var(--font-body);font-size:14px;z-index:2000000 !important;opacity:0;transition:all 0.3s ease;white-space:nowrap;box-shadow:0 8px 32px rgba(0,0,0,0.4);`;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity="1"; t.style.transform="translateX(-50%) translateY(0)"; });
  setTimeout(() => { t.style.opacity="0"; setTimeout(()=>t.remove(),300); }, 3500);
}
