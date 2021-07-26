import {
  DBAddSurvey,
  DBGetMusicById,
  DBGetUserEstablishmentById
} from '@/data/implementations';
import { DBGetAllEstablishmentSurvey } from '@/data/implementations/survey/db-get-all-establishment-survey';
import { EstablishmentTypeOrmRepository } from '@/infra/db/typeorm';
import { MusicTypeOrmRepository } from '@/infra/db/typeorm/music-typeorm-repository';
import { SurveyTypeOrmRepository } from '@/infra/db/typeorm/survey-typeorm-repository';
import { UUIDAdapter } from '@/infra/uuid-adapter';
import { GetAllEstablishmentSurveyController } from '@/presentation/controllers/survey';
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey-controller';
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators';

export const makeAddSurveyController = () => {
  const questionValidator = ValidatorBuilder.field('question')
    .required('Questão não informada')
    .isString('Questão deve ser uma string')
    .min(15, 'Questão deve ter pelo menos 15 caractere')
    .max(100, 'Questão deve ter no máximo 100 caractere')
    .build();

  const establishmentValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informada')
    .build();

  const musicsValidator = ValidatorBuilder.field('musics')
    .required('Musicas não informadas')
    .isArray('Musics informadas em formato não suportado')
    .build();

  const validator = new ValidationComposite([
    ...questionValidator,
    ...establishmentValidator,
    ...musicsValidator
  ]);

  const usecase = new DBAddSurvey(
    new DBGetUserEstablishmentById(new EstablishmentTypeOrmRepository()),
    new DBGetMusicById(new MusicTypeOrmRepository()),
    new SurveyTypeOrmRepository(),
    new UUIDAdapter()
  );
  return new AddSurveyController(validator, usecase);
};

export const makeGetAllEstablishmentSurveyController = () => {
  const usecase = new DBGetAllEstablishmentSurvey(
    new EstablishmentTypeOrmRepository(),
    new SurveyTypeOrmRepository()
  );
  return new GetAllEstablishmentSurveyController(usecase);
};
