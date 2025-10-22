import { describe, test, after } from 'node:test';
import { ok, equal } from 'node:assert';
import Application from '@minime/core';
import minimePg from '@minime/pg';

let app;

describe('Тестируем соединение с PostgreSQL', () => {
  after(async () => app?.stop());

  test('Обычное подключение компонента', async () => {
    const config = {
      pg: {
        user: 'test',
        password: 'qwerty',
        database: 'test'
      }
    };
    app = new Application(config, [minimePg]);
    await app.start();
    ok(app.pg);
    ok(app.pg.query);
    await app.stop();
    app = null;
  });

  test('Подключение нескольких баз данных одновременно', async () => {
    const config = {
      pg: {
        user: 'test',
        password: 'qwerty',
        test: { database: 'test' },
        extra: { database: 'test_extra' }
      }
    };
    app = new Application(config, [minimePg]);
    await app.start();
    ok(app.pg.test);
    ok(app.pg.test.query);
    ok(app.pg.extra);
    ok(app.pg.extra.query);
    await app.stop();
    app = null;
  });
});
