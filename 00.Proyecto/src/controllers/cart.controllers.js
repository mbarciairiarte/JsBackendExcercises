// import { getAll, getById, create, update, remove } from "../services/cart.services.js";
import * as service from "../services/cart.services.js";

export const getAll = async (req, res, next) => {
  try {
    const response = await service.getAll();
    res.status(200).json(response);
  } catch (error) {
    next(error.message);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await service.getById(id);
    if (!response) res.status(404).json({ msg: "Cart Not found!" });
    else res.status(200).json(response);
  } catch (error) {
    next(error.message);
  }
};

export const create = async (req, res, next) => {
  try {
    const newCart = await service.create(req.body);
    if (!newCart) res.status(404).json({ msg: "Error create cart!" });
    else res.status(200).json(newCart);
  } catch (error) {
    next(error.message);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cartUpd = await service.update(id, req.body);
    if (!cartUpd) res.status(404).json({ msg: "Error update cart!" });
    else res.status(200).json(cartUpd);
  } catch (error) {
    next(error.message);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cartDel = await service.remove(id);
    if (!cartDel) res.status(404).json({ msg: "Error delete cart!" });
    else res.status(200).json({ msg: `Cart id: ${id} deleted` });
  } catch (error) {
    next(error.message);
  }
};
