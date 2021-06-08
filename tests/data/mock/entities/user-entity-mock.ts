import { UserEntity } from '@/data/entities';
import { UserModel } from '@/domain/models';
import faker from 'faker';

export const makeMockUserEntity = (): UserEntity => {
  const userModel: UserModel = {
    id: faker.datatype.uuid(),
    nome: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  };
  const userEntity = new UserEntity(userModel);
  return userEntity;
};
