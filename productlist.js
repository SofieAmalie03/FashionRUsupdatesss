const PRODUCTS_ENDPOINT = "https://kea-alt-del.dk/t7/api/products";
const IMG_BASE = "https://kea-alt-del.dk/t7/images/webp/640/";

const listEl = document.querySelector("#productList");
const pageTitle = document.querySelector("#pageTitle");
const pageHint = document.querySelector("#pageHint");

const toggleFiltersBtn = document.querySelector("#toggleFilters");
const filterOptions = document.querySelector("#filterOptions");
const filterButtons = document.querySelectorAll("#filterOptions button");

const toggleSortBtn = document.querySelector("#toggleSort");
const sortOptions = document.querySelector("#sortOptions");
const sortButtons = document.querySelectorAll("#sortOptions button");

const params = new URLSearchParams(window.location.search);
const category = params.get("category");

let allData = [];
let activeGender = "All";
let activeSort = "name-az";

init();

function init() {
  bindEvents();
  closeFilters();
  closeSort();
  getData();
}

function bindEvents() {
  toggleFiltersBtn?.addEventListener("click", toggleFilters);
  toggleSortBtn?.addEventListener("click", toggleSort);

  filterButtons.forEach((btn) => btn.addEventListener("click", onFilterClick));
  sortButtons.forEach((btn) => btn.addEventListener("click", onSortClick));

  document.addEventListener("click", () => {
    closeFilters();
    closeSort();
  });

  filterOptions?.addEventListener("click", (e) => e.stopPropagation());
  sortOptions?.addEventListener("click", (e) => e.stopPropagation());
}

function setExpanded(btn, isOpen) {
  btn?.setAttribute("aria-expanded", String(isOpen));
}

function closeFilters() {
  if (!filterOptions) return;
  filterOptions.hidden = true;
  setExpanded(toggleFiltersBtn, false);
}

function closeSort() {
  if (!sortOptions) return;
  sortOptions.hidden = true;
  setExpanded(toggleSortBtn, false);
}

function toggleFilters(e) {
  e?.stopPropagation();
  closeSort();

  const willOpen = filterOptions.hidden;
  filterOptions.hidden = !willOpen;
  setExpanded(toggleFiltersBtn, willOpen);
}

function toggleSort(e) {
  e?.stopPropagation();
  closeFilters();

  const willOpen = sortOptions.hidden;
  sortOptions.hidden = !willOpen;
  setExpanded(toggleSortBtn, willOpen);
}

function onFilterClick(e) {
  e.stopPropagation();
  activeGender = e.target.textContent.trim();

  setActiveButton(
    filterButtons,
    (btn) => btn.textContent.trim() === activeGender,
  );
  closeFilters();
  render();
}

function onSortClick(e) {
  e.stopPropagation();
  activeSort = e.target.dataset.sort;

  setActiveButton(sortButtons, (btn) => btn.dataset.sort === activeSort);
  closeSort();
  render();
}

function setActiveButton(buttons, predicate) {
  buttons.forEach((btn) => btn.classList.toggle("is-active", predicate(btn)));
}

function updateHeader(count) {
  pageTitle.textContent = category ? category : "Produkter";
  pageHint.textContent = category
    ? `${count} produkter i kategorien`
    : `${count} produkter`;
}

function getFilteredProducts() {
  if (activeGender === "All") return allData;
  return allData.filter((p) => p.gender === activeGender);
}

function sortProducts(list) {
  const arr = [...list];

  switch (activeSort) {
    case "price-asc":
      arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      break;

    case "price-desc":
      arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      break;

    case "name-za":
      arr.sort((a, b) =>
        (b.productdisplayname ?? "").localeCompare(
          a.productdisplayname ?? "",
          "da",
        ),
      );
      break;

    case "name-az":
    default:
      arr.sort((a, b) =>
        (a.productdisplayname ?? "").localeCompare(
          b.productdisplayname ?? "",
          "da",
        ),
      );
      break;
  }

  return arr;
}

function render() {
  const filtered = getFilteredProducts();
  const sorted = sortProducts(filtered);

  showProducts(sorted);

  const baseText = category
    ? `${sorted.length} produkter i kategorien`
    : `${sorted.length} produkter`;

  pageHint.textContent =
    activeGender === "All" ? baseText : `${baseText} (${activeGender})`;
}

function showProducts(products) {
  listEl.innerHTML = products.map(renderProductCard).join("");
}

function renderProductCard(p) {
  const imgUrl = productImageUrl(p);

  return `
    <a class="product-card ${p.soldout ? "soldOut" : ""}" href="product.html?id=${p.id}">
      <div class="badges">
        ${p.discount ? `<span class="badge sale">-${p.discount}%</span>` : ""}
        ${p.soldout ? `<span class="badge sold">UDSOLGT</span>` : ""}
      </div>

      <div class="product-media">
        <img src="${imgUrl}" alt="${escapeHtml(p.productdisplayname)}" loading="lazy" />
      </div>

      <div class="product-body">
        <h3 class="product-name">${escapeHtml(p.productdisplayname)}</h3>
        <p class="product-meta">${escapeHtml(p.brandname)} • ${escapeHtml(p.articletype)}</p>

        <div class="price-row">
          <span class="price">DKK ${p.price}</span>
        </div>

        <span class="btn primary">${p.soldout ? "Udsolgt" : "Se produkt"}</span>
      </div>
    </a>
  `;
}

function productImageUrl(p) {
  // FIX: brug p.image (ikke p.id.webp)
  if (p?.image) return `${IMG_BASE}${p.image}`;
  return `${IMG_BASE}${p?.id ?? 0}.webp`;
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function getData() {
  const url = category
    ? `${PRODUCTS_ENDPOINT}?category=${encodeURIComponent(category)}&limit=30`
    : `${PRODUCTS_ENDPOINT}?limit=30`;

  try {
    const res = await fetch(url);
    allData = await res.json();

    updateHeader(allData.length);

    setActiveButton(
      filterButtons,
      (btn) => btn.textContent.trim() === activeGender,
    );
    setActiveButton(sortButtons, (btn) => btn.dataset.sort === activeSort);

    render();
  } catch (err) {
    console.error(err);
    pageHint.textContent = "Kunne ikke hente produkter lige nu.";
  }
}
