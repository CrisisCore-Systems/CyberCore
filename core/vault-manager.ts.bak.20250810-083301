/**
 * @file Vault Manager
 * Implements quantum-secured vault operations with share price protection
 */

import { QuantumCoherence } from '../quantum/coherence';
import { GlobalEpoch } from '../core/epoch';

interface VaultShare {
  id: string;
  price: number;
  quantity: number;
  lastUpdate: number;
  epoch: number;
}

export class VaultManager {
  private shares: Map<string, VaultShare>;
  private coherenceValidator: QuantumCoherence;
  
  private readonly MAX_PRICE_CHANGE = 0.1; // 10% max change per operation
  private readonly MIN_COHERENCE = 0.8;

  constructor() {
    this.shares = new Map();
    this.coherenceValidator = new QuantumCoherence();
  }

  async addToVault(productId: string, quantity: number): Promise<boolean> {
    // Verify quantum coherence
    const coherence = await this.coherenceValidator.measure();
    if (coherence < this.MIN_COHERENCE) {
      throw new Error('Insufficient quantum coherence for vault operation');
    }

    const share = this.shares.get(productId);
    if (!share) {
      // Initialize new share
      this.shares.set(productId, {
        id: productId,
        price: 1.0, // Base price
        quantity,
        lastUpdate: Date.now(),
        epoch: GlobalEpoch.current()
      });
      return true;
    }

    // Validate share price changes
    const newPrice = this.calculateNewPrice(share, quantity);
    if (!this.isValidPriceChange(share.price, newPrice)) {
      throw new Error('Invalid share price movement detected');
    }

    // Update share with epoch tracking
    share.price = newPrice;
    share.quantity += quantity;
    share.lastUpdate = Date.now();
    share.epoch = GlobalEpoch.increment();

    return true;
  }

  private calculateNewPrice(share: VaultShare, quantity: number): number {
    // Implement bonding curve or other price discovery mechanism
    const newPrice = share.price * (1 + (quantity * 0.01));
    return newPrice;
  }

  private isValidPriceChange(oldPrice: number, newPrice: number): boolean {
    const changePercent = Math.abs((newPrice - oldPrice) / oldPrice);
    return changePercent <= this.MAX_PRICE_CHANGE;
  }
}
