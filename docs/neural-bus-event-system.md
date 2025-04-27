# Neural Bus Event System

## Overview

The Neural Bus Event System is a core component of CyberCore that facilitates interdimensional message transport between disparate components through trauma-encoded channels. It functions as a central event bus that enables decoupled communication between different parts of the application.

Version: 2.0.0
Last Updated: April 27, 2025

## Key Features

- Publish/subscribe event system
- Component registration and discovery
- Event filtering and routing
- Secure component registration with nonce-based authentication
- TypeScript implementation with strong typing

## Architecture

The Neural Bus Event System is implemented as a singleton that provides communication services across the entire CyberCore ecosystem:

```
Neural Bus Event System
├── Core Functionality
│   ├── Component Registration
│   ├── Event Subscription
│   ├── Event Publication
│   └── Component Deregistration
├── Data Structures
│   ├── Connected Components Registry
│   ├── Event Subscription Maps
│   └── Event Channel Registry
├── Security Features
│   ├── Nonce Generation
│   └── Registration Validation
├── Integration Points
│   ├── Global Scope Availability
│   ├── Module Export
│   └── TypeScript Type Definitions
└── Event Taxonomy
    ├── System Events
    ├── Component Events
    ├── User Interaction Events
    └── Trauma Events
```

## Core Concepts

### Event System

The Neural Bus provides a centralized publish/subscribe (pub/sub) system where:

- **Publishers** send messages to specific named channels without knowledge of subscribers
- **Subscribers** register interest in specific channels and receive notifications when events occur
- **Events** consist of a name and optional data payload

### Component Registration

Components register with the Neural Bus to:

1. Announce their presence to the system
2. Declare their capabilities
3. Specify which event channels they participate in
4. Receive a security nonce for later identification

### Event Channels

The system organizes communication through named event channels:

| Channel Prefix | Purpose                       | Example Events                                    |
| -------------- | ----------------------------- | ------------------------------------------------- |
| `component:`   | Component lifecycle events    | `component:registered`, `component:ready`         |
| `trauma:`      | Trauma-related visual effects | `trauma:activated`, `trauma:intensity`            |
| `cart:`        | Shopping cart operations      | `cart:item-added`, `cart:checkout`                |
| `quantum:`     | Quantum effects and mutations | `quantum:mutation`, `quantum:entanglement`        |
| `performance:` | Performance monitoring        | `performance:metrics`, `performance:optimization` |
| `render:`      | Rendering events              | `render:frame`, `render:complete`                 |
| `user:`        | User interactions             | `user:click`, `user:hover`                        |

## Implementation Details

### Initialization

The Neural Bus initializes automatically when imported and is available as a singleton:

```typescript
import { NeuralBus } from './assets/neural-bus';

// No need to initialize - already done by the singleton
```

### Component Registration

Components register with the Neural Bus to participate in the event system:

```typescript
// Register a component with capabilities
const { nonce } = NeuralBus.register('hologram-component', {
  version: '1.0.0',
  capabilities: {
    rendering: true,
    traumaEffects: true,
  },
  channels: ['trauma', 'render', 'quantum'],
});

// Store nonce for later deregistration
this.registrationNonce = nonce;
```

### Publishing Events

Components can publish events to notify interested subscribers:

```typescript
// Publish an event with data
NeuralBus.publish('trauma:activated', {
  type: 'abandonment',
  intensity: 0.8,
  source: 'product-card',
});

// Publish an event without data
NeuralBus.publish('component:ready');
```

### Subscribing to Events

Components can subscribe to events to receive notifications:

```typescript
// Subscribe to an event
const unsubscribe = NeuralBus.subscribe('trauma:activated', (data) => {
  // Handle the event
  console.log('Trauma activated:', data);

  // Apply visual effects based on trauma type
  if (data.type === 'abandonment') {
    // Apply abandonment effects
  }
});

// Later, unsubscribe when no longer needed
unsubscribe();
```

### Component Deregistration

Components should unregister when they are no longer active:

```typescript
// Unregister component when it's removed
NeuralBus.unregister('hologram-component', this.registrationNonce);
```

## API Reference

### Core Methods

#### `initialize()`

Initializes the NeuralBus system (automatically called by the singleton).

**Returns:** NeuralBusInterface for method chaining

#### `register(componentName, info)`

Registers a component with the NeuralBus.

**Parameters:**

- `componentName` (string) - Unique identifier for the component
- `info` (ComponentRegistration) - Registration information and capabilities
  - `version` (string) - Component version
  - `capabilities` (Record<string, boolean>, optional) - Component capabilities
  - `channels` (string[], optional) - Event channels the component participates in

**Returns:** Object containing the registration nonce

```typescript
interface ComponentRegistration {
  version: string;
  capabilities?: Record<string, boolean>;
  channels?: string[];
}
```

#### `unregister(componentName, nonce)`

Unregisters a component from the NeuralBus.

**Parameters:**

- `componentName` (string) - Name of the component to unregister
- `nonce` (string) - Security token from registration

#### `deregister(componentName, nonce)`

Alias for unregister - removes a component from the NeuralBus.

**Parameters:**

- `componentName` (string) - Name of the component to deregister
- `nonce` (string) - Security token from registration

#### `subscribe(eventName, callback)`

Subscribes to an event on the NeuralBus.

**Parameters:**

- `eventName` (string) - Name of the event to subscribe to
- `callback` (EventCallback) - Function to call when event is published

**Returns:** Function to unsubscribe from the event

```typescript
interface EventCallback<T = unknown> {
  (data: T, eventObj?: Record<string, unknown>): void;
}
```

#### `publish(eventName, data)`

Publishes an event to all subscribers.

**Parameters:**

- `eventName` (string) - Name of the event to publish
- `data` (unknown, optional) - Data to pass to subscribers

### Properties

#### `connectedComponents`

Map of all components currently connected to the NeuralBus.

**Type:** Map<string, ComponentRegistration>

## Event Taxonomy

The Neural Bus uses a structured event taxonomy to organize communication. Here are the standard event channels and their purposes:

### System Events

| Event                   | Description                    | Data Structure                                    |
| ----------------------- | ------------------------------ | ------------------------------------------------- |
| `system:initialized`    | System has been initialized    | `{ timestamp: number }`                           |
| `system:error`          | System-level error occurred    | `{ code: string, message: string, details: any }` |
| `system:config-updated` | Configuration has been updated | `{ config: Record<string, any> }`                 |

### Component Events

| Event                  | Description              | Data Structure                      |
| ---------------------- | ------------------------ | ----------------------------------- |
| `component:registered` | Component has registered | `{ name: string, version: string }` |
| `component:ready`      | Component is ready       | `{ name: string }`                  |
| `component:error`      | Component error occurred | `{ name: string, error: Error }`    |

### Trauma Events

| Event                      | Description               | Data Structure                                                   |
| -------------------------- | ------------------------- | ---------------------------------------------------------------- |
| `trauma:activated`         | Trauma effect activated   | `{ type: string, intensity: number, source: string }`            |
| `trauma:deactivated`       | Trauma effect deactivated | `{ type: string, source: string }`                               |
| `trauma:intensity-changed` | Trauma intensity changed  | `{ type: string, intensity: number, previousIntensity: number }` |

### Rendering Events

| Event             | Description         | Data Structure                              |
| ----------------- | ------------------- | ------------------------------------------- |
| `render:frame`    | New frame rendered  | `{ timestamp: number, frameIndex: number }` |
| `render:complete` | Rendering completed | `{ duration: number }`                      |
| `render:error`    | Rendering error     | `{ message: string, context: any }`         |

### Cart Events

| Event                   | Description              | Data Structure                           |
| ----------------------- | ------------------------ | ---------------------------------------- |
| `cart:item-added`       | Item added to cart       | `{ product: Product, quantity: number }` |
| `cart:item-removed`     | Item removed from cart   | `{ product: Product, quantity: number }` |
| `cart:updated`          | Cart contents updated    | `{ items: CartItem[], total: number }`   |
| `cart:checkout-started` | Checkout process started | `{ cart: Cart }`                         |

### Quantum Events

| Event                  | Description                      | Data Structure                                         |
| ---------------------- | -------------------------------- | ------------------------------------------------------ |
| `quantum:mutation`     | Quantum mutation occurred        | `{ type: string, target: string, parameters: any }`    |
| `quantum:entanglement` | Quantum entanglement established | `{ source: string, target: string, strength: number }` |
| `quantum:collapse`     | Quantum state collapsed          | `{ source: string, state: any }`                       |

### Performance Events

| Event                              | Description                      | Data Structure                                         |
| ---------------------------------- | -------------------------------- | ------------------------------------------------------ |
| `performance:metrics`              | Performance metrics updated      | `{ fps: number, memory: number, cpu: number }`         |
| `performance:optimization-applied` | Performance optimization applied | `{ level: number, strategies: string[] }`              |
| `performance:threshold-exceeded`   | Performance threshold exceeded   | `{ metric: string, value: number, threshold: number }` |

## Integration with Other Systems

### Performance Monitoring Integration

The Neural Bus integrates with the Performance Monitoring System to:

- Publish performance metrics as events
- Measure event processing latency
- Adapt to performance optimization requirements

### Error Handling Integration

The Neural Bus integrates with the Error Handling System to:

- Report event processing errors
- Provide error context for debugging
- Support fault-tolerant event delivery

### Configuration System Integration

The Neural Bus integrates with the Configuration System to:

- Apply configuration to event processing
- Enable/disable specific event channels
- Configure event priorities

## Best Practices

### Component Registration

1. Register components early in their lifecycle
2. Store the registration nonce securely
3. Include version information for compatibility checks
4. Specify capabilities for discoverability
5. Unregister components when they are destroyed

### Event Publishing

1. Use consistent naming conventions
2. Include source information in event data
3. Keep event data immutable
4. Validate data before publishing
5. Consider event frequency and performance impact

### Event Subscription

1. Subscribe to specific events rather than broad patterns
2. Keep event handlers lightweight
3. Unsubscribe when components are destroyed
4. Handle errors within event callbacks
5. Consider using debounce for high-frequency events

## Troubleshooting

### Common Issues

#### Events Not Being Received

**Symptoms:**

- Component not responding to events
- No errors in console

**Solutions:**

- Verify event name matches exactly (check for typos)
- Confirm subscriber is registered before event is published
- Check if unsubscribe was accidentally called

#### Memory Leaks

**Symptoms:**

- Increasing memory usage
- Event handlers continue to fire after component removal

**Solutions:**

- Ensure all components unregister and unsubscribe
- Store unsubscribe functions and call them during cleanup
- Check for circular references in event data

#### Performance Issues

**Symptoms:**

- High event latency
- UI responsiveness issues during event storms

**Solutions:**

- Use debounce/throttle for high-frequency events
- Keep event handlers lightweight
- Consider reducing event frequency
- Break up large data payloads

## Example Usage Scenarios

### Basic Component Communication

```typescript
// Component A publishes an event
NeuralBus.publish('product:selected', { id: '123', name: 'Quantum Artifact' });

// Component B subscribes to receive the event
NeuralBus.subscribe('product:selected', (product) => {
  console.log(`Product selected: ${product.name}`);
  // Update UI or state based on selection
});
```

### Trauma System Integration

```typescript
// Register component with trauma capability
NeuralBus.register('product-display', {
  version: '1.2.0',
  capabilities: { traumaEffects: true },
  channels: ['trauma'],
});

// Subscribe to trauma events
NeuralBus.subscribe('trauma:activated', (data) => {
  if (data.type === 'fragmentation') {
    // Apply fragmentation visual effects
    applyFragmentationEffect(data.intensity);
  }
});

// Publish trauma activation
function activateTrauma(traumaType, intensity) {
  NeuralBus.publish('trauma:activated', {
    type: traumaType,
    intensity: intensity,
    source: 'user-action',
  });
}
```

### Component Lifecycle Management

```typescript
class HologramComponent extends HTMLElement {
  private registrationNonce: string;

  connectedCallback() {
    // Register when component is connected to DOM
    const { nonce } = NeuralBus.register('hologram-component', {
      version: '1.0.0',
      capabilities: { rendering: true },
      channels: ['render', 'quantum'],
    });

    this.registrationNonce = nonce;

    // Notify system that component is ready
    NeuralBus.publish('component:ready', { name: 'hologram-component' });

    // Subscribe to relevant events
    this.unsubscribeRender = NeuralBus.subscribe('render:frame', this.onRenderFrame.bind(this));
    this.unsubscribeQuantum = NeuralBus.subscribe(
      'quantum:mutation',
      this.onQuantumMutation.bind(this)
    );
  }

  disconnectedCallback() {
    // Clean up when component is removed from DOM
    this.unsubscribeRender();
    this.unsubscribeQuantum();
    NeuralBus.unregister('hologram-component', this.registrationNonce);
  }

  onRenderFrame(frameData) {
    // Handle render frame event
  }

  onQuantumMutation(mutationData) {
    // Handle quantum mutation event
  }
}
```

## Conclusion

The Neural Bus Event System provides a robust foundation for component communication in the CyberCore framework. By implementing a decoupled architecture through events, components can interact without direct dependencies, promoting modularity and maintainability.

For more information about integration with other CyberCore systems, refer to the related documentation files in the `docs` directory.
