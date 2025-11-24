class DatabaseService {
    constructor() {
        this.apiUrl = '/api';  // ← Cambia a ruta relativa
    }

    async request(endpoint, options = {}) {
        try {
            console.log(`🌐 Haciendo request a: ${this.apiUrl}${endpoint}`, options.method || 'GET');
            
            const response = await fetch(`${this.apiUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                ...options
            });
            
            console.log(`📨 Response status: ${response.status} ${response.statusText}`);
            
            if (!response.ok) {
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {}
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            console.log(`✅ Response exitosa de ${endpoint}:`, data);
            return data;
            
        } catch (error) {
            console.error(`❌ Error en ${endpoint}:`, error);
            throw error;
        }
    }

    // Métodos para productos
    async getProductos() {
        return await this.request('/productos');
    }

    async createProducto(producto) {
        return await this.request('/productos', {
            method: 'POST',
            body: JSON.stringify(producto)
        });
    }

    async updateProducto(id, producto) {
        return await this.request(`/productos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(producto)
        });
    }

    async deleteProducto(id) {
        return await this.request(`/productos/${id}`, {
            method: 'DELETE'
        });
    }

    // Método para login
    async login(email, password) {
        return await this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }
}

// Instancia global
const database = new DatabaseService();
