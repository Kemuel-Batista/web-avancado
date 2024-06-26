import { PaginationParams } from '@/core/repositories/paginations-params'
import { UsersRepository } from '@/domain/chat/application/repositories/users-repository'
import { User } from '@/domain/chat/enterprise/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string): Promise<User> {
    const user = this.items.find((item) => item.id.toString() === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findMany(
    { page }: PaginationParams,
    requestedBy: string,
  ): Promise<User[]> {
    const users = this.items
      .filter((item) => item.id.toString() !== requestedBy)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return users
  }

  async create(user: User): Promise<void> {
    this.items.push(user)
  }

  async save(user: User): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === user.id)

    this.items[itemIndex] = user
  }

  async delete(user: User): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === user.id)

    this.items.splice(itemIndex, 1)
  }
}
