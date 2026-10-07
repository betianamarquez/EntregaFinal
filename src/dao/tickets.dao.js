const Ticket = require("../models/ticket.model");

class TicketsDAO {

  async create(ticketData) {
    return await Ticket.create(ticketData);
  }

  async getById(id) {
    return await Ticket.findById(id)
      .populate("products.product");
  }

  async getByCode(code) {
    return await Ticket.findOne({ code })
      .populate("products.product");
  }

  async getAll() {
    return await Ticket.find()
      .populate("products.product");
  }
}

module.exports = TicketsDAO;
