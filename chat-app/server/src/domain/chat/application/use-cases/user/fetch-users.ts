import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { User } from '@/domain/chat/enterprise/entities/user'

import { UsersRepository } from '../../repositories/users-repository'

interface FetchUsersUseCaseRequest {
  page: number
}

type FetchUsersUseCaseResponse = Either<
  NotAllowedError,
  {
    users: User[]
  }
>

@Injectable()
export class FetchUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
  }: FetchUsersUseCaseRequest): Promise<FetchUsersUseCaseResponse> {
    const users = await this.usersRepository.findMany({ page })

    return success({
      users,
    })
  }
}
