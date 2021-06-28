import { adapterMulter } from '@/main/adapter/express';
import { env } from '@/shared/config';

export const avatarMulter = adapterMulter(
  'avatar',
  `${env.app.protocol}://${env.app.host}:${env.app.port}/files/`,
  'avatar',
  'Não foi possível salvar o seu avatar'
);

export const establishmentImageMulter = adapterMulter(
  'image',
  `${env.app.protocol}://${env.app.host}:${env.app.port}/files/`,
  'establishmentImage',
  'Não foi possível salvar a imagem do estabelecimento'
);
