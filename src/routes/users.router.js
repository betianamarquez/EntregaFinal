const express = require("express");
const passport = require("passport");

const usersService = require("../services/users.service");
const authorization = require("../middlewares/authorization");

const router = express.Router();



router.post("/", async (req, res) => {

  try {

    const userCreated = await usersService.createUser(req.body);

    res.status(201).json({
      status: "success",
      message: "Usuario creado correctamente",
      user: userCreated
    });

  } catch (error) {

    console.error(error);

    if (error.message === "El email ya está registrado") {
      return res.status(400).json({
        status: "error",
        message: error.message
      });
    }

    res.status(500).json({
      status: "error",
      message: "Error al crear el usuario",
      error: error.message
    });
  }
});


router.get(
  "/",

  passport.authenticate("current", {
    session: false
  }),

  authorization("admin"),

  async (req, res) => {

    try {

      const users = await usersService.getAllUsers();

      res.status(200).json({
        status: "success",
        users
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        status: "error",
        message: "Error al obtener los usuarios",
        error: error.message
      });
    }
  }
);



router.get(
  "/:id",

  passport.authenticate("current", {
    session: false
  }),

  authorization("admin"),

  async (req, res) => {

    try {

      const user = await usersService.getUserById(
        req.params.id
      );

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "Usuario no encontrado"
        });
      }

      res.status(200).json({
        status: "success",
        user
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        status: "error",
        message: "Error al obtener el usuario",
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

      const updatedUser = await usersService.updateUser(
        req.params.id,
        req.body
      );

      res.status(200).json({
        status: "success",
        message: "Usuario actualizado correctamente",
        user: updatedUser
      });

    } catch (error) {

      console.error(error);

      if (error.message === "Usuario no encontrado") {
        return res.status(404).json({
          status: "error",
          message: error.message
        });
      }

      res.status(500).json({
        status: "error",
        message: "Error al actualizar el usuario",
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

      const deletedUser = await usersService.deleteUser(
        req.params.id
      );

      res.status(200).json({
        status: "success",
        message: "Usuario eliminado correctamente",
        user: deletedUser
      });

    } catch (error) {

      console.error(error);

      if (error.message === "Usuario no encontrado") {
        return res.status(404).json({
          status: "error",
          message: error.message
        });
      }

      res.status(500).json({
        status: "error",
        message: "Error al eliminar el usuario",
        error: error.message
      });
    }
  }
);


module.exports = router;