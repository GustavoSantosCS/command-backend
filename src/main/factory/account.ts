import { DBCreateAccount, DBGetAllUserAccount } from '@/data/implementations';
import {
  CreateAccountController,
  GetAllUserAccountController
} from '@/presentation/controllers/account';
import { Controller } from '@/presentation/protocols';
import { Validator } from '@/validation/protocols';
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators';
import {
  accountRepo,
  establishmentRepo,
  idGenerator,
  userRepo
} from '@/main/singletons';

export const makeCreateAccountController = (): Controller => {
  const establishmentIdValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informado')
    .build();

  const validator: Validator = new ValidationComposite([
    ...establishmentIdValidator
  ]);

  const usecase = new DBCreateAccount(
    idGenerator,
    establishmentRepo,
    userRepo,
    accountRepo
  );

  return new CreateAccountController(validator, usecase);
};

export const makeGetAllUserAccountController = (): Controller => {
  const usecase = new DBGetAllUserAccount(accountRepo);
  return new GetAllUserAccountController(usecase);
};
