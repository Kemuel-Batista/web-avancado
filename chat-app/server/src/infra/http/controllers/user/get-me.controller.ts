import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'

import { GetMeUseCase } from '@/domain/chat/application/use-cases/user/get-me'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { UserPresenter } from '../../presenters/user-presenter'

@Controller('/me')
export class GetMeController {
  constructor(private getMe: GetMeUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.getMe.execute({
      userId: user.sub,
    })

    if (result.isError()) {
      throw new BadRequestException('Erro ao carregar')
    }

    const me = result.value.user

    return {
      user: UserPresenter.toHTTP(me),
    }
  }
}
