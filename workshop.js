/* ============================================================
   NISA MAKEOVER — workshop.js
   5-Day Bridal Makeup Masterclass Registration & Timer Logic
   Dates: 11–15 October 2026 | Time: 11:00 AM – 5:00 PM
   Fee: ₹4,999 Only / Person (Special Offer - Regular ₹15,000)
   Includes: Hands-On Practice + All Products Provided + Digital Certificate
   Venue: Pillar No. 242, Near Fish Building, Attapur Road, Hyderabad
   ============================================================ */

const WA_NUMBER = "916305692152"; // +91 63056 92152
const MASTERCLASS_START = new Date("2026-10-11T11:00:00+05:30");
const MASTERCLASS_END   = new Date("2026-10-15T17:00:00+05:30");

document.addEventListener("DOMContentLoaded", () => {

  const submitBtn = document.getElementById("wsSubmit");
  const form      = document.getElementById("workshopForm");
  const errBox    = document.getElementById("wsFormError");

  /* ══════════════════════════════════════════════
     LIVE COUNTDOWN TIMER
  ══════════════════════════════════════════════ */
  function updateTimer() {
    const timerEl = document.getElementById("wsHeroTimer");
    if (!timerEl) return;

    const now = new Date();
    const diff = MASTERCLASS_START - now;

    if (diff <= 0) {
      if (now <= MASTERCLASS_END) {
        timerEl.textContent = "SESSION IN PROGRESS!";
      } else {
        timerEl.textContent = "COMPLETED";
      }
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    const pad = n => String(n).padStart(2, '0');
    const timerStr = `${pad(d)}d : ${pad(h)}h : ${pad(m)}m : ${pad(s)}s`;
    if (timerEl) timerEl.textContent = timerStr;

    document.querySelectorAll("#wsModalTimerWs, #wsModalTimer, .ws-modal-live-timer").forEach(el => {
      el.textContent = timerStr;
    });
  }

  updateTimer();
  setInterval(updateTimer, 1000);

  /* ══════════════════════════════════════════════
     POPUP MODAL CONTROLS — WORKSHOP & APPOINTMENT
  ══════════════════════════════════════════════ */
  window.openWorkshopModal = function() {
    const modal = document.getElementById("workshopModal");
    if (!modal) return;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    if (window.lucide) lucide.createIcons();
    // Auto focus first field
    setTimeout(() => {
      const nameInput = document.getElementById("wsName");
      if (nameInput) nameInput.focus();
    }, 200);
  };

  window.closeWorkshopModal = function(e) {
    if (e && e.target !== document.getElementById("workshopModal") && !e.target.closest(".ws-modal-close")) return;
    const modal = document.getElementById("workshopModal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
      clearErrors();
    }
  };

  window.openAppointmentModal = function(selectedService, selectedMode) {
    const modal = document.getElementById("appointmentModal");
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
      if (window.lucide) lucide.createIcons();
    } else {
      window.location.href = "index.html#booking";
    }
  };

  window.closeAppointmentModal = function(e) {
    if (e && e.target !== document.getElementById("appointmentModal") && !e.target.closest(".app-modal-close")) return;
    const modal = document.getElementById("appointmentModal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  // Intercept all links targeting #register so they open the Workshop modal directly
  document.querySelectorAll('a[href="#register"], a[href="#workshop-cta"]').forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      openWorkshopModal();
    });
  });

  // Global Escape key listener
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeWorkshopModal();
      closeAppointmentModal();
    }
  });

  // Auto clear field error styling on input
  ['wsName', 'wsPhone', 'wsCity', 'wsExp'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('input-error');
        if (errBox) errBox.style.display = 'none';
      });
      el.addEventListener('change', () => {
        el.classList.remove('input-error');
        if (errBox) errBox.style.display = 'none';
      });
    }
  });

  function clearErrors() {
    ['wsName', 'wsPhone', 'wsCity', 'wsExp'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('input-error');
    });
    if (errBox) {
      errBox.style.display = 'none';
      errBox.textContent = '';
    }
  }

  function showError(msg, firstInputToFocus) {
    if (errBox) {
      errBox.innerHTML = msg;
      errBox.style.display = 'block';
    }
    showToast(msg);
    if (firstInputToFocus) {
      firstInputToFocus.focus();
    }
  }

  /* ══════════════════════════════════════════════
     SUBMIT HANDLER & STRICT VALIDATION
  ══════════════════════════════════════════════ */
  if (submitBtn) {
    submitBtn.addEventListener("click", handleWorkshopRegistration);
  }

  if (form) {
    form.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        handleWorkshopRegistration();
      }
    });
  }

  function handleWorkshopRegistration() {
    clearErrors();

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

    // Check Full Name
    if (!name || name.length < 2) {
      if (nameEl) nameEl.classList.add("input-error");
      if (!firstFocusEl) firstFocusEl = nameEl;
      hasError = true;
    }

    // Check WhatsApp Number (must have 10 digits)
    const digitsOnly = phone.replace(/\D/g, "");
    if (!digitsOnly || digitsOnly.length < 10) {
      if (phoneEl) phoneEl.classList.add("input-error");
      if (!firstFocusEl) firstFocusEl = phoneEl;
      hasError = true;
    }

    // Check City
    if (!city || city.length < 2) {
      if (cityEl) cityEl.classList.add("input-error");
      if (!firstFocusEl) firstFocusEl = cityEl;
      hasError = true;
    }

    // Check Previous Experience
    if (!exp) {
      if (expEl) expEl.classList.add("input-error");
      if (!firstFocusEl) firstFocusEl = expEl;
      hasError = true;
    }

    if (hasError) {
      showError("⚠️ <strong>Form Incomplete:</strong> Please fill in your Full Name, 10-digit WhatsApp Number, City, and Experience level.", firstFocusEl);
      return;
    }

    // ── Build Clean Official WhatsApp Registration Message ──
    const messageDisplay = msgVal || "None";

    let message = `Hello NISA MAKEOVER,\n\n`;
    message += `*5-DAY BRIDAL MAKEUP MASTERCLASS REGISTRATION*\n`;
    message += `Theme: Bridal × Wedding × Reception Artistry\n`;
    message += `📅 Dates: 11–15 October 2026\n`;
    message += `⏰ Time: 11:00 AM – 5:00 PM (Daily)\n`;
    message += `✅ All Products Provided — No need to bring anything!\n`;
    message += `✅ Hands-On Practice Included\n\n`;
    message += `Participant Details:\n`;
    message += `• Full Name: ${name}\n`;
    message += `• WhatsApp: ${phone}\n`;
    message += `• City: ${city}\n`;
    message += `• Experience: ${exp}\n`;
    message += `• Questions/Notes: ${messageDisplay}\n\n`;
    message += `Special Offer Fee: ₹4,999 Only / Person (Regular ₹15,000)\n`;
    message += `Included: Hands-On Practice + All Products + Digital Certificate\n\n`;
    message += `Venue:\n`;
    message += `Pillar No. 242, Near Fish Building, Attapur Road, Hyderabad\n\n`;
    message += `Please confirm seat availability and payment instructions.`;

    // ── Open WhatsApp Web / App ──
    const targetUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(targetUrl, "_blank");

    showToast("✨ Opening WhatsApp with your registration details...");
  }

  // ── High Z-Index Toast Notification (Guaranteed in front of modals) ──
  function showToast(msg) {
    document.querySelectorAll(".ws-toast, .toast").forEach(el => el.remove());
    const t = document.createElement("div");
    t.className = "ws-toast";
    t.innerHTML = msg;
    t.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #181511;
      border: 1px solid rgba(201, 168, 76, 0.7);
      color: #FAF7F2;
      padding: 14px 28px;
      border-radius: 8px;
      font-family: 'Jost', sans-serif;
      font-size: 14px;
      z-index: 2000000 !important;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      max-width: 90vw;
      text-align: center;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(201, 168, 76, 0.25);
    `;
    document.body.appendChild(t);
    requestAnimationFrame(() => {
      t.style.opacity = "1";
      t.style.transform = "translateX(-50%) translateY(0)";
    });
    setTimeout(() => {
      t.style.opacity = "0";
      setTimeout(() => t.remove(), 300);
    }, 4000);
  }

});
