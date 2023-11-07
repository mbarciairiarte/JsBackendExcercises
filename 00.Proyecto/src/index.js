import express from "express";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/cart.routes.js";
import { engine } from "express-handlebars";
import * as path from "path";
import __dirname from "./utils.js";
import ProductManager from "./controllers/ProductManager.js";
import { Server } from "socket.io";

const app = express();
//const PORT = 8080;
const httpServer = app.listen(8080, () =>
  console.log(`Servidor express on port 8080`)
);
const socketServer = new Server(httpServer);
const product = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

//static
app.use("/", express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
  let allProducts = await product.getProducts();
  res.render("home", {
    title: "Ecom | Project",
    products: allProducts,
  });
});

app.get("/:id", async (req, res) => {
  let prod = await product.getProductsById(req.params.id);
  res.render("prod", {
    title: "Ecom | Project",
    products: prod,
  });
});
//aun en desarrollo 
app.get("/realtimeproducts", async (req, res) => {
    let allProducts = await product.getProducts();
    res.render("rtp", {
      title: "Ecom | Project",
      products: allProducts,
    });
  });

app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);

socketServer.on("connection", (socket) => {
  console.log("User connected to server");

  socket.on("message", (data) => {
    console.log(data);
  });
  //???
  socket.on("update", (data) => {
    socketServer.emit("update", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });   

  //????
});

/*app.listen(PORT, ()=>{
    console.log(`Servidor express on port ${PORT}`);
})*/
