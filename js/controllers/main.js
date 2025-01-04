import { servicesProducts } from "../services/product-services.js";

const productContainer = document.querySelector("[data-product]");
const selectedProductsContainer = document.querySelector("#lista-productos");

function createCard({ name, price, image, id }, isSmall = false) {
  const card = document.createElement("li"); 
  card.classList.add("card");
  if (isSmall) card.classList.add("card-small"); 

  card.innerHTML = `
    <div class="img-container">
        <img src="${image}" alt="imagen producto">
    </div>
    <div class="card-container--info">
        <p>${name}</p>
        <div class="card-container--value">
            <p>$${price}</p>
            ${
              isSmall
                ? `<button class="delete-button" data-id="${id}">
                      <img src="./assets/trash-can-regular.svg" alt="Eliminar">
                  </button>`
                : `<button class="add-button" data-id="${id}">
                      <img src="./assets/plus-solid.svg" alt="Agregar">
                  </button>`
            }
        </div>
    </div>
  `;

  return card;
}

const renderProducts = async () => {
  try {
    const listProducts = await servicesProducts.productList();
    productContainer.innerHTML = "";
    listProducts.forEach((product) => {
      const productCard = createCard(product);
      productContainer.appendChild(productCard);
    });
    addEventListeners();
  } catch (error) {
    console.error("Error al renderizar productos:", error);
  }
};

const addEventListeners = () => {
  productContainer.addEventListener("click", async (event) => {
    const cardButton = event.target.closest("button");

    if (cardButton && cardButton.classList.contains("add-button")) {
      const productId = cardButton.dataset.id;
      console.log("Botón agregar clickeado, ID:", productId);
      addProductToSelection(productId); 
    }
  });

  selectedProductsContainer.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-button");
    if (deleteButton) {
      const productId = deleteButton.dataset.id;
      handleDeleteProduct(productId, selectedProductsContainer);
    }
  });
};

const addProductToSelection = async (id) => {
    try {
      const products = await servicesProducts.productList();
      const productToAdd = products.find((product) => product.id === id);
  
      if (productToAdd) {
        console.log("Producto agregado:", productToAdd); 
        const existingCard = selectedProductsContainer.querySelector(
          `[data-id="${id}"]`
        );
        if (!existingCard) {
          const newCard = createCard(productToAdd, true); 
          selectedProductsContainer.appendChild(newCard);
          addDeleteEventListener(newCard);
        } else {
          console.warn("El producto ya está en la lista seleccionada.");
        }
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };
  

const handleDeleteProduct = (id, container) => {
  const cardToDelete = container.querySelector(`[data-id="${id}"]`).closest(".card");
  if (cardToDelete) {
    cardToDelete.remove();
  }
};

const addDeleteEventListener = (card) => {
  const deleteButton = card.querySelector(".delete-button");
  deleteButton.addEventListener("click", (e) => {
    const productId = e.target.closest("button").dataset.id;
    handleDeleteProduct(productId, selectedProductsContainer);
  });
};

renderProducts();
