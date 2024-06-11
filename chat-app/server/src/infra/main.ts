import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'

import { AppModule } from './app.module'
import { Env } from './env/env'
import { EnvService } from './env/env.service'
import { SocketIOAdapter } from './websocket/socket-io-adapter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const envService = app.get(EnvService)

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATH', 'OPTIONS', 'HEAD'],
  })

  const port = envService.get('PORT')

  const configService = app.get<ConfigService<Env, true>>(ConfigService)

  app.useWebSocketAdapter(new SocketIOAdapter(app, configService))

  await app.listen(port)
}
bootstrap()
