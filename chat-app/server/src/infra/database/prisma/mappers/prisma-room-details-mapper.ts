import {
  ChatMessage as PrismaChatMessage,
  Room as PrismaRoom,
  User as PrismaUser,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RoomDetails } from '@/domain/chat/enterprise/entities/value-objects/room-details'

type PrismaRoomDetails = PrismaRoom & {
  chatMessages: PrismaChatMessage[]
  participantOne: PrismaUser
  participantTwo: PrismaUser
}

export class PrismaRoomDetailsMapper {
  static toDomain(raw: PrismaRoomDetails): RoomDetails {
    return RoomDetails.create({
      id: new UniqueEntityID(raw.id),
      participantOneId: new UniqueEntityID(raw.participantOne.id),
      participantOneName: raw.participantOne.name,
      participantOnePhoto: raw.participantOne.photo,
      participantTwoId: new UniqueEntityID(raw.participantTwo.id),
      participantTwoName: raw.participantTwo.name,
      participantTwoPhoto: raw.participantTwo.photo,
      lastMessage: raw.chatMessages[0].message,
      lastMessageDate: raw.chatMessages[0].createdAt,
    })
  }
}
