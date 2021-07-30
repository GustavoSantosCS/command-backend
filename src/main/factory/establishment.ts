import {
  DBAddEstablishment,
  DBGetAllEstablishments,
  DBGetAllEstablishmentsUser,
  DBGetUserEstablishmentById
} from '@/data/implementations';
import { CATEGORY } from '@/domain/models';
import {
  AddEstablishmentController,
  GetAllUserEstablishmentsController,
  GetUserEstablishmentByIdController,
  GetAllEstablishmentsController
} from '@/presentation/controllers/establishment';
import { Controller } from '@/presentation/protocols';
import { Validator } from '@/validation/protocols';
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators';
import { idGenerator, establishmentRepo, userRepo } from '@/main/singletons';

export const makeAddEstablishmentController = (): Controller => {
  const nameValidator = ValidatorBuilder.field('name')
    .required('Nome não informado')
    .min(3, 'Nome deve conter ao menos 3 letras')
    .build();

  const categoryValidator = ValidatorBuilder.field('category')
    .required('Categoria não informada')
    .belongsTo([...Object.values(CATEGORY)], 'Valor de Categoria Invalido')
    .build();

  const descriptionValidator = ValidatorBuilder.field('description')
    .required('Descrição não informado')
    .min(15, 'Descrição deve conter ao menos 15 letras')
    .build();

  const validator: Validator = new ValidationComposite([
    ...nameValidator,
    ...categoryValidator,
    ...descriptionValidator
  ]);
  const usecase = new DBAddEstablishment(
    idGenerator,
    userRepo,
    establishmentRepo
  );
  return new AddEstablishmentController(validator, usecase);
};

export const makeGetAllEstablishmentController = (): Controller => {
  const usecase = new DBGetAllEstablishments(establishmentRepo);
  return new GetAllEstablishmentsController(usecase);
};

export const makeGetAllUserEstablishmentController = (): Controller => {
  const usecase = new DBGetAllEstablishmentsUser(establishmentRepo);
  return new GetAllUserEstablishmentsController(usecase);
};

export const makeGetUserEstablishmentByIdController = (): Controller => {
  const usecase = new DBGetUserEstablishmentById(establishmentRepo);
  return new GetUserEstablishmentByIdController(usecase);
};
