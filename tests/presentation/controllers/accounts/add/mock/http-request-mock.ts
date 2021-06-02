import { HttpRequest } from '@/presentation/protocols';
import { makeMockAccount } from '@tests/domain/models';
import faker from 'faker';

faker.locale = 'pt_BR';

const addAccount = makeMockAccount();
delete addAccount.id;

export const makeMockHttpRequest = (): HttpRequest => ({
  body: addAccount
});
