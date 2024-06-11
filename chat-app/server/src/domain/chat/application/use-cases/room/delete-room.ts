import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { RoomsRepository } from '../../repositories/rooms-repository'
import { UsersRepository } from '../../repositories/users-repository'

interface DeleteRoomUseCaseRequest {
  requestBy: string
  roomId: string
}

type DeleteRoomUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteRoomUseCase {
  constructor(
    private roomsRepository: RoomsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    requestBy,
    roomId,
  }: DeleteRoomUseCaseRequest): Promise<DeleteRoomUseCaseResponse> {
    const user = await this.usersRepository.findById(requestBy)

    if (!user) {
      return failure(new ResourceNotFoundError())
    }

    const room = await this.roomsRepository.findById(roomId)

    if (!room) {
      return failure(new ResourceNotFoundError())
    }

    if (
      room.participantOneId.toString() !== requestBy &&
      room.participantTwoId.toString() !== requestBy
    ) {
      return failure(new NotAllowedError())
    }

    await this.roomsRepository.delete(room)

    return success(null)
  }
}
