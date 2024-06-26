import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { FetchUsersUseCase } from '@/domain/chat/application/use-cases/user/fetch-users'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { logger } from '@/infra/config/winston-config'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { UserPresenter } from '../../presenters/user-presenter'

const queryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
})

type QueryParamsSchema = z.infer<typeof queryParamsSchema>

const queryValidationPipe = new ZodValidationPipe(queryParamsSchema)

@Controller('/users')
export class FetchUsersController {
  constructor(private fetchUsers: FetchUsersUseCase) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) params: QueryParamsSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    const { page } = params

    const result = await this.fetchUsers.execute({
      page,
      requestedBy: userId,
    })

    if (result.isError()) {
      const error = result.value
      logger.error(`Fetch Rooms by participant Id Error - ${error.message}`)

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const users = result.value.users

    return {
      users: users.map(UserPresenter.toHTTP),
    }
  }
}
