import { User } from '@/domain/chat/enterprise/entities/user'

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      photo: user.photo,
      createdAt: user.createdAt,
    }
  }
}
