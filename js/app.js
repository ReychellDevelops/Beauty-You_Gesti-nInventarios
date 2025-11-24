// Estado global de la aplicación
let usuarioActual = null;

// Inicializar la aplicación
function inicializarApp() {
    console.log('🚀 Inicializando aplicación Beauty You...');
    verificarAutenticacion();
}

// Verificar si el usuario está logueado
function verificarAutenticacion() {
    const usuarioGuardado = localStorage.getItem('usuarioActual');
    
    if (usuarioGuardado) {
        usuarioActual = JSON.parse(usuarioGuardado);
        console.log('✅ Usuario autenticado:', usuarioActual.nombre, '- Rol:', usuarioActual.rol);
        actualizarUIUsuario();
        
        // Verificar permisos según rol
        verificarPermisos();
        
        // Cargar dashboard por defecto
        cargarVista('dashboard');
    } else {
        console.log('❌ No hay usuario autenticado, redirigiendo...');
        window.location.href = 'login.html';
    }
}

// Nueva función para verificar permisos
function verificarPermisos() {
    if (!usuarioActual) return;
    
    // Ocultar/mostrar elementos según el rol
    const esAdmin = usuarioActual.rol === 'admin';
    const esVendedor = usuarioActual.rol === 'vendedor';
    
    console.log(`🔐 Permisos - Admin: ${esAdmin}, Vendedor: ${esVendedor}`);
    
    // Ejemplo: Ocultar opciones de administración para vendedores
    if (esVendedor) {
        // Podemos ocultar o deshabilitar ciertas funciones
        console.log('👨‍💼 Modo vendedor: algunas funciones estarán limitadas');
    }
}

// función para verificar permisos en acciones específicas
function tienePermiso(accion) {
    if (!usuarioActual) return false;
    
    const permisos = {
        'admin': ['crear_producto', 'editar_producto', 'eliminar_producto', 'gestionar_usuarios', 'ver_reportes'],
        'vendedor': ['crear_producto', 'editar_producto', 'ver_reportes']
    };
    
    return permisos[usuarioActual.rol]?.includes(accion) || false;
}

// Actualizar la interfaz con información del usuario
function actualizarUIUsuario() {
    const userInfo = document.getElementById('userInfo');
    if (userInfo && usuarioActual) {
        const badgeColor = usuarioActual.rol === 'admin' ? 'bg-danger' : 'bg-success';
        
        userInfo.innerHTML = `
            <span class="text-light me-3">
                <i class="bi bi-person-circle me-1"></i>
                ${usuarioActual.nombre} 
                <span class="badge ${badgeColor}">${usuarioActual.rol}</span>
            </span>
            <button class="btn btn-outline-light btn-sm" onclick="cerrarSesion()">
                <i class="bi bi-box-arrow-right me-1"></i>Cerrar Sesión
            </button>
        `;
    }
}

// Cargar diferentes vistas
async function cargarVista(vista) {
    console.log(`🔄 Intentando cargar vista: ${vista}`);
    
    try {
        // Actualizar menú activo
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Encontrar y activar el enlace correcto
        const enlaceActivo = Array.from(document.querySelectorAll('.nav-link'))
            .find(link => link.textContent.includes(vista.charAt(0).toUpperCase() + vista.slice(1)));
        
        if (enlaceActivo) {
            enlaceActivo.classList.add('active');
        }
        
        // Cargar el contenido de la vista
        console.log(`📁 Buscando archivo: ./vistas/${vista}.html`);
        const response = await fetch(`./vistas/${vista}.html`);
        
        if (!response.ok) {
            throw new Error(`No se pudo cargar la vista: ${response.status} ${response.statusText}`);
        }
        
        const html = await response.text();
        document.getElementById('contenido').innerHTML = html;
        
        console.log(`✅ Vista ${vista} cargada correctamente`);
        
        // Cargar el JavaScript específico de la vista
        await cargarScriptVista(vista);
        
    } catch (error) {
        console.error(`❌ Error cargando vista ${vista}:`, error);
        mostrarErrorVista(vista, error);
    }
}

// Cargar script específico de cada vista
async function cargarScriptVista(vista) {
    return new Promise((resolve, reject) => {
        console.log(`📜 Intentando cargar script: ./js/modules/${vista}.js`);
        
        // ✅ MEJORA: Verificar si el script ya está cargado
        const scriptExistente = document.querySelector(`script[data-vista="${vista}"]`);
        if (scriptExistente) {
            console.log(`✅ Script de ${vista} ya está cargado`);
            resolve();
            return;
        }
        
        // Remover script anterior si existe
        const scriptAnterior = document.getElementById('script-vista');
        if (scriptAnterior) {
            scriptAnterior.remove();
        }
        
        // Crear nuevo script
        const script = document.createElement('script');
        script.id = 'script-vista';
        script.setAttribute('data-vista', vista); // ✅ Nuevo: identificar por vista
        script.src = `./js/modules/${vista}.js`;
        
        script.onload = () => {
            console.log(`✅ Script de ${vista} cargado exitosamente`);
            script.loaded = true;
            resolve();
        };
        
        script.onerror = (error) => {
            console.warn(`⚠️ No se pudo cargar el script de ${vista}:`, error);
            resolve(); // Resolvemos igual para no bloquear
        };
        
        document.body.appendChild(script);
        
        // Timeout por si el archivo no existe
        setTimeout(() => {
            if (!script.loaded && !script.onerror) {
                console.warn(`⏰ Timeout cargando script de ${vista}`);
                resolve();
            }
        }, 2000);
    });
}

// Mostrar error cuando falla una vista
function mostrarErrorVista(vista, error) {
    const contenido = `
        <div class="container-fluid">
            <div class="alert alert-danger">
                <h4>❌ Error cargando la vista: ${vista}</h4>
                <p><strong>Error:</strong> ${error.message}</p>
                <p>Verifica que el archivo <code>vistas/${vista}.html</code> exista.</p>
                <button class="btn btn-primary mt-3" onclick="cargarVista('dashboard')">
                    Volver al Dashboard
                </button>
            </div>
            <div class="card mt-3">
                <div class="card-header">
                    <h5>Información de Debug</h5>
                </div>
                <div class="card-body">
                    <p><strong>Vista solicitada:</strong> ${vista}</p>
                    <p><strong>Usuario:</strong> ${usuarioActual?.nombre || 'No autenticado'}</p>
                    <p><strong>URL Base:</strong> ${window.location.href}</p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('contenido').innerHTML = contenido;
}

// Cerrar sesión
function cerrarSesion() {
    console.log('🔒 Cerrando sesión...');
    localStorage.removeItem('usuarioActual');
    usuarioActual = null;
    window.location.href = 'login.html';
}

// Hacer funciones globales
window.cargarVista = cargarVista;
window.cerrarSesion = cerrarSesion;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', inicializarApp);