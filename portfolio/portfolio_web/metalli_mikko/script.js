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

// Services (data + filtering)
const services = [
  {
    key: "hitsaus",
    title: "Hitsauspalvelut",
    pill: "hitsaus",
    bullets: ["MIG/MAG/TIG (demo)", "Oikaisu ja viimeistely", "Pienet ja keskisuuret sarjat"]
  },
  {
    key: "koneistus",
    title: "CNC-koneistus",
    pill: "koneistus",
    bullets: ["Sorvaus ja jyrsintä (demo)", "Sovitukset ja holkit", "Piirustusten mukaan"]
  },
  {
    key: "rakenne",
    title: "Teräsrakenteet",
    pill: "rakenne",
    bullets: ["Kaiteet, rungot, kehikot", "Piste- ja kokoonpanotyöt", "Pintakäsittely-yhteistyö"]
  },
  {
    key: "asennus",
    title: "Asennus kohteessa",
    pill: "asennus",
    bullets: ["Mittaus + asennus", "Kiinnitykset ja sovitus", "Työmaakäynnit sopimuksen mukaan"]
  },
  {
    key: "hitsaus",
    title: "Korjaushitsaus",
    pill: "hitsaus",
    bullets: ["Murtumat ja vahvistukset", "Huoltotyöt", "Nopeat pienkorjaukset"]
  },
  {
    key: "koneistus",
    title: "Prototyypit",
    pill: "koneistus",
    bullets: ["Yksittäiskappaleet", "Nopea iterointi", "Materiaalivaihtoehdot (demo)"]
  }
];

const serviceGrid = document.getElementById("serviceGrid");
const filterButtons = Array.from(document.querySelectorAll(".f"));
let active = "all";

function renderLeavingOnly(key) {
  const filtered = services.filter(s => key === "all" ? true : s.key === key);

  serviceGrid.innerHTML = filtered.map(s => `
    <article class="card">
      <div class="card__top">
        <h3>${s.title}</h3>
        <span class="pill">${s.pill}</span>
      </div>
      <ul>
        ${s.bullets.map(b => `<li>${b}</li>`).join("")}
      </ul>
    </article>
  `).join("");
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    active = btn.getAttribute("data-filter") || "all";
    renderLeavingOnly(active);
  });
});

renderLeavingOnly(active);

// Quick tips presets
const callout = document.getElementById("callout");
document.querySelectorAll("[data-preset]").forEach(b => {
  b.addEventListener("click", () => {
    const type = b.getAttribute("data-preset");
    const tips = {
      hitsaus: "Hitsaus: kerro materiaali, paksuus, sauman pituus ja mahdollinen pintakäsittely. Liitä kuvat/mitat (demo).",
      koneistus: "Koneistus: mitat, toleranssit, materiaali ja määrä vaikuttavat eniten. Jos on piirustus, liitä se (demo).",
      asennus: "Asennus: kohteen sijainti, kiinnityspinnat ja aikataulu. Mittauskäynti voi nopeuttaa (demo)."
    };
    callout.textContent = tips[type] || "Valitse työtyyppi nähdäksesi vinkkejä.";
  });
});

// Quote calculator
const fmt = (n) => `${n.toFixed(2)} €`;

const rates = {
  hitsaus: 65,
  koneistus: 78,
  rakenne: 70,
  asennus: 72
};

const qType = document.getElementById("qType");
const qHours = document.getElementById("qHours");
const qMaterial = document.getElementById("qMaterial");
const qRush = document.getElementById("qRush");
const calc = document.getElementById("calc");

const sRate = document.getElementById("sRate");
const sWork = document.getElementById("sWork");
const sMat = document.getElementById("sMat");
const sRush = document.getElementById("sRush");
const sTotal = document.getElementById("sTotal");
const explain = document.getElementById("explain");

calc.addEventListener("click", () => {
  const type = qType.value;
  const hours = Math.max(1, parseFloat(qHours.value || "1"));
  const mat = Math.max(0, parseFloat(qMaterial.value || "0"));
  const rush = parseFloat(qRush.value || "0");
  const rate = rates[type] ?? 70;

  const work = hours * rate;
  const base = work + mat;
  const rushFee = base * rush;
  const total = base + rushFee;

  sRate.textContent = `${fmt(rate)}/h`;
  sWork.textContent = fmt(work);
  sMat.textContent = fmt(mat);
  sRush.textContent = rush > 0 ? `+${Math.round(rush * 100)}% (${fmt(rushFee)})` : "0%";
  sTotal.textContent = fmt(total);

  const notes = {
    hitsaus: "Hintaan vaikuttaa erityisesti sauman pituus, valmistelut (viisteet), oikaisu ja viimeistely.",
    koneistus: "Hintaan vaikuttaa toleranssit, asetusaika, työstömäärä ja kappalemäärä.",
    rakenne: "Hintaan vaikuttaa mittatarkkuus, liitokset, pintakäsittely ja asennusvalmius.",
    asennus: "Hintaan vaikuttaa kohteen olosuhteet, kiinnitykset, matkakulut ja työaika."
  };

  explain.textContent =
    `Erittely: ${hours} h × ${rate} €/h + materiaalit ${fmt(mat)}`
    + (rush > 0 ? ` + kiirelisä ${Math.round(rush * 100)}%` : "")
    + `. ${notes[type] || ""} (Demo)`;
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
  setErr("name", ""); setErr("email", ""); setErr("phone", ""); setErr("msg", "");

  const fd = new FormData(form);
  const name = String(fd.get("name") || "").trim();
  const email = String(fd.get("email") || "").trim();
  const phone = String(fd.get("phone") || "").trim();
  const msg = String(fd.get("msg") || "").trim();

  let ok = true;
  if (name.length < 2) { setErr("name", "Kirjoita vähintään 2 merkkiä."); ok = false; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { setErr("email", "Tarkista sähköposti."); ok = false; }
  if (phone.length < 6) { setErr("phone", "Kirjoita puhelinnumero."); ok = false; }
  if (msg.length < 12) { setErr("msg", "Kuvaa työ vähintään 12 merkillä."); ok = false; }

  if (!ok) return;

  form.reset();
  note.textContent = "Demo: tarjouspyyntö vastaanotettu (ei lähetä oikeasti).";
});
