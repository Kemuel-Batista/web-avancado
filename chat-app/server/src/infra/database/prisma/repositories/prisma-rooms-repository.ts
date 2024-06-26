import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/paginations-params'
import { RoomsRepository } from '@/domain/chat/application/repositories/rooms-repository'
import { Room } from '@/domain/chat/enterprise/entities/room'
import { RoomDetails } from '@/domain/chat/enterprise/entities/value-objects/room-details'

import { PrismaRoomDetailsMapper } from '../mappers/prisma-room-details-mapper'
import { PrismaRoomMapper } from '../mappers/prisma-room-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaRoomsRepository implements RoomsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Room> {
    const room = await this.prisma.room.findUnique({
      where: {
        id,
      },
    })

    if (!room) {
      return null
    }

    return PrismaRoomMapper.toDomain(room)
  }

  async findDetailsById(id: string): Promise<RoomDetails> {
    const room = await this.prisma.room.findUnique({
      where: {
        id,
      },
      include: {
        chatMessages: true,
        participantOne: true,
        participantTwo: true,
      },
    })

    if (!room) {
      return null
    }

    return PrismaRoomDetailsMapper.toDomain(room)
  }

  async findByParticipantOneAndParticipantTwo(
    senderId: string,
    recipientId: string,
  ): Promise<Room> {
    const room = await this.prisma.room.findFirst({
      where: {
        participantOneId: senderId,
        participantTwoId: recipientId,
      },
    })

    if (!room) {
      return null
    }

    return PrismaRoomMapper.toDomain(room)
  }

  async findManyByParticipantId(
    participantId: string,
    { page }: PaginationParams,
  ): Promise<RoomDetails[]> {
    const rooms = await this.prisma.room.findMany({
      where: {
        OR: [
          { participantOneId: participantId },
          { participantTwoId: participantId },
        ],
      },
      take: 20,
      skip: (page - 1) * 20,
      orderBy: { createdAt: 'desc' },
      include: {
        participantOne: true,
        participantTwo: true,
        chatMessages: true,
      },
    })

    console.log(rooms)

    return rooms.map(PrismaRoomDetailsMapper.toDomain)
  }

  async save(room: Room): Promise<void> {
    const data = PrismaRoomMapper.toPersistency(room)

    await this.prisma.room.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(room: Room): Promise<void> {
    const data = PrismaRoomMapper.toPersistency(room)

    await this.prisma.room.create({
      data,
    })
  }

  async delete(room: Room): Promise<void> {
    const data = PrismaRoomMapper.toPersistency(room)

    await this.prisma.room.delete({
      where: {
        id: data.id,
      },
    })
  }
}
