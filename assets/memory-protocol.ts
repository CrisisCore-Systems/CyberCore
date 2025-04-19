/**
 * TypeScript wrapper for memory-protocol.js
 * Provides type safety while maintaining compatibility with the original memory system
 */

// Import the original JavaScript file
const MemoryProtocolJS = require('./memory-protocol.js').default || require('./memory-protocol.js');

// Define TypeScript interfaces for the MemoryProtocol
export interface MemoryFragment {
  id: string;
  type: string;
  content: any;
  timestamp: number;
  tags: string[];
  priority: number;
  expiresAt?: number;
  metadata?: Record<string, any>;
}

export interface MemoryQuery {
  tags?: string[];
  type?: string;
  fromTimestamp?: number;
  toTimestamp?: number;
  minPriority?: number;
  limit?: number;
  includeExpired?: boolean;
}

export interface MemoryProtocolInterface {
  // Properties
  isInitialized: boolean;
  fragmentCount: number;
  lastSyncTimestamp: number;

  // Methods
  initialize(options?: any): Promise<void>;
  storeFragment(fragment: Partial<MemoryFragment>): MemoryFragment;
  retrieveFragment(fragmentId: string): MemoryFragment | null;
  queryFragments(query: MemoryQuery): MemoryFragment[];
  removeFragment(fragmentId: string): boolean;
  clearAllFragments(): void;
  exportMemory(): Record<string, any>;
  importMemory(data: Record<string, any>): boolean;
  sync(): Promise<boolean>;
}

// Export the JavaScript module with TypeScript types
export const MemoryProtocol: MemoryProtocolInterface = MemoryProtocolJS;
