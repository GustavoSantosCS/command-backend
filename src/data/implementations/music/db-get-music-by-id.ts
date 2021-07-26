import { MusicEntity } from '@/data/entities';
import { GetMusicByIdRepository } from '@/data/protocols';
import { MusicNotFoundError } from '@/domain/errors';
import { GetMusicByIdUseCase } from '@/domain/usecases';
import { Either, left, right } from '@/shared/either';

export class DBGetMusicById implements GetMusicByIdUseCase {
  private readonly getMusicByIdRepo: GetMusicByIdRepository;

  constructor(getMusicByIdRepo: GetMusicByIdRepository) {
    this.getMusicByIdRepo = getMusicByIdRepo;
  }

  async getMusicById(
    musicId: string
  ): Promise<Either<MusicNotFoundError, MusicEntity>> {
    const music = await this.getMusicByIdRepo.getById(musicId);
    return music ? right(music) : left(new MusicNotFoundError());
  }
}
