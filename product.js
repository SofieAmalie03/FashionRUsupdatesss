const IMG_BASE = "https://kea-alt-del.dk/t7/images/webp/640/";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const sectionTitle = document.querySelector("#sectionTitle");
const sectionHint = document.querySelector("#sectionHint");

const mainImage = document.querySelector("#mainImage");
const thumbs = [
  document.querySelector("#thumb1"),
  document.querySelector("#thumb2"),
  document.querySelector("#thumb3"),
  document.querySelector("#thumb4"),
];

const productTitle = document.querySelector("#productTitle");
const brandLine = document.querySelector("#brandLine");
const priceRow = document.querySelector("#priceRow");

const kvModel = document.querySelector("#kvModel");
const kvColor = document.querySelector("#kvColor");
const kvStock = document.querySelector("#kvStock");

const sizeSelect = document.querySelector("#size");
const addBtn = document.querySelector("#addBtn");

if (!id) {
  productTitle.textContent = "Ingen produkt valgt";
} else {
  getProduct(id);
}

async function getProduct(productId) {
  try {
    const res = await fetch(
      `https://kea-alt-del.dk/t7/api/products/${productId}`,
    );
    const product = await res.json();
    showProduct(product);
  } catch (err) {
    console.error(err);
    productTitle.textContent = "Kunne ikke hente produktet.";
  }
}

function showProduct(p) {
  document.title = `FashionRUs — ${p.productdisplayname}`;

  sectionTitle.textContent = "Produkt";
  sectionHint.textContent = `${p.category} · ${p.brandname}`;

  productTitle.textContent = p.productdisplayname;
  brandLine.textContent = `${p.brandname} • ${p.articletype}`;

  const imgUrl = productImageUrl(p);

  mainImage.src = imgUrl;
  mainImage.alt = p.productdisplayname;

  thumbs.forEach((t) => {
    t.src = imgUrl;
    t.alt = p.productdisplayname;
  });

  const oldPrice = p.discount
    ? Math.round(p.price / (1 - p.discount / 100))
    : null;

  priceRow.innerHTML = `
    <span class="price ${p.discount ? "sale" : ""}">DKK ${p.price}</span>
    ${p.discount ? `<span class="price old">DKK ${oldPrice}</span>` : ""}
    ${p.discount ? `<span class="badge sale">-${p.discount}%</span>` : ""}
    ${p.soldout ? `<span class="badge sold">UDSOLGT</span>` : ""}
  `;

  kvModel.textContent = p.productdisplayname;
  kvColor.textContent = p.basecolour || "—";
  kvStock.textContent = p.soldout ? "Udsolgt" : "På lager";

  fillSizes(p.size);

  addBtn.textContent = p.soldout ? "Udsolgt" : "Add to basket";
  addBtn.disabled = Boolean(p.soldout);
}

function productImageUrl(p) {
  // FIX: brug p.image
  if (p?.image) return `${IMG_BASE}${p.image}`;
  return `${IMG_BASE}${p?.id ?? 0}.webp`;
}

function fillSizes(sizeValue) {
  sizeSelect.innerHTML = `<option value="">Select…</option>`;

  if (!sizeValue) return;

  const sizes = String(sizeValue)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  sizes.forEach((s) => {
    sizeSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${s}">${s}</option>`,
    );
  });
}
