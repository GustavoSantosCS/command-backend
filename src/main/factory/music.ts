import { DBAddMusic } from '@/data/implementations';
import { EstablishmentTypeOrmRepository } from '@/infra/db/typeorm';
import { MusicTypeOrmRepository } from '@/infra/db/typeorm/music-typeorm-repository';
import { UUIDAdapter } from '@/infra/uuid-adapter';
import { AddMusicController } from '@/presentation/controllers/music';
import { Controller } from '@/presentation/protocols';
import { Validator } from '@/validation/protocols';
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators';

export const makeAddMusicController = (): Controller => {
  const nameValidator = ValidatorBuilder.field('name')
    .required('Nome da Musica não informado')
    .min(3, 'Nome deve conter ao menos 3 letras')
    .build();

  const talentValidator = ValidatorBuilder.field('talent')
    .required('Nome do Artista ou Banda não informado')
    .min(3, 'Nome do Artista ou Banda deve conter ao menos 3 letras')
    .build();

  const durationValidator = ValidatorBuilder.field('duration')
    .required('Duração da Musica não informado')
    .isNumber('Duração da Musica deve ser um numero')
    .build();

  const establishmentIdValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informado')
    .build();

  const validator: Validator = new ValidationComposite([
    ...nameValidator,
    ...talentValidator,
    ...durationValidator,
    ...establishmentIdValidator
  ]);

  const usecase = new DBAddMusic(
    new UUIDAdapter(),
    new EstablishmentTypeOrmRepository(),
    new MusicTypeOrmRepository()
  );

  return new AddMusicController(validator, usecase);
};
