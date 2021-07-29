import { DBAddVote } from '@/data/implementations';
import { AddVoteController } from '@/presentation/controllers/vote';
import { Controller } from '@/presentation/protocols';
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators';
import { idGenerator, surveyRepo, userRepo, voteRepo } from '@/main/singletons';

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
