import faker from 'faker';
import { UserModel } from '@/domain/models';

faker.locale = 'pt_BR';

export const makeMockUserModel = (): UserModel => ({
  id: faker.datatype.uuid(),
  nome: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
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
    confirmPassword
  };
};
