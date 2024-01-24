import EventEmitter from 'eventemitter3'

class EventBus extends EventEmitter {
  private static instance: EventBus | null = null

  private constructor() {
    super()
  }

  public static getInstance(): EventBus {
    if (this.instance === null) {
      this.instance = new this()
    }
    return this.instance
  }

  public exposeEvents() {
    return this.eventNames().filter((eventName: string) => !eventName.startsWith('inner:'))
  }
}

export const eventBus = EventBus.getInstance()
