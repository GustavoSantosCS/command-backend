import {
  Encrypter,
  HashComparer,
  SearchUserByEmailRepository
} from '@/data/protocols'
import { PayloadModel } from '@/domain/models'
import { CreateSessionUseCase } from '@/domain/usecases'
import { FailedLoginError } from '@/domain/errors'
import { left, right } from '@/shared/either'

export class DBCreateSession implements CreateSessionUseCase {
  private readonly searchUserByEmailRepo: SearchUserByEmailRepository
  private readonly comparatorHasher: HashComparer
  private readonly encrypt: Encrypter

  constructor(
    repository: SearchUserByEmailRepository,
    comparatorHasher: HashComparer,
    encrypt: Encrypter
  ) {
    this.searchUserByEmailRepo = repository
    this.comparatorHasher = comparatorHasher
    this.encrypt = encrypt
  }

  async createSession({
    email,
    password
  }: CreateSessionUseCase.Params): Promise<CreateSessionUseCase.Result> {
    const user = await this.searchUserByEmailRepo.searchByEmail(email)
    if (!user) return left(new FailedLoginError({ password, email }))

    if (!(await this.comparatorHasher.compare(password, user.password))) {
      return left(new FailedLoginError({ password, email }))
    }

    const now = Date.now()
    const payload: PayloadModel = {
      iat: now,
      exp: now * 60 * 60 * 24 * 5, // 5 Dias
      body: { id: user.id }
    }

    const token = await this.encrypt.encrypt(payload)

    const result: CreateSessionUseCase.Return = {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }

    return right(result)
  }
}
