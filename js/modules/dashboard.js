console.log("✅ Módulo dashboard cargado");

// ✅ PATRÓN IIFE
(function () {
  function inicializarDashboard() {
    console.log("🔄 Inicializando dashboard...");
    cargarEstadisticasDashboard();
    cargarCategorias();
  }

  function inicializarDashboard() {
    console.log("🔄 Inicializando dashboard...");
    cargarEstadisticasDashboard();
    cargarCategorias();
  }

  async function cargarEstadisticasDashboard() {
    try {
      console.log("📊 Cargando estadísticas del dashboard...");

      const productos = await database.getProductos();

      // Calcular estadísticas
      const totalProductos = productos.length;
      const productosBajoStock = productos.filter(
        (p) => p.stock <= (p.stock_minimo || 5)
      ).length;
      const valorInventario = productos.reduce(
        (total, p) => total + p.precio * p.stock,
        0
      );

      // Actualizar la UI
      actualizarTarjeta("totalProductos", totalProductos);
      actualizarTarjeta("bajoStock", productosBajoStock);
      actualizarTarjeta(
        "valorInventario",
        `$${valorInventario.toLocaleString()}`
      );

      console.log("✅ Estadísticas cargadas:", {
        totalProductos,
        productosBajoStock,
        valorInventario,
      });
    } catch (error) {
      console.error("❌ Error cargando estadísticas:", error);

      // Datos de ejemplo si falla la API
      actualizarTarjeta("totalProductos", "3");
      actualizarTarjeta("bajoStock", "1");
      actualizarTarjeta("valorInventario", "$2,450,000");
    }
  }

  async function cargarCategorias() {
    try {
      console.log("📋 Cargando categorías...");

      const productos = await database.getProductos();
      const categorias = {};

      // Contar productos por categoría
      productos.forEach((producto) => {
        categorias[producto.categoria] =
          (categorias[producto.categoria] || 0) + 1;
      });

      // Actualizar la lista de categorías
      const categoriasList = document.getElementById("categoriasList");
      if (categoriasList) {
        categoriasList.innerHTML = "";

        Object.entries(categorias).forEach(([categoria, cantidad]) => {
          const li = document.createElement("li");
          li.className =
            "list-group-item d-flex justify-content-between align-items-center";
          li.innerHTML = `
                    ${categoria}
                    <span class="badge bg-primary rounded-pill">${cantidad}</span>
                `;
          categoriasList.appendChild(li);
        });

        console.log("✅ Categorías cargadas:", categorias);
      }
    } catch (error) {
      console.error("Error cargando categorías:", error);

      // Datos de ejemplo
      const categoriasList = document.getElementById("categoriasList");
      if (categoriasList) {
        categoriasList.innerHTML = `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    Aretes
                    <span class="badge bg-primary rounded-pill">1</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    Collares
                    <span class="badge bg-primary rounded-pill">1</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    Anillos
                    <span class="badge bg-primary rounded-pill">1</span>
                </li>
            `;
      }
    }
  }

  function actualizarTarjeta(elementId, valor) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
      elemento.textContent = valor;
    }
  }

  // Inicializar cuando se carga el módulo
  inicializarDashboard();
})();
