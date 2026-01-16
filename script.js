// ✅ GitHub user (Pages domain)
const GITHUB_USER = "patrikpentikainen";

// ✅ Monorepo name (this repository)
const REPO_NAME = "developer-portfolio";

// Projektit (monorepo): folder = kansion nimi polussa portfolio/portfolio_web/<folder>/
const projects = [
  {
    name: "Heinä Heikki",
    folder: "heina_heikki",
    live: "",
    desc: "Kevyt ja selkeä landing page -demo. Fokus typografiassa, layoutissa ja responsiivisuudessa.",
    tags: ["Landing", "HTML", "CSS", "Responsive"]
  },
  {
    name: "Kivi Kalle",
    folder: "kivi_kalle",
    live: "",
    desc: "Visuaalisempi yrityssivun malli. Värit, osiot ja CTA-rakenne korostuvat.",
    tags: ["UI", "Layout", "Branding", "CSS"]
  },
  {
    name: "Konemiehen & Pojan Vaihtokone",
    folder: "konemiehen_ja_pojan_vaihtokone",
    live: "",
    desc: "Teollisuushenkinen yrityssivusto. Rakenteinen sisältö ja informatiivinen layout.",
    tags: ["Business", "HTML", "CSS", "Structure"]
  },
  {
    name: "Kukallinen Leena",
    folder: "kukallinen_leena",
    live: "",
    desc: "Pehmeä ja visuaalinen pienyrittäjäsivusto. Väripaletti ja typografia keskiössä.",
    tags: ["Small business", "Design", "UI", "CSS"]
  },
  {
    name: "Lauran Pomppulinna",
    folder: "lauran_pomppulinna",
    live: "",
    desc: "Leikkisä tapahtuma-/palvelusivu. Asiakaslähtöinen rakenne ja selkeät osiot.",
    tags: ["Marketing", "Landing", "Fun UI", "CSS"]
  },
  {
    name: "Liisan verkkokauppa",
    folder: "liisan_verkkokauppa",
    live: "",
    desc: "Verkkokaupan etusivumalli: tuotekortit, rakenne ja ostopolun elementit.",
    tags: ["E-commerce", "UI", "Layout", "HTML"]
  },
  {
    name: "Metalli Mikko",
    folder: "metalli_mikko",
    live: "",
    desc: "Raskaan alan yrityssivun demo. Selkeä informaatio ja ammattimainen ulkoasu.",
    tags: ["Industrial", "Corporate", "HTML", "CSS"]
  },
  {
    name: "Unelman kirppislöytö",
    folder: "unelman_kirppisloyto",
    live: "",
    desc: "Harraste- ja yhteisöpohjainen sivu. Korttipohjainen sisältörakenne.",
    tags: ["Community", "Cards", "UI", "CSS"]
  },
  {
    name: "Veikon polttopuut",
    folder: "veikon_polttopuut",
    live: "",
    desc: "Paikallisen palvelun myyntisivu. Nopea, selkeä ja responsiivinen rakenne.",
    tags: ["Local business", "Landing", "HTML", "Responsive"]
  },
  {
    name: "Vesan venekeskus",
    folder: "vesan_venekeskus",
    live: "",
    desc: "Harraste- ja palvelusivun yhdistelmä. Kategoriat ja navigaatiorakenne.",
    tags: ["Hobby", "Business", "UI", "HTML"]
  }
];

// Kerää tagit filttereihin
const allTags = Array.from(new Set(projects.flatMap(p => p.tags))).sort((a,b)=>a.localeCompare(b));
const filtersEl = document.getElementById("filters");
const gridEl = document.getElementById("grid");
const emptyEl = document.getElementById("empty");
const searchEl = document.getElementById("search");
const resetBtn = document.getElementById("resetBtn");
const visibleCountEl = document.getElementById("visibleCount");
const totalCountEl = document.getElementById("totalCount");

totalCountEl.textContent = projects.length;

let activeTag = "All";

function chip(label){
  const el = document.createElement("div");
  el.className = "chip" + (label === "All" ? " active" : "");
  el.textContent = label;
  el.addEventListener("click", () => {
    activeTag = label;
    [...filtersEl.children].forEach(c => c.classList.remove("active"));
    el.classList.add("active");
    render();
  });
  return el;
}

// Render filter chips
filtersEl.appendChild(chip("All"));
allTags.forEach(t => filtersEl.appendChild(chip(t)));

// Repo link (monorepo): open the folder in GitHub
function repoUrl(folder){
  // Link directly to the folder in the GitHub repository
  return `https://github.com/${GITHUB_USER}/${REPO_NAME}/tree/main/portfolio/portfolio_web/${folder}`;
}

// Live link (GitHub Pages, monorepo): open the folder path
function liveUrl(p){
  // If a custom live URL is provided, use it. Otherwise, build a monorepo Pages path.
  return p.live && p.live.trim()
    ? p.live.trim()
    : `https://${GITHUB_USER}.github.io/${REPO_NAME}/portfolio/portfolio_web/${p.folder}/`;
}

function matches(p, q){
  if(!q) return true;
  const hay = (p.name + " " + p.desc + " " + p.tags.join(" ")).toLowerCase();
  return hay.includes(q.toLowerCase());
}

function passesTag(p){
  if(activeTag === "All") return true;
  return p.tags.includes(activeTag);
}

function makeCard(p){
  const card = document.createElement("div");
  card.className = "card";

  const top = document.createElement("div");
  top.className = "card-top";

  const badge = document.createElement("div");
  badge.className = "badge";
  badge.innerHTML = `<span class="dot"></span> Demo`;
  top.appendChild(badge);

  const hint = document.createElement("div");
  hint.className = "badge";
  hint.textContent = p.tags[0] || "Project";
  top.appendChild(hint);

  const h = document.createElement("h3");
  h.className = "title";
  h.textContent = p.name;

  const d = document.createElement("p");
  d.className = "desc";
  d.textContent = p.desc;

  const tags = document.createElement("div");
  tags.className = "tags";
  p.tags.forEach(t=>{
    const tEl = document.createElement("span");
    tEl.className = "tag";
    tEl.textContent = t;
    tags.appendChild(tEl);
  });

  const links = document.createElement("div");
  links.className = "links";

  const liveA = document.createElement("a");
  liveA.className = "linkbtn";
  liveA.href = liveUrl(p);
  liveA.target = "_blank";
  liveA.rel = "noreferrer";
  liveA.textContent = "Live demo";

  const ghA = document.createElement("a");
  ghA.className = "linkbtn ghost";
  ghA.href = repoUrl(p.folder);
  ghA.target = "_blank";
  ghA.rel = "noreferrer";
  ghA.textContent = "GitHub";

  links.appendChild(liveA);
  links.appendChild(ghA);

  card.appendChild(top);
  card.appendChild(h);
  card.appendChild(d);
  card.appendChild(tags);
  card.appendChild(links);

  return card;
}

function render(){
  const q = searchEl.value.trim();
  gridEl.innerHTML = "";
  const visible = projects.filter(p => matches(p, q) && passesTag(p));
  visible.forEach(p => gridEl.appendChild(makeCard(p)));

  visibleCountEl.textContent = visible.length;
  emptyEl.style.display = visible.length ? "none" : "block";
}

searchEl.addEventListener("input", render);

resetBtn.addEventListener("click", ()=>{
  searchEl.value = "";
  activeTag = "All";
  [...filtersEl.children].forEach((c,i)=>c.classList.toggle("active", i===0));
  render();
});

document.getElementById("y").textContent = new Date().getFullYear();
render();
