/* eslint-disable no-console */
import 'reflect-metadata';
import 'module-alias/register';
import { TypeORMHelpers } from '@/infra/db/typeorm';
import { env } from '@/main/config/env';
import app from '@/main/config/app';

TypeORMHelpers.connect()
  .then(() =>
    app.listen(env.app.port, () => {
      console.log('Backend Online');
      console.log(
        `Click para acessar: ${env.app.protocol}://${env.app.host}:${env.app.port}`
      );
    })
  )
  .catch(error => {
    console.error('Can not connect into database');
    console.error(error);
  });
