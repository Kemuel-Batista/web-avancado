import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { FetchUsersUseCase } from './fetch-users'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: FetchUsersUseCase

describe('Fetch Users Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new FetchUsersUseCase(inMemoryUsersRepository)
  })

  it('should be able to fetch users', async () => {
    const user = makeUser()
    const user02 = makeUser()
    const user03 = makeUser()
    inMemoryUsersRepository.items.push(user, user02, user03)

    const result = await sut.execute({
      page: 1,
      requestedBy: user.id.toString(),
    })

    if (result.isSuccess()) {
      expect(result.value.users).toHaveLength(3)
    }
  })

  it('should be able to fetch paginated users', async () => {
    const user = makeUser()
    inMemoryUsersRepository.items.push(user)

    for (let i = 1; i <= 22; i++) {
      const user = makeUser()
      inMemoryUsersRepository.items.push(user)
    }

    const result = await sut.execute({
      page: 2,
      requestedBy: user.id.toString(),
    })

    if (result.isSuccess()) {
      expect(result.value.users).toHaveLength(2)
    }
  })
})
