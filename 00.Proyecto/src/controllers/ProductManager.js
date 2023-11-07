import { promises as fs } from "fs";
import { nanoid } from "nanoid";

class ProductManager {
  constructor() {
    this.path = "./src/models/products.json";
  }

  readProducts = async () => {
    let products = await fs.readFile(this.path, "utf-8");
    return JSON.parse(products);
  };

  writeProducts = async (product) => {
    await fs.writeFile(this.path, JSON.stringify(product));
  };

  exist = async (id) => {
    let products = await this.readProducts();
    return products.find((prod) => prod.id === id);
  }

  addProducts = async (product) => {
    let productsLast = await this.readProducts();
    product.id = nanoid();
    let productAll = [...productsLast, product];
    await this.writeProducts(productAll);
    return "Product Added";
  };

  getProducts = async () => {
    return await this.readProducts();
  };

  getProductsById = async (id) => {
    let productById =  await this.exist(id)
    if (!productById) return "Product not found";
    return productById;
  };

  updateProducts = async (id, product) => {
    let productById =  await this.exist(id)
    if(!productById) return "Product not found"
    await this.deleteProducts(id)
    let productsLast = await this.readProducts()
    let products = [{...product, id : id}, ...productsLast]
    await this.writeProducts(products)
    return "Updated product"
  }

  deleteProducts = async (id) => {
    let products = await this.readProducts();
    let existProduct = products.some((prod) => prod.id === id);
    if (existProduct) {
        let filteredProducts = products.filter((prod) => prod.id !== id);
        await this.writeProducts(filteredProducts);
        return "Product deleted";
    }
    return "Product not found";
};
//??? 
sendRealtimeUpdate(data) {
  io.emit('update', data); 
}

}

export default ProductManager;
