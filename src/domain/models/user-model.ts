import { AvatarEntity } from '@/data/entities';
import { EstablishmentModel } from './establishment-model';

export type UserModel = {
  id?: string;
  name: string;
  email: string;
  password: string;
  avatar?: AvatarEntity;
  establishments?: EstablishmentModel[];
  createdAt?: Date;
  updatedAt?: Date;
};
