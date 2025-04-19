/**
 * Trauma Taxonomy Manager - Admin Extension
 * Entry point for the admin extension
 */

import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import React from 'react';
import ReactDOM from 'react-dom';

// Import core components
import TaxonomyEditor from './components/TaxonomyEditor';
import TaxonomySettings from './components/TaxonomySettings';
import TraumaAnalytics from './components/TraumaAnalytics';

// Import event handlers
import { onOrderCreate, onProductUpdate } from './handlers';

// Initialize admin extension
const TaxonomyManager = {
  // Component registry
  components: {
    TaxonomyEditor,
    TaxonomySettings,
    TraumaAnalytics,
  },

  // Event handler registry
  handlers: {
    onProductUpdate,
    onOrderCreate,
  },

  // Initialize the extension
  initialize(container, context) {
    const { shop, apiKey, interfaceType } = context;

    // Configure AppBridge
    const config = {
      apiKey,
      shopOrigin: shop,
      forceRedirect: true,
    };

    // Determine which component to render based on interface type
    const Component = this.getComponentForInterface(interfaceType);

    if (!Component) {
      console.error(`No component registered for interface type: ${interfaceType}`);
      return;
    }

    // Render the component
    ReactDOM.render(
      <AppBridgeProvider config={config}>
        <AppProvider i18n={enTranslations}>
          <Component context={context} />
        </AppProvider>
      </AppBridgeProvider>,
      container
    );
  },

  // Get the appropriate component for the current interface
  getComponentForInterface(interfaceType) {
    const componentMap = {
      product_details: this.components.TaxonomyEditor,
      settings: this.components.TaxonomySettings,
      analytics: this.components.TraumaAnalytics,
    };

    return componentMap[interfaceType] || null;
  },

  // Handle extension events
  handleEvent(event, data) {
    const handler = this.handlers[event];

    if (handler && typeof handler === 'function') {
      return handler(data);
    }

    console.warn(`No handler registered for event: ${event}`);
    return null;
  },
};

// Export the extension object
export default TaxonomyManager;
