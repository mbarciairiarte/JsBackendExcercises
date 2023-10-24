/*Esto importa el framework Express*/
import express from 'express';
/*Aquí se importa la clase ProductManager desde el archivo ProductManager.js*/
import ProductManager from './ProductManager.js';
import CartManager from './CartManager.js';

/*Aquí se crea una nueva instancia de la aplicación Express*/
const app = express();

/*Se instancia un nuevo objeto ProductManager para poder utilizar sus métodos en el servidor.*/
const productManager = new ProductManager();
// Crear una instancia de CartManager
const cartManager = new CartManager();


// Implementar las rutas para los carritos según las especificaciones mencionadas en el ejercicio

// Asegurarse de guardar los carritos en el archivo después de cualquier modificación


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
  try {1
    const product = await productManager.getProductById(pid);
    /*Devuelve el producto correspondiente al pid proporcionado en la solicitud */
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


app.post('/carts', (req, res) => {
    const newCart = cartManager.addCart(); // Asumiendo que tienes un método addCart() en tu CartManager para agregar un nuevo carrito
    console.log('Nuevo carrito creado:', newCart);
    res.json(newCart); // Devuelve el nuevo carrito como respuesta a la solicitud
  });



  app.get('/carts/:cartId', (req, res) => {
    const { cartId } = req.params;

    try {
        const cart = cartManager.getCartById(cartId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.post('/carts/:cartId/products/:productId', (req, res) => {
  const { cartId, productId } = req.params;

  try {
      const products = productManager.getProducts(); // Obtener los productos del administrador de productos
      const productToAdd = products.find((product) => product.id === productId);
      if (!productToAdd) {
          return res.status(404).json({ error: 'El producto no se encuentra en la lista de productos disponibles.' });
      }

      cartManager.addProductToCart(cartId, productId, productToAdd);
      res.status(200).json({ message: 'Producto agregado al carrito con éxito.' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});



/*quí se inicia el servidor Express en el puerto especificado y se imprime un mensaje en la consola indicando que 
el servidor está en funcionamiento */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


