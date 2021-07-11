import { RequestProductModel } from '@/domain/models';
import { GetAllAccountRequestProductUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';

export class GetAllAccountRequestProductController implements Controller {
  constructor(
    private readonly getAllAccountRequestProduct: GetAllAccountRequestProductUseCase
  ) {}

  async handle(
    httpRequest: HttpRequest<
      GetAllAccountRequestProductController.Body,
      GetAllAccountRequestProductController.Param
    >
  ): Promise<HttpResponse<GetAllAccountRequestProductController.Result>> {
    try {
      const { idAccount } = httpRequest.params;
      const result =
        await this.getAllAccountRequestProduct.getAllAccountRequestProduct(
          idAccount
        );
      if (result.isLeft()) return badRequest(result.value);
      return ok(result.value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('GetAllAccountRequestProductController:40 => ', error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetAllAccountRequestProductController {
  export type Body = {
    authenticated: {
      id: string;
    };
  };

  export type Param = {
    idAccount: string;
  };

  export type Result = RequestProductModel[];
}
