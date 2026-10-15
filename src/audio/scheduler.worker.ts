// Runs the scheduler's tick in a worker: worker timers are not throttled like main-thread
// timers when the tab is in the background, so clicks keep getting scheduled.

type Message = { type: 'start'; intervalMs: number } | { type: 'stop' }

let timer: ReturnType<typeof setInterval> | null = null

self.onmessage = (event: MessageEvent<Message>) => {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
  if (event.data.type === 'start') {
    timer = setInterval(() => self.postMessage('tick'), event.data.intervalMs)
  }
}
