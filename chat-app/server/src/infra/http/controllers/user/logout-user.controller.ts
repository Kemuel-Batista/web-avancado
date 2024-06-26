import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common'
import { Response } from 'express'

@Controller('/auth/sessions/logout')
export class LogoutUserController {
  @Post()
  @HttpCode(HttpStatus.OK)
  async handle(@Res() response: Response) {
    try {
      response.clearCookie('nextauth_token', {
        path: '/',
        secure: true, // Se você os definiu como seguros
        sameSite: true,
      })

      return response.status(200).send()
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
