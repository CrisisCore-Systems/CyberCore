/**
 * CART-API.TS
 * Cart API service for VoidBloom theme
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 */

import { safeApiClient } from './safe-api-client';
import { getCsrfToken, sanitizeObject } from './security-utils';

// Types
export interface CartAddItem {
  id: number | string;
  quantity: number;
  properties?: Record<string, any>;
  sellingPlanId?: number | string;
}

export interface CartChangeItem {
  id?: string;
  quantity: number;
  line?: number;
  properties?: Record<string, any>;
}

export interface CartItem {
  id: number;
  key: string;
  quantity: number;
  title: string;
  variant_id: number;
  product_id: number;
  price: number;
  line_price: number;
  original_price: number;
  discounted_price: number;
  properties: Record<string, any>;
  image?: string;
  url?: string;
  handle?: string;
  product_title?: string;
  product_description?: string;
  variant_title?: string;
  options_with_values?: Array<{ name: string; value: string }>;
  quantumProperties?: any;
}

export interface CartData {
  token: string;
  note: string | null;
  attributes: Record<string, any>;
  original_total_price: number;
  total_price: number;
  total_discount: number;
  total_weight: number;
  item_count: number;
  items: CartItem[];
  requires_shipping: boolean;
  currency: string;
  items_subtotal_price: number;
  cart_level_discount_applications: any[];
}

/**
 * Cart API service for interacting with Shopify cart endpoints
 */
class CartApi {
  private readonly endpoints = {
    cartAdd: '/cart/add.js',
    cartUpdate: '/cart/update.js',
    cartChange: '/cart/change.js',
    cartGet: '/cart.js',
    cartClear: '/cart/clear.js',
    cartShippingRates: '/cart/shipping_rates.json',
    cartCount: '/cart/cart_count',
  };

  /**
   * Get the current cart data
   */
  public async getCart(): Promise<CartData> {
    const { data } = await safeApiClient.get<CartData>(this.endpoints.cartGet);
    return data;
  }

  /**
   * Get the number of items in the cart
   */
  public async getCartCount(): Promise<number> {
    const { data } = await safeApiClient.get<{ count: number }>(this.endpoints.cartCount);
    return data.count;
  }

  /**
   * Process a form submission to add items to the cart
   */
  public async processForm(formData: FormData): Promise<CartData> {
    // Convert FormData to object for processing
    const formObject: Record<string, any> = {};
    const properties: Record<string, any> = {};

    formData.forEach((value, key) => {
      if (key.startsWith('properties[') && key.endsWith(']')) {
        // Extract property name from key (e.g., "properties[Color]" -> "Color")
        const propName = key.slice(11, -1);
        properties[propName] = value;
      } else {
        formObject[key] = value;
      }
    });

    // Create cart item from form data
    const cartItem: CartAddItem = {
      id: formObject.id || formObject.variant_id,
      quantity: parseInt(formObject.quantity, 10) || 1,
    };

    // Add properties if any
    if (Object.keys(properties).length > 0) {
      cartItem.properties = properties;
    }

    // Add selling plan if present
    if (formObject.selling_plan) {
      cartItem.sellingPlanId = formObject.selling_plan;
    }

    // Add the item to the cart
    return this.addToCart(cartItem.id, cartItem);
  }

  /**
   * Add an item to the cart
   */
  public async addToCart(
    variantId: string | number,
    options: Partial<CartAddItem> = {}
  ): Promise<CartData> {
    const item: CartAddItem = {
      id: variantId,
      quantity: options.quantity || 1,
      properties: options.properties,
      sellingPlanId: options.sellingPlanId,
    };

    // Add CSRF token
    const secureData = {
      ...sanitizeObject(item),
      csrf_token: getCsrfToken(),
    };

    const { data } = await safeApiClient.post<CartData>(this.endpoints.cartAdd, secureData);

    return data;
  }

  /**
   * Update an item's quantity in the cart
   */
  public async updateItemQuantity(key: string, quantity: number): Promise<CartData> {
    const secureData = {
      id: key,
      quantity,
      csrf_token: getCsrfToken(),
    };

    const { data } = await safeApiClient.post<CartData>(this.endpoints.cartChange, secureData);

    return data;
  }

  /**
   * Update multiple cart items at once
   */
  public async updateCart(
    updates: Record<string, number>,
    note?: string,
    attributes?: Record<string, any>
  ): Promise<CartData> {
    const secureData = {
      updates: sanitizeObject(updates),
      note,
      attributes: attributes ? sanitizeObject(attributes) : undefined,
      csrf_token: getCsrfToken(),
    };

    const { data } = await safeApiClient.post<CartData>(this.endpoints.cartUpdate, secureData);

    return data;
  }

  /**
   * Change a cart item (update quantity, properties, etc.)
   */
  public async changeItem(options: CartChangeItem): Promise<CartData> {
    const secureData = {
      ...sanitizeObject(options),
      csrf_token: getCsrfToken(),
    };

    const { data } = await safeApiClient.post<CartData>(this.endpoints.cartChange, secureData);

    return data;
  }

  /**
   * Remove an item from the cart
   */
  public async removeItem(key: string): Promise<CartData> {
    return this.updateItemQuantity(key, 0);
  }

  /**
   * Clear all items from the cart
   */
  public async clearCart(): Promise<CartData> {
    const secureData = {
      csrf_token: getCsrfToken(),
    };

    const { data } = await safeApiClient.post<CartData>(this.endpoints.cartClear, secureData);

    return data;
  }

  /**
   * Get shipping rates for the current cart
   */
  public async getShippingRates(
    zipCode: string,
    countryCode: string,
    provinceCode?: string
  ): Promise<any> {
    const params = {
      shipping_address: {
        zip: zipCode,
        country: countryCode,
        province: provinceCode,
      },
    };

    const { data } = await safeApiClient.get(this.endpoints.cartShippingRates, { params });

    return data;
  }

  /**
   * Add multiple items to the cart
   */
  public async addItems(items: CartAddItem[]): Promise<CartData> {
    // Process items sequentially to ensure they're all added correctly
    let cartData: CartData | null = null;

    for (const item of items) {
      cartData = await this.addToCart(item.id, item);
    }

    return cartData!;
  }
}

// Create and export a singleton instance
export const cartApi = new CartApi();
export default cartApi;
