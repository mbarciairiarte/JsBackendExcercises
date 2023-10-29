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
      } else return [];
    } catch (error) {
      console.log(error);
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

  async createCart(obj) {
    try {
      const cart = {
        id: (await this.#getMaxId()) + 1,
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
        const cart = carts.find(cart => cart.id === id);
        if(!cart) return false;
        return cart;
    } catch (error) {
        console.log(error);
    }
  }

  async updateCart(obj, id){
    try {
        const carts = await this.getCarts();    // [{},{}]
        const index = carts.findIndex(cart => cart.id === id);  // posición ó -1
        if(index === -1) return false;
        else{
            const cartUpdt = { ...obj, id };
            carts[index] = cartUpdt;
        }
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
    } catch (error) {
        console.log(error);
    }
  }

  async deleteCart(id){
    try {
        const carts = await this.getCarts();
        if(carts.length < 0) return false;
        const newArray = carts.filter(cart => cart.id !== id);
        await fs.promises.writeFile(this.path, JSON.stringify(newArray));
    } catch (error) {
        console.log(error);
    }
  }

      // Método para agregar un producto a un carrito
     addProductToCart(idCart, idProd, quantity) {
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
        }
        this.saveCarts();
        return cart;
    }

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
