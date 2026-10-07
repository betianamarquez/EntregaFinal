const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UsersDAO = require("../dao/users.dao");
const UsersRepository = require("../repositories/users.repository");

const usersDAO = new UsersDAO();
const usersRepository = new UsersRepository(usersDAO);

class SessionsService {

  async login(email, password) {
    const user = await usersRepository.getByEmail(email);

    if (!user) {
      throw new Error("Usuario o contraseña incorrectos");
    }

    const passwordValid = bcrypt.compareSync(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new Error("Usuario o contraseña incorrectos");
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    return {
      token,
      user
    };
  }
}

module.exports = new SessionsService();
