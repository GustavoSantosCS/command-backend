import {
  GetUserByIdRepository,
  Hasher,
  SearchUserByEmailRepository,
  UpdateUserRepository
} from '@/data/protocols';
import { EmailAlreadyUseError } from '@/domain/errors';
import { UserModel } from '@/domain/models';
import { UpdateUserUseCase } from '@/domain/usecases';
import { left } from '@/shared/either';

export class DBUpdateUser implements UpdateUserUseCase {
  constructor(
    private readonly getUserByIdRepository: GetUserByIdRepository,
    private readonly hasher: Hasher,
    private readonly searchByEmailRepository: SearchUserByEmailRepository,
    private readonly updateUserRepository: UpdateUserRepository
  ) {}
  async update(newUserData: UserModel): Promise<UpdateUserUseCase.Response> {
    const trackUserData = await this.getUserByIdRepository.getUserById(
      newUserData.id
    );

    if (trackUserData.email !== newUserData.email) {
      const foundUser = await this.searchByEmailRepository.searchByEmail(
        newUserData.email
      );

      if (foundUser) return left(new EmailAlreadyUseError(newUserData.email));
    }

    const user: UserModel = {
      id: newUserData.id,
      email: newUserData.email,
      name: newUserData.name,
      password: await this.hasher.hash(newUserData.password),
      avatar: newUserData.avatar
    };

    const result = await this.updateUserRepository.update(user);
    return result as any;
  }
}
