import { AvatarModel } from './avatar-model';

export type UserModel = {
  id: string;
  nome: string;
  email: string;
  password: string;
  avatar?: AvatarModel;
};
