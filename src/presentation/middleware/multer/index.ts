import { adapterMulter } from '@/main/adapter/express'
import { env } from '@/shared/config'

export const avatarMulter = adapterMulter('avatar', {
  destination: env.storage.local.avatar,
  errorMessage: 'Não foi possível salvar o seu avatar',
  resultObjectName: 'avatar',
  target: 'avatar'
})

export const establishmentImageMulter = adapterMulter('image', {
  destination: env.storage.local.establishment,
  errorMessage: 'Não foi possível salvar a imagem do estabelecimento',
  resultObjectName: 'establishmentImage',
  target: 'establishment'
})

export const productImageMulter = adapterMulter('image', {
  destination: env.storage.local.product,
  errorMessage: 'Não foi possível salvar a imagem do estabelecimento',
  resultObjectName: 'productImage',
  target: 'product'
})
