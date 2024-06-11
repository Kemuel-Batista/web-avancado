import { ChatMessageDetails } from '@/domain/chat/enterprise/entities/value-objects/chat-message-details'

export class ChatMessageDetailsPresenter {
  static toHTTP(raw: ChatMessageDetails) {
    return {
      id: raw.id.toString(),
      senderId: raw.senderId.toString(),
      senderName: raw.senderName,
      recipientId: raw.recipientId.toString(),
      recipientName: raw.recipientName,
      message: raw.message,
      createdAt: raw.createdAt,
      readAt: raw.readAt,
    }
  }
}
