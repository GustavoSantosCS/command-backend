import faker from 'faker';
import { AccountType, UserModel } from '@/domain/models';

faker.locale = 'pt_BR';

export const makeMockUserModel = (): UserModel => ({
  id: faker.datatype.uuid(),
  nome: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  accountType: faker.random.arrayElement<AccountType>([
    AccountType.Client,
    AccountType.ClientManager,
    AccountType.Manager
  ])
});

export const makeMockAddUserModel = (): Omit<UserModel, 'id'> & {
  confirmPassword: string;
} => {
  const password = faker.internet.password();
  const confirmPassword = password;
  return {
    nome: faker.name.findName(),
    email: faker.internet.email(),
    password,
    confirmPassword,
    accountType: faker.random.arrayElement<AccountType>([
      AccountType.Client,
      AccountType.ClientManager,
      AccountType.Manager
    ])
  };
};
