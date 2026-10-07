const ProductsDAO = require("../dao/products.dao");
const ProductsRepository = require("../repositories/products.repository");

const productsDAO = new ProductsDAO();
const productsRepository = new ProductsRepository(productsDAO);

class ProductsService {

  async getAllProducts() {
    return await productsRepository.getAll();
  }

  async getProductById(id) {
    return await productsRepository.getById(id);
  }

  async createProduct(productData) {

    const existingProduct = await productsRepository.getByCode(
      productData.code
    );

    if (existingProduct) {
      throw new Error("Ya existe un producto con ese código");
    }

    return await productsRepository.create(productData);
  }

  async updateProduct(id, productData) {

    const product = await productsRepository.getById(id);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    if (
      productData.code &&
      productData.code !== product.code
    ) {

      const existingProduct = await productsRepository.getByCode(
        productData.code
      );

      if (
        existingProduct &&
        existingProduct._id.toString() !== id.toString()
      ) {
        throw new Error("Ya existe un producto con ese código");
      }
    }

    return await productsRepository.update(id, productData);
  }

  async deleteProduct(id) {

    const product = await productsRepository.getById(id);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    return await productsRepository.delete(id);
  }

}

module.exports = new ProductsService();