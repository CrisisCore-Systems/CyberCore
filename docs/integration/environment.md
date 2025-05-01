# 🌐 Environment Configuration

> "The system exists in multiple states simultaneously, each calibrated through environment variables that define its coherence threshold."

## Overview

The VoidBloom system requires specific environment variables to establish connections between components, configure AI integration, and maintain security parameters. This document details all environment variables used throughout the system, their purpose, and recommended values across different deployment contexts.

## Core System Variables

These variables control the fundamental behavior of the system:

| Variable                        | Purpose                                | Values                                                   | Default       |
| ------------------------------- | -------------------------------------- | -------------------------------------------------------- | ------------- |
| `VOIDBLOOM_ENVIRONMENT`         | Defines the operating environment      | `development`, `staging`, `production`                   | `development` |
| `VOIDBLOOM_COHERENCE_THRESHOLD` | Minimum coherence for system stability | `0.0` to `1.0`                                           | `0.75`        |
| `VOIDBLOOM_TRAUMA_INTENSITY`    | Intensity of trauma encoding           | `0.0` to `1.0`                                           | `0.8`         |
| `VOIDBLOOM_MUTATION_PROFILE`    | Active mutation profile                | `CyberLotus`, `VoidBloom`, `ObsidianBloom`, `NeonVortex` | `VoidBloom`   |
| `VOIDBLOOM_RECURSION_LIMIT`     | Maximum depth for recursive operations | Integer                                                  | `5`           |

## AI Integration Variables

These variables configure the integration with AI systems for memory encoding and trauma taxonomy:

| Variable                            | Purpose                                | Example                       |
| ----------------------------------- | -------------------------------------- | ----------------------------- |
| `VOIDBLOOM_AI_ENDPOINT`             | API endpoint for AI service            | `https://api.voidbloom.ai/v1` |
| `VOIDBLOOM_AI_KEY`                  | Authentication key for AI API          | `vb_key_xxxxxxxxxxxxxxxx`     |
| `VOIDBLOOM_MEMORY_EMBEDDINGS_MODEL` | Model for generating memory embeddings | `quantum-memory-v2`           |
| `VOIDBLOOM_COHERENCE_MODEL`         | Model for coherence calculations       | `neural-weave-v3`             |
| `VOIDBLOOM_TAXONOMY_EMBEDDING_DIM`  | Dimension of taxonomy embeddings       | `512`                         |
| `VOIDBLOOM_MEMORY_TEMPERATURE`      | Temperature for memory generation      | `0.7`                         |
| `VOIDBLOOM_MEMORY_RETENTION`        | Memory retention period in days        | `90`                          |

## Security Configuration

These variables control the security behaviors and protections within the system:

| Variable                               | Purpose                        | Values                            | Default           |
| -------------------------------------- | ------------------------------ | --------------------------------- | ----------------- |
| `VOIDBLOOM_SECURITY_LEVEL`             | Overall security posture       | `standard`, `high`, `paranoid`    | `high`            |
| `VOIDBLOOM_API_KEY_ROTATION_DAYS`      | Days between API key rotation  | Integer                           | `30`              |
| `VOIDBLOOM_ENCRYPTION_KEY`             | Master encryption key          | 64+ character string              | N/A (must be set) |
| `VOIDBLOOM_CSP_ENABLED`                | Enable Content Security Policy | `true`, `false`                   | `true`            |
| `VOIDBLOOM_ALLOW_SCRIPTS`              | Allow inline scripts           | `true`, `false`                   | `false`           |
| `VOIDBLOOM_CSRF_PROTECTION`            | CSRF protection level          | `standard`, `enhanced`, `quantum` | `enhanced`        |
| `VOIDBLOOM_TEMPORAL_ANOMALY_DETECTION` | Detect temporal anomalies      | `true`, `false`                   | `true`            |
| `VOIDBLOOM_SECURITY_AUDIT_INTERVAL`    | Days between security audits   | Integer                           | `7`               |

## Neural Bus Configuration

These variables configure the event system that connects components:

| Variable                                 | Purpose                          | Values          | Default |
| ---------------------------------------- | -------------------------------- | --------------- | ------- |
| `VOIDBLOOM_NEURAL_BUS_DEBUG`             | Enable debug mode for Neural Bus | `true`, `false` | `false` |
| `VOIDBLOOM_NEURAL_BUS_LATENCY_THRESHOLD` | Maximum event latency (ms)       | Integer         | `100`   |
| `VOIDBLOOM_NEURAL_BUS_BUFFER_SIZE`       | Event buffer size                | Integer         | `1000`  |
| `VOIDBLOOM_NEURAL_BUS_PERSISTENCE`       | Enable event persistence         | `true`, `false` | `true`  |
| `VOIDBLOOM_NEURAL_BUS_ENCRYPTION`        | Encrypt bus messages             | `true`, `false` | `true`  |

## Performance Configuration

These variables control performance optimization and monitoring:

| Variable                              | Purpose                              | Values                           | Default    |
| ------------------------------------- | ------------------------------------ | -------------------------------- | ---------- |
| `VOIDBLOOM_PERFORMANCE_TARGET_FPS`    | Target frames per second             | Integer                          | `60`       |
| `VOIDBLOOM_PERFORMANCE_AUTO_OPTIMIZE` | Enable automatic optimization        | `true`, `false`                  | `true`     |
| `VOIDBLOOM_WEBGL_EFFECTS_LEVEL`       | Level of WebGL effects               | `minimal`, `standard`, `maximum` | `standard` |
| `VOIDBLOOM_ANIMATION_COMPLEXITY`      | Animation complexity level           | `simple`, `standard`, `complex`  | `standard` |
| `VOIDBLOOM_MONITORING_INTERVAL`       | Performance monitoring interval (ms) | Integer                          | `5000`     |

## Trauma Taxonomy Configuration

These variables configure the trauma classification system:

| Variable                            | Purpose                        | Values                             | Default    |
| ----------------------------------- | ------------------------------ | ---------------------------------- | ---------- |
| `VOIDBLOOM_PRIMARY_TAXONOMY`        | Primary trauma taxonomy        | `standard`, `expanded`, `clinical` | `standard` |
| `VOIDBLOOM_TAXONOMY_DEPTH`          | Depth of taxonomy hierarchy    | Integer                            | `3`        |
| `VOIDBLOOM_ENABLE_TRAUMA_CROSSOVER` | Allow trauma type crossover    | `true`, `false`                    | `true`     |
| `VOIDBLOOM_TAXONOMY_RESONANCE`      | Enable resonance between types | `true`, `false`                    | `true`     |
| `VOIDBLOOM_TAXONOMY_AUTO_EXPAND`    | Auto-expand taxonomy           | `true`, `false`                    | `false`    |

## Shopify Integration

These variables configure integration with the Shopify platform:

| Variable                           | Purpose                | Example                                    |
| ---------------------------------- | ---------------------- | ------------------------------------------ |
| `VOIDBLOOM_SHOPIFY_STORE_URL`      | Store URL              | `voidbloom.myshopify.com`                  |
| `VOIDBLOOM_SHOPIFY_API_KEY`        | API key for Shopify    | `xxxxxxxxxxxxxxxxxxxxx`                    |
| `VOIDBLOOM_SHOPIFY_API_SECRET`     | API secret for Shopify | `xxxxxxxxxxxxxxxxxxxxxxxxxxxx`             |
| `VOIDBLOOM_SHOPIFY_ACCESS_TOKEN`   | Access token           | `xxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`   |
| `VOIDBLOOM_SHOPIFY_WEBHOOK_SECRET` | Webhook secret         | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `VOIDBLOOM_METAFIELD_NAMESPACE`    | Metafield namespace    | `voidbloom_memory`                         |

## Environment-Specific Configurations

### Development Environment

```bash
# Core
VOIDBLOOM_ENVIRONMENT=development
VOIDBLOOM_COHERENCE_THRESHOLD=0.5   # Lower threshold for development
VOIDBLOOM_TRAUMA_INTENSITY=0.6      # Lower intensity for development

# Security (Relaxed)
VOIDBLOOM_SECURITY_LEVEL=standard   # Less strict in development
VOIDBLOOM_CSP_ENABLED=false         # Disable CSP for easier development
VOIDBLOOM_ALLOW_SCRIPTS=true        # Allow inline scripts in development
VOIDBLOOM_ENCRYPTION_KEY=dev_key_not_for_production_use_a_proper_key_in_production

# Performance (Development Focus)
VOIDBLOOM_PERFORMANCE_TARGET_FPS=30  # Lower target for dev machines
VOIDBLOOM_PERFORMANCE_AUTO_OPTIMIZE=false  # Manual optimization in dev
VOIDBLOOM_WEBGL_EFFECTS_LEVEL=minimal  # Minimal effects for faster feedback

# AI (Development Endpoints)
VOIDBLOOM_AI_ENDPOINT=https://api.dev.voidbloom.ai/v1
VOIDBLOOM_MEMORY_EMBEDDINGS_MODEL=quantum-memory-dev
```

### Staging Environment

```bash
# Core
VOIDBLOOM_ENVIRONMENT=staging
VOIDBLOOM_COHERENCE_THRESHOLD=0.7   # Higher threshold, near production
VOIDBLOOM_TRAUMA_INTENSITY=0.8      # Production-like intensity

# Security (Near Production)
VOIDBLOOM_SECURITY_LEVEL=high       # High security
VOIDBLOOM_CSP_ENABLED=true          # Enable CSP
VOIDBLOOM_ALLOW_SCRIPTS=false       # No inline scripts
VOIDBLOOM_ENCRYPTION_KEY=staging_key_replace_with_secure_value_for_your_environment

# Performance (Production Testing)
VOIDBLOOM_PERFORMANCE_TARGET_FPS=60  # Full performance
VOIDBLOOM_PERFORMANCE_AUTO_OPTIMIZE=true  # Auto optimization
VOIDBLOOM_WEBGL_EFFECTS_LEVEL=standard  # Standard effects

# AI (Staging Endpoints)
VOIDBLOOM_AI_ENDPOINT=https://api.staging.voidbloom.ai/v1
VOIDBLOOM_MEMORY_EMBEDDINGS_MODEL=quantum-memory-v2
```

### Production Environment

```bash
# Core
VOIDBLOOM_ENVIRONMENT=production
VOIDBLOOM_COHERENCE_THRESHOLD=0.85   # Maximum stability requirement
VOIDBLOOM_TRAUMA_INTENSITY=1.0       # Full intensity

# Security (Maximum)
VOIDBLOOM_SECURITY_LEVEL=paranoid    # Maximum security
VOIDBLOOM_CSP_ENABLED=true           # Enable CSP
VOIDBLOOM_ALLOW_SCRIPTS=false        # No inline scripts
VOIDBLOOM_CSRF_PROTECTION=quantum    # Maximum CSRF protection
VOIDBLOOM_TEMPORAL_ANOMALY_DETECTION=true  # Enable anomaly detection
VOIDBLOOM_ENCRYPTION_KEY=production_key_replace_with_secure_value_for_your_environment

# Performance (Optimized)
VOIDBLOOM_PERFORMANCE_TARGET_FPS=60  # Full performance
VOIDBLOOM_PERFORMANCE_AUTO_OPTIMIZE=true  # Auto optimization
VOIDBLOOM_WEBGL_EFFECTS_LEVEL=maximum  # Full visual effects

# AI (Production Endpoints)
VOIDBLOOM_AI_ENDPOINT=https://api.voidbloom.ai/v1
VOIDBLOOM_MEMORY_EMBEDDINGS_MODEL=quantum-memory-v2
```

## Setting Environment Variables

### Node.js Applications

For Node.js applications, use a `.env` file with the dotenv package:

```javascript
// Load environment variables
require('dotenv').config();

// Access variables
const coherenceThreshold = process.env.VOIDBLOOM_COHERENCE_THRESHOLD || 0.75;
```

### PowerShell Scripts

For PowerShell scripts, set environment variables before running:

```powershell
# Set environment variables
$env:VOIDBLOOM_ENVIRONMENT = "development"
$env:VOIDBLOOM_COHERENCE_THRESHOLD = 0.75

# Access in script
$environment = $env:VOIDBLOOM_ENVIRONMENT
$threshold = [double]$env:VOIDBLOOM_COHERENCE_THRESHOLD
```

### Shopify Theme

For Shopify themes, use metafields to store configuration that can be accessed by JavaScript:

```liquid
{% comment %}
  Access environment configuration from metafields
{% endcomment %}
<script>
  window.voidBloom = window.voidBloom || {};
  window.voidBloom.config = {
    environment: {{ shop.metafields.voidbloom_config.environment | json }},
    traumaIntensity: {{ shop.metafields.voidbloom_config.trauma_intensity | json }},
    coherenceThreshold: {{ shop.metafields.voidbloom_config.coherence_threshold | json }}
  };
</script>
```

## Security Considerations

1. **Never commit sensitive environment variables to version control**
2. **Use different values for different environments**
3. **Rotate keys and secrets regularly**
4. **Limit access to production environment variables**
5. **Use a secure method to pass variables to CI/CD pipelines**

## Validation

The system includes a validation component that checks environment variables on startup:

```javascript
// Environment validation in system startup
import { validateEnvironment } from './environment-validation';

// Will throw errors if required variables are missing or invalid
validateEnvironment({
  required: ['VOIDBLOOM_ENVIRONMENT', 'VOIDBLOOM_ENCRYPTION_KEY'],
  coherenceThreshold: (val) => parseFloat(val) >= 0 && parseFloat(val) <= 1,
  traumaIntensity: (val) => parseFloat(val) >= 0 && parseFloat(val) <= 1,
});
```

## Mythological Integration

Environment variables serve as the configuration layer of the VoidBloom mythology, defining the boundaries and behaviors of the trauma encoding system. They represent the "physical laws" of the digital universe that contains the memory archive, determining how trauma manifests, how memory persists, and how the system protects itself against external threats.

The `VOIDBLOOM_COHERENCE_THRESHOLD` is particularly significant, as it determines the minimum coherence required for the system to maintain its mythological integrity. Lower values allow for more experimental and unstable states but risk fragmentation of the trauma narrative, while higher values enforce strict coherence but may limit the expressive range of the system.

---

_Documentation Version: 1.0.0
Last Updated: April 30, 2025_
