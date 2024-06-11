import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ChatMessageDetails } from '@/domain/chat/enterprise/entities/value-objects/chat-message-details'

import { ChatMessagesRepository } from '../../repositories/chat-messages-repository'
import { RoomsRepository } from '../../repositories/rooms-repository'
import { UsersRepository } from '../../repositories/users-repository'

interface FetchMessagesByRoomIdUseCaseRequest {
  requestBy: string
  roomId: string
}

type FetchMessagesByRoomIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    chatMessagesDetails: ChatMessageDetails[]
  }
>

@Injectable()
export class FetchMessagesByRoomIdUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private roomsRepository: RoomsRepository,
    private chatMessagesRepository: ChatMessagesRepository,
  ) {}

  async execute({
    requestBy,
    roomId,
  }: FetchMessagesByRoomIdUseCaseRequest): Promise<FetchMessagesByRoomIdUseCaseResponse> {
    const user = await this.usersRepository.findById(requestBy)

    if (!user) {
      return failure(new ResourceNotFoundError())
    }

    const room = await this.roomsRepository.findById(roomId)

    if (!room) {
      return failure(new ResourceNotFoundError())
    }

    const participantOneId = room.participantOneId.toString()
    const participantTwoId = room.participantTwoId.toString()

    if (!(requestBy === participantOneId || requestBy === participantTwoId)) {
      return failure(new NotAllowedError())
    }

    const chatMessagesDetails =
      await this.chatMessagesRepository.findManyByRoomId(roomId)

    return success({
      chatMessagesDetails,
    })
  }
}
