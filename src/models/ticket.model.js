const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },

  purchase_datetime: {
    type: Date,
    default: Date.now
  },

  amount: {
    type: Number,
    required: true
  },

  purchaser: {
    type: String,
    required: true
  },

  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },

      quantity: {
        type: Number,
        required: true
      },

      price: {
        type: Number,
        required: true
      }
    }
  ]
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
