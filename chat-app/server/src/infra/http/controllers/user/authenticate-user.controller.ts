import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { Response } from 'express'
import { z } from 'zod'

import { WrongCredentialsError } from '@/core/errors/errors/wrong-credentials-error'
import { AuthenticateUserUseCase } from '@/domain/chat/application/use-cases/user/authenticate-user'
import { Public } from '@/infra/auth/public'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/auth/session')
@Public()
export class AuthenticateUserController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(
    @Body() body: AuthenticateBodySchema,
    @Res() response: Response,
  ) {
    const { email, password } = body

    const result = await this.authenticateUser.execute({
      email,
      password,
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return response
      .cookie('nextauth_token', accessToken, {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hora em milissegundos
        httpOnly: true,
        path: '/',
        secure: true, // HTTPS
        sameSite: true,
      })
      .status(200)
      .send()
  }
}
