import { DBAddProduct } from '@/data/implementations/product';
import { EstablishmentTypeOrmRepository } from '@/infra/db/typeorm';
import { ProductTypeOrmRepository } from '@/infra/db/typeorm/product-typeorm-repository';
import { UUIDAdapter } from '@/infra/uuid-adapter';
import { AddProductController } from '@/presentation/controllers/product';
import { Controller } from '@/presentation/protocols';
import { Validator } from '@/validation/protocols';
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators';

const establishmentRepository = new EstablishmentTypeOrmRepository();

export const makeAddProductController = (): Controller => {
  const usecase = new DBAddProduct(
    new UUIDAdapter(),
    establishmentRepository,
    new ProductTypeOrmRepository()
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
  // establishmentId

  const validator: Validator = new ValidationComposite([
    ...establishmentIdValidator,
    ...nameValidator,
    ...priceValidator,
    ...descriptionValidator
  ]);

  return new AddProductController(validator, usecase);
};
