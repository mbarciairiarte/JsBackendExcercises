import CartDaoMongoDB from "../daos/mongodb/cart.dao.js";
const cartDao = new CartDaoMongoDB();

// import CartDaoFS from "../daos/filesystem/cart.dao.js";
// import { __dirname } from "../utils.js";
// const cartDao = new CartDaoFS(
//   __dirname + "/daos/filesystem/data/carts.json"
// );

export const getAll = async () => {
  try {
    return await cartDao.getAll();
  } catch (error) {
    console.log(error);
  }
};

export const getById = async (id) => {
  try {
    const car = await cartDao.getById(id);
    if (!car) return false;
    else return car;
  } catch (error) {
    console.log(error);
  }
};

export const create = async (obj) => {
  try {
    const newCart = await cartDao.create(obj);
    if (!newCart) return false;
    else return newCart;
  } catch (error) {
    console.log(error);
  }
};

export const update = async (id, obj) => {
  try {
    const cartUpd = await cartDao.update(id, obj);
    if (!cartUpd) return false;
    else return cartUpd;
  } catch (error) {
    console.log(error);
  }
};

export const remove = async (id) => {
  try {
    const cartDel = await cartDao.delete(id);
    if (!cartDel) return false;
    else return cartDel;
  } catch (error) {
    console.log(error);
  }
};
