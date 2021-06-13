import faker from 'faker';
import { UserModel } from '@/domain/models';
import { makeMockAvatarUserModel } from './avatar-mock';

faker.locale = 'pt_BR';

type ConfigMock = {
  avatar?: boolean;
  id?: boolean;
};

export const makeMockUserModel = ({
  id = true,
  avatar = false
}: ConfigMock): UserModel => {
  const user: UserModel = {
    id: id ? faker.datatype.uuid() : null,
    nome: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  if (avatar) user.avatar = makeMockAvatarUserModel();

  return user;
};

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
