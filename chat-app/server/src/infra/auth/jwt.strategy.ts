import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

import { EnvService } from '../env/env.service'

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: EnvService) {
    const jwtKey = config.get('JWT_KEY')

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtKey,
      algorithms: ['HS256'],
    })
  }

  private static extractJWT(request: Request): string | null {
    if (
      request.cookies &&
      'nextauth_token' in request.cookies &&
      request.cookies.nextauth_token.length > 0
    ) {
      return request.cookies.nextauth_token
    }
    return null
  }

  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}
