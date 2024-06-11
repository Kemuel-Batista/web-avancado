import { Prisma, User as PrismaUser } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/chat/enterprise/entities/user'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        lastName: raw.lastName,
        email: raw.email,
        password: raw.password,
        photo: raw.photo,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(raw: User): Prisma.UserUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      name: raw.name,
      lastName: raw.lastName,
      email: raw.email,
      password: raw.password,
      photo: raw.photo,
      createdAt: raw.createdAt,
    }
  }
}
