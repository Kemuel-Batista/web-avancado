import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { WinstonModule } from 'nest-winston'

import { AuthModule } from './auth/auth.module'
import { winstonConfig } from './config/winston-config'
import { DatabaseModule } from './database/database.module'
import { envSchema } from './env/env'
import { EnvModule } from './env/env.module'
import { HttpModule } from './http/http.module'
import { WebsocketModule } from './websocket/websocket.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    WinstonModule.forRoot(winstonConfig),
    AuthModule,
    HttpModule,
    EnvModule,
    DatabaseModule,
    WebsocketModule,
  ],
})
export class AppModule {}
