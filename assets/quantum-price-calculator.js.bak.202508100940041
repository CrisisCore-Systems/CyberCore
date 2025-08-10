/**
 * Quantum Price Calculator
 * Client-side implementation that integrates with server-side validation
 *
 * Calculates prices based on trauma encoding and coherence metrics
 * with anti-manipulation security features
 */

/**
 *
 */
class QuantumPriceCalculator {
  /**
   *
   */
  constructor(options = {}) {
    this.config = {
      apiEndpoint: '/api/quantum/price',
      nonceEndpoint: '/api/quantum/price/nonce',
      cacheExpiration: 5 * 60 * 1000, // 5 minutes
      debugMode: false,
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
      ...options,
    };

    // Initialize cache
    this.priceCache = new Map();

    // Debug mode
    if (this.config.debugMode) {
      console.log('QuantumPriceCalculator initialized with config:', this.config);
    }
  }

  /**
   * Calculate quantum price for a product
   * @param {Object} params - Price calculation parameters
   * @returns {Promise<Object>} - Calculated price result
   */
  async calculatePrice(params) {
    const {
      productId,
      basePrice,
      traumaTypes = [],
      coherenceScore = 0.5,
      customerProfile = {},
      bypassCache = false,
    } = params;

    // Validate input
    if (!productId || typeof basePrice !== 'number' || basePrice <= 0) {
      throw new Error('Invalid product data for price calculation');
    }

    // Check cache if not bypassed
    if (!bypassCache) {
      const cachedPrice = this.getCachedPrice(
        productId,
        traumaTypes,
        coherenceScore,
        customerProfile
      );
      if (cachedPrice) {
        if (this.config.debugMode) {
          console.log(`Using cached price for ${productId}:`, cachedPrice);
        }
        return cachedPrice;
      }
    }

    try {
      // Get price nonce from server
      const nonceResponse = await this.fetchPriceNonce(productId, basePrice);

      if (!nonceResponse || !nonceResponse.nonce) {
        throw new Error('Failed to obtain price calculation nonce');
      }

      // Calculate price locally first
      const calculatedPrice = this.calculateLocalPrice({
        productId,
        basePrice,
        traumaTypes,
        coherenceScore,
        customerProfile,
      });

      // Generate signature for the calculation
      const signature = await this.generateSignature({
        nonce: nonceResponse.nonce,
        productId,
        basePrice,
        finalPrice: calculatedPrice.finalPrice,
      });

      // Validate with server
      const validationResult = await this.validateWithServer({
        nonce: nonceResponse.nonce,
        productId,
        basePrice,
        clientPrice: calculatedPrice.finalPrice,
        traumaTypes,
        coherenceScore,
        customerProfile,
        signature,
      });

      // Get the final result (either client or server price based on validation)
      const finalResult = {
        ...calculatedPrice,
        validatedByServer: validationResult.valid,
        finalPrice: validationResult.valid
          ? calculatedPrice.finalPrice
          : validationResult.serverPrice,
      };

      // Cache the result
      this.cachePrice(productId, traumaTypes, coherenceScore, customerProfile, finalResult);

      return finalResult;
    } catch (error) {
      console.error('Error calculating quantum price:', error);

      // Fallback to local calculation if server validation fails
      const fallbackPrice = this.calculateLocalPrice({
        productId,
        basePrice,
        traumaTypes,
        coherenceScore,
        customerProfile,
      });

      return {
        ...fallbackPrice,
        validatedByServer: false,
        error: error.message,
      };
    }
  }

  /**
   * Calculate price locally
   * @param {Object} params - Calculation parameters
   * @returns {Object} - Calculation result
   * @private
   */
  calculateLocalPrice(params) {
    const {
      productId,
      basePrice,
      traumaTypes = [],
      coherenceScore = 0.5,
      customerProfile = {},
    } = params;

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

    // Round to 2 decimal places and ensure positive
    finalPrice = Math.max(0, Math.round(finalPrice * 100) / 100);

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
   * Fetch a price calculation nonce from the server
   * @param {string} productId - Product ID
   * @param {number} basePrice - Base price
   * @returns {Promise<Object>} - Nonce response
   * @private
   */
  async fetchPriceNonce(productId, basePrice) {
    try {
      const response = await fetch(this.config.nonceEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          basePrice,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch nonce: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching price nonce:', error);
      throw error;
    }
  }

  /**
   * Generate a digital signature for a price calculation
   * @param {Object} params - Signature parameters
   * @returns {Promise<string>} - Generated signature
   * @private
   */
  async generateSignature(params) {
    try {
      // In a real implementation, this would use a secure method
      // such as Web Crypto API or a server call
      // This is just a placeholder for the example

      if (window.crypto && window.crypto.subtle) {
        // Use Web Crypto API for local signature generation
        // This is just an example and not secure - in a real app,
        // signatures should be generated server-side
        const msgBuffer = new TextEncoder().encode(
          `${params.nonce}:${params.productId}:${params.basePrice}:${params.finalPrice}`
        );

        const keyBuffer = await window.crypto.subtle.digest(
          'SHA-256',
          new TextEncoder().encode(params.nonce)
        );

        const signatureBuffer = await window.crypto.subtle.sign('HMAC', keyBuffer, msgBuffer);

        // Convert to hex string
        return Array.from(new Uint8Array(signatureBuffer))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      } else {
        // Fallback to server-side signature
        const response = await fetch(`${this.config.apiEndpoint}/sign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate signature: ${response.statusText}`);
        }

        const result = await response.json();
        return result.signature;
      }
    } catch (error) {
      console.error('Error generating signature:', error);
      // Return empty signature if generation fails
      return '';
    }
  }

  /**
   * Validate price calculation with server
   * @param {Object} params - Validation parameters
   * @returns {Promise<Object>} - Validation result
   * @private
   */
  async validateWithServer(params) {
    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Price validation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error validating price with server:', error);
      return { valid: false, error: error.message };
    }
  }

  /**
   * Get cached price if available and not expired
   * @param {string} productId - Product ID
   * @param {Array} traumaTypes - Trauma types
   * @param {number} coherenceScore - Coherence score
   * @param {Object} customerProfile - Customer profile
   * @returns {Object|null} - Cached price or null
   * @private
   */
  getCachedPrice(productId, traumaTypes, coherenceScore, customerProfile) {
    const cacheKey = this.generateCacheKey(productId, traumaTypes, coherenceScore, customerProfile);

    if (this.priceCache.has(cacheKey)) {
      const cachedData = this.priceCache.get(cacheKey);

      // Check if cache entry is still valid
      if (Date.now() - cachedData.timestamp < this.config.cacheExpiration) {
        return cachedData.priceData;
      } else {
        // Remove expired cache entry
        this.priceCache.delete(cacheKey);
      }
    }

    return null;
  }

  /**
   * Cache price calculation result
   * @param {string} productId - Product ID
   * @param {Array} traumaTypes - Trauma types
   * @param {number} coherenceScore - Coherence score
   * @param {Object} customerProfile - Customer profile
   * @param {Object} priceData - Price calculation result
   * @private
   */
  cachePrice(productId, traumaTypes, coherenceScore, customerProfile, priceData) {
    const cacheKey = this.generateCacheKey(productId, traumaTypes, coherenceScore, customerProfile);

    this.priceCache.set(cacheKey, {
      timestamp: Date.now(),
      priceData,
    });

    // Clean up expired cache entries
    this.cleanupCache();
  }

  /**
   * Generate a cache key for price data
   * @param {string} productId - Product ID
   * @param {Array} traumaTypes - Trauma types
   * @param {number} coherenceScore - Coherence score
   * @param {Object} customerProfile - Customer profile
   * @returns {string} - Cache key
   * @private
   */
  generateCacheKey(productId, traumaTypes, coherenceScore, customerProfile) {
    // Create string representations of complex objects
    const traumaKey = traumaTypes
      .map((t) => {
        if (typeof t === 'string') return t;
        return `${t.type}:${t.intensity || 1}:${t.isPrimary ? 1 : 0}`;
      })
      .sort()
      .join(',');

    const coherenceKey = coherenceScore.toFixed(2);

    // Only include relevant customer profile data
    const profileKey = customerProfile
      ? `${customerProfile.quantumLoyaltyTier || ''}:${customerProfile.dominantTrauma || ''}`
      : '';

    return `${productId}:${traumaKey}:${coherenceKey}:${profileKey}`;
  }

  /**
   * Clean up expired cache entries
   * @private
   */
  cleanupCache() {
    const now = Date.now();
    const expirationThreshold = now - this.config.cacheExpiration;

    for (const [key, data] of this.priceCache.entries()) {
      if (data.timestamp < expirationThreshold) {
        this.priceCache.delete(key);
      }
    }
  }

  /**
   * Format price for display
   * @param {number} price - Price to format
   * @param {string} currencyCode - Currency code (default: USD)
   * @returns {string} - Formatted price
   */
  formatPrice(price, currencyCode = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price);
  }

  /**
   * Clear price cache
   * @param {string} [productId] - Optional specific product ID to clear
   */
  clearCache(productId) {
    if (productId) {
      // Clear only entries for specific product
      for (const [key, _] of this.priceCache.entries()) {
        if (key.startsWith(`${productId}:`)) {
          this.priceCache.delete(key);
        }
      }
    } else {
      // Clear entire cache
      this.priceCache.clear();
    }

    if (this.config.debugMode) {
      console.log(`Price cache ${productId ? `for ${productId} ` : ''}cleared`);
    }
  }
}

// Export for use in other modules
export default QuantumPriceCalculator;
