import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CreateRoomUseCase } from '@/domain/chat/application/use-cases/room/create-room'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { logger } from '@/infra/config/winston-config'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { RoomPresenter } from '../../presenters/room-presenter'

const createRoomBodySchema = z.object({
  participantTwoId: z.string().uuid(),
})

type CreateRoomBodySchema = z.infer<typeof createRoomBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createRoomBodySchema)

@Controller('/rooms')
export class CreateRoomController {
  constructor(private createRoom: CreateRoomUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handle(
    @Body(bodyValidationPipe) body: CreateRoomBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    const { participantTwoId } = body

    const result = await this.createRoom.execute({
      participantOneId: userId,
      participantTwoId,
    })

    if (result.isError()) {
      const error = result.value
      logger.error(`Create Room Error - ${error.message}`)

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const room = result.value.room

    return {
      room: RoomPresenter.toHTTP(room),
    }
  }
}
