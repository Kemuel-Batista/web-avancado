import { DomainEvent } from '../events/domain-event'
import { DomainEvents } from '../events/domain-events'
import { Entity } from './entity'

export abstract class AggregateRoot<Props> extends Entity<Props> {
  private _domainEvens: DomainEvent[] = []

  get domainEvents(): DomainEvent[] {
    return this._domainEvens
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvens.push(domainEvent)
    DomainEvents.markAggregateForDispatch(this)
  }

  public clearEvents() {
    this._domainEvens = []
  }
}
