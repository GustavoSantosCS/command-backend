import { ProductModel } from './product-model';

export type RequestProductModel = {
  id: string;
  product: ProductModel;
  amountOfProduct: number;
  total: number;
  obs: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date;
};