const CartsDAO = require("../dao/carts.dao");
const CartsRepository = require("../repositories/carts.repository");

const cartsDAO = new CartsDAO();
const cartsRepository = new CartsRepository(cartsDAO);

class CartsService {

 
  async getCartById(id) {
    return await cartsRepository.getCartById(id);
  }



  async createCart(userId) {

    const existingCart =
      await cartsRepository.getCartByUserId(userId);

    if (existingCart) {
      return existingCart;
    }

    return await cartsRepository.createCart({
      user: userId,
      products: []
    });
  }


  // ACTUALIZAR CARRITO COMPLETO
  async updateCart(id, products) {

    const cart =
      await cartsRepository.getCartById(id);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    return await cartsRepository.updateCart(
      id,
      products
    );
  }


 
  async addProductToCart(
    cartId,
    productId,
    quantity = 1,
    userId
  ) {

    const cart =
      await cartsRepository.getCartById(cartId);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    // Verificar propietario del carrito
    if (
      !cart.user ||
      cart.user.toString() !== userId.toString()
    ) {
      throw new Error("No autorizado");
    }

    // Validar cantidad
    if (quantity < 1) {
      throw new Error(
        "La cantidad debe ser mayor a 0"
      );
    }

  
    const existingProduct =
      cart.products.find(
        item =>
          item.product &&
          item.product._id &&
          item.product._id.toString() === productId
      );

    if (existingProduct) {

      existingProduct.quantity += quantity;

    } else {

      cart.products.push({
        product: productId,
        quantity
      });

    }


    const products =
      cart.products
        .filter(item => item.product)
        .map(item => ({
          product:
            item.product._id || item.product,
          quantity: item.quantity
        }));

    return await cartsRepository.updateCart(
      cartId,
      products
    );
  }


  
  async updateCartProducts(
    cartId,
    products,
    userId
  ) {

    const cart =
      await cartsRepository.getCartById(cartId);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    if (
      !cart.user ||
      cart.user.toString() !== userId.toString()
    ) {
      throw new Error("No autorizado");
    }

    if (!Array.isArray(products)) {
      throw new Error(
        "El campo products debe ser un array"
      );
    }

    return await cartsRepository.updateCart(
      cartId,
      products
    );
  }



  async updateProductQuantity(
    cartId,
    productId,
    quantity,
    userId
  ) {

    const cart =
      await cartsRepository.getCartById(cartId);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    if (
      !cart.user ||
      cart.user.toString() !== userId.toString()
    ) {
      throw new Error("No autorizado");
    }

    if (quantity < 1) {
      throw new Error(
        "La cantidad debe ser mayor a 0"
      );
    }

    const product =
      cart.products.find(
        item =>
          item.product &&
          item.product._id &&
          item.product._id.toString() === productId
      );

    if (!product) {
      throw new Error(
        "Producto no encontrado en el carrito"
      );
    }

    product.quantity = quantity;

    const products =
      cart.products
        .filter(item => item.product)
        .map(item => ({
          product:
            item.product._id || item.product,
          quantity: item.quantity
        }));

    return await cartsRepository.updateCart(
      cartId,
      products
    );
  }


  async removeProductFromCart(
    cartId,
    productId,
    userId
  ) {

    const cart =
      await cartsRepository.getCartById(cartId);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    if (
      !cart.user ||
      cart.user.toString() !== userId.toString()
    ) {
      throw new Error("No autorizado");
    }

    const productExists =
      cart.products.some(
        item =>
          item.product &&
          item.product._id &&
          item.product._id.toString() === productId
      );

    if (!productExists) {
      throw new Error(
        "Producto no encontrado en el carrito"
      );
    }

    const products =
      cart.products
        .filter(
          item =>
            item.product &&
            item.product._id.toString() !== productId
        )
        .map(item => ({
          product:
            item.product._id || item.product,
          quantity: item.quantity
        }));

    return await cartsRepository.updateCart(
      cartId,
      products
    );
  }


  // VACIAR CARRITO
  async clearCart(
    cartId,
    userId
  ) {

    const cart =
      await cartsRepository.getCartById(cartId);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    if (
      !cart.user ||
      cart.user.toString() !== userId.toString()
    ) {
      throw new Error("No autorizado");
    }

    return await cartsRepository.updateCart(
      cartId,
      []
    );
  }

}

module.exports = new CartsService();