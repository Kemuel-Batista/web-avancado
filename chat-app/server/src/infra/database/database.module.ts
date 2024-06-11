import { Module } from '@nestjs/common'

import { ChatMessagesRepository } from '@/domain/chat/application/repositories/chat-messages-repository'
import { RoomsRepository } from '@/domain/chat/application/repositories/rooms-repository'
import { UsersRepository } from '@/domain/chat/application/repositories/users-repository'

import { PrismaService } from './prisma/prisma.service'
import { PrismaChatMessagesRepository } from './prisma/repositories/prisma-chat-messages-repository'
import { PrismaRoomsRepository } from './prisma/repositories/prisma-rooms-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: RoomsRepository,
      useClass: PrismaRoomsRepository,
    },
    {
      provide: ChatMessagesRepository,
      useClass: PrismaChatMessagesRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [
    PrismaService,
    RoomsRepository,
    ChatMessagesRepository,
    UsersRepository,
  ],
})
export class DatabaseModule {}
