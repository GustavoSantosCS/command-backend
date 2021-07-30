import {
  DBCreateRequestProduct,
  DbGetAllAccountRequestProduct
} from '@/data/implementations';
import {
  AddRequestProductController,
  GetAllAccountRequestProductController
} from '@/presentation/controllers/request-product';
import { Controller } from '@/presentation/protocols';
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators';
import {
  accountRepo,
  idGenerator,
  productRepo,
  requestProductRepo
} from '@/main/singletons';

export const makeAddRequestProductController = (): Controller => {
  const productValidator = ValidatorBuilder.field('productId')
    .required('Produto não informado')
    .build();

  const amountOfProductValidator = ValidatorBuilder.field('amountOfProduct')
    .required('Quantidade não informada')
    .isNumber('Quantidade deve ser um numero')
    .build();

  const obsValidator = ValidatorBuilder.field('obs')
    .max(120, 'Observações não podem ser maior do que 120')
    .build();

  const totalValidator = ValidatorBuilder.field('total')
    .required('Valor total não informado')
    .isNumber('O Valor total deve ser um numero')
    .build();

  const accountIdValidator = ValidatorBuilder.field('accountId')
    .required('Conta não informado')
    .build();

  const validator = new ValidationComposite([
    ...productValidator,
    ...obsValidator,
    ...totalValidator,
    ...accountIdValidator,
    ...amountOfProductValidator
  ]);

  const usecase = new DBCreateRequestProduct(
    idGenerator,
    accountRepo,
    productRepo,
    requestProductRepo
  );

  return new AddRequestProductController(validator, usecase);
};

export const makeGetAllRequestProductController = (): Controller => {
  const usecase = new DbGetAllAccountRequestProduct(
    requestProductRepo,
    accountRepo
  );
  return new GetAllAccountRequestProductController(usecase);
};
