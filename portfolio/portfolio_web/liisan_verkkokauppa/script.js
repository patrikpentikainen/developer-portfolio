// ---- Data (demo products) ----
const products = [
  { id: "muki", name: "Kahvimuki 'Liisa'", price: 12.90, cat: "koti", tags: ["koti"] },
  { id: "t-paita", name: "T-paita 'Minimal'", price: 19.90, cat: "asusteet", tags: ["asusteet"] },
  { id: "kangaskassi", name: "Kangaskassi", price: 9.90, cat: "asusteet", tags: ["asusteet"] },
  { id: "muistio", name: "Muistio A5", price: 6.50, cat: "toimisto", tags: ["toimisto"] },
  { id: "kynat", name: "Kynäsetti (3 kpl)", price: 7.90, cat: "toimisto", tags: ["toimisto"] },
  { id: "kynttila", name: "Tuoksukynttilä", price: 14.90, cat: "koti", tags: ["koti"] },
  { id: "vesipullo", name: "Vesipullo", price: 16.90, cat: "asusteet", tags: ["asusteet"] },
  { id: "hiirimatto", name: "Hiirimatto", price: 11.90, cat: "toimisto", tags: ["toimisto"] },
];

const fmt = (n) => `${n.toFixed(2)}€`;

// ---- State ----
let activeCat = "all";
let searchTerm = "";
let coupon = { code: "", discountRate: 0 }; // 0.10 for LIISA10
// cart: { [id]: qty }
const cart = {};

// ---- Elements ----
const yearEl = document.getElementById("year");
const gridEl = document.getElementById("productGrid");
const gridNote = document.getElementById("gridNote");

const cartCountEl = document.getElementById("cartCount");
const openCartBtn = document.getElementById("openCart");
const drawer = document.getElementById("drawer");
const cartItemsEl = document.getElementById("cartItems");

const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartShippingEl = document.getElementById("cartShipping");
const cartTotalEl = document.getElementById("cartTotal");

const sumSubtotalEl = document.getElementById("sumSubtotal");
const sumDiscountEl = document.getElementById("sumDiscount");
const sumShippingEl = document.getElementById("sumShipping");
const sumTotalEl = document.getElementById("sumTotal");

const couponInput = document.getElementById("couponInput");
const applyCouponBtn = document.getElementById("applyCoupon");
const couponNote = document.getElementById("couponNote");

const fakePay = document.getElementById("fakePay");
const payNote = document.getElementById("payNote");

document.getElementById("scrollProducts").addEventListener("click", () => {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
});

// ---- Init ----
yearEl.textContent = String(new Date().getFullYear());

// ---- Helpers ----
function cartCount() {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

function subtotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find(x => x.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);
}

function discountAmount(sub) {
  return coupon.discountRate > 0 ? sub * coupon.discountRate : 0;
}

function shippingCost(sub) {
  // Demo: 4.90€, free over 60€
  return sub >= 60 ? 0 : (sub > 0 ? 4.90 : 0);
}

function totals() {
  const sub = subtotal();
  const disc = discountAmount(sub);
  const ship = shippingCost(sub - disc);
  const total = Math.max(0, (sub - disc) + ship);
  return { sub, disc, ship, total };
}

function setDrawer(open) {
  if (open) {
    drawer.classList.add("show");
    drawer.setAttribute("aria-hidden", "false");
  } else {
    drawer.classList.remove("show");
    drawer.setAttribute("aria-hidden", "true");
  }
}

function updateBadges() {
  cartCountEl.textContent = String(cartCount());
}

// ---- Rendering ----
function renderGrid() {
  const filtered = products.filter((p) => {
    const catOk = activeCat === "all" ? true : p.cat === activeCat;
    const q = searchTerm.trim().toLowerCase();
    const searchOk = q ? p.name.toLowerCase().includes(q) : true;
    return catOk && searchOk;
  });

  gridEl.innerHTML = filtered.map((p) => {
    return `
      <article class="card" data-id="${p.id}">
        <div class="card__img" aria-hidden="true"></div>
        <div class="card__body">
          <div class="card__top">
            <h3>${p.name}</h3>
            <span class="price">${fmt(p.price)}</span>
          </div>
          <p class="muted">Demo-tuote. Lisää koriin ja testaa ostoskoria.</p>
          <div class="tagrow">
            <span class="tag">${p.cat}</span>
          </div>
          <div class="card__actions">
            <input class="qty" type="number" min="1" value="1" aria-label="Määrä" />
            <button class="btn btn--small add">Lisää</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  gridNote.textContent = filtered.length
    ? `Näytetään ${filtered.length} tuotetta.`
    : "Ei tuloksia — kokeile eri hakusanaa tai kategoriaa.";

  // bind add buttons
  gridEl.querySelectorAll(".card").forEach((card) => {
    const id = card.getAttribute("data-id");
    const addBtn = card.querySelector(".add");
    const qtyEl = card.querySelector(".qty");
    addBtn.addEventListener("click", () => {
      const qty = Math.max(1, parseInt(qtyEl.value || "1", 10));
      cart[id] = (cart[id] || 0) + qty;
      updateUI();
      setDrawer(true);
    });
  });
}

function renderCart() {
  const ids = Object.keys(cart);
  if (ids.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="item">
        <strong>Kori on tyhjä</strong>
        <span class="muted">Lisää tuotteita ja palaa tänne.</span>
      </div>
    `;
    return;
  }

  cartItemsEl.innerHTML = ids.map((id) => {
    const p = products.find(x => x.id === id);
    const qty = cart[id];
    const line = (p ? p.price : 0) * qty;

    return `
      <div class="item" data-id="${id}">
        <div class="item__top">
          <div>
            <strong>${p ? p.name : id}</strong>
            <span>${fmt(p ? p.price : 0)} • Rivisumma ${fmt(line)}</span>
          </div>
          <button class="remove" data-remove="true">Poista</button>
        </div>

        <div class="item__controls">
          <div class="stepper">
            <button class="stepbtn" data-step="-1" aria-label="Vähennä">−</button>
            <strong aria-label="Määrä">${qty}</strong>
            <button class="stepbtn" data-step="1" aria-label="Lisää">+</button>
          </div>
          <span class="tag">${p ? p.cat : ""}</span>
        </div>
      </div>
    `;
  }).join("");

  // bind controls
  cartItemsEl.querySelectorAll(".item").forEach((row) => {
    const id = row.getAttribute("data-id");
    row.querySelectorAll("[data-step]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const step = parseInt(btn.getAttribute("data-step"), 10);
        cart[id] = Math.max(0, (cart[id] || 0) + step);
        if (cart[id] === 0) delete cart[id];
        updateUI();
      });
    });

    const removeBtn = row.querySelector("[data-remove='true']");
    removeBtn.addEventListener("click", () => {
      delete cart[id];
      updateUI();
    });
  });
}

function renderSums() {
  const { sub, disc, ship, total } = totals();

  cartSubtotalEl.textContent = fmt(sub);
  cartShippingEl.textContent = fmt(ship);
  cartTotalEl.textContent = fmt(total);

  sumSubtotalEl.textContent = fmt(sub);
  sumDiscountEl.textContent = fmt(disc);
  sumShippingEl.textContent = fmt(ship);
  sumTotalEl.textContent = fmt(total);
}

function updateUI() {
  updateBadges();
  renderCart();
  renderSums();
}

// ---- Events ----
openCartBtn.addEventListener("click", () => setDrawer(true));

drawer.addEventListener("click", (e) => {
  const t = e.target;
  if (t && t.getAttribute && t.getAttribute("data-close") === "true") {
    setDrawer(false);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && drawer.classList.contains("show")) setDrawer(false);
});

document.getElementById("toCheckout").addEventListener("click", () => {
  setDrawer(false);
  document.getElementById("checkout").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("clearCart").addEventListener("click", () => {
  Object.keys(cart).forEach(k => delete cart[k]);
  coupon = { code: "", discountRate: 0 };
  couponInput.value = "";
  couponNote.textContent = "";
  payNote.textContent = "";
  updateUI();
});

document.getElementById("search").addEventListener("input", (e) => {
  searchTerm = e.target.value || "";
  renderGrid();
});

document.querySelectorAll(".chip").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    activeCat = btn.getAttribute("data-cat") || "all";
    renderGrid();
  });
});

applyCouponBtn.addEventListener("click", () => {
  const code = String(couponInput.value || "").trim().toUpperCase();
  payNote.textContent = "";

  if (!code) {
    coupon = { code: "", discountRate: 0 };
    couponNote.textContent = "Kuponki poistettu.";
    updateUI();
    return;
  }

  if (code === "LIISA10") {
    coupon = { code, discountRate: 0.10 };
    couponNote.textContent = "Kuponki käytössä: −10% (LIISA10).";
    updateUI();
    return;
  }

  coupon = { code: "", discountRate: 0 };
  couponNote.textContent = "Tuntematon kuponki (demo). Kokeile LIISA10.";
  updateUI();
});

fakePay.addEventListener("click", () => {
  const { total } = totals();
  if (total <= 0) {
    payNote.textContent = "Lisää tuotteita koriin ennen maksua (demo).";
    return;
  }
  payNote.textContent = `Demo: siirryttäisiin maksupalveluun (${fmt(total)}).`;
});

// ---- First render ----
renderGrid();
updateUI();
