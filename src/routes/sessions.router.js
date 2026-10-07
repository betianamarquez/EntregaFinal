const express = require("express");
const passport = require("passport");

const UserDTO = require("../dto/user.dto");
const authorization = require("../middlewares/authorization");
const sessionsService = require("../services/sessions.service");
const passwordService = require("../services/password.service");

const router = express.Router();



router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const result = await sessionsService.login(
      email,
      password
    );

    res.status(200).json({
      status: "success",
      message: "Login exitoso",
      token: result.token
    });

  } catch (error) {

    console.error(error);

    if (
      error.message ===
      "Usuario o contraseña incorrectos"
    ) {

      return res.status(401).json({
        status: "error",
        message: error.message
      });

    }

    res.status(500).json({
      status: "error",
      message: "Error en el login",
      error: error.message
    });

  }

});




router.get(
  "/current",

  passport.authenticate("current", {
    session: false
  }),

  (req, res) => {

    try {

      const userDTO = new UserDTO(req.user);

      res.status(200).json({
        status: "success",
        message: "Usuario autenticado correctamente",
        user: userDTO
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




router.get(
  "/admin-test",

  passport.authenticate("current", {
    session: false
  }),

  authorization("admin"),

  (req, res) => {

    res.status(200).json({
      status: "success",
      message: "Acceso autorizado para administrador"
    });

  }
);




router.post(
  "/forgot-password",

  async (req, res) => {

    try {

      const { email } = req.body;

      if (!email) {

        return res.status(400).json({
          status: "error",
          message: "El email es obligatorio"
        });

      }

      await passwordService.requestPasswordReset(email);

      res.status(200).json({
        status: "success",
        message:
          "Si el email existe, recibirás un correo para restablecer tu contraseña"
      });

    } catch (error) {

      console.error(error);

      if (
        error.message ===
        "Usuario no encontrado"
      ) {

        return res.status(404).json({
          status: "error",
          message: error.message
        });

      }

      res.status(500).json({
        status: "error",
        message:
          "Error al solicitar recuperación de contraseña",
        error: error.message
      });

    }

  }
);




router.post(
  "/reset-password/:token",

  async (req, res) => {

    try {

      const { token } = req.params;
      const { newPassword } = req.body;

      if (!newPassword) {

        return res.status(400).json({
          status: "error",
          message:
            "La nueva contraseña es obligatoria"
        });

      }

      await passwordService.resetPassword(
        token,
        newPassword
      );

      res.status(200).json({
        status: "success",
        message:
          "Contraseña restablecida correctamente"
      });

    } catch (error) {

      console.error(error);

      if (
        error.message ===
        "La nueva contraseña no puede ser igual a la anterior"
      ) {

        return res.status(400).json({
          status: "error",
          message: error.message
        });

      }

      if (
        error.message ===
          "El token de recuperación expiró" ||
        error.message ===
          "El token es inválido o no existe"
      ) {

        return res.status(400).json({
          status: "error",
          message: error.message
        });

      }

      res.status(500).json({
        status: "error",
        message:
          "Error al restablecer la contraseña",
        error: error.message
      });

    }

  }
);


module.exports = router;