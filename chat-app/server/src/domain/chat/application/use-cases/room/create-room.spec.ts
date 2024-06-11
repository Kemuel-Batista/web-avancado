import { makeUser } from 'test/factories/make-user'
import { InMemoryChatMessagesRepository } from 'test/repositories/in-memory-chat-messages-repository'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { CreateRoomUseCase } from './create-room'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryChatMessagesRepository: InMemoryChatMessagesRepository
let inMemoryRoomsRepository: InMemoryRoomsRepository

let sut: CreateRoomUseCase

describe('Create room', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryChatMessagesRepository = new InMemoryChatMessagesRepository(
      inMemoryUsersRepository,
    )
    inMemoryRoomsRepository = new InMemoryRoomsRepository(
      inMemoryUsersRepository,
      inMemoryChatMessagesRepository,
    )

    sut = new CreateRoomUseCase(inMemoryRoomsRepository)
  })

  it('should be able to create a new room', async () => {
    const participantOne = makeUser()
    inMemoryUsersRepository.items.push(participantOne)
    const participantOneId = participantOne.id.toString()

    const participantTwo = makeUser()
    inMemoryUsersRepository.items.push(participantTwo)
    const participantTwoId = participantTwo.id.toString()

    const result = await sut.execute({
      participantOneId,
      participantTwoId,
    })

    expect(result.isSuccess()).toBe(true)

    expect(inMemoryRoomsRepository.items).toHaveLength(1)
    expect(inMemoryRoomsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          participantOneId: participantOne.id,
          participantTwoId: participantTwo.id,
        }),
      ]),
    )
  })
})
