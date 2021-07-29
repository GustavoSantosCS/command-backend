import { AccountEntity } from '@/data/entities';
import { ProductModel } from './product-model';

export type RequestProductModel = {
  id: string;
  product: ProductModel;
  account: AccountEntity;
  amountOfProduct: number;
  total: number;
  obs: string;
  createdAt?: Date;
  updatedAt?: Date;
  closedAt?: Date;
};
