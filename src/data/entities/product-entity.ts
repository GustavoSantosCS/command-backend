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

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;

  @DeleteDateColumn({ name: 'delete_at' })
  deleteAt: Date;

  constructor(product: ProductModel) {
    Object.assign(this, product);
  }
}
