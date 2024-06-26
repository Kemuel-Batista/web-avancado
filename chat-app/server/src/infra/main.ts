import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { Env } from './env/env'
import { SocketIOAdapter } from './websocket/socket-io-adapter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const corsOptions: CorsOptions = {
    credentials: true,
    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'PATH',
      'OPTIONS',
      'HEAD',
    ],
    origin: ['http://localhost:3000'],
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials',
      'Authorization',
      'Content-Type',
      'Accept',
    ],
    exposedHeaders: ['Set-Cookie'],
  }

  app.enableCors(corsOptions)

  app.use(cookieParser())

  const configService = app.get<ConfigService<Env, true>>(ConfigService)

  app.useWebSocketAdapter(new SocketIOAdapter(app, configService))

  const port = configService.get('PORT', { infer: true })

  await app.listen(port)
}
bootstrap()
