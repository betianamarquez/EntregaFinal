class CartsRepository {

  constructor(dao) {
    this.dao = dao;
  }

  async getCartById(id) {
    return await this.dao.getCartById(id);
  }

  async getCartByUserId(userId) {
    return await this.dao.getCartByUserId(userId);
  }

  async createCart(cartData) {
    return await this.dao.createCart(cartData);
  }

  async updateCart(id, products) {
    return await this.dao.updateCart(id, products);
  }

  async deleteCart(id) {
    return await this.dao.deleteCart(id);
  }

}

module.exports = CartsRepository;