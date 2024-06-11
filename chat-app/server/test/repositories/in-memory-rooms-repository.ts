import { PaginationParams } from '@/core/repositories/paginations-params'
import { RoomsRepository } from '@/domain/chat/application/repositories/rooms-repository'
import { Room } from '@/domain/chat/enterprise/entities/room'
import { RoomDetails } from '@/domain/chat/enterprise/entities/value-objects/room-details'

import { InMemoryChatMessagesRepository } from './in-memory-chat-messages-repository'
import { InMemoryUsersRepository } from './in-memory-users-repository'

export class InMemoryRoomsRepository implements RoomsRepository {
  public items: Room[] = []

  constructor(
    private usersRepository: InMemoryUsersRepository,
    private chatMessagesRepository: InMemoryChatMessagesRepository,
  ) {}

  async findById(id: string): Promise<Room> {
    const room = this.items.find((item) => item.id.toString() === id)

    if (!room) {
      return null
    }

    return room
  }

  async findDetailsById(id: string): Promise<RoomDetails> {
    const room = this.items.find((item) => item.id.toString() === id)

    if (!room) {
      return null
    }

    const participantOne = this.usersRepository.items.find((item) => {
      return item.id.equals(room.participantOneId)
    })

    const participantTwo = this.usersRepository.items.find((item) => {
      return item.id.equals(room.participantTwoId)
    })

    // Get last message sent to recipient (otherParticipant)
    const chatMessagesOfRoom = this.chatMessagesRepository.items.filter(
      (item) => {
        return item.id.equals(room.id)
      },
    )

    const lastMessage =
      chatMessagesOfRoom.length > 0 ? chatMessagesOfRoom[0].message : ''
    const lastMessageDate =
      chatMessagesOfRoom.length > 0 ? chatMessagesOfRoom[0].createdAt : null

    return RoomDetails.create({
      id: room.id,
      participantOneId: participantOne.id,
      participantOneName: participantOne.name,
      participantOnePhoto: participantOne.photo,
      participantTwoId: participantTwo.id,
      participantTwoName: participantTwo.name,
      participantTwoPhoto: participantTwo.photo,
      lastMessage,
      lastMessageDate,
    })
  }

  async findByParticipantOneAndParticipantTwo(
    participantOneId: string,
    participantTwoId: string,
  ): Promise<Room> {
    // Any room with participant one and participant two
    const room = this.items.find(
      (item) =>
        (item.participantOneId.toString() === participantOneId ||
          item.participantOneId.toString() === participantTwoId) &&
        (item.participantTwoId.toString() === participantOneId ||
          item.participantTwoId.toString() === participantTwoId),
    )

    if (!room) {
      return null
    }

    return room
  }

  async findManyByParticipantId(
    participantId: string,
    { page }: PaginationParams,
  ): Promise<RoomDetails[]> {
    const rooms = this.items
      .filter(
        (item) =>
          item.participantOneId.toString() === participantId ||
          item.participantTwoId.toString() === participantId,
      )
      .slice((page - 1) * 20, page * 20)
      .map((room) => {
        const participantOne = this.usersRepository.items.find((item) => {
          return item.id.equals(room.participantOneId)
        })

        const participantTwo = this.usersRepository.items.find((item) => {
          return item.id.equals(room.participantTwoId)
        })

        // Get last message sent to recipient (otherParticipant)
        const chatMessagesOfRoom = this.chatMessagesRepository.items.filter(
          (item) => {
            return item.roomId.toString() === room.id.toString()
          },
        )

        const lastMessage =
          chatMessagesOfRoom.length > 0 ? chatMessagesOfRoom[0].message : ''
        const lastMessageDate =
          chatMessagesOfRoom.length > 0 ? chatMessagesOfRoom[0].createdAt : null

        return RoomDetails.create({
          id: room.id,
          participantOneId: room.participantOneId,
          participantOneName: participantOne.name,
          participantOnePhoto: participantOne.photo,
          participantTwoId: room.participantTwoId,
          participantTwoName: participantTwo.name,
          participantTwoPhoto: participantTwo.photo,
          lastMessage,
          lastMessageDate,
        })
      })

    return rooms
  }

  async save(room: Room): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === room.id)

    this.items[itemIndex] = room
  }

  async create(room: Room): Promise<void> {
    this.items.push(room)
  }

  async delete(room: Room): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === room.id)

    this.items.splice(itemIndex, 1)
  }
}
