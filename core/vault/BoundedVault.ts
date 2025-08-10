/**
 * @file BoundedVault.ts
 * Implements bounded vault operations with anti-recursion
 */

import { CoherenceBreaker } from '../quantum/CoherenceBreaker';
import { AtomicEpoch } from '../epoch/AtomicEpoch';

interface VaultShare {
  id: string;
  price: number;
  quantity: number;
  epoch: number;
}

// @crisiscore-vuln CRITICAL: Vault share price protection
export class BoundedVault {
  private readonly MAX_PRICE_MULTIPLIER = 2.0;
  private readonly MIN_PRICE_MULTIPLIER = 0.5;
  private readonly coherenceBreaker: CoherenceBreaker;
  private readonly shares: Map<string, VaultShare>;
  private recursionDepth = 0;
  private readonly MAX_RECURSION = 3;

  constructor() {
    this.coherenceBreaker = new CoherenceBreaker();
    this.shares = new Map();
  }

  public async addShare(
    id: string, 
    quantity: number,
    basePrice: number
  ): Promise<boolean> {
    // Prevent deep recursion
    if (++this.recursionDepth > this.MAX_RECURSION) {
      throw new Error('Max vault recursion depth exceeded');
    }

    try {
      const share = this.shares.get(id);
      const price = this.calculateBoundedPrice(
        share?.price ?? basePrice,
        quantity
      );

      // Validate price movement
      if (!this.isValidPriceMovement(share?.price, price)) {
        return false;
      }

      // Update with atomic epoch
      this.shares.set(id, {
        id,
        price,
        quantity: (share?.quantity ?? 0) + quantity,
        epoch: AtomicEpoch.increment()
      });

      return true;

    } finally {
      this.recursionDepth--;
    }
  }

  private calculateBoundedPrice(
    basePrice: number, 
    quantity: number
  ): number {
    // Apply coherence dampening
    const rawDelta = quantity * 0.01;
    const dampedDelta = this.coherenceBreaker.dampCoherence(rawDelta);

    // Calculate bounded price
    const multiplier = 1 + dampedDelta;
    return Math.max(
      basePrice * this.MIN_PRICE_MULTIPLIER,
      Math.min(
        basePrice * multiplier,
        basePrice * this.MAX_PRICE_MULTIPLIER
      )
    );
  }

  private isValidPriceMovement(
    oldPrice?: number,
    newPrice?: number
  ): boolean {
    if (oldPrice == null || newPrice == null) return true;
    const movement = Math.abs((newPrice - oldPrice) / oldPrice);
    return movement <= 0.1; // Max 10% change
  }
}
