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
  sectionTitle.textContent = "Product";
  sectionHint.textContent =
    "Mangler id i URL. Åbn et produkt fra produktlisten.";
  productTitle.textContent = "Ingen produkt valgt";
  addBtn.disabled = true;
} else {
  getProduct(id);
}

async function getProduct(productId) {
  try {
    const res = await fetch(
      `https://kea-alt-del.dk/t7/api/products/${productId}`,
    );
    const product = await res.json();
    renderProduct(product);
  } catch (err) {
    console.error(err);
    productTitle.textContent = "Kunne ikke hente produktet";
    sectionHint.textContent = "Tjek at linket indeholder ?id=...";
  }
}

function renderProduct(p) {
  document.title = `FashionRUs — ${p.productdisplayname}`;
  sectionTitle.textContent = "Product";
  sectionHint.textContent = `${p.category} · ${p.brandname}`;

  productTitle.textContent = p.productdisplayname;
  brandLine.textContent = `${p.brandname} • ${p.articletype}`;

  // Images
  const img640 = (pid) =>
    `https://kea-alt-del.dk/t7/images/webp/640/${pid}.webp`;

  // Main image
  mainImage.src = img640(p.id);
  mainImage.alt = p.productdisplayname;

  // Thumbnails (API har ikke “rigtige” ekstra billeder, så vi viser samme i 4 thumbs)
  // Hvis du vil, kan vi senere lave hover/klik state – men dette er 1:1 og virker altid.
  thumbs.forEach((t) => {
    t.src = img640(p.id);
    t.alt = p.productdisplayname;
  });

  // Klik på thumbs skifter main (her skifter den bare til samme – men flowet er klar)
  document.querySelectorAll(".gallery-thumbs .thumb").forEach((btn) => {
    btn.addEventListener("click", () => {
      mainImage.src = img640(p.id);
    });
  });

  // Price + discount
  const hasDiscount = p.discount !== null && p.discount > 0;
  const oldPrice = hasDiscount
    ? Math.round(p.price / (1 - p.discount / 100))
    : null;

  priceRow.innerHTML = `
    <span class="price ${hasDiscount ? "sale" : ""}">DKK ${p.price}</span>
    ${hasDiscount ? `<span class="price old">DKK ${oldPrice}</span>` : ""}
    ${hasDiscount ? `<span class="badge sale" style="margin-left:auto">-${p.discount}%</span>` : ""}
    ${p.soldout ? `<span class="badge sold" style="margin-left:auto">UDSOLGT</span>` : ""}
  `;

  // Key values
  kvModel.textContent = p.productdisplayname;
  kvColor.textContent = p.basecolour || "—";

  // Stock: API bruger "soldout" (0/1). Vi laver en pæn tekst.
  kvStock.textContent = p.soldout ? "0 (sold out)" : "In stock";

  // Sizes: API har typisk sizes som CSV-string i "size" eller null
  // Vi fylder select pænt uanset hvad.
  fillSizes(p.size);

  // Disable add button if sold out
  if (p.soldout) {
    addBtn.textContent = "Udsolgt";
    addBtn.disabled = true;
  } else {
    addBtn.textContent = "Add to basket";
    addBtn.disabled = false;
  }
}

function fillSizes(sizeValue) {
  // reset
  sizeSelect.innerHTML = `<option value="">Select…</option>`;

  if (!sizeValue) return;

  // sizeValue kan være fx "S, M, L" eller "36,37,38"
  const sizes = String(sizeValue)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  sizes.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    sizeSelect.appendChild(opt);
  });
}
