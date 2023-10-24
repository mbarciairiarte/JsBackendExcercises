
import fs from 'fs';
import ProductManager from './ProductManager.js';


// Crear una nueva clase para manejar los carritos
class CartManager {

    constructor(productManager) {
        this.carts = [];
        this.productManager = productManager;
        this.loadCarts(); // Cargar los carritos almacenados en disco al iniciar
    }

    // Método para cargar los carritos desde el archivo
    async loadCarts() {
        try {
          const data = await fs.readFileSync('carts.json', 'utf8');
          this.carts = JSON.parse(data);
        } catch (err) {
          this.carts = [];
        }
      }

    // Método para guardar los carritos en el archivo
    saveCarts() {
        fs.writeFileSync('carts.json', JSON.stringify(this.carts, null, 2), 'utf8');
    }

    
// Método para agregar un nuevo carrito
addCart(cartId) {
    // Lógica para evitar la creación de carritos duplicados
    const existingCart = this.carts.find((cart) => cart.id === cartId);

    if (existingCart) {
        return existingCart; // Devuelve el carrito existente si ya existe
    }

    // Si no existe un carrito similar, crea uno nuevo y agrégalo al arreglo
    const newCart = {
        id: this.generateUniqueId(),
        products: []
    };

    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
}

// Método para agregar un producto al carrito por su ID
addProductToCart(cartId, productId, quantity) {
    const cart = this.getCartById(cartId);
    const products = productManager.getProducts(); // Obtener los productos del administrador de productos

    const productToAdd = products.find((product) => product.id === productId);
    if (!productToAdd) {
        throw new Error('El producto no se encuentra en la lista de productos disponibles.');
    }

    const existingProduct = cart.products.find((product) => product.id === productId);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.products.push({ id: productId, name: productToAdd.name, quantity, price: productToAdd.price });
    }
    this.saveCarts();
    return cart;
}

    // Método para buscar un carrito por su ID
    getCartById(id) {
        const cart = this.carts.find(cart => cart.id === id);
        if (!cart) {
            throw new Error('Carrito no encontrado.');
        }
        return cart;
    }

    // Método para agregar un producto a un carrito
    addProductToCart(cartId, productId, quantity) {
        const cart = this.getCartById(cartId);
        const existingProduct = cart.products.find(product => product.id === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ id: productId, quantity });
        }
        this.saveCarts();
        return cart;
    }

    // Método para actualizar un carrito por su ID
    updateCart(cartId, updatedData) {
        const cart = this.getCartById(cartId);
        Object.assign(cart, updatedData);
        this.saveCarts();
        return cart;
    }

    // Método para eliminar un carrito por su ID
    deleteCart(cartId) {
        const index = this.carts.findIndex(cart => cart.id === cartId);
        if (index === -1) {
            throw new Error('Carrito no encontrado.');
        }
        this.carts.splice(index, 1);
        this.saveCarts();
    }

    generateUniqueId() {
        return (
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        );
    }
}

export default CartManager;