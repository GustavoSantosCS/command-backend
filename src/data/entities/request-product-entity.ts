import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import { AccountEntity } from './account-entity';
import { ProductEntity } from './product-entity';

@Entity('requests_product')
export class RequestProductEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: 'account_id' })
  account?: AccountEntity;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({ name: 'amount_of_product' })
  amountOfProduct: number;

  @Column()
  total: number;

  @Column()
  obs: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'closed_at' })
  closedAt: Date;
}
