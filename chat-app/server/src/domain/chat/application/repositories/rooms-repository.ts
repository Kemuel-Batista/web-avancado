import { PaginationParams } from '@/core/repositories/paginations-params'

import { Room } from '../../enterprise/entities/room'
import { RoomDetails } from '../../enterprise/entities/value-objects/room-details'

export abstract class RoomsRepository {
  abstract findById(id: string): Promise<Room | null>
  abstract findDetailsById(id: string): Promise<RoomDetails | null>
  abstract findByParticipantOneAndParticipantTwo(
    senderId: string,
    recipientId: string,
  ): Promise<Room | null>

  abstract findManyByParticipantId(
    participantId: string,
    params: PaginationParams,
  ): Promise<RoomDetails[]>

  abstract save(room: Room): Promise<void>
  abstract create(room: Room): Promise<void>
  abstract delete(room: Room): Promise<void>
}
