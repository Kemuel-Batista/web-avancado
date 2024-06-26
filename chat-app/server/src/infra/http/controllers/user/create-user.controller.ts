import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceAlreadyExistsError } from '@/core/errors/errors/resource-already-exists-error'
import { CreateUserUseCase } from '@/domain/chat/application/use-cases/user/create-user'
import { Public } from '@/infra/auth/public'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createUserBodySchema = z.object({
  name: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
  photo: z.string(),
})

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@Controller('/users')
@Public()
export class CreateUserController {
  constructor(private registerUser: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserBodySchema))
  async handle(@Body() body: CreateUserBodySchema) {
    const { name, lastName, email, password, photo } = body

    const result = await this.registerUser.execute({
      name,
      lastName,
      email,
      password,
      photo,
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
