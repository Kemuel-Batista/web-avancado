import { makeChatMessage } from 'test/factories/make-chat-message'
import { makeRoom } from 'test/factories/make-room'
import { makeUser } from 'test/factories/make-user'
import { InMemoryChatMessagesRepository } from 'test/repositories/in-memory-chat-messages-repository'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { FetchMessagesByRoomIdUseCase } from './fetch-messages-by-room-id'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryChatMessagesRepository: InMemoryChatMessagesRepository
let inMemoryRoomsRepository: InMemoryRoomsRepository

let sut: FetchMessagesByRoomIdUseCase

describe('Fetch messages by room id', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryChatMessagesRepository = new InMemoryChatMessagesRepository(
      inMemoryUsersRepository,
    )
    inMemoryRoomsRepository = new InMemoryRoomsRepository(
      inMemoryUsersRepository,
      inMemoryChatMessagesRepository,
    )

    sut = new FetchMessagesByRoomIdUseCase(
      inMemoryUsersRepository,
      inMemoryRoomsRepository,
      inMemoryChatMessagesRepository,
    )
  })

  it('should be able to fetch messages by room id', async () => {
    const participantOne = makeUser()
    inMemoryUsersRepository.items.push(participantOne)
    const participantOneId = participantOne.id.toString()

    const participantTwo = makeUser()
    inMemoryUsersRepository.items.push(participantTwo)

    const room = makeRoom({
      participantOneId: participantOne.id,
      participantTwoId: participantTwo.id,
    })
    inMemoryRoomsRepository.items.push(room)

    const message01 = makeChatMessage({
      senderId: participantOne.id,
      recipientId: participantTwo.id,
      roomId: room.id,
      message: 'Hello',
    })

    const message02 = makeChatMessage({
      senderId: participantTwo.id,
      recipientId: participantOne.id,
      roomId: room.id,
      message: 'Hello again',
    })

    inMemoryChatMessagesRepository.items.push(message01, message02)

    const result = await sut.execute({
      requestBy: participantOneId,
      roomId: room.id.toString(),
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toMatchObject({
      chatMessagesDetails: expect.arrayContaining([
        expect.objectContaining({
          id: message01.id,
          senderId: participantOne.id,
          senderName: participantOne.name,
          recipientId: participantTwo.id,
          recipientName: participantTwo.name,
          message: 'Hello',
          createdAt: expect.any(Date),
          readAt: null,
        }),
        expect.objectContaining({
          id: message02.id,
          senderId: participantTwo.id,
          senderName: participantTwo.name,
          recipientId: participantOne.id,
          recipientName: participantOne.name,
          message: 'Hello again',
          createdAt: expect.any(Date),
          readAt: null,
        }),
      ]),
    })

    expect(inMemoryChatMessagesRepository.items).toHaveLength(2)
  })
})
