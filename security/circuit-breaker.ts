type Options = { maxTransitions: number; timeWindow: number; };
export class CircuitBreaker {
  private hits: number[] = [];
  constructor(private opts: Options) {}
  allowTransition(): boolean {
    const now = Date.now();
    this.hits = this.hits.filter(t => now - t < this.opts.timeWindow);
    if (this.hits.length >= this.opts.maxTransitions) return false;
    this.hits.push(now); return true;
  }
}
