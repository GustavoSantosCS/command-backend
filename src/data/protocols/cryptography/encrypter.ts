export interface Encrypter {
  encrypt(payloadBody: any): Promise<string>;
}
