import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface ChatMessageDetailsProps {
  id: UniqueEntityID
  senderId: UniqueEntityID
  senderName: string
  recipientId: UniqueEntityID
  recipientName: string
  message: string
  createdAt: Date
  readAt?: Date | null
}

export class ChatMessageDetails extends ValueObject<ChatMessageDetailsProps> {
  get id() {
    return this.props.id
  }

  get senderId() {
    return this.props.senderId
  }

  get senderName() {
    return this.props.senderName
  }

  get recipientId() {
    return this.props.recipientId
  }

  get recipientName() {
    return this.props.recipientName
  }

  get message() {
    return this.props.message
  }

  get createdAt() {
    return this.props.createdAt
  }

  get readAt() {
    return this.props.readAt
  }

  static create(props: ChatMessageDetailsProps) {
    return new ChatMessageDetails(props)
  }
}
