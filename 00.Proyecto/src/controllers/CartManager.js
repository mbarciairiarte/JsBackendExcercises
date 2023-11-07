import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import ProductManager from "./ProductManager.js";

const productAll = new ProductManager;

class CartManager {
  constructor() {
    this.path = "./src/models/carts.json";
  }
  readCarts = async () => {
    let carts = await fs.readFile(this.path, "utf-8");
    return JSON.parse(carts);
  };

  writeCarts = async (cart) => {
    await fs.writeFile(this.path, JSON.stringify(cart));
  };

  exist = async (id) => {
    let carts = await this.readCarts();
    return carts.find((cart) => cart.id === id);
  };

  addCarts = async () => {
    let cartsOld = await this.readCarts();
    let id = nanoid();
    let cartsConcat = [{ id: id, products: [] }, ...cartsOld];
    await this.writeCarts(cartsConcat);
    return "Cart Added";
  };

  getCartsById = async (id) => {
    let cartById = await this.exist(id);
    if (!cartById) return "Cart not found";
    return cartById;
  };

  addProductInCart = async (cartId, productId) => {
    let cartById = await this.exist(cartId);
    if (!cartById) return "Cart not found";
    let productById = await productAll.exist(productId);
    if(!cartById) return "Product not found";
    let cartsAll = await this.readCarts(); 
    let cartFilter = cartsAll.filter(cart => cart.id != cartId);

    if(cartById.products.some(prod => prod.id === productId)){
      let moreProductInCart = cartById.products.find((prod) => prod.id === productId);
      moreProductInCart.cantidad++;
      let cartsConcat = [cartById, ...cartFilter];
      await this.writeCarts(cartsConcat);
      return "Product Added to Cart";
    }

    cartById.products.push({id:productById.id, cantidad: 1})


    let cartsConcat = [cartById, ...cartFilter];
    await this.writeCarts(cartsConcat)
    return "New Product Added to Cart"
  };
}

export default CartManager;
