import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface ChatMessageProps {
  senderId: UniqueEntityID
  recipientId: UniqueEntityID
  roomId: UniqueEntityID
  message: string
  createdAt: Date
  readAt?: Date | null
}

export class ChatMessage extends AggregateRoot<ChatMessageProps> {
  get senderId() {
    return this.props.senderId
  }

  set senderId(senderId: UniqueEntityID) {
    this.props.senderId = senderId
  }

  get recipientId() {
    return this.props.recipientId
  }

  set recipientId(recipientId: UniqueEntityID) {
    this.props.recipientId = recipientId
  }

  get roomId() {
    return this.props.roomId
  }

  set roomId(roomId: UniqueEntityID) {
    this.props.roomId = roomId
  }

  get message() {
    return this.props.message
  }

  set message(message: string) {
    this.props.message = message
  }

  get createdAt() {
    return this.props.createdAt
  }

  get readAt() {
    return this.props.readAt
  }

  set readAt(readAt: Date) {
    this.props.readAt = readAt
  }

  static create(
    props: Optional<ChatMessageProps, 'createdAt' | 'readAt'>,
    id?: UniqueEntityID,
  ) {
    const chatMessage = new ChatMessage(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        readAt: props.readAt ?? null,
      },
      id,
    )

    return chatMessage
  }
}
