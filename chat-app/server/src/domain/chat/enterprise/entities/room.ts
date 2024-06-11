import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface RoomProps {
  participantOneId: UniqueEntityID
  participantTwoId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export class Room extends AggregateRoot<RoomProps> {
  get participantOneId() {
    return this.props.participantOneId
  }

  set participantOneId(participantOneId: UniqueEntityID) {
    this.props.participantOneId = participantOneId

    this.touch()
  }

  get participantTwoId() {
    return this.props.participantTwoId
  }

  set participantTwoId(participantTwoId: UniqueEntityID) {
    this.props.participantTwoId = participantTwoId

    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get deletedAt() {
    return this.props.deletedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<RoomProps, 'createdAt' | 'updatedAt' | 'deletedAt'>,
    id?: UniqueEntityID,
  ) {
    const room = new Room(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
        deletedAt: props.deletedAt ?? null,
      },
      id,
    )

    return room
  }
}
