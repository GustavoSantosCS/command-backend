import {
  DBAddProduct,
  DBGetAllEstablishmentProducts,
  DBGetProductByID
} from '@/data/implementations'
import {
  AddProductController,
  GetProductByIdController,
  GetAllEstablishmentProductsController
} from '@/presentation/controllers/product'
import { Controller } from '@/presentation/protocols'
import { Validator } from '@/validation/protocols'
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators'
import { establishmentRepo, idGenerator, productRepo } from '@/main/singletons'

export const makeAddProductController = (): Controller => {
  const usecase = new DBAddProduct(idGenerator, establishmentRepo, productRepo)

  const nameValidator = ValidatorBuilder.field('name')
    .required('Nome não informado')
    .min(3, 'Nome deve conter ao menos 3 letras')
    .build()

  const descriptionValidator = ValidatorBuilder.field('description')
    .required('Descrição não informado')
    .min(15, 'Descrição deve conter ao menos 15 letras')
    .build()

  const priceValidator = ValidatorBuilder.field('price')
    .required('Preço não informado')
    .isNumber('Preço deve ser um numero')
    .build()

  const establishmentIdValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informado')
    .build()

  const validator: Validator = new ValidationComposite([
    ...establishmentIdValidator,
    ...nameValidator,
    ...priceValidator,
    ...descriptionValidator
  ])

  return new AddProductController(validator, usecase)
}

export const makerGetProductByIdController = (): Controller => {
  const usecase = new DBGetProductByID(productRepo)
  return new GetProductByIdController(usecase)
}

export const makeGetAllEstablishmentProductsController = (): Controller => {
  const usecase = new DBGetAllEstablishmentProducts(
    establishmentRepo,
    productRepo
  )
  return new GetAllEstablishmentProductsController(usecase)
}
