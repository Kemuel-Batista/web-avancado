import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { PaginationParams } from '@/core/repositories/paginations-params'
import { RoomDetails } from '@/domain/chat/enterprise/entities/value-objects/room-details'

import { RoomsRepository } from '../../repositories/rooms-repository'
import { UsersRepository } from '../../repositories/users-repository'

interface FetchRoomsByParticipantIdUseCaseRequest {
  participantId: string
  params: PaginationParams
}

type FetchRoomsByParticipantIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    roomsDetails: RoomDetails[]
  }
>

@Injectable()
export class FetchRoomsByParticipantIdUseCase {
  constructor(
    private roomsRepository: RoomsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    participantId,
    params,
  }: FetchRoomsByParticipantIdUseCaseRequest): Promise<FetchRoomsByParticipantIdUseCaseResponse> {
    const user = await this.usersRepository.findById(participantId)

    if (!user) {
      return failure(new ResourceNotFoundError())
    }

    const roomsDetails = await this.roomsRepository.findManyByParticipantId(
      participantId,
      params,
    )

    return success({
      roomsDetails,
    })
  }
}
