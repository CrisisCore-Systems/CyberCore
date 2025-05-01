# Neural Bus Best Practices

## Subscription Management

### The Memory Leak Problem

One common issue with event-based communication systems is memory leaks caused by forgotten subscriptions. When components subscribe to events but don't unsubscribe when they're destroyed, the subscriptions remain active, leading to:

1. Memory leaks as subscription references are held indefinitely
2. Errors when events trigger callbacks on destroyed components
3. Performance degradation as unnecessary event processing occurs

### Solution: Proper Subscription Lifecycle Management

#### Recommended Pattern

Always follow this pattern for Neural Bus integration:

1. **Registration**: Register your component when it initializes
2. **Subscription**: Keep track of all subscription IDs
3. **Cleanup**: Unsubscribe from all events and unregister when component is destroyed

#### Using the Subscription Manager

The `NeuralBusSubscriptionManager` class provides a clean way to manage Neural Bus subscriptions:

```javascript
import { NeuralBusSubscriptionManager } from '../utils/neural-bus-extensions';

class MyComponent {
  constructor() {
    // Create a subscription manager for this component
    this.neuralBus = new NeuralBusSubscriptionManager('my-component');
  }

  initialize() {
    // Register with Neural Bus
    this.neuralBus.register({
      version: '1.0.0',
      capabilities: {
        myFeature: true,
      },
    });

    // Subscribe to events (chained API)
    this.neuralBus
      .subscribe('event:one', this.handleEventOne.bind(this))
      .subscribe('event:two', this.handleEventTwo.bind(this));
  }

  // ...component logic...

  destroy() {
    // Clean up all subscriptions and unregister
    this.neuralBus.cleanup();
  }
}
```

#### For Framework Components

If you're using a UI framework like React or Vue:

**React Components**:

```jsx
import { withNeuralBus } from '../utils/neural-bus-extensions';

class MyComponent extends React.Component {
  handleEvent(data) {
    console.log('Event received:', data);
  }

  componentDidMount() {
    // props.neuralBus is provided by the withNeuralBus HOC
    this.props.neuralBus.subscribe('my:event', this.handleEvent.bind(this));
  }

  render() {
    return <div>My Component</div>;
  }
}

// The HOC handles registration and cleanup automatically
export default withNeuralBus(MyComponent, 'my-component', { version: '1.0.0' });
```

**Vue Components**:

```javascript
export default {
  name: 'MyComponent',

  data() {
    return {
      neuralBus: new NeuralBusSubscriptionManager('my-component'),
    };
  },

  created() {
    this.neuralBus.register({ version: '1.0.0' });
    this.neuralBus.subscribe('my:event', this.handleEvent);
  },

  beforeDestroy() {
    this.neuralBus.cleanup();
  },

  methods: {
    handleEvent(data) {
      console.log('Event received:', data);
    },
  },
};
```

## Subscription Debugging

To debug subscription issues:

```javascript
// Check if a component is still registered
console.log(NeuralBus.connectedComponents);

// Examine current subscriptions
console.log(NeuralBus.subscriptions);
```

## Testing Neural Bus Integration

When testing components that use the Neural Bus:

```javascript
// Mock the Neural Bus in your tests
const mockNeuralBus = {
  subscribe: jest.fn(),
  publish: jest.fn(),
  register: jest.fn(() => ({ nonce: 'test-nonce' })),
  unsubscribe: jest.fn(),
  unregister: jest.fn(),
};

// Test subscription cleanup
test('should clean up subscriptions on destroy', () => {
  const component = new MyComponent();
  component.neuralBus = mockNeuralBus;

  component.initialize();
  expect(mockNeuralBus.register).toHaveBeenCalled();
  expect(mockNeuralBus.subscribe).toHaveBeenCalledTimes(2);

  component.destroy();
  expect(mockNeuralBus.unsubscribe).toHaveBeenCalled();
  expect(mockNeuralBus.unregister).toHaveBeenCalled();
});
```

## Performance Considerations

- Use targeted event names rather than wildcard patterns
- Keep event payloads small and serializable
- Consider using event throttling for high-frequency events
