const User = require("../models/user.model");

class UsersDAO {

  async getById(id) {
    return await User.findById(id);
  }

  async getByEmail(email) {
    return await User.findOne({ email });
  }

  async getAll() {
    return await User.find();
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, userData) {
    return await User.findByIdAndUpdate(
      id,
      userData,
      {
        new: true,
        runValidators: true
      }
    );
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  // Buscar usuario mediante el token de recuperación
  async getByResetToken(token) {
    return await User.findOne({
      resetPasswordToken: token
    });
  }
}

module.exports = UsersDAO;