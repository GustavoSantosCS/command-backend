import { AvatarModel } from '.';

export type UserModel = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: AvatarModel;
  createdAt?: Date;
  updateAt?: Date;
};
