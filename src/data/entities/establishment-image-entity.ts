import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('establishment_image')
export class EstablishmentImageEntity {
  @PrimaryColumn()
  persistentName: string;

  @Column()
  originalName: string;

  @Column()
  target: string;
}
