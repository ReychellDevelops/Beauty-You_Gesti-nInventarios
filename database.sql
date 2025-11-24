-- Beauty You - Sistema de Gestión de Inventarios
-- Script de creación de base de datos

CREATE DATABASE IF NOT EXISTS sistema_inventarios;
USE sistema_inventarios;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    rol ENUM('admin', 'vendedor') DEFAULT 'vendedor',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria ENUM('Aretes', 'Collares', 'Anillos', 'Pulseras', 'Relojes') NOT NULL,
    material ENUM('Oro', 'Plata', 'Acero', 'Chapado', 'Otros') DEFAULT 'Plata',
    precio DECIMAL(10,2) NOT NULL,
    costo DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    stock_minimo INT DEFAULT 5,
    peso_gramos DECIMAL(8,2),
    piedras BOOLEAN DEFAULT FALSE,
    tipo_piedras VARCHAR(100),
    imagen VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de proveedores
CREATE TABLE proveedores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    especialidad ENUM('Oro', 'Plata', 'Piedras', 'Relojes', 'Varios') DEFAULT 'Varios',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    email VARCHAR(100),
    telefono VARCHAR(20),
    direccion TEXT,
    tipo_documento ENUM('CC', 'CE', 'NIT', 'PASAPORTE') DEFAULT 'CC',
    numero_documento VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuarios de prueba
INSERT INTO usuarios (email, password, nombre, rol) VALUES 
('admin@inventarios.com', '123456', 'Administrador Principal', 'admin'),
('vendedor@inventarios.com', '123456', 'Vendedor Junior', 'vendedor');

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, descripcion, categoria, material, precio, costo, stock, peso_gramos, piedras, tipo_piedras) VALUES 
('Aretes de Perla Cultivada', 'Elegantes aretes de perla cultivada con terminación en plata 925', 'Aretes', 'Plata', 55000, 35000, 25, 8.5, TRUE, 'Perla cultivada'),
('Collar Corazón de Plata', 'Collar con dije de corazón en plata 925, cadena de 45cm', 'Collares', 'Plata', 78000, 52000, 15, 12.3, FALSE, NULL),
('Anillo Solitario Diamante', 'Anillo en oro 18k con diamante central de 0.25ct', 'Anillos', 'Oro', 920000, 650000, 8, 4.2, TRUE, 'Diamante');

-- Insertar proveedores de ejemplo
INSERT INTO proveedores (nombre, contacto, telefono, email, especialidad) VALUES 
('Plata Fina S.A.S.', 'Ana María Rodríguez', '3012345678', 'ventas@platafina.com', 'Plata'),
('Oro Precioso Ltda.', 'Carlos Andrés Gómez', '3158765432', 'compras@oroprecioso.com', 'Oro');