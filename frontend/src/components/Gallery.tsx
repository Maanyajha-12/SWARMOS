import { useState, useEffect, useCallback } from 'react'
import { Dna, Sparkles, Loader, RefreshCw } from 'lucide-react'
import TraitsDisplay from './TraitsDisplay'
import BreedingModal from './BreedingModal'

interface AgentProfile {
    tokenId: number
    sessionId: string
    traits: {
        reasoning: number
        creativity: number
        caution: number
        speed: number
        accuracy: number
        adaptability: number
    }
    generation: number
    score: number
    parents: [number, number]
    heritage: number[]
    createdAt: string
    prompt?: string
    decision?: string
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
            if (response.ok) {
                const data = await response.json()
                setAgents(data.agents || [])
                setError('')
            } else {
                setError('Failed to load agents')
            }
        } catch (err) {
            setError('Backend not reachable')
        } finally {
            setLoading(false)
        }
    }, [apiUrl])

    useEffect(() => {
        fetchAgents()
    }, [fetchAgents])

    const handleCardClick = (agent: AgentProfile) => {
        if (!selectedParent1) {
            setSelectedParent1(agent)
        } else if (selectedParent1.tokenId !== agent.tokenId && !selectedParent2) {
            setSelectedParent2(agent)
        } else if (selectedParent1.tokenId === agent.tokenId) {
            setSelectedParent1(null)
            setSelectedParent2(null)
        } else if (selectedParent2?.tokenId === agent.tokenId) {
            setSelectedParent2(null)
        }
    }

    const handleBreedPreview = async () => {
        if (!selectedParent1 || !selectedParent2) return
        setPredicting(true)

        try {
            const response = await fetch(
                `${apiUrl}/api/breeding/predict/${selectedParent1.tokenId}/${selectedParent2.tokenId}`
            )
            if (response.ok) {
                const data = await response.json()
                setPrediction(data)
                setShowBreedingModal(true)
            }
        } catch (err) {
            console.error('Prediction error:', err)
        } finally {
            setPredicting(false)
        }
    }

    const handleBreedComplete = () => {
        setShowBreedingModal(false)
        setSelectedParent1(null)
        setSelectedParent2(null)
        setPrediction(null)
        fetchAgents()
    }

    const clearSelection = () => {
        setSelectedParent1(null)
        setSelectedParent2(null)
    }

    const isSelected = (agent: AgentProfile) =>
        selectedParent1?.tokenId === agent.tokenId || selectedParent2?.tokenId === agent.tokenId

    const getGenerationColor = (gen: number) => {
        const colors = [
            'from-blue-500 to-cyan-500',
            'from-purple-500 to-pink-500',
            'from-amber-500 to-orange-500',
            'from-emerald-500 to-teal-500',
            'from-red-500 to-rose-500',
        ]
        return colors[gen % colors.length]
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                        <Dna className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Agent Gallery & Breeding</h2>
                        <p className="text-sm text-slate-400">Select two agents to breed a new generation</p>
                    </div>
                </div>
                <button
                    onClick={fetchAgents}
                    className="px-4 py-2 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-colors flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Breeding Selection Bar */}
            {(selectedParent1 || selectedParent2) && (
                <div className="glass-effect rounded-xl p-4 border border-purple-500/30 bg-purple-500/5 slide-in">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <Dna className="w-5 h-5 text-purple-400" />
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${selectedParent1 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-slate-800/50 text-slate-500 border border-slate-700/30'}`}>
                                    {selectedParent1 ? `Parent 1: #${selectedParent1.tokenId}` : 'Select Parent 1'}
                                </span>
                                <span className="text-slate-500 text-lg">×</span>
                                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${selectedParent2 ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'bg-slate-800/50 text-slate-500 border border-slate-700/30'}`}>
                                    {selectedParent2 ? `Parent 2: #${selectedParent2.tokenId}` : 'Select Parent 2'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {selectedParent1 && selectedParent2 && (
                                <button
                                    onClick={handleBreedPreview}
                                    disabled={predicting}
                                    className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {predicting ? (
                                        <Loader className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-4 h-4" />
                                    )}
                                    Predict & Breed
                                </button>
                            )}
                            <button
                                onClick={clearSelection}
                                className="px-4 py-2 bg-slate-700/30 hover:bg-slate-700/50 text-slate-400 rounded-lg transition-colors text-sm"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="glass-effect rounded-xl p-6 text-center text-yellow-400 border border-yellow-500/20">
                    {error}
                </div>
            )}

            {/* Agent Grid */}
            {agents.length === 0 ? (
                <div className="glass-effect rounded-xl p-12 text-center">
                    <Dna className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No agents yet — complete a deliberation to create your first agent</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {agents.map((agent) => (
                        <div
                            key={agent.tokenId}
                            onClick={() => handleCardClick(agent)}
                            className={`glass-effect rounded-xl p-5 border-2 transition-all cursor-pointer hover:scale-[1.02] ${isSelected(agent)
                                ? 'border-purple-500/60 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                                : 'border-slate-700/30 hover:border-slate-600/50'
                                }`}
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Agent #{agent.tokenId}</h3>
                                    <p className="text-xs text-slate-500 font-mono mt-0.5">{agent.sessionId}</p>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getGenerationColor(agent.generation)} text-white`}>
                                    Gen {agent.generation}
                                </span>
                            </div>

                            {/* Traits */}
                            <TraitsDisplay traits={agent.traits} compact />

                            {/* Footer */}
                            <div className="mt-4 pt-3 border-t border-slate-700/30 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-500">Score</p>
                                    <p className="text-lg font-bold text-blue-400">{agent.score}%</p>
                                </div>
                                {agent.decision && (
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${agent.decision === 'APPROVE'
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : agent.decision === 'BRED'
                                            ? 'bg-purple-500/20 text-purple-400'
                                            : 'bg-orange-500/20 text-orange-400'
                                        }`}>
                                        {agent.decision === 'BRED' ? '🧬 Bred' : agent.decision}
                                    </span>
                                )}
                            </div>

                            {/* Parents indicator */}
                            {agent.parents[0] !== 0 && (
                                <div className="mt-2 text-xs text-slate-500">
                                    Parents: #{agent.parents[0]} × #{agent.parents[1]}
                                </div>
                            )}

                            {/* Selection indicator */}
                            {isSelected(agent) && (
                                <div className="mt-2 text-center">
                                    <span className="text-xs text-purple-400 font-medium">
                                        ✓ Selected as {selectedParent1?.tokenId === agent.tokenId ? 'Parent 1' : 'Parent 2'}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Prompt hint */}
            {agents.length > 0 && !selectedParent1 && (
                <p className="text-center text-sm text-slate-500">
                    Click on two agent cards to select parents for breeding
                </p>
            )}

            {/* Breeding Modal */}
            {showBreedingModal && prediction && selectedParent1 && selectedParent2 && (
                <BreedingModal
                    parent1={selectedParent1}
                    parent2={selectedParent2}
                    prediction={prediction}
                    onClose={() => setShowBreedingModal(false)}
                    onBreedComplete={handleBreedComplete}
                />
            )}
        </div>
    )
}
