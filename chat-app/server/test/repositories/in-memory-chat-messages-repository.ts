import { ChatMessagesRepository } from '@/domain/chat/application/repositories/chat-messages-repository'
import { ChatMessage } from '@/domain/chat/enterprise/entities/chat-message'
import { ChatMessageDetails } from '@/domain/chat/enterprise/entities/value-objects/chat-message-details'

import { InMemoryUsersRepository } from './in-memory-users-repository'

export class InMemoryChatMessagesRepository implements ChatMessagesRepository {
  public items: ChatMessage[] = []

  constructor(private usersRepository: InMemoryUsersRepository) {}

  async findManyByRoomId(roomId: string): Promise<ChatMessageDetails[]> {
    const chatMessages = this.items
      .filter((item) => item.roomId.toString() === roomId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((chatMessage) => {
        const sender = this.usersRepository.items.find((item) => {
          return item.id.equals(chatMessage.senderId)
        })

        const recipient = this.usersRepository.items.find((item) => {
          return item.id.equals(chatMessage.recipientId)
        })

        return ChatMessageDetails.create({
          id: chatMessage.id,
          senderId: chatMessage.senderId,
          senderName: sender.name,
          recipientId: chatMessage.recipientId,
          recipientName: recipient.name,
          message: chatMessage.message,
          createdAt: chatMessage.createdAt,
          readAt: chatMessage.readAt,
        })
      })

    return chatMessages
  }

  async read(chatMessage: ChatMessage): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === chatMessage.id)

    this.items[itemIndex] = chatMessage
  }

  async create(chatMessage: ChatMessage): Promise<void> {
    this.items.push(chatMessage)
  }
}
