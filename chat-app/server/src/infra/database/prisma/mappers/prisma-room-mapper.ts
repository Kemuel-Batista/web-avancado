import { Prisma, Room as PrismaRoom } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Room } from '@/domain/chat/enterprise/entities/room'

export class PrismaRoomMapper {
  static toDomain(raw: PrismaRoom): Room {
    return Room.create(
      {
        participantOneId: new UniqueEntityID(raw.participantOneId),
        participantTwoId: new UniqueEntityID(raw.participantTwoId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(raw: Room): Prisma.RoomUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      participantOneId: raw.participantOneId.toString(),
      participantTwoId: raw.participantTwoId.toString(),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    }
  }
}
