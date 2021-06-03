import 'reflect-metadata';
import { TypeORMHelpers } from '@/infra/db/typeorm';
import app from '@/main/config/app';
import * as env from '@/main/config/env';

async function bootstrap() {
  await TypeORMHelpers.connect();
  app.listen(env.app.port, () =>
    // eslint-disable-next-line no-console
    console.log(
      `Backend online:\n${env.app.protocol}://${env.app.host}:${env.app.port}`
    )
  );
}

bootstrap();
