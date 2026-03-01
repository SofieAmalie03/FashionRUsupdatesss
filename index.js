const endpoint = "https://kea-alt-del.dk/t7/api/categories";
const container = document.querySelector(".categoryList");

async function getCategories() {
  const res = await fetch(endpoint);
  const categories = await res.json();
  showCategories(categories);
}

function showCategories(categories) {
  container.innerHTML = "";

  categories.forEach((c) => {
    container.innerHTML += `
      <a class="category-card" href="productlist.html?category=${c.category}">
        <h3 class="title">${c.category}</h3>
        <div class="cta">Se udvalg →</div>
      </a>
    `;
  });
}

getCategories();
