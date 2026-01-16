const $ = (sel) => document.querySelector(sel);

const service = $("#service");
const days = $("#days");
const rush = $("#rush");
const delivery = $("#delivery");
const estimateValue = $("#estimateValue");
const copyEstimate = $("#copyEstimate");

const prices = {
  exchange: 179,
  rental: 139,
  service: 99
};

function formatEUR(n) {
  return new Intl.NumberFormat("fi-FI", { style: "currency", currency: "EUR" }).format(n);
}

function calc() {
  const d = Math.max(1, Math.min(60, Number(days.value || 1)));
  days.value = String(d);

  let base = prices[service.value] * d;

  if (rush.value === "yes") base *= 1.15;
  if (delivery.value === "delivery") base += 49;

  // “paper-style” rounding to nearest 5
  base = Math.round(base / 5) * 5;

  estimateValue.textContent = formatEUR(base);
  return base;
}

["change", "input"].forEach((evt) => {
  service.addEventListener(evt, calc);
  days.addEventListener(evt, calc);
  rush.addEventListener(evt, calc);
  delivery.addEventListener(evt, calc);
});

copyEstimate?.addEventListener("click", async () => {
  const val = estimateValue.textContent.trim();
  if (!val || val === "—") return;

  try {
    await navigator.clipboard.writeText(val);
    copyEstimate.textContent = "Kopioitu!";
    setTimeout(() => (copyEstimate.textContent = "Kopioi arvio"), 1000);
  } catch {
    // fallback: do nothing
  }
});

calc();

// Modal logic
const modal = $("#modal");
const openBtns = ["#openQuote", "#openQuote2", "#openQuote3", "#openQuote4"].map($);
const closeBtn = $("#closeModal");
const planInput = $("#planInput");
const note = $("#modalNote");
const form = $("#quoteForm");

function openModal(plan = "—") {
  planInput.value = plan;
  note.textContent = "";
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  // focus first input
  const first = modal.querySelector('input[name="name"]');
  first?.focus();
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

openBtns.forEach((b) => b?.addEventListener("click", () => openModal("—")));

document.querySelectorAll("[data-plan]").forEach((btn) => {
  btn.addEventListener("click", () => openModal(btn.getAttribute("data-plan") || "—"));
});

closeBtn?.addEventListener("click", closeModal);

modal?.addEventListener("click", (e) => {
  const t = e.target;
  if (t && t.getAttribute && t.getAttribute("data-close") === "true") closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
});

// Simple validation
function setErr(name, msg) {
  const el = modal.querySelector(`[data-err="${name}"]`);
  if (el) el.textContent = msg || "";
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  note.textContent = "";

  const fd = new FormData(form);
  const name = String(fd.get("name") || "").trim();
  const email = String(fd.get("email") || "").trim();
  const message = String(fd.get("message") || "").trim();

  let ok = true;
  setErr("name", "");
  setErr("email", "");
  setErr("message", "");

  if (name.length < 2) { setErr("name", "Kirjoita vähintään 2 merkkiä."); ok = false; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { setErr("email", "Tarkista sähköposti."); ok = false; }
  if (message.length < 10) { setErr("message", "Kirjoita vähintään 10 merkkiä."); ok = false; }

  if (!ok) return;

  form.reset();
  note.textContent = "Demo: tarjouspyyntö vastaanotettu (ei lähetä oikeasti).";
});

// Footer year
$("#year").textContent = String(new Date().getFullYear());
