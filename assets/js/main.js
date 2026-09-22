const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const siteHeader = document.querySelector(".site-header");
const desktopViewport = window.matchMedia("(min-width: 56.0625rem)");

let mobileNavPositionFrame;

function syncMobileNavPosition() {
  if (!siteHeader) return;
  const headerBottom = Math.max(0, Math.round(siteHeader.getBoundingClientRect().bottom));
  document.documentElement.style.setProperty("--mobile-nav-top", `${headerBottom}px`);
  document.documentElement.style.setProperty("--mobile-nav-height", `calc(100dvh - ${headerBottom}px)`);
  mobileNavPositionFrame = undefined;
}

function scheduleMobileNavPosition() {
  if (mobileNavPositionFrame) return;
  mobileNavPositionFrame = window.requestAnimationFrame(syncMobileNavPosition);
}

syncMobileNavPosition();
window.addEventListener("resize", scheduleMobileNavPosition);
window.addEventListener("scroll", scheduleMobileNavPosition, { passive: true });

if (mobileNav) mobileNav.inert = true;

function setMenu(open) {
  if (!menuToggle || !mobileNav) return;
  const focusWasInMenu = document.activeElement && mobileNav.contains(document.activeElement);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  mobileNav.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);

  if (open) {
    mobileNav.inert = false;
    syncMobileNavPosition();
    mobileNav.querySelector("a")?.focus();
  } else {
    if (focusWasInMenu) menuToggle.focus();
    mobileNav.inert = true;
  }
}

menuToggle?.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

mobileNav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
  }

  if (event.key === "Tab" && menuToggle?.getAttribute("aria-expanded") === "true") {
    const menuLinks = Array.from(mobileNav.querySelectorAll("a"));
    const focusLoop = [menuToggle, ...menuLinks];
    const currentIndex = focusLoop.indexOf(document.activeElement);
    const nextIndex = currentIndex === -1
      ? event.shiftKey ? focusLoop.length - 1 : 0
      : event.shiftKey
        ? (currentIndex - 1 + focusLoop.length) % focusLoop.length
        : (currentIndex + 1) % focusLoop.length;

    event.preventDefault();
    focusLoop[nextIndex].focus();
  }
});

desktopViewport.addEventListener("change", (event) => {
  if (event.matches && menuToggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
  }
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const contactForm = document.querySelector("[data-contact-form]");

function setFieldError(field, message) {
  const error = document.querySelector(`[data-error-for="${field.id}"]`);
  field.setAttribute("aria-invalid", String(Boolean(message)));
  if (error) error.textContent = message;
}

contactForm?.addEventListener("input", (event) => {
  const field = event.target;
  if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;
  if (field.getAttribute("aria-invalid") === "true") setFieldError(field, "");

  const status = contactForm.querySelector("[data-form-status]");
  if (status?.textContent) status.textContent = "";
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = {
    name: contactForm.elements.name,
    email: contactForm.elements.email,
    subject: contactForm.elements.subject,
    message: contactForm.elements.message,
  };
  const errors = {
    name: fields.name.value.trim() ? "" : "Please enter your name.",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim()) ? "" : "Please enter a valid email address.",
    subject: fields.subject.value.trim() ? "" : "Please add a subject.",
    message: fields.message.value.trim() ? "" : "Please write a message.",
  };

  Object.entries(fields).forEach(([key, field]) => setFieldError(field, errors[key]));
  const firstInvalid = Object.keys(errors).find((key) => errors[key]);
  const status = contactForm.querySelector("[data-form-status]");

  if (firstInvalid) {
    if (status) status.textContent = "Please check the highlighted fields.";
    fields[firstInvalid].focus();
    return;
  }

  if (status) {
    status.textContent = "Your note is ready. This demonstration form will send email once a form service is connected.";
  }
});
