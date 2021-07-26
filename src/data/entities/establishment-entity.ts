import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { EstablishmentModel } from '@/domain/models';
import { EstablishmentImageEntity } from './establishment-image-entity';
import { UserEntity } from './user-entity';
import { ProductEntity } from './product-entity';
import { MusicEntity } from './music-entity';
import { PlaylistEntity } from './playlist-entity';
import { AccountEntity } from './account-entity';
import { SurveyEntity } from './survey-entity';

@Entity('establishments')
export class EstablishmentEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  description: string;

  @Column()
  isOpen: boolean;

  @ManyToOne(() => UserEntity, user => user.establishments)
  @JoinColumn({ name: 'manager' })
  manager: UserEntity;

  @OneToMany(() => ProductEntity, product => product.establishment)
  products: ProductEntity[];

  @OneToMany(() => PlaylistEntity, playlist => playlist.establishment)
  playlists: PlaylistEntity[];

  @OneToMany(() => AccountEntity, account => account.establishment)
  accounts: AccountEntity[];

  @OneToMany(() => SurveyEntity, survey => survey.establishment)
  surveys: SurveyEntity[];

  @OneToOne(() => EstablishmentImageEntity)
  @JoinColumn({ name: 'image' })
  image: EstablishmentImageEntity;

  @OneToMany(() => MusicEntity, music => music.establishment)
  musics: MusicEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  constructor(establishment: EstablishmentModel) {
    Object.assign(this, establishment);
  }
}
