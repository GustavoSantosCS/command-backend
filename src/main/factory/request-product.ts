import { DBCreateRequestProduct } from '@/data/implementations';
import {
  EstablishmentTypeOrmRepository,
  ProductTypeOrmRepository,
  RequestProductTypeOrmRepository
} from '@/infra/db/typeorm';
import { UUIDAdapter } from '@/infra/uuid-adapter';
import { CreateRequestProductController } from '@/presentation/controllers/request-product';
import { Controller } from '@/presentation/protocols';
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators';

export const makeCreateRequestProductController = (): Controller => {
  const productValidator = ValidatorBuilder.field('idProduct')
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

  const accountIdValidator = ValidatorBuilder.field('idAccount')
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
    new UUIDAdapter(),
    new EstablishmentTypeOrmRepository(),
    new ProductTypeOrmRepository(),
    new RequestProductTypeOrmRepository()
  );

  return new CreateRequestProductController(validator, usecase);
};
