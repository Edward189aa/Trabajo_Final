// Funcionalidad principal de la página
document.addEventListener("DOMContentLoaded", function () {
  // Cargar productos
  cargarProductos();

  // Configurar tema
  configurarTema();

  // Configurar navegación suave
  configurarNavegacion();
});

// Cargar productos desde el JSON
async function cargarProductos() {
  try {
    const response = await fetch("data/productos.json");
    const productos = await response.json();

    mostrarProductos(productos.novedades, "novedades-grid");
    mostrarProductos(productos.destacados, "productos-grid");
  } catch (error) {
    console.error("Error al cargar productos:", error);
    // Mostrar productos por defecto si hay error
    mostrarProductosPorDefecto();
  }
}

// Mostrar productos en el grid
function mostrarProductos(productos, gridId) {
  const grid = document.getElementById(gridId);

  if (!grid) return;

  grid.innerHTML = productos
    .map(
      (producto) => `
        <div class="product-card">
            <img src="${producto.imagen}" alt="${
        producto.nombre
      }" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${producto.nombre}</h3>
                <p class="product-price">$${producto.precio.toFixed(2)}</p>
                <button class="add-to-cart" 
                        data-id="${producto.id}" 
                        data-name="${producto.nombre}" 
                        data-price="${producto.precio}">
                    Añadir al Carrito
                </button>
            </div>
        </div>
    `
    )
    .join("");

  // Añadir event listeners a los botones
  grid.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const name = this.getAttribute("data-name");
      const price = parseFloat(this.getAttribute("data-price"));

      addToCart(id, name, price);
    });
  });
}

// Productos por defecto en caso de error
function mostrarProductosPorDefecto() {
  const productosPorDefecto = [
    {
      id: 1,
      nombre: "Elden Ring",
      precio: 59.99,
      imagen:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 2,
      nombre: "Crash Bandicoot 4",
      precio: 49.99,
      imagen:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 3,
      nombre: "Resident Evil 3",
      precio: 39.99,
      imagen:
        "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 4,
      nombre: "Silent Hill 2",
      precio: 44.99,
      imagen:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
  ];

  mostrarProductos(productosPorDefecto, "novedades-grid");
  mostrarProductos(productosPorDefecto, "productos-grid");
}

// Configurar tema
function configurarTema() {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector("i");

  // Verificar preferencia guardada
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
      localStorage.setItem("theme", "light");
    } else {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
      localStorage.setItem("theme", "dark");
    }
  });
}

// Configurar navegación suave
function configurarNavegacion() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Mostrar notificación
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
