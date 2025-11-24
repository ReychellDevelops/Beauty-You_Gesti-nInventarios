# 💎 Beauty You - Sistema de Gestión de Inventarios

Sistema completo de gestión de inventarios para joyería desarrollado con Node.js, Express, MySQL y JavaScript.

## 🚀 Características

- **Gestión de Productos**: CRUD completo para productos de joyería
- **Sistema de Roles**: Administrador y Vendedor con permisos diferenciados
- **Dashboard**: Estadísticas e informes del inventario
- **API REST**: Backend completo con Node.js y Express
- **Base de Datos**: MySQL con estructura relacional
- **Interfaz Responsiva**: Frontend moderno con Bootstrap

## 🛠️ Tecnologías

- **Backend**: Node.js, Express, MySQL2
- **Frontend**: JavaScript vanilla, Bootstrap 5, Fetch API
- **Base de Datos**: MySQL
- **Autenticación**: Sessions con localStorage

## 📦 Módulos Implementados

- ✅ Autenticación y roles
- ✅ Gestión de productos (CRUD completo)
- ✅ Dashboard con estadísticas
- ✅ Gestión de proveedores
- ✅ Gestión de clientes
- ✅ Módulo de ventas (estructura)
- ✅ Módulo de compras (estructura)

## 🚀 Instalación

1. Clonar el repositorio:
en bash
git clone https://github.com/ReychellDevelops/beauty-you-inventarios.git

2. Instalar dependencias:
en bash
cd beauty-you-inventarios/api
npm install

3. Configurar base de datos MySQL:
en workbench
Crear base de datos sistema_inventarios
Ejecutar el script SQL incluido

4. ejecutar el servidor
en bash en la carpeta en donde se encuentra el proyecto
node server.js

5. Abrir en el navegador
http://localhost:3001


## 👤 Credenciales de Prueba

**Administrador:**

    Email: admin@inventarios.com

    Password: 123456

**Vendedor:**

    Email: vendedor@inventarios.com

    Password: 123456

## 📁 Estructura del Proyecto ##
beauty-you-inventarios/
├── .gitignore
├── README.md
├── package.json
├── database.sql
├── api/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── database.js
├── js/
│   ├── app.js
│   ├── database.js
│   └── modules/
│       ├── productos.js
│       ├── dashboard.js
│       ├── proveedores.js
│       ├── clientes.js
│       ├── ventas.js
│       └── compras.js
├── vistas/
│   ├── productos.html
│   ├── dashboard.html
│   ├── proveedores.html
│   ├── clientes.html
│   ├── ventas.html
│   └── compras.html
├── index.html
└── login.html

## 👥 Roles y Permisos ##

    Administrador: Acceso completo (crear, ver, editar, eliminar)

    Vendedor: Solo lectura y edición de productos

## 📄 Licencia ##

Este proyecto es para fines educativos.
