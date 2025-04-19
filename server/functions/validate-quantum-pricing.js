// Price Validation Function for Quantum Commerce
// This serverless function validates quantum price calculations on the server side
// to prevent client-side manipulation of pricing

const crypto = require('crypto');

// Configuration
const QUANTUM_PRICE_SECRET = process.env.QUANTUM_PRICE_SECRET;
const MAX_QUANTUM_FLUCTUATION = 0.15; // Maximum 15% fluctuation allowed

Shopify.functionRunner('cart-transform', (input) => {
  const { cart } = input;
  const output = {
    operations: [],
    errors: [],
  };

  try {
    // Validate each line item with quantum pricing
    cart.lines.forEach((line) => {
      // Skip if no quantum pricing is applied
      const quantumPriceData = line.merchandise?.product?.privateMetafields?.find(
        (m) => m.namespace === 'voidbloom_quantum_config' && m.key === 'pricing'
      );

      if (!quantumPriceData?.value) return;

      try {
        const pricingData = JSON.parse(quantumPriceData.value);
        validateQuantumPrice(line, pricingData, output);
      } catch (e) {
        output.errors.push({
          localizedMessage: 'Invalid quantum price data format',
          target: line.id,
          code: 'INVALID_QUANTUM_PRICE_FORMAT',
        });
      }
    });

    // Apply any coherence adjustments to the cart total
    applyCoherenceAdjustments(cart, output);
  } catch (error) {
    output.errors.push({
      localizedMessage: 'Error validating quantum pricing',
      target: 'cart',
      code: 'QUANTUM_PRICE_VALIDATION_ERROR',
    });
  }

  return output;
});

/**
 * Validates that a line item's quantum price is legitimate
 * @param {Object} line - Cart line item
 * @param {Object} pricingData - Quantum pricing data from metafields
 * @param {Object} output - Output operations/errors object
 */
function validateQuantumPrice(line, pricingData, output) {
  const productId = line.merchandise.product.id;
  const variantId = line.merchandise.id;
  const clientQuantumPrice = line.cost.totalAmount.amount;
  const basePrice = pricingData.base_price;
  const calculationNonce = pricingData.calculation_nonce;
  const timestamp = pricingData.timestamp;

  // Verify the nonce isn't expired (15 minutes max)
  const nonceTimestamp = parseInt(timestamp, 10);
  const currentTime = Date.now();
  if (isNaN(nonceTimestamp) || currentTime - nonceTimestamp > 15 * 60 * 1000) {
    output.errors.push({
      localizedMessage: 'Quantum price calculation expired',
      target: line.id,
      code: 'QUANTUM_PRICE_EXPIRED',
    });
    resetToBasePrice(line, basePrice, output);
    return;
  }

  // Calculate the expected price range
  const minAllowedPrice = basePrice * (1 - MAX_QUANTUM_FLUCTUATION);
  const maxAllowedPrice = basePrice * (1 + MAX_QUANTUM_FLUCTUATION);

  // Check if price is within allowed fluctuation range
  if (clientQuantumPrice < minAllowedPrice || clientQuantumPrice > maxAllowedPrice) {
    output.errors.push({
      localizedMessage: 'Quantum price outside allowed fluctuation range',
      target: line.id,
      code: 'QUANTUM_PRICE_RANGE_VIOLATION',
    });
    resetToBasePrice(line, basePrice, output);
    return;
  }

  // Verify the signature to prevent tampering
  const expectedSignature = generatePriceSignature(
    productId,
    variantId,
    basePrice,
    calculationNonce
  );
  if (pricingData.signature !== expectedSignature) {
    output.errors.push({
      localizedMessage: 'Invalid quantum price signature',
      target: line.id,
      code: 'QUANTUM_PRICE_SIGNATURE_INVALID',
    });
    resetToBasePrice(line, basePrice, output);
    return;
  }

  // Price is valid
}

/**
 * Resets a line item to its base price
 * @param {Object} line - Cart line item
 * @param {number} basePrice - Base price to reset to
 * @param {Object} output - Output operations/errors object
 */
function resetToBasePrice(line, basePrice, output) {
  output.operations.push({
    type: 'ADJUST_LINE_PRICE',
    lineId: line.id,
    price: {
      amount: basePrice.toString(),
      currencyCode: line.cost.totalAmount.currencyCode,
    },
  });
}

/**
 * Generate a cryptographic signature for price validation
 * @param {string} productId - Product ID
 * @param {string} variantId - Variant ID
 * @param {number} basePrice - Base price
 * @param {string} nonce - Unique calculation nonce
 * @returns {string} - Cryptographic signature
 */
function generatePriceSignature(productId, variantId, basePrice, nonce) {
  const data = `${productId}:${variantId}:${basePrice}:${nonce}`;
  return crypto.createHmac('sha256', QUANTUM_PRICE_SECRET).update(data).digest('hex');
}

/**
 * Apply adjustments based on cart coherence
 * @param {Object} cart - Shopping cart
 * @param {Object} output - Output operations/errors object
 */
function applyCoherenceAdjustments(cart, output) {
  // Get coherence data from cart attribute
  const coherenceAttr = cart.attributes.find((attr) => attr.key === 'coherence_metrics');
  if (!coherenceAttr?.value) return;

  try {
    const coherenceData = JSON.parse(coherenceAttr.value);
    const coherenceScore = parseFloat(coherenceData.coherence_score);

    if (isNaN(coherenceScore) || coherenceScore < 0 || coherenceScore > 1) {
      return; // Invalid coherence score
    }

    // Apply discount for high coherence
    if (coherenceScore >= 0.8) {
      const discountPercentage = 0.05; // 5% discount
      const discountAmount = cart.cost.subtotalAmount.amount * discountPercentage;

      output.operations.push({
        type: 'ADD_CART_DISCOUNT',
        cartDiscount: {
          amount: discountAmount.toFixed(2),
          title: 'Quantum Coherence Bonus',
          description: 'High coherence alignment discount',
        },
      });
    }
  } catch (e) {
    // Invalid coherence data format, skip adjustments
  }
}
