import { Schema, model } from "mongoose";

export const cartsCollectionName = "cart";

const cartsSchema = new Schema({
  products: { type: String }
  });

export const CartModel = model(
  cartsCollectionName,
  cartsSchema
);
