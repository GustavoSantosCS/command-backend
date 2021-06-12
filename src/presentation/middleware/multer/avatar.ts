import { adapterMulter } from '@/main/adapter/express';
import { env } from '@/shared/config';

export const avatarMulter = adapterMulter(
  'avatar',
  `${env.app.protocol}://${env.app.host}:${env.app.port}/files/`
);
