import {
  DBAddPlayList,
  DBGetCurrentEstablishmentPlaylist
} from '@/data/implementations/playlist';
import { EstablishmentTypeOrmRepository } from '@/infra/db/typeorm';
import { MusicTypeOrmRepository } from '@/infra/db/typeorm/music-typeorm-repository';
import { PlaylistTypeOrmRepository } from '@/infra/db/typeorm/playlist-typeorm-repository';
import { UUIDAdapter } from '@/infra/uuid-adapter';
import {
  AddPlayListController,
  GetCurrentEstablishmentPlaylistController
} from '@/presentation/controllers/playlist';
import { Controller } from '@/presentation/protocols';
import { Validator } from '@/validation/protocols';
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators';

const repoEstablishment = new EstablishmentTypeOrmRepository();
const repoPlayList = new PlaylistTypeOrmRepository();
const repoMusic = new MusicTypeOrmRepository();

export const makeAddPlaylistController = (): Controller => {
  const nameValidator = ValidatorBuilder.field('name')
    .required('Nome da Playlist não informado')
    .min(3, 'Nome da Playlist deve conter ao menos 3 letras')
    .build();

  const establishmentIdValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informado')
    .build();

  const musicsValidator = ValidatorBuilder.field('musics')
    .required('Musicas não informadas')
    .isArray('Musicas informada de forma incorreta')
    .build();

  const validator: Validator = new ValidationComposite([
    ...nameValidator,
    ...establishmentIdValidator,
    ...musicsValidator
  ]);

  const usecase = new DBAddPlayList(
    new UUIDAdapter(),
    repoEstablishment,
    repoPlayList,
    repoMusic
  );

  return new AddPlayListController(validator, usecase);
};

export const makeGetCurrentEstablishmentPlaylistController = (): Controller => {
  const establishmentIdValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informado')
    .build();

  const validator: Validator = new ValidationComposite([
    ...establishmentIdValidator
  ]);

  const usecase = new DBGetCurrentEstablishmentPlaylist(
    repoEstablishment,
    repoPlayList
  );

  return new GetCurrentEstablishmentPlaylistController(validator, usecase);
};
