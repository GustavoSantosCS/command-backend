import { RequestProductEntity } from '@/data/entities';
import { GetAllAccountRequestProductUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';

export class GetAllAccountRequestProductController implements Controller {
  private readonly getAllAccountRsP: GetAllAccountRequestProductUseCase;

  constructor(getAllAccountRequestProduct: GetAllAccountRequestProductUseCase) {
    this.getAllAccountRsP = getAllAccountRequestProduct;
  }

  async handle(
    httpRequest: HttpRequest<
      GetAllAccountRequestProductController.DTOBody,
      GetAllAccountRequestProductController.DTOParam
    >
  ): Promise<HttpResponse<GetAllAccountRequestProductController.Result>> {
    try {
      const { accountId } = httpRequest.params;
      const { id: userId } = httpRequest.body.authenticated;
      const resultGetAll =
        await this.getAllAccountRsP.getAllAccountRequestsProduct({
          userId,
          accountId
        });

      if (resultGetAll.isLeft()) return badRequest(resultGetAll.value);

      const { value } = resultGetAll;
      const data: GetAllAccountRequestProductController.Result = value.map(
        request => ({
          id: request.id,
          amountOfProduct: request.amountOfProduct,
          obs: request.obs,
          product: request.product,
          total: request.total,
          createdAt: request.createdAt,
          updatedAt: request.updatedAt
        })
      );

      return ok(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetAllAccountRequestProductController {
  export type DTOBody = {
    authenticated: {
      id: string;
    };
  };

  export type DTOParam = {
    accountId: string;
  };

  export type Result = Omit<RequestProductEntity, 'account' | 'closedAt'>[];
}
