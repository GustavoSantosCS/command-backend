import { DBRevalidateUser } from '@/data/implementations';
import { UserTypeOrmRepository } from '@/infra/db/typeorm';
import { RevalidateUserController } from '@/presentation/controllers/user';
import { Controller } from '@/presentation/protocols';

export const makeRevalidateUserController = (): Controller => {
  const usecase = new DBRevalidateUser(new UserTypeOrmRepository());

  return new RevalidateUserController(usecase);
};
