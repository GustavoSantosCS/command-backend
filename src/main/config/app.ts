import express from 'express';
import * as env from '@/main/config/env';
import routes from '@/main/config/routes';
import middleware from '@/main/config/middlewares';

const app = express();

middleware(app);
routes(app);

app.use('/files', express.static(env.multer.destinationRoot.disc));
app.get('/', (_, response) => response.send('Hello World'));

export default app;
