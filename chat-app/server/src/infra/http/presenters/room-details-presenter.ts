import { RoomDetails } from '@/domain/chat/enterprise/entities/value-objects/room-details'

export class RoomDetailsPresenter {
  static toHTTP(raw: RoomDetails) {
    return {
      id: raw.id.toString(),
      participantOneId: raw.participantOneId.toString(),
      participantOneName: raw.participantOneName,
      participantOnePhoto: raw.participantOnePhoto,
      participantTwoId: raw.participantTwoId.toString(),
      participantTwoName: raw.participantTwoName,
      participantTwoPhoto: raw.participantTwoPhoto,
      lastMessage: raw.lastMessage,
      lastMessageDate: raw.lastMessageDate,
    }
  }
}
