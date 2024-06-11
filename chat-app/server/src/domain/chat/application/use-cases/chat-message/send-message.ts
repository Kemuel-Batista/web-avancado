import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ChatMessage } from '@/domain/chat/enterprise/entities/chat-message'
import { ChatMessageDetails } from '@/domain/chat/enterprise/entities/value-objects/chat-message-details'

import { ChatMessagesRepository } from '../../repositories/chat-messages-repository'
import { RoomsRepository } from '../../repositories/rooms-repository'
import { UsersRepository } from '../../repositories/users-repository'

interface SendMessageUseCaseRequest {
  senderId: string
  recipientId: string
  roomId: string
  message: string
}

type SendMessageUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    messageDetails: ChatMessageDetails
  }
>

@Injectable()
export class SendMessageUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private roomsRepository: RoomsRepository,
    private chatMessagesRepository: ChatMessagesRepository,
  ) {}

  async execute({
    senderId,
    recipientId,
    roomId,
    message,
  }: SendMessageUseCaseRequest): Promise<SendMessageUseCaseResponse> {
    const sender = await this.usersRepository.findById(senderId)

    if (!sender) {
      return failure(new ResourceNotFoundError())
    }

    const recipient = await this.usersRepository.findById(recipientId)

    if (!recipient) {
      return failure(new ResourceNotFoundError())
    }

    const room = await this.roomsRepository.findById(roomId)

    if (!room) {
      return failure(new ResourceNotFoundError())
    }

    const participantOneId = room.participantOneId.toString()
    const participantTwoId = room.participantTwoId.toString()

    if (
      !(
        (senderId === participantOneId || senderId === participantTwoId) &&
        (recipientId === participantOneId || recipientId === participantTwoId)
      )
    ) {
      return failure(new NotAllowedError())
    }

    const chatMessage = ChatMessage.create({
      senderId: new UniqueEntityID(senderId),
      recipientId: new UniqueEntityID(recipientId),
      roomId: new UniqueEntityID(roomId),
      message,
    })

    const messageDetails = ChatMessageDetails.create({
      id: chatMessage.id,
      senderId: chatMessage.senderId,
      senderName: sender.name,
      recipientId: chatMessage.recipientId,
      recipientName: recipient.name,
      message: chatMessage.message,
      createdAt: chatMessage.createdAt,
      readAt: chatMessage.readAt,
    })

    await this.chatMessagesRepository.create(chatMessage)

    return success({
      messageDetails,
    })
  }
}
