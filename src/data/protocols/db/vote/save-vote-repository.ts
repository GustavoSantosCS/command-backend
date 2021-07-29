import { VoteEntity } from '@/data/entities';

export interface SaveVoteRepository {
  saveVote(vote: VoteEntity): Promise<VoteEntity>;
}
