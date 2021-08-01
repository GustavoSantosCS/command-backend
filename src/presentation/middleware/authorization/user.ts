import { notAuthorizedErro, ok } from '@/presentation/helpers/http'
import { GetUserByIdRepository } from '@/data/protocols'
import { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols'
import { crypt } from '@/main/singletons'

export class UserAuthorizationMiddleware implements Middleware {
  private readonly getUserRepo: GetUserByIdRepository

  constructor(getUserRepo: GetUserByIdRepository) {
    this.getUserRepo = getUserRepo
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const authHeader = req.headers.authorization
      const [bearer, token] = authHeader.split(' ')
      if (bearer && String(bearer).toLowerCase() !== 'bearer') {
        return notAuthorizedErro()
      }

      const payload = await crypt.decrypt(token)

      if (new Date(payload.exp * 1000) < new Date()) {
        return notAuthorizedErro()
      }

      const user = await this.getUserRepo.getById(payload.body.id, {
        withPassword: true
      })

      if (!user) {
        return notAuthorizedErro()
      }

      return ok({ authenticated: { id: user.id } })
    } catch (error) {
      return notAuthorizedErro()
    }
  }
}
