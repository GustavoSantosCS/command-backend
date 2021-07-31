import { UserEntity } from '@/data/entities';
import faker from 'faker';
import { makeMockAvatarUser } from './avatar-mock';

faker.locale = 'pt_BR';

type ConfigMock = {
  avatar?: boolean;
  id?: boolean;
};

export const makeMockUser = ({
  id = true,
  avatar = false
}: ConfigMock): UserEntity => {
  const user = new UserEntity();

  user.id = id ? faker.datatype.uuid() : null;
  user.name = faker.name.findName();
  user.email = faker.internet.email().toLowerCase();
  user.password = faker.internet.password();
  user.createdAt = faker.date.past();
  user.updatedAt = faker.date.recent();

  if (avatar) {
    user.avatar = makeMockAvatarUser();
  }
  return user;
};

export const makeMockAddUser = (): Omit<
  UserEntity,
  'id' | 'createdAt' | 'updatedAt'
> & {
  confirmPassword: string;
} => {
  const password = faker.internet.password();
  const confirmPassword = password;
  return {
    name: faker.name.findName(),
    email: faker.internet.email().toLowerCase(),
    password,
    confirmPassword
  };
};
