type Message = {
  pollOptionId: string
  votes: number
}

type Subscriber = (message: Message) => void

class VotingPubSub {
  private listeners: Record<string, Subscriber[]> = {}

  subscribe(key: string, subscriber: Subscriber) {
    if (!this.listeners[key]) {
      this.listeners[key] = []
    }

    this.listeners[key].push(subscriber)
  }

  publish(key: string, message: Message) {
    if (!this.listeners[key]) {
      return
    }

    for (const subscriber of this.listeners[key]) {
      subscriber(message)
    }
  }
}

export const voting = new VotingPubSub()
