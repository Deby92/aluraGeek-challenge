import { servicesProducts } from "../services/product-services.js";

const productContainer = document.querySelector("[data-product]");
const form = document.querySelector("[data-form]");

function createCard({ name, price, image, id }) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
        <div class="img-container">
            <img src="${image}" alt="imagen producto">
        </div>
        <div class="card-container--info">
            <p>${name}</p>
            <div class="card-container--value">
                <p>$${price}</p>
                <button class="delete-button" data-id="${id}">
                    <img src="./assets/trash-can-regular (3).svg" alt="Eliminar">
                </button>
                <button class="add-button" data-id="${id}">
                    <img src="./assets/plus-solid.svg" alt="Agregar">
                </button>
            </div>
        </div>
    `;
  return card;
}

const renderProducts = async () => {
  try {
    const listProducts = await servicesProducts.productList();
    listProducts.forEach((product) => {
      const productCard = createCard(product);
      productContainer.appendChild(productCard);
    });
  } catch (error) {
    console.log(error);
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.querySelector("[data-name]").value;
  const price = document.querySelector("[data-price]").value;
  const image = document.querySelector("[data-image]").value;

  try {
    const newProduct = await servicesProducts.createProduct(name, price, image);
    const newCard = createCard(newProduct);
    productContainer.appendChild(newCard);
  } catch (error) {
    console.log(error);
  }
  form.reset();
});

renderProducts();
