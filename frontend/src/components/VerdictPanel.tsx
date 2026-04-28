import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'

interface VerdictData {
    feasibility: number
    safety: number
    legality: number
    cost_efficiency: number
    overall_score: number
    decision: 'APPROVE' | 'REVISE'
    feedback: string
}

interface VerdictPanelProps {
    verdict?: VerdictData
    loading?: boolean
}

export default function VerdictPanel({ verdict, loading }: VerdictPanelProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || !verdict) {
        return (
            <div className="glass-effect rounded-xl p-6">
                <div className="text-center py-8 text-slate-400">
                    {loading ? 'Evaluating verdict...' : 'Awaiting critic evaluation'}
                </div>
            </div>
        )
    }

    const isApproved = verdict.decision === 'APPROVE'
    const scores = [
        { label: 'Feasibility', value: verdict.feasibility },
        { label: 'Safety', value: verdict.safety },
        { label: 'Legality', value: verdict.legality },
        { label: 'Efficiency', value: verdict.cost_efficiency },
    ]

    return (
        <div className="glass-effect rounded-xl p-6 border border-slate-700/50">
            {/* Decision Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                    {isApproved ? (
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                    ) : (
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-yellow-400" />
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-semibold text-white">Critic Verdict</h3>
                        <p
                            className={`text-sm ${isApproved ? 'text-green-400' : 'text-yellow-400'
                                }`}
                        >
                            {isApproved ? '✓ APPROVED' : '⚠ REQUIRES REVISION'}
                        </p>
                    </div>
                </div>

                {/* Overall Score */}
                <div className="text-4xl font-bold text-blue-400 mb-2">
                    {verdict.overall_score.toFixed(1)}%
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                        style={{ width: `${verdict.overall_score}%` }}
                    />
                </div>
            </div>

            {/* Individual Scores */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {scores.map((score) => (
                    <div key={score.label} className="bg-slate-900/50 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-2">{score.label}</p>
                        <p className="text-2xl font-bold text-white mb-2">{score.value}%</p>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                style={{ width: `${score.value}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Feedback */}
            {verdict.feedback && (
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                    <p className="text-xs text-slate-400 mb-2">Feedback</p>
                    <p className="text-sm text-slate-200">{verdict.feedback}</p>
                </div>
            )}
        </div>
    )
}
