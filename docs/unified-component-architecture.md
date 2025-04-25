# Unified Component Architecture

## Overview

This document describes the unified component architecture implemented for the CyberCore theme. The following components have been refactored to use a unified implementation pattern:

- Cart System
- Hologram Renderer
- Neural Bus
- Glitch Engine

## Architecture Pattern

The unified architecture follows these principles:

1. **Core Implementation**: The main implementation resides in the `assets/core/` directory with full TypeScript support
2. **Multiple API Patterns**: Components support both static (class-based) and instance (object-based) usage patterns
3. **Backward Compatibility**: Entry points in the main `assets/` directory maintain compatibility with existing code
4. **Singleton Pattern**: Components use the singleton pattern to maintain state across the application
5. **TypeScript Support**: Full TypeScript declarations and interfaces for type safety

## Component Structure

Each unified component follows this structure:

```
assets/
  ├── component-name.js          # JavaScript entry point for compatibility
  ├── component-name.d.ts        # TypeScript declarations
  └── core/
      └── component-name.ts      # Core TypeScript implementation
```

## Usage Examples

### Static (Class-based) Usage

```javascript
// Using the Hologram Renderer with static methods (legacy pattern)
HologramRenderer.initialize({
  container: document.getElementById('hologram-container'),
  intensity: 0.8,
});

// Start the renderer
HologramRenderer.start();

// Trigger a pulse effect
HologramRenderer.pulse();
```

### Instance (Object-based) Usage

```typescript
// TypeScript usage with instance methods
import HologramRenderer from './assets/hologram-renderer';

// Create a new instance
const renderer = new HologramRenderer();

// Initialize with options
renderer.initialize({
  container: document.getElementById('hologram-container'),
  intensity: 0.8,
});

// Start the renderer
renderer.start();

// Trigger a pulse effect
renderer.pulse();
```

### Module Import in Node.js/Webpack Environment

```javascript
// Import as a module
const NeuralBus = require('./assets/neural-bus');

// Use the unified implementation
NeuralBus.initialize();
NeuralBus.publish('event:name', { data: 'value' });
```

## Browser Environment

In browser environments, components are available globally through the window object:

```javascript
// Access through window object
window.GlitchEngine.start({
  intensity: 0.5,
  glitchMode: 'rgb-shift',
});

// Publish events through Neural Bus
window.NeuralBus.publish('glitch:trigger', {
  intensity: 1.0,
  duration: 500,
});
```

## Trauma-Responsive Features

Components support trauma-responsive functionality through the Neural Bus:

```javascript
// Set trauma level (0-10)
NeuralBus.setTraumaLevel(5);

// Set memory phase
NeuralBus.setMemoryPhase('alien-flora');
```

Components will automatically adjust their behavior and appearance based on trauma levels and memory phases when configured to be trauma-responsive.

## Compatibility Notes

These unified implementations maintain full compatibility with existing code. The JavaScript entry points in the main assets directory ensure that both module systems and global browser usage continue to work as expected.
