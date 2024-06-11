import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface RoomDetailsProps {
  id: UniqueEntityID
  participantOneId: UniqueEntityID
  participantOneName: string
  participantOnePhoto: string
  participantTwoId: UniqueEntityID
  participantTwoName: string
  participantTwoPhoto: string
  lastMessage: string
  lastMessageDate: Date
}

export class RoomDetails extends ValueObject<RoomDetailsProps> {
  get id() {
    return this.props.id
  }

  get participantOneId() {
    return this.props.participantOneId
  }

  get participantOneName() {
    return this.props.participantOneName
  }

  get participantOnePhoto() {
    return this.props.participantOnePhoto
  }

  get participantTwoId() {
    return this.props.participantTwoId
  }

  get participantTwoName() {
    return this.props.participantTwoName
  }

  get participantTwoPhoto() {
    return this.props.participantTwoPhoto
  }

  get lastMessage() {
    return this.props.lastMessage
  }

  get lastMessageDate() {
    return this.props.lastMessageDate
  }

  static create(props: RoomDetailsProps) {
    return new RoomDetails(props)
  }
}
