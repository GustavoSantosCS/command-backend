import { Entity, Column, PrimaryColumn } from 'typeorm';
import { EstablishmentImageModel } from '@/domain/models';

@Entity('establishment_image')
export class EstablishmentImageEntity {
  @PrimaryColumn()
  persistentName: string;

  @Column()
  originalName: string;

  @Column()
  target: string;

  constructor(establishmentImage: EstablishmentImageModel) {
    Object.assign(this, establishmentImage);
  }
}
