const express = require("express");
const passport = require("passport");
const authorization = require("../middlewares/authorization");
const cartsService = require("../services/carts.service");

const router = express.Router();



router.post(
  "/",

  passport.authenticate("current", {
    session: false
  }),

  authorization("user"),

  async (req, res) => {

    try {

      const cart = await cartsService.createCart(
        req.user._id
      );

      res.status(201).json({
        status: "success",
        message: "Carrito creado correctamente",
        cart
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        status: "error",
        message: "Error al crear el carrito",
        error: error.message
      });

    }

  }
);



router.get(
  "/:cid",

  passport.authenticate("current", {
    session: false
  }),

  async (req, res) => {

    try {

      const cart = await cartsService.getCartById(
        req.params.cid
      );

      if (!cart) {

        return res.status(404).json({
          status: "error",
          message: "Carrito no encontrado"
        });

      }

      res.status(200).json({
        status: "success",
        cart
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        status: "error",
        message: "Error al obtener el carrito",
        error: error.message
      });

    }

  }
);




router.post(
  "/:cid/products/:pid",

  passport.authenticate("current", {
    session: false
  }),

  authorization("user"),

  async (req, res) => {

    try {

      const quantity =
        Number(req.body.quantity) || 1;

      const cart =
        await cartsService.addProductToCart(
          req.params.cid,
          req.params.pid,
          quantity,
          req.user._id
        );

      res.status(200).json({
        status: "success",
        message:
          "Producto agregado al carrito correctamente",
        cart
      });

    } catch (error) {

      console.error(error);

      if (
        error.message ===
        "Carrito no encontrado"
      ) {

        return res.status(404).json({
          status: "error",
          message: error.message
        });

      }

      if (
        error.message ===
        "No autorizado"
      ) {

        return res.status(403).json({
          status: "error",
          message: error.message
        });

      }

      res.status(500).json({
        status: "error",
        message:
          "Error al agregar el producto al carrito",
        error: error.message
      });

    }

  }
);



router.put(
  "/:cid",

  passport.authenticate("current", {
    session: false
  }),

  authorization("user"),

  async (req, res) => {

    try {

      const cart =
        await cartsService.updateCartProducts(
          req.params.cid,
          req.body.products,
          req.user._id
        );

      res.status(200).json({
        status: "success",
        message:
          "Carrito actualizado correctamente",
        cart
      });

    } catch (error) {

      console.error(error);

      if (
        error.message ===
        "Carrito no encontrado"
      ) {

        return res.status(404).json({
          status: "error",
          message: error.message
        });

      }

      if (
        error.message ===
        "No autorizado"
      ) {

        return res.status(403).json({
          status: "error",
          message: error.message
        });

      }

      res.status(400).json({
        status: "error",
        message: error.message
      });

    }

  }
);



router.put(
  "/:cid/products/:pid",

  passport.authenticate("current", {
    session: false
  }),

  authorization("user"),

  async (req, res) => {

    try {

      const quantity =
        Number(req.body.quantity);

      const cart =
        await cartsService.updateProductQuantity(
          req.params.cid,
          req.params.pid,
          quantity,
          req.user._id
        );

      res.status(200).json({
        status: "success",
        message:
          "Cantidad actualizada correctamente",
        cart
      });

    } catch (error) {

      console.error(error);

      if (
        error.message ===
        "Carrito no encontrado"
      ) {

        return res.status(404).json({
          status: "error",
          message: error.message
        });

      }

      if (
        error.message ===
        "No autorizado"
      ) {

        return res.status(403).json({
          status: "error",
          message: error.message
        });

      }

      res.status(400).json({
        status: "error",
        message: error.message
      });

    }

  }
);



router.delete(
  "/:cid/products/:pid",

  passport.authenticate("current", {
    session: false
  }),

  authorization("user"),

  async (req, res) => {

    try {

      const cart =
        await cartsService.removeProductFromCart(
          req.params.cid,
          req.params.pid,
          req.user._id
        );

      res.status(200).json({
        status: "success",
        message:
          "Producto eliminado del carrito correctamente",
        cart
      });

    } catch (error) {

      console.error(error);

      if (
        error.message ===
        "Carrito no encontrado"
      ) {

        return res.status(404).json({
          status: "error",
          message: error.message
        });

      }

      if (
        error.message ===
        "No autorizado"
      ) {

        return res.status(403).json({
          status: "error",
          message: error.message
        });

      }

      if (
        error.message ===
        "Producto no encontrado en el carrito"
      ) {

        return res.status(404).json({
          status: "error",
          message: error.message
        });

      }

      res.status(400).json({
        status: "error",
        message: error.message
      });

    }

  }
);



router.delete(
  "/:cid",

  passport.authenticate("current", {
    session: false
  }),

  authorization("user"),

  async (req, res) => {

    try {

      const cart =
        await cartsService.clearCart(
          req.params.cid,
          req.user._id
        );

      res.status(200).json({
        status: "success",
        message: "Carrito vaciado correctamente",
        cart
      });

    } catch (error) {

      console.error(error);

      if (
        error.message ===
        "Carrito no encontrado"
      ) {

        return res.status(404).json({
          status: "error",
          message: error.message
        });

      }

      if (
        error.message ===
        "No autorizado"
      ) {

        return res.status(403).json({
          status: "error",
          message: error.message
        });

      }

      res.status(400).json({
        status: "error",
        message: error.message
      });

    }

  }
);


module.exports = router;