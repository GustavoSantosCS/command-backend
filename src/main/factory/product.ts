import {
  DBAddProduct,
  DBGetAllEstablishmentProducts,
  DBGetProductByID
} from '@/data/implementations';
import {
  EstablishmentTypeOrmRepository,
  ProductTypeOrmRepository
} from '@/infra/db/typeorm';
import { UUIDAdapter } from '@/infra/uuid-adapter';
import {
  AddProductController,
  GetProductByIdController,
  GetAllEstablishmentProductsController
} from '@/presentation/controllers/product';
import { Controller } from '@/presentation/protocols';
import { Validator } from '@/validation/protocols';
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators';

const establishmentRepository = new EstablishmentTypeOrmRepository();
const productRepository = new ProductTypeOrmRepository();

export const makeAddProductController = (): Controller => {
  const usecase = new DBAddProduct(
    new UUIDAdapter(),
    establishmentRepository,
    productRepository
  );

  const nameValidator = ValidatorBuilder.field('name')
    .required('Nome não informado')
    .min(3, 'Nome deve conter ao menos 3 letras')
    .build();

  const descriptionValidator = ValidatorBuilder.field('description')
    .required('Descrição não informado')
    .min(15, 'Descrição deve conter ao menos 15 letras')
    .build();

  const priceValidator = ValidatorBuilder.field('price')
    .required('Preço não informado')
    .isNumber('Preço deve ser um numero')
    .build();

  const establishmentIdValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informado')
    .build();

  const validator: Validator = new ValidationComposite([
    ...establishmentIdValidator,
    ...nameValidator,
    ...priceValidator,
    ...descriptionValidator
  ]);

  return new AddProductController(validator, usecase);
};

export const makerGetProductByIdController = (): Controller => {
  const usecase = new DBGetProductByID(productRepository);
  return new GetProductByIdController(usecase);
};

export const makeGetAllEstablishedProductsController = (): Controller => {
  const usecase = new DBGetAllEstablishmentProducts(
    establishmentRepository,
    productRepository
  );
  return new GetAllEstablishmentProductsController(usecase);
};
