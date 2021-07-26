import { EstablishmentEntity, MusicEntity } from '@/data/entities';
import { IDGenerator, AddSurveyRepository } from '@/data/protocols';
import { MusicNotFoundError } from '@/domain/errors';
import { SurveyModel } from '@/domain/models';
import {
  GetUserEstablishmentByIdUseCase,
  GetMusicByIdUseCase,
  AddSurveyUseCase
} from '@/domain/usecases';
import { left, right } from '@/shared/either';

export class DBAddSurvey implements AddSurveyUseCase {
  private readonly getEstablishmentById: GetUserEstablishmentByIdUseCase;
  private readonly getMusicById: GetMusicByIdUseCase;
  private readonly addSurveyRepo: AddSurveyRepository;
  private readonly idGenerator: IDGenerator;

  constructor(
    getEstablishmentById: GetUserEstablishmentByIdUseCase,
    getMusicById: GetMusicByIdUseCase,
    addSurveyRepo: AddSurveyRepository,
    idGenerator: IDGenerator
  ) {
    this.getEstablishmentById = getEstablishmentById;
    this.getMusicById = getMusicById;
    this.addSurveyRepo = addSurveyRepo;
    this.idGenerator = idGenerator;
  }

  async addSurvey({
    userId,
    establishmentId,
    musics,
    question
  }: AddSurveyUseCase.Param): Promise<AddSurveyUseCase.Result> {
    const establishment =
      await this.getEstablishmentById.getUserEstablishmentById(
        userId,
        establishmentId
      );
    if (establishment.isLeft()) {
      return left(establishment.value);
    }

    const musicsResult = await Promise.all(
      musics.map(music => this.getMusicById.getMusicById(music.id))
    );
    if (musicsResult.some(music => music.isLeft())) {
      return left(
        musicsResult
          .filter(music => music.isLeft())
          .map(music => music.value) as MusicNotFoundError[]
      );
    }

    const survey: SurveyModel = {
      id: this.idGenerator.generate(),
      establishment: establishment.value as EstablishmentEntity,
      question,
      choices: musicsResult.map(({ value }, index) => ({
        id: this.idGenerator.generate(),
        music: value as MusicEntity,
        votes: 0,
        position: index + 1
      }))
    };
    const result = await this.addSurveyRepo.addSurvey(survey);

    return right(result);
  }
}
