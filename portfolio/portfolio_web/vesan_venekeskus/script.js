document.getElementById("year").textContent = String(new Date().getFullYear());

// Mobile nav
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
menuBtn.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("show");
  menuBtn.setAttribute("aria-expanded", String(open));
  mobileNav.setAttribute("aria-hidden", String(!open));
});
mobileNav.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    mobileNav.classList.remove("show");
    menuBtn.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");
  });
});

// Booking calculator (demo)
const service = document.getElementById("service");
const len = document.getElementById("len");
const date = document.getElementById("date");
const power = document.getElementById("power");
const wash = document.getElementById("wash");
const winter = document.getElementById("winter");
const calc = document.getElementById("calc");

const sSvc = document.getElementById("sSvc");
const sLen = document.getElementById("sLen");
const sAdd = document.getElementById("sAdd");
const sTotal = document.getElementById("sTotal");
const note = document.getElementById("note");

const svcNames = {
  paiva: "Satamapaikka (päivä)",
  kausi: "Satamapaikka (kausi)",
  huolto: "Huolto",
  nosto: "Nosto"
};

function basePrice(svc, boatLen){
  // Demo rules
  const L = Math.max(2, Math.min(12, Number(boatLen) || 5));
  if (svc === "paiva") return 15 + Math.max(0, (L - 5) * 2);
  if (svc === "kausi") {
    if (L <= 5) return 390;
    if (L <= 7) return 520;
    return 650;
  }
  if (svc === "huolto") return 85 + Math.max(0, (L - 5) * 6);
  if (svc === "nosto") return 75 + Math.max(0, (L - 5) * 4);
  return 0;
}

function addOns(){
  let sum = 0;
  const picks = [];
  if (power.checked) { sum += 6; picks.push("Sähkö"); }
  if (wash.checked) { sum += 60; picks.push("Pohjapesu"); }
  if (winter.checked) { sum += 220; picks.push("Talvisäilytys"); }
  return { sum, picks };
}

calc.addEventListener("click", () => {
  const svc = service.value;
  const L = Number(len.value || 5.5);
  const base = basePrice(svc, L);
  const extras = addOns();
  const total = base + extras.sum;

  sSvc.textContent = svcNames[svc] || "—";
  sLen.textContent = `${L.toFixed(1)} m`;
  sAdd.textContent = extras.picks.length ? `${extras.picks.join(", ")} (€${extras.sum})` : "Ei lisäpalveluja";
  sTotal.textContent = `€${total.toFixed(2)}`;

  const d = date.value ? `Ajankohta: ${date.value}` : "Ajankohta: ei valittu";
  note.textContent = `Demo-erittely: perushinta €${base.toFixed(2)} + lisät €${extras.sum.toFixed(2)}. ${d}.`;
});

// Contact form validation (demo)
const form = document.getElementById("form");
const formNote = document.getElementById("formNote");

function setErr(name, msg){
  const el = document.querySelector(`[data-err="${name}"]`);
  if (el) el.textContent = msg || "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formNote.textContent = "";
  setErr("name",""); setErr("email",""); setErr("phone",""); setErr("msg","");

  const fd = new FormData(form);
  const name = String(fd.get("name") || "").trim();
  const email = String(fd.get("email") || "").trim();
  const phone = String(fd.get("phone") || "").trim();
  const msg = String(fd.get("msg") || "").trim();

  let ok = true;
  if (name.length < 2) { setErr("name","Kirjoita vähintään 2 merkkiä."); ok = false; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { setErr("email","Tarkista sähköposti."); ok = false; }
  if (phone.length < 6) { setErr("phone","Kirjoita puhelinnumero."); ok = false; }
  if (msg.length < 12) { setErr("msg","Kirjoita vähintään 12 merkkiä."); ok = false; }

  if (!ok) return;

  form.reset();
  formNote.textContent = "Demo: viesti vastaanotettu (ei lähetä oikeasti).";
});
