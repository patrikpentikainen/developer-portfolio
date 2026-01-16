// --- Config (monorepo Pages) ---
const GITHUB_USER = "patrikpentikainen";
const REPO_NAME = "developer-portfolio";

// Pages base for this folder (portfolio_web hub lives here)
const PAGES_BASE = `https://${GITHUB_USER}.github.io/${REPO_NAME}/portfolio/portfolio_web/`;

// GitHub base to the folder tree (handy for source browsing)
const GH_BASE = `https://github.com/${GITHUB_USER}/${REPO_NAME}/tree/main/portfolio/portfolio_web/`;

// Year
document.getElementById("year").textContent = String(new Date().getFullYear());

const demos = [
  {
    name: "Heinä Heikki",
    folder: "heina_heikki",
    desc: "Perussivu + selkeä rakenne. Hyvä lähtöpiste.",
    tags: ["business", "service", "light"]
  },
  {
    name: "Kivi Kalle",
    folder: "kivi_kalle",
    desc: "Kiveys/urakointi-henkinen demo (UI + rakenne).",
    tags: ["business", "service", "light"]
  },
  {
    name: "Konemiehen & Pojan Vaihtokone",
    folder: "konemiehen_ja_pojan_vaihtokone",
    desc: "Kone-/vaihtokonepalvelun demo. Sisältöosioita ja CTA.",
    tags: ["business", "service"]
  },
  {
    name: "Kukallinen Leena",
    folder: "kukallinen_leena",
    desc: "Kukkakauppa / floristi -tyyli (visuaalinen).",
    tags: ["creative", "business", "light"]
  },
  {
    name: "Lauran Pomppulinna",
    folder: "lauran_pomppulinna",
    desc: "Vauhdikas teema + selkeä varaus/CTA (demo).",
    tags: ["creative", "service", "light"]
  },
  {
    name: "Liisan verkkokauppa",
    folder: "liisan_verkkokauppa",
    desc: "Verkkokauppamainen rakenne (tuotteet/ostoskori demo).",
    tags: ["shop", "business"]
  },
  {
    name: "Metalli Mikko",
    folder: "metalli_mikko",
    desc: "Konepaja/metal -henkinen demo + laskuri (demo).",
    tags: ["business", "service", "calculator", "dark"]
  },
  {
    name: "Unelman kirppislöytö",
    folder: "unelman_kirppisloyto",
    desc: "Kirppis/second-hand -fiilis (demo).",
    tags: ["creative", "shop", "light"]
  },
  {
    name: "Veikon polttopuut",
    folder: "veikon_polttopuut",
    desc: "Rustic/vaalea teema + hintalaskuri + lomake (demo).",
    tags: ["business", "service", "calculator", "light"]
  },
  {
    name: "Vesan venekeskus",
    folder: "vesan_venekeskus",
    desc: "Vaalea meriteema + hinnasto + varauslaskuri (demo).",
    tags: ["business", "service", "calculator", "light"]
  }
];

const grid = document.getElementById("grid");
const empty = document.getElementById("empty");
const q = document.getElementById("q");
const tag = document.getElementById("tag");
const reset = document.getElementById("reset");
const count = document.getElementById("count");
const total = document.getElementById("total");

total.textContent = String(demos.length);

function pill(t) {
  return `<span class="pill">${t}</span>`;
}

function pagesDemoUrl(folder) {
  // Always point to the correct GitHub Pages location
  return `${PAGES_BASE}${folder}/`;
}

function pagesReadmeUrl(folder) {
  // GitHub Pages serves README.md as plain text (fine), but we can also link to GitHub view
  // If you prefer GitHub view only, use githubReadmeUrl() instead.
  return `${PAGES_BASE}${folder}/README.md`;
}

function githubFolderUrl(folder) {
  return `${GH_BASE}${folder}`;
}

function githubReadmeUrl(folder) {
  return `https://github.com/${GITHUB_USER}/${REPO_NAME}/blob/main/portfolio/portfolio_web/${folder}/README.md`;
}

function card(d) {
  const pills = d.tags.map(pill).join("");

  const demoHref = pagesDemoUrl(d.folder);
  const readmeHref = githubReadmeUrl(d.folder); // nicer reading experience than raw md on Pages
  const sourceHref = githubFolderUrl(d.folder);

  return `
    <article class="card">
      <div class="card__top">
        <h3>${d.name}</h3>
        <div class="pills" aria-label="tagit">${pills}</div>
      </div>
      <p class="desc">${d.desc}</p>
      <div class="actions">
        <a class="open" href="${demoHref}" target="_blank" rel="noreferrer">Avaa demo</a>
        <a class="link" href="${readmeHref}" target="_blank" rel="noreferrer">README</a>
        <a class="link" href="${sourceHref}" target="_blank" rel="noreferrer">Source</a>
      </div>
    </article>
  `;
}

function apply() {
  const query = (q.value || "").trim().toLowerCase();
  const t = tag.value;

  const filtered = demos.filter(d => {
    const matchesTag = (t === "all") ? true : d.tags.includes(t);
    const hay = (d.name + " " + d.folder + " " + d.desc + " " + d.tags.join(" ")).toLowerCase();
    const matchesQuery = query.length === 0 ? true : hay.includes(query);
    return matchesTag && matchesQuery;
  });

  grid.innerHTML = filtered.map(card).join("");
  count.textContent = String(filtered.length);
  empty.hidden = filtered.length !== 0;
}

q.addEventListener("input", apply);
tag.addEventListener("change", apply);

reset.addEventListener("click", () => {
  q.value = "";
  tag.value = "all";
  apply();
});

apply();
