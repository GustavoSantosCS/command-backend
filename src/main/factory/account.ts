import { DBCreateAccount, DBGetAllUserAccount } from '@/data/implementations';
import { EstablishmentTypeOrmRepository } from '@/infra/db/typeorm';
import { AccountTypeOrmRepository } from '@/infra/db/typeorm/account-typeorm-repository';
import { UUIDAdapter } from '@/infra/uuid-adapter';
import { CreateAccountController } from '@/presentation/controllers/account/add-account-controller';
import { GetAllUserAccountController } from '@/presentation/controllers/account/get-all-user-account-controller';
import { Controller } from '@/presentation/protocols';
import { Validator } from '@/validation/protocols';
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators';

export const makeCreateAccountController = (): Controller => {
  const establishmentIdValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informado')
    .build();

  const validator: Validator = new ValidationComposite([
    ...establishmentIdValidator
  ]);

  const usecase = new DBCreateAccount(
    new UUIDAdapter(),
    new EstablishmentTypeOrmRepository(),
    new AccountTypeOrmRepository()
  );

  return new CreateAccountController(validator, usecase);
};

export const makeGetAllUserAccountController = (): Controller => {
  const usecase = new DBGetAllUserAccount(new AccountTypeOrmRepository());
  return new GetAllUserAccountController(usecase);
};
