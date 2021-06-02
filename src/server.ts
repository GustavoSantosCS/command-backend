import app from '@/main/config/app';
import * as env from '@/main/config/env';

async function bootstrap() {
  app.listen(env.app.port, () =>
    console.log(
      `Backend online:\n${env.app.protocol}://${env.app.host}:${env.app.port}`
    )
  );
}

bootstrap();
