// Mobile menu toggle
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

// Close menu on link click (mobile)
document.querySelectorAll(".navlink").forEach((a) => {
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

// Footer year
document.getElementById("year").textContent = String(new Date().getFullYear());

// Scrollspy (active nav link)
const sections = ["palvelut", "projektit", "faq", "yhteys"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const links = Array.from(document.querySelectorAll(".navlink"));

const setActive = () => {
  const pos = window.scrollY + 120;
  let currentId = "palvelut";

  for (const s of sections) {
    if (s.offsetTop <= pos) currentId = s.id;
  }

  links.forEach((l) => {
    const href = l.getAttribute("href") || "";
    l.classList.toggle("active", href === `#${currentId}`);
  });
};

window.addEventListener("scroll", setActive, { passive: true });
setActive();

// FAQ accordion
const faq = document.getElementById("faqList");
if (faq) {
  const items = Array.from(faq.querySelectorAll(".faqItem"));
  items.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.nextElementSibling;
      const expanded = btn.getAttribute("aria-expanded") === "true";

      // close all
      items.forEach((b) => {
        b.setAttribute("aria-expanded", "false");
        const p = b.nextElementSibling;
        if (p) p.hidden = true;
      });

      // open selected if it was closed
      if (!expanded && panel) {
        btn.setAttribute("aria-expanded", "true");
        panel.hidden = false;
      }
    });
  });
}

// Simple form validation (demo)
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");

const setError = (name, msg) => {
  const el = document.querySelector(`[data-error-for="${name}"]`);
  if (el) el.textContent = msg || "";
};

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  note.textContent = "";

  const fd = new FormData(form);
  const name = String(fd.get("name") || "").trim();
  const email = String(fd.get("email") || "").trim();
  const message = String(fd.get("message") || "").trim();

  let ok = true;

  setError("name", "");
  setError("email", "");
  setError("message", "");

  if (name.length < 2) { setError("name", "Kirjoita vähintään 2 merkkiä."); ok = false; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { setError("email", "Tarkista sähköposti."); ok = false; }
  if (message.length < 10) { setError("message", "Kirjoita vähintään 10 merkkiä."); ok = false; }

  if (!ok) return;

  form.reset();
  note.textContent = "Demo: pyyntö vastaanotettu (ei lähetä oikeasti).";
});
