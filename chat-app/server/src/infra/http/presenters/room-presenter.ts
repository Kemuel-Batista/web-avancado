import { Room } from '@/domain/chat/enterprise/entities/room'

export class RoomPresenter {
  static toHTTP(room: Room) {
    return {
      id: room.id.toString(),
      participantOneId: room.participantOneId.toString(),
      participantTwoId: room.participantTwoId.toString(),
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      deletedAt: room.deletedAt,
    }
  }
}
