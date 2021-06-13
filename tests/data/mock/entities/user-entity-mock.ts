import faker from 'faker';
import { UserEntity } from '@/data/entities';
import { UserModel } from '@/domain/models';
import { makeMockAvatarUserModel } from '@tests/domain/mock/models';

export const makeMockUserEntity = (userModel?: UserModel): UserEntity => {
  let model = userModel;
  if (!model) {
    model = {
      id: faker.datatype.uuid(),
      nome: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      avatar: makeMockAvatarUserModel()
    };
  }

  const userEntity = new UserEntity(model);
  return userEntity;
};
