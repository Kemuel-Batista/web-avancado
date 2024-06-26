import { Module } from '@nestjs/common'

import { FetchMessagesByRoomIdUseCase } from '@/domain/chat/application/use-cases/chat-message/fetch-messages-by-room-id'
import { CreateRoomUseCase } from '@/domain/chat/application/use-cases/room/create-room'
import { DeleteRoomUseCase } from '@/domain/chat/application/use-cases/room/delete-room'
import { FetchRoomsByParticipantIdUseCase } from '@/domain/chat/application/use-cases/room/fetch-rooms-by-participant-id'
import { AuthenticateUserUseCase } from '@/domain/chat/application/use-cases/user/authenticate-user'
import { CreateUserUseCase } from '@/domain/chat/application/use-cases/user/create-user'
import { FetchUsersUseCase } from '@/domain/chat/application/use-cases/user/fetch-users'
import { GetMeUseCase } from '@/domain/chat/application/use-cases/user/get-me'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { FetchMessagesByRoomIdController } from './controllers/chat-message/fetch-messages-by-room-id.controller'
import { CreateRoomController } from './controllers/room/create-room.controller'
import { DeleteRoomController } from './controllers/room/delete-room.controller'
import { FetchRoomsByParticipantIdController } from './controllers/room/fetch-rooms-by-participant-id.controller'
import { AuthenticateUserController } from './controllers/user/authenticate-user.controller'
import { CreateUserController } from './controllers/user/create-user.controller'
import { FetchUsersController } from './controllers/user/fetch-users.controller'
import { GetMeController } from './controllers/user/get-me.controller'
import { LogoutUserController } from './controllers/user/logout-user.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateRoomController,
    FetchRoomsByParticipantIdController,
    DeleteRoomController,
    FetchMessagesByRoomIdController,
    AuthenticateUserController,
    CreateUserController,
    FetchUsersController,
    GetMeController,
    LogoutUserController,
  ],
  providers: [
    CreateRoomUseCase,
    FetchRoomsByParticipantIdUseCase,
    DeleteRoomUseCase,
    FetchMessagesByRoomIdUseCase,
    AuthenticateUserUseCase,
    CreateUserUseCase,
    FetchUsersUseCase,
    GetMeUseCase,
  ],
})
export class HttpModule {}
