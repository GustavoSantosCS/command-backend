import { DBAddVote } from '@/data/implementations';
import { IDGenerator } from '@/data/protocols';
import {
  MusicTypeOrmRepository,
  SurveyTypeOrmRepository,
  UserTypeOrmRepository,
  VoteTypeOrmRepository
} from '@/infra/db/typeorm';
import { UUIDAdapter } from '@/infra/uuid-adapter';
import { AddVoteController } from '@/presentation/controllers/vote';
import { Controller } from '@/presentation/protocols';
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators';

const surveyRepo = new SurveyTypeOrmRepository();
const userRepo = new UserTypeOrmRepository();
const voteRepo = new VoteTypeOrmRepository();
const idGenerator: IDGenerator = new UUIDAdapter();

export const makeAddVoteController = (): Controller => {
  const usecase = new DBAddVote(surveyRepo, userRepo, voteRepo, idGenerator);

  const surveyValidator = ValidatorBuilder.field('surveyId')
    .required('Enquete não informada')
    .isString('Valor informado para enquete é invalida')
    .build();

  const musicValidator = ValidatorBuilder.field('musicId')
    .required('Musica escolhida não informada')
    .isString('Valor informado para musica é invalida')
    .build();

  const validator = new ValidationComposite([
    ...surveyValidator,
    ...musicValidator
  ]);

  return new AddVoteController(validator, usecase);
};
