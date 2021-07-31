import { VoteEntity } from '@/data/entities/vote-entity'
import {
  ClientAlreadyVotedError,
  MusicNotFoundError,
  SurveyIsCloseError,
  SurveyNotFoundError
} from '@/domain/errors'
import { Either } from '@/shared/either'

export interface AddVoteUseCase {
  saveVote: (
    userId: string,
    surveyId: string,
    musicId: string
  ) => Promise<AddVoteUseCase.Result>
}

// eslint-disable-next-line no-redeclare
export namespace AddVoteUseCase {
  export type Return = VoteEntity
  export type Result = Either<
  | SurveyNotFoundError
  | SurveyIsCloseError
  | MusicNotFoundError
  | ClientAlreadyVotedError,
  Return
  >
}
