import { UseCaseError } from '@/core/errors/use-case-error'

export class ResourceAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Resource with same "${identifier}" already exists.`)
  }
}
