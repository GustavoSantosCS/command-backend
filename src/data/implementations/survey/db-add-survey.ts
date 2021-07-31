import { SurveyEntity, SurveyMusicEntity } from '@/data/entities'
import {
  IDGenerator,
  AddSurveyRepository,
  GetEstablishmentByIdRepository,
  GetMusicByIdRepository
} from '@/data/protocols'
import {
  EstablishmentNotFoundError,
  MusicNotFoundError
} from '@/domain/errors'
import { AddSurveyUseCase } from '@/domain/usecases'
import { left, right } from '@/shared/either'

export class DBAddSurvey implements AddSurveyUseCase {
  private readonly getEstablishment: GetEstablishmentByIdRepository
  private readonly getMusic: GetMusicByIdRepository
  private readonly addSurveyRepo: AddSurveyRepository
  private readonly idGenerator: IDGenerator

  constructor (
    getEstablishment: GetEstablishmentByIdRepository,
    getMusic: GetMusicByIdRepository,
    addSurveyRepo: AddSurveyRepository,
    idGenerator: IDGenerator
  ) {
    this.getEstablishment = getEstablishment
    this.getMusic = getMusic
    this.addSurveyRepo = addSurveyRepo
    this.idGenerator = idGenerator
  }

  async add ({
    userId,
    establishmentId,
    musics,
    question
  }: AddSurveyUseCase.Param): Promise<AddSurveyUseCase.Result> {
    const establishmentRepo = await this.getEstablishment.getById(
      establishmentId,
      { withManager: true }
    )

    if (establishmentRepo?.manager.id !== userId) { return left(new EstablishmentNotFoundError()) }

    const musicsResult = await Promise.all(
      musics.map(async musicId => this.getMusic.getById(musicId))
    )

    if (musicsResult.some(music => !music)) {
      return left(
        musicsResult.filter(music => !music).map(() => new MusicNotFoundError())
      )
    }

    const newSurvey = new SurveyEntity()
    newSurvey.id = this.idGenerator.generate()
    newSurvey.establishment = establishmentRepo
    newSurvey.surveyToMusic = musicsResult.map((m, i) => {
      const surveyToMusic = new SurveyMusicEntity()
      surveyToMusic.id = this.idGenerator.generate()
      surveyToMusic.music = m
      surveyToMusic.position = i + 1
      surveyToMusic.survey = newSurvey
      return surveyToMusic
    })
    newSurvey.question = question

    const result = await this.addSurveyRepo.save(newSurvey)

    return right(result)
  }
}
