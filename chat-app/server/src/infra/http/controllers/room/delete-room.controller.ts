import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common'

import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeleteRoomUseCase } from '@/domain/chat/application/use-cases/room/delete-room'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { logger } from '@/infra/config/winston-config'

@Controller('/rooms/:roomId')
export class DeleteRoomController {
  constructor(private deleteRoom: DeleteRoomUseCase) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('roomId') roomId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteRoom.execute({
      requestBy: userId,
      roomId,
    })

    if (result.isError()) {
      const error = result.value
      logger.error(`Delete Room Error - ${error.message}`)

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
