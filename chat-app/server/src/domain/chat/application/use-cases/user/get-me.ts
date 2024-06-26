import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { User } from '@/domain/chat/enterprise/entities/user'

import { UsersRepository } from '../../repositories/users-repository'

interface GetMeUseCaseRequest {
  userId: string
}

type GetMeUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

@Injectable()
export class GetMeUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetMeUseCaseRequest): Promise<GetMeUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return failure(new ResourceNotFoundError())
    }

    delete user.password

    return success({
      user,
    })
  }
}
