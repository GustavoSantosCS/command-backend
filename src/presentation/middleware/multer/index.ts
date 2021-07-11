import { adapterMulter } from '@/main/adapter/express';
import { env } from '@/shared/config';

export const avatarMulter = adapterMulter('avatar', {
  destination: env.multer.destinationRoot.avatar,
  errorMessage: 'Não foi possível salvar o seu avatar',
  resultObjectName: 'avatar',
  target: `${env.app.protocol}://${env.app.host}:${env.app.port}/files/avatar`
});

export const establishmentImageMulter = adapterMulter('image', {
  destination: env.multer.destinationRoot.establishment,
  errorMessage: 'Não foi possível salvar a imagem do estabelecimento',
  resultObjectName: 'establishmentImage',
  target: `${env.app.protocol}://${env.app.host}:${env.app.port}/files/establishment`
});

export const productImageMulter = adapterMulter('image', {
  destination: env.multer.destinationRoot.product,
  errorMessage: 'Não foi possível salvar a imagem do estabelecimento',
  resultObjectName: 'productImage',
  target: `${env.app.protocol}://${env.app.host}:${env.app.port}/files/product`
});
