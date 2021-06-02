export class AddressAlreadyUseError extends Error {
  email: string;

  constructor(message: string, email: string) {
    super(message);
    this.email = email;
  }
}
