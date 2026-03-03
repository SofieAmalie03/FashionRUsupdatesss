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
  pageTitle.textContent = category ? category : "Produkter";
  pageHint.textContent = category
    ? `${count} produkter i kategorien`
    : `${count} produkter`;
}

function showProducts(products) {
  listEl.innerHTML = "";

  products.forEach((p) => {
    const imageUrl = `https://kea-alt-del.dk/t7/images/webp/640/${p.id}.webp`;

    listEl.innerHTML += `
      <a class="product-card ${p.soldout && "soldOut"}" href="product.html?id=${p.id}">
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

getProducts();
