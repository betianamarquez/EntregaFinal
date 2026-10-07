const crypto = require("crypto");
const TicketsDAO = require("../dao/tickets.dao");
const TicketsRepository = require("../repositories/tickets.repository");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

const ticketsDAO = new TicketsDAO();
const ticketsRepository = new TicketsRepository(ticketsDAO);

class TicketsService {

  async purchaseCart(cartId, purchaserEmail) {
    const cart = await Cart.findById(cartId).populate("products.product");

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const purchasedProducts = [];
    const unavailableProducts = [];

    for (const item of cart.products) {
      const product = item.product;

      if (!product) {
        continue;
      }

      if (product.stock >= item.quantity) {
        purchasedProducts.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price
        });
      } else {
        unavailableProducts.push({
          product: product._id,
          quantity: item.quantity
        });
      }
    }

    if (purchasedProducts.length === 0) {
      return {
        ticket: null,
        unavailableProducts
      };
    }

    let amount = 0;

    for (const item of purchasedProducts) {
      amount += item.price * item.quantity;

      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: -item.quantity
          }
        }
      );
    }

    const ticket = await ticketsRepository.createTicket({
      code: crypto.randomUUID(),
      purchase_datetime: new Date(),
      amount,
      purchaser: purchaserEmail,
      products: purchasedProducts
    });

    const purchasedIds = purchasedProducts.map(
      item => item.product.toString()
    );

    cart.products = cart.products.filter(item => {
      return !purchasedIds.includes(item.product._id.toString());
    });

    await cart.save();

    return {
      ticket,
      unavailableProducts
    };
  }

  async getTicketById(id) {
    return await ticketsRepository.getTicketById(id);
  }

  async getAllTickets() {
    return await ticketsRepository.getAllTickets();
  }
}

module.exports = new TicketsService();
