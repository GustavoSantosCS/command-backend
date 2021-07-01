import { MusicEntity } from '@/data/entities';

export interface GetAllEstablishmentMusicsRepository {
  getAllEstablishmentMusics(idEstablishment: string): Promise<MusicEntity[]>;
}
