import { AvatarEntity, EstablishmentEntity } from '@/data/entities';

export type UserModel = {
  id?: string;
  name: string;
  email: string;
  password: string;
  avatar?: AvatarEntity;
  establishments?: EstablishmentEntity[];
  createdAt?: Date;
  updatedAt?: Date;
};
