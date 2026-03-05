const CATEGORY_ENDPOINT = "https://kea-alt-del.dk/t7/api/categories";
const PRODUCTS_ENDPOINT = "https://kea-alt-del.dk/t7/api/products";
const IMG_BASE = "https://kea-alt-del.dk/t7/images/webp/640/";

const categoryContainer = document.querySelector(".categoryList");
const newsGrid = document.querySelector("#newsGrid");

const NEWS_LIMIT = 4;

init();

async function init() {
  await getCategories();
  await initNews();
}

async function getCategories() {
  try {
    const res = await fetch(CATEGORY_ENDPOINT);
    const categories = await res.json();
    renderCategories(categories);
  } catch (err) {
    console.error(err);
    categoryContainer.innerHTML = `<p>Kunne ikke hente kategorier.</p>`;
  }
}

function renderCategories(categories) {
  categoryContainer.innerHTML = categories
    .map(
      (c) => `
      <a class="category-card" href="productlist.html?category=${encodeURIComponent(
        c.category,
      )}">
        <h3 class="title">${escapeHtml(c.category)}</h3>
        <div class="cta">Se udvalg →</div>
      </a>
    `,
    )
    .join("");
}

async function initNews() {
  try {
    const res = await fetch(PRODUCTS_ENDPOINT);
    const products = await res.json();

    const newest = products
      .slice()
      .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
      .slice(0, NEWS_LIMIT);

    newsGrid.innerHTML = newest.map(renderNewsCard).join("");
  } catch (err) {
    console.error(err);
    newsGrid.innerHTML = `<p>Kunne ikke hente nyheder lige nu.</p>`;
  }
}

function renderNewsCard(p) {
  const imgUrl = productImageUrl(p);

  return `
    <a class="news-card" href="./productlist.html?category=${encodeURIComponent(
      p.category ?? "",
    )}">
      <div class="news-media">
        <img src="${imgUrl}" alt="${escapeHtml(p.productdisplayname)}" loading="lazy" />
      </div>
      <p class="news-name">${escapeHtml(p.productdisplayname)}</p>
      <p class="news-price">${formatDKK(p.price)}</p>
    </a>
  `;
}

function productImageUrl(p) {
  if (p?.image) return `${IMG_BASE}${p.image}`;

  return `${IMG_BASE}${p?.id ?? 0}.webp`;
}

function formatDKK(n) {
  if (typeof n !== "number") return "";
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
    maximumFractionDigits: 0,
  }).format(n);
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
