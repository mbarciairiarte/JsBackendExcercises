import fs from 'fs';

import { Router } from "express";
const router = Router();
import { ProductManager } from "../managers/productManager.js";
import { CartManager } from '../managers/cartManager.js';
const cartManager = new CartManager("./src/data/carts.json");
const productManager = new ProductManager();

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
        if(!cart) res.status(404).json({message: "cart not found"});
        else res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

// Ruta para crear un carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart(req.body); // Llamada al método para agregar un nuevo carrito
       // cartManager.saveCarts(); // Guardar los carritos actualizados en el archivo carts.json
        res.status(200).json({ message: 'Nuevo carrito creado', cart: newCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:idCart/products/:idProduct', async (req, res) => {
    const { idCart, idProd } = req.params;
  
    try {
        const cart = await cartManager.getCartById(idCart); // Llamar método que busca el carrito por su ID
        const productToAdd = await productManager.getProductById(idProd); // Llamar método que busca el producto por su ID
        if (!productToAdd) {
            return res.status(404).json({ error: 'El producto no se encuentra en la lista de productos disponibles.' });
        }
  
        cartManager.addProductToCart(idCart, idProd, productToAdd);
        res.status(200).json({ message: 'Producto agregado al carrito con éxito.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  });

/*router.post('/:idCart/products/:idProd', async (req, res) => {
    const { idProd, idCart } = req.params; // ID de un carrito existente
    try {
        const cart = await cartManager.getCartById(idCart); // Llamar método que busca el carrito por su ID
        const product = await productManager.getProductById(idProd); // Llamar método que busca el producto por su ID

        if (product) {
            const updatedCart = await cartManager.saveProductToCart(idCart, idProd);
            res.status(200).json({ message: 'Producto agregado al carrito con éxito.', cart: updatedCart });
        } else {
            res.status(404).json({ error: 'El producto no se encuentra en la lista de productos disponibles.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
});*/

export default router;

