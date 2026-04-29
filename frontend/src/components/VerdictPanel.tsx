import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Shield } from 'lucide-react'

interface VerdictData {
    feasibility: number; safety: number; legality: number; cost_efficiency: number
    overall_score: number; decision: 'APPROVE' | 'REVISE'; feedback: string
}

export default function VerdictPanel({ verdict, loading }: { verdict?: VerdictData; loading?: boolean }) {
    const [mounted, setMounted] = useState(false)
    const [animatedScore, setAnimatedScore] = useState(0)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (!verdict) return
        const target = verdict.overall_score
        const duration = 1200; const start = Date.now()
        const animate = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setAnimatedScore(Math.round(target * eased * 10) / 10)
            if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
    }, [verdict])

    if (!mounted || !verdict) return (
        <div className="glass-card p-6"><div className="text-center py-10 text-slate-500"><Shield className="w-8 h-8 mx-auto mb-3 text-slate-700" /><p className="font-medium">{loading ? 'Evaluating verdict...' : 'Awaiting critic evaluation'}</p></div></div>
    )

    const isApproved = verdict.decision === 'APPROVE'
    const scores = [
        { label: 'Feasibility', value: verdict.feasibility, color: 'from-blue-500 to-cyan-500' },
        { label: 'Safety', value: verdict.safety, color: 'from-emerald-500 to-teal-500' },
        { label: 'Legality', value: verdict.legality, color: 'from-purple-500 to-violet-500' },
        { label: 'Efficiency', value: verdict.cost_efficiency, color: 'from-amber-500 to-orange-500' },
    ]

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="glass-card p-6 sm:p-8">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    {isApproved ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/10">
                            <CheckCircle className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </motion.div>
                    ) : (
                        <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/10"><AlertCircle className="w-6 h-6 text-yellow-400" /></div>
                    )}
                    <div>
                        <h3 className="text-lg font-bold text-white">Critic Verdict</h3>
                        <p className={`text-sm font-semibold ${isApproved ? 'text-emerald-400' : 'text-yellow-400'}`}>{isApproved ? '✓ APPROVED' : '⚠ REQUIRES REVISION'}</p>
                    </div>
                </div>

                <div className="bg-[#040810] rounded-2xl p-5 border border-slate-700/15">
                    <div className="flex items-end gap-2 mb-3">
                        <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tabular-nums tracking-tight">{animatedScore.toFixed(1)}</span>
                        <span className="text-2xl font-bold text-slate-600 mb-1">%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${verdict.overall_score}%` }} transition={{ duration: 1.2, ease: [0.16,1,0.3,1] }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {scores.map((score, idx) => (
                    <motion.div key={score.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + idx * 0.08 }}
                        whileHover={{ y: -3 }} className="bg-[#040810] rounded-xl p-4 border border-slate-700/15 group"
                    >
                        <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mb-1">{score.label}</p>
                        <p className="text-2xl font-bold text-white mb-2.5 group-hover:text-blue-300 transition-colors tabular-nums">{score.value}%</p>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${score.value}%` }} transition={{ duration: 1, delay: 0.4 + idx * 0.1 }}
                                className={`h-full bg-gradient-to-r ${score.color} rounded-full`} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {verdict.feedback && (
                <div className="bg-[#040810] rounded-xl p-4 sm:p-5 border border-slate-700/15">
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mb-2">Critic Feedback</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{verdict.feedback}</p>
                </div>
            )}

            {(verdict as any).improvements?.length > 0 && (
                <div className="bg-[#040810] rounded-xl p-4 sm:p-5 border border-slate-700/15">
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mb-2.5">Suggested Improvements</p>
                    <div className="space-y-1.5">
                        {(verdict as any).improvements.map((imp: string, i: number) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                <span className="text-blue-400 mt-0.5 flex-shrink-0">→</span>
                                <span>{imp}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    )
}
