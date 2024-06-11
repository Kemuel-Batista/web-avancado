import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { FetchMessagesByRoomIdUseCase } from '@/domain/chat/application/use-cases/chat-message/fetch-messages-by-room-id'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { logger } from '@/infra/config/winston-config'

import { ChatMessageDetailsPresenter } from '../../presenters/chat-message-details-presenter'

@Controller('/chat-messages/room/:roomId')
export class FetchMessagesByRoomIdController {
  constructor(private fetchMessagesByRoomId: FetchMessagesByRoomIdUseCase) {}

  @Get()
  async handle(
    @Param('roomId') roomId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    const result = await this.fetchMessagesByRoomId.execute({
      requestBy: userId,
      roomId,
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

    const chatMessages = result.value.chatMessagesDetails

    return {
      chatMessages: chatMessages.map(ChatMessageDetailsPresenter.toHTTP),
    }
  }
}
