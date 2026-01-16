// Footer year
document.getElementById("year").textContent = String(new Date().getFullYear());

// Filter logic
const filterBtns = Array.from(document.querySelectorAll(".filter"));
const bouquetCards = Array.from(document.querySelectorAll(".bouquet"));
const resultNote = document.getElementById("resultNote");

function applyFilter(tag) {
  let shown = 0;

  bouquetCards.forEach((card) => {
    const tags = (card.getAttribute("data-tags") || "").split(",").map(t => t.trim());
    const ok = tag === "all" ? true : tags.includes(tag);
    card.style.display = ok ? "" : "none";
    if (ok) shown++;
  });

  resultNote.textContent = tag === "all"
    ? `Näytetään kaikki kimput (${shown}).`
    : `Suodatin: ${tag} • Näytetään ${shown} kimppua.`;
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilter(btn.getAttribute("data-filter") || "all");
  });
});

applyFilter("all");

// Order buttons -> fill form field
const bouquetInput = document.getElementById("bouquetInput");
document.querySelectorAll("[data-order]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = btn.getAttribute("data-order") || "—";
    bouquetInput.value = val;
    document.getElementById("yhteys").scrollIntoView({ behavior: "smooth" });
  });
});

// Form validation (demo)
const form = document.getElementById("orderForm");
const note = document.getElementById("formNote");

function setErr(name, msg) {
  const el = document.querySelector(`[data-err="${name}"]`);
  if (el) el.textContent = msg || "";
}

form.addEventListener("submit", (e) => {
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
  bouquetInput.value = "—";
  note.textContent = "Demo: pyyntö vastaanotettu (ei lähetä oikeasti).";
});

// Lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const caption = document.getElementById("lightboxCaption");

const captions = {
  1: "Kausikimppu – pastelli & vihreä (demo)",
  2: "Pieni lahjakimppu – raikas (demo)",
  3: "Hääkimpun tyyli – elegantti (demo)",
  4: "Suruun – rauhallinen sävy (demo)",
  5: "Yritykselle – aula-asetelma (demo)",
  6: "Juhlaan – näyttävä kokonaisuus (demo)"
};

function openLightbox(id) {
  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");

  // Different gradients per image (simple but effective demo)
  const styles = {
    1: "radial-gradient(520px 300px at 30% 25%, rgba(231,182,200,.78), transparent 60%), radial-gradient(520px 300px at 80% 30%, rgba(217,213,255,.70), transparent 60%), linear-gradient(135deg, rgba(255,255,255,.88), rgba(207,238,226,.55))",
    2: "radial-gradient(520px 300px at 30% 25%, rgba(207,238,226,.80), transparent 60%), radial-gradient(520px 300px at 80% 30%, rgba(231,182,200,.62), transparent 60%), linear-gradient(135deg, rgba(255,255,255,.88), rgba(217,213,255,.55))",
    3: "radial-gradient(520px 300px at 30% 25%, rgba(217,213,255,.80), transparent 60%), radial-gradient(520px 300px at 80% 30%, rgba(231,182,200,.58), transparent 60%), linear-gradient(135deg, rgba(255,255,255,.88), rgba(207,238,226,.55))",
    4: "radial-gradient(520px 300px at 30% 25%, rgba(231,182,200,.64), transparent 60%), radial-gradient(520px 300px at 80% 30%, rgba(207,238,226,.72), transparent 60%), linear-gradient(135deg, rgba(255,255,255,.88), rgba(217,213,255,.55))",
    5: "radial-gradient(520px 300px at 30% 25%, rgba(207,238,226,.74), transparent 60%), radial-gradient(520px 300px at 80% 30%, rgba(217,213,255,.72), transparent 60%), linear-gradient(135deg, rgba(255,255,255,.88), rgba(231,182,200,.55))",
    6: "radial-gradient(520px 300px at 30% 25%, rgba(231,182,200,.78), transparent 60%), radial-gradient(520px 300px at 80% 30%, rgba(217,213,255,.66), transparent 60%), linear-gradient(135deg, rgba(255,255,255,.88), rgba(207,238,226,.55))"
  };

  lightboxImg.style.background = styles[id] || styles[1];
  caption.textContent = captions[id] || "—";
}

function closeLightbox() {
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
}

document.getElementById("gallery").addEventListener("click", (e) => {
  const btn = e.target.closest(".shot");
  if (!btn) return;
  const id = btn.getAttribute("data-shot");
  openLightbox(id);
});

lightbox.addEventListener("click", (e) => {
  const t = e.target;
  if (t && t.getAttribute && t.getAttribute("data-close") === "true") closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("show")) closeLightbox();
});
