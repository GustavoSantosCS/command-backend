import faker from 'faker';
import { Account, AccountType } from '@/domain/models';

faker.locale = 'pt_BR';

export const makeMockAccount = (): Account => ({
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

export const makeMockAddAccount = (): Account => ({
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
