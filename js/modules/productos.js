console.log("✅ Módulo de productos cargado");

// ✅ PATRÓN IIFE (Immediately Invoked Function Expression) para evitar redeclaraciones
(function () {
  // Variables locales al módulo
  let productos = [];

  // Inicializar módulo de productos
  function inicializarProductos() {
    console.log("🔄 Inicializando módulo de productos...");
    cargarProductos();
    configurarPermisosProductos();
  }

  // Configurar permisos según el rol
  function configurarPermisosProductos() {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    const esAdmin = usuario && usuario.rol === "admin";
    const esVendedor = usuario && usuario.rol === "vendedor";

    console.log("🔐 Configurando permisos para productos - Rol:", usuario?.rol);

    const btnNuevoProducto = document.querySelector(
      'button[onclick*="mostrarFormularioProducto"]'
    );

    if (btnNuevoProducto) {
      if (esAdmin) {
        // Admin puede ver el botón
        btnNuevoProducto.style.display = "block";
        console.log("👑 Admin: botón de nuevo producto visible");
      } else if (esVendedor) {
        // Vendedor NO puede ver el botón
        btnNuevoProducto.style.display = "none";
        console.log("👨‍💼 Vendedor: botón de nuevo producto oculto");
      } else {
        // Por defecto, mostrar el botón
        btnNuevoProducto.style.display = "block";
      }
    }
  }

  // Cargar productos desde la API
  async function cargarProductos() {
    try {
      console.log("📦 Cargando productos desde la API...");

      // ✅ CONEXIÓN REAL CON LA API
      productos = await database.getProductos();

      console.log("✅ Productos cargados desde API:", productos);
      mostrarProductos();
      mostrarNotificacion(
        `${productos.length} productos cargados correctamente`,
        "success"
      );
    } catch (error) {
      console.error("❌ Error cargando productos:", error);
      mostrarNotificacion(
        "Error al cargar productos. Usando datos de ejemplo.",
        "warning"
      );

      // Datos de ejemplo como fallback
      productos = [
        {
          id: 1,
          nombre: "Aretes de Perla Cultivada",
          categoria: "Aretes",
          material: "Plata",
          precio: 55000,
          stock: 25,
          descripcion: "Elegantes aretes de perla cultivada",
        },
        {
          id: 2,
          nombre: "Collar Corazón de Plata",
          categoria: "Collares",
          material: "Plata",
          precio: 78000,
          stock: 15,
          descripcion: "Collar con dije de corazón",
        },
      ];

      mostrarProductos();
    }
  }

  // Mostrar productos en la tabla
  function mostrarProductos() {
    const tbody = document.getElementById("tablaProductos");

    if (!tbody) {
      console.error("❌ No se encontró la tabla de productos");
      return;
    }

    if (productos.length === 0) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4 text-muted">
                        <i class="bi bi-inbox display-6"></i>
                        <p class="mt-2">No hay productos registrados</p>
                        <button class="btn btn-primary btn-sm" onclick="window.mostrarFormularioProducto()">
                            Crear primer producto
                        </button>
                    </td>
                </tr>
            `;
      return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    const esAdmin = usuario && usuario.rol === "admin";
    const esVendedor = usuario && usuario.rol === "vendedor";

    let html = "";
    productos.forEach((producto) => {
      const estadoStock =
        producto.stock <= (producto.stock_minimo || 5)
          ? '<span class="badge bg-warning">Bajo Stock</span>'
          : '<span class="badge bg-success">Disponible</span>';

      const tienePiedras = producto.piedras
        ? '<br><small class="text-muted">💎 ' +
          (producto.tipo_piedras || "Con piedras") +
          "</small>"
        : "";

      // Configurar botones según el rol
      let botones = "";

      if (esAdmin) {
        // Admin tiene todos los permisos
        botones = `
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="window.editarProducto(${producto.id})" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="window.eliminarProducto(${producto.id})" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
      } else if (esVendedor) {
        // Vendedor solo puede editar, no eliminar
        botones = `
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="window.editarProducto(${producto.id})" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-secondary" disabled title="Solo administradores pueden eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
      } else {
        // Por defecto (si no hay rol definido)
        botones = `
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="window.editarProducto(${producto.id})" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="window.eliminarProducto(${producto.id})" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
      }

      html += `
                <tr>
                    <td>
                        <strong>${producto.nombre}</strong>
                        ${tienePiedras}
                        ${
                          producto.descripcion
                            ? `<br><small class="text-muted">${producto.descripcion}</small>`
                            : ""
                        }
                    </td>
                    <td>
                        <span class="badge bg-secondary">${
                          producto.categoria
                        }</span>
                    </td>
                    <td>${producto.material}</td>
                    <td>
                        <strong class="text-primary">$${
                          producto.precio?.toLocaleString() || "0"
                        }</strong>
                        ${
                          producto.costo
                            ? `<br><small class="text-muted">Costo: $${producto.costo.toLocaleString()}</small>`
                            : ""
                        }
                    </td>
                    <td>
                        <span class="fw-bold ${
                          producto.stock <= (producto.stock_minimo || 5)
                            ? "text-warning"
                            : "text-success"
                        }">
                            ${producto.stock} unidades
                        </span>
                        ${
                          producto.stock <= (producto.stock_minimo || 5)
                            ? '<br><small class="text-danger">⚠️ Stock bajo</small>'
                            : ""
                        }
                    </td>
                    <td>${estadoStock}</td>
                    <td>${botones}</td>
                </tr>
            `;
    });

    tbody.innerHTML = html;
    console.log("✅ Tabla de productos actualizada");
  }

  // Funciones del formulario
  function mostrarFormularioProducto() {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    const esVendedor = usuario && usuario.rol === "vendedor";

    if (esVendedor) {
      mostrarNotificacion(
        "❌ Solo los administradores pueden crear productos",
        "danger"
      );
      return;
    }

    document.getElementById("formularioProducto").style.display = "block";
    document.getElementById("tituloFormProducto").textContent =
      "Nuevo Producto de Joyería";
    document.getElementById("formProducto").reset();
    document.getElementById("productoId").value = "";
  }

  function ocultarFormularioProducto() {
    document.getElementById("formularioProducto").style.display = "none";
  }

  function toggleTipoPiedras() {
    const tienePiedras =
      document.getElementById("piedrasProducto").value === "1";
    document.getElementById("tipoPiedrasContainer").style.display = tienePiedras
      ? "block"
      : "none";
  }

  async function guardarProducto(event) {
    event.preventDefault();

    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    const esVendedor = usuario && usuario.rol === "vendedor";
    const productoId = document.getElementById("productoId").value;

    // Si es vendedor y está intentando crear un producto nuevo
    if (esVendedor && !productoId) {
      mostrarNotificacion(
        "❌ Solo los administradores pueden crear productos",
        "danger"
      );
      return;
    }

    const productoData = {
      nombre: document.getElementById("nombreProducto").value,
      categoria: document.getElementById("categoriaProducto").value,
      material: document.getElementById("materialProducto").value,
      precio: parseFloat(document.getElementById("precioProducto").value),
      costo: parseFloat(document.getElementById("costoProducto").value),
      stock: parseInt(document.getElementById("stockProducto").value),
      stock_minimo: parseInt(
        document.getElementById("stockMinimoProducto").value
      ),
      peso_gramos:
        parseFloat(document.getElementById("pesoProducto").value) || null,
      piedras: document.getElementById("piedrasProducto").value === "1",
      tipo_piedras:
        document.getElementById("tipoPiedrasProducto").value || null,
      descripcion: document.getElementById("descripcionProducto").value,
    };

    try {
      if (productoId) {
        // Actualizar
        await database.updateProducto(productoId, productoData);
        mostrarNotificacion("Producto actualizado exitosamente", "success");
      } else {
        // Crear
        await database.createProducto(productoData);
        mostrarNotificacion("Producto creado exitosamente", "success");
      }

      ocultarFormularioProducto();
      await cargarProductos(); // Recargar datos
    } catch (error) {
      console.error("Error guardando producto:", error);
      mostrarNotificacion("Error al guardar el producto", "danger");
    }
  }

  function editarProducto(id) {
    const producto = productos.find((p) => p.id == id);
    if (producto) {
      document.getElementById("productoId").value = producto.id;
      document.getElementById("nombreProducto").value = producto.nombre;
      document.getElementById("categoriaProducto").value = producto.categoria;
      document.getElementById("materialProducto").value = producto.material;
      document.getElementById("precioProducto").value = producto.precio;
      document.getElementById("costoProducto").value = producto.costo || "";
      document.getElementById("stockProducto").value = producto.stock;
      document.getElementById("stockMinimoProducto").value =
        producto.stock_minimo || 5;
      document.getElementById("pesoProducto").value =
        producto.peso_gramos || "";
      document.getElementById("piedrasProducto").value = producto.piedras
        ? "1"
        : "0";
      document.getElementById("tipoPiedrasProducto").value =
        producto.tipo_piedras || "";
      document.getElementById("descripcionProducto").value =
        producto.descripcion || "";

      toggleTipoPiedras();
      document.getElementById("tituloFormProducto").textContent =
        "Editar Producto";
      document.getElementById("formularioProducto").style.display = "block";
    }
  }

  async function eliminarProducto(id) {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

    if (usuario && usuario.rol !== "admin") {
      mostrarNotificacion(
        "❌ Solo los administradores pueden eliminar productos",
        "danger"
      );
      return;
    }

    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await database.deleteProducto(id);
        mostrarNotificacion("Producto eliminado exitosamente", "success");
        await cargarProductos();
      } catch (error) {
        console.error("Error eliminando producto:", error);
        mostrarNotificacion("Error al eliminar el producto", "danger");
      }
    }
  }

  // Función global para mostrar notificaciones
  function mostrarNotificacion(mensaje, tipo = "info") {
    // Crear notificación simple con Bootstrap
    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    alerta.style.cssText =
      "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
    alerta.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

    document.body.appendChild(alerta);

    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
      if (alerta.parentNode) {
        alerta.remove();
      }
    }, 5000);
  }

  // ✅ EXPONER FUNCIONES AL ÁMBITO GLOBAL
  window.mostrarFormularioProducto = mostrarFormularioProducto;
  window.ocultarFormularioProducto = ocultarFormularioProducto;
  window.toggleTipoPiedras = toggleTipoPiedras;
  window.guardarProducto = guardarProducto;
  window.editarProducto = editarProducto;
  window.eliminarProducto = eliminarProducto;

  // Inicializar cuando se carga la vista
  inicializarProductos();
})();
