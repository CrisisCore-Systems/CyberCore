# Configuration System

## Overview

The Configuration System is a critical core component of the CyberCore framework, providing a centralized, schema-validated approach to managing application settings across all components. It ensures consistent configuration values, validates changes against schemas, and notifies components of configuration updates.

**Version**: 1.0.0
**Last Updated**: April 30, 2025
**Status**: Production Ready
**Implementation**: `assets/config-manager.js`

## Key Features

The Configuration System offers a comprehensive set of features:

1. **Domain-based Organization**: Configurations are organized by functional domains
2. **Schema Validation**: JSON Schema validation ensures configuration values are valid
3. **Priority Levels**: Configuration changes with different priorities to handle conflicts
4. **Observable Changes**: Components can observe specific configuration changes
5. **Persistent Storage**: Optional persistence of configuration values
6. **Default Values**: Well-defined defaults for all configuration options
7. **NeuralBus Integration**: Configuration events published to the event system
8. **User Preference Support**: Special handling for user-defined preferences

## Architecture

The Configuration System follows a domain-based architecture:

```
ConfigManager
├── Schema Registry
│   ├── Domain Schemas
│   └── Validation Rules
├── Configuration Store
│   ├── Default Values
│   ├── User Values
│   ├── Component Values
│   └── Runtime Values
├── Priority System
│   ├── Priority Levels
│   └── Conflict Resolution
├── Observer System
│   ├── Change Observers
│   └── Observer Notification
└── Persistence Layer
    ├── LocalStorage Adapter
    ├── SessionStorage Adapter
    └── Custom Storage Adapters
```

## Class Definition

The `ConfigManager` class is the main entry point for the configuration system:

```typescript
/**
 * Configuration manager for CyberCore systems
 * Provides centralized configuration management with schema validation
 */
export class ConfigManager {
  /**
   * Create a new configuration manager
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    /* ... */
  }

  /**
   * Register a configuration schema for a domain
   * @param {string} domain - Configuration domain
   * @param {Object} schema - JSON Schema for validation
   * @param {Object} defaults - Default values
   * @returns {boolean} Whether registration was successful
   */
  registerSchema(domain, schema, defaults = {}) {
    /* ... */
  }

  /**
   * Get a configuration value
   * @param {string} domain - Configuration domain
   * @param {string} key - Configuration key
   * @param {any} defaultValue - Default value if not found
   * @returns {any} Configuration value
   */
  get(domain, key, defaultValue = undefined) {
    /* ... */
  }

  /**
   * Set a configuration value
   * @param {string} domain - Configuration domain
   * @param {string} key - Configuration key
   * @param {any} value - Configuration value
   * @param {number} priority - Priority level
   * @returns {boolean} Whether set was successful
   */
  set(domain, key, value, priority = ConfigPriority.DEFAULT) {
    /* ... */
  }

  /**
   * Reset a configuration value to its default
   * @param {string} domain - Configuration domain
   * @param {string} key - Configuration key
   * @returns {boolean} Whether reset was successful
   */
  reset(domain, key) {
    /* ... */
  }

  /**
   * Reset all configuration values in a domain
   * @param {string} domain - Configuration domain
   * @returns {boolean} Whether reset was successful
   */
  resetDomain(domain) {
    /* ... */
  }

  /**
   * Observe configuration changes
   * @param {string} domain - Configuration domain
   * @param {string} key - Configuration key
   * @param {Function} callback - Callback function
   * @returns {Function} Function to remove observer
   */
  observe(domain, key, callback) {
    /* ... */
  }

  /**
   * Get configuration schema
   * @param {string} domain - Configuration domain
   * @returns {Object} JSON Schema for domain
   */
  getSchema(domain) {
    /* ... */
  }

  /**
   * Get all configuration values for a domain
   * @param {string} domain - Configuration domain
   * @returns {Object} Configuration values
   */
  getDomainValues(domain) {
    /* ... */
  }

  /**
   * Set persistence for a domain
   * @param {string} domain - Configuration domain
   * @param {boolean} enabled - Whether persistence is enabled
   * @param {string} storageType - Storage type ('local', 'session', 'custom')
   * @returns {boolean} Whether setting persistence was successful
   */
  setPersistence(domain, enabled, storageType = 'local') {
    /* ... */
  }

  /**
   * Set custom storage adapter
   * @param {Object} adapter - Storage adapter
   * @returns {boolean} Whether adapter was set successfully
   */
  setCustomStorageAdapter(adapter) {
    /* ... */
  }
}
```

## Configuration Domains

The Configuration System organizes settings into logical domains:

```typescript
/**
 * Configuration domains
 * @enum {string}
 */
export const ConfigDomain = {
  /**
   * System-level configuration
   */
  SYSTEM: 'system',

  /**
   * User interface configuration
   */
  USER_INTERFACE: 'ui',

  /**
   * Visualization configuration
   */
  VISUALIZATION: 'visualization',

  /**
   * Performance configuration
   */
  PERFORMANCE: 'performance',

  /**
   * Network configuration
   */
  NETWORK: 'network',

  /**
   * User preferences
   */
  PREFERENCES: 'preferences',

  /**
   * Trauma system configuration
   */
  TRAUMA: 'trauma',

  /**
   * Debugging configuration
   */
  DEBUG: 'debug',
};
```

## Priority Levels

The Configuration System uses priority levels to resolve conflicts:

```typescript
/**
 * Configuration priority levels
 * @enum {number}
 */
export const ConfigPriority = {
  /**
   * Default priority (lowest)
   */
  DEFAULT: 0,

  /**
   * User preference priority
   */
  USER: 100,

  /**
   * Component priority
   */
  COMPONENT: 200,

  /**
   * Performance-related priority
   */
  PERFORMANCE: 300,

  /**
   * Security-related priority
   */
  SECURITY: 400,

  /**
   * System override priority (highest)
   */
  OVERRIDE: 500,
};
```

## Schema Validation

The Configuration System uses JSON Schema for validation:

```javascript
// Example schema registration
configManager.registerSchema(
  ConfigDomain.VISUALIZATION,
  {
    type: 'object',
    properties: {
      particleCount: {
        type: 'number',
        minimum: 0,
        maximum: 10000,
        description: 'Number of particles in the visualization',
      },
      renderQuality: {
        type: 'number',
        minimum: 0.1,
        maximum: 1.0,
        description: 'Rendering quality (0.1 - 1.0)',
      },
      shadowQuality: {
        type: 'string',
        enum: ['none', 'low', 'medium', 'high'],
        description: 'Shadow quality level',
      },
      disabledEffects: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['bloom', 'aberration', 'film', 'glitch', 'noise'],
        },
        description: 'Disabled post-processing effects',
      },
    },
    required: ['particleCount', 'renderQuality'],
    additionalProperties: false,
  },
  // Default values
  {
    particleCount: 2000,
    renderQuality: 1.0,
    shadowQuality: 'medium',
    disabledEffects: [],
  }
);
```

## Usage Examples

### Basic Usage

```javascript
// Import the ConfigManager
import { ConfigManager, ConfigDomain, ConfigPriority } from './assets/config-manager.js';

// Create and configure config manager
const configManager = new ConfigManager({
  debugMode: true,
  defaultPersistence: false,
});

// Register a configuration schema
configManager.registerSchema(
  ConfigDomain.USER_INTERFACE,
  {
    type: 'object',
    properties: {
      theme: {
        type: 'string',
        enum: ['light', 'dark', 'auto'],
        description: 'UI theme',
      },
      fontSize: {
        type: 'number',
        minimum: 8,
        maximum: 32,
        description: 'Base font size in pixels',
      },
    },
  },
  // Default values
  {
    theme: 'auto',
    fontSize: 16,
  }
);

// Get configuration values
const theme = configManager.get(ConfigDomain.USER_INTERFACE, 'theme');
console.log('Current theme:', theme);

// Set configuration values
configManager.set(ConfigDomain.USER_INTERFACE, 'fontSize', 18, ConfigPriority.USER);
```

### Observing Configuration Changes

```javascript
// Observe configuration changes
const removeObserver = configManager.observe(
  ConfigDomain.VISUALIZATION,
  'renderQuality',
  (newValue, oldValue) => {
    console.log(`Render quality changed from ${oldValue} to ${newValue}`);
    updateRenderQuality(newValue);
  }
);

// Later, when no longer needed
removeObserver();
```

### Persisting User Preferences

```javascript
// Enable persistence for user preferences
configManager.setPersistence(ConfigDomain.PREFERENCES, true, 'local');

// Set user preference (will be automatically persisted)
configManager.set(ConfigDomain.PREFERENCES, 'enableNotifications', true, ConfigPriority.USER);

// These settings will survive page reloads
```

### Managing Domain Configuration

```javascript
// Get all values for a domain
const visualizationConfig = configManager.getDomainValues(ConfigDomain.VISUALIZATION);
console.log('Visualization configuration:', visualizationConfig);

// Reset a specific configuration value
configManager.reset(ConfigDomain.VISUALIZATION, 'particleCount');

// Reset an entire domain
configManager.resetDomain(ConfigDomain.DEBUG);
```

### Custom Storage Adapter

```javascript
// Implement a custom storage adapter
const customStorageAdapter = {
  save: (key, value) => {
    // Custom implementation, e.g. saving to a database
    return idbKeyval.set(key, value);
  },
  load: (key) => {
    // Custom implementation, e.g. loading from a database
    return idbKeyval.get(key);
  },
  remove: (key) => {
    // Custom implementation
    return idbKeyval.delete(key);
  },
};

// Set the custom storage adapter
configManager.setCustomStorageAdapter(customStorageAdapter);

// Enable persistence with custom adapter
configManager.setPersistence(ConfigDomain.PREFERENCES, true, 'custom');
```

## Integration with NeuralBus

The Configuration System integrates with NeuralBus for event communication:

### Events Published

- `config:changed` - Configuration value changed
- `config:reset` - Configuration value reset
- `config:schema:registered` - Configuration schema registered

### Events Subscribed To

- `config:request` - Request for configuration values
- `config:set:request` - Request to set configuration value
- `config:reset:request` - Request to reset configuration value

### Example NeuralBus Communication

```javascript
// Example internal implementation
function publishConfigChange(domain, key, newValue, oldValue) {
  if (NeuralBus && typeof NeuralBus.publish === 'function') {
    NeuralBus.publish('config:changed', {
      domain,
      key,
      newValue,
      oldValue,
      timestamp: Date.now(),
    });
  }
}

// Handle config requests from other components
NeuralBus.subscribe('config:request', (data) => {
  const { requestId, domain, key } = data;

  // Get requested value
  const value = this.get(domain, key);

  // Respond with value
  NeuralBus.publish('config:response', {
    requestId,
    domain,
    key,
    value,
    timestamp: Date.now(),
  });
});
```

## Schema Design Best Practices

When designing configuration schemas, follow these best practices:

### 1. Property Definitions

Define properties with clear constraints:

```javascript
// Good property definition
{
  particleCount: {
    type: 'number',
    minimum: 0,
    maximum: 10000,
    multipleOf: 1,  // Integer values only
    description: 'Number of particles in the visualization'
  }
}
```

### 2. Enumerated Values

Use enums for properties with specific allowed values:

```javascript
// Good enum definition
{
  shadowQuality: {
    type: 'string',
    enum: ['none', 'low', 'medium', 'high'],
    description: 'Shadow quality level'
  }
}
```

### 3. Nested Objects

Structure complex configurations as nested objects:

```javascript
// Good nested structure
{
  camera: {
    type: 'object',
    properties: {
      fov: {
        type: 'number',
        minimum: 30,
        maximum: 120,
        description: 'Field of view in degrees'
      },
      position: {
        type: 'object',
        properties: {
          x: { type: 'number' },
          y: { type: 'number' },
          z: { type: 'number' }
        },
        required: ['x', 'y', 'z'],
        description: 'Camera position'
      }
    },
    required: ['fov', 'position'],
    description: 'Camera settings'
  }
}
```

### 4. Array Validation

Define array items with proper validation:

```javascript
// Good array definition
{
  disabledEffects: {
    type: 'array',
    items: {
      type: 'string',
      enum: ['bloom', 'aberration', 'film', 'glitch', 'noise']
    },
    uniqueItems: true,
    maxItems: 5,
    description: 'Disabled post-processing effects'
  }
}
```

## Example Domain Schemas

### Visualization Domain

```javascript
{
  type: 'object',
  properties: {
    particleCount: {
      type: 'number',
      minimum: 0,
      maximum: 10000,
      description: 'Number of particles in the visualization'
    },
    renderQuality: {
      type: 'number',
      minimum: 0.1,
      maximum: 1.0,
      description: 'Rendering quality (0.1 - 1.0)'
    },
    shadowQuality: {
      type: 'string',
      enum: ['none', 'low', 'medium', 'high'],
      description: 'Shadow quality level'
    },
    disabledEffects: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['bloom', 'aberration', 'film', 'glitch', 'noise']
      },
      description: 'Disabled post-processing effects'
    },
    animationThrottleFactor: {
      type: 'number',
      minimum: 0,
      maximum: 1.0,
      description: 'Animation throttling factor (0 = fully throttled, 1 = no throttling)'
    },
    webglFeatures: {
      type: 'object',
      properties: {
        antialiasing: { type: 'boolean' },
        shadows: { type: 'boolean' },
        highDynamicRange: { type: 'boolean' },
        physicallyCorrectLights: { type: 'boolean' }
      },
      description: 'WebGL feature flags'
    }
  },
  required: ['particleCount', 'renderQuality'],
  additionalProperties: false
}
```

### Performance Domain

```javascript
{
  type: 'object',
  properties: {
    autoOptimize: {
      type: 'boolean',
      description: 'Whether to automatically apply performance optimizations'
    },
    sampleRate: {
      type: 'number',
      minimum: 100,
      maximum: 10000,
      description: 'Performance sampling rate in milliseconds'
    },
    fpsHistorySize: {
      type: 'number',
      minimum: 5,
      maximum: 100,
      description: 'Number of FPS samples to keep in history'
    },
    currentOptimizationLevel: {
      type: 'number',
      minimum: 0,
      maximum: 4,
      description: 'Current optimization level'
    },
    thresholds: {
      type: 'object',
      properties: {
        fps: {
          type: 'object',
          properties: {
            optimal: { type: 'number', minimum: 0 },
            acceptable: { type: 'number', minimum: 0 },
            problematic: { type: 'number', minimum: 0 },
            critical: { type: 'number', minimum: 0 }
          },
          description: 'FPS thresholds for optimization levels'
        }
      },
      description: 'Performance thresholds'
    }
  },
  required: ['autoOptimize', 'sampleRate'],
  additionalProperties: false
}
```

## Handling User Preferences

The Configuration System includes special handling for user preferences:

```javascript
// Set user preference with persistence
configManager.setUserPreference = function (key, value) {
  // Ensure preferences domain is registered
  if (!this.hasSchema(ConfigDomain.PREFERENCES)) {
    this.registerSchema(
      ConfigDomain.PREFERENCES,
      {
        type: 'object',
        additionalProperties: true,
      },
      {}
    );

    // Enable persistence for preferences
    this.setPersistence(ConfigDomain.PREFERENCES, true, 'local');
  }

  // Set the preference with user priority
  return this.set(ConfigDomain.PREFERENCES, key, value, ConfigPriority.USER);
};

// Get user preference
configManager.getUserPreference = function (key, defaultValue) {
  return this.get(ConfigDomain.PREFERENCES, key, defaultValue);
};

// Reset user preference
configManager.resetUserPreference = function (key) {
  return this.reset(ConfigDomain.PREFERENCES, key);
};
```

## Internal Implementation Details

### Configuration Value Storage

```javascript
// Example internal implementation
class ConfigManager {
  #schemas = new Map(); // Domain schemas
  #defaults = new Map(); // Default values
  #values = new Map(); // Current values
  #priorities = new Map(); // Priority levels for values
  #observers = new Map(); // Change observers
  #persistence = new Map(); // Persistence settings

  // ...
}
```

### Validation

```javascript
// Example internal implementation
#validateValue(domain, key, value) {
  const schema = this.#schemas.get(domain);
  if (!schema) return false;

  // Use Ajv for validation
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);

  // Create a temporary object with just the key being validated
  const obj = { [key]: value };

  // Validate against the schema
  const valid = validate(obj);

  if (!valid) {
    console.error(`Validation error for ${domain}.${key}:`, validate.errors);
  }

  return valid;
}
```

### Observer Notification

```javascript
// Example internal implementation
#notifyObservers(domain, key, newValue, oldValue) {
  const observerKey = `${domain}.${key}`;
  const observers = this.#observers.get(observerKey) || [];

  for (const observer of observers) {
    try {
      observer(newValue, oldValue);
    } catch (error) {
      console.error(`Error in config observer for ${observerKey}:`, error);
    }
  }
}
```

### Persistence

```javascript
// Example internal implementation
#persistValue(domain, key, value) {
  const persistenceSettings = this.#persistence.get(domain);
  if (!persistenceSettings || !persistenceSettings.enabled) return;

  const storageKey = `cybercore.config.${domain}.${key}`;

  try {
    if (persistenceSettings.type === 'local') {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } else if (persistenceSettings.type === 'session') {
      sessionStorage.setItem(storageKey, JSON.stringify(value));
    } else if (persistenceSettings.type === 'custom' && this.#customStorageAdapter) {
      this.#customStorageAdapter.save(storageKey, value);
    }
  } catch (error) {
    console.error(`Error persisting configuration ${domain}.${key}:`, error);
  }
}
```

## Error Handling

The Configuration System includes robust error handling:

```javascript
// Example error handling for setting values
set(domain, key, value, priority = ConfigPriority.DEFAULT) {
  try {
    // Check if domain exists
    if (!this.#schemas.has(domain)) {
      throw new Error(`Unknown configuration domain: ${domain}`);
    }

    // Validate value against schema
    if (!this.#validateValue(domain, key, value)) {
      throw new Error(`Invalid value for ${domain}.${key}`);
    }

    // Check priority against existing value
    const existingPriority = this.#priorities.get(`${domain}.${key}`) || 0;
    if (existingPriority > priority) {
      console.warn(`Cannot override ${domain}.${key} with lower priority`);
      return false;
    }

    // Get current value for observer notification
    const oldValue = this.get(domain, key);

    // Set new value
    if (!this.#values.has(domain)) {
      this.#values.set(domain, {});
    }
    this.#values.get(domain)[key] = value;

    // Set priority
    this.#priorities.set(`${domain}.${key}`, priority);

    // Persist if needed
    this.#persistValue(domain, key, value);

    // Notify observers
    this.#notifyObservers(domain, key, value, oldValue);

    // Publish event
    this.#publishConfigChange(domain, key, value, oldValue);

    return true;
  } catch (error) {
    console.error(`Error setting configuration ${domain}.${key}:`, error);
    return false;
  }
}
```

## Best Practices

When using the Configuration System, follow these best practices:

### 1. Domain Organization

Organize configuration values into logical domains:

- Use existing domains for common configuration types
- Create new domains for specific components or features
- Avoid overlapping configurations across domains

### 2. Schema Definition

Define clear and comprehensive schemas:

- Include all possible properties with proper validation
- Add descriptive comments for each property
- Set meaningful minimum and maximum values
- Use appropriate data types for values

### 3. Default Values

Provide sensible default values:

- Choose defaults that work for most users
- Consider performance implications of defaults
- Document the reasoning behind default choices
- Test the application with only default values

### 4. Priority Usage

Use priority levels appropriately:

- `DEFAULT`: For initial/default values
- `USER`: For user-selected preferences
- `COMPONENT`: For component-specific settings
- `PERFORMANCE`: For performance-related optimizations
- `SECURITY`: For security-related settings
- `OVERRIDE`: For critical system overrides

### 5. Observer Cleanup

Properly clean up observers to prevent memory leaks:

```javascript
// Store the unsubscribe function
const removeObserver = configManager.observe(
  ConfigDomain.VISUALIZATION,
  'renderQuality',
  updateRenderQuality
);

// Later, when component is destroyed
componentWillUnmount() {
  // Clean up observer
  removeObserver();
}
```

## Known Limitations

The Configuration System has some known limitations:

1. **Schema Complexity**: Very complex nested schemas may impact performance
2. **Storage Limits**: Local/session storage has size limitations (typically 5MB)
3. **Serialization**: Not all JavaScript objects can be properly serialized for persistence
4. **Race Conditions**: Multiple components changing the same value can cause race conditions
5. **Cross-Domain Constraints**: No built-in support for constraints across different domains

## Advanced Features

### Configuration Snapshots

Creating and applying configuration snapshots:

```javascript
// Create a configuration snapshot
function createConfigSnapshot() {
  const snapshot = {};

  // Get all domains
  for (const domain of configManager.getRegisteredDomains()) {
    snapshot[domain] = configManager.getDomainValues(domain);
  }

  return {
    timestamp: Date.now(),
    values: snapshot,
  };
}

// Apply a configuration snapshot
function applyConfigSnapshot(snapshot, priority = ConfigPriority.DEFAULT) {
  const { values } = snapshot;

  for (const domain in values) {
    for (const key in values[domain]) {
      configManager.set(domain, key, values[domain][key], priority);
    }
  }
}
```

### Dynamic Schema Updates

Updating schemas at runtime:

```javascript
// Extend an existing schema
function extendSchema(domain, schemaExtension, additionalDefaults = {}) {
  // Get current schema
  const currentSchema = configManager.getSchema(domain);
  if (!currentSchema) return false;

  // Merge schemas
  const mergedSchema = {
    ...currentSchema,
    properties: {
      ...currentSchema.properties,
      ...schemaExtension.properties,
    },
  };

  // Get current defaults
  const currentDefaults = configManager.getDefaultValues(domain);

  // Merge defaults
  const mergedDefaults = {
    ...currentDefaults,
    ...additionalDefaults,
  };

  // Register updated schema
  return configManager.registerSchema(domain, mergedSchema, mergedDefaults);
}
```

## Conclusion

The Configuration System provides a robust foundation for managing application settings across components in the CyberCore framework. By using a schema-validated approach with priority levels and observable changes, it ensures configuration values remain consistent and valid throughout the application lifecycle.

---

_Generated: April 30, 2025_
