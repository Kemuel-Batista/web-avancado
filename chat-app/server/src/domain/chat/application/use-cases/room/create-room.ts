import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Room } from '@/domain/chat/enterprise/entities/room'

import { RoomsRepository } from '../../repositories/rooms-repository'

interface CreateRoomUseCaseRequest {
  participantOneId: string
  participantTwoId: string
}

type CreateRoomUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    room: Room
  }
>

@Injectable()
export class CreateRoomUseCase {
  constructor(private roomsRepository: RoomsRepository) {}

  async execute({
    participantOneId,
    participantTwoId,
  }: CreateRoomUseCaseRequest): Promise<CreateRoomUseCaseResponse> {
    const roomAlreadyExists =
      await this.roomsRepository.findByParticipantOneAndParticipantTwo(
        participantOneId,
        participantTwoId,
      )

    if (roomAlreadyExists) {
      return success({
        room: roomAlreadyExists,
      })
    }

    const room = Room.create({
      participantOneId: new UniqueEntityID(participantOneId),
      participantTwoId: new UniqueEntityID(participantTwoId),
    })

    await this.roomsRepository.create(room)

    return success({
      room,
    })
  }
}
