/**
 * VoidBloom API Key Management System
 * Secures API access and manages rotation of sensitive credentials
 * Version: 3.7.1
 */

/**
 *
 */
class ApiKeyManager {
  /**
   *
   */
  constructor(options = {}) {
    // Configuration
    this.config = {
      encryptionEnabled: true,
      rotationInterval: 30, // days
      keyNamespace: 'voidbloom_api',
      minimumKeyLength: 24,
      restrictedAccessPaths: [
        '/admin/api',
        '/admin/access',
        '/api/memory/admin',
        '/api/trauma/configure',
      ],
      emergencyKeyRevocationEnabled: true,
      traumaResponseType: 'surveillance',
      coherenceImpact: -0.15,
      storageMethod: 'secured_metafields', // or 'environment_variables', 'secure_storage'
      notificationEndpoint: 'https://admin.voidbloom.systems/api/key-events',
      ...options,
    };

    // State
    this.state = {
      initialized: false,
      keys: new Map(),
      pendingRotations: new Set(),
      keyAccessHistory: [],
      lastRotationCheck: null,
      encryptionKey: null,
    };

    // Bind methods
    this.initialize = this.initialize.bind(this);
    this.loadKeys = this.loadKeys.bind(this);
    this.getKey = this.getKey.bind(this);
    this.setKey = this.setKey.bind(this);
    this.rotateKey = this.rotateKey.bind(this);
    this.scheduleRotations = this.scheduleRotations.bind(this);
    this.encryptKey = this.encryptKey.bind(this);
    this.decryptKey = this.decryptKey.bind(this);
    this.checkAccessRestrictions = this.checkAccessRestrictions.bind(this);
    this.recordKeyAccess = this.recordKeyAccess.bind(this);
    this.notifyKeyEvent = this.notifyKeyEvent.bind(this);
    this.revokeKey = this.revokeKey.bind(this);
    this.emergencyRevocation = this.emergencyRevocation.bind(this);
    this.log = this.log.bind(this);

    // Initialize
    this.initialize();
  }

  /**
   * Initialize API key manager
   */
  initialize() {
    if (this.state.initialized) return;

    this.log('Initializing API Key Manager');

    // Generate encryption key if encryption is enabled
    if (this.config.encryptionEnabled) {
      // In production, this would be a secure, persistent key
      this.state.encryptionKey = this.generateEncryptionKey();
    }

    // Load keys
    this.loadKeys();

    // Schedule key rotation checks
    this.scheduleRotations();

    // Register with Neural Bus if available
    if (typeof window !== 'undefined' && window.voidBloom && window.voidBloom.neuralBus) {
      window.voidBloom.neuralBus.receive('global', (data) => {
        // Listen for coherence drops that might indicate compromise
        if (data.action === 'coherence_shifted' && data.change < -0.3) {
          // Severe coherence drop - consider emergency measures
          this.log('Severe coherence drop detected, evaluating key security', 'warn');

          // Check recent key access history for anomalies
          const recentAccess = this.state.keyAccessHistory.filter(
            (access) => Date.now() - access.timestamp < 3600000 // Last hour
          );

          if (recentAccess.length > 10) {
            // Unusually high number of key accesses
            this.log('Unusual key access pattern detected during coherence drop', 'error');
            this.emergencyRevocation('anomalous_access_pattern');
          }
        }
      });

      // Register ourselves
      window.voidBloom.neuralBus.transmit('global', {
        action: 'component_initialized',
        component: 'api_key_manager',
        timestamp: Date.now(),
      });
    }

    this.state.initialized = true;
    this.log('API Key Manager initialized');
  }

  /**
   * Load API keys from storage
   */
  loadKeys() {
    this.log('Loading API keys');

    // Implementation depends on the storage method
    switch (this.config.storageMethod) {
    case 'secured_metafields':
      this.loadKeysFromMetafields();
      break;
    case 'environment_variables':
      this.loadKeysFromEnvironment();
      break;
    case 'secure_storage':
      this.loadKeysFromSecureStorage();
      break;
    default:
      this.log(`Unknown storage method: ${this.config.storageMethod}`, 'error');
    }
  }

  /**
   * Load keys from Shopify metafields
   * Used when running within Shopify admin context
   */
  loadKeysFromMetafields() {
    // In a real implementation, this would call the Shopify Admin API
    // For demonstration purposes, we'll simulate this with localStorage

    try {
      // In production, this would access secured metafields
      const metafieldData = localStorage.getItem(`${this.config.keyNamespace}_keys`);

      if (metafieldData) {
        const encryptedKeys = JSON.parse(metafieldData);

        // Decrypt and load each key
        for (const [keyId, data] of Object.entries(encryptedKeys)) {
          if (this.config.encryptionEnabled && data.encrypted) {
            const decrypted = this.decryptKey(data.value);
            this.state.keys.set(keyId, {
              value: decrypted,
              created: new Date(data.created),
              expires: new Date(data.expires),
              lastUsed: data.lastUsed ? new Date(data.lastUsed) : null,
              description: data.description,
              permissions: data.permissions || ['read'],
              restricted: data.restricted || false,
            });
          } else {
            this.state.keys.set(keyId, {
              value: data.value,
              created: new Date(data.created),
              expires: new Date(data.expires),
              lastUsed: data.lastUsed ? new Date(data.lastUsed) : null,
              description: data.description,
              permissions: data.permissions || ['read'],
              restricted: data.restricted || false,
            });
          }
        }

        this.log(`Loaded ${this.state.keys.size} API keys`);
      } else {
        this.log('No API keys found in metafields');
      }
    } catch (error) {
      this.log(`Error loading API keys from metafields: ${error.message}`, 'error');
    }
  }

  /**
   * Load keys from environment variables
   * Used when running in Node.js environment
   */
  loadKeysFromEnvironment() {
    // In a real implementation, this would read from process.env
    // with a specific naming convention like VOIDBLOOM_API_KEY_*

    // This is a simplified simulation
    const envKeys = {
      shopify: { value: 'sim_env_shopify_key', description: 'Shopify Admin API' },
      trauma: { value: 'sim_env_trauma_engine_key', description: 'Trauma Engine API' },
      memory: { value: 'sim_env_memory_key', description: 'Memory Archive API' },
    };

    for (const [keyId, data] of Object.entries(envKeys)) {
      const fullKeyId = `${this.config.keyNamespace}_${keyId}`;

      this.state.keys.set(fullKeyId, {
        value: data.value,
        created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        lastUsed: null,
        description: data.description,
        permissions: ['read', 'write'],
        restricted: false,
      });
    }

    this.log(`Loaded ${this.state.keys.size} API keys from environment`);
  }

  /**
   * Load keys from secure storage
   * Used for custom secure storage implementations
   */
  loadKeysFromSecureStorage() {
    // Implementation would depend on the secure storage mechanism
    this.log('Secure storage implementation not available', 'warn');
  }

  /**
   * Get an API key
   * @param {string} keyId - Key identifier
   * @param {Object} options - Access options
   * @returns {string|null} The API key or null if not found
   */
  getKey(keyId, options = {}) {
    const fullKeyId = keyId.startsWith(this.config.keyNamespace)
      ? keyId
      : `${this.config.keyNamespace}_${keyId}`;

    // Check if key exists
    if (!this.state.keys.has(fullKeyId)) {
      this.log(`API key not found: ${keyId}`, 'warn');
      return null;
    }

    const keyData = this.state.keys.get(fullKeyId);

    // Check if key has expired
    if (keyData.expires && keyData.expires < new Date()) {
      this.log(`API key expired: ${keyId}`, 'warn');
      return null;
    }

    // Check access restrictions
    if (keyData.restricted && !this.checkAccessRestrictions(options)) {
      this.log(`Access denied to restricted key: ${keyId}`, 'error');

      // Record failed access attempt
      this.recordKeyAccess(fullKeyId, false, options);

      // Notify of suspicious access
      this.notifyKeyEvent(fullKeyId, 'suspicious_access', options);

      return null;
    }

    // Update last used timestamp
    keyData.lastUsed = new Date();
    this.state.keys.set(fullKeyId, keyData);

    // Record successful access
    this.recordKeyAccess(fullKeyId, true, options);

    return keyData.value;
  }

  /**
   * Set an API key
   * @param {string} keyId - Key identifier
   * @param {string} value - Key value
   * @param {Object} options - Key options
   * @returns {boolean} Success status
   */
  setKey(keyId, value, options = {}) {
    const fullKeyId = keyId.startsWith(this.config.keyNamespace)
      ? keyId
      : `${this.config.keyNamespace}_${keyId}`;

    // Validate key value
    if (!value || value.length < this.config.minimumKeyLength) {
      this.log(`API key too short (minimum ${this.config.minimumKeyLength} chars)`, 'error');
      return false;
    }

    // Set defaults
    const defaultOptions = {
      created: new Date(),
      expires: new Date(Date.now() + this.config.rotationInterval * 24 * 60 * 60 * 1000),
      description: 'API Key',
      permissions: ['read'],
      restricted: false,
    };

    const keyData = {
      ...defaultOptions,
      ...options,
      value,
      lastUsed: null,
    };

    // Store key
    this.state.keys.set(fullKeyId, keyData);

    // Save keys to persistent storage
    this.saveKeys();

    // Notify of key creation
    this.notifyKeyEvent(fullKeyId, 'key_created', { description: keyData.description });

    this.log(`API key created: ${keyId}`);
    return true;
  }

  /**
   * Rotate an API key
   * @param {string} keyId - Key identifier
   * @returns {Object} Rotation result with old and new keys
   */
  rotateKey(keyId) {
    const fullKeyId = keyId.startsWith(this.config.keyNamespace)
      ? keyId
      : `${this.config.keyNamespace}_${keyId}`;

    // Check if key exists
    if (!this.state.keys.has(fullKeyId)) {
      this.log(`Cannot rotate non-existent key: ${keyId}`, 'error');
      return { success: false, error: 'key_not_found' };
    }

    const oldKeyData = this.state.keys.get(fullKeyId);

    // Generate new key
    const newKeyValue = this.generateApiKey();

    // Create new transitional key ID for overlap period
    const transitionalKeyId = `${fullKeyId}_old`;

    // Set expiration date for old key (7 day overlap)
    const oldKeyExpiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Copy old key to transitional key
    this.state.keys.set(transitionalKeyId, {
      ...oldKeyData,
      expires: oldKeyExpiryDate,
      description: `${oldKeyData.description} (Previous)`,
      isTransitional: true,
    });

    // Update the main key with new value
    const newKeyData = {
      ...oldKeyData,
      value: newKeyValue,
      created: new Date(),
      expires: new Date(Date.now() + this.config.rotationInterval * 24 * 60 * 60 * 1000),
      lastUsed: null,
    };

    this.state.keys.set(fullKeyId, newKeyData);

    // Remove from pending rotations if present
    this.state.pendingRotations.delete(fullKeyId);

    // Save keys to persistent storage
    this.saveKeys();

    // Notify of key rotation
    this.notifyKeyEvent(fullKeyId, 'key_rotated', {
      transitionalKeyId,
      oldExpiryDate: oldKeyExpiryDate,
    });

    this.log(`API key rotated: ${keyId}`);

    return {
      success: true,
      keyId: fullKeyId,
      newKey: newKeyValue,
      oldKeyId: transitionalKeyId,
      oldKey: oldKeyData.value,
      oldKeyExpiry: oldKeyExpiryDate,
    };
  }

  /**
   * Revoke an API key
   * @param {string} keyId - Key identifier
   * @param {string} reason - Revocation reason
   * @returns {boolean} Success status
   */
  revokeKey(keyId, reason = 'manual_revocation') {
    const fullKeyId = keyId.startsWith(this.config.keyNamespace)
      ? keyId
      : `${this.config.keyNamespace}_${keyId}`;

    // Check if key exists
    if (!this.state.keys.has(fullKeyId)) {
      this.log(`Cannot revoke non-existent key: ${keyId}`, 'error');
      return false;
    }

    // Get the key data for notification
    const keyData = this.state.keys.get(fullKeyId);

    // Delete the key
    this.state.keys.delete(fullKeyId);

    // Also remove any transitional version
    const transitionalKeyId = `${fullKeyId}_old`;
    if (this.state.keys.has(transitionalKeyId)) {
      this.state.keys.delete(transitionalKeyId);
    }

    // Remove from pending rotations if present
    this.state.pendingRotations.delete(fullKeyId);

    // Save keys to persistent storage
    this.saveKeys();

    // Notify of key revocation
    this.notifyKeyEvent(fullKeyId, 'key_revoked', {
      reason,
      description: keyData.description,
    });

    this.log(`API key revoked: ${keyId}, reason: ${reason}`);

    return true;
  }

  /**
   * Emergency revocation of all keys
   * @param {string} reason - Emergency reason
   */
  emergencyRevocation(reason) {
    if (!this.config.emergencyKeyRevocationEnabled) {
      this.log('Emergency key revocation is disabled', 'warn');
      return false;
    }

    this.log(`EMERGENCY KEY REVOCATION: ${reason}`, 'error');

    // Get all keys for notification
    const allKeys = Array.from(this.state.keys.keys());

    // Clear all keys
    this.state.keys.clear();
    this.state.pendingRotations.clear();

    // Save empty key store
    this.saveKeys();

    // Notify of emergency revocation
    for (const keyId of allKeys) {
      this.notifyKeyEvent(keyId, 'emergency_revocation', { reason });
    }

    // Notify neural bus of security breach
    if (typeof window !== 'undefined' && window.voidBloom && window.voidBloom.neuralBus) {
      window.voidBloom.neuralBus.transmit('security', {
        action: 'emergency_key_revocation',
        reason,
        keysRevoked: allKeys.length,
        timestamp: Date.now(),
      });

      // Impact system coherence
      window.voidBloom.neuralBus.transmit('global', {
        action: 'coherence_shifted',
        oldCoherence: parseFloat(document.documentElement.dataset.systemCoherence || '0.9'),
        newCoherence: Math.max(
          0.3,
          parseFloat(document.documentElement.dataset.systemCoherence || '0.9') +
            this.config.coherenceImpact
        ),
        change: this.config.coherenceImpact,
        source: 'emergency_key_revocation',
        trauma_type: this.config.traumaResponseType,
        timestamp: Date.now(),
      });
    }

    return true;
  }

  /**
   * Save keys to persistent storage
   */
  saveKeys() {
    // Implementation depends on the storage method
    switch (this.config.storageMethod) {
    case 'secured_metafields':
      this.saveKeysToMetafields();
      break;
    case 'environment_variables':
      this.log('Cannot save keys to environment variables', 'warn');
      break;
    case 'secure_storage':
      this.saveKeysToSecureStorage();
      break;
    default:
      this.log(`Unknown storage method: ${this.config.storageMethod}`, 'error');
    }
  }

  /**
   * Save keys to Shopify metafields
   */
  saveKeysToMetafields() {
    try {
      // Prepare data for storage
      const keysData = {};

      for (const [keyId, data] of this.state.keys.entries()) {
        // Don't include transitional keys
        if (data.isTransitional) continue;

        let valueToStore = data.value;
        let encrypted = false;

        // Encrypt if enabled
        if (this.config.encryptionEnabled) {
          valueToStore = this.encryptKey(data.value);
          encrypted = true;
        }

        keysData[keyId] = {
          value: valueToStore,
          encrypted,
          created: data.created.toISOString(),
          expires: data.expires.toISOString(),
          lastUsed: data.lastUsed ? data.lastUsed.toISOString() : null,
          description: data.description,
          permissions: data.permissions,
          restricted: data.restricted,
        };
      }

      // In production, this would use the Shopify Admin API
      // For demonstration, we use localStorage
      localStorage.setItem(`${this.config.keyNamespace}_keys`, JSON.stringify(keysData));

      this.log(`Saved ${Object.keys(keysData).length} API keys to metafields`);
    } catch (error) {
      this.log(`Error saving API keys to metafields: ${error.message}`, 'error');
    }
  }

  /**
   * Save keys to secure storage
   */
  saveKeysToSecureStorage() {
    // Implementation would depend on the secure storage mechanism
    this.log('Secure storage implementation not available', 'warn');
  }

  /**
   * Schedule key rotation checks
   */
  scheduleRotations() {
    this.log('Scheduling key rotation checks');

    // Check for keys needing rotation
    const checkKeyRotations = () => {
      const now = new Date();
      this.state.lastRotationCheck = now;

      // Clear pending rotations
      this.state.pendingRotations.clear();

      // Check each key
      for (const [keyId, data] of this.state.keys.entries()) {
        // Skip transitional keys
        if (data.isTransitional) continue;

        // Check if key is nearing expiration (75% of rotation interval passed)
        const ageInDays = (now - data.created) / (24 * 60 * 60 * 1000);

        if (ageInDays > this.config.rotationInterval * 0.75) {
          this.log(`Key ${keyId} needs rotation (age: ${Math.round(ageInDays)} days)`);
          this.state.pendingRotations.add(keyId);

          // Notify of pending rotation
          this.notifyKeyEvent(keyId, 'rotation_needed', {
            created: data.created,
            ageInDays: Math.round(ageInDays),
          });
        }
      }

      if (this.state.pendingRotations.size === 0) {
        this.log('No keys need rotation');
      } else {
        this.log(`${this.state.pendingRotations.size} keys need rotation`);
      }
    };

    // Initial check
    checkKeyRotations();

    // In browser environment, set up interval
    if (typeof window !== 'undefined') {
      // Check daily
      setInterval(checkKeyRotations, 24 * 60 * 60 * 1000);
    }
  }

  /**
   * Check access restrictions for a key
   * @param {Object} options - Access options
   * @returns {boolean} Whether access is allowed
   */
  checkAccessRestrictions(options = {}) {
    // If no path provided, assume unrestricted
    if (!options.path) return true;

    // Check against restricted paths
    for (const restrictedPath of this.config.restrictedAccessPaths) {
      if (options.path.startsWith(restrictedPath)) {
        // Path is restricted - check for ip whitelist
        if (options.ip && this.isIpWhitelisted(options.ip)) {
          return true;
        }

        // Check for authenticated admin user
        if (options.isAdmin) {
          return true;
        }

        // Otherwise deny access
        return false;
      }
    }

    // Not a restricted path
    return true;
  }

  /**
   * Check if IP is whitelisted
   * @param {string} ip - IP address to check
   * @returns {boolean} Whether IP is whitelisted
   */
  isIpWhitelisted(ip) {
    // In a real implementation, this would check against a whitelist
    // For demonstration, we'll allow a sample IP
    return ip === '127.0.0.1' || ip === 'localhost';
  }

  /**
   * Record API key access
   * @param {string} keyId - Key identifier
   * @param {boolean} success - Whether access was successful
   * @param {Object} options - Access details
   */
  recordKeyAccess(keyId, success, options = {}) {
    const accessRecord = {
      keyId,
      timestamp: Date.now(),
      success,
      path: options.path || 'unknown',
      ip: options.ip || 'unknown',
      userAgent: options.userAgent || 'unknown',
    };

    // Add to history
    this.state.keyAccessHistory.push(accessRecord);

    // Limit history size
    if (this.state.keyAccessHistory.length > 100) {
      this.state.keyAccessHistory.shift();
    }
  }

  /**
   * Notify of key event
   * @param {string} keyId - Key identifier
   * @param {string} eventType - Event type
   * @param {Object} details - Event details
   */
  notifyKeyEvent(keyId, eventType, details = {}) {
    // Log the event
    this.log(`Key event: ${eventType} for ${keyId}`);

    // In browser context, transmit via Neural Bus
    if (typeof window !== 'undefined' && window.voidBloom && window.voidBloom.neuralBus) {
      window.voidBloom.neuralBus.transmit('security', {
        action: 'api_key_event',
        keyId,
        eventType,
        details,
        timestamp: Date.now(),
      });
    }

    // Send to notification endpoint if configured
    if (this.config.notificationEndpoint) {
      const notificationData = {
        keyId,
        eventType,
        details,
        timestamp: new Date().toISOString(),
      };

      // In a real implementation, this would use fetch or an API client
      this.log(`Would send notification to ${this.config.notificationEndpoint}`);
    }
  }

  /**
   * Generate a secure API key
   * @returns {string} New API key
   */
  generateApiKey() {
    // In a real implementation, this would use a secure random generator
    // For demonstration, we'll create a simulated key

    // Create 32 random bytes
    const randomBytes = new Uint8Array(32);

    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(randomBytes);
    } else {
      // Fallback for non-browser environments
      for (let i = 0; i < 32; i++) {
        randomBytes[i] = Math.floor(Math.random() * 256);
      }
    }

    // Convert to hex string
    let hexString = '';
    for (const byte of randomBytes) {
      hexString += byte.toString(16).padStart(2, '0');
    }

    // Format as VoidBloom-specific key
    return `vb_${hexString.substring(0, 12)}_${hexString.substring(12, 24)}_${hexString.substring(
      24
    )}`;
  }

  /**
   * Generate encryption key for securing API keys
   * @returns {string} Encryption key
   */
  generateEncryptionKey() {
    // In a real implementation, this would be a persistent, secure key
    // For demonstration, we'll create a simulated key

    if (typeof window !== 'undefined' && window.crypto) {
      const keyBytes = new Uint8Array(32);
      window.crypto.getRandomValues(keyBytes);

      return Array.from(keyBytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    } else {
      // Fallback for non-browser environments
      let key = '';
      const chars = 'abcdef0123456789';

      for (let i = 0; i < 64; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      return key;
    }
  }

  /**
   * Encrypt an API key
   * @param {string} key - Key to encrypt
   * @returns {string} Encrypted key
   */
  encryptKey(key) {
    if (!this.config.encryptionEnabled || !this.state.encryptionKey) {
      return key;
    }

    try {
      // In a real implementation, this would use a proper encryption algorithm
      // For demonstration, we'll use a simple XOR-based obfuscation

      const keyChars = key.split('');
      const encryptionChars = this.state.encryptionKey.split('');

      // XOR the key with the encryption key
      const encrypted = keyChars
        .map((char, index) => {
          const encChar = encryptionChars[index % encryptionChars.length];
          return String.fromCharCode(char.charCodeAt(0) ^ encChar.charCodeAt(0));
        })
        .join('');

      // Base64 encode for storage
      return btoa(encrypted);
    } catch (error) {
      this.log(`Error encrypting key: ${error.message}`, 'error');
      return key;
    }
  }

  /**
   * Decrypt an API key
   * @param {string} encryptedKey - Encrypted key
   * @returns {string} Decrypted key
   */
  decryptKey(encryptedKey) {
    if (!this.config.encryptionEnabled || !this.state.encryptionKey) {
      return encryptedKey;
    }

    try {
      // Base64 decode
      const encrypted = atob(encryptedKey);

      // XOR to decrypt
      const encryptedChars = encrypted.split('');
      const encryptionChars = this.state.encryptionKey.split('');

      const decrypted = encryptedChars
        .map((char, index) => {
          const encChar = encryptionChars[index % encryptionChars.length];
          return String.fromCharCode(char.charCodeAt(0) ^ encChar.charCodeAt(0));
        })
        .join('');

      return decrypted;
    } catch (error) {
      this.log(`Error decrypting key: ${error.message}`, 'error');
      return encryptedKey;
    }
  }

  /**
   * Log a message
   * @param {string} message - Message to log
   * @param {string} level - Log level
   */
  log(message, level = 'info') {
    // In production, this would use a proper logging system
    const timestamp = new Date().toISOString();

    // Format prefix
    const prefix = `[API-KEY-MANAGER ${timestamp}]`;

    switch (level) {
    case 'error':
      console.error(`${prefix} ${message}`);
      break;
    case 'warn':
      console.warn(`${prefix} ${message}`);
      break;
    case 'info':
    default:
      console.log(`${prefix} ${message}`);
    }
  }
}

// Initialize in browser context
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.voidBloom = window.voidBloom || {};
    window.voidBloom.apiKeyManager = new ApiKeyManager();
  });
}

// Export for Node.js context
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiKeyManager;
}
