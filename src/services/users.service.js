const bcrypt = require("bcrypt");

const UsersDAO = require("../dao/users.dao");
const UsersRepository = require("../repositories/users.repository");

const usersDAO = new UsersDAO();
const usersRepository = new UsersRepository(usersDAO);

class UsersService {

  async getAllUsers() {
    return await usersRepository.getAll();
  }

  async getUserById(id) {
    return await usersRepository.getById(id);
  }

  async getUserByEmail(email) {
    return await usersRepository.getByEmail(email);
  }

  async createUser(userData) {

    const existingUser = await usersRepository.getByEmail(
      userData.email
    );

    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(
      userData.password,
      10
    );

    const newUser = {
      ...userData,
      password: hashedPassword
    };

    return await usersRepository.create(newUser);
  }

  async updateUser(id, userData) {

    const user = await usersRepository.getById(id);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (userData.password) {

      userData.password = await bcrypt.hash(
        userData.password,
        10
      );

    }

    return await usersRepository.update(
      id,
      userData
    );
  }

  async deleteUser(id) {

    const user = await usersRepository.getById(id);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return await usersRepository.delete(id);
  }

}

module.exports = new UsersService();