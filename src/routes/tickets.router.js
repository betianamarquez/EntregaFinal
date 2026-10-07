const express = require("express");
const passport = require("passport");

const authorization = require("../middlewares/authorization");
const ticketsService = require("../services/tickets.service");

const router = express.Router();



router.post(
  "/purchase/:cid",

  passport.authenticate("current", {
    session: false
  }),

  authorization("user"),

  async (req, res) => {

    try {

      const { cid } = req.params;

      const result =
        await ticketsService.purchaseCart(
          cid,
          req.user.email
        );

      if (!result.ticket) {

        return res.status(400).json({
          status: "error",
          message:
            "No hay productos disponibles para comprar",
          unavailableProducts:
            result.unavailableProducts
        });

      }

      res.status(200).json({
        status: "success",
        message:
          "Compra realizada correctamente",
        ticket: result.ticket,
        unavailableProducts:
          result.unavailableProducts
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        status: "error",
        message: "Error al realizar la compra",
        error: error.message
      });

    }

  }
);



router.get(
  "/:tid",

  passport.authenticate("current", {
    session: false
  }),

  async (req, res) => {

    try {

      const ticket =
        await ticketsService.getTicketById(
          req.params.tid
        );

      if (!ticket) {

        return res.status(404).json({
          status: "error",
          message: "Ticket no encontrado"
        });

      }

      res.status(200).json({
        status: "success",
        ticket
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        status: "error",
        message: "Error al obtener el ticket",
        error: error.message
      });

    }

  }
);


module.exports = router;