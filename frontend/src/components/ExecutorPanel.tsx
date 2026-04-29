import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Cpu, Hash, Clock, Fuel } from 'lucide-react'

interface ExecutionData {
    tx_hash: string; status: 'success' | 'failed' | 'simulated'
    gas_used: number; cost_usd: number; block: number; timestamp: string; verification_proof?: string
}

export default function ExecutorPanel({ execution, loading }: { execution?: ExecutionData; loading?: boolean }) {
    const [copied, setCopied] = useState<string | null>(null)
    const copyToClipboard = (text: string, id: string) => { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000) }

    if (!execution) return (
        <div className="glass-card p-6"><div className="text-center py-10 text-slate-500"><Cpu className="w-8 h-8 mx-auto mb-3 text-slate-700" /><p className="font-medium">{loading ? 'Executing plan...' : 'Awaiting execution'}</p></div></div>
    )

    const statusStyles = {
        success: 'bg-emerald-500/8 text-emerald-400 border-emerald-500/15',
        failed: 'bg-red-500/8 text-red-400 border-red-500/15',
        simulated: 'bg-blue-500/8 text-blue-400 border-blue-500/15',
    }

    const stats = [
        { label: 'Gas Used', value: execution.gas_used.toLocaleString(), icon: Fuel },
        { label: 'Cost', value: `$${execution.cost_usd.toFixed(2)}`, icon: Cpu },
        { label: 'Block', value: execution.block || 'N/A', icon: Hash },
        { label: 'Time', value: new Date(execution.timestamp).toLocaleTimeString(), icon: Clock },
    ]

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="glass-card p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${statusStyles[execution.status]}`}>{execution.status.toUpperCase()}</span>
                <h3 className="font-bold text-white">Execution Result</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats.map(({ label, value, icon: Icon }, idx) => (
                    <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                        whileHover={{ y: -3 }} className="bg-[#040810] rounded-xl p-4 border border-slate-700/15 group"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                            <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">{label}</p>
                        </div>
                        <p className="text-lg font-bold text-white tabular-nums">{value}</p>
                    </motion.div>
                ))}
            </div>

            <div>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mb-2">Transaction Hash</p>
                <div className="bg-[#040810] rounded-xl p-3.5 flex items-center justify-between group border border-slate-700/15">
                    <p className="text-sm font-mono text-slate-400 truncate">{execution.tx_hash}</p>
                    <button onClick={() => copyToClipboard(execution.tx_hash, 'tx')} className="ml-3 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/[0.03] transition-all flex-shrink-0">
                        {copied === 'tx' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-500" />}
                    </button>
                </div>
            </div>

            {execution.verification_proof && (
                <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mb-2">Verification Proof</p>
                    <div className="bg-[#040810] rounded-xl p-3.5 flex items-center justify-between group border border-slate-700/15">
                        <p className="text-sm font-mono text-slate-400 truncate">{execution.verification_proof}</p>
                        <button onClick={() => copyToClipboard(execution.verification_proof || '', 'proof')} className="ml-3 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/[0.03] transition-all flex-shrink-0">
                            {copied === 'proof' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-500" />}
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
