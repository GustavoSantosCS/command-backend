import { UserModel, EstablishmentImageModel } from '.';

// eslint-disable-next-line no-shadow
export enum CATEGORY {
  PUB = 'Pub',
  RESTAURANT = 'Restaurante',
  BALLAD = 'Balada',
  PIZZERIA = 'Pizzaria'
}

export type EstablishmentModel = {
  id?: string;
  name: string;
  category: CATEGORY;
  description: string;
  isOpen: boolean;
  image?: EstablishmentImageModel;
  manager?: UserModel;
  createdAt?: Date;
  updatedAt?: Date;
};
