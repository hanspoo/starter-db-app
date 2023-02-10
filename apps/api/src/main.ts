import * as dotenv from 'dotenv';
dotenv.config();
import { dataSource, inicializarSistema } from '@flash-ws/db';
import { app } from './app';

async function f() {
  await dataSource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
    });

  await inicializarSistema();

  const port = process.env['NX_PORT'] || 3333;
  const server = app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/api');
  });
  server.on('error', console.error);
}

f();
