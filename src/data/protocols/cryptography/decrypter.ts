import { PayloadModel } from '@/domain/models'

export interface Decrypter {
  decrypt: (ciphertext: string) => Promise<PayloadModel>
}
