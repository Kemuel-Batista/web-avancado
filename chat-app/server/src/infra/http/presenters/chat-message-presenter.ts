import { ChatMessage } from '@/domain/chat/enterprise/entities/chat-message'

export class ChatMessagePresenter {
  static toHTTP(raw: ChatMessage) {
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
