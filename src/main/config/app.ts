import express from 'express';
import { env } from '@/main/config/env';
import routes from '@/main/config/routes';
import middleware from '@/main/config/middlewares';

const app = express();

middleware(app);
routes(app);

if (env.storage.type === 'local') {
  app.use('/files/avatar', express.static(env.storage.local.avatar));
  app.use(
    '/files/establishment',
    express.static(env.storage.local.establishment)
  );
  app.use('/files/product', express.static(env.storage.local.product));
}

app.get('/', (_, response) => response.send('Hello World'));

export default app;
