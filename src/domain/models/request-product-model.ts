import { AccountEntity, ProductEntity } from '@/data/entities';

export type RequestProductModel = {
  id: string;
  product: ProductEntity;
  account: AccountEntity;
  amountOfProduct: number;
  total: number;
  obs: string;
  createdAt?: Date;
  updatedAt?: Date;
  closedAt?: Date;
};
