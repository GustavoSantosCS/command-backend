import { ImagePersistenceData } from '@/domain/models';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('product_image')
export class ProductImageEntity {
  @PrimaryColumn()
  persistentName: string;

  @Column()
  originalName: string;

  @Column()
  target: string;

  constructor(image: ImagePersistenceData) {
    Object.assign(this, image);
  }
}
