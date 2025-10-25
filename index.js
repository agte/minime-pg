import Plugin from '@minime/core/Plugin';
import Client from './src/Client.js';

export default class PgPlugin extends Plugin {
  // Общие настройки для нескольких соединений, если их больше одного
  defaults = {
    host: 'localhost',
    port: 5432,
    user: '',
    password: '',
    database: '',
    connectionsize: 5,
    connectionTimeout: 10000,
    idleTimeout: 10000
  };

  // Имя коннекта => pg.Pool инстанс
  connections = {};

  constructor(...args) {
    super(...args);

    const config = this.app.config.pg;

    if (!config) {
      throw new Error('Не заданы настройки базы данных PostgreSQL');
    }

    const dbs = [];

    const keys = new Set(Object.keys(this.defaults));
    Object.keys(config).forEach((key) => {
      if (keys.has(key)) {
        this.defaults[key] = config[key];
      } else if (config[key].database) {
        dbs.push(key);
      } else {
        this.logger.warn(`Лишний ключ ${key} в конфиге`);
      }
    });

    if (!dbs.length && !config.database) {
      throw new Error('Не задано имя базы данных');
    }

    if (dbs.length > 0) {
      this.connections = Object.fromEntries(
        dbs.map((key) => [key, new Client({ ...this.defaults, ...config[key] })])
      );
      this.app.pg = this.connections;
    } else {
      this.connections.default = new Client({ ...this.defaults, ...config });
      this.app.pg = this.connections.default;
    }
  }

  async start() {
    await Promise.all(
      Object.entries(this.connections)
      .map(async ([name, conn]) => {
        const client = await conn.connect();
        await client.release();
        this.logger.debug({ connection: name }, 'База данных подключена');
      })
    );
  }

  async stop() {
    await Promise.all(Object.values(this.connections).map((conn) => conn.end()));
  }
}
