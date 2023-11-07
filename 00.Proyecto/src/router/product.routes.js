import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";

const ProductRouter = Router();
const product = new ProductManager();

ProductRouter.get("/", async(req, res)=>{
    res.send(await product.getProducts());
})

ProductRouter.get("/:id", async(req, res)=>{
    let id = req.params.id
    res.send(await product.getProductsById(id));
})

ProductRouter.post("/", async(req, res)=>{
    let newProduct = req.body
    res.send(await product.addProducts(newProduct));
})

ProductRouter.put("/:id", async(req, res)=>{
    let id = req.params.id
    let updateProduct = req.body;
    res.send(await product.updateProducts(id, updateProduct));
})

ProductRouter.delete("/:id", async(req, res)=>{
    let id = req.params.id
    res.send(await product.deleteProducts(id));
})

export default ProductRouter;