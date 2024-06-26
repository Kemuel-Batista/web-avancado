import { compare, hash } from 'bcryptjs'

import { HashComparer } from '@/domain/chat/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/chat/application/cryptography/hash-generator'

export class BcryptHasher implements HashGenerator, HashComparer {
  async hash(payload: string): Promise<string> {
    return hash(payload, 8)
  }

  async compare(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed)
  }
}
