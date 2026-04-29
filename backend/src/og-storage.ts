// backend/src/og-storage.ts
// ============================================================================
// 0G Storage Interface — KV Store + Log Store
// ============================================================================
//
// 0G Network provides two storage primitives:
//
// 1. **0G KV Store** — key-value storage (agent profiles, session data)
//    - Self-hosted: Run `0g-storage-kv` node locally
//    - GitHub: https://github.com/0gfoundation/0g-storage-kv
//    - Default: http://localhost:8080
//
// 2. **0G Log Store** — append-only log (deliberation history, verification logs)
//    - Self-hosted: Run `0g-storage-node` locally
//    - GitHub: https://github.com/0gfoundation/0g-storage-node
//    - Default: http://localhost:8081
//
// When 0G services are unreachable, ALL operations automatically fall back
// to in-memory storage so the application always works.
//
// How to run 0G Storage locally:
//   1. Clone https://github.com/0gfoundation/0g-storage-node
//   2. cargo build --release
//   3. Configure RPC endpoint (evmrpc-testnet.0g.ai)
//   4. ./target/release/zgs_node --config run/config.toml
//
//   Then clone https://github.com/0gfoundation/0g-storage-kv
//   and run similarly for KV operations.
//
// ============================================================================

import fetch from "node-fetch";

export class OGStorage {
  private kvEndpoint: string;
  private logEndpoint: string;
  private useInMemory: boolean = false;

  // In-memory fallback stores
  private memoryKV: Map<string, any> = new Map();
  private memoryLog: Map<string, any[]> = new Map();

  // Metrics
  private metrics = {
    kv_writes: 0,
    kv_reads: 0,
    log_appends: 0,
    log_reads: 0,
    fallback_count: 0,
  };

  constructor(kvEndpoint: string, logEndpoint: string) {
    this.kvEndpoint = kvEndpoint;
    this.logEndpoint = logEndpoint;
  }

  // ========================================================================
  // Initialization
  // ========================================================================

  /**
   * Probe 0G services. Falls back to in-memory if unreachable.
   */
  async initialize(): Promise<void> {
    const isHealthy = await this.healthCheck();
    if (!isHealthy) {
      console.log(
        "[0G Storage] ⚠ External 0G services unavailable — using in-memory fallback"
      );
      console.log(
        "[0G Storage]   To connect: run 0g-storage-node (Log) and 0g-storage-kv (KV) locally"
      );
      console.log(
        "[0G Storage]   Docs: https://github.com/0gfoundation/0g-storage-node"
      );
      this.useInMemory = true;
    } else {
      console.log("[0G Storage] ✓ Connected to external 0G services");
      console.log(`[0G Storage]   KV:  ${this.kvEndpoint}`);
      console.log(`[0G Storage]   Log: ${this.logEndpoint}`);
    }
  }

  /**
   * Returns whether we're using in-memory fallback
   */
  isUsingFallback(): boolean {
    return this.useInMemory;
  }

  // ========================================================================
  // KV Store Operations — key-value storage
  // ========================================================================

  /**
   * Set a value in the 0G KV store
   * Used for: agent profiles, session metadata, breeding records
   */
  async setKV(key: string, value: any): Promise<boolean> {
    this.metrics.kv_writes++;
    const serialized =
      typeof value === "string" ? value : JSON.parse(JSON.stringify(value));

    if (this.useInMemory) {
      this.memoryKV.set(key, serialized);
      console.log(`[0G KV:mem] SET: ${key}`);
      return true;
    }

    try {
      const response = await fetch(`${this.kvEndpoint}/kv/set`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          value: typeof value === "string" ? value : JSON.stringify(value),
        }),
      } as any);

      if (response.ok) {
        // Also cache in memory for fast reads
        this.memoryKV.set(key, serialized);
        console.log(`[0G KV] SET: ${key}`);
        return true;
      }
      // Fall back to memory on HTTP error
      this.memoryKV.set(key, serialized);
      this.metrics.fallback_count++;
      return true;
    } catch (error) {
      // Silent fallback to memory on network error
      this.memoryKV.set(key, serialized);
      this.metrics.fallback_count++;
      console.log(`[0G KV:mem] SET (fallback): ${key}`);
      return true;
    }
  }

  /**
   * Get a value from the 0G KV store
   */
  async getKV(key: string): Promise<any> {
    this.metrics.kv_reads++;

    if (this.useInMemory) {
      const value = this.memoryKV.get(key);
      return value !== undefined ? value : null;
    }

    try {
      const response = await fetch(`${this.kvEndpoint}/kv/get`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      } as any);

      if (response.ok) {
        const data = (await response.json()) as any;
        const value = data.value;

        try {
          const parsed = typeof value === "string" ? JSON.parse(value) : value;
          // Update memory cache
          this.memoryKV.set(key, parsed);
          return parsed;
        } catch {
          this.memoryKV.set(key, value);
          return value;
        }
      }
      // Fall back to memory
      return this.memoryKV.get(key) || null;
    } catch (error) {
      return this.memoryKV.get(key) || null;
    }
  }

  /**
   * Delete a key from the 0G KV store
   */
  async deleteKV(key: string): Promise<boolean> {
    if (this.useInMemory) {
      this.memoryKV.delete(key);
      return true;
    }

    try {
      const response = await fetch(`${this.kvEndpoint}/kv/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      } as any);

      this.memoryKV.delete(key);
      return response.ok;
    } catch (error) {
      this.memoryKV.delete(key);
      return true;
    }
  }

  /**
   * List all keys matching a prefix
   * Used for: listing all agents, all sessions, etc.
   */
  async listKeys(prefix: string): Promise<string[]> {
    const keys: string[] = [];
    for (const key of this.memoryKV.keys()) {
      if (key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * Get all KV entries matching a prefix
   */
  async getAllByPrefix(prefix: string): Promise<Array<{ key: string; value: any }>> {
    const results: Array<{ key: string; value: any }> = [];
    for (const [key, value] of this.memoryKV.entries()) {
      if (key.startsWith(prefix)) {
        results.push({ key, value });
      }
    }
    return results;
  }

  // ========================================================================
  // Log Store Operations — append-only event log
  // ========================================================================

  /**
   * Append an entry to the 0G Log store
   * Used for: deliberation logs, verification proofs, breeding history
   */
  async appendLog(logName: string, entry: any): Promise<boolean> {
    this.metrics.log_appends++;

    const entryWithTimestamp = {
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString(),
    };

    if (this.useInMemory) {
      if (!this.memoryLog.has(logName)) {
        this.memoryLog.set(logName, []);
      }
      this.memoryLog.get(logName)!.push(entryWithTimestamp);
      console.log(`[0G Log:mem] APPEND: ${logName}`);
      return true;
    }

    try {
      const response = await fetch(`${this.logEndpoint}/log/append`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          log: logName,
          entry:
            typeof entryWithTimestamp === "string"
              ? entryWithTimestamp
              : JSON.stringify(entryWithTimestamp),
        }),
      } as any);

      if (response.ok) {
        // Also keep in memory for fast reads
        if (!this.memoryLog.has(logName)) {
          this.memoryLog.set(logName, []);
        }
        this.memoryLog.get(logName)!.push(entryWithTimestamp);
        console.log(`[0G Log] APPEND: ${logName}`);
        return true;
      }
      // Fallback
      if (!this.memoryLog.has(logName)) {
        this.memoryLog.set(logName, []);
      }
      this.memoryLog.get(logName)!.push(entryWithTimestamp);
      this.metrics.fallback_count++;
      return true;
    } catch (error) {
      if (!this.memoryLog.has(logName)) {
        this.memoryLog.set(logName, []);
      }
      this.memoryLog.get(logName)!.push(entryWithTimestamp);
      this.metrics.fallback_count++;
      console.log(`[0G Log:mem] APPEND (fallback): ${logName}`);
      return true;
    }
  }

  /**
   * Read entries from the 0G Log store
   */
  async getLog(logName: string, limit: number = 100): Promise<any[]> {
    this.metrics.log_reads++;

    if (this.useInMemory) {
      const entries = this.memoryLog.get(logName) || [];
      return entries.slice(-limit);
    }

    try {
      const response = await fetch(`${this.logEndpoint}/log/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log: logName, limit }),
      } as any);

      if (response.ok) {
        const data = (await response.json()) as any;
        const entries = data.entries || [];

        return entries.map((entry: any) => {
          try {
            return typeof entry === "string" ? JSON.parse(entry) : entry;
          } catch {
            return entry;
          }
        });
      }
      return (this.memoryLog.get(logName) || []).slice(-limit);
    } catch (error) {
      return (this.memoryLog.get(logName) || []).slice(-limit);
    }
  }

  // ========================================================================
  // Utility
  // ========================================================================

  async healthCheck(): Promise<boolean> {
    try {
      const kvResponse = await fetch(`${this.kvEndpoint}/health`, {
        timeout: 3000,
      } as any);
      const logResponse = await fetch(`${this.logEndpoint}/health`, {
        timeout: 3000,
      } as any);

      return kvResponse.ok && logResponse.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get comprehensive storage stats
   */
  getStats() {
    return {
      mode: this.useInMemory ? "in-memory-fallback" : "0g-external",
      endpoints: {
        kv: this.kvEndpoint,
        log: this.logEndpoint,
      },
      kv_keys: this.memoryKV.size,
      log_streams: this.memoryLog.size,
      log_total_entries: Array.from(this.memoryLog.values()).reduce(
        (sum, arr) => sum + arr.length,
        0
      ),
      metrics: this.metrics,
    };
  }
}