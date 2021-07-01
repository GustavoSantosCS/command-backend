import { ProductModel } from '@/domain/models';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import { EstablishmentEntity } from './establishment-entity';
import { ProductImageEntity } from './product-image-entity';

@Entity('products')
export class ProductEntity {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  isAvailable: boolean;

  @Column('decimal', { precision: 5, scale: 2 })
  price: number;

  @OneToOne(() => ProductImageEntity)
  @JoinColumn()
  image: ProductImageEntity;

  @ManyToOne(() => EstablishmentEntity, establishment => establishment.products)
  @JoinColumn()
  establishment: EstablishmentEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  constructor(product: ProductModel) {
    Object.assign(this, product);
  }
}
