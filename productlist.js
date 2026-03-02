const listEl = document.querySelector("#productList");
const pageTitle = document.querySelector("#pageTitle");
const pageHint = document.querySelector("#pageHint");

const params = new URLSearchParams(window.location.search);
const category = params.get("category");

const endpoint = "https://kea-alt-del.dk/t7/api/products";

async function getProducts() {
  const url = category
    ? `${endpoint}?category=${encodeURIComponent(category)}`
    : endpoint;

  const res = await fetch(url);
  const products = await res.json();

  updateHeader(products.length);
  showProducts(products);
}

function updateHeader(count) {
  if (category) {
    pageTitle.textContent = category;
    pageHint.textContent = `${count} produkter i kategorien`;
  } else {
    pageTitle.textContent = "Produkter";
    pageHint.textContent = `${count} produkter`;
  }
}

function showProducts(products) {
  listEl.innerHTML = "";

  products.forEach((p) => {
    const imageUrl = `https://kea-alt-del.dk/t7/images/webp/640/${p.id}.webp`;

    const hasDiscount = p.discount !== null && p.discount > 0;
    const oldPrice = hasDiscount
      ? Math.round(p.price / (1 - p.discount / 100))
      : null;

    listEl.innerHTML += `
      <a class="product-card ${p.soldout ? "soldout" : ""}" href="product.html?id=${p.id}">
        <div class="badges">
          ${hasDiscount ? `<span class="badge sale">-${p.discount}%</span>` : ""}
          ${p.soldout ? `<span class="badge sold">UDSOLGT</span>` : ""}
        </div>

        <div class="product-media">
          <img src="${imageUrl}" alt="${p.productdisplayname}" loading="lazy" />
        </div>

        <div class="product-body">
          <h3 class="product-name">${p.productdisplayname}</h3>
          <p class="product-meta">${p.brandname} • ${p.articletype}</p>

          <div class="price-row">
            <span class="price ${hasDiscount ? "sale" : ""}">DKK ${p.price}</span>
            ${hasDiscount ? `<span class="price old">DKK ${oldPrice}</span>` : ""}
          </div>

          <span class="btn primary">${p.soldout ? "Udsolgt" : "Se produkt"}</span>
        </div>
      </a>
    `;
  });
}

getProducts();
