// Funcionalidad del carrito de compras
let cart = [];

// Inicializar carrito
document.addEventListener("DOMContentLoaded", function () {
  // Cargar carrito desde localStorage
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }

  // Configurar event listeners del carrito
  const cartIcon = document.getElementById("cartIcon");
  const cartSidebar = document.getElementById("cartSidebar");
  const closeCart = document.getElementById("closeCart");

  cartIcon.addEventListener("click", () => {
    cartSidebar.classList.add("active");
  });

  closeCart.addEventListener("click", () => {
    cartSidebar.classList.remove("active");
  });

  // Cerrar carrito al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
      cartSidebar.classList.remove("active");
    }
  });

  // Finalizar compra
  const checkoutBtn = document.querySelector(".checkout-btn");
  checkoutBtn.addEventListener("click", finalizarCompra);
});

// Añadir producto al carrito
function addToCart(id, name, price) {
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id,
      name,
      price,
      quantity: 1,
    });
  }

  updateCart();
  saveCartToLocalStorage();
  showNotification(`${name} añadido al carrito`);
}

// Actualizar carrito
function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.querySelector(".cart-count");

  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Tu carrito está vacío</div>';
  } else {
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      count += item.quantity;

      const cartItemElement = document.createElement("div");
      cartItemElement.className = "cart-item";
      cartItemElement.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn decrease" data-id="${
                      item.id
                    }">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${
                      item.id
                    }">+</button>
                    <button class="remove-item" data-id="${
                      item.id
                    }"><i class="fas fa-trash"></i></button>
                </div>
            `;

      cartItems.appendChild(cartItemElement);
    });

    // Añadir event listeners
    document.querySelectorAll(".decrease").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id");
        decreaseQuantity(id);
      });
    });

    document.querySelectorAll(".increase").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id");
        increaseQuantity(id);
      });
    });

    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id");
        removeFromCart(id);
      });
    });
  }

  cartTotal.textContent = `$${total.toFixed(2)}`;
  cartCount.textContent = count;
}

// Modificar cantidades
function decreaseQuantity(id) {
  const item = cart.find((item) => item.id === id);
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    removeFromCart(id);
    return;
  }
  updateCart();
  saveCartToLocalStorage();
}

function increaseQuantity(id) {
  const item = cart.find((item) => item.id === id);
  item.quantity++;
  updateCart();
  saveCartToLocalStorage();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCart();
  saveCartToLocalStorage();
  showNotification("Producto eliminado del carrito");
}

// Finalizar compra
function finalizarCompra() {
  if (cart.length === 0) {
    showNotification("Tu carrito está vacío", "error");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Simular proceso de compra
  showNotification(`¡Compra realizada! Total: $${total.toFixed(2)}`, "success");

  // Limpiar carrito
  cart = [];
  updateCart();
  saveCartToLocalStorage();

  // Cerrar carrito
  document.getElementById("cartSidebar").classList.remove("active");
}

// Guardar carrito en localStorage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
