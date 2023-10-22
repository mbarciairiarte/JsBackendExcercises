/*Esto importa el framework Express*/
import express from 'express';
/*Aquí se importa la clase ProductManager desde el archivo ProductManager.js*/
import ProductManager from './ProductManager.js';

/*Aquí se crea una nueva instancia de la aplicación Express*/
const app = express();

/*Se instancia un nuevo objeto ProductManager para poder utilizar sus métodos en el servidor.*/
const productManager = new ProductManager();

/*Esto establece el puerto en el que el servidor Express escuchará las solicitudes entrantes*/
const PORT = 8080;

/*Aquí se define un endpoint GET en la ruta '/products'. Cuando se recibe una solicitud GET en 
esta ruta, se ejecuta el bloque de código proporcionado. La función async se utiliza para admitir el uso 
de await dentro de ella, lo que permite operaciones asincrónicas */
app.get('/products', async (req, res) => {
    /*Esta línea desestructura el objeto query de la solicitud y extrae el valor de limit si está presente en la consulta */
  const { limit } = req.query;
  try {
    const products = await productManager.getProducts();
    if (limit) {
        /*Si se proporciona un límite, esto devuelve una porción de los productos basada en el valor del límite. Si no 
        se proporciona un límite, devuelve todos los productos. */
      res.json(products.slice(0, parseInt(limit)));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
/*Este es otro endpoint GET que utiliza un parámetro de ruta pid. Cuando se recibe una solicitud GET en esta ruta con un 
parámetro pid, se ejecuta el bloque de código proporcionado*/
app.get('/products/:pid', async (req, res) => {
    /*Aquí se extrae el valor del parámetro pid de la solicitud. */
  const { pid } = req.params;
  try {
    const product = await productManager.getProductById(pid);
    /*Devuelve el producto correspondiente al pid proporcionado en la solicitud */
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/*quí se inicia el servidor Express en el puerto especificado y se imprime un mensaje en la consola indicando que 
el servidor está en funcionamiento */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
