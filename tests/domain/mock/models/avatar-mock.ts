import faker from 'faker';
import { AvatarModel } from '@/domain/models';
import * as env from '@/shared/config';

faker.locale = 'pt_BR';

export const makeMockAvatarUserModel = (): AvatarModel => {
  const originalName = faker.random.word();
  const persistentName = `${faker.datatype.uuid()}-${originalName}`;
  const target = `${env.app.protocol}://${env.app.host}:${env.app.port}/files/${persistentName}`;
  return {
    originalName,
    persistentName,
    target
  };
};
