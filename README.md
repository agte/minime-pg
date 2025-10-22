# minime-pg
Клиент Постгреса для минифреймворка minime

## Подключение

Инстанс подключения будет доступен в свойстве pg приложения.
Если подключений несколько, то свойство pg будет содержать реестр подключений.

### Одно подключение

Настройки
```js
export default {
  host: 'localhost',
  port: 5432,
  user: 'test',
  password: 'qwerty'
  database: 'test',
  // connectionsize: 5,
  // connectionTimeout: 10000,
  // idleTimeout: 10000
}
```

Результат
```js
import Application from '@minime/core';
import minimePg from '@minime/pg';

const app = new Application(config, [minimePg]);
await app.start();

const result = await app.pg.query('select * from somewhere');
console.log(result.rows);

await app.stop();
```

### Несколько подключений

Настройки
```js
export default {
  host: 'localhost',
  port: 5432,
  user: 'test',
  password: 'qwerty',
  // Индивидуальные настройки подключений
  weather: {
    database: 'weather',
    user: 'xyz', // Перезатрёт user = test
    password: 'secret' // Перезатрёт password = qwerty
  },
  traffic: {
    database: 'traffic'
  }
}
```

Результат
```js
import Application from '@minime/core';
import minimePg from '@minime/pg';

const app = new Application(config, [minimePg]);
await app.start();

const weatherForecast = await app.pg.weather.query('select * from forecast');
console.log(weatherForecast.rows);

const trafficStatistics = await app.pg.traffic.query('select * from stat');
console.log(trafficStatistics.rows);

await app.stop();
```