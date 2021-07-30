import { EstablishmentEntity } from '@/data/entities';
import { ImagePersistenceData } from './image-model';

export type ProductModel = {
  id?: string;
  name: string;
  description: string;
  isAvailable: boolean;
  price: number;
  image: ImagePersistenceData;
  establishment: EstablishmentEntity;
  createdAt?: Date;
  updatedAt?: Date;
};
