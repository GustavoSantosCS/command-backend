import { UserTypeOrmRepository } from '@/infra/db/typeorm';
import { Controller } from '@/presentation/protocols';
import { Validator } from '@/validation/protocols';
import { ValidatorBuilder, ValidationComposite } from '@/validation/validators';

import { DBUpdateUser } from '@/data/implementations/user';
import { UpdateUserController } from '@/presentation/controllers/user/update-user-controller';
import { BcryptAdapter } from '@/infra/cryptography';

const repository = new UserTypeOrmRepository();

const makeValidationAddUser = (): Validator => {
  const nameValidator = ValidatorBuilder.field('name')
    .required('Nome não informado')
    .min(3, 'Nome deve conter ao menos 3 letras')
    .build();
  const emailValidator = ValidatorBuilder.field('email')
    .required('E-mail não informado')
    .email('Valor informado não é um email')
    .build();
  const passwordValidator = ValidatorBuilder.field('password')
    .required('Senha não informada')
    .min(5, 'Senha deve ter pelo menos 5 caracteres')
    .build();
  const confirmPasswordValidator = ValidatorBuilder.field('confirmPassword')
    .required('Confirmação de Senha não informada')
    .toEqual('password', 'Senhas não batem')
    .build();

  return new ValidationComposite([
    ...nameValidator,
    ...emailValidator,
    ...passwordValidator,
    ...confirmPasswordValidator
  ]);
};

export const makeUpdateUserController = (): Controller => {
  const salt = 12;
  const hasher = new BcryptAdapter(salt);
  const updateUseCase = new DBUpdateUser(
    repository,
    hasher,
    repository,
    repository
  );
  return new UpdateUserController(makeValidationAddUser(), updateUseCase);
};
