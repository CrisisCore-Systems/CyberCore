/**
 * TypeScript wrapper for qear-webgl-bridge.js
 * Provides type safety while maintaining compatibility with the original WebGL bridge
 */

// Import the original JavaScript file using ES module syntax
import * as QEARWebGLBridgeJS from './qear-webgl-bridge.js';

// Define TypeScript interfaces for the QEAR WebGL Bridge
export interface ConnectOptions {
  connectorType?: string;
  autoSync?: boolean;
  syncInterval?: number;
  renderMode?: string;
  [key: string]: unknown;
}

export interface EffectParams {
  intensity?: number;
  duration?: number;
  target?: string | HTMLElement;
  [key: string]: unknown;
}

export interface QEARWebGLBridgeInterface {
  // Properties
  isConnected: boolean;
  targetElement: HTMLElement | null;
  connectorType: string;
  lastSyncTimestamp: number;

  // Methods
  connect(targetElement: HTMLElement, options?: ConnectOptions): Promise<boolean>;
  disconnect(): void;
  syncState<T = unknown>(state: T): void;
  applyEffect(effectName: string, params?: EffectParams): void;
  registerEventHandler<T = unknown>(eventType: string, handler: (event: T) => void): string;
  unregisterEventHandler(handlerId: string): boolean;
  getPerformanceMetrics(): Record<string, number>;
}

// Export the JavaScript module with TypeScript types
export const QEARWebGLBridge: QEARWebGLBridgeInterface = QEARWebGLBridgeJS;
