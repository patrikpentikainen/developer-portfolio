document.getElementById("year").textContent = String(new Date().getFullYear());

const $ = (s) => document.querySelector(s);

const quickPlan = $("#quickPlan");
const quickDate = $("#quickDate");
const badge = $("#availBadge");
const jumpToForm = $("#jumpToForm");

const availDate = $("#availDate");
const availPlan = $("#availPlan");
const checkAvail = $("#checkAvail");
const availResult = $("#availResult");
const availHint = $("#availHint");

const planInput = $("#planInput");
const dateInput = $("#dateInput");
const form = $("#orderForm");
const note = $("#formNote");

function isFree(dateStr, plan) {
  // Demo rule: some days are "busy" depending on date + plan
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay(); // 0..6
  const n = d.getDate();  // 1..31
  const hash = (day + n + plan.length) % 4; // 0..3
  return hash !== 0; // 25% "varattu"
}

function paintBadge(el, state, text) {
  el.classList.remove("ok", "no");
  if (state === true) el.classList.add("ok");
  if (state === false) el.classList.add("no");
  el.textContent = text;
}

// Quick card: update badge on change
function updateQuick() {
  const free = isFree(quickDate.value, quickPlan.value);
  if (free === null) return paintBadge(badge, null, "Valitse päivä");
  paintBadge(badge, free, free ? "Vapaa (demo)" : "Varattu (demo)");
}
quickPlan.addEventListener("change", updateQuick);
quickDate.addEventListener("change", updateQuick);

jumpToForm.addEventListener("click", () => {
  planInput.value = `${quickPlan.value} (valittu)`;
  dateInput.value = quickDate.value || "";
  $("#tilaus").scrollIntoView({ behavior: "smooth" });
});

// Package buttons -> fill form
document.querySelectorAll("[data-plan]").forEach((btn) => {
  btn.addEventListener("click", () => {
    planInput.value = btn.getAttribute("data-plan") || "—";
    $("#tilaus").scrollIntoView({ behavior: "smooth" });
  });
});

// Availability checker
checkAvail.addEventListener("click", () => {
  const free = isFree(availDate.value, availPlan.value);
  if (free === null) {
    paintBadge(availResult, null, "Valitse päivä ja tarkista");
    availHint.textContent = "";
    return;
  }
  paintBadge(availResult, free, free ? "Vapaa (demo)" : "Varattu (demo)");
  availHint.textContent = free
    ? "Vinkki: klikkaa Varaa ja täytä lomake."
    : "Vinkki: kokeile toista päivää tai pakettia.";
});

// FAQ accordion
const qs = Array.from(document.querySelectorAll(".q"));
qs.forEach((q) => {
  q.addEventListener("click", () => {
    const isOpen = q.getAttribute("aria-expanded") === "true";
    qs.forEach(x => x.setAttribute("aria-expanded", "false"));
    q.setAttribute("aria-expanded", String(!isOpen));
  });
});

// Form validation (demo)
function setErr(name, msg) {
  const el = document.querySelector(`[data-err="${name}"]`);
  if (el) el.textContent = msg || "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  note.textContent = "";
  setErr("name", ""); setErr("email", ""); setErr("date", ""); setErr("message", "");

  const fd = new FormData(form);
  const name = String(fd.get("name") || "").trim();
  const email = String(fd.get("email") || "").trim();
  const date = String(fd.get("date") || "").trim();
  const message = String(fd.get("message") || "").trim();

  let ok = true;
  if (name.length < 2) { setErr("name", "Kirjoita vähintään 2 merkkiä."); ok = false; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { setErr("email", "Tarkista sähköposti."); ok = false; }
  if (!date) { setErr("date", "Valitse päivämäärä."); ok = false; }
  if (message.length < 10) { setErr("message", "Kirjoita vähintään 10 merkkiä."); ok = false; }
  if (!ok) return;

  form.reset();
  planInput.value = "—";
  note.textContent = "Demo: varauspyyntö vastaanotettu (ei lähetä oikeasti).";
});
