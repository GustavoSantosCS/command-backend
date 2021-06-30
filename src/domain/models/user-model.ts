import { AvatarModel } from '.';
import { EstablishmentModel } from './establishment-model';

export type UserModel = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: AvatarModel;
  establishments?: EstablishmentModel[];
  createdAt?: Date;
  updateAt?: Date;
};
