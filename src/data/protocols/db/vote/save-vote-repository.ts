import { VoteEntity } from '@/data/entities'

export interface SaveVoteRepository {
  save: (vote: VoteEntity) => Promise<VoteEntity>
}
