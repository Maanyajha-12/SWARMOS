// backend/src/og-storage.ts
// 0G Storage Interface (KV + Log) with In-Memory Fallback
// When 0G endpoints are unreachable, data is stored in memory so the app works locally

import fetch from "node-fetch";

export class OGStorage {
  private kvEndpoint: string;
  private logEndpoint: string;
  private useInMemory: boolean = false;

  // In-memory fallback stores
  private memoryKV: Map<string, any> = new Map();
  private memoryLog: Map<string, any[]> = new Map();

  constructor(kvEndpoint: string, logEndpoint: string) {
    this.kvEndpoint = kvEndpoint;
    this.logEndpoint = logEndpoint;
  }

  /**
   * Check if 0G services are available, fall back to in-memory if not
   */
  async initialize(): Promise<void> {
    const isHealthy = await this.healthCheck();
    if (!isHealthy) {
      console.log("[0G Storage] ⚠ External 0G services unavailable — using in-memory fallback");
      this.useInMemory = true;
    } else {
      console.log("[0G Storage] ✓ Connected to external 0G services");
    }
  }

  // ========== KV Store Operations ==========

  async setKV(key: string, value: any): Promise<boolean> {
    if (this.useInMemory) {
      this.memoryKV.set(key, typeof value === "string" ? value : JSON.parse(JSON.stringify(value)));
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
        console.log(`[0G KV] SET: ${key}`);
        return true;
      }
      // Fall back to memory on failure
      this.memoryKV.set(key, typeof value === "string" ? value : JSON.parse(JSON.stringify(value)));
      return true;
    } catch (error) {
      // Silent fallback to memory
      this.memoryKV.set(key, typeof value === "string" ? value : JSON.parse(JSON.stringify(value)));
      console.log(`[0G KV:mem] SET (fallback): ${key}`);
      return true;
    }
  }

  async getKV(key: string): Promise<any> {
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

        // Try to parse as JSON
        try {
          return typeof value === "string" ? JSON.parse(value) : value;
        } catch {
          return value;
        }
      }
      // Fall back to memory
      return this.memoryKV.get(key) || null;
    } catch (error) {
      return this.memoryKV.get(key) || null;
    }
  }

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
   * List all keys matching a prefix (in-memory only for now)
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

  // ========== Log Store Operations ==========

  async appendLog(logName: string, entry: any): Promise<boolean> {
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
        console.log(`[0G Log] APPEND: ${logName}`);
        return true;
      }
      // Fallback
      if (!this.memoryLog.has(logName)) {
        this.memoryLog.set(logName, []);
      }
      this.memoryLog.get(logName)!.push(entryWithTimestamp);
      return true;
    } catch (error) {
      if (!this.memoryLog.has(logName)) {
        this.memoryLog.set(logName, []);
      }
      this.memoryLog.get(logName)!.push(entryWithTimestamp);
      console.log(`[0G Log:mem] APPEND (fallback): ${logName}`);
      return true;
    }
  }

  async getLog(logName: string, limit: number = 100): Promise<any[]> {
    if (this.useInMemory) {
      const entries = this.memoryLog.get(logName) || [];
      return entries.slice(-limit);
    }

    try {
      const response = await fetch(`${this.logEndpoint}/log/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          log: logName,
          limit,
        }),
      } as any);

      if (response.ok) {
        const data = (await response.json()) as any;
        const entries = data.entries || [];

        // Parse JSON entries
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

  // ========== Utility Methods ==========

  async healthCheck(): Promise<boolean> {
    try {
      const kvResponse = await fetch(`${this.kvEndpoint}/health`, { timeout: 3000 } as any);
      const logResponse = await fetch(`${this.logEndpoint}/health`, { timeout: 3000 } as any);

      return kvResponse.ok && logResponse.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get storage stats
   */
  getStats() {
    return {
      mode: this.useInMemory ? "in-memory" : "0g-external",
      kv_keys: this.memoryKV.size,
      log_streams: this.memoryLog.size,
      log_entries: Array.from(this.memoryLog.values()).reduce((sum, arr) => sum + arr.length, 0),
    };
  }
}