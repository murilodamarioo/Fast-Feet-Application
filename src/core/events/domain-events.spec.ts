import { AggregateRoot } from '@/core/entities/aggregate-root'
import { DomainEvent } from './domain-event'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvents } from './domain-events'
import { vi } from 'vitest'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}


class CustomAggregate extends AggregateRoot<any> {
  
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }

}

describe('Domain Events', () => {
  it('should be able to dispatch and listen events', () => {
    // Create a spy function to act as the event callback
    const callbackSpy = vi.fn()

    // Register the spy as a listener for the CustomAggregateCreated event
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Create a new CustomAggregate, which adds a CustomAggregateCreated event to its domain events
    const aggregate = CustomAggregate.create()

    // Ensure the aggregate has one domain event queued
    expect(aggregate.domainEvents).toHaveLength(1)

    // Dispatch all domain events for this aggregate, triggering the registered callback
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    expect(callbackSpy).toHaveBeenCalledTimes(1)
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})