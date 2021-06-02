export class AddressAlreadyUseError extends Error {
  email: string;

  constructor(email: string) {
    super('Email já está em uso!');
    this.email = email;
  }
}
