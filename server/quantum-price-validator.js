/**
 * Server-side quantum price calculator and validator
 * Ensures price calculations cannot be manipulated by client-side code
 */

const crypto = require('crypto');

class QuantumPriceValidator {
  constructor(config = {}) {
    this.config = {
      secretKey: process.env.QUANTUM_SECRET_KEY || 'default-quantum-secret-key',
      nonceExpirationMinutes: 15,
      allowedVariance: 0.05, // 5% price variance allowed
      traumaMultipliers: {
        abandonment: 1.15,
        fragmentation: 1.22,
        surveillance: 1.18,
        recursion: 1.24,
        displacement: 1.12,
        dissolution: 1.3,
      },
      coherenceThreshold: 0.65,
      coherenceMultiplier: 0.88,
      ...config,
    };

    // Validate configuration
    this.validateConfig();

    // Initialize nonce registry
    this.nonceRegistry = new Map();
    this.loadNonceRegistry();
  }

  /**
   * Validate configuration
   * @private
   */
  validateConfig() {
    if (!this.config.secretKey || this.config.secretKey === 'default-quantum-secret-key') {
      console.warn(
        'QuantumPriceValidator: Using default secret key. This is insecure for production.'
      );
    }

    if (this.config.nonceExpirationMinutes < 5) {
      console.warn(
        'QuantumPriceValidator: Short nonce expiration time may cause legitimate requests to fail.'
      );
    }

    // Ensure trauma multipliers are reasonable
    Object.entries(this.config.traumaMultipliers).forEach(([trauma, multiplier]) => {
      if (multiplier < 1 || multiplier > 2) {
        console.warn(
          `QuantumPriceValidator: Unusual trauma multiplier for ${trauma}: ${multiplier}`
        );
      }
    });
  }

  /**
   * Load nonce registry from persistent storage
   * @private
   */
  loadNonceRegistry() {
    try {
      // In a real implementation, this would load from a database
      // For this example, we'll just use an in-memory map
      console.log('QuantumPriceValidator: Initialized nonce registry');
    } catch (error) {
      console.error('QuantumPriceValidator: Error loading nonce registry:', error);
    }
  }

  /**
   * Generate a secure nonce for price calculation
   * @param {string} productId - Product ID
   * @param {number} basePrice - Base price for the product
   * @returns {Object} - Nonce and expiration timestamp
   */
  generatePriceNonce(productId, basePrice) {
    // Generate random bytes for nonce
    const nonceBytes = crypto.randomBytes(16);
    const nonce = nonceBytes.toString('hex');

    // Set expiration time
    const expirationTime = Date.now() + this.config.nonceExpirationMinutes * 60 * 1000;

    // Store nonce in registry with context
    this.nonceRegistry.set(nonce, {
      productId,
      basePrice,
      expirationTime,
    });

    // Clean up expired nonces
    this.cleanupExpiredNonces();

    return {
      nonce,
      expires: expirationTime,
    };
  }

  /**
   * Clean up expired nonces from registry
   * @private
   */
  cleanupExpiredNonces() {
    const now = Date.now();

    // Remove expired nonces
    for (const [nonce, data] of this.nonceRegistry.entries()) {
      if (data.expirationTime < now) {
        this.nonceRegistry.delete(nonce);
      }
    }
  }

  /**
   * Calculate quantum price on the server
   * @param {Object} params - Price calculation parameters
   * @returns {Object} - Calculation result
   */
  calculatePrice(params) {
    const {
      productId,
      basePrice,
      traumaTypes = [],
      coherenceScore = 0.5,
      customerProfile = {},
    } = params;

    // Validate input
    if (!productId || typeof basePrice !== 'number' || basePrice <= 0) {
      throw new Error('Invalid product data for price calculation');
    }

    // Base calculation
    let finalPrice = basePrice;

    // Apply trauma multipliers
    if (traumaTypes && traumaTypes.length > 0) {
      let traumaMultiplier = 1.0;

      traumaTypes.forEach((trauma) => {
        const type = trauma.type || trauma;
        const intensity = trauma.intensity || 1.0;
        const isPrimary = trauma.isPrimary !== undefined ? trauma.isPrimary : true;

        // Get multiplier for this trauma type
        const baseMultiplier = this.config.traumaMultipliers[type] || 1.1;

        // Primary traumas have full effect, secondary have reduced effect
        const effectiveMultiplier = isPrimary ? baseMultiplier : 1 + (baseMultiplier - 1) * 0.6;

        // Apply intensity scaling
        const scaledMultiplier = 1 + (effectiveMultiplier - 1) * intensity;

        // Compound the multipliers
        traumaMultiplier *= scaledMultiplier;
      });

      // Apply the combined trauma multiplier
      finalPrice *= traumaMultiplier;
    }

    // Apply coherence adjustments
    if (coherenceScore !== undefined) {
      if (coherenceScore >= this.config.coherenceThreshold) {
        // High coherence gets a discount
        const coherenceFactor =
          this.config.coherenceMultiplier +
          (1 - this.config.coherenceMultiplier) * (1 - coherenceScore);
        finalPrice *= coherenceFactor;
      } else {
        // Low coherence gets higher prices
        const incoherencePenalty = 1 + (this.config.coherenceThreshold - coherenceScore) * 0.2;
        finalPrice *= incoherencePenalty;
      }
    }

    // Apply customer-specific adjustments if available
    if (customerProfile) {
      // Check for quantum loyalty
      if (customerProfile.quantumLoyaltyTier) {
        const loyaltyDiscount = this.getCustomerLoyaltyDiscount(customerProfile.quantumLoyaltyTier);
        finalPrice *= 1 - loyaltyDiscount;
      }

      // Check for dominant trauma affinity
      if (customerProfile.dominantTrauma && traumaTypes && traumaTypes.length > 0) {
        const hasMatchingTrauma = traumaTypes.some(
          (trauma) => (trauma.type || trauma) === customerProfile.dominantTrauma
        );

        if (hasMatchingTrauma) {
          finalPrice *= 0.95; // 5% discount for trauma affinity match
        }
      }
    }

    // Round to 2 decimal places
    finalPrice = Math.round(finalPrice * 100) / 100;

    return {
      productId,
      basePrice,
      finalPrice,
      calculatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get customer loyalty discount rate
   * @param {string} tier - Loyalty tier
   * @returns {number} - Discount rate (0-1)
   * @private
   */
  getCustomerLoyaltyDiscount(tier) {
    const tiers = {
      bronze: 0.03,
      silver: 0.05,
      gold: 0.08,
      platinum: 0.12,
      quantum: 0.15,
    };

    return tiers[tier.toLowerCase()] || 0;
  }

  /**
   * Validate client-side price calculation
   * @param {Object} params - Validation parameters
   * @returns {Object} - Validation result
   */
  validateClientPrice(params) {
    const {
      nonce,
      productId,
      basePrice,
      clientPrice,
      traumaTypes,
      coherenceScore,
      customerProfile,
      signature,
    } = params;

    // Check if nonce exists and is valid
    if (!this.nonceRegistry.has(nonce)) {
      return {
        valid: false,
        reason: 'Invalid or expired price nonce',
      };
    }

    // Get nonce data
    const nonceData = this.nonceRegistry.get(nonce);

    // Verify product and base price match
    if (nonceData.productId !== productId || nonceData.basePrice !== basePrice) {
      return {
        valid: false,
        reason: 'Product or base price mismatch',
      };
    }

    // Check nonce expiration
    if (nonceData.expirationTime < Date.now()) {
      // Remove expired nonce
      this.nonceRegistry.delete(nonce);

      return {
        valid: false,
        reason: 'Price calculation expired',
      };
    }

    // Verify signature if provided
    if (signature) {
      const isSignatureValid = this.verifySignature({
        nonce,
        productId,
        basePrice,
        clientPrice,
        signature,
      });

      if (!isSignatureValid) {
        return {
          valid: false,
          reason: 'Invalid price signature',
        };
      }
    }

    // Calculate server-side price
    const serverPrice = this.calculatePrice({
      productId,
      basePrice,
      traumaTypes,
      coherenceScore,
      customerProfile,
    }).finalPrice;

    // Compare client price with server price (allowing for small variance)
    const priceDifference = Math.abs(serverPrice - clientPrice);
    const percentDifference = priceDifference / serverPrice;

    if (percentDifference > this.config.allowedVariance) {
      return {
        valid: false,
        reason: 'Price calculation mismatch',
        serverPrice,
        variance: percentDifference,
      };
    }

    // Price is valid, remove the used nonce
    this.nonceRegistry.delete(nonce);

    return {
      valid: true,
      serverPrice,
    };
  }

  /**
   * Generate a digital signature for a price calculation
   * @param {Object} params - Signature parameters
   * @returns {string} - Digital signature
   */
  generateSignature(params) {
    const { nonce, productId, basePrice, finalPrice } = params;

    // Create string to hash
    const dataString = `${nonce}:${productId}:${basePrice}:${finalPrice}:${this.config.secretKey}`;

    // Generate HMAC signature
    const hmac = crypto.createHmac('sha256', this.config.secretKey);
    hmac.update(dataString);

    return hmac.digest('hex');
  }

  /**
   * Verify a price calculation signature
   * @param {Object} params - Signature verification parameters
   * @returns {boolean} - Whether signature is valid
   */
  verifySignature(params) {
    const { nonce, productId, basePrice, clientPrice, signature } = params;

    // Generate expected signature
    const expectedSignature = this.generateSignature({
      nonce,
      productId,
      basePrice,
      finalPrice: clientPrice,
    });

    // Compare signatures using constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }
}

module.exports = QuantumPriceValidator;
