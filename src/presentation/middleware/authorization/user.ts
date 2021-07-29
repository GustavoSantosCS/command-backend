/* eslint-disable no-console */
import jwt from 'jsonwebtoken';
import { env } from '@/shared/config';
import { notAuthorizedErro, ok } from '@/utils/http';
import { PayloadModel } from '@/domain/models';
import { GetUserByIdRepository } from '@/data/protocols';
import {
  HttpRequest,
  HttpResponse,
  Middleware
} from '@/presentation/protocols';

export class UserAuthorizationMiddleware implements Middleware {
  constructor(private readonly repository: GetUserByIdRepository) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const authHeader = req.headers.authorization;
    try {
      const [bearer, token] = authHeader.split(' ');

      if (bearer && String(bearer).toLowerCase() !== 'bearer') {
        return notAuthorizedErro();
      }

      try {
        const payload: PayloadModel = jwt.verify(
          token,
          env.app.key
        ) as PayloadModel;

        if (new Date(payload.exp * 1000) < new Date()) {
          return notAuthorizedErro();
        }

        const user = await this.repository.getById(payload.body.id as string);

        if (!user) {
          return notAuthorizedErro();
        }

        return ok({ authenticated: { id: user.id } });
      } catch (e) {
        console.error('UserAuthorizationMiddleware:45 => ', e);
        return notAuthorizedErro();
      }
    } catch (error) {
      console.error('UserAuthorizationMiddleware:49 => ', error);
      return notAuthorizedErro();
    }
  }
}
