import { Module } from '@nestjs/common'

import { Encrypter } from '@/domain/chat/application/cryptography/encrypter'
import { HashComparer } from '@/domain/chat/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/chat/application/cryptography/hash-generator'

import { BcryptHasher } from './brcrypt-hasher'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  providers: [
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: Encrypter, useClass: JwtEncrypter },
  ],
  exports: [HashComparer, HashGenerator, Encrypter],
})
export class CryptographyModule {}
