import { UserTypeOrmRepository } from '@/infra/db/typeorm';
import { BcryptAdapter } from '@/infra/cryptography';
import { AddUserController } from '@/presentation/controllers/user';
import { Controller } from '@/presentation/protocols';
import { Validator } from '@/validation/protocols';
import { ValidatorBuilder, ValidationComposite } from '@/validation/validators';
import { DBAddUser } from '@/data/implementations/user';
import {
  SearchUserByEmailRepository,
  AddUserRepository,
  IDGenerator,
  Hasher
} from '@/data/protocols';
import { UUIDAdapter } from '@/infra/uuid-adapter';

type UserRepository = AddUserRepository & SearchUserByEmailRepository;
const salt = 12;

const repository: UserRepository = new UserTypeOrmRepository();
const idGenerator: IDGenerator = new UUIDAdapter();
const hasher: Hasher = new BcryptAdapter(salt);

const makeValidationAddUser = (): Validator => {
  const nameValidator = ValidatorBuilder.field('nome')
    .required('Nome não informada')
    .build();

  const emailValidator = ValidatorBuilder.field('email')
    .required('E-mail não informado')
    .email('Valor informado não é um email')
    .build();

  const passwordValidator = ValidatorBuilder.field('password')
    .required('Senha não informada')
    .build();

  const confirmPasswordValidator = ValidatorBuilder.field('confirmPassword')
    .required('Confirmação de Senha não informada')
    .toEqual('password', 'Senhas não batem')
    .build();

  // TODO: criar validator para pertencer a um array
  const accountValidator = ValidatorBuilder.field('accountType')
    .required('Tipo de Conta não Informado')
    .build();

  return new ValidationComposite([
    ...nameValidator,
    ...emailValidator,
    ...passwordValidator,
    ...confirmPasswordValidator,
    ...accountValidator
  ]);
};

export const makeAddUserController = (): Controller => {
  const addUseCase = new DBAddUser(idGenerator, hasher, repository, repository);

  return new AddUserController(makeValidationAddUser(), addUseCase);
};