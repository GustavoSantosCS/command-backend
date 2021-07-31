import { DBCreateSession } from '@/data/implementations'
import { CreateSessionUseCase } from '@/domain/usecases'
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators'
import { CreateSessionController } from '@/presentation/controllers/session'
import { crypt, hasher, userRepo } from '@/main/singletons'

export const makeCreateSessionController = () => {
  const emailValidator = ValidatorBuilder.field('email')
    .required('E-mail não informado')
    .email('Valor informado não é um email')
    .build()

  const passwordValidator = ValidatorBuilder.field('password')
    .required('Senha não informada')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .build()

  const validator = new ValidationComposite([
    ...emailValidator,
    ...passwordValidator
  ])

  const createSession: CreateSessionUseCase = new DBCreateSession(
    userRepo,
    hasher,
    crypt
  )
  return new CreateSessionController(validator, createSession)
}
