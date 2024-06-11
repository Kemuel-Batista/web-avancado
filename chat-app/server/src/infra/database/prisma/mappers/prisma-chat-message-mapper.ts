import { ChatMessage as PrismaChatMessage, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ChatMessage } from '@/domain/chat/enterprise/entities/chat-message'

export class PrismaChatMessageMapper {
  static toDomain(raw: PrismaChatMessage): ChatMessage {
    return ChatMessage.create(
      {
        roomId: new UniqueEntityID(raw.roomId),
        recipientId: new UniqueEntityID(raw.recipientId),
        senderId: new UniqueEntityID(raw.senderId),
        message: raw.message,
        createdAt: raw.createdAt,
        readAt: raw.readAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(
    raw: ChatMessage,
  ): Prisma.ChatMessageUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      roomId: raw.roomId.toString(),
      senderId: raw.senderId.toString(),
      recipientId: raw.recipientId.toString(),
      message: raw.message,
      createdAt: raw.createdAt,
      readAt: raw.readAt,
    }
  }
}
