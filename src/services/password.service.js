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

    const expiration = new Date(
      Date.now() + 60 * 60 * 1000
    );

    await usersRepository.update(
      user._id,
      {
        resetPasswordToken: token,
        resetPasswordExpires: expiration
      }
    );

    const baseUrl =
      process.env.BASE_URL || "http://localhost:8080";

    const resetLink =
      `${baseUrl}/api/sessions/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Recuperación de contraseña</h2>

          <p>
            Recibimos una solicitud para restablecer tu contraseña.
          </p>

          <p>
            El siguiente enlace será válido durante 1 hora:
          </p>

          <a
            href="${resetLink}"
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
            Si no solicitaste este cambio, podés ignorar este correo.
          </p>
        </div>
      `
    });

    return {
      message: "Correo de recuperación enviado"
    };
  }


  async resetPassword(token, newPassword) {

    const user =
      await usersRepository.getByResetToken(token);

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

    const samePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (samePassword) {
      throw new Error(
        "La nueva contraseña no puede ser igual a la anterior"
      );
    }

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    await usersRepository.update(
      user._id,
      {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    );

    return {
      message: "Contraseña actualizada correctamente"
    };
  }

}

module.exports = new PasswordService();