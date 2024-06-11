import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Room, RoomProps } from '@/domain/chat/enterprise/entities/room'
import { PrismaRoomMapper } from '@/infra/database/prisma/mappers/prisma-room-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeRoom(
  override: Partial<RoomProps> = {},
  id?: UniqueEntityID,
) {
  const room = Room.create(
    {
      participantOneId: new UniqueEntityID(),
      participantTwoId: new UniqueEntityID(),
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return room
}

@Injectable()
export class RoomFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRoom(data: Partial<RoomProps> = {}): Promise<Room> {
    const room = makeRoom(data)

    await this.prisma.room.create({
      data: PrismaRoomMapper.toPersistency(room),
    })

    return room
  }
}
