import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceAlreadyExistsError } from '@/core/errors/errors/resource-already-exists-error'
import { HashGenerator } from '@/domain/chat/application/cryptography/hash-generator'
import { UsersRepository } from '@/domain/chat/application/repositories/users-repository'
import { User } from '@/domain/chat/enterprise/entities/user'

interface CreateUserUseCaseRequest {
  name: string
  lastName: string
  email: string
  password: string
  photo: string
}

type CreateUserUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  {
    user: User
  }
>

@Injectable()
export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    lastName,
    email,
    password,
    photo,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      return failure(new ResourceAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      photo,
    })

    await this.usersRepository.create(user)

    return success({
      user,
    })
  }
}
