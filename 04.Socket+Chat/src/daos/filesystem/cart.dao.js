import fs from "fs";

export default class CartDaoFS {
  constructor(path) {
    this.path = path;
  }

  async #getMaxId() {
    let maxId = 0;
    const carts = await this.getAll();
    carts.map((car) => {
      if (car.id > maxId) maxId = car.id;
    });
    return maxId;
  }

  async getAll() {
    try {
      if (fs.existsSync(this.path)) {
        const carts = await fs.promises.readFile(this.path, "utf-8");
        const cartsJSON = JSON.parse(carts);
        return cartsJSON;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      const carts = await this.getAll();
      const cart = carts.find((car) => car.id === Number(id));
      if (cart) {
        return cart;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  async create(obj) {
    try {
      const cart = {
        id: (await this.#getMaxId()) + 1,
        ...obj,
      };
      const cartsFile = await this.getAll();
      cartsFile.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(cartsFile));
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async update(obj, id) {
    try {
      const cartsFile = await this.getAll();
      const index = cartsFile.findIndex((car) => car.id === id);
      if (index === -1) {
        throw new Error(`Id ${id} not found`);
      } else {
        cartsFile[index] = { ...obj, id };
      }
      await fs.promises.writeFile(this.path, JSON.stringify(cartsFile));
    } catch (error) {
      console.log(error);
    }
  }

  async delete(id) {
    try {
      const cartsFile = await this.getAll();
      if (cartsFile.length > 0) {
        const newArray = cartsFile.filter((car) => car.id !== id);
        await fs.promises.writeFile(this.path, JSON.stringify(newArray));
      } else {
        throw new Error(`Cart id: ${id} not found`);
      }
    } catch (error) {
      console.log(error);
    }
  }


}
