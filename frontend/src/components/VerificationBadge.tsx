import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, ShieldCheck, Copy, Check, Database, Cpu, Lock, ExternalLink } from 'lucide-react'
import { getExplorerTxUrl, getExplorerAddressUrl, getChainInfo } from '../services/blockchain'

interface VerificationData {
    verified: boolean
    confidence: number
    proof?: string
    timestamp?: string
    computeHash?: string
    message?: string
    verificationSource?: '0g-compute' | 'local-simulation'
    teeVerified?: boolean
    providerAddress?: string
    decision_confidence?: number
    feasibility_verified?: number
    safety_verified?: number
    legality_verified?: number
    cost_verified?: number
    overall_verification?: number
}

interface VerificationProps {
    verification: VerificationData
    txHash?: string
    tokenId?: number
}

export default function VerificationBadge({ verification, txHash, tokenId }: VerificationProps) {
    const [copied, setCopied] = useState<string | null>(null)
    const chainInfo = getChainInfo()
    const [animatedScores, setAnimatedScores] = useState({
        feasibility: 0, safety: 0, legality: 0, cost: 0,
    })

    const {
        verified, confidence, proof, computeHash, message,
        verificationSource, teeVerified, providerAddress,
        feasibility_verified, safety_verified, legality_verified, cost_verified,
    } = verification

    const is0G = verificationSource === '0g-compute'

    // Animate scores on mount
    useEffect(() => {
        const duration = 1000
        const start = Date.now()
        const targets = {
            feasibility: feasibility_verified || 0,
            safety: safety_verified || 0,
            legality: legality_verified || 0,
            cost: cost_verified || 0,
        }
        const animate = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setAnimatedScores({
                feasibility: Math.round(targets.feasibility * eased),
                safety: Math.round(targets.safety * eased),
                legality: Math.round(targets.legality * eased),
                cost: Math.round(targets.cost * eased),
            })
            if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
    }, [feasibility_verified, safety_verified, legality_verified, cost_verified])

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const truncateHash = (hash: string, chars: number = 12) => {
        if (hash.length <= chars * 2 + 3) return hash
        return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`
    }

    const dimensionScores = [
        { label: 'Feasibility', value: animatedScores.feasibility, target: feasibility_verified || 0, color: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/20' },
        { label: 'Safety', value: animatedScores.safety, target: safety_verified || 0, color: 'from-emerald-500 to-teal-500', glow: 'shadow-emerald-500/20' },
        { label: 'Legality', value: animatedScores.legality, target: legality_verified || 0, color: 'from-purple-500 to-violet-500', glow: 'shadow-purple-500/20' },
        { label: 'Cost Efficiency', value: animatedScores.cost, target: cost_verified || 0, color: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/20' },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-6 sm:p-8 space-y-5"
        >
            {/* ── Header: 0G Verification Badge ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                        className={`p-3 rounded-xl border ${
                            verified
                                ? 'bg-emerald-500/10 border-emerald-500/15'
                                : 'bg-yellow-500/10 border-yellow-500/15'
                        }`}
                    >
                        {verified ? (
                            <ShieldCheck className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                        ) : (
                            <Shield className="w-6 h-6 text-yellow-400" />
                        )}
                    </motion.div>
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            0G Verification
                            {verified && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3, type: 'spring' }}
                                    className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/10"
                                >
                                    ✓ VERIFIED
                                </motion.span>
                            )}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                            {is0G ? '0G Compute Network — TEE Inference' : '0G Compute — Simulation Fallback'}
                        </p>
                    </div>
                </div>

                {/* Confidence Score */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="sm:ml-auto bg-[#040810] rounded-2xl px-6 py-3 border border-slate-700/15 text-center"
                >
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Confidence</p>
                    <p className={`text-3xl font-black tabular-nums tracking-tight ${
                        confidence >= 80 ? 'text-emerald-400' : confidence >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                        {confidence}<span className="text-lg font-bold text-slate-600">%</span>
                    </p>
                </motion.div>
            </div>

            {/* ── Source Badges Row ── */}
            <div className="flex flex-wrap items-center gap-2">
                {/* TEE Badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${
                    teeVerified
                        ? 'bg-emerald-500/6 border-emerald-500/12 text-emerald-400'
                        : 'bg-blue-500/6 border-blue-500/12 text-blue-400'
                }`}>
                    <Lock className="w-3 h-3" />
                    {teeVerified ? 'TEE Verified' : 'Simulation Mode'}
                </div>

                {/* Verification Source */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border bg-purple-500/6 border-purple-500/12 text-purple-400">
                    <Cpu className="w-3 h-3" />
                    {is0G ? '0G Router API (TEE)' : '0G Compute (Simulated)'}
                </div>

                {/* Chain Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border bg-indigo-500/6 border-indigo-500/12 text-indigo-400">
                    <Database className="w-3 h-3" />
                    {chainInfo.name} (ID: {chainInfo.chainId})
                </div>

                {/* Stored in 0G Log */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border bg-cyan-500/6 border-cyan-500/12 text-cyan-400">
                    <Database className="w-3 h-3" />
                    Stored in 0G Log
                </div>
            </div>

            {/* ── 4-Dimension Verification Scores ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {dimensionScores.map((dim, idx) => (
                    <motion.div
                        key={dim.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.08 }}
                        whileHover={{ y: -3 }}
                        className="bg-[#040810] rounded-xl p-4 border border-slate-700/15 group"
                    >
                        <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mb-1">{dim.label}</p>
                        <p className="text-2xl font-bold text-white mb-2.5 group-hover:text-blue-300 transition-colors tabular-nums">{dim.value}%</p>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${dim.target}%` }}
                                transition={{ duration: 1, delay: 0.4 + idx * 0.1 }}
                                className={`h-full bg-gradient-to-r ${dim.color} rounded-full`}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── SHA-256 Proof Hash ── */}
            {proof && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-[#040810] rounded-xl p-4 sm:p-5 border border-slate-700/15 space-y-3"
                >
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                            <Shield className="w-3 h-3" />
                            SHA-256 Cryptographic Proof Hash
                        </p>
                        <button
                            onClick={() => copyToClipboard(proof, 'proof')}
                            className="p-1.5 rounded-lg hover:bg-white/[0.04] transition-all group"
                            title="Copy proof hash"
                        >
                            {copied === 'proof' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                                <Copy className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                            )}
                        </button>
                    </div>
                    <div className="bg-[#020408] rounded-lg p-3 border border-slate-800/50">
                        <p className="text-sm font-mono text-emerald-400/90 break-all leading-relaxed tracking-wide">
                            {proof}
                        </p>
                    </div>
                    <p className="text-[10px] text-slate-700 italic">
                        This proof is stored in 0G Log storage — creating an immutable, verifiable audit trail.
                    </p>
                </motion.div>
            )}

            {/* ── Transaction Hash (if available) ── */}
            {txHash && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="bg-[#040810] rounded-xl p-4 sm:p-5 border border-slate-700/15 space-y-3"
                >
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                            <ExternalLink className="w-3 h-3" />
                            On-Chain Transaction (0G Galileo)
                        </p>
                        <a
                            href={getExplorerTxUrl(txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                        >
                            View on Explorer <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                    <div className="bg-[#020408] rounded-lg p-3 border border-slate-800/50">
                        <p className="text-sm font-mono text-blue-400/90 break-all leading-relaxed tracking-wide">
                            {txHash}
                        </p>
                    </div>
                    {tokenId && (
                        <p className="text-[10px] text-slate-600">
                            iNFT Token ID: <span className="text-blue-400 font-mono font-bold">#{tokenId}</span>
                        </p>
                    )}
                </motion.div>
            )}

            {/* ── Compute Hash + Provider ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {computeHash && (
                    <div className="bg-[#040810] rounded-xl p-3.5 border border-slate-700/15">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Compute Hash</p>
                            <button
                                onClick={() => copyToClipboard(computeHash, 'compute')}
                                className="p-1 rounded-lg hover:bg-white/[0.04] transition-all"
                            >
                                {copied === 'compute' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-600" />}
                            </button>
                        </div>
                        <p className="text-xs font-mono text-slate-400 mt-1.5 truncate">{computeHash}</p>
                    </div>
                )}

                {providerAddress && (
                    <div className="bg-[#040810] rounded-xl p-3.5 border border-slate-700/15">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Provider / Router</p>
                            {providerAddress.startsWith('0x') && providerAddress.length === 42 && (
                                <a
                                    href={getExplorerAddressUrl(providerAddress)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                        <p className="text-xs font-mono text-slate-400 mt-1.5 truncate">{providerAddress === '0g-router' ? '0G Router API (auto-routed)' : truncateHash(providerAddress)}</p>
                    </div>
                )}
            </div>

            {/* ── Message ── */}
            {message && (
                <div className="flex items-start gap-2.5 text-xs text-slate-500 bg-[#040810] rounded-xl p-3.5 border border-slate-700/15">
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-600" />
                    <p className="leading-relaxed">{message}</p>
                </div>
            )}
        </motion.div>
    )
}
