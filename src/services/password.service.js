const crypto = require("crypto");
const bcrypt = require("bcrypt");

const UsersDAO = require("../dao/users.dao");
const UsersRepository = require("../repositories/users.repository");

const transporter = require("../config/mailer");

const usersDAO = new UsersDAO();
const usersRepository = new UsersRepository(usersDAO);

class PasswordService {

  async requestPasswordReset(email) {

    const user = await usersRepository.getByEmail(email);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

  
    const token = crypto.randomBytes(32).toString("hex");

    // El token vence en 1 hora
    const expiration = new Date(
      Date.now() + 60 * 60 * 1000
    );

    // Guardar token y vencimiento
    await usersRepository.update(
      user._id,
      {
        resetPasswordToken: token,
        resetPasswordExpires: expiration
      }
    );

  
    const resetUrl =
      `http://localhost:8080/api/sessions/reset-password/${token}`;

    // Enviar email mediante Mailtrap
    await transporter.sendMail({

      from: "no-reply@backend.com",

      to: user.email,

      subject: "Recuperación de contraseña",

      html: `
        <div style="font-family: Arial, sans-serif;">

          <h2>Recuperación de contraseña</h2>

          <p>
            Hola ${user.first_name},
          </p>

          <p>
            Recibimos una solicitud para restablecer
            tu contraseña.
          </p>

          <p>
            El siguiente botón estará disponible
            durante <strong>1 hora</strong>.
          </p>

          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 5px;
            "
          >
            Restablecer contraseña
          </a>

          <p>
            Si vos no solicitaste este cambio,
            simplemente ignorá este correo.
          </p>

        </div>
      `
    });

    return true;
  }


  async resetPassword(token, newPassword) {

    const user = await usersRepository.getByResetToken(token);

    if (!user) {
      throw new Error(
        "El token es inválido o no existe"
      );
    }

  
    if (
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      throw new Error(
        "El token de recuperación expiró"
      );
    }

  
    const samePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (samePassword) {
      throw new Error(
        "La nueva contraseña no puede ser igual a la anterior"
      );
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // Actualizar contraseña y eliminar token
    await usersRepository.update(
      user._id,
      {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    );

    return true;
  }

}

module.exports = new PasswordService();