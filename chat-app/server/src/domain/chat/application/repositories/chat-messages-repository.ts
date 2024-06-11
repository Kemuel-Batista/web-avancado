import { ChatMessage } from '../../enterprise/entities/chat-message'
import { ChatMessageDetails } from '../../enterprise/entities/value-objects/chat-message-details'

export abstract class ChatMessagesRepository {
  abstract findManyByRoomId(roomId: string): Promise<ChatMessageDetails[]>
  abstract read(chatMessage: ChatMessage): Promise<void>
  abstract create(chatMessage: ChatMessage): Promise<void>
}
