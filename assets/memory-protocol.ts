/**
 * TypeScript wrapper for memory-protocol.js
 * Provides type safety while maintaining compatibility with the original memory system
 */

// Import the original JavaScript file using ES module syntax
import * as MemoryProtocolJS from './memory-protocol.js';

// Define TypeScript interfaces for the MemoryProtocol
export interface MemoryFragment {
  id: string;
  type: string;
  content: unknown;
  timestamp: number;
  tags: string[];
  priority: number;
  expiresAt?: number;
  metadata?: Record<string, unknown>;
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

export interface MemoryProtocolOptions {
  storageKey?: string;
  autoSync?: boolean;
  syncInterval?: number;
  remoteEndpoint?: string;
  [key: string]: unknown;
}

export interface MemoryProtocolInterface {
  // Properties
  isInitialized: boolean;
  fragmentCount: number;
  lastSyncTimestamp: number;

  // Methods
  initialize(options?: MemoryProtocolOptions): Promise<void>;
  storeFragment(fragment: Partial<MemoryFragment>): MemoryFragment;
  retrieveFragment(fragmentId: string): MemoryFragment | null;
  queryFragments(query: MemoryQuery): MemoryFragment[];
  removeFragment(fragmentId: string): boolean;
  clearAllFragments(): void;
  exportMemory(): Record<string, unknown>;
  importMemory(data: Record<string, unknown>): boolean;
  sync(): Promise<boolean>;
}

// Export the JavaScript module with TypeScript types
export const MemoryProtocol: MemoryProtocolInterface = MemoryProtocolJS;
