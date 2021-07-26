import { UserTypeOrmRepository } from '@/infra/db/typeorm';
import { BcryptAdapter } from '@/infra/cryptography';
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter';
import {
  DBGetAuthenticatedUser,
  DBUpdateUser,
  DBCreateSession,
  DBUserAvatar,
  DBAddUser
} from '@/data/implementations';
import { HashComparer, Hasher, IDGenerator } from '@/data/protocols';
import { Validator } from '@/validation/protocols';
import { ValidatorBuilder, ValidationComposite } from '@/validation/validators';
import { Controller } from '@/presentation/protocols';
import {
  AddUserController,
  GetAuthenticatedUserController,
  UpdateUserController,
  UpdateUserAvatarController
} from '@/presentation/controllers/user';

import { UnlinkAvatarDisc } from '@/infra/unlink-avatar';
import { UUIDAdapter } from '@/infra/uuid-adapter';

const salt = 12;
const repository = new UserTypeOrmRepository();
const idGenerator: IDGenerator = new UUIDAdapter();
const hasher: Hasher = new BcryptAdapter(salt);
const comparatorHasher: HashComparer = new BcryptAdapter(salt);
export const makeAddUserController = (): Controller => {
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
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .build();

  const confirmPasswordValidator = ValidatorBuilder.field('confirmPassword')
    .required('Confirmação de Senha não informada')
    .toEqual('password', 'Senhas não batem')
    .build();

  const validator = new ValidationComposite([
    ...nameValidator,
    ...emailValidator,
    ...passwordValidator,
    ...confirmPasswordValidator
  ]);

  const addUseCase = new DBAddUser(idGenerator, hasher, repository, repository);
  return new AddUserController(validator, addUseCase);
};

export const makeUpdateUserController = (): Controller => {
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

  const validator: Validator = new ValidationComposite([
    ...nameValidator,
    ...emailValidator,
    ...passwordValidator
  ]);

  const updateUseCase = new DBUpdateUser(
    repository,
    hasher,
    comparatorHasher,
    repository,
    repository
  );

  return new UpdateUserController(validator, updateUseCase);
};

export const makeGetAuthenticatedUserController = (): Controller => {
  const usecase = new DBGetAuthenticatedUser(new UserTypeOrmRepository());

  return new GetAuthenticatedUserController(usecase);
};

export const makerAddAvatarController = (): Controller => {
  const unlinkAvatar = new UnlinkAvatarDisc();
  const usecase = new DBUserAvatar(repository, unlinkAvatar, repository);

  return new UpdateUserAvatarController(usecase);
};
