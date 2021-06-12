import jwt from 'jsonwebtoken';
import { env } from '@/shared/config';
import { Request, Response, NextFunction } from 'express';
import { notAuthorizedErro, ok } from '@/utils/http';
import { promisify } from 'util';
import { PayloadModel } from '@/domain/models/payload-model';
import { GetUserByIdRepository } from '@/data/protocols';
import { Middleware, MiddlewareReturn } from '@/presentation/protocols';

export class UserAuthorizationMiddleware implements Middleware {
  constructor(private readonly repository: GetUserByIdRepository) {}

  async handle(req: Request): Promise<MiddlewareReturn> {
    const authHeader = req.headers.authorization;
    try {
      const [bearer, token] = authHeader.split(' ');

      if (bearer && String(bearer).toLowerCase() !== 'bearer') {
        return notAuthorizedErro();
      }

      try {
        // @ts-ignore
        const payload: PayloadModel<{ id: string }> = await promisify(
          jwt.verify
        )(
          token,
          // @ts-ignore
          env.app.key
        );

        if (new Date(payload.exp * 1000) < new Date()) {
          return notAuthorizedErro();
        }

        const user = await this.repository.getUserById(payload.body.id);

        if (!user.isLeft()) {
          return notAuthorizedErro();
        }

        req.body.user = { id: payload.body.id };
        return ok({ user: { id: payload.body.id } });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
      return notAuthorizedErro();
    } catch (error) {
      // eslint-disable-next-line no-console
      // console.error(error);
      console.log('sdhjaosdojoisjda');
      return notAuthorizedErro();
    }
  }
}
