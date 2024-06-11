import {
  ChatMessage as PrismaChatMessage,
  User as PrismaUser,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ChatMessageDetails } from '@/domain/chat/enterprise/entities/value-objects/chat-message-details'

type PrismaChatMessageDetails = PrismaChatMessage & {
  sender: PrismaUser
  recipient: PrismaUser
}

export class PrismaChatMessageDetailsMapper {
  static toDomain(raw: PrismaChatMessageDetails): ChatMessageDetails {
    return ChatMessageDetails.create({
      id: new UniqueEntityID(raw.id),
      recipientId: new UniqueEntityID(raw.senderId),
      recipientName: raw.sender.name,
      senderId: new UniqueEntityID(raw.recipientId),
      senderName: raw.recipient.name,
      message: raw.message,
      createdAt: raw.createdAt,
    })
  }
}
