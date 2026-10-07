class TicketsRepository {

  constructor(dao) {
    this.dao = dao;
  }

  async createTicket(ticketData) {
    return await this.dao.create(ticketData);
  }

  async getTicketById(id) {
    return await this.dao.getById(id);
  }

  async getTicketByCode(code) {
    return await this.dao.getByCode(code);
  }

  async getAllTickets() {
    return await this.dao.getAll();
  }
}

module.exports = TicketsRepository;
