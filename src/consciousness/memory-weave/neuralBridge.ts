/**
 * NeuralBridge
 *
 * Connects PowerShell security operations to frontend visual effects,
 * creating a feedback loop where security events trigger visual manifestations.
 * Establishes the "memory corruption level" that affects visual stability.
 *
 * @version 1.0.0
 * @phase quantum-corruption
 */

import { exec } from 'child_process';
import * as path from 'path';
import { NeuralBus } from '../../assets/neural-bus';

interface SecurityEvent {
  id: string;
  type: string;
  severity: number;
  description: string;
  source: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface CorruptionState {
  level: number;
  sources: Map<string, number>;
  lastUpdate: number;
  decayRate: number;
  stableThreshold: number;
  criticalThreshold: number;
}

export class NeuralBridge {
  private neuralBusConnected = false;
  private corruptionState: CorruptionState = {
    level: 0,
    sources: new Map<string, number>(),
    lastUpdate: Date.now(),
    decayRate: 0.005, // Natural decay rate per minute
    stableThreshold: 0.3, // Below this is considered stable
    criticalThreshold: 0.7, // Above this is considered critical
  };

  // PowerShell script locations
  private readonly SECURITY_SCAN_SCRIPT = path.resolve('Get-QuantumVulnerability.ps1');
  private readonly QUANTUM_INTEGRITY_SCRIPT = path.resolve('quantum-integrity.ps1');

  constructor() {
    this.connectToNeuralBus();
    this.initializeCorruptionMonitoring();
  }

  /**
   * Connect to neural bus for event exchange
   */
  private connectToNeuralBus(): void {
    if (typeof NeuralBus === 'undefined') return;

    try {
      NeuralBus.register('memory-weave-neural-bridge', {
        version: '1.0.0',
        capabilities: ['security-visual-integration', 'corruption-monitoring'],
      });

      this.neuralBusConnected = true;

      // Subscribe to security events
      NeuralBus.subscribe('security:event', (data) => {
        if (data && data.event) {
          this.processSecurityEvent(data.event);
        }
      });

      // Subscribe to visual system readiness
      NeuralBus.subscribe('system:visual-ready', () => {
        this.broadcastCurrentCorruptionLevel();
      });

      console.log('[VOID://NEURAL-BRIDGE] Connected to neural bus');
    } catch (e) {
      console.warn('[VOID://NEURAL-BRIDGE] Failed to connect to NeuralBus:', e);
    }
  }

  /**
   * Run security scan via PowerShell
   * @returns Promise that resolves when scan completes
   */
  public async runSecurityScan(): Promise<SecurityEvent[]> {
    return new Promise((resolve, reject) => {
      const command = `powershell -ExecutionPolicy Bypass -File "${this.SECURITY_SCAN_SCRIPT}" -Format JSON`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`[VOID://NEURAL-BRIDGE] Security scan error: ${error.message}`);
          reject(error);
          return;
        }

        if (stderr) {
          console.warn(`[VOID://NEURAL-BRIDGE] Security scan warning: ${stderr}`);
        }

        try {
          const events = JSON.parse(stdout) as SecurityEvent[];

          // Process each security event
          events.forEach((event) => this.processSecurityEvent(event));

          resolve(events);
        } catch (parseError) {
          console.error(
            `[VOID://NEURAL-BRIDGE] Failed to parse security scan output: ${parseError}`
          );
          reject(parseError);
        }
      });
    });
  }

  /**
   * Run quantum integrity check
   * @returns Promise that resolves with integrity score
   */
  public async checkQuantumIntegrity(): Promise<number> {
    return new Promise((resolve, reject) => {
      const command = `powershell -ExecutionPolicy Bypass -File "${this.QUANTUM_INTEGRITY_SCRIPT}" -ReturnScore`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`[VOID://NEURAL-BRIDGE] Integrity check error: ${error.message}`);
          reject(error);
          return;
        }

        try {
          // Parse the integrity score (0-1)
          const integrityScore = parseFloat(stdout.trim());

          if (isNaN(integrityScore)) {
            throw new Error('Invalid integrity score format');
          }

          // Adjust corruption level based on integrity score
          // Lower integrity = higher corruption
          this.adjustCorruptionLevel(1 - integrityScore, 'quantum-integrity');

          resolve(integrityScore);
        } catch (parseError) {
          console.error(`[VOID://NEURAL-BRIDGE] Failed to parse integrity score: ${parseError}`);
          reject(parseError);
        }
      });
    });
  }

  /**
   * Process security event and adjust corruption level
   * @param event Security event to process
   */
  private processSecurityEvent(event: SecurityEvent): void {
    // Calculate corruption impact based on event severity
    const corruptionImpact = this.calculateCorruptionImpact(event);

    // Adjust corruption level
    this.adjustCorruptionLevel(corruptionImpact, event.source);

    // Broadcast event to visual system
    if (this.neuralBusConnected) {
      NeuralBus.publish('memory-weave:corruption-event', {
        eventId: event.id,
        eventType: event.type,
        corruptionImpact,
        currentLevel: this.corruptionState.level,
        timestamp: Date.now(),
      });
    }

    console.log(
      `[VOID://NEURAL-BRIDGE] Processed security event: ${
        event.type
      }, impact: ${corruptionImpact.toFixed(3)}`
    );
  }

  /**
   * Calculate corruption impact of a security event
   * @param event Security event
   * @returns Corruption impact (0-1)
   */
  private calculateCorruptionImpact(event: SecurityEvent): number {
    // Base impact from event severity (normalized to 0-1)
    let impact = event.severity / 10;

    // Adjust based on event type
    const typeMultipliers: Record<string, number> = {
      vulnerability: 1.2,
      intrusion: 1.5,
      'data-leak': 1.3,
      'integrity-violation': 1.4,
      'encryption-failure': 1.2,
      'quantum-decay': 1.6,
    };

    const multiplier = typeMultipliers[event.type] || 1.0;
    impact *= multiplier;

    // Ensure result is between 0 and 1
    return Math.min(1, Math.max(0, impact));
  }

  /**
   * Adjust corruption level based on impact
   * @param impact Corruption impact to add
   * @param source Source of corruption
   */
  private adjustCorruptionLevel(impact: number, source: string): void {
    const now = Date.now();

    // Apply natural decay since last update
    this.applyCorruptionDecay(now);

    // Track corruption by source
    const currentSourceLevel = this.corruptionState.sources.get(source) || 0;
    this.corruptionState.sources.set(source, currentSourceLevel + impact);

    // Add impact to overall corruption level
    this.corruptionState.level = Math.min(1, Math.max(0, this.corruptionState.level + impact));

    // Update timestamp
    this.corruptionState.lastUpdate = now;

    // Broadcast if threshold crossed
    const wasStable = this.corruptionState.level < this.corruptionState.stableThreshold;
    const wasCritical = this.corruptionState.level > this.corruptionState.criticalThreshold;

    const isNowStable = this.corruptionState.level < this.corruptionState.stableThreshold;
    const isNowCritical = this.corruptionState.level > this.corruptionState.criticalThreshold;

    // Threshold change detection
    if (wasStable !== isNowStable || wasCritical !== isNowCritical) {
      this.broadcastCurrentCorruptionLevel();
    }
  }

  /**
   * Apply natural decay to corruption level
   * @param currentTime Current timestamp
   */
  private applyCorruptionDecay(currentTime: number): void {
    // Calculate minutes elapsed since last update
    const minutesElapsed = (currentTime - this.corruptionState.lastUpdate) / (1000 * 60);

    if (minutesElapsed <= 0) return;

    // Apply decay
    const decayAmount = minutesElapsed * this.corruptionState.decayRate;
    this.corruptionState.level = Math.max(0, this.corruptionState.level - decayAmount);

    // Apply decay to each source
    this.corruptionState.sources.forEach((level, source) => {
      const newLevel = Math.max(0, level - decayAmount);
      if (newLevel <= 0) {
        this.corruptionState.sources.delete(source);
      } else {
        this.corruptionState.sources.set(source, newLevel);
      }
    });
  }

  /**
   * Broadcast current corruption level to visual systems
   */
  private broadcastCurrentCorruptionLevel(): void {
    if (!this.neuralBusConnected) return;

    // Determine corruption state
    let state = 'normal';
    if (this.corruptionState.level > this.corruptionState.criticalThreshold) {
      state = 'critical';
    } else if (this.corruptionState.level > this.corruptionState.stableThreshold) {
      state = 'elevated';
    } else {
      state = 'stable';
    }

    // Prepare source data
    const sources = Array.from(this.corruptionState.sources.entries())
      .map(([source, level]) => ({ source, level }))
      .sort((a, b) => b.level - a.level);

    // Broadcast to neural bus
    NeuralBus.publish('memory-weave:corruption-level', {
      level: this.corruptionState.level,
      state,
      sources: sources.slice(0, 5), // Top 5 corruption sources
      timestamp: Date.now(),
    });

    console.log(
      `[VOID://NEURAL-BRIDGE] Corruption level: ${this.corruptionState.level.toFixed(3)} (${state})`
    );
  }

  /**
   * Initialize corruption monitoring
   */
  private initializeCorruptionMonitoring(): void {
    // Schedule periodic decay updates
    setInterval(() => {
      this.applyCorruptionDecay(Date.now());
    }, 60000); // Check every minute

    // Schedule periodic broadcasts
    setInterval(() => {
      this.broadcastCurrentCorruptionLevel();
    }, 300000); // Broadcast every 5 minutes

    // Schedule periodic security scans
    setInterval(async () => {
      try {
        await this.runSecurityScan();
      } catch (error) {
        console.error('[VOID://NEURAL-BRIDGE] Scheduled security scan failed:', error);
      }
    }, 3600000); // Scan every hour

    // Initial security scan
    setTimeout(async () => {
      try {
        await this.runSecurityScan();
      } catch (error) {
        console.error('[VOID://NEURAL-BRIDGE] Initial security scan failed:', error);
      }
    }, 10000); // Scan 10 seconds after initialization
  }

  /**
   * Get current corruption level
   * @returns Current corruption state
   */
  public getCorruptionLevel(): number {
    // Apply decay since last update
    this.applyCorruptionDecay(Date.now());
    return this.corruptionState.level;
  }

  /**
   * Get corruption sources
   * @returns Map of corruption sources and their levels
   */
  public getCorruptionSources(): Map<string, number> {
    // Apply decay since last update
    this.applyCorruptionDecay(Date.now());
    return new Map(this.corruptionState.sources);
  }
}

export default NeuralBridge;
