const express = require("express");
const passport = require("passport");

const authorization = require("../middlewares/authorization");
const productsService = require("../services/products.service");

const router = express.Router();



router.get("/", async (req, res) => {

  try {

    const products = await productsService.getAllProducts();

    res.status(200).json({
      status: "success",
      products
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Error al obtener los productos",
      error: error.message
    });

  }

});



router.get("/:id", async (req, res) => {

  try {

    const product = await productsService.getProductById(
      req.params.id
    );

    if (!product) {

      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
      });

    }

    res.status(200).json({
      status: "success",
      product
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Error al obtener el producto",
      error: error.message
    });

  }

});



router.post(
  "/",

  passport.authenticate("current", {
    session: false
  }),

  authorization("admin"),

  async (req, res) => {

    try {

      const product = await productsService.createProduct(
        req.body
      );

      res.status(201).json({
        status: "success",
        message: "Producto creado correctamente",
        product
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        status: "error",
        message: "Error al crear el producto",
        error: error.message
      });

    }

  }
);


router.put(
  "/:id",

  passport.authenticate("current", {
    session: false
  }),

  authorization("admin"),

  async (req, res) => {

    try {

      const product = await productsService.updateProduct(
        req.params.id,
        req.body
      );

      res.status(200).json({
        status: "success",
        message: "Producto actualizado correctamente",
        product
      });

    } catch (error) {

      console.error(error);

      if (error.message === "Producto no encontrado") {

        return res.status(404).json({
          status: "error",
          message: error.message
        });

      }

      res.status(500).json({
        status: "error",
        message: "Error al actualizar el producto",
        error: error.message
      });

    }

  }
);



router.delete(
  "/:id",

  passport.authenticate("current", {
    session: false
  }),

  authorization("admin"),

  async (req, res) => {

    try {

      const product = await productsService.deleteProduct(
        req.params.id
      );

      res.status(200).json({
        status: "success",
        message: "Producto eliminado correctamente",
        product
      });

    } catch (error) {

      console.error(error);

      if (error.message === "Producto no encontrado") {

        return res.status(404).json({
          status: "error",
          message: error.message
        });

      }

      res.status(500).json({
        status: "error",
        message: "Error al eliminar el producto",
        error: error.message
      });

    }

  }
);


module.exports = router;