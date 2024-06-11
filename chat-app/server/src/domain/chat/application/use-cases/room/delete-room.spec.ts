import { makeRoom } from 'test/factories/make-room'
import { makeUser } from 'test/factories/make-user'
import { InMemoryChatMessagesRepository } from 'test/repositories/in-memory-chat-messages-repository'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { DeleteRoomUseCase } from './delete-room'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryChatMessagesRepository: InMemoryChatMessagesRepository
let inMemoryRoomsRepository: InMemoryRoomsRepository

let sut: DeleteRoomUseCase

describe('Delete room', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryChatMessagesRepository = new InMemoryChatMessagesRepository(
      inMemoryUsersRepository,
    )
    inMemoryRoomsRepository = new InMemoryRoomsRepository(
      inMemoryUsersRepository,
      inMemoryChatMessagesRepository,
    )

    sut = new DeleteRoomUseCase(
      inMemoryRoomsRepository,
      inMemoryUsersRepository,
    )
  })

  it('should be able to delete a room', async () => {
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

    const result = await sut.execute({
      requestBy: participantOneId,
      roomId: room.id.toString(),
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryRoomsRepository.items).toHaveLength(0)
  })
})
