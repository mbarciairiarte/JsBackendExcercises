
/*Este programa permite agregar, listar, buscar, modificar y eliminar productos, 
y guarda los datos en un archivo JSON para que persistan entre sesiones*/


/*Aquí se importan los módulos fs y readline. fs se utiliza para trabajar con archivos y 
directorios, mientras que readline se usa para interactuar con el usuario en la línea de comandos*/

const fs = require('fs');
const readline = require('readline');

/*Se crea una interfaz para leer desde la entrada estándar (teclado) y 
escribir en la salida estándar (pantalla)*/
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class ProductManager {
  /*constructor
  La clase ProductManager tiene un constructor que inicializa un arreglo vacío de 
  productos y luego carga los productos almacenados en disco*/
  constructor() {
    this.products = [];
    this.loadProducts(); // Cargar productos almacenados en disco al iniciar
  }
  
  // Este método devuelve la lista de productos
  getProducts() {
    return this.products;
  }
  // Método para agregar un nuevo producto
  addProduct({ title, description, price, thumbnail, code, stock }) {
    // Verificar si el código ya está en uso
	const existingProduct = this.products.find((product) => product.code === code);
    if (existingProduct) {
      throw new Error("El código del producto ya está en uso.");
    }
	// Generar un ID único
    const id = this.generateUniqueId();
	
	// Crear el nuevo producto 
    const newProduct = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
	// Agregar el producto al arreglo de productos
    this.products.push(newProduct);
    
	// Guarda los productos en el archivo
	this.saveProducts();
	
	// Devuelve el nuevo producto
    return newProduct;
  }

  // este metodo busca un producto por su ID y lo devuelve.
  // Si no lo encuentra, lanza un error
  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error("Producto no encontrado.");
    }
    return product;
  }
  
  //metodo para modificar producto
  modifyProduct(id, { title, description, price, thumbnail, code, stock }) {
    // Busca el producto por su ID.
	const product = this.getProductById(id);
	// Actualiza los campos del producto.
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (thumbnail) product.thumbnail = thumbnail;
    if (code) product.code = code;
    if (stock) product.stock = stock;
    // Guarda los productos en el archivo
	this.saveProducts();
	// Devuelve el producto actualizado
    return product;
  }
  
  //método para eliminar un producto
  deleteProduct(id) {
	 // Busca el producto por su ID y lo elimina del arreglo
	 // Si no lo encuentra, lanza un error
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error("Producto no encontrado.");
    }
    this.products.splice(index, 1);
	// Guarda los productos en el archivo
    this.saveProducts();
  }
  
  //metodos loadProducts y saveProducts se encargan de cargar y guardar los productos en un archivo JSON
  loadProducts() {
    try {
      const data = fs.readFileSync('products.json', 'utf8');
      this.products = JSON.parse(data);
    } catch (err) {
      this.products = [];
    }
  }

  saveProducts() {
    fs.writeFileSync('products.json', JSON.stringify(this.products, null, 2), 'utf8');
  }
  
  //método generatedUniqueId, genera ID único para los productos
  generateUniqueId() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
//Se crea una instancia de la clase ProductManager para gestionar los productos
const productManager = new ProductManager();

//función askQuestion se utiliza para hacer preguntas al usuario y obtener respuestas como promesas 
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

/*
Funciones asincrónicas (agregarNuevoProducto, buscarProductoPorId, modificarProducto, eliminarProducto):
Estas funciones se encargan de interactuar con el usuario para agregar, buscar, modificar y eliminar productos. 
Se utilizan para capturar la entrada del usuario y realizar las acciones correspondientes
*/
async function agregarNuevoProducto() {
  try {
    const title = await askQuestion("Ingrese el título del producto: ");
    const description = await askQuestion("Ingrese la descripción del producto: ");
    const price = parseFloat(await askQuestion("Ingrese el precio del producto: "));
    const thumbnail = await askQuestion("Ingrese la URL de la imagen (thumbnail) del producto: ");
    const code = await askQuestion("Ingrese el código del producto: ");
    const stock = parseInt(await askQuestion("Ingrese la cantidad en stock del producto: "));

    const newProduct = productManager.addProduct({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });

    console.log('Producto agregado con éxito:');
    console.log(newProduct);
  } catch (error) {
    console.error('Error al agregar el producto:', error.message);
  } finally {
    mostrarMenu();
  }
}

async function buscarProductoPorId() {
  try {
    const id = await askQuestion("Ingrese el ID del producto que desea buscar: ");
    const product = productManager.getProductById(id);
    console.log("Producto encontrado:");
    console.log(product);
  } catch (error) {
    console.error("Error al buscar el producto:", error.message);
  }
  mostrarMenu();
}

async function modificarProducto() {
  try {
    const id = await askQuestion("Ingrese el ID del producto que desea modificar: ");
    const product = productManager.getProductById(id);

    const newTitle = await askQuestion(`Ingrese el nuevo título del producto (antes: ${product.title}): `);
    const newDescription = await askQuestion(`Ingrese la nueva descripción del producto (antes: ${product.description}): `);
    const newPrice = parseFloat(await askQuestion(`Ingrese el nuevo precio del producto (antes: ${product.price}): `));
    const newThumbnail = await askQuestion(`Ingrese la nueva URL de la imagen (thumbnail) del producto (antes: ${product.thumbnail}): `);
    const newCode = await askQuestion(`Ingrese el nuevo código del producto (antes: ${product.code}): `);
    const newStock = parseInt(await askQuestion(`Ingrese la nueva cantidad en stock del producto (antes: ${product.stock}): `));

    const updatedProduct = productManager.modifyProduct(id, {
      title: newTitle,
      description: newDescription,
      price: newPrice,
      thumbnail: newThumbnail,
      code: newCode,
      stock: newStock,
    });

    console.log('Producto modificado con éxito:');
    console.log(updatedProduct);
  } catch (error) {
    console.error("Error al modificar el producto:", error.message);
  }
  mostrarMenu();
}

async function eliminarProducto() {
    try {
      const id = await askQuestion("Ingrese el ID del producto que desea eliminar: ");
      productManager.deleteProduct(id);
      console.log('Producto eliminado con éxito.');
    } catch (error) {
      console.error("Error al eliminar el producto:", error.message);
    }
    mostrarMenu();
  }
  
  /*Función menú
  Muestra un menú con opciones numeradas.
  Pide al usuario que seleccione una opción.
  Llama a la función `handleMenuOption` para manejar la opción seleccionada.*/
  function mostrarMenu() {
    console.log("\nMenú:");
    console.log("1. Agregar nuevo producto");
    console.log("2. Listar todos los productos");
    console.log("3. Buscar producto por ID");
    console.log("4. Modificar producto");
    console.log("5. Eliminar producto");
    console.log("6. Salir");
  
    askQuestion("Seleccione una opción: ").then(handleMenuOption);
  }
  
  /* Funcion handleMenuOption 
  Maneja la opción seleccionada por el usuario.
  Llama a las funciones adecuadas según la opción seleccionada*/
  function handleMenuOption(option) {
    switch (option) {
      case '1':
        agregarNuevoProducto();
        break;
      case '2':
        console.log("Listado de productos:");
        console.log(productManager.getProducts());
        mostrarMenu();
        break;
      case '3':
        buscarProductoPorId();
        break;
      case '4':
        modificarProducto();
        break;
      case '5':
        eliminarProducto();
        break;
      case '6':
        rl.close();
        break;
      default:
        console.log("Opción no válida.");
        mostrarMenu();
        break;
    }
  }
  /*Al final del código, se llama a mostrarMenu para iniciar el programa y mostrar el menú de opciones al usuario*/
  mostrarMenu();