import {
  DBAddPlayList,
  DBGetCurrentEstablishmentPlaylist,
  DBNextMusicOfPlaylist,
  DBPreviousMusicOfPlaylist,
  DBStartMusicOfPlaylist,
  DBStopMusicOfPlaylist,
  DBUpdateMusicsOfPlaylist,
  DBUpdatePlaylist
} from '@/data/implementations/playlist'
import {
  AddPlayListController,
  GetCurrentEstablishmentPlaylistController,
  NextPlaylistMusicController,
  PreviousPlaylistMusicController,
  StartPlaylistMusicController,
  StopPlaylistMusicController,
  UpdateMusicsOfPlaylistController,
  UpdatePlaylistController
} from '@/presentation/controllers/playlist'
import { Controller } from '@/presentation/protocols'
import { Validator } from '@/validation/protocols'
import { ValidationComposite, ValidatorBuilder } from '@/validation/validators'
import {
  establishmentRepo,
  idGenerator,
  musicRepo,
  playlistRepo
} from '@/main/singletons'

export const makeAddPlaylistController = (): Controller => {
  const nameValidator = ValidatorBuilder.field('name')
    .required('Nome da Playlist não informado')
    .min(3, 'Nome da Playlist deve conter ao menos 3 letras')
    .build()

  const establishmentIdValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informado')
    .build()

  const musicsValidator = ValidatorBuilder.field('musics')
    .required('Musicas não informadas')
    .isArray('Musicas informada de forma incorreta')
    .build()

  const validator: Validator = new ValidationComposite([
    ...nameValidator,
    ...establishmentIdValidator,
    ...musicsValidator
  ])

  const usecase = new DBAddPlayList(
    idGenerator,
    establishmentRepo,
    playlistRepo,
    musicRepo
  )

  return new AddPlayListController(validator, usecase)
}

export const makeGetCurrentEstablishmentPlaylistController = (): Controller => {
  const establishmentIdValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informado')
    .build()

  const validator: Validator = new ValidationComposite([
    ...establishmentIdValidator
  ])

  const usecase = new DBGetCurrentEstablishmentPlaylist(
    establishmentRepo,
    playlistRepo
  )

  return new GetCurrentEstablishmentPlaylistController(validator, usecase)
}

export const makeUpdatePlaylistController = (): Controller => {
  const idValidator = ValidatorBuilder.field('id')
    .required('Identificador da Playlist não informado')
    .build()

  const ativeValidator = ValidatorBuilder.field('active')
    .required('Status da Playlist não informado')
    .isBoolean('Status informado não suportado')
    .build()

  const nameValidator = ValidatorBuilder.field('name')
    .required('Nome da Playlist não informado')
    .min(3, 'Nome da Playlist deve conter ao menos 3 letras')
    .build()

  const establishmentIdValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informado')
    .build()

  const validator: Validator = new ValidationComposite([
    ...idValidator,
    ...ativeValidator,
    ...nameValidator,
    ...establishmentIdValidator
  ])

  const usecase = new DBUpdatePlaylist(
    playlistRepo,
    playlistRepo,
    playlistRepo
  )
  return new UpdatePlaylistController(validator, usecase)
}

export const makeUpdateMusicsOfPlaylistController = (): Controller => {
  const idValidator = ValidatorBuilder.field('id')
    .required('Identificador da Playlist não informado')
    .build()

  const musicsValidator = ValidatorBuilder.field('musics')
    .required('Musicas não informadas')
    .isArray('Musicas informada de forma incorreta')
    .build()

  const establishmentIdValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informado')
    .build()

  const validator: Validator = new ValidationComposite([
    ...idValidator,
    ...musicsValidator,
    ...establishmentIdValidator
  ])

  const usecase = new DBUpdateMusicsOfPlaylist(
    playlistRepo,
    playlistRepo,
    musicRepo,
    idGenerator
  )
  return new UpdateMusicsOfPlaylistController(validator, usecase)
}

export const makeNextMusicPlaylistController = (): Controller => {
  const idValidator = ValidatorBuilder.field('playlistId')
    .required('Identificador da Playlist não informado')
    .build()

  const establishmentIdValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informado')
    .build()

  const validator: Validator = new ValidationComposite([
    ...idValidator,
    ...establishmentIdValidator
  ])

  const usecase = new DBNextMusicOfPlaylist(playlistRepo, playlistRepo)
  return new NextPlaylistMusicController(validator, usecase)
}

export const makePreviousMusicPlaylistController = (): Controller => {
  const idValidator = ValidatorBuilder.field('playlistId')
    .required('Identificador da Playlist não informado')
    .build()

  const establishmentIdValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informado')
    .build()

  const validator: Validator = new ValidationComposite([
    ...idValidator,
    ...establishmentIdValidator
  ])

  const usecase = new DBPreviousMusicOfPlaylist(playlistRepo, playlistRepo)
  return new PreviousPlaylistMusicController(validator, usecase)
}

export const makeStartMusicPlaylistController = (): Controller => {
  const idValidator = ValidatorBuilder.field('playlistId')
    .required('Identificador da Playlist não informado')
    .build()

  const establishmentIdValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informado')
    .build()

  const validator: Validator = new ValidationComposite([
    ...idValidator,
    ...establishmentIdValidator
  ])

  const usecase = new DBStartMusicOfPlaylist(playlistRepo, playlistRepo)
  return new StartPlaylistMusicController(validator, usecase)
}

export const makeStopMusicPlaylistController = (): Controller => {
  const idValidator = ValidatorBuilder.field('playlistId')
    .required('Identificador da Playlist não informado')
    .build()

  const establishmentIdValidator = ValidatorBuilder.field('establishmentId')
    .required('Estabelecimento não informado')
    .build()

  const validator: Validator = new ValidationComposite([
    ...idValidator,
    ...establishmentIdValidator
  ])

  const usecase = new DBStopMusicOfPlaylist(playlistRepo, playlistRepo)
  return new StopPlaylistMusicController(validator, usecase)
}
