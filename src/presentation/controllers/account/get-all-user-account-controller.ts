import { AccountEntity } from '@/data/entities';
import { GetAllUserAccountUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { ok, serverError } from '@/utils/http';

export class GetAllUserAccountController implements Controller {
  private getAllUserAccount: GetAllUserAccountUseCase;

  constructor(getAllUserAccountUseCase: GetAllUserAccountUseCase) {
    this.getAllUserAccount = getAllUserAccountUseCase;
  }

  async handle(
    httpRequest: HttpRequest<GetUserAccountController.DTO>
  ): Promise<HttpResponse<GetUserAccountController.Response>> {
    try {
      const { id: userId } = httpRequest.body.authenticated;
      const accounts = await this.getAllUserAccount.getAllUserAccount(userId);
      return ok(accounts);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetUserAccountController {
  export type DTO = {
    authenticated: {
      id: string;
    };
  };

  export type Response = Omit<AccountEntity, 'client' | 'requestsProduct'>[];
}
