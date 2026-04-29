import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dna, Loader, X, Sparkles } from 'lucide-react'
import TraitsDisplay from './TraitsDisplay'

interface BreedingModalProps {
    parent1: any; parent2: any; prediction: any
    onClose: () => void; onBreedComplete: () => void
}

export default function BreedingModal({ parent1, parent2, prediction, onClose, onBreedComplete }: BreedingModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleConfirmBreed = async () => {
        setLoading(true); setError('')
        try {
            const apiUrl = import.meta.env.VITE_API_URL || ''
            const response = await fetch(`${apiUrl}/api/breeding/breed`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ parent1Id: parent1.tokenId, parent2Id: parent2.tokenId }),
            })
            if (response.ok) onBreedComplete()
            else { const data = await response.json(); setError(data.error || 'Breeding failed') }
        } catch (err: any) { setError(err.message || 'Breeding failed') }
        finally { setLoading(false) }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4" onClick={onClose}
        >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="glass-card p-6 sm:p-8 max-w-2xl w-full !border-purple-500/20 neon-border-purple max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg shadow-purple-500/25">
                            <Dna className="w-5 h-5 text-white" />
                        </div>
                        <div><h2 className="text-xl font-bold text-white">Breeding Preview</h2><p className="text-[10px] text-slate-600 mt-0.5">Genetic crossover simulation</p></div>
                    </div>
                    <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="p-2.5 hover:bg-white/[0.03] rounded-xl transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                        className="bg-blue-500/[0.04] border border-blue-500/10 rounded-2xl p-4"
                    >
                        <p className="text-[10px] text-blue-400 font-semibold mb-1">Parent 1</p>
                        <p className="text-lg font-bold text-white mb-3">Agent #{parent1.tokenId}</p>
                        <TraitsDisplay traits={parent1.traits} compact />
                        <p className="text-sm text-slate-500 mt-3">Score: <span className="text-white font-bold">{parent1.score}%</span></p>
                    </motion.div>

                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                        className="flex flex-col items-center justify-center py-4 sm:py-0"
                    >
                        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-xl shadow-purple-500/30"
                        >
                            <Sparkles className="w-7 h-7 text-white" />
                        </motion.div>
                        <p className="text-[10px] text-purple-400 font-bold mt-3 uppercase tracking-wider">Crossover</p>
                        <p className="text-[9px] text-slate-600 mt-1">±5 mutation</p>
                    </motion.div>

                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                        className="bg-pink-500/[0.04] border border-pink-500/10 rounded-2xl p-4"
                    >
                        <p className="text-[10px] text-pink-400 font-semibold mb-1">Parent 2</p>
                        <p className="text-lg font-bold text-white mb-3">Agent #{parent2.tokenId}</p>
                        <TraitsDisplay traits={parent2.traits} compact />
                        <p className="text-sm text-slate-500 mt-3">Score: <span className="text-white font-bold">{parent2.score}%</span></p>
                    </motion.div>
                </div>

                <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                    className="bg-gradient-to-r from-purple-500/[0.04] to-pink-500/[0.04] border border-purple-500/10 rounded-2xl p-5 sm:p-6 mb-4"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div><p className="text-sm text-purple-400 font-bold">Predicted Offspring</p><p className="text-[10px] text-slate-600 mt-0.5">Gen {prediction.predictedGeneration}</p></div>
                        <div className="text-right bg-[#040810] rounded-xl px-4 py-2 border border-slate-700/15">
                            <p className="text-[9px] text-slate-600 uppercase tracking-wider">Score</p>
                            <p className="text-xl font-black text-purple-400 tabular-nums">{prediction.predictedScore}%</p>
                        </div>
                    </div>
                    <TraitsDisplay traits={prediction.predicted} />
                </motion.div>

                <div className="bg-[#040810] rounded-2xl p-4 sm:p-5 mb-6 border border-slate-700/15">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-slate-400 font-medium">Genetic Compatibility</span>
                        <span className="text-lg font-bold text-white tabular-nums">{prediction.compatibility}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${prediction.compatibility}%` }} transition={{ duration: 1, delay: 0.4 }}
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                    </div>
                </div>

                {error && <div className="mb-4 p-4 bg-red-500/[0.04] border border-red-500/10 rounded-xl text-sm text-red-400">{error}</div>}

                <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button whileHover={{ y: -2 }} whileTap={{ y: 0 }} onClick={handleConfirmBreed} disabled={loading}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-2.5 transition-all disabled:opacity-40 shadow-lg shadow-purple-500/20"
                    >
                        {loading ? (<><Loader className="w-4 h-4 animate-spin" />Breeding...</>) : (<><Dna className="w-4 h-4" />Confirm Breeding</>)}
                    </motion.button>
                    <button onClick={onClose} className="btn-ghost !rounded-xl !py-3.5 justify-center">Cancel</button>
                </div>
            </motion.div>
        </motion.div>
    )
}
