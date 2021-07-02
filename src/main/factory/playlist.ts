import { DBAddPlayList } from '@/data/implementations/playlist';
import { EstablishmentTypeOrmRepository } from '@/infra/db/typeorm';
import { PlaylistTypeOrmRepository } from '@/infra/db/typeorm/playlist-typeorm-repository';
import { UUIDAdapter } from '@/infra/uuid-adapter';
import { AddPlayListController } from '@/presentation/controllers/playlist';
import { Controller } from '@/presentation/protocols';
import { Validator } from '@/validation/protocols';
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators';

const repoEstablished = new EstablishmentTypeOrmRepository();
const repoPlayList = new PlaylistTypeOrmRepository();

export const makeAddPlaylistController = (): Controller => {
  const nameValidator = ValidatorBuilder.field('name')
    .required('Nome da Playlist não informado')
    .min(3, 'Nome da Playlist deve conter ao menos 3 letras')
    .build();

  const establishmentIdValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informado')
    .build();

  const validator: Validator = new ValidationComposite([
    ...nameValidator,
    ...establishmentIdValidator
  ]);

  const usecase = new DBAddPlayList(
    new UUIDAdapter(),
    repoEstablished,
    repoPlayList
  );

  return new AddPlayListController(validator, usecase);
};
