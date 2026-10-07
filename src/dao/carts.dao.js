const Cart = require("../models/cart.model");

class CartsDAO {

  async getCartById(id) {
    return await Cart
      .findById(id)
      .populate("products.product");
  }

  async getCartByUserId(userId) {
    return await Cart
      .findOne({ user: userId })
      .populate("products.product");
  }

  async createCart(cartData) {
    return await Cart.create(cartData);
  }

  async updateCart(id, products) {
    return await Cart.findByIdAndUpdate(
      id,
      { products },
      {
        new: true,
        runValidators: true
      }
    ).populate("products.product");
  }

  async deleteCart(id) {
    return await Cart.findByIdAndDelete(id);
  }
}

module.exports = CartsDAO;