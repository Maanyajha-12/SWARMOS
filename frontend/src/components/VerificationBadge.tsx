import { MessageSquare, CheckCircle, AlertCircle } from 'lucide-react'

interface VerificationProps {
    confidence: number // 0-100
    verified: boolean
    proof?: string
    message?: string
}

export default function VerificationBadge({
    confidence,
    verified,
    proof,
    message,
}: VerificationProps) {
    const getConfidenceColor = (conf: number) => {
        if (conf >= 80) return 'from-green-500 to-emerald-500'
        if (conf >= 60) return 'from-yellow-500 to-orange-500'
        return 'from-red-500 to-rose-500'
    }

    const getConfidenceLabel = (conf: number) => {
        if (conf >= 80) return 'High Confidence'
        if (conf >= 60) return 'Medium Confidence'
        return 'Low Confidence'
    }

    return (
        <div className="space-y-4">
            {/* Badge */}
            <div
                className={`bg-gradient-to-r ${getConfidenceColor(
                    confidence
                )} rounded-lg p-4 text-white`}
            >
                <div className="flex items-center gap-3 mb-2">
                    {verified ? (
                        <CheckCircle className="w-6 h-6" />
                    ) : (
                        <AlertCircle className="w-6 h-6" />
                    )}
                    <div>
                        <p className="font-semibold">
                            {verified ? '✓ Verified' : '✗ Unverified'}
                        </p>
                        <p className="text-sm opacity-90">{getConfidenceLabel(confidence)}</p>
                    </div>
                </div>
            </div>

            {/* Confidence Meter */}
            <div className="glass-effect rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-300">0G Compute Confidence</p>
                    <p className="text-2xl font-bold text-white">{confidence}%</p>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${getConfidenceColor(
                            confidence
                        )} transition-all duration-300`}
                        style={{ width: `${confidence}%` }}
                    />
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className="glass-effect rounded-lg p-3 border border-slate-700/50">
                    <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-300">{message}</p>
                    </div>
                </div>
            )}

            {/* Proof Hash */}
            {proof && (
                <div className="glass-effect rounded-lg p-3 border border-slate-700/50">
                    <p className="text-xs text-slate-400 mb-1">Cryptographic Proof</p>
                    <p className="text-xs font-mono text-slate-300 break-all">{proof}</p>
                </div>
            )}
        </div>
    )
}
