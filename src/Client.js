import pg from 'pg';

export default class Client extends pg.Pool {
  async getOne(...args) {
    const result = await this.query(...args);
    return result.rows[0];
  }
}