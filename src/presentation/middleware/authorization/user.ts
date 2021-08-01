import jwt from 'jsonwebtoken'
import { env } from '@/shared/config'
import { notAuthorizedErro, ok } from '@/presentation/helpers/http'
import { PayloadModel } from '@/domain/models'
import { GetUserByIdRepository } from '@/data/protocols'
import { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols'

export class UserAuthorizationMiddleware implements Middleware {
  private readonly getUserRepo: GetUserByIdRepository

  constructor(getUserRepo: GetUserByIdRepository) {
    this.getUserRepo = getUserRepo
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const authHeader = req.headers.authorization
    try {
      const [bearer, token] = authHeader.split(' ')

      if (bearer && String(bearer).toLowerCase() !== 'bearer') {
        return notAuthorizedErro()
      }

      try {
        const payload: PayloadModel = jwt.verify(
          token,
          env.app.key
        ) as PayloadModel

        if (new Date(payload.exp * 1000) < new Date()) {
          return notAuthorizedErro()
        }

        const user = await this.getUserRepo.getById(payload.body.id, {
          withPassword: true
        })

        console.log(`authorization ${JSON.stringify(user, null, 4)}`)

        if (!user) {
          return notAuthorizedErro()
        }

        return ok({ authenticated: { id: user.id } })
      } catch (e) {
        return notAuthorizedErro()
      }
    } catch (error) {
      return notAuthorizedErro()
    }
  }
}
