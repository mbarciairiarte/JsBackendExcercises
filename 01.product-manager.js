const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Definición de la clase ProductManager para gestionar productos
class ProductManager {
  constructor() {
    this.products = [];
  }

  // Método para obtener la lista de productos
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

    return newProduct;
  }

  // Método para obtener un producto por su ID
  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error("Producto no encontrado.");
    }
    return product;
  }

  // Método para generar un ID único (puede personalizarse)
  generateUniqueId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

const productManager = new ProductManager(); // Crear una instancia de la clase ProductManager

// Función utilitaria para hacer preguntas al usuario y obtener respuestas como promesas
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Función asincrónica para agregar un nuevo producto
async function agregarNuevoProducto() {
  try {
    // Pedir al usuario los detalles del producto uno por uno
    const title = await askQuestion("Ingrese el título del producto: ");
    const description = await askQuestion("Ingrese la descripción del producto: ");
    const price = parseFloat(await askQuestion("Ingrese el precio del producto: "));
    const thumbnail = await askQuestion("Ingrese la URL de la imagen (thumbnail) del producto: ");
    const code = await askQuestion("Ingrese el código del producto: ");
    const stock = parseInt(await askQuestion("Ingrese la cantidad en stock del producto: "));

    // Agregar el producto utilizando el método de la clase ProductManager
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
    // Después de agregar o manejar el error, volver al menú principal
    mostrarMenu();
  }
}

// Función asincrónica para buscar un producto por su ID
async function buscarProductoPorId() {
  try {
    // Pedir al usuario el ID del producto que desea buscar
    const id = await askQuestion("Ingrese el ID del producto que desea buscar: ");
    const product = productManager.getProductById(id);
    console.log("Producto encontrado:");
    console.log(product);
  } catch (error) {
    console.error("Error al buscar el producto:", error.message);
  }
  // Después de buscar o manejar el error, volver al menú principal
  mostrarMenu();
}

// Función para mostrar el menú principal
function mostrarMenu() {
  console.log("\nMenú:");
  console.log("1. Agregar nuevo producto");
  console.log("2. Listar todos los productos");
  console.log("3. Buscar producto por ID");
  console.log("4. Salir");

  // Pedir al usuario que seleccione una opción del menú
  askQuestion("Seleccione una opción: ").then(handleMenuOption);
}

// Función para manejar la opción seleccionada por el usuario en el menú
function handleMenuOption(option) {
  switch (option) {
    case '1':
      // Agregar un nuevo producto
      agregarNuevoProducto();
      break;
    case '2':
      // Listar todos los productos
      console.log("Listado de productos:");
      console.log(productManager.getProducts());
      mostrarMenu();
      break;
    case '3':
      // Buscar producto por ID
      buscarProductoPorId();
      break;
    case '4':
      // Salir del programa
      rl.close();
      break;
    default:
      // Opción no válida, mostrar el menú nuevamente
      console.log("Opción no válida.");
      mostrarMenu();
      break;
  }
}

// Mostrar el menú principal al iniciar la aplicación
mostrarMenu();
