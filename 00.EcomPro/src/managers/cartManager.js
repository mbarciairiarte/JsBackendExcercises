import fs from "fs";
//import { ProductManager } from "../managers/productManager.js";

export class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const cartsJSON = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(cartsJSON);
      } else {
        console.log(`El archivo en la ruta ${this.path} no existe.`);
        return [];
      }
    } catch (error) {
      console.error(`Error al leer el archivo en la ruta ${this.path}: ${error}`);
      throw new Error(`Error al leer el archivo en la ruta ${this.path}: ${error}`);
    }
  }


  async #getMaxId() {
    let maxId = 0;
    const carts = await this.getCarts();
    carts.map((cart) => {
      if (cart.id > maxId) maxId = cart.id;
    });
    return maxId;
  }
  
  
  /*async saveCarts(carts) {
    try {
      if (!Array.isArray(carts)) {
        throw new Error('La variable carts no es un array.');
      }
  
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    } catch (error) {
      console.error(`Error al guardar los carritos en el archivo ${this.path}: ${error}`);
      throw new Error(`Error al guardar los carritos en el archivo ${this.path}: ${error}`);
    }
  }*/
  
  
  
  async createCart(obj) {
    try {
      const cart = {
        id: (await this.#getMaxId()) + 1,
        status: true,
        ...obj,
      };
      const carts = await this.getCarts();
      carts.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      return cart;
    } catch (error) {
      console.log(error);
    }
  }
  
  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      console.log('Cart list:', carts); // Imprimir la lista de productos cargada
      console.log('Requested cart ID:', id); // Imprimir el ID del producto solicitado
  
      const cart = carts.find(p => p.id === id);
      if (!cart) {
        console.log(`Cart with ID ${id} not found.`);
        return false;
      } else {
        console.log(`Cart with ID ${id} found:`, cart);
        return cart;
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener el producto por su ID.');
    }
  }
  /*
  async getCartById(id) {
    try {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === id);
        if(!cart) return false;
        return cart;
    } catch (error) {
        console.log(error);
    }
  }*/

  async updateCart(obj, id) {
    try {
      const carts = await this.getCarts();
      const index = carts.findIndex(cart => cart.id === id);
      if (index === -1) return false;
      else {
        const cartUpdt = { ...obj, id };
        carts[index] = cartUpdt;
      }
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCart(id) {
    try {
      const carts = await this.getCarts();
      if (carts.length < 0) return false;
      const newArray = carts.filter(cart => cart.id !== id);
      await fs.promises.writeFile(this.path, JSON.stringify(newArray));
    } catch (error) {
      console.log(error);
    }
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

  
  
  


  // Método para agregar un producto a un carrito
  /*async addProductToCart(idCart, idProd, quantity) {
    try {
    const cart = this.getCartById(idCart);
    if (!Array.isArray(cart.products)) {
      // Si cart.products no es un array, inicialízalo como un array vacío
      cart.products = [];
    }

    const existingProduct = cart.products.find(product => product.id === idProd);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ id: idProd, quantity });
      await fs.promises.writeFile(this.path, JSON.stringify(cart)); 
    }
    this.saveCarts();
    return cart;
  }catch (error) {
    console.log(error);
  }}*/

  // Método para agregar un producto al carrito por su ID
  /*addProductToCart(idCart, idProd, quantity) {
    const cart = this.getCartById(idCart);
    const products = productManager.getProducts(); // Asegúrate de que la función getProducts no tenga parámetros
  
    const productToAdd = products.find((product) => product.id === idProd);
    
    if (!productToAdd) {
        throw new Error('El producto no se encuentra en la lista de productos disponibles.');
    }
  
    if (!Array.isArray(cart.products)) {
        cart.products = []; // Asegúrate de que la propiedad products sea un array
    }
  
    const existingProduct = cart.products.find((product) => product.id === idProd);
  
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.products.push({ id: idProd, name: productToAdd.name, quantity, price: productToAdd.price });
    }
    this.saveCarts();
    return cart;
  }*/


  /*async saveProductToCart(idCart, idProd){
      const carts = await this.getCarts();
      const cartExists = await this.getCartById(idCart);
      if(cartExists){
          const existProdInCart = cartExists.products.find(p => p.id === idProd);
          if(existProdInCart) existProdInCart.quantity + 1
          else {
              const prod = {
                  product: idProd,
                  quantity: 1
              };
              cartExists.products.push(prod);
          }
          await fs.promises.writeFile(this.path, JSON.stringify(carts));
          return cartExists;
      }
    }*/
}
