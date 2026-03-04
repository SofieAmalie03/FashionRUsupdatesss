const endpoint = "https://kea-alt-del.dk/t7/api/products";
const grid = document.querySelector("#productGrid");

async function getProducts() {
  try {
    const res = await fetch(endpoint);
    const products = await res.json();

    // Begræns til 24 så siden er hurtig og overskuelig
    showProducts(products.slice(0, 24));
  } catch (err) {
    grid.innerHTML = `<p>Ups – kunne ikke hente produkter.</p>`;
    console.error(err);
  }
}

function showProducts(products) {
  grid.innerHTML = "";

  products.forEach((p) => {
    const imageUrl = `https://kea-alt-del.dk/t7/images/webp/640/${p.id}.webp`;

    grid.innerHTML += `
      <article class="card">
        <div class="card-media">
          <img class="card-img" src="${imageUrl}" alt="${p.productdisplayname}">
        </div>

        <div class="card-body">
          <h3 class="card-title">${p.productdisplayname}</h3>
          <p class="card-meta">${p.brandname} · ${p.category}</p>
          <p class="card-price">${p.price} DKK</p>
        </div>
      </article>
    `;
  });
}

getProducts();
