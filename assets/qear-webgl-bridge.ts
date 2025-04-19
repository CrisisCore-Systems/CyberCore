/**
 * TypeScript wrapper for qear-webgl-bridge.js
 * Provides type safety while maintaining compatibility with the original WebGL bridge
 */

// Import the original JavaScript file
const QEARWebGLBridgeJS =
  require('./qear-webgl-bridge.js').default || require('./qear-webgl-bridge.js');

// Define TypeScript interface for the QEAR WebGL Bridge
export interface QEARWebGLBridgeInterface {
  // Properties
  isConnected: boolean;
  targetElement: HTMLElement | null;
  connectorType: string;
  lastSyncTimestamp: number;

  // Methods
  connect(targetElement: HTMLElement, options?: any): Promise<boolean>;
  disconnect(): void;
  syncState(state: any): void;
  applyEffect(effectName: string, params?: any): void;
  registerEventHandler(eventType: string, handler: (event: any) => void): string;
  unregisterEventHandler(handlerId: string): boolean;
  getPerformanceMetrics(): Record<string, number>;
}

// Export the JavaScript module with TypeScript types
export const QEARWebGLBridge: QEARWebGLBridgeInterface = QEARWebGLBridgeJS;
