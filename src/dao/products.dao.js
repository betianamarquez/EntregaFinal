const Product = require("../models/product.model");

class ProductsDAO {

  async getAll() {
    return await Product.find();
  }

  async getById(id) {
    return await Product.findById(id);
  }

  async getByCode(code) {
    return await Product.findOne({ code });
  }

  async create(productData) {
    return await Product.create(productData);
  }

  async update(id, productData) {
    return await Product.findByIdAndUpdate(
      id,
      productData,
      {
        new: true,
        runValidators: true
      }
    );
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }

  async decreaseStock(id, quantity) {
    return await Product.findByIdAndUpdate(
      id,
      {
        $inc: {
          stock: -quantity
        }
      },
      {
        new: true,
        runValidators: true
      }
    );
  }

}

module.exports = ProductsDAO;