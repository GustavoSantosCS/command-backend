import {
  DBAddSurvey,
  DBGetAllEstablishmentSurvey,
  DBCloseSurvey,
  DBGetSurveyById
} from '@/data/implementations'
import {
  CloseSurveyController,
  GetAllEstablishmentSurveyController,
  AddSurveyController,
  GetSurveyByIdController
} from '@/presentation/controllers/survey'
import { Controller } from '@/presentation/protocols'
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators'
import {
  establishmentRepo,
  idGenerator,
  musicRepo,
  surveyRepo
} from '@/main/singletons'

export const makeAddSurveyController = (): Controller => {
  const questionValidator = ValidatorBuilder.field('question')
    .required('Questão não informada')
    .isString('Questão deve ser uma string')
    .min(15, 'Questão deve ter pelo menos 15 caractere')
    .max(100, 'Questão deve ter no máximo 100 caractere')
    .build()

  const establishmentValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informada')
    .build()

  const musicsValidator = ValidatorBuilder.field('musics')
    .required('Musicas não informadas')
    .isArray('Musics informadas em formato não suportado')
    .build()

  const validator = new ValidationComposite([
    ...questionValidator,
    ...establishmentValidator,
    ...musicsValidator
  ])

  const usecase = new DBAddSurvey(
    establishmentRepo,
    musicRepo,
    surveyRepo,
    idGenerator
  )
  return new AddSurveyController(validator, usecase)
}

export const makeGetAllEstablishmentSurveyController = (): Controller => {
  const usecase = new DBGetAllEstablishmentSurvey(
    establishmentRepo,
    surveyRepo
  )
  return new GetAllEstablishmentSurveyController(usecase)
}

export const makeCloseSurveyController = (): Controller => {
  const usecase = new DBCloseSurvey(surveyRepo, surveyRepo)
  return new CloseSurveyController(usecase)
}

export const makeGetSurveyByIdController = (): Controller => {
  const usecase = new DBGetSurveyById(surveyRepo)
  return new GetSurveyByIdController(usecase)
}
