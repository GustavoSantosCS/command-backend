import { UserTypeOrmRepository } from '@/infra/db/typeorm'
import { adaptMiddleware } from '@/main/adapter/express'
import { UserAuthorizationMiddleware } from '@/presentation/middleware'

export const authorization = adaptMiddleware(
  new UserAuthorizationMiddleware(new UserTypeOrmRepository())
)
