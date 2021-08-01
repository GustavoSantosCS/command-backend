import { PayloadModel } from '@/domain/models'

export interface Decrypter {
  decrypt: (cipherText: string) => Promise<PayloadModel>
}
