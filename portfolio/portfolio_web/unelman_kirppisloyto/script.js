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

// Data
const items = [
  { id:"takki", title:"Villakangastakki", cat:"vaatteet", price:18, note:"Hyvä istuvuus, siisti kunto (demo)." },
  { id:"lamppu", title:"Retro-pöytälamppu", cat:"sisustus", price:12, note:"Toimii, lämmin valo (demo)." },
  { id:"muki", title:"Arabia-tyylinen muki", cat:"sisustus", price:6, note:"Pieni käytön jälki (demo)." },
  { id:"kirja", title:"Klassikkoromaani", cat:"kirjat", price:4, note:"Kansissa patinaa (demo)." },
  { id:"kaiutin", title:"Bluetooth-kaiutin", cat:"elektroniikka", price:15, note:"Testattu, ok basso (demo)." },
  { id:"huivi", title:"Kuosihuivi", cat:"vaatteet", price:5, note:"Kevyt ja värikäs (demo)." },
  { id:"hylly", title:"Pieni seinähylly", cat:"sisustus", price:9, note:"Mukana kiinnikkeet (demo)." },
  { id:"peli", title:"Pelikonsolin ohjain", cat:"elektroniikka", price:20, note:"Tatit kunnossa (demo)." },
];

const grid = document.getElementById("grid");
const gridNote = document.getElementById("gridNote");
const search = document.getElementById("search");
const chips = Array.from(document.querySelectorAll(".chip"));

const wishKey = "uk_wishlist_v1";
let activeCat = "all";
let query = "";

// Wishlist (localStorage)
function loadWish(){
  try { return JSON.parse(localStorage.getItem(wishKey) || "[]"); }
  catch { return []; }
}
function saveWish(arr){
  localStorage.setItem(wishKey, JSON.stringify(arr));
}
let wish = loadWish();

const wishCount = document.getElementById("wishCount");
const wishList = document.getElementById("wishList");
const wishNote = document.getElementById("wishNote");
document.getElementById("clearWish").addEventListener("click", () => {
  wish = [];
  saveWish(wish);
  renderWish("Muistilista tyhjennetty.");
});

function setWishCount(){
  wishCount.textContent = String(wish.length);
}

function renderGrid(){
  const q = query.trim().toLowerCase();
  const filtered = items.filter(it => {
    const catOk = activeCat === "all" ? true : it.cat === activeCat;
    const searchOk = q ? it.title.toLowerCase().includes(q) : true;
    return catOk && searchOk;
  });

  grid.innerHTML = filtered.map(it => `
    <article class="card">
      <div class="card__top">
        <h3>${it.title}</h3>
        <span class="tag">${it.cat}</span>
      </div>
      <div class="card__body">
        <div class="priceRow">
          <span class="price">€${it.price}</span>
          <span class="note">${it.note}</span>
        </div>
        <div class="card__actions">
          <button class="smallBtn add" data-add="${it.id}">Lisää muistilistaan</button>
          <button class="smallBtn" data-jump="#muistilista">Näytä lista</button>
        </div>
      </div>
    </article>
  `).join("");

  gridNote.textContent = filtered.length
    ? `Näytetään ${filtered.length} löytöä.`
    : "Ei tuloksia — kokeile eri hakusanaa tai kategoriaa.";

  grid.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-add");
      if (!wish.includes(id)) {
        wish.push(id);
        saveWish(wish);
        renderWish("Lisätty muistilistaan.");
      } else {
        renderWish("Tämä löytyi jo muistilistasta.");
      }
    });
  });

  grid.querySelectorAll("[data-jump]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-jump");
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function renderWish(msg=""){
  setWishCount();
  wishNote.textContent = msg;

  if (wish.length === 0) {
    wishList.innerHTML = `
      <div class="wishItem">
        <div>
          <strong>Ei vielä muistilistalla</strong>
          <span>Lisää löytöjä “Lisää muistilistaan” -napilla.</span>
        </div>
      </div>
    `;
    return;
  }

  const mapped = wish
    .map(id => items.find(x => x.id === id))
    .filter(Boolean);

  wishList.innerHTML = mapped.map(it => `
    <div class="wishItem">
      <div>
        <strong>${it.title}</strong>
        <span>${it.cat} • €${it.price}</span>
      </div>
      <button class="x" aria-label="Poista" data-del="${it.id}">Poista</button>
    </div>
  `).join("");

  wishList.querySelectorAll("[data-del]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-del");
      wish = wish.filter(x => x !== id);
      saveWish(wish);
      renderWish("Poistettu.");
    });
  });
}

// Events
search.addEventListener("input", (e) => {
  query = e.target.value || "";
  renderGrid();
});

chips.forEach(ch => {
  ch.addEventListener("click", () => {
    chips.forEach(x => x.classList.remove("active"));
    ch.classList.add("active");
    activeCat = ch.getAttribute("data-cat") || "all";
    renderGrid();
  });
});

// First render
renderGrid();
renderWish();
