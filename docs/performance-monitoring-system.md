# Performance Monitoring System

## Overview

The Performance Monitoring System is a core component of CyberCore that tracks application performance metrics in real-time and dynamically applies optimizations to maintain smooth operation across various device capabilities.

Version: 2.0.0
Last Updated: April 27, 2025

## Key Features

- Real-time performance metrics tracking
- Automatic performance optimization
- Configurable optimization strategies
- Component and transaction performance measurement
- Event latency tracking
- Integration with NeuralBus for performance events

## Architecture

The Performance Monitoring System follows a singleton pattern and integrates with other core CyberCore systems:

```
Performance Monitoring System
├── Metrics Tracking
│   ├── FPS Monitoring
│   ├── Memory Usage Tracking
│   ├── Render Time Measurement
│   ├── CPU Usage Estimation
│   └── Event Latency Tracking
├── Optimization Strategies
│   ├── Particle Reduction
│   ├── Quality Adjustment
│   ├── Effect Disabling
│   └── Trauma Intensity Reduction
├── Component Performance
│   ├── Operation Timing
│   └── Statistics Collection
├── Integration Points
│   ├── ConfigManager Integration
│   ├── ErrorHandler Integration
│   └── NeuralBus Integration
└── API Surface
    ├── Measurement API
    ├── Optimization API
    └── Reporting API
```

## Core Concepts

### Performance Metrics

The system tracks several key performance metrics:

| Metric Type         | Description               | Optimal Values | Critical Values |
| ------------------- | ------------------------- | -------------- | --------------- |
| FPS                 | Frames per second         | >55            | <10             |
| CPU                 | CPU utilization           | <30%           | >90%            |
| Memory              | Memory usage              | <100MB         | >500MB          |
| Render Time         | Frame render time         | <10ms          | >50ms           |
| Event Latency       | Event processing time     | <10ms          | >100ms          |
| Component Execution | Component operation time  | <16ms          | >50ms           |
| Transaction         | Business transaction time | Varies         | Varies          |

### Optimization Levels

The system defines progressive optimization levels:

| Level | Name     | Description              | When Applied                  |
| ----- | -------- | ------------------------ | ----------------------------- |
| 0     | NONE     | No optimization          | Default state                 |
| 1     | LOW      | Minimal optimizations    | At 70% of critical thresholds |
| 2     | MEDIUM   | Balanced optimizations   | At 80% of critical thresholds |
| 3     | HIGH     | Aggressive optimizations | At 90% of critical thresholds |
| 4     | CRITICAL | Maximum optimizations    | At critical thresholds        |

### Optimization Strategies

The system applies several optimization strategies based on the current level:

| Strategy                | Description                     | Effect                              |
| ----------------------- | ------------------------------- | ----------------------------------- |
| REDUCE_PARTICLES        | Reduces particle count          | Decreases GPU/CPU load              |
| LOWER_QUALITY           | Lowers render quality           | Reduces rendering complexity        |
| DISABLE_EFFECTS         | Disables visual effects         | Eliminates expensive shader effects |
| REDUCE_TRAUMA_INTENSITY | Reduces trauma effect intensity | Decreases animation complexity      |
| REDUCE_POLLING          | Reduces event polling frequency | Decreases CPU load                  |
| BATCH_UPDATES           | Batches DOM updates             | Improves rendering performance      |
| DEFER_PROCESSING        | Defers non-critical operations  | Spreads computation over time       |

## Performance Optimization Lifecycle

The following flowchart illustrates the complete lifecycle of performance monitoring and optimization in the CyberCore system:

```
┌──────────────────────┐
│  Initialize System   │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│  Start Monitoring    │◄────────────────┐
└──────────┬───────────┘                 │
           ▼                             │
┌──────────────────────┐                 │
│  Collect Metrics     │                 │
└──────────┬───────────┘                 │
           ▼                             │
┌──────────────────────┐                 │
│ Process & Analyze    │                 │
└──────────┬───────────┘                 │
           ▼                             │
┌──────────────────────┐     No          │
│ Performance Issues?  ├─────────────────┘
└──────────┬───────────┘
           │ Yes
           ▼
┌──────────────────────┐
│ Determine Required   │
│ Optimization Level   │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ Apply Optimization   │
│ Strategies           │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ Notify Components    │
│ via NeuralBus        │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ Components Apply     │
│ Optimizations        │
└──────────┬───────────┘
           ▼
┌──────────────────────┐     No
│ Continue Monitoring  ├────────┐
└──────────┬───────────┘        │
           │ Yes                │
           ▼                    ▼
┌──────────────────────┐    ┌───────────────────┐
│ Has Performance      │ No │ Keep Current      │
│ Improved?            ├────►Optimizations      │
└──────────┬───────────┘    └────────┬──────────┘
           │ Yes                     │
           ▼                         │
┌──────────────────────┐             │
│ Is Performance       │ No          │
│ Above Threshold?     ├─────────────┘
└──────────┬───────────┘
           │ Yes
           ▼
┌──────────────────────┐
│ Gradually Reduce     │
│ Optimizations        │
└──────────┬───────────┘
           │
           └───────────► (Return to Start Monitoring)
```

### Key Decision Points

The optimization lifecycle includes several key decision points:

1. **Performance Issues Detection**: Based on performance metrics compared against thresholds.

2. **Optimization Level Determination**: Based on how severely thresholds are violated.

3. **Optimization Strategy Selection**: Based on the determined optimization level and the performance metrics that are most problematic.

4. **Optimization Effectiveness Evaluation**: Checking if applied optimizations improved performance.

5. **Recovery Assessment**: Determining when it's safe to reduce optimization levels.

### Optimization Strategy Application Order

When applying optimization strategies, the system follows this order:

1. **Non-Visual Optimizations First**:

   - Reduce polling frequency
   - Batch updates
   - Defer processing

2. **Minor Visual Optimizations**:

   - Reduce particle count
   - Lower animation complexity

3. **Major Visual Optimizations**:
   - Lower rendering quality
   - Disable effects
   - Reduce trauma intensity

This order ensures that non-visual optimizations are attempted before visual quality is impacted.

### Recovery Process

The recovery process is gradual and follows these steps:

1. Performance metrics must be consistently above recovery thresholds for a sustained period (default: 5 seconds).

2. Optimization level is reduced by one step (e.g., HIGH → MEDIUM).

3. The system continues monitoring for a stability period (default: 3 seconds).

4. If performance remains good during the stability period, the process repeats until optimization level returns to NONE.

5. If performance degrades during recovery, the system immediately reverts to the higher optimization level.

This approach prevents oscillation between optimization levels and ensures a smooth user experience.

## Implementation Details

### Initialization

The Performance Monitoring System initializes with the following steps:

1. Set up configuration defaults
2. Connect to dependent systems (ConfigManager, ErrorHandler)
3. Initialize metrics storage
4. Connect to NeuralBus for event communication
5. Register with ConfigManager using proper schema
6. Set up performance monitoring hooks
7. Start monitoring when page has loaded

```javascript
// Example initialization
const performanceMonitor = new PerformanceMonitor({
  sampleRate: 1000, // Sample metrics every second
  autoOptimize: true, // Automatically apply optimizations
  debugMode: false, // Disable debug logging
});

// Start monitoring
performanceMonitor.start();
```

### Metrics Collection

The system collects metrics through several mechanisms:

1. **FPS Tracking**: Hooks into requestAnimationFrame to track frame rates
2. **Memory Tracking**: Uses performance.memory API when available
3. **Render Time**: Measures time between animation frames
4. **Component Performance**: Provides measurement API for components
5. **Event Latency**: Tracks event processing time through hooks

### Optimization Process

When performance issues are detected, the system:

1. Analyzes current metrics against thresholds
2. Determines required optimization level
3. Applies optimization strategies appropriate for the level
4. Notifies components of optimization changes
5. Continues monitoring to adjust or roll back optimizations

### Component Performance Measurement

Components can measure their performance:

```javascript
// Measure component operation performance
const endMeasure = performanceMonitor.startMeasure('cart-component', 'addProduct');

// Perform operation
// ...

// End measurement and get duration
const duration = endMeasure();
```

### Transaction Measurement

Business transactions can be measured:

```javascript
// Start measuring a transaction
const endTransaction = performanceMonitor.startTransaction('checkout-flow');

// Perform transaction steps
// ...

// End transaction and get duration
const duration = endTransaction();
```

## Implementation Variants

The CyberCore project includes two different implementations of the performance monitoring system, each designed for specific use cases:

### 1. Full PerformanceMonitor Class

Located in `src/performance/performance-monitor.js`, this is the complete implementation with all features:

- Comprehensive metrics collection (FPS, memory, CPU, event latency)
- Integration with NeuralBus
- Multi-level optimization strategies
- Component-level performance tracking
- Transaction time monitoring
- Automatic optimization application

This implementation is designed for the main application thread and should be used in most scenarios. It's automatically initialized when the CyberCore system starts.

```javascript
// Using the full PerformanceMonitor
import { PerformanceMonitor } from '../src/performance/performance-monitor';

// The system is already initialized, but you can access it:
const monitor = PerformanceMonitor.getInstance();

// Register a component for monitoring
monitor.registerComponent('my-component', {
  optimizationLevels: {
    LOW: () => {
      /* optimization logic */
    },
    MEDIUM: () => {
      /* optimization logic */
    },
    HIGH: () => {
      /* optimization logic */
    },
  },
});

// Track a transaction
monitor.startTransaction('data-processing');
// ... perform work
monitor.endTransaction('data-processing');
```

### 2. Lightweight Performance Utility

Located in `snippets/performance-monitor.js`, this is a simplified implementation designed for:

- Inclusion in specific contexts like iframes or web workers
- Lower overhead for less powerful devices
- Focused monitoring of specific metrics without the full system overhead

This lightweight implementation provides core monitoring functionality without the advanced features of the full system:

```javascript
// Using the lightweight performance utility
import { performanceUtil } from '../snippets/performance-monitor';

// Initialize the utility
performanceUtil.init({
  reportingFrequency: 2000, // ms
  targetFPS: 30,
});

// Start monitoring
performanceUtil.start();

// Get current metrics
const metrics = performanceUtil.getMetrics();
console.log(`Current FPS: ${metrics.fps}`);

// Stop monitoring when done
performanceUtil.stop();
```

### When to Use Each Implementation

- **Use the full PerformanceMonitor** for:

  - Main application thread
  - When you need automatic optimization
  - Complex applications with many components
  - When integration with other CyberCore systems is required

- **Use the lightweight utility** for:
  - Web workers
  - Iframes
  - Simple components with minimal optimization needs
  - When you need to minimize performance overhead
  - Embedded contexts where the full CyberCore system isn't available

### Communication Between Implementations

The lightweight utility can communicate with the main PerformanceMonitor through postMessage or by using the NeuralBus bridge:

```javascript
// In a web worker using the lightweight utility
import { performanceUtil } from '../snippets/performance-monitor';
import { NeuralBusBridge } from '../src/messaging/neural-bus-bridge';

// Initialize
performanceUtil.init();

// Set up communication
performanceUtil.onMetricsCollected = (metrics) => {
  // Send to main thread
  NeuralBusBridge.publish('performance.metrics.worker', metrics);
};
```

The main PerformanceMonitor will automatically aggregate metrics from all registered sources when making optimization decisions.

## Integration with Other Systems

### ConfigManager Integration

The Performance Monitoring System registers with the ConfigManager to:

- Store and retrieve configuration
- Observe configuration changes
- Apply priority-based configuration overrides

### ErrorHandler Integration

The system uses the ErrorHandler to:

- Report errors during optimization
- Log warnings about performance issues
- Ensure stable operation even during performance problems

### NeuralBus Integration

The system integrates with NeuralBus to:

- Publish performance metrics
- Notify about performance optimizations
- Respond to performance monitoring requests
- Subscribe to component events

## Integration with the Trauma System

The Performance Monitoring System works closely with the Trauma System to maintain optimal performance during intensive visual effects while preserving the core atmosphere of the CyberCore experience.

### Overview of the Integration

The Trauma System is responsible for creating immersive visual effects that evoke emotional responses, while the Performance Monitoring System ensures these effects don't negatively impact application performance. This integration allows for:

1. Dynamic scaling of visual effect complexity based on performance metrics
2. Prioritization of critical effects over decorative ones
3. Graceful degradation of visual quality when performance thresholds are exceeded
4. Scheduled application of intensive effects during low-demand periods

### Implementation Details

#### 1. Event-Based Communication

The systems communicate primarily through the NeuralBus:

```javascript
// In the PerformanceMonitor class
import { NeuralBus } from '../messaging/neural-bus';

class PerformanceMonitor {
  constructor() {
    // ...

    // Listen for trauma effect requests
    NeuralBus.subscribe('trauma.effect.request', this.handleTraumaEffectRequest);

    // Publish performance data that trauma system listens for
    this.metrics.addEventListener('update', () => {
      NeuralBus.publish('performance.metrics.update', this.metrics.snapshot());
    });
  }

  handleTraumaEffectRequest(effectData) {
    // Check if performance allows for effect
    if (this.metrics.currentFPS < this.thresholds.CRITICAL) {
      // Reject or downgrade effect
      NeuralBus.publish('trauma.effect.response', {
        id: effectData.id,
        approved: false,
        suggestedAlternative: this.suggestAlternativeEffect(effectData),
      });
      return;
    }

    // Approve effect
    NeuralBus.publish('trauma.effect.response', {
      id: effectData.id,
      approved: true,
      recommendedDuration: this.calculateSafeDuration(effectData),
    });
  }
}
```

#### 2. TraumaPerformanceCoordinator

A dedicated coordinator class manages the relationship between the systems:

```javascript
// Example from src/trauma/trauma-performance-coordinator.js
import { PerformanceMonitor } from '../performance/performance-monitor';
import { TraumaSystem } from './trauma-system';

export class TraumaPerformanceCoordinator {
  constructor() {
    this.performanceMonitor = PerformanceMonitor.getInstance();
    this.traumaSystem = TraumaSystem.getInstance();

    // Register adaptation strategies
    this.performanceMonitor.registerOptimizationStrategy('trauma', {
      LOW: () => this.traumaSystem.setEffectQuality('HIGH'),
      MEDIUM: () => this.traumaSystem.setEffectQuality('MEDIUM'),
      HIGH: () => this.traumaSystem.setEffectQuality('LOW'),
      CRITICAL: () => this.traumaSystem.pauseNonEssentialEffects(),
    });

    // Listen for performance changes
    this.performanceMonitor.onOptimizationLevelChanged((level) => {
      this.adaptTraumaSystem(level);
    });
  }

  adaptTraumaSystem(performanceLevel) {
    // Implement specific adaptations based on performance level
    switch (performanceLevel) {
      case 'CRITICAL':
        this.traumaSystem.disableParticleEffects();
        this.traumaSystem.useSimplifiedShaders();
        break;
      case 'HIGH':
        this.traumaSystem.reduceParticleCount(0.5); // 50% reduction
        this.traumaSystem.setShaderComplexity('LOW');
        break;
      // Additional cases...
    }
  }

  // Schedule intensive effects during high-performance periods
  scheduleIntensiveEffect(effectConfig) {
    const performanceTimeline = this.performanceMonitor.getPerformanceTimeline();
    const optimalTime = this.findOptimalTimeWindow(performanceTimeline);

    if (optimalTime) {
      this.traumaSystem.scheduleEffect(effectConfig, optimalTime);
      return true;
    }
    return false;
  }
}
```

### Practical Usage Examples

#### Example 1: Gradually Increasing Glitch Effects

```javascript
// In a game sequence controller
import { TraumaPerformanceCoordinator } from '../trauma/trauma-performance-coordinator';
import { PerformanceMonitor } from '../performance/performance-monitor';

class TensionSequenceController {
  constructor() {
    this.traumaPerformanceCoordinator = new TraumaPerformanceCoordinator();
    this.performanceMonitor = PerformanceMonitor.getInstance();

    // Start monitoring a key transaction
    this.performanceMonitor.startTransaction('tension-sequence');
  }

  increaseTensionLevel(level) {
    // Get current performance state
    const metrics = this.performanceMonitor.getMetrics();
    const currentFPS = metrics.fps;

    // Calculate safe effect intensity based on performance
    const safeIntensity = this.calculateSafeIntensity(level, currentFPS);

    // Apply glitch effect with optimized parameters
    this.traumaPerformanceCoordinator.applyGlitchEffect({
      intensity: safeIntensity,
      duration: 2000 * (metrics.devicePerformanceTier / 3), // Scale with device capability
      fragmentationLevel: Math.min(level, metrics.memoryScore / 20),
    });
  }

  end() {
    // End the transaction monitoring
    this.performanceMonitor.endTransaction('tension-sequence');
  }
}
```

#### Example 2: Adaptive Reality Distortion Effect

```javascript
// In a reality-warping sequence
import { TraumaSystem } from '../trauma/trauma-system';
import { PerformanceMonitor } from '../performance/performance-monitor';

class RealityDistortionController {
  constructor() {
    this.traumaSystem = TraumaSystem.getInstance();
    this.performanceMonitor = PerformanceMonitor.getInstance();

    // Create performance-aware effect configuration
    this.effectConfig = {
      baseDistortion: 0.2,
      chromaticAberration: 0.1,
      noiseIntensity: 0.3,
      waveformDistortion: 0.4,

      // Register dynamic adaptation functions
      adaptWithPerformance: (metrics) => {
        return {
          // Adapt each effect parameter based on performance
          baseDistortion: this.effectConfig.baseDistortion * this.scaleFactor(metrics),
          chromaticAberration: this.effectConfig.chromaticAberration * this.scaleFactor(metrics),
          noiseIntensity: metrics.fps < 30 ? 0.1 : this.effectConfig.noiseIntensity,
          waveformDistortion: metrics.memoryUsage > 80 ? 0.1 : this.effectConfig.waveformDistortion,
        };
      },
    };

    // Register for continuous performance updates
    this.performanceMonitor.onMetricsUpdate((metrics) => {
      if (this.isActive) {
        const adaptedConfig = this.effectConfig.adaptWithPerformance(metrics);
        this.traumaSystem.updateActiveEffect('realityDistortion', adaptedConfig);
      }
    });
  }

  scaleFactor(metrics) {
    // Calculate a scaling factor between 0.2 and 1.0 based on performance
    return 0.2 + Math.min(0.8, (metrics.fps / 60) * 0.8);
  }

  activate() {
    this.isActive = true;
    // Apply initial effect with current performance in mind
    const currentMetrics = this.performanceMonitor.getMetrics();
    this.traumaSystem.applyEffect(
      'realityDistortion',
      this.effectConfig.adaptWithPerformance(currentMetrics)
    );
  }

  deactivate() {
    this.isActive = false;
    this.traumaSystem.removeEffect('realityDistortion');
  }
}
```

### Best Practices for Trauma-Performance Integration

1. **Plan for performance variability**: Always design trauma effects with multiple quality levels
2. **Prioritize effects**: Categorize effects as essential vs. decorative to know which to keep during performance constraints
3. **Use the transaction API**: Wrap complex trauma sequences in performance transactions for detailed insights
4. **Monitor memory impact**: Trauma effects often load additional assets; track memory impact separately from FPS
5. **Consider loading times**: Pre-load essential trauma effect assets during application idle times
6. **Test on target devices**: Performance characteristics vary widely across devices; test the integration on low-end target hardware
7. **Listen for optimization events**: Have trauma effects respond to system-wide optimization directives
8. **Measure perception vs. performance**: Sometimes a simplified effect that runs smoothly is more immersive than a complex choppy one

## Best Practices

### When to Use Performance Monitoring

- During development to identify bottlenecks
- In production to ensure smooth user experience
- When implementing new features to assess performance impact
- For automatic adaptation to different device capabilities

### Monitoring Custom Components

1. Register component with NeuralBus
2. Use `startMeasure()` for key operations
3. Track event latency for component events
4. Implement optimization support
5. Observe optimization level changes

### Implementing Optimization Support

Components should implement support for different optimization levels:

```javascript
// Example optimization support in a component
NeuralBus.subscribe('performance:optimizations:applied', (data) => {
  const { level } = data;

  switch (level) {
    case OptimizationLevel.LOW:
      // Apply minor optimizations
      break;
    case OptimizationLevel.MEDIUM:
      // Apply moderate optimizations
      break;
    case OptimizationLevel.HIGH:
      // Apply significant optimizations
      break;
    case OptimizationLevel.CRITICAL:
      // Apply maximum optimizations
      break;
    default:
      // Reset to default behavior
      break;
  }
});
```

## Troubleshooting

### Common Issues

#### High Memory Usage

**Symptoms:**

- Increasing memory consumption
- Performance degradation over time

**Solutions:**

- Check for memory leaks in components
- Implement proper cleanup in component disconnection
- Consider implementing object pooling

#### Low FPS

**Symptoms:**

- Stuttering animations
- Unresponsive interface

**Solutions:**

- Reduce WebGL complexity
- Optimize animations
- Decrease particle counts
- Disable some visual effects

#### High Event Latency

**Symptoms:**

- Delayed response to user interactions
- Event processing backlog

**Solutions:**

- Optimize event handlers
- Debounce high-frequency events
- Use requestAnimationFrame for UI updates

## Example Usage Scenarios

### Basic Monitoring

```javascript
// Initialize and start monitoring
import { PerformanceMonitor } from './assets/performance-monitor.js';

const monitor = new PerformanceMonitor();
monitor.start();

// Check current metrics
setInterval(() => {
  const fps = monitor.getMetrics(MetricType.FPS);
  console.log(`Current FPS: ${fps}`);
}, 5000);
```

### Component Performance Tracking

```javascript
import { PerformanceMonitor } from './assets/performance-monitor.js';

class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.performanceMonitor = new PerformanceMonitor();
  }

  addToCart(product) {
    const endMeasure = this.performanceMonitor.startMeasure('ProductCard', 'addToCart');

    // Perform add to cart logic
    // ...

    endMeasure(); // End measurement
  }
}
```

### Manual Optimization

```javascript
import { PerformanceMonitor, OptimizationLevel } from './assets/performance-monitor.js';

const monitor = new PerformanceMonitor();

// Apply specific optimization level for intensive operation
function performIntensiveOperation() {
  // Save current level
  const currentLevel = monitor.getOptimizationLevel();

  // Apply higher optimization level
  monitor.applyOptimizations(OptimizationLevel.HIGH, true);

  // Perform operation
  // ...

  // Restore previous level
  monitor.applyOptimizations(currentLevel);
}
```

## Conclusion

The Performance Monitoring System provides CyberCore with the ability to automatically adapt to different device capabilities and performance constraints. By tracking key metrics and applying appropriate optimizations, it ensures a smooth user experience across a wide range of devices.

For more information about integration with other CyberCore systems, refer to the related documentation files in the `docs` directory.
