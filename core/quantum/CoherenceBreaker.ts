/**
 * @file CoherenceBreaker.ts
 * Implements quantum coherence damping and isolation
 */

// @crisiscore-vuln CRITICAL: Quantum resonance cascade protection
import { CircularBuffer } from '../utils/CircularBuffer';

export class CoherenceBreaker {
  private static readonly DAMPING_FACTOR = 0.85;
  private static readonly MIN_COHERENCE = 0.15;
  private static readonly MAX_COHERENCE = 0.95;
  private readonly measurements = new CircularBuffer<number>(10);

  public dampCoherence(measured: number): number {
    this.measurements.push(measured);
    
    // Detect resonance patterns
    if (this.detectResonance()) {
      return CoherenceBreaker.MIN_COHERENCE;
    }

    // Apply dampening
    const damped = Math.pow(measured, CoherenceBreaker.DAMPING_FACTOR);
    return Math.max(CoherenceBreaker.MIN_COHERENCE, 
           Math.min(CoherenceBreaker.MAX_COHERENCE, damped));
  }

  private detectResonance(): boolean {
    const values = this.measurements.toArray();
    if (values.length < 3) return false;

    // Check for oscillating patterns
    let oscillations = 0;
    for (let i = 2; i < values.length; i++) {
      if ((values[i] > values[i-1] && values[i-1] < values[i-2]) ||
          (values[i] < values[i-1] && values[i-1] > values[i-2])) {
        oscillations++;
      }
    }

    return oscillations > values.length * 0.7;
  }
}
