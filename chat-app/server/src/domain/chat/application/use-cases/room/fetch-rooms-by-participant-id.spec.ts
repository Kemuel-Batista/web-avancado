import { makeChatMessage } from 'test/factories/make-chat-message'
import { makeRoom } from 'test/factories/make-room'
import { makeUser } from 'test/factories/make-user'
import { InMemoryChatMessagesRepository } from 'test/repositories/in-memory-chat-messages-repository'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { FetchRoomsByParticipantIdUseCase } from './fetch-rooms-by-participant-id'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryChatMessagesRepository: InMemoryChatMessagesRepository
let inMemoryRoomsRepository: InMemoryRoomsRepository

let sut: FetchRoomsByParticipantIdUseCase

describe('Fetch rooms by participant id', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryChatMessagesRepository = new InMemoryChatMessagesRepository(
      inMemoryUsersRepository,
    )
    inMemoryRoomsRepository = new InMemoryRoomsRepository(
      inMemoryUsersRepository,
      inMemoryChatMessagesRepository,
    )

    sut = new FetchRoomsByParticipantIdUseCase(
      inMemoryRoomsRepository,
      inMemoryUsersRepository,
    )
  })

  it('should be able to fetch rooms by participant id', async () => {
    const participantOne = makeUser()
    inMemoryUsersRepository.items.push(participantOne)

    const participantTwo = makeUser()
    inMemoryUsersRepository.items.push(participantTwo)

    const room = makeRoom({
      participantOneId: participantOne.id,
      participantTwoId: participantTwo.id,
    })
    inMemoryRoomsRepository.items.push(room)

    const chatMessage = makeChatMessage({
      roomId: room.id,
      message: 'Hello',
      senderId: participantOne.id,
      recipientId: participantTwo.id,
    })
    inMemoryChatMessagesRepository.items.push(chatMessage)

    const result = await sut.execute({
      participantId: participantOne.id.toString(),
      params: { page: 1 },
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toMatchObject({
      roomsDetails: expect.arrayContaining([
        expect.objectContaining({
          id: room.id,
          participantOneId: participantOne.id,
          participantOneName: participantOne.name,
          participantOnePhoto: participantOne.photo,
          participantTwoId: participantTwo.id,
          participantTwoName: participantTwo.name,
          participantTwoPhoto: participantTwo.photo,
          lastMessage: chatMessage.message,
          lastMessageDate: expect.any(Date),
        }),
      ]),
    })
  })

  it('should be able to fetch paginated rooms by participant id', async () => {
    const participantOne = makeUser()
    inMemoryUsersRepository.items.push(participantOne)

    for (let i = 1; i <= 22; i++) {
      const participantTwo = makeUser()
      inMemoryUsersRepository.items.push(participantTwo)

      const room = makeRoom({
        participantOneId: participantOne.id,
        participantTwoId: participantTwo.id,
      })
      inMemoryRoomsRepository.items.push(room)

      const chatMessage = makeChatMessage({
        roomId: room.id,
        message: 'Hello',
        senderId: participantOne.id,
        recipientId: participantTwo.id,
      })
      inMemoryChatMessagesRepository.items.push(chatMessage)
    }

    const result = await sut.execute({
      participantId: participantOne.id.toString(),
      params: { page: 2 },
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toMatchObject({
      roomsDetails: expect.any(Array),
    })
  })
})
