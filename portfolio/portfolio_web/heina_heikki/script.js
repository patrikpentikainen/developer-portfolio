// Heinä-Heikki - basic JavaScript

function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function setupHelloButton() {
  const btn = document.getElementById("helloBtn");
  const out = document.getElementById("output");

  if (!btn || !out) return;

  btn.addEventListener("click", () => {
    const now = new Date();
    const time = now.toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" });
    out.textContent = `Hello! 👋 (clicked at ${time})`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  setupHelloButton();
});
