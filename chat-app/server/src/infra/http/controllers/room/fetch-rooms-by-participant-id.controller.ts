import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { FetchRoomsByParticipantIdUseCase } from '@/domain/chat/application/use-cases/room/fetch-rooms-by-participant-id'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { logger } from '@/infra/config/winston-config'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { RoomDetailsPresenter } from '../../presenters/room-details-presenter'

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

@Controller('/rooms/participant')
export class FetchRoomsByParticipantIdController {
  constructor(
    private fetchRoomsByParticipantId: FetchRoomsByParticipantIdUseCase,
  ) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) params: QueryParamsSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    const { page } = params

    const result = await this.fetchRoomsByParticipantId.execute({
      params: { page },
      participantId: userId,
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

    const rooms = result.value.roomsDetails

    return {
      rooms: rooms.map(RoomDetailsPresenter.toHTTP),
    }
  }
}
