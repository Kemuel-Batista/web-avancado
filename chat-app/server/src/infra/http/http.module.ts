import { Module } from '@nestjs/common'

import { FetchMessagesByRoomIdUseCase } from '@/domain/chat/application/use-cases/chat-message/fetch-messages-by-room-id'
import { CreateRoomUseCase } from '@/domain/chat/application/use-cases/room/create-room'
import { DeleteRoomUseCase } from '@/domain/chat/application/use-cases/room/delete-room'
import { FetchRoomsByParticipantIdUseCase } from '@/domain/chat/application/use-cases/room/fetch-rooms-by-participant-id'
import { AuthenticateUserUseCase } from '@/domain/chat/application/use-cases/user/authenticate-user'
import { CreateUserUseCase } from '@/domain/chat/application/use-cases/user/create-user'

import { DatabaseModule } from '../database/database.module'
import { FetchMessagesByRoomIdController } from './controllers/chat-message/fetch-messages-by-room-id.controller'
import { CreateRoomController } from './controllers/room/create-room.controller'
import { DeleteRoomController } from './controllers/room/delete-room.controller'
import { FetchRoomsByParticipantIdController } from './controllers/room/fetch-rooms-by-participant-id.controller'
import { AuthenticateUserController } from './controllers/user/authenticate-user.controller'
import { CreateUserController } from './controllers/user/create-user.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateRoomController,
    FetchRoomsByParticipantIdController,
    DeleteRoomController,
    FetchMessagesByRoomIdController,
    AuthenticateUserController,
    CreateUserController,
  ],
  providers: [
    CreateRoomUseCase,
    FetchRoomsByParticipantIdUseCase,
    DeleteRoomUseCase,
    FetchMessagesByRoomIdUseCase,
    AuthenticateUserUseCase,
    CreateUserUseCase,
  ],
})
export class HttpModule {}
