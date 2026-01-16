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

// Demo delivery fee by ZIP prefix
function zipFee(zip){
  if (!/^\d{5}$/.test(zip)) return null;
  const prefix = zip.slice(0,2);
  // Demo logic: closer prefixes cheaper
  if (["34","33"].includes(prefix)) return 8;
  if (["31","32","35","36"].includes(prefix)) return 14;
  return 20;
}

const zip = document.getElementById("zip");
const zip2 = document.getElementById("zip2");
const zipBtn = document.getElementById("zipCheck");
const zipResult = document.getElementById("zipResult");

zipBtn.addEventListener("click", () => {
  const v = (zip.value || "").trim();
  const fee = zipFee(v);
  if (fee === null) {
    zipResult.textContent = "Syötä 5-numeroinen postinumero (demo).";
    return;
  }
  zipResult.textContent = `Demo: Toimitusmaksu alueelle ${v} on noin €${fee}.`;
  zip2.value = v;
});

// Quote calculator
const prices = {
  koivu: 12.5,   // per unit (demo)
  seka: 10.0,
  sytyke: 6.0
};

function deliveryBase(kind){
  if (kind === "nouto") return 0;
  if (kind === "piha") return 10;
  if (kind === "pino") return 22;
  return 0;
}

const wood = document.getElementById("wood");
const qty = document.getElementById("qty");
const delivery = document.getElementById("delivery");
const calc = document.getElementById("calc");

const sItem = document.getElementById("sItem");
const sUnit = document.getElementById("sUnit");
const sQty = document.getElementById("sQty");
const sSub = document.getElementById("sSub");
const sDel = document.getElementById("sDel");
const sTotal = document.getElementById("sTotal");
const explain = document.getElementById("explain");

calc.addEventListener("click", () => {
  const w = wood.value;
  const q = Math.max(1, parseInt(qty.value || "1", 10));
  const d = delivery.value;
  const z = (zip2.value || "").trim();

  const unit = prices[w] ?? 10;
  const sub = unit * q;

  const base = deliveryBase(d);
  const fee = zipFee(z);
  const zipPart = (d === "nouto") ? 0 : (fee ?? 14); // default demo fee if zip missing

  const del = (d === "nouto") ? 0 : (base + zipPart);
  const total = sub + del;

  const names = { koivu:"Koivuklapi", seka:"Sekaklapi", sytyke:"Sytykkeet" };
  const delNames = { nouto:"Nouto", piha:"Toimitus pihalle", pino:"Toimitus + pinoaminen" };

  sItem.textContent = names[w] || "—";
  sUnit.textContent = `€${unit.toFixed(2)}`;
  sQty.textContent = `${q} kpl`;
  sSub.textContent = `€${sub.toFixed(2)}`;
  sDel.textContent = `€${del.toFixed(2)} (${delNames[d] || "—"})`;
  sTotal.textContent = `€${total.toFixed(2)}`;

  explain.textContent =
    `Erittely (demo): tuotteet €${sub.toFixed(2)} + toimitus €${del.toFixed(2)}`
    + (d !== "nouto" ? ` (perus €${base} + alue €${zipPart})` : "")
    + `. Syötä postinumero tarkempaan arvioon.`;
});

// Contact form validation (demo)
const form = document.getElementById("form");
const note = document.getElementById("formNote");

function setErr(name, msg) {
  const el = document.querySelector(`[data-err="${name}"]`);
  if (el) el.textContent = msg || "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  note.textContent = "";
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
  if (msg.length < 12) { setErr("msg","Kuvaa tilaus vähintään 12 merkillä."); ok = false; }

  if (!ok) return;

  form.reset();
  note.textContent = "Demo: tarjouspyyntö vastaanotettu (ei lähetä oikeasti).";
});
