const express = require('express');
const mysql = require('mysql2/promise'); 
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;

// CONFIGURACIÓN CORS
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware para archivos estáticos (FRONTEND)
app.use(express.static(path.join(__dirname, '..'))); // Sirve archivos desde la raíz del proyecto

app.use(express.json());

// Conexión a MySQL
const connectionConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Melisaveloza246*',
    database: 'sistema_inventarios',
    port: 3306
};

let connection;

async function connectToDatabase() {
    try {
        connection = await mysql.createConnection(connectionConfig);
        console.log('✅ Conectado a MySQL - sistema_inventarios');
    } catch (error) {
        console.error('❌ Error conectando a MySQL:', error.message);
    }
}

// ==================== RUTAS DEL FRONTEND ====================

// Ruta principal - sirve login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login.html'));
});

// Ruta para el dashboard
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Ruta para servir archivos de vistas
app.get('/vistas/:archivo', (req, res) => {
    const archivo = req.params.archivo;
    res.sendFile(path.join(__dirname, '..', 'vistas', archivo));
});

// Ruta para servir archivos JavaScript
app.get('/js/:archivo', (req, res) => {
    const archivo = req.params.archivo;
    res.sendFile(path.join(__dirname, '..', 'js', archivo));
});

// Ruta para servir módulos JavaScript
app.get('/js/modules/:archivo', (req, res) => {
    const archivo = req.params.archivo;
    res.sendFile(path.join(__dirname, '..', 'js', 'modules', archivo));
});

// ==================== RUTAS DE LA API ====================

// Ruta de prueba de API
app.get('/api', (req, res) => {
    res.json({ 
        message: '🚀 API Beauty You funcionando!',
        database: connection ? 'Conectado a MySQL' : 'Modo demo',
        frontend: 'Servido desde el mismo servidor'
    });
});

// Ruta GET para obtener productos
app.get('/api/productos', async (req, res) => {
    try {
        console.log('📦 Solicitando productos');
        
        if (connection) {
            const [results] = await connection.execute(
                'SELECT id, nombre, descripcion, categoria, material, precio, costo, stock, stock_minimo, peso_gramos, piedras, tipo_piedras, imagen FROM productos WHERE activo = 1 ORDER BY nombre'
            );
            console.log(`✅ Enviando ${results.length} productos`);
            res.json(results);
        } else {
            // Datos de ejemplo
            const productosEjemplo = [
                {
                    id: 1,
                    nombre: "Aretes de Perla Cultivada",
                    descripcion: "Elegantes aretes de perla cultivada con terminación en plata 925",
                    categoria: "Aretes",
                    material: "Plata",
                    precio: 55000,
                    costo: 35000,
                    stock: 25,
                    stock_minimo: 5,
                    peso_gramos: 8.5,
                    piedras: true,
                    tipo_piedras: "Perla cultivada",
                    imagen: null
                }
            ];
            res.json(productosEjemplo);
        }
    } catch (error) {
        console.error('Error en /api/productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Ruta POST para crear producto
app.post('/api/productos', async (req, res) => {
    try {
        const { nombre, descripcion, categoria, material, precio, costo, stock, stock_minimo, peso_gramos, piedras, tipo_piedras } = req.body;
        
        console.log('➕ Creando nuevo producto:', { nombre, categoria, precio });
        
        if (connection) {
            const [result] = await connection.execute(
                `INSERT INTO productos 
                 (nombre, descripcion, categoria, material, precio, costo, stock, stock_minimo, peso_gramos, piedras, tipo_piedras) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [nombre, descripcion, categoria, material, precio, costo, stock, stock_minimo, peso_gramos, piedras, tipo_piedras]
            );
            
            console.log(`✅ Producto creado con ID: ${result.insertId}`);
            res.json({ 
                success: true, 
                id: result.insertId,
                message: 'Producto creado exitosamente'
            });
        } else {
            console.log('✅ Producto creado (modo demo)');
            res.json({ 
                success: true, 
                id: Date.now(),
                message: 'Producto creado (modo demo)'
            });
        }
    } catch (error) {
        console.error('Error creando producto:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al crear el producto',
            details: error.message
        });
    }
});

// Ruta PUT para actualizar producto
app.put('/api/productos/:id', async (req, res) => {
    try {
        const productoId = req.params.id;
        const { nombre, descripcion, categoria, material, precio, costo, stock, stock_minimo, peso_gramos, piedras, tipo_piedras } = req.body;
        
        console.log(`✏️ Actualizando producto ID: ${productoId}`, req.body);
        
        if (connection) {
            const [result] = await connection.execute(
                `UPDATE productos 
                 SET nombre = ?, descripcion = ?, categoria = ?, material = ?, 
                     precio = ?, costo = ?, stock = ?, stock_minimo = ?, 
                     peso_gramos = ?, piedras = ?, tipo_piedras = ?
                 WHERE id = ?`,
                [nombre, descripcion, categoria, material, precio, costo, stock, stock_minimo, peso_gramos, piedras, tipo_piedras, productoId]
            );
            
            if (result.affectedRows > 0) {
                console.log(`✅ Producto ${productoId} actualizado exitosamente`);
                res.json({ 
                    success: true,
                    message: 'Producto actualizado exitosamente',
                    affectedRows: result.affectedRows
                });
            } else {
                console.log(`❌ Producto ${productoId} no encontrado`);
                res.status(404).json({ 
                    success: false,
                    message: 'Producto no encontrado'
                });
            }
        } else {
            console.log(`✅ Producto ${productoId} actualizado (modo demo)`);
            res.json({ 
                success: true,
                message: 'Producto actualizado (modo demo)'
            });
        }
    } catch (error) {
        console.error('Error actualizando producto:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al actualizar el producto',
            details: error.message
        });
    }
});

// Ruta DELETE para eliminar producto
app.delete('/api/productos/:id', async (req, res) => {
    try {
        const productoId = req.params.id;
        
        console.log(`🗑️ Eliminando producto ID: ${productoId}`);
        
        if (connection) {
            const [result] = await connection.execute(
                'UPDATE productos SET activo = 0 WHERE id = ?',
                [productoId]
            );
            
            if (result.affectedRows > 0) {
                console.log(`✅ Producto ${productoId} eliminado exitosamente`);
                res.json({ 
                    success: true,
                    message: 'Producto eliminado exitosamente',
                    affectedRows: result.affectedRows
                });
            } else {
                console.log(`❌ Producto ${productoId} no encontrado`);
                res.status(404).json({ 
                    success: false,
                    message: 'Producto no encontrado'
                });
            }
        } else {
            console.log(`✅ Producto ${productoId} eliminado (modo demo)`);
            res.json({ 
                success: true,
                message: 'Producto eliminado (modo demo)'
            });
        }
    } catch (error) {
        console.error('Error eliminando producto:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al eliminar el producto',
            details: error.message
        });
    }
});

// Ruta POST para login
app.post('/api/login', async (req, res) => {
    try {
        console.log('🔐 Intento de login');
        
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        if (connection) {
            const [results] = await connection.execute(
                'SELECT id, email, nombre, rol FROM usuarios WHERE email = ? AND password = ? AND activo = 1',
                [email, password]
            );
            
            if (results.length > 0) {
                console.log('✅ Login exitoso para:', email);
                res.json({ 
                    success: true, 
                    user: results[0] 
                });
            } else {
                console.log('❌ Login fallido para:', email);
                res.status(401).json({ 
                    success: false, 
                    message: 'Credenciales incorrectas' 
                });
            }
        } else {
            if (email === 'admin@inventarios.com' && password === '123456') {
                res.json({
                    success: true,
                    user: {
                        id: 1,
                        email: 'admin@inventarios.com',
                        nombre: 'Administrador Beauty You',
                        rol: 'admin'
                    }
                });
            } else {
                res.status(401).json({ 
                    success: false, 
                    message: 'Credenciales incorrectas' 
                });
            }
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta GET para obtener proveedores
app.get('/api/proveedores', async (req, res) => {
    try {
        if (connection) {
            const [results] = await connection.execute('SELECT * FROM proveedores WHERE activo = 1');
            res.json(results);
        } else {
            res.json([
                {
                    id: 1,
                    nombre: "Plata Fina S.A.S.",
                    contacto: "Ana María Rodríguez",
                    telefono: "3012345678",
                    email: "ventas@platafina.com",
                    especialidad: "Plata"
                }
            ]);
        }
    } catch (error) {
        console.error('Error en /api/proveedores:', error);
        res.status(500).json({ error: error.message });
    }
});

// Ruta OPTIONS para preflight requests
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

// Manejo de errores 404
app.use('*', (req, res) => {
    if (req.originalUrl.startsWith('/api/')) {
        res.status(404).json({ 
            error: 'Ruta API no encontrada',
            method: req.method,
            url: req.originalUrl
        });
    } else {
        // Para rutas del frontend, servir la página principal
        res.sendFile(path.join(__dirname, '..', 'login.html'));
    }
});

// Inicializar servidor
async function startServer() {
    await connectToDatabase();
    
    app.listen(port, '0.0.0.0', () => {
        console.log('='.repeat(60));
        console.log('💎 BEAUTY YOU - SISTEMA COMPLETO');
        console.log('='.repeat(60));
        console.log(`🚀 Servidor ejecutándose en: http://localhost:${port}`);
        console.log(`📱 Frontend: http://localhost:${port}/`);
        console.log(`🔧 API: http://localhost:${port}/api`);
        console.log(`📊 Productos: http://localhost:${port}/api/productos`);
        console.log(`💾 MySQL: ${connection ? '✅ CONECTADO' : '❌ NO CONECTADO'}`);
        console.log('='.repeat(60));
        console.log('✨ ¡El sistema está listo para usar!');
        console.log('📝 Abre tu navegador en: http://localhost:3001');
        console.log('='.repeat(60));
    });
}

startServer().catch(console.error);