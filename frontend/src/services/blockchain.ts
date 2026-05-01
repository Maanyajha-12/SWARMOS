// frontend/src/services/blockchain.ts
// Lightweight service to read data from 0G Galileo Testnet directly
// Works without the backend — reads contract events and state from the chain

const BLOCK_EXPLORER = import.meta.env.VITE_BLOCK_EXPLORER || 'https://chainscan-galileo.0g.ai'
const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://evmrpc-testnet.0g.ai'
const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || '16602')

// Contract addresses (set after deployment)
const CONTRACTS = {
  deliberationINFT: import.meta.env.VITE_INFT_CONTRACT || '0x0000000000000000000000000000000000000000',
  agentRegistry: import.meta.env.VITE_AGENT_REGISTRY_CONTRACT || '0x0000000000000000000000000000000000000000',
  proofOfIntelligence: import.meta.env.VITE_POI_CONTRACT || '0x0000000000000000000000000000000000000000',
  tournamentArena: import.meta.env.VITE_TOURNAMENT_CONTRACT || '0x0000000000000000000000000000000000000000',
  crossChainBridge: import.meta.env.VITE_BRIDGE_CONTRACT || '0x0000000000000000000000000000000000000000',
}

// ============================================================================
// Explorer Links
// ============================================================================

export function getExplorerTxUrl(txHash: string): string {
  return `${BLOCK_EXPLORER}/tx/${txHash}`
}

export function getExplorerAddressUrl(address: string): string {
  return `${BLOCK_EXPLORER}/address/${address}`
}

export function getExplorerBlockUrl(block: number | string): string {
  return `${BLOCK_EXPLORER}/block/${block}`
}

// ============================================================================
// Chain Info
// ============================================================================

export function getChainInfo() {
  return {
    chainId: CHAIN_ID,
    name: '0G Galileo Testnet',
    rpcUrl: RPC_URL,
    explorer: BLOCK_EXPLORER,
    faucet: 'https://faucet.0g.ai',
    currency: { name: '0G', symbol: '0G', decimals: 18 },
  }
}

export function getContractAddresses() {
  return CONTRACTS
}

// ============================================================================
// Simple RPC calls (no ethers.js dependency needed)
// ============================================================================

async function rpcCall(method: string, params: any[]): Promise<any> {
  try {
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params,
      }),
    })
    const data = await response.json()
    if (data.error) {
      console.warn(`[Chain] RPC error: ${data.error.message}`)
      return null
    }
    return data.result
  } catch (error) {
    console.warn('[Chain] RPC call failed:', error)
    return null
  }
}

/**
 * Get the current block number on 0G Galileo
 */
export async function getBlockNumber(): Promise<number | null> {
  const result = await rpcCall('eth_blockNumber', [])
  return result ? parseInt(result, 16) : null
}

/**
 * Get a transaction receipt from the chain
 */
export async function getTransactionReceipt(txHash: string): Promise<any | null> {
  return rpcCall('eth_getTransactionReceipt', [txHash])
}

/**
 * Get the balance of an address (in wei)
 */
export async function getBalance(address: string): Promise<string | null> {
  const result = await rpcCall('eth_getBalance', [address, 'latest'])
  if (!result) return null
  const wei = BigInt(result)
  const eth = Number(wei) / 1e18
  return eth.toFixed(6)
}

/**
 * Check if a contract is deployed at an address
 */
export async function isContractDeployed(address: string): Promise<boolean> {
  if (address === '0x0000000000000000000000000000000000000000') return false
  const code = await rpcCall('eth_getCode', [address, 'latest'])
  return code !== null && code !== '0x' && code !== '0x0'
}

/**
 * Get chain status — health check for the 0G testnet
 */
export async function getChainStatus(): Promise<{
  connected: boolean
  blockNumber: number | null
  chainId: number | null
}> {
  try {
    const [blockHex, chainIdHex] = await Promise.all([
      rpcCall('eth_blockNumber', []),
      rpcCall('eth_chainId', []),
    ])
    return {
      connected: blockHex !== null,
      blockNumber: blockHex ? parseInt(blockHex, 16) : null,
      chainId: chainIdHex ? parseInt(chainIdHex, 16) : null,
    }
  } catch {
    return { connected: false, blockNumber: null, chainId: null }
  }
}

// ============================================================================
// Contract deployment verification
// ============================================================================

export async function verifyAllContracts(): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {}
  for (const [name, address] of Object.entries(CONTRACTS)) {
    results[name] = await isContractDeployed(address)
  }
  return results
}

// ============================================================================
// Export config
// ============================================================================

export const CHAIN_CONFIG = {
  chainId: CHAIN_ID,
  rpcUrl: RPC_URL,
  explorer: BLOCK_EXPLORER,
  contracts: CONTRACTS,
}
