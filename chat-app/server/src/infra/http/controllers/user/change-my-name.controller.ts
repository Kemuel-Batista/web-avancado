import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Patch,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ChangeMyNameUseCase } from '@/domain/chat/application/use-cases/user/change-my-name'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const changeMyNameBodySchema = z.object({
  name: z.string(),
})

type ChangeMyNameBodySchema = z.infer<typeof changeMyNameBodySchema>

@Controller('/users/change-name')
export class ChangeMyNameController {
  constructor(private changeMyName: ChangeMyNameUseCase) {}

  @Patch()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(changeMyNameBodySchema))
  async handle(
    @Body() body: ChangeMyNameBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name } = body

    const result = await this.changeMyName.execute({
      newName: name,
      userId: user.sub,
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
