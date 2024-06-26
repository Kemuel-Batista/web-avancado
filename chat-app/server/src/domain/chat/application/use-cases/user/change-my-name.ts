import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { UsersRepository } from '../../repositories/users-repository'

interface ChangeMyNameUseCaseRequest {
  userId: string
  newName: string
}

type ChangeMyNameUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class ChangeMyNameUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    newName,
  }: ChangeMyNameUseCaseRequest): Promise<ChangeMyNameUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return failure(new ResourceNotFoundError())
    }

    user.name = newName

    await this.usersRepository.save(user)

    return success(null)
  }
}
