import express from 'express';
import { env } from '@/main/config/env';
import routes from '@/main/config/routes';
import middleware from '@/main/config/middlewares';

const app = express();

middleware(app);
routes(app);

app.use('/files/avatar', express.static(env.multer.destinationRoot.avatar));
app.use(
  '/files/establishment',
  express.static(env.multer.destinationRoot.establishment)
);
app.use('/files/product', express.static(env.multer.destinationRoot.product));

app.get('/', (_, response) => response.send('Hello World'));

export default app;
