import { useEffect, useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface ExecutionData {
    tx_hash: string
    status: 'success' | 'failed' | 'simulated'
    gas_used: number
    cost_usd: number
    block: number
    timestamp: string
    verification_proof?: string
}

interface ExecutorPanelProps {
    execution?: ExecutionData
    loading?: boolean
}

export default function ExecutorPanel({ execution, loading }: ExecutorPanelProps) {
    const [copied, setCopied] = useState<string | null>(null)

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    if (!execution) {
        return (
            <div className="glass-effect rounded-xl p-6">
                <div className="text-center py-8 text-slate-400">
                    {loading ? 'Executing plan...' : 'Awaiting execution'}
                </div>
            </div>
        )
    }

    const statusColor = {
        success: 'text-green-400 bg-green-500/10',
        failed: 'text-red-400 bg-red-500/10',
        simulated: 'text-blue-400 bg-blue-500/10',
    }

    return (
        <div className="glass-effect rounded-xl p-6 border border-slate-700/50 space-y-4">
            {/* Status */}
            <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[execution.status]}`}>
                    {execution.status.toUpperCase()}
                </div>
            </div>

            {/* Transaction Details Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-2">Gas Used</p>
                    <p className="text-xl font-bold text-white">{execution.gas_used.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-2">Cost</p>
                    <p className="text-xl font-bold text-white">${execution.cost_usd.toFixed(2)}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-2">Block</p>
                    <p className="text-xl font-bold text-white">{execution.block || 'N/A'}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-2">Timestamp</p>
                    <p className="text-sm font-mono text-white">
                        {new Date(execution.timestamp).toLocaleTimeString()}
                    </p>
                </div>
            </div>

            {/* Transaction Hash */}
            <div>
                <p className="text-xs text-slate-400 mb-2">Transaction Hash</p>
                <div className="bg-slate-900/50 rounded-lg p-3 flex items-center justify-between group">
                    <p className="text-sm font-mono text-slate-300 truncate">{execution.tx_hash}</p>
                    <button
                        onClick={() => copyToClipboard(execution.tx_hash, 'tx')}
                        className="ml-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        {copied === 'tx' ? (
                            <Check className="w-4 h-4 text-green-400" />
                        ) : (
                            <Copy className="w-4 h-4 text-slate-400 hover:text-slate-300" />
                        )}
                    </button>
                </div>
            </div>

            {/* Verification Proof */}
            {execution.verification_proof && (
                <div>
                    <p className="text-xs text-slate-400 mb-2">Verification Proof</p>
                    <div className="bg-slate-900/50 rounded-lg p-3 flex items-center justify-between group">
                        <p className="text-sm font-mono text-slate-300 truncate">
                            {execution.verification_proof}
                        </p>
                        <button
                            onClick={() => copyToClipboard(execution.verification_proof || '', 'proof')}
                            className="ml-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            {copied === 'proof' ? (
                                <Check className="w-4 h-4 text-green-400" />
                            ) : (
                                <Copy className="w-4 h-4 text-slate-400 hover:text-slate-300" />
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
