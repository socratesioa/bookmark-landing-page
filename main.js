// MOBILE MENU

document.addEventListener("DOMContentLoaded", () => {
  const mobileMenu = document.querySelector(".nav-container");
  const logoElement = document.querySelector(".logo-header");
  const menuToggle = document.getElementById("menuToggle");
  const social = document.querySelector(".social");
  const menuIcon = menuToggle.querySelector("img");
  const logo = document.querySelectorAll(
    ".logo-header .logo-text, .logo-header .logo-circle, .logo-header .logo-circle-inner"
  );

  // NAV CONTAINER SLOTS
  const headerSlot = document.querySelector(".mobile-nav-header-slot");
  const socialSlot = document.querySelector(".mobile-nav-social-slot");

  // BACK HOME
  const headerLogo = document.querySelector(".header-container");
  const headerButton = document.querySelector(".header-container");
  const footer = document.querySelector(".footer-container");

  function getFocusableElements(container) {
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function trapFocus(e, container) {
    const focusableItems = getFocusableElements(container);
    if (!focusableItems.length) return;

    const first = focusableItems[0];
    const last = focusableItems[focusableItems.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open Navigation Menu");
      mobileMenu.classList.remove("active");
      menuIcon.src = "./images/icon-hamburger.svg";
      document.body.classList.remove("no-scroll");
      logo.forEach((el) => el.classList.remove("active"));
      headerLogo.prepend(logoElement);
      headerButton.appendChild(menuToggle);
      footer.appendChild(social);
    } else {
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close Navigation Menu");
      mobileMenu.classList.add("active");
      menuIcon.src = "./images/icon-close.svg";
      document.body.classList.add("no-scroll");
      logo.forEach((el) => el.classList.add("active"));
      headerSlot.appendChild(logoElement);
      headerSlot.appendChild(menuToggle);
      socialSlot.appendChild(social);

      const focusable = getFocusableElements(mobileMenu);
      if (focusable.length) focusable[0].focus();
    }
  });

  document.addEventListener("click", (e) => {
    const isClickInsideMenu = mobileMenu.contains(e.target);
    const isClickOnToggle = menuToggle.contains(e.target);
    const isMenuActive = mobileMenu.classList.contains("active");

    if (!isClickInsideMenu && !isClickOnToggle && isMenuActive) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open Navigation Menu");
      mobileMenu.classList.remove("active");
      menuIcon.src = "./images/icon-hamburger.svg";
      document.body.classList.remove("no-scroll");
      logo.forEach((el) => el.classList.remove("active"));
      headerLogo.prepend(logoElement);
      headerButton.appendChild(menuToggle);
      footer.appendChild(social);
    }
  });

  document.addEventListener("keydown", (e) => {
    const isMenuActive = mobileMenu.classList.contains("active");

    if (e.key === "Escape" && isMenuActive) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open Navigation Menu");
      mobileMenu.classList.remove("active");
      menuToggle.focus();
      menuIcon.src = "./images/icon-hamburger.svg";
      document.body.classList.remove("no-scroll");
      logo.forEach((el) => el.classList.remove("active"));
      headerLogo.prepend(logoElement);
      headerButton.appendChild(menuToggle);
      footer.appendChild(social);
    }

    if (isMenuActive && e.key === "Tab") {
      trapFocus(e, mobileMenu);
    }
  });
});

// ACCORDION
const accordionTriggers = document.querySelectorAll(".accordion-trigger");

accordionTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    const panel = document.getElementById(
      trigger.getAttribute("aria-controls")
    );

    accordionTriggers.forEach((other) => {
      if (other !== trigger) {
        other.setAttribute("aria-expanded", "false");
        document.getElementById(
          other.getAttribute("aria-controls")
        ).hidden = true;
      }
    });

    trigger.setAttribute("aria-expanded", !expanded);
    panel.hidden = expanded;
  });
});

// NEWSLETTER VALIDATION

const form = document.getElementById("newsletterForm");

// CLEAR ERRORS ON INPUT
const emailInput = document.getElementById("email");
const inputError = document.querySelector(".input-group");
const errorIcon = document.querySelector(".error-icon");

emailInput.addEventListener("input", () => {
  const emailElement = document.getElementById("email-error");

  inputError.classList.remove("input-error");
  errorIcon.classList.remove("active");
  emailInput.removeAttribute("aria-invalid");
  emailElement.textContent = "";
});

// VALIDATOR
function validateEmail(value) {
  if (!value.trim()) return "This field is required";

  const pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (/\.\./.test(value)) {
    return "Whoops, make sure it’s an email";
  }

  const domain = value.split("@")[1];

  if (/^-|-$/.test(domain)) {
    return "Whoops, make sure it’s an email";
  }

  if (!pattern.test(value)) {
    return "Whoops, make sure it’s an email";
  }

  return "";
}

const validators = {
  email: validateEmail,
};

// TOAST

let toastTimeout;

function showToast() {
  const toast = document.getElementById("toast");
  const overlay = document.getElementById("overlay");

  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toast.classList.remove("visible");
    toast.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    overlay.classList.remove("visible");
  }

  toast.removeAttribute("aria-hidden");
  toast.classList.add("visible");
  document.body.classList.add("no-scroll");
  overlay.classList.add("visible");

  toastTimeout = setTimeout(() => {
    toast.setAttribute("aria-hidden", "true");
    toast.classList.remove("visible");
    document.body.classList.remove("no-scroll");
    overlay.classList.remove("visible");
    toastTimeout = null;
  }, 4000);
}

// SUBMISSION HANDLING

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  let isValid = true;

  for (const [field, validator] of Object.entries(validators)) {
    const errorMessage = validator(data[field]);
    const errorSpan = document.getElementById(`${field}-error`);
    const inputError = document.querySelector(".input-group");
    const errorIcon = document.querySelector(".error-icon");

    if (errorMessage) {
      isValid = false;
      errorSpan.textContent = errorMessage;
      inputError.setAttribute("aria-invalid", "true");
      inputError.classList.add("input-error");
      errorIcon.classList.add("active");
    } else {
      errorSpan.textContent = "";
    }
  }

  if (isValid) {
    console.log("form submitted", data);
    form.reset();
    showToast();
  }
});

// FEATURES TABS

const tabs = document.querySelectorAll('[role="tab"]');
const panels = document.querySelectorAll('[role="tabpanel"]');

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
    panels.forEach((panel) => (panel.hidden = true));

    tab.setAttribute("aria-selected", "true");
    const panelId = tab.getAttribute("aria-controls");
    document.getElementById(panelId).hidden = false;
  });
});
