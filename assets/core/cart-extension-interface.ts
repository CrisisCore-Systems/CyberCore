/**
 * CART-EXTENSION-INTERFACE.TS
 * Interface for cart extensions in the CyberCore theme
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 3.0.0
 */

import { CartCore } from './cart-core';

/**
 * Interface for cart extensions
 * Allows for modular functionality to be added to the cart system
 */
export interface CartExtension {
  /**
   * Unique name for the extension
   */
  name: string;

  /**
   * Extension version
   */
  version: string;

  /**
   * Initialize the extension with the cart instance
   * @param cart The cart core instance
   */
  initialize: (cart: typeof CartCore) => void;

  /**
   * Handle cart events
   * @param event The event name
   * @param data Event data
   */
  onEvent?: (event: string, data: any) => void;

  /**
   * Clean up resources when extension is disabled
   */
  dispose?: () => void;
}
