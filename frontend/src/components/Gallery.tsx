import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dna, Sparkles, Loader, RefreshCw } from 'lucide-react'
import TraitsDisplay from './TraitsDisplay'
import BreedingModal from './BreedingModal'

interface AgentProfile {
    tokenId: number; sessionId: string
    traits: { reasoning: number; creativity: number; caution: number; speed: number; accuracy: number; adaptability: number }
    generation: number; score: number; parents: [number, number]; heritage: number[]; createdAt: string; prompt?: string; decision?: string
}

export default function Gallery() {
    const [agents, setAgents] = useState<AgentProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedParent1, setSelectedParent1] = useState<AgentProfile | null>(null)
    const [selectedParent2, setSelectedParent2] = useState<AgentProfile | null>(null)
    const [showBreedingModal, setShowBreedingModal] = useState(false)
    const [prediction, setPrediction] = useState<any>(null)
    const [predicting, setPredicting] = useState(false)
    const apiUrl = import.meta.env.VITE_API_URL || ''

    const fetchAgents = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/api/gallery/agents`)
            if (response.ok) { const data = await response.json(); setAgents(data.agents || []); setError('') }
            else setError('Failed to load agents')
        } catch { setError('Backend not reachable') }
        finally { setLoading(false) }
    }, [apiUrl])

    useEffect(() => { fetchAgents() }, [fetchAgents])

    const handleCardClick = (agent: AgentProfile) => {
        if (!selectedParent1) setSelectedParent1(agent)
        else if (selectedParent1.tokenId !== agent.tokenId && !selectedParent2) setSelectedParent2(agent)
        else if (selectedParent1.tokenId === agent.tokenId) { setSelectedParent1(null); setSelectedParent2(null) }
        else if (selectedParent2?.tokenId === agent.tokenId) setSelectedParent2(null)
    }

    const handleBreedPreview = async () => {
        if (!selectedParent1 || !selectedParent2) return
        setPredicting(true)
        try {
            const response = await fetch(`${apiUrl}/api/breeding/predict/${selectedParent1.tokenId}/${selectedParent2.tokenId}`)
            if (response.ok) { const data = await response.json(); setPrediction(data); setShowBreedingModal(true) }
        } catch (err) { console.error('Prediction error:', err) }
        finally { setPredicting(false) }
    }

    const handleBreedComplete = () => { setShowBreedingModal(false); setSelectedParent1(null); setSelectedParent2(null); setPrediction(null); fetchAgents() }
    const clearSelection = () => { setSelectedParent1(null); setSelectedParent2(null) }
    const isSelected = (agent: AgentProfile) => selectedParent1?.tokenId === agent.tokenId || selectedParent2?.tokenId === agent.tokenId

    const genColors = ['from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-amber-500 to-orange-500', 'from-emerald-500 to-teal-500', 'from-red-500 to-rose-500']
    const genShadows = ['shadow-blue-500/15', 'shadow-purple-500/15', 'shadow-amber-500/15', 'shadow-emerald-500/15', 'shadow-red-500/15']

    if (loading) return <div className="flex flex-col items-center justify-center py-20 gap-4"><Loader className="w-10 h-10 animate-spin text-purple-500" /><p className="text-sm text-slate-600">Loading gallery...</p></div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="p-2.5 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-xl border border-purple-500/10">
                        <Dna className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                    </motion.div>
                    <div><h2 className="text-xl font-bold text-white tracking-tight">Agent Gallery & Breeding</h2><p className="text-xs text-slate-600 mt-0.5">Select two agents to breed a new generation</p></div>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={fetchAgents} className="btn-ghost !rounded-xl">
                    <RefreshCw className="w-4 h-4" /><span className="hidden sm:inline">Refresh</span>
                </motion.button>
            </div>

            <AnimatePresence>
                {(selectedParent1 || selectedParent2) && (
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="glass-card p-4 sm:p-5 !border-purple-500/15 neon-border-purple"
                    >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-wrap">
                                <Dna className="w-4 h-4 text-purple-400" />
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1.5 rounded-xl text-sm font-medium ${selectedParent1 ? 'bg-blue-500/10 text-blue-300 border border-blue-500/15' : 'bg-[#040810] text-slate-600 border border-slate-700/20'}`}>
                                        {selectedParent1 ? `Parent 1: #${selectedParent1.tokenId}` : 'Select Parent 1'}
                                    </span>
                                    <span className="text-slate-700 text-lg">×</span>
                                    <span className={`px-3 py-1.5 rounded-xl text-sm font-medium ${selectedParent2 ? 'bg-pink-500/10 text-pink-300 border border-pink-500/15' : 'bg-[#040810] text-slate-600 border border-slate-700/20'}`}>
                                        {selectedParent2 ? `Parent 2: #${selectedParent2.tokenId}` : 'Select Parent 2'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                {selectedParent1 && selectedParent2 && (
                                    <motion.button whileHover={{ y: -2 }} whileTap={{ y: 0 }} onClick={handleBreedPreview} disabled={predicting}
                                        className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 shadow-lg shadow-purple-500/20"
                                    >
                                        {predicting ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}Predict & Breed
                                    </motion.button>
                                )}
                                <button onClick={clearSelection} className="btn-ghost !rounded-xl">Clear</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && <div className="glass-card p-5 text-center border-yellow-500/10"><p className="text-yellow-400 text-sm">{error}</p></div>}

            {agents.length === 0 ? (
                <div className="glass-card p-16 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#040810] flex items-center justify-center border border-slate-700/15"><Dna className="w-8 h-8 text-slate-700" /></div>
                    <p className="text-slate-500 font-medium">No agents yet</p><p className="text-slate-600 text-sm mt-1">Complete a deliberation to create your first agent</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {agents.map((agent, idx) => (
                        <motion.div key={agent.tokenId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06, duration: 0.4, ease: [0.16,1,0.3,1] }}
                            whileHover={{ y: -6, transition: { duration: 0.2 } }} onClick={() => handleCardClick(agent)}
                            className={`glass-card p-5 cursor-pointer group ${isSelected(agent) ? '!border-purple-500/30 neon-border-purple' : ''}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">Agent #{agent.tokenId}</h3>
                                    <p className="text-[9px] text-slate-700 font-mono mt-0.5 truncate max-w-[120px]">{agent.sessionId}</p>
                                </div>
                                <motion.span whileHover={{ scale: 1.15 }} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r ${genColors[agent.generation % 5]} text-white shadow-md ${genShadows[agent.generation % 5]}`}>
                                    Gen {agent.generation}
                                </motion.span>
                            </div>
                            <TraitsDisplay traits={agent.traits} compact />
                            <div className="mt-4 pt-3 border-t border-slate-700/15 flex items-center justify-between">
                                <div><p className="text-[9px] text-slate-600 uppercase tracking-wider font-semibold">Score</p><p className="text-lg font-bold text-blue-400 tabular-nums">{agent.score}%</p></div>
                                {agent.decision && (
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-semibold ${agent.decision === 'APPROVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' : agent.decision === 'BRED' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/10' : 'bg-orange-500/10 text-orange-400 border border-orange-500/10'}`}>
                                        {agent.decision === 'BRED' ? '🧬 Bred' : agent.decision}
                                    </span>
                                )}
                            </div>
                            {agent.parents[0] !== 0 && <div className="mt-2 text-[10px] text-slate-600 flex items-center gap-1"><Dna className="w-3 h-3" />Parents: #{agent.parents[0]} × #{agent.parents[1]}</div>}
                            <AnimatePresence>
                                {isSelected(agent) && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                        className="mt-3 text-center bg-purple-500/8 rounded-lg py-1.5 border border-purple-500/10"
                                    >
                                        <span className="text-[10px] text-purple-400 font-semibold">✓ Selected as {selectedParent1?.tokenId === agent.tokenId ? 'Parent 1' : 'Parent 2'}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}

            {agents.length > 0 && !selectedParent1 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center text-sm text-slate-600 py-2">
                    <span className="bg-[#040810] px-3 py-1.5 rounded-full border border-slate-700/15">💡 Click two agents to breed</span>
                </motion.p>
            )}

            {showBreedingModal && prediction && selectedParent1 && selectedParent2 && (
                <BreedingModal parent1={selectedParent1} parent2={selectedParent2} prediction={prediction} onClose={() => setShowBreedingModal(false)} onBreedComplete={handleBreedComplete} />
            )}
        </div>
    )
}
