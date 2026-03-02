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
  const res = await fetch(
    `https://kea-alt-del.dk/t7/api/products/${productId}`,
  );
  const product = await res.json();
  renderProduct(product);
}

function renderProduct(p) {
  document.title = `FashionRUs — ${p.productdisplayname}`;

  sectionTitle.textContent = "Produkt";
  sectionHint.textContent = `${p.category} · ${p.brandname}`;

  productTitle.textContent = p.productdisplayname;
  brandLine.textContent = `${p.brandname} • ${p.articletype}`;

  const imgUrl = `https://kea-alt-del.dk/t7/images/webp/640/${p.id}.webp`;

  mainImage.src = imgUrl;
  mainImage.alt = p.productdisplayname;

  thumbs.forEach((t) => {
    t.src = imgUrl;
    t.alt = p.productdisplayname;
  });

  const hasDiscount = p.discount !== null && p.discount > 0;
  const oldPrice = hasDiscount
    ? Math.round(p.price / (1 - p.discount / 100))
    : null;

  priceRow.innerHTML = `
    <span class="price ${hasDiscount ? "sale" : ""}">DKK ${p.price}</span>
    ${hasDiscount ? `<span class="price old">DKK ${oldPrice}</span>` : ""}
    ${hasDiscount ? `<span class="badge sale">-${p.discount}%</span>` : ""}
    ${p.soldout ? `<span class="badge sold">UDSOLGT</span>` : ""}
  `;

  kvModel.textContent = p.productdisplayname;
  kvColor.textContent = p.basecolour || "—";
  kvStock.textContent = p.soldout ? "Udsolgt" : "På lager";

  fillSizes(p.size);

  if (p.soldout) {
    addBtn.textContent = "Udsolgt";
    addBtn.disabled = true;
  }
}

function fillSizes(sizeValue) {
  sizeSelect.innerHTML = `<option value="">Select…</option>`;

  if (!sizeValue) return;

  const sizes = String(sizeValue)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  sizes.forEach((s) => {
    sizeSelect.innerHTML += `<option value="${s}">${s}</option>`;
  });
}
