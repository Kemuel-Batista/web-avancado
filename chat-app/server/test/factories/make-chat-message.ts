import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ChatMessage,
  ChatMessageProps,
} from '@/domain/chat/enterprise/entities/chat-message'
import { PrismaChatMessageMapper } from '@/infra/database/prisma/mappers/prisma-chat-message-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeChatMessage(
  override: Partial<ChatMessageProps> = {},
  id?: UniqueEntityID,
) {
  const chatMessage = ChatMessage.create(
    {
      senderId: new UniqueEntityID(),
      recipientId: new UniqueEntityID(),
      roomId: new UniqueEntityID(),
      message: faker.lorem.sentence(),
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return chatMessage
}

@Injectable()
export class ChatMessageFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaChatMessage(
    data: Partial<ChatMessageProps> = {},
  ): Promise<ChatMessage> {
    const chatMessage = makeChatMessage(data)

    await this.prisma.chatMessage.create({
      data: PrismaChatMessageMapper.toPersistency(chatMessage),
    })

    return chatMessage
  }
}
