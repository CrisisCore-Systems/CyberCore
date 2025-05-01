# Neural Bus Subscription Management

## Overview

The Neural Bus system uses a publish/subscribe pattern for communication between components. To prevent memory leaks, it's essential to properly manage subscriptions and component registration.

## Common Issues

Memory leaks often occur when:

- Components subscribe to events but don't unsubscribe when destroyed
- Components register with the Neural Bus but don't unregister
- References to destroyed components are held in subscription callbacks

## Best Practices

### Using the SubscriptionManager

The `SubscriptionManager` class provides a clean way to manage Neural Bus subscriptions:

```javascript
import { SubscriptionManager } from '../src/utils/subscription-manager';

class MyComponent {
  constructor() {
    this.subscriptions = new SubscriptionManager('my-component');

    // Register with Neural Bus
    this.subscriptions.register({
      version: '1.0.0',
      capabilities: {
        myFeature: true,
      },
    });

    // Subscribe to events
    this.subscriptions.subscribe('system:ready', this.handleSystemReady.bind(this));
    this.subscriptions.subscribe('user:interaction', this.handleUserInteraction.bind(this));
  }

  // IMPORTANT: Clean up when component is destroyed
  destroy() {
    this.subscriptions.cleanup();
  }
}
```

### For React Components

```jsx
import React from 'react';
import { SubscriptionManager } from '../src/utils/subscription-manager';

class MyReactComponent extends React.Component {
  componentDidMount() {
    this.subscriptions = new SubscriptionManager('my-react-component');

    this.subscriptions
      .register({ version: '1.0.0' })
      .subscribe('event:name', this.handleEvent.bind(this));
  }

  componentWillUnmount() {
    // Clean up subscriptions
    this.subscriptions.cleanup();
  }

  handleEvent(data) {
    // Handle event
  }

  render() {
    return <div>My Component</div>;
  }
}
```

### For Vue Components

```javascript
export default {
  name: 'MyComponent',

  data() {
    return {
      subscriptions: new SubscriptionManager('my-vue-component'),
    };
  },

  created() {
    this.subscriptions.register({ version: '1.0.0' }).subscribe('event:name', this.handleEvent);
  },

  beforeDestroy() {
    this.subscriptions.cleanup();
  },

  methods: {
    handleEvent(data) {
      // Handle event
    },
  },
};
```

## Manual Subscription Management

If you need to manage subscriptions manually:

```javascript
// When subscribing, store the subscription ID
const subscriptionId = NeuralBus.subscribe('event:name', callback);

// When unsubscribing, use the ID
NeuralBus.unsubscribe(subscriptionId);

// When registering, store the nonce
const { nonce } = NeuralBus.register('component-name', info);

// When unregistering, use the component name and nonce
NeuralBus.unregister('component-name', nonce);
```

## Testing Subscription Management

To verify your components are properly cleaning up subscriptions:

1. Create and destroy your component multiple times
2. Monitor memory usage in the browser's dev tools
3. Check for warnings in the console about events being delivered to destroyed components
4. Use browser profiling to check for retained references
