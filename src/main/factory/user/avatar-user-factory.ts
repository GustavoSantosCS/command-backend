import { DBUserAvatar } from '@/data/implementations/user';
import { UserTypeOrmRepository } from '@/infra/db/typeorm';
import { UnlinkAvatarDisc } from '@/infra/unlink-avatar';
import { UserAvatarController } from '@/presentation/controllers/user';
import { Controller } from '@/presentation/protocols';
import { Validator } from '@/validation/protocols';
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators';

export const makeValidationAddAvatarUser = (): Validator => {
  const avatarValidator = ValidatorBuilder.field('avatar')
    .required('Avatar não informado')
    .build();
  return new ValidationComposite([...avatarValidator]);
};

export const makerAddAvatarController = (): Controller => {
  const unlinkAvatar = new UnlinkAvatarDisc();
  const repository = new UserTypeOrmRepository();
  const usecase = new DBUserAvatar(repository, unlinkAvatar, repository);
  const controller = new UserAvatarController(usecase);

  return controller;
};
