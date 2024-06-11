import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { FetchMessagesByRoomIdUseCase } from '@/domain/chat/application/use-cases/chat-message/fetch-messages-by-room-id'
import { SendMessageUseCase } from '@/domain/chat/application/use-cases/chat-message/send-message'
import { GetRoomDetailsByIdUseCase } from '@/domain/chat/application/use-cases/room/get-room-details-by-id'

import { DatabaseModule } from '../database/database.module'
import { ChatGateway } from './chat.gateway'
import { SocketIOAdapter } from './socket-io-adapter'

@Module({
  imports: [DatabaseModule, JwtModule],
  providers: [
    ChatGateway,
    SocketIOAdapter,
    FetchMessagesByRoomIdUseCase,
    GetRoomDetailsByIdUseCase,
    SendMessageUseCase,
  ],
  exports: [],
})
export class WebsocketModule {}
