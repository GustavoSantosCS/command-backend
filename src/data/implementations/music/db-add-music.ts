import { MusicEntity } from '@/data/entities'
import { MusicImageEntity } from '@/data/entities/music-image-entity'
import {
  AddMusicRepository,
  GetEstablishmentByIdRepository,
  UniqueIdGenerator
} from '@/data/protocols'
import { EstablishmentNotFoundError } from '@/domain/errors'
import { AddMusicUseCase } from '@/domain/usecases'
import { left, right } from '@/shared/either'

export class DBAddMusic implements AddMusicUseCase {
  private readonly idGenerator: UniqueIdGenerator
  private readonly getEstablishmentByIdRepo: GetEstablishmentByIdRepository
  private readonly addMusicRepo: AddMusicRepository

  constructor(
    idGenerator: UniqueIdGenerator,
    getEstablishmentByIdRepo: GetEstablishmentByIdRepository,
    addMusicRepo: AddMusicRepository
  ) {
    this.idGenerator = idGenerator
    this.getEstablishmentByIdRepo = getEstablishmentByIdRepo
    this.addMusicRepo = addMusicRepo
  }

  async add({
    userId,
    establishmentId,
    name,
    talent,
    duration,
    musicImage
  }: AddMusicUseCase.Params): Promise<AddMusicUseCase.Result> {
    const establishmentRepo = await this.getEstablishmentByIdRepo.getById(
      establishmentId,
      { withManager: true }
    )
    if (establishmentRepo?.manager.id !== userId) {
      return left(new EstablishmentNotFoundError())
    }

    const newMusic = new MusicEntity()
    newMusic.id = this.idGenerator.generate()
    newMusic.name = name
    newMusic.talent = talent
    newMusic.duration = duration
    newMusic.establishment = establishmentRepo
    const image = new MusicImageEntity()
    Object.assign(image, musicImage)
    newMusic.image = image
    const result = await this.addMusicRepo.save(newMusic)
    return right(result)
  }
}
