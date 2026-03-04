const listEl = document.querySelector("#productList");
const pageTitle = document.querySelector("#pageTitle");
const pageHint = document.querySelector("#pageHint");

const toggleBtn = document.querySelector("#toggleFilters");
const filterOptions = document.querySelector("#filterOptions");
const filterButtons = document.querySelectorAll("#filterOptions button");
const searchInput = document.querySelector('input[type="search"]');

const params = new URLSearchParams(window.location.search);
const category = params.get("category");

const endpoint = "https://kea-alt-del.dk/t7/api/products";

let allData = [];
let activeGender = "all";
let searchQuery = "";

// ---------- helpers ----------
function norm(s) {
  return (s ?? "").toString().trim().toLowerCase();
}

function setDropdown(open) {
  // virker uanset om du bruger hidden eller class
  filterOptions.hidden = !open;
  filterOptions.classList.toggle("active", open);
  toggleBtn?.setAttribute("aria-expanded", String(open));
}

function isDropdownOpen() {
  return !filterOptions.hidden || filterOptions.classList.contains("active");
}

// ---------- dropdown behavior ----------
if (toggleBtn && filterOptions) {
  // start lukket (så “Alle filtre” faktisk gør noget)
  setDropdown(false);

  toggleBtn.addEventListener("click", () => {
    setDropdown(!isDropdownOpen());
  });

  // luk ved klik udenfor
  document.addEventListener("click", (e) => {
    const insideFilters = e.target.closest(".filters");
    if (!insideFilters && isDropdownOpen()) setDropdown(false);
  });

  // luk ved ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isDropdownOpen()) setDropdown(false);
  });
}

// ---------- data ----------
function getData() {
  const url = category
    ? `${endpoint}?category=${encodeURIComponent(category)}&limit=30`
    : `${endpoint}?limit=30`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      allData = data;
      updateHeader(allData.length);
      applyFilters(); // render med aktivt filter + search
    });
}

// ---------- filtering ----------
function applyFilters() {
  const q = norm(searchQuery);

  const filtered = allData.filter((p) => {
    // gender filter
    const gender = norm(p.gender); // API: "Men" / "Women" / "Unisex"
    const passGender = activeGender === "all" ? true : gender === activeGender;

    // search filter
    const name = norm(p.productdisplayname);
    const brand = norm(p.brandname);
    const type = norm(p.articletype);
    const passSearch =
      !q || name.includes(q) || brand.includes(q) || type.includes(q);

    return passGender && passSearch;
  });

  showProducts(filtered);

  // hint tekst
  if (activeGender === "all") {
    pageHint.textContent = category
      ? `${filtered.length} produkter i kategorien`
      : `${filtered.length} produkter`;
  } else {
    const label =
      activeGender === "men"
        ? "Men"
        : activeGender === "women"
          ? "Women"
          : "Unisex";

    pageHint.textContent = category
      ? `${filtered.length} produkter (${label})`
      : `${filtered.length} produkter (${label})`;
  }
}

// klik på filter-knapper
filterButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // læser knaptekst: All / Unisex / Women / Men
    const valgt = norm(e.target.textContent);

    // gem aktivt gender i samme format som API (lowercase)
    activeGender = valgt === "all" ? "all" : valgt; // "men" / "women" / "unisex"

    // active styling (hvis du bruger det i CSS)
    filterButtons.forEach((b) => b.classList.remove("is-active"));
    e.target.classList.add("is-active");

    applyFilters();

    // luk dropdown efter valg (Zalando-ish)
    setDropdown(false);
  });
});

// search input i headeren
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    applyFilters();
  });
}

// ---------- header ----------
function updateHeader(count) {
  pageTitle.textContent = category ? category.toUpperCase() : "PRODUKTER";
  pageHint.textContent = category
    ? `${count} produkter i kategorien`
    : `${count} produkter`;
}

// ---------- render ----------
function showProducts(products) {
  listEl.innerHTML = "";

  products.forEach((p) => {
    const imageUrl = `https://kea-alt-del.dk/t7/images/webp/640/${p.id}.webp`;

    listEl.innerHTML += `
      <a class="product-card ${p.soldout ? "soldOut" : ""}" href="product.html?id=${p.id}">
        <div class="badges">
          ${p.discount ? `<span class="badge sale">-${p.discount}%</span>` : ""}
          ${p.soldout ? `<span class="badge sold">UDSOLGT</span>` : ""}
        </div>

        <div class="product-media">
          <img src="${imageUrl}" alt="${p.productdisplayname}" loading="lazy" />
        </div>

        <div class="product-body">
          <h3 class="product-name">${p.productdisplayname}</h3>
          <p class="product-meta">${p.brandname} • ${p.articletype}</p>

          <div class="price-row">
            <span class="price">DKK ${p.price}</span>
          </div>

          <span class="btn primary">${p.soldout ? "Udsolgt" : "Se produkt"}</span>
        </div>
      </a>
    `;
  });
}

getData();
