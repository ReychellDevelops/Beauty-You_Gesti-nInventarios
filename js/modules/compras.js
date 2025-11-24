console.log('✅ Módulo de compras cargado');

function inicializarCompras() {
    console.log('🔄 Inicializando módulo de compras...');
    document.getElementById('contenido').innerHTML = `
        <div class="container-fluid">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2><i class="bi bi-bag-check me-2"></i>Gestión de Compras</h2>
                <button class="btn btn-primary">
                    <i class="bi bi-plus-circle me-1"></i>Nueva Compra
                </button>
            </div>
            <div class="alert alert-info">
                <h5>Módulo de Compras</h5>
                <p>Esta funcionalidad estará disponible pronto.</p>
                <p>Por ahora, puedes gestionar los productos.</p>
            </div>
        </div>
    `;
}

// Inicializar cuando se carga la vista
inicializarCompras();