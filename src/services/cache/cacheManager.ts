/**
 * Hybrid caching system with memory and persistent storage
 */

import { CacheStrategy, CacheEntry, CacheConfig, ErrorCode, DataServiceError } from '@/types/services';

export class HybridCacheStrategy implements CacheStrategy {
  private memoryCache = new Map<string, CacheEntry>();
  private currentMemorySize = 0;
  private readonly persistentCache: Storage;

  constructor(private config: CacheConfig) {
    // Use sessionStorage for persistent cache (survives navigation but not browser restart)
    this.persistentCache = typeof window !== 'undefined' ? sessionStorage : ({
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {}
    } as Storage);
  }

  get<T>(key: string): T | null {
    try {
      // 1. Check memory cache first (fastest)
      const memoryEntry = this.memoryCache.get(key);
      if (memoryEntry && this.isValidEntry(memoryEntry)) {
        return memoryEntry.data as T;
      }

      // 2. Check persistent cache (slower but survives navigation)
      const persistentData = this.persistentCache.getItem(key);
      if (persistentData) {
        try {
          const entry: CacheEntry = JSON.parse(persistentData);
          if (this.isValidEntry(entry)) {
            // Promote to memory cache for faster future access
            this.setMemoryCache(key, entry.data, entry.ttl - (Date.now() - entry.timestamp));
            return entry.data as T;
          } else {
            // Clean up expired persistent cache entry
            this.persistentCache.removeItem(key);
          }
        } catch (parseError) {
          // Clean up corrupted cache entry
          this.persistentCache.removeItem(key);
        }
      }

      // 3. Remove expired memory cache entry if it exists
      if (memoryEntry) {
        this.memoryCache.delete(key);
        this.currentMemorySize -= this.estimateSize(memoryEntry.data);
      }

      return null;
    } catch (error) {
      throw new DataServiceError(
        'Cache retrieval failed',
        ErrorCode.CACHE_ERROR,
        { key, error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  set<T>(key: string, value: T, ttl?: number): void {
    try {
      const effectiveTTL = ttl || this.config.memoryTTL;
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
        ttl: effectiveTTL
      };

      const dataSize = this.estimateSize(value);

      // Store in memory if under size limit
      if (dataSize <= this.config.maxMemorySize / 10) { // Reserve 90% for other data
        this.setMemoryCache(key, value, effectiveTTL);
      }

      // Always store in persistent cache
      this.setPersistentCache(key, entry, dataSize >= this.config.compressionThreshold);

    } catch (error) {
      throw new DataServiceError(
        'Cache storage failed',
        ErrorCode.CACHE_ERROR,
        { key, error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  invalidate(pattern?: string): void {
    try {
      if (!pattern) {
        // Clear everything
        this.clear();
        return;
      }

      // Clear memory cache entries matching pattern
      const regex = new RegExp(pattern);
      for (const key of this.memoryCache.keys()) {
        if (regex.test(key)) {
          const entry = this.memoryCache.get(key);
          if (entry) {
            this.currentMemorySize -= this.estimateSize(entry.data);
          }
          this.memoryCache.delete(key);
        }
      }

      // Clear persistent cache entries matching pattern
      if (typeof window !== 'undefined') {
        const keysToDelete: string[] = [];
        for (let i = 0; i < this.persistentCache.length; i++) {
          const key = this.persistentCache.key(i);
          if (key && regex.test(key)) {
            keysToDelete.push(key);
          }
        }
        keysToDelete.forEach(key => this.persistentCache.removeItem(key));
      }
    } catch (error) {
      throw new DataServiceError(
        'Cache invalidation failed',
        ErrorCode.CACHE_ERROR,
        { pattern, error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  clear(): void {
    try {
      this.memoryCache.clear();
      this.currentMemorySize = 0;
      this.persistentCache.clear();
    } catch (error) {
      throw new DataServiceError(
        'Cache clear failed',
        ErrorCode.CACHE_ERROR,
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  // ===== PRIVATE METHODS =====

  private isValidEntry(entry: CacheEntry): boolean {
    const now = Date.now();
    return (now - entry.timestamp) < entry.ttl;
  }

  private setMemoryCache<T>(key: string, value: T, ttl: number): void {
    const dataSize = this.estimateSize(value);
    
    // Check if we need to evict old entries (LRU-style)
    if (this.currentMemorySize + dataSize > this.config.maxMemorySize) {
      this.evictLeastRecentlyUsed(dataSize);
    }

    this.memoryCache.set(key, {
      data: value,
      timestamp: Date.now(),
      ttl
    });
    this.currentMemorySize += dataSize;
  }

  private setPersistentCache<T>(key: string, entry: CacheEntry<T>, shouldCompress: boolean): void {
    try {
      let dataToStore = JSON.stringify(entry);
      
      // Simple compression for large data (you could implement more sophisticated compression)
      if (shouldCompress && typeof window !== 'undefined' && 'CompressionStream' in window) {
        // Note: CompressionStream is not widely supported yet, so we'll skip actual compression
        // In production, you might want to use a library like pako for compression
      }

      this.persistentCache.setItem(key, dataToStore);
    } catch (error) {
      // If storage is full or fails, silently continue (graceful degradation)
      console.warn('Persistent cache storage failed:', error);
    }
  }

  private evictLeastRecentlyUsed(spaceNeeded: number): void {
    // Simple LRU eviction - remove oldest entries until we have enough space
    const entries = Array.from(this.memoryCache.entries());
    entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);

    let freedSpace = 0;
    for (const [key, entry] of entries) {
      if (freedSpace >= spaceNeeded) break;
      
      freedSpace += this.estimateSize(entry.data);
      this.memoryCache.delete(key);
    }
    
    this.currentMemorySize -= freedSpace;
  }

  private estimateSize(obj: any): number {
    // Simple size estimation - in production you might want a more accurate method
    try {
      return JSON.stringify(obj).length * 2; // Rough estimate: 2 bytes per character
    } catch {
      return 1024; // Default fallback size
    }
  }

  // ===== PUBLIC UTILITY METHODS =====

  getStats() {
    return {
      memoryCacheSize: this.memoryCache.size,
      memoryUsage: this.currentMemorySize,
      maxMemorySize: this.config.maxMemorySize,
      memoryUsagePercent: (this.currentMemorySize / this.config.maxMemorySize) * 100
    };
  }

  warmUp(keys: string[]): Promise<void[]> {
    // Pre-load specific cache keys for better performance
    return Promise.all(keys.map(key => 
      new Promise<void>(resolve => {
        this.get(key);
        resolve();
      })
    ));
  }
}

// ===== DEFAULT CACHE CONFIGURATION =====

export const defaultCacheConfig: CacheConfig = {
  memoryTTL: 5 * 60 * 1000,          // 5 minutes
  persistentTTL: 30 * 60 * 1000,     // 30 minutes
  maxMemorySize: 10 * 1024 * 1024,   // 10MB
  compressionThreshold: 100 * 1024    // 100KB
};

// ===== SINGLETON CACHE INSTANCE =====

let globalCacheInstance: HybridCacheStrategy | null = null;

export function getCacheInstance(config: CacheConfig = defaultCacheConfig): HybridCacheStrategy {
  if (!globalCacheInstance) {
    globalCacheInstance = new HybridCacheStrategy(config);
  }
  return globalCacheInstance;
}