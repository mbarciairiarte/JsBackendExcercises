/*Este programa permite agregar, listar, buscar, modificar y eliminar productos, 
y guarda los datos en un archivo JSON para que persistan entre sesiones*/

/*Aquí se importan los módulos fs y readline. fs se utiliza para trabajar con archivos y 
directorios, mientras que readline se usa para interactuar con el usuario en la línea de comandos*/

import fs from 'fs';
import readline from 'readline';

/*Se crea una interfaz para leer desde la entrada estándar (teclado) y 
escribir en la salida estándar (pantalla)*/
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Definición de la clase ProductManager
class ProductManager {
  /*constructor
  La clase ProductManager tiene un constructor que inicializa un arreglo vacío de 
  productos y luego carga los productos almacenados en disco*/
  constructor() {
    this.products = [];
    this.loadProducts(); // Cargar productos almacenados en disco al iniciar
  }

  // Obtener la lista de productos
  getProducts() {
    
    return this.products;
  }

  // Método para agregar un nuevo producto
  addProduct({ title, description, price, thumbnail, code, stock }) {
    const existingProduct = this.products.find(
      (product) => product.code === code
    );
    if (existingProduct) {
      throw new Error('El código del producto ya está en uso.');
    }

    if (typeof price !== 'number' || price < 0) {
      throw new Error('El precio debe ser un número positivo.');
    }

    if (!Number.isInteger(stock) || stock < 0) {
      throw new Error('El stock debe ser un número entero no negativo.');
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
      throw new Error('Producto no encontrado.');
    }
    return product;
  }

  // Método para modificar un producto
  modifyProduct(id, { title, description, price, thumbnail, code, stock }) {
    const product = this.getProductById(id);
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (thumbnail) product.thumbnail = thumbnail;
    if (code) product.code = code;
    if (stock) product.stock = stock;

    this.saveProducts();
    return product;
  }

  // Método para eliminar un producto
  deleteProduct(id) {
    // Busca el producto por su ID y lo elimina del arreglo
    // Si no lo encuentra, lanza un error
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error('Producto no encontrado.');
    }
    this.products.splice(index, 1);
    this.saveProducts();
  }

  //metodos loadProducts y saveProducts se encargan de cargar y guardar los productos en un archivo JSON
  async loadProducts() {
    try {
      const data = await fs.readFileSync('products.json', 'utf8');
      this.products = JSON.parse(data);
    } catch (err) {
      this.products = [];
    }
  }

  // Método para guardar los productos en el archivo
  saveProducts() {
    fs.writeFileSync(
      'products.json',
      JSON.stringify(this.products, null, 2),
      'utf8'
    );
  }

  // Método para generar un ID único para el producto
  generateUniqueId() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}

// Crear una instancia de ProductManager
const productManager = new ProductManager();

//función askQuestion se utiliza para hacer preguntas al usuario y obtener respuestas como promesas
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Función para solicitar y validar la entrada del usuario
async function solicitarInformacion(prompt, validationFunction) {
  while (true) {
    try {
      const input = await askQuestion(prompt);
      if (validationFunction(input)) {
        return input;
      }
      console.log('Entrada inválida. Por favor, inténtelo de nuevo.');
    } catch (error) {
      console.error('Error de entrada:', error);
    }
  }
}

// Funciones asincrónicas refactorizadas utilizando la función de utilidad
/*
Funciones asincrónicas (agregarNuevoProducto, buscarProductoPorId, modificarProducto, eliminarProducto):
Estas funciones se encargan de interactuar con el usuario para agregar, buscar, modificar y eliminar productos. 
Se utilizan para capturar la entrada del usuario y realizar las acciones correspondientes
*/
async function agregarNuevoProducto() {
  try {
    const title = await solicitarInformacion(
      'Ingrese el título del producto: ',
      (input) => input.trim().length > 0
    );
    const description = await solicitarInformacion(
      'Ingrese la descripción del producto: ',
      (input) => input.trim().length > 0
    );
    const price = await solicitarInformacion(
      'Ingrese el precio del producto: ',
      (input) => !isNaN(parseFloat(input)) && parseFloat(input) >= 0
    );
    const thumbnail = await askQuestion(
      'Ingrese la URL de la imagen (thumbnail) del producto: '
    );
    const code = await solicitarInformacion(
      'Ingrese el código del producto: ',
      (input) => input.trim().length > 0
    );
    const stock = await solicitarInformacion(
      'Ingrese la cantidad en stock del producto: ',
      (input) => !isNaN(parseInt(input)) && parseInt(input) >= 0
    );

    const newProduct = productManager.addProduct({
      title,
      description,
      price: parseFloat(price),
      thumbnail,
      code,
      stock: parseInt(stock),
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
    const id = await solicitarInformacion(
      'Ingrese el ID del producto que desea buscar: ',
      (input) => input.trim().length > 0
    );
    const product = productManager.getProductById(id);
    console.log('Producto encontrado:');
    console.log(product);
  } catch (error) {
    console.error('Error al buscar el producto:', error.message);
  }
  mostrarMenu();
}

async function modificarProducto() {
  try {
    const id = await solicitarInformacion(
      'Ingrese el ID del producto que desea modificar: ',
      (input) => input.trim().length > 0
    );
    const product = productManager.getProductById(id);

    const newTitle = await solicitarInformacion(
      `Ingrese el nuevo título del producto (antes: ${product.title}): `,
      (input) => input.trim().length > 0
    );
    const newDescription = await solicitarInformacion(
      `Ingrese la nueva descripción del producto (antes: ${product.description}): `,
      (input) => input.trim().length > 0
    );
    const newPrice = await solicitarInformacion(
      `Ingrese el nuevo precio del producto (antes: ${product.price}): `,
      (input) => !isNaN(parseFloat(input)) && parseFloat(input) >= 0
    );
    const newThumbnail = await askQuestion(
      `Ingrese la nueva URL de la imagen (thumbnail) del producto (antes: ${product.thumbnail}): `
    );
    const newCode = await solicitarInformacion(
      `Ingrese el nuevo código del producto (antes: ${product.code}): `,
      (input) => input.trim().length > 0
    );
    const newStock = await solicitarInformacion(
      `Ingrese la nueva cantidad en stock del producto (antes: ${product.stock}): `,
      (input) => !isNaN(parseInt(input)) && parseInt(input) >= 0
    );

    const updatedProduct = productManager.modifyProduct(id, {
      title: newTitle,
      description: newDescription,
      price: parseFloat(newPrice),
      thumbnail: newThumbnail,
      code: newCode,
      stock: parseInt(newStock),
    });

    console.log('Producto modificado con éxito:');
    console.log(updatedProduct);
  } catch (error) {
    console.error('Error al modificar el producto:', error.message);
  }
  mostrarMenu();
}

async function eliminarProducto() {
  try {
    const id = await solicitarInformacion(
      'Ingrese el ID del producto que desea eliminar: ',
      (input) => input.trim().length > 0
    );
    productManager.deleteProduct(id);
    console.log('Producto eliminado con éxito.');
  } catch (error) {
    console.error('Error al eliminar el producto:', error.message);
  }
  mostrarMenu();
}

/*Función menú
  Muestra un menú con opciones numeradas.
  Pide al usuario que seleccione una opción.
  Llama a la función `handleMenuOption` para manejar la opción seleccionada.*/

function mostrarMenu() {
  console.log('\nMenú:');
  console.log('1. Agregar nuevo producto');
  console.log('2. Listar todos los productos');
  console.log('3. Buscar producto por ID');
  console.log('4. Modificar producto');
  console.log('5. Eliminar producto');
  console.log('6. Salir');

  askQuestion('Seleccione una opción: \n').then(handleMenuOption);
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
      console.log('Listado de productos:');
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
      console.log('Opción no válida.');
      mostrarMenu();
      break;
  }
}
/*Al final del código, se llama a mostrarMenu para iniciar el programa y mostrar el menú de opciones al usuario*/
mostrarMenu();


export default ProductManager;