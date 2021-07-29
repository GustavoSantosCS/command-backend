import { VoteEntity } from '@/data/entities';
import { SaveVoteRepository } from '@/data/protocols';
import { TypeORMHelpers } from './typeorm-helper';

export class VoteTypeOrmRepository implements SaveVoteRepository {
  async saveVote(vote: VoteEntity): Promise<VoteEntity> {
    const voteRepo = await TypeORMHelpers.getRepository(VoteEntity);
    const result = await voteRepo.save(vote);
    return result;
  }
}
