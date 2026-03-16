"use strict";
/* Features: navbar scroll, scroll-reveal, form validation,
* active nav highlight, typing effect, paw-print cursor trail
*  /


/* = Navbar: add .scrolled class on scroll  */
const navbar = document.getElementById("navbar");

const handleNavbarScroll = () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
};

window.addEventListener("scroll", handleNavbarScroll, { passive: true });
handleNavbarScroll(); // run on load

/* Active nav link on scroll */
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll("#navMenu .nav-link");

const observerOptions = {
  root: null,
  rootMargin: "-50% 0px -45% 0px",
  threshold: 0,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`,
        );
      });
    }
  });
}, observerOptions);

sections.forEach((section) => sectionObserver.observe(section));

/* Scroll-reveal for .reveal elements  */
const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling cards
        const delay = entry.target.closest(".projects-grid")
          ? Array.from(revealEls).indexOf(entry.target) * 80
          : 0;

        setTimeout(() => {
          entry.target.classList.add("visible");
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

revealEls.forEach((el) => revealObserver.observe(el));

/*  Typing headline effect = */
const taglineEl = document.querySelector(".hero-tagline");

if (taglineEl) {
  const lines = [
    "Crafting thoughtful digital experiences —",
    "one pixel, one cup of coffee at a time.",
  ];
  const fullText = lines.join("\n");

  taglineEl.textContent = "";
  taglineEl.style.whiteSpace = "pre-line";

  let index = 0;

  const typeChar = () => {
    if (index < fullText.length) {
      taglineEl.textContent += fullText[index];
      index++;
      setTimeout(typeChar, 28);
    }
  };

  // Start typing after the hero fade-in animation
  setTimeout(typeChar, 900);
}

/*  Contact form validation  */
const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const msgInput = document.getElementById("message");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const msgError = document.getElementById("messageError");
const formSuccess = document.getElementById("formSuccess");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const setError = (input, errorEl, msg) => {
  errorEl.textContent = msg;
  input.classList.add("is-invalid");
  input.setAttribute("aria-invalid", "true");
};

const clearError = (input, errorEl) => {
  errorEl.textContent = "";
  input.classList.remove("is-invalid");
  input.removeAttribute("aria-invalid");
};

const validateField = (input, errorEl) => {
  const val = input.value.trim();

  if (!val) {
    setError(input, errorEl, "This field is required.");
    return false;
  }

  if (input.type === "email" && !EMAIL_RE.test(val)) {
    setError(input, errorEl, "Please enter a valid email address.");
    return false;
  }

  clearError(input, errorEl);
  return true;
};

// Live validation on blur
[nameInput, emailInput, msgInput].forEach((input, i) => {
  const errorEl = [nameError, emailError, msgError][i];
  input.addEventListener("blur", () => validateField(input, errorEl));
  input.addEventListener("input", () => {
    if (input.classList.contains("is-invalid")) {
      validateField(input, errorEl);
    }
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const validName = validateField(nameInput, nameError);
  const validEmail = validateField(emailInput, emailError);
  const validMsg = validateField(msgInput, msgError);

  if (!validName || !validEmail || !validMsg) return;

  // Simulate submission
  const btn = form.querySelector(".submit-btn");
  btn.disabled = true;
  btn.querySelector(".btn-text").textContent = "Sending…";

  setTimeout(() => {
    form.reset();
    [nameInput, emailInput, msgInput].forEach((input, i) => {
      clearError(input, [nameError, emailError, msgError][i]);
    });

    formSuccess.hidden = false;
    btn.disabled = false;
    btn.querySelector(".btn-text").textContent = "Send Message";

    setTimeout(() => {
      formSuccess.hidden = true;
    }, 5000);
  }, 1200);
});

/*  Smooth scroll for all in-page anchor links*/
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();

    // Close mobile nav if open
    const bsCollapse = bootstrap.Collapse.getInstance(
      document.getElementById("navMenu"),
    );
    if (bsCollapse) bsCollapse.hide();

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });
});
