import fs from 'fs';

import { Router } from "express";
const router = Router();
import { ProductManager } from "../managers/productManager.js";
import { CartManager } from '../managers/cartManager.js';
const cartManager = new CartManager("./src/data/carts.json");
const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const carts = await cartManager.getCarts();
    if (!limit) res.status(200).json(carts);
    else {
      const cartsByLimit = await cartManager.getCartsByLimit(limit);
      res.status(200).json(cartsByLimit);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});


// Ruta para obtener un carrito por su ID
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(Number(cid)); // Llamada al método para obtener un carrito por su ID
    if (!cart) res.status(404).json({ message: "cart not found" });
    else res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Ruta para crear un carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart(req.body); // Llamada al método para agregar un nuevo carrito
    //await cartManager.saveCarts(); // Guardar los carritos actualizados en el archivo carts.json
    res.status(200).json({ message: 'Nuevo carrito creado', cart: newCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:cid", async (req, res) => {
  try {
    const cart = { ...req.body };
    const id = req.params.cid;
    const idNumber = parseInt(id);

    if (isNaN(idNumber)) {
      res.status(400).json({ message: "Invalid cart ID provided" });
    } else {
      const cartOk = await cartManager.getCartById(idNumber);
      if (!cartOk) {
        res.status(404).json({ message: "Cart not found" });
      } else {
        await cartManager.updateCart(cart, idNumber);
        res.status(200).json({ message: `Cart with ID ${idNumber} updated` });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const idNumber = Number(id);
    await cartManager.deleteCart(idNumber);
    res.json({ message: `Cart id: ${idNumber} deleted` });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post('/:cartId/products/:productId', (req, res) => {

  const { cartId, productId } = req.params;
 
  try {
 
   const product = productManager.getProductById(Number(productId));
 
   if (!product) {
 
    res.status(404).json({ error: 'El producto no se encuentra en la lista de productos disponibles.' });
 
    return;
 
   }
 
 
 
   cartManager.addProductToCart(cartId, productId, product);
 
   res.status(200).json({ message: 'Producto agregado al carrito con éxito.' });
 
  } catch (error) {
 
   res.status(500).json({ error: error.message });
 
  }
 
 });


export default router;

