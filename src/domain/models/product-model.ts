import { EstablishmentModel } from './establishment-model';
import { ImagePersistenceData } from './image-model';

export type ProductModel = {
  id?: string;
  name: string;
  description: string;
  isAvailable: boolean;
  price: number;
  image: ImagePersistenceData;
  establishment: EstablishmentModel;
  createdAt?: Date;
  updatedAt?: Date;
};
