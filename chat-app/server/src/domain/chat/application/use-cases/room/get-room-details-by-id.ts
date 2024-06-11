import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { RoomDetails } from '@/domain/chat/enterprise/entities/value-objects/room-details'

import { RoomsRepository } from '../../repositories/rooms-repository'
import { UsersRepository } from '../../repositories/users-repository'

interface GetRoomDetailsByIdUseCaseRequest {
  participantId: string
  roomId: string
}

type GetRoomDetailsByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    roomDetails: RoomDetails
  }
>

@Injectable()
export class GetRoomDetailsByIdUseCase {
  constructor(
    private roomsRepository: RoomsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    participantId,
    roomId,
  }: GetRoomDetailsByIdUseCaseRequest): Promise<GetRoomDetailsByIdUseCaseResponse> {
    const user = await this.usersRepository.findById(participantId)

    if (!user) {
      return failure(new ResourceNotFoundError())
    }

    const roomDetails = await this.roomsRepository.findDetailsById(roomId)

    if (!roomDetails) {
      return failure(new ResourceNotFoundError())
    }

    return success({
      roomDetails,
    })
  }
}
