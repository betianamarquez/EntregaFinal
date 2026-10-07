class UsersRepository {

  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getById(id) {
    return await this.dao.getById(id);
  }

  async getByEmail(email) {
    return await this.dao.getByEmail(email);
  }

  async getByResetToken(token) {
    return await this.dao.getByResetToken(token);
  }

  async create(userData) {
    return await this.dao.create(userData);
  }

  async update(id, userData) {
    return await this.dao.update(id, userData);
  }

  async delete(id) {
    return await this.dao.delete(id);
  }

}

module.exports = UsersRepository;
