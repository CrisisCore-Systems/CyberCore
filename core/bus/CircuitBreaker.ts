/**
 * @file CircuitBreaker.ts
 * Implements neural bus circuit breakers
 */

// @crisiscore-vuln CRITICAL: Neural bus cascade protection
export class CircuitBreaker {
  private readonly MAX_EVENTS = 100;
  private readonly TIME_WINDOW = 1000; // 1 second
  private readonly eventCounts = new Map<string, number>();
  private readonly lastReset = new Map<string, number>();

  public allowEvent(
    type: string,
    source: string
  ): boolean {
    const key = `${type}:${source}`;
    const now = Date.now();

    // Reset counts after window
    if (this.shouldResetCounts(key, now)) {
      this.resetCounts(key, now);
    }

    // Increment count
    const count = (this.eventCounts.get(key) || 0) + 1;
    this.eventCounts.set(key, count);

    // Check threshold
    return count <= this.MAX_EVENTS;
  }

  private shouldResetCounts(
    key: string,
    now: number
  ): boolean {
    const last = this.lastReset.get(key) || 0;
    return now - last >= this.TIME_WINDOW;
  }

  private resetCounts(
    key: string, 
    now: number
  ): void {
    this.eventCounts.set(key, 0);
    this.lastReset.set(key, now);
  }
}
