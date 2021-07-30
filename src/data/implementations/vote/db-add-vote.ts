import { VoteEntity } from '@/data/entities';
import {
  GetSurveyByIdRepository,
  GetUserByIdRepository,
  IDGenerator,
  SaveVoteRepository
} from '@/data/protocols';
import {
  ClientAlreadyVotedError,
  MusicNotFoundError,
  SurveyIsCloseError,
  SurveyNotFoundError
} from '@/domain/errors';
import { AddVoteUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';

export class DBAddVote implements AddVoteUseCase {
  private readonly getSurveyIdRepo: GetSurveyByIdRepository;
  private readonly getUserIdRepo: GetUserByIdRepository;
  private readonly saveVoteRepo: SaveVoteRepository;
  private readonly idGenerator: IDGenerator;

  constructor(
    getSurveyIdRepo: GetSurveyByIdRepository,
    getUserIdRepo: GetUserByIdRepository,
    saveVoteRepo: SaveVoteRepository,
    idGenerator: IDGenerator
  ) {
    this.getSurveyIdRepo = getSurveyIdRepo;
    this.getUserIdRepo = getUserIdRepo;
    this.saveVoteRepo = saveVoteRepo;
    this.idGenerator = idGenerator;
  }

  async saveVote(
    userId: string,
    surveyId: string,
    musicId: string
  ): Promise<AddVoteUseCase.Result> {
    const surveyRepo = await this.getSurveyIdRepo.getById(
      surveyId,
      { includeMusics: true, includeVotes: true },
      true
    );

    // Validations
    // - Cannot vote into a non-existent survey
    if (!surveyRepo) {
      return left(new SurveyNotFoundError());
    }

    // - Cannot vote into a closed survey
    if (surveyRepo.closedAt) return left(new SurveyIsCloseError(surveyRepo));

    // - Cannot vote into music that does not belong in the survey
    const clientChosenMusic = surveyRepo.musics.find(m => m.id === musicId);
    if (!clientChosenMusic) return left(new MusicNotFoundError());

    // - Cannot vote more the one time
    const clientVoted = !!surveyRepo.pollVotes.find(
      p => p.client.id === userId
    );
    if (clientVoted) return left(new ClientAlreadyVotedError(surveyRepo));
    // Validations End

    const clientRepo = await this.getUserIdRepo.getById(userId);

    // Created the VoteEntity
    const vote = new VoteEntity();
    vote.id = this.idGenerator.generate();
    vote.client = clientRepo;
    vote.chosenMusic = clientChosenMusic;
    vote.survey = surveyRepo;

    // Save into database
    const savedVote = await this.saveVoteRepo.save(vote);

    delete savedVote.chosenMusic.establishment;
    delete savedVote.survey.establishment;
    delete savedVote.survey.musics;
    delete savedVote.client;

    return right(savedVote);
  }
}
