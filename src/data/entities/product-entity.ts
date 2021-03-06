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
} from 'typeorm'
import { EstablishmentEntity } from './establishment-entity'
import { ProductImageEntity } from './product-image-entity'

@Entity('products')
export class ProductEntity {
  @PrimaryColumn()
  id?: string

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  isAvailable: boolean

  @Column('decimal', { precision: 5, scale: 2 })
  price: number

  @OneToOne(() => ProductImageEntity)
  @JoinColumn({ name: 'image' })
  image: ProductImageEntity

  @ManyToOne(() => EstablishmentEntity, establishment => establishment.products)
  @JoinColumn({ name: 'establishment_id' })
  establishment: EstablishmentEntity

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedAt: Date
}
