import {
  Encrypter,
  HashComparer,
  SearchUserByEmailRepository
} from '@/data/protocols';
import { PayloadModel } from '@/domain/models';
import { CreateSessionUseCase } from '@/domain/usecases/session';
import { LoginError } from '@/presentation/errors/login-error';
import { left, right } from '@/shared/either';

export class DBCreateSession implements CreateSessionUseCase {
  constructor(
    private readonly repository: SearchUserByEmailRepository,
    private comparatorHasher: HashComparer,
    private encrypt: Encrypter
  ) {}

  async createSession({
    email,
    password
  }: CreateSessionUseCase.Params): Promise<CreateSessionUseCase.Result> {
    const user = await this.repository.searchByEmail(email);
    if (!user) return left(new LoginError({ password, email }));

    if (!(await this.comparatorHasher.compare(password, user.password)))
      return left(new LoginError({ password, email }));

    const now = Date.now();
    const payload: PayloadModel = {
      iat: now,
      exp: now * 60 * 60 * 24 * 5, // 5 Dias
      body: { id: user.id }
    };

    const token = await this.encrypt.encrypt(payload);

    return right({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        password: user.password,
        email: user.email,
        avatar: user.avatar
      }
    });
  }
}
