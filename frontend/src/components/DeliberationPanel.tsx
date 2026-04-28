import { useState, useEffect, useCallback } from 'react'
import { Send, Loader, AlertCircle, CheckCircle, Shield, Cpu, Play, Brain, Search, Scale } from 'lucide-react'
import VerdictPanel from './VerdictPanel'
import VerificationBadge from './VerificationBadge'
import ExecutorPanel from './ExecutorPanel'
import WebSocketManager from '../services/websocket'

interface AgentPhase {
    name: string
    icon: any
    status: 'pending' | 'running' | 'complete' | 'error'
    data: any
    label: string
}

export default function DeliberationPanel() {
    const [prompt, setPrompt] = useState('')
    const [mode, setMode] = useState<'simulation' | 'execution'>('simulation')
    const [isRunning, setIsRunning] = useState(false)
    const [sessionId, setSessionId] = useState('')
    const [error, setError] = useState('')

    const [phases, setPhases] = useState<AgentPhase[]>([
        { name: 'planner', icon: Brain, status: 'pending', data: null, label: 'Planner' },
        { name: 'researcher', icon: Search, status: 'pending', data: null, label: 'Researcher' },
        { name: 'critic', icon: Scale, status: 'pending', data: null, label: 'Critic' },
        { name: 'verifier', icon: Shield, status: 'pending', data: null, label: '0G Verifier' },
        { name: 'executor', icon: Play, status: 'pending', data: null, label: 'Executor' },
    ])

    const [fullResult, setFullResult] = useState<any>(null)

    const resetPhases = useCallback(() => {
        setPhases([
            { name: 'planner', icon: Brain, status: 'pending', data: null, label: 'Planner' },
            { name: 'researcher', icon: Search, status: 'pending', data: null, label: 'Researcher' },
            { name: 'critic', icon: Scale, status: 'pending', data: null, label: 'Critic' },
            { name: 'verifier', icon: Shield, status: 'pending', data: null, label: '0G Verifier' },
            { name: 'executor', icon: Play, status: 'pending', data: null, label: 'Executor' },
        ])
    }, [])

    useEffect(() => {
        const ws = WebSocketManager.getInstance()

        const handleAgentUpdate = (msg: any) => {
            const agentName = msg.agent
            setPhases(prev => prev.map(phase => {
                if (phase.name === agentName) {
                    return { ...phase, status: 'complete', data: msg.data }
                }
                // Set the next phase to running
                const currentIdx = prev.findIndex(p => p.name === agentName)
                const phaseIdx = prev.findIndex(p => p.name === phase.name)
                if (phaseIdx === currentIdx + 1 && phase.status === 'pending') {
                    return { ...phase, status: 'running' }
                }
                return phase
            }))
        }

        const handleComplete = (msg: any) => {
            setFullResult(msg.result)
            setIsRunning(false)
            setPhases(prev => prev.map(phase => ({
                ...phase,
                status: phase.status === 'pending' ? 'pending' : 'complete'
            })))
        }

        const handleError = (msg: any) => {
            setError(msg.error || 'Deliberation failed')
            setIsRunning(false)
        }

        ws.on('agent_update', handleAgentUpdate)
        ws.on('deliberation_complete', handleComplete)
        ws.on('deliberation_error', handleError)

        return () => {
            ws.off('agent_update', handleAgentUpdate)
            ws.off('deliberation_complete', handleComplete)
            ws.off('deliberation_error', handleError)
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!prompt.trim() || isRunning) return

        setIsRunning(true)
        setError('')
        setFullResult(null)
        resetPhases()

        // Set planner to running
        setPhases(prev => prev.map((phase, i) =>
            i === 0 ? { ...phase, status: 'running' } : phase
        ))

        try {
            const apiUrl = import.meta.env.VITE_API_URL || ''
            const response = await fetch(`${apiUrl}/api/deliberate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt.trim(), mode }),
            })

            if (response.ok) {
                const data = await response.json()
                setSessionId(data.session_id)
            } else {
                throw new Error('Failed to start deliberation')
            }
        } catch (err: any) {
            setError(err.message || 'Failed to start deliberation')
            setIsRunning(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'complete': return 'from-emerald-500 to-green-500'
            case 'running': return 'from-blue-500 to-cyan-500'
            case 'error': return 'from-red-500 to-rose-500'
            default: return 'from-slate-600 to-slate-700'
        }
    }

    const getStatusBg = (status: string) => {
        switch (status) {
            case 'complete': return 'border-emerald-500/30 bg-emerald-500/5'
            case 'running': return 'border-blue-500/30 bg-blue-500/5'
            case 'error': return 'border-red-500/30 bg-red-500/5'
            default: return 'border-slate-700/30 bg-slate-800/20'
        }
    }

    // Get plan data from phases
    const plannerData = phases.find(p => p.name === 'planner')?.data
    const researcherData = phases.find(p => p.name === 'researcher')?.data
    const criticData = phases.find(p => p.name === 'critic')?.data
    const verifierData = phases.find(p => p.name === 'verifier')?.data
    const executorData = phases.find(p => p.name === 'executor')?.data

    return (
        <div className="space-y-6">
            {/* Input Panel */}
            <div className="glass-effect rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-400" />
                    Start Deliberation
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Prompt
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Enter your deliberation prompt... e.g. 'Create a governance proposal for treasury allocation'"
                                disabled={isRunning}
                                rows={4}
                                className="w-full bg-slate-900/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 border border-slate-700/50 focus:border-blue-500/50 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                                {['simulation', 'execution'].map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setMode(m as any)}
                                        disabled={isRunning}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${mode === m
                                            ? 'bg-blue-500/30 border-blue-500/50 text-blue-300'
                                            : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600/50'
                                            } border`}
                                    >
                                        {m.charAt(0).toUpperCase() + m.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={isRunning || !prompt.trim()}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all"
                            >
                                {isRunning ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Agents Working...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Start Deliberation
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                {error && (
                    <div className="mt-4 flex items-start gap-2 text-red-400 bg-red-500/10 rounded-lg p-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}
            </div>

            {/* Agent Pipeline */}
            {(isRunning || fullResult) && (
                <div className="space-y-4">
                    {/* Phase Timeline */}
                    <div className="glass-effect rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Agent Pipeline</h3>
                        <div className="flex items-center gap-2">
                            {phases.map((phase, i) => {
                                const Icon = phase.icon
                                return (
                                    <div key={phase.name} className="flex items-center flex-1">
                                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all w-full ${getStatusBg(phase.status)}`}>
                                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getStatusColor(phase.status)} flex items-center justify-center flex-shrink-0`}>
                                                {phase.status === 'running' ? (
                                                    <Loader className="w-4 h-4 text-white animate-spin" />
                                                ) : phase.status === 'complete' ? (
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                ) : (
                                                    <Icon className="w-4 h-4 text-white/60" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-medium text-slate-300 truncate">{phase.label}</p>
                                                <p className="text-[10px] text-slate-500 capitalize">{phase.status}</p>
                                            </div>
                                        </div>
                                        {i < phases.length - 1 && (
                                            <div className={`w-4 h-0.5 flex-shrink-0 ${phase.status === 'complete' ? 'bg-emerald-500/50' : 'bg-slate-700'}`} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Agent Results Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Planner Result */}
                        {plannerData && (
                            <div className="glass-effect rounded-xl p-5 border border-slate-700/50 slide-in">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                        <Brain className="w-4 h-4 text-white" />
                                    </div>
                                    <h4 className="font-semibold text-white">Planner</h4>
                                    <span className="ml-auto text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">Complete</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p className="text-slate-300"><span className="text-slate-500">Goal:</span> {plannerData.goal}</p>
                                    <p className="text-slate-300"><span className="text-slate-500">Steps:</span> {plannerData.steps?.length || 0}</p>
                                    <p className="text-slate-300"><span className="text-slate-500">Timeline:</span> {plannerData.timeline}</p>
                                    <p className="text-slate-300"><span className="text-slate-500">Cost:</span> ${plannerData.estimated_total_cost}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500 text-sm">Feasibility:</span>
                                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                                                style={{ width: `${plannerData.feasibility_score || 0}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-white font-medium">{plannerData.feasibility_score}%</span>
                                    </div>
                                    {plannerData.steps && (
                                        <div className="mt-3 space-y-1">
                                            {plannerData.steps.slice(0, 4).map((step: any) => (
                                                <div key={step.id} className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/50 rounded p-2">
                                                    <span className="text-blue-400 font-mono flex-shrink-0">#{step.id}</span>
                                                    <span className="truncate">{step.action}</span>
                                                </div>
                                            ))}
                                            {(plannerData.steps.length > 4) && (
                                                <p className="text-xs text-slate-500 text-center">+{plannerData.steps.length - 4} more steps</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Researcher Result */}
                        {researcherData && (
                            <div className="glass-effect rounded-xl p-5 border border-slate-700/50 slide-in">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <Search className="w-4 h-4 text-white" />
                                    </div>
                                    <h4 className="font-semibold text-white">Researcher</h4>
                                    <span className="ml-auto text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">Complete</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-900/50 rounded-lg p-3">
                                            <p className="text-xs text-slate-500">Claims Analyzed</p>
                                            <p className="text-xl font-bold text-white">{researcherData.claims_analyzed}</p>
                                        </div>
                                        <div className="bg-slate-900/50 rounded-lg p-3">
                                            <p className="text-xs text-slate-500">Claims Verified</p>
                                            <p className="text-xl font-bold text-emerald-400">{researcherData.claims_verified}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500 text-sm">Confidence:</span>
                                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                                                style={{ width: `${(researcherData.confidence_overall || 0) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-white font-medium">{((researcherData.confidence_overall || 0) * 100).toFixed(0)}%</span>
                                    </div>
                                    {researcherData.gaps?.length > 0 && (
                                        <div className="mt-2 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                            <p className="text-xs text-yellow-400 font-medium mb-1">Gaps Found:</p>
                                            {researcherData.gaps.slice(0, 2).map((gap: string, i: number) => (
                                                <p key={i} className="text-xs text-yellow-300/80">• {gap}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Verdict Panel */}
                    {criticData && (
                        <div className="slide-in">
                            <VerdictPanel verdict={criticData} />
                        </div>
                    )}

                    {/* Verification Badge */}
                    {verifierData && (
                        <div className="slide-in">
                            <VerificationBadge
                                confidence={verifierData.confidence || 0}
                                verified={verifierData.verified || false}
                                proof={verifierData.proof}
                                message={verifierData.message}
                            />
                        </div>
                    )}

                    {/* Executor Panel */}
                    {executorData && (
                        <div className="slide-in">
                            <ExecutorPanel execution={executorData} />
                        </div>
                    )}

                    {/* Final Result */}
                    {fullResult && (
                        <div className="glass-effect rounded-xl p-6 border border-emerald-500/30 bg-emerald-500/5 slide-in">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Deliberation Complete</h3>
                                    <p className="text-xs text-slate-400">Session: {fullResult.session_id}</p>
                                </div>
                                {fullResult.verdict && (
                                    <div className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${fullResult.verdict.decision === 'APPROVE'
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {fullResult.verdict.decision === 'APPROVE' ? '✓ APPROVED' : '⚠ REVISE'}
                                    </div>
                                )}
                            </div>
                            {fullResult.verdict && (
                                <p className="text-sm text-slate-300">
                                    Score: <span className="font-bold text-blue-400">{fullResult.verdict.overall_score?.toFixed(1)}%</span>
                                    {fullResult.verification && (
                                        <> · Verified: <span className="font-bold text-emerald-400">{fullResult.verification.confidence}%</span></>
                                    )}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
