import { Logger } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'

import { FetchMessagesByRoomIdUseCase } from '@/domain/chat/application/use-cases/chat-message/fetch-messages-by-room-id'
import { SendMessageUseCase } from '@/domain/chat/application/use-cases/chat-message/send-message'
import { GetRoomDetailsByIdUseCase } from '@/domain/chat/application/use-cases/room/get-room-details-by-id'

import { ChatMessageDetailsPresenter } from '../http/presenters/chat-message-details-presenter'
import { RoomDetailsPresenter } from '../http/presenters/room-details-presenter'
import { SocketWithAuth } from './socket-io-adapter'

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Authorization',
      'Content-Type',
      'Accept',
      'Origin',
      'X-Request-With',
    ],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name)

  @WebSocketServer() server: Server

  constructor(
    private fetchMessagesByRoomId: FetchMessagesByRoomIdUseCase,
    private getRoomDetailsByIdUseCase: GetRoomDetailsByIdUseCase,
    private sendMessage: SendMessageUseCase,
  ) {}

  handleConnection(client: SocketWithAuth) {
    console.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: SocketWithAuth) {
    console.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() data: { roomId: string },
  ) {
    client.join(data.roomId)

    const roomResult = await this.getRoomDetailsByIdUseCase.execute({
      participantId: client.sub,
      roomId: data.roomId,
    })

    let roomDetails: RoomDetailsPresenter | null = null

    if (roomResult.isSuccess()) {
      roomDetails = RoomDetailsPresenter.toHTTP(roomResult.value.roomDetails)
    }

    this.server.to(data.roomId).emit('room-details', roomDetails)

    const messagesResult = await this.fetchMessagesByRoomId.execute({
      requestBy: client.sub,
      roomId: data.roomId,
    })

    const messagesOfRoom: ChatMessageDetailsPresenter[] = []

    if (messagesResult.isSuccess()) {
      messagesOfRoom.push(
        ...messagesResult.value.chatMessagesDetails.map(
          ChatMessageDetailsPresenter.toHTTP,
        ),
      )
    }

    this.server.to(data.roomId).emit('loadMessages', messagesOfRoom)
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody()
    payload: {
      roomId: string
      userRecipientId: string
      message: string
    },
  ) {
    const newMessageResult = await this.sendMessage.execute({
      message: payload.message,
      recipientId: payload.userRecipientId,
      roomId: payload.roomId,
      senderId: client.sub,
    })

    if (newMessageResult.isSuccess()) {
      this.server
        .to(payload.roomId)
        .emit(
          'newMessage',
          ChatMessageDetailsPresenter.toHTTP(
            newMessageResult.value.messageDetails,
          ),
        )
    }
  }
}
