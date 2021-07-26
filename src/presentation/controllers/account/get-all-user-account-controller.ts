import { AccountModel } from '@/domain/models';
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
      console.error('GetAllUserAccountController:38 => ', error);
      return serverError(error);
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

  export type Response = Omit<
    AccountModel,
    'user' | 'requestsProduct' | 'requestsMusic'
  >[];
}
