import { useState } from 'react'
import { Dna, Loader, X, Sparkles } from 'lucide-react'
import TraitsDisplay from './TraitsDisplay'

interface BreedingModalProps {
    parent1: any
    parent2: any
    prediction: any
    onClose: () => void
    onBreedComplete: () => void
}

export default function BreedingModal({ parent1, parent2, prediction, onClose, onBreedComplete }: BreedingModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleConfirmBreed = async () => {
        setLoading(true)
        setError('')
        try {
            const apiUrl = import.meta.env.VITE_API_URL || ''
            const response = await fetch(`${apiUrl}/api/breeding/breed`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    parent1Id: parent1.tokenId,
                    parent2Id: parent2.tokenId,
                }),
            })

            if (response.ok) {
                onBreedComplete()
            } else {
                const data = await response.json()
                setError(data.error || 'Breeding failed')
            }
        } catch (err: any) {
            setError(err.message || 'Breeding failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="glass-effect rounded-2xl p-6 max-w-2xl w-full border border-purple-500/30 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                            <Dna className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Breeding Preview</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Parents Comparison */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {/* Parent 1 */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                        <p className="text-xs text-blue-400 font-medium mb-1">Parent 1</p>
                        <p className="text-lg font-bold text-white mb-3">Agent #{parent1.tokenId}</p>
                        <TraitsDisplay traits={parent1.traits} compact />
                        <p className="text-sm text-slate-400 mt-2">Score: <span className="text-white font-bold">{parent1.score}%</span></p>
                    </div>

                    {/* Merge Arrow */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-2">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-xs text-purple-400 font-medium">CROSSOVER</p>
                        <p className="text-xs text-slate-500 mt-1">±5 mutation</p>
                    </div>

                    {/* Parent 2 */}
                    <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-4">
                        <p className="text-xs text-pink-400 font-medium mb-1">Parent 2</p>
                        <p className="text-lg font-bold text-white mb-3">Agent #{parent2.tokenId}</p>
                        <TraitsDisplay traits={parent2.traits} compact />
                        <p className="text-sm text-slate-400 mt-2">Score: <span className="text-white font-bold">{parent2.score}%</span></p>
                    </div>
                </div>

                {/* Predicted Offspring */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-5 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm text-purple-400 font-medium">Predicted Offspring</p>
                            <p className="text-xs text-slate-500">Gen {prediction.predictedGeneration}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500">Predicted Score</p>
                            <p className="text-xl font-bold text-purple-400">{prediction.predictedScore}%</p>
                        </div>
                    </div>
                    <TraitsDisplay traits={prediction.predicted} />
                </div>

                {/* Compatibility */}
                <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Genetic Compatibility</span>
                        <span className="text-lg font-bold text-white">{prediction.compatibility}%</span>
                    </div>
                    <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                            style={{ width: `${prediction.compatibility}%` }}
                        />
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={handleConfirmBreed}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg py-3 font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Breeding...
                            </>
                        ) : (
                            <>
                                <Dna className="w-4 h-4" />
                                Confirm Breeding
                            </>
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
