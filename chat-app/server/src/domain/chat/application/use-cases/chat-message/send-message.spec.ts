import { makeRoom } from 'test/factories/make-room'
import { makeUser } from 'test/factories/make-user'
import { InMemoryChatMessagesRepository } from 'test/repositories/in-memory-chat-messages-repository'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

import { SendMessageUseCase } from './send-message'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryChatMessagesRepository: InMemoryChatMessagesRepository
let inMemoryRoomsRepository: InMemoryRoomsRepository

let sut: SendMessageUseCase

describe('Send message', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryChatMessagesRepository = new InMemoryChatMessagesRepository(
      inMemoryUsersRepository,
    )
    inMemoryRoomsRepository = new InMemoryRoomsRepository(
      inMemoryUsersRepository,
      inMemoryChatMessagesRepository,
    )

    sut = new SendMessageUseCase(
      inMemoryUsersRepository,
      inMemoryRoomsRepository,
      inMemoryChatMessagesRepository,
    )
  })

  it('should be able to send a new messsage to room', async () => {
    const participantOne = makeUser()
    inMemoryUsersRepository.items.push(participantOne)
    const participantOneId = participantOne.id.toString()

    const participantTwo = makeUser()
    inMemoryUsersRepository.items.push(participantTwo)
    const participantTwoId = participantTwo.id.toString()

    const room = makeRoom({
      participantOneId: participantOne.id,
      participantTwoId: participantTwo.id,
    })
    inMemoryRoomsRepository.items.push(room)

    const result = await sut.execute({
      senderId: participantOneId,
      recipientId: participantTwoId,
      roomId: room.id.toString(),
      message: 'Hello',
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryChatMessagesRepository.items).toHaveLength(1)
    expect(inMemoryChatMessagesRepository.items[0].message).toBe('Hello')
  })

  it('should not be able to send a new message if recipient or sender not belongs to the room', async () => {
    const participantOne = makeUser()
    inMemoryUsersRepository.items.push(participantOne)
    const participantOneId = participantOne.id.toString()

    const participantTwo = makeUser()
    inMemoryUsersRepository.items.push(participantTwo)
    const participantTwoId = participantTwo.id.toString()

    const room = makeRoom({
      participantOneId: participantOne.id,
      participantTwoId: new UniqueEntityID(),
    })
    inMemoryRoomsRepository.items.push(room)

    const result = await sut.execute({
      senderId: participantOneId,
      recipientId: participantTwoId,
      roomId: room.id.toString(),
      message: 'Hello',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
