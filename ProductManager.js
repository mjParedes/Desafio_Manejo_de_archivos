const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct = async (obj) => {
    const objs = await this.getProducts();
    try {
      let newId;
      objs.length === 0 ? (newId = 1) : (newId = objs[objs.length - 1].id + 1);
      const newObj = { ...obj, id: newId };
      objs.push(newObj);

      await this.writeFile(objs);
      return newObj;
    } catch (error) {
      console.log(error);
    }
  };

  updateProduct = async (idProduct, change) => {
    let objs = await this.getProducts();
    let product = await this.getProductById(idProduct);
    if (product) {
      product = { ...product, ...change };
      objs = objs.map((prod) => {
        if (prod.id === product.id) {
          prod = product;
        }
        return prod;
      });
      objs = JSON.stringify(objs, null, 2);
      await fs.promises.writeFile(this.path, objs);
      return product;
    } else {
      return null;
    }
  };

  getProductById = async (id) => {
    const objs = await this.getProducts();
    try {
      const obj = objs.find((obj) => obj.id === id);
      return obj ? obj : `ERROR: Producto inexistente`;
    } catch (error) {
      console.log(error.message);
    }
  };

  getProducts = async () => {
    try {
      const objs = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(objs);
    } catch (error) {
      if (error.message.includes("no such file or directory")) return [];
      else console.log(error.message);
    }
  };

  deleteProduct = async (id) => {
    let objs = await this.getProducts();
    try {
      objs = objs.filter((obj) => obj.id !== id);
      await this.writeFile(objs);
      if (id) {
        return `Producto eliminado con exito.`;
      } else {
        return `Producto no existente.`;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  writeFile = async (data) => {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(data, null, 2),
        "utf-8"
      );
    } catch (error) {
      console.log(error.message);
    }
  };
}

const products = new ProductManager("products.json");

const test = async () => {
  const getProducts = await products.getProducts();

  const addProduct = await products.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  });

  const getProductById = await products.getProductById(1);

  const updateProduct = await products.updateProduct(1, {
    title: "updated producto prueba",
    description: "updated description",
    price: 300,
    thumbnail: "updated thumbnail",
    code: "def123",
    stock: 45,
  });

  let deleteProduct = await products.deleteProduct(5);

  console.log({ getProducts });
  console.log({ addProduct });
  console.log({ getProducts });
  console.log({ getProductById });
  console.log({ updateProduct });
  console.log({ deleteProduct });
};

test();



// TESTING
// Se creará una instancia de la clase “ProductManager”
// Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
// Se llamará al método “addProduct” con los campos:
// title: “producto prueba”
// description:”Este es un producto prueba”
// price:200,
// thumbnail:”Sin imagen”
// code:”abc123”,
// stock:25
// El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
// Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
// Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
// Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
// Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
