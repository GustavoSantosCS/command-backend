import { DBCreateSession } from '@/data/implementations/session';
import { HashComparer, SearchUserByEmailRepository } from '@/data/protocols';
import { CreateSessionUseCase } from '@/domain/usecases/session';
import { BcryptAdapter } from '@/infra/cryptography';
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter';
import { UserTypeOrmRepository } from '@/infra/db/typeorm';
import { CreateSessionController } from '@/presentation/controllers/session';
import { Validator } from '@/validation/protocols';
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators';
import { env } from '@/shared/config';

const salt = 12;
const makeValidator = (): Validator => {
  const emailValidator = ValidatorBuilder.field('email')
    .required('E-mail não informado')
    .email('Valor informado não é um email')
    .build();

  const passwordValidator = ValidatorBuilder.field('password')
    .required('Senha não informada')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .build();

  return new ValidationComposite([...emailValidator, ...passwordValidator]);
};

export const makeCreateSessionController = () => {
  const repository: SearchUserByEmailRepository = new UserTypeOrmRepository();
  const comparatorHasher: HashComparer = new BcryptAdapter(salt);
  const encrypter = new JwtAdapter(env.app.key);

  const createSession: CreateSessionUseCase = new DBCreateSession(
    repository,
    comparatorHasher,
    encrypter
  );
  return new CreateSessionController(makeValidator(), createSession);
};
