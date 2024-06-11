import { Injectable } from '@nestjs/common'

import { ChatMessagesRepository } from '@/domain/chat/application/repositories/chat-messages-repository'
import { ChatMessage } from '@/domain/chat/enterprise/entities/chat-message'
import { ChatMessageDetails } from '@/domain/chat/enterprise/entities/value-objects/chat-message-details'

import { PrismaChatMessageDetailsMapper } from '../mappers/prisma-chat-message-details-mapper'
import { PrismaChatMessageMapper } from '../mappers/prisma-chat-message-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaChatMessagesRepository implements ChatMessagesRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByRoomId(roomId: string): Promise<ChatMessageDetails[]> {
    const chatMessages = await this.prisma.chatMessage.findMany({
      where: {
        roomId,
      },
      include: {
        sender: true,
        recipient: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return chatMessages.map(PrismaChatMessageDetailsMapper.toDomain)
  }

  async read(chatMessage: ChatMessage): Promise<void> {
    const data = PrismaChatMessageMapper.toPersistency(chatMessage)

    await this.prisma.chatMessage.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(chatMessage: ChatMessage): Promise<void> {
    const data = PrismaChatMessageMapper.toPersistency(chatMessage)

    await this.prisma.chatMessage.create({
      data,
    })
  }
}
