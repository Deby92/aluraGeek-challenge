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
                      <img src="./assets/trash-can-regular (3).svg" alt="Eliminar">
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
  document.querySelector("#clear-button").addEventListener("click", () => {
    selectedProductsContainer.innerHTML = "";
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
      console.log("Productos disponibles:", products);
      const productToAdd = products.find((product) => product.id === parseInt(id));
      console.log("Producto encontrado:", productToAdd);
  
      if (productToAdd) {
        const existingCard = selectedProductsContainer.querySelector(
          `[data-id="${id}"]`
        );
        if (!existingCard) {
          const newCard = createCard(productToAdd, true);
          selectedProductsContainer.appendChild(newCard);
          console.log("Tarjeta agregada al DOM:", newCard);
        } else {
          console.warn("El producto ya está en la lista seleccionada.");
        }
      } else {
        console.error("Producto no encontrado para el ID:", id);
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

const sendButton = document.querySelector("#send-button");
const handleSendClick = (event) => {
  event.preventDefault();
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Se enviarán los datos seleccionados.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, enviar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      selectedProductsContainer.innerHTML = "";
      Swal.fire("¡Enviado!", "Los productos han sido enviados correctamente.", "success");
      console.log("Productos enviados y la lista ha sido vaciada.");
    } else {
      console.log("Acción cancelada por el usuario.");
    }
  });
};
sendButton.addEventListener("click", handleSendClick);


renderProducts();
