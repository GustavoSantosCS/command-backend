// eslint-disable-next-line no-shadow
export enum AccountType {
  Client = 1,
  Manager = 2,
  ClientManager = 3
}

export type UserModel = {
  id: string;
  nome: string;
  email: string;
  password: string;
  accountType: AccountType;
};
