import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader, AlertCircle, CheckCircle, Shield, Cpu, Play, Brain, Search, Scale, Sparkles } from 'lucide-react'
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

const stagger = {
    animate: { transition: { staggerChildren: 0.08 } }
}

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
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

        // Handle agent "started" — transition that phase to running
        const handleAgentStarted = (msg: any) => {
            const agentName = msg.agent
            setPhases(prev => prev.map(phase => {
                if (phase.name === agentName) return { ...phase, status: 'running' }
                return phase
            }))
        }

        // Handle agent "complete" — set data and mark complete
        const handleAgentUpdate = (msg: any) => {
            const agentName = msg.agent
            setPhases(prev => prev.map(phase => {
                if (phase.name === agentName) return { ...phase, status: 'complete', data: msg.data }
                return phase
            }))
        }

        // Handle full deliberation complete — populate any missing data from result
        const handleComplete = (msg: any) => {
            const result = msg.result
            setFullResult(result)
            setIsRunning(false)

            setPhases(prev => prev.map(phase => {
                // If phase already has data from real-time events, keep it
                if (phase.status === 'complete' && phase.data) return phase

                // Populate missing data from the full result
                let data = phase.data
                if (!data) {
                    if (phase.name === 'planner' && result?.plan) data = result.plan
                    else if (phase.name === 'researcher' && result?.evidence) data = result.evidence
                    else if (phase.name === 'critic' && result?.verdict) data = result.verdict
                    else if (phase.name === 'verifier' && result?.verification) data = result.verification
                    else if (phase.name === 'executor' && result?.execution) data = result.execution
                }

                return {
                    ...phase,
                    status: data ? 'complete' : phase.status,
                    data: data || phase.data,
                }
            }))
        }

        const handleError = (msg: any) => { setError(msg.error || 'Deliberation failed'); setIsRunning(false) }

        ws.on('agent_started', handleAgentStarted)
        ws.on('agent_update', handleAgentUpdate)
        ws.on('deliberation_complete', handleComplete)
        ws.on('deliberation_error', handleError)
        return () => {
            ws.off('agent_started', handleAgentStarted)
            ws.off('agent_update', handleAgentUpdate)
            ws.off('deliberation_complete', handleComplete)
            ws.off('deliberation_error', handleError)
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!prompt.trim() || isRunning) return
        setIsRunning(true); setError(''); setFullResult(null); resetPhases()
        setPhases(prev => prev.map((phase, i) => i === 0 ? { ...phase, status: 'running' } : phase))
        try {
            const apiUrl = import.meta.env.VITE_API_URL || ''
            const response = await fetch(`${apiUrl}/api/deliberate`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt.trim(), mode }),
            })
            if (response.ok) { const data = await response.json(); setSessionId(data.session_id) }
            else throw new Error('Failed to start deliberation')
        } catch (err: any) { setError(err.message || 'Failed to start deliberation'); setIsRunning(false) }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'complete': return 'from-emerald-500 to-green-500'
            case 'running': return 'from-blue-500 to-cyan-500'
            case 'error': return 'from-red-500 to-rose-500'
            default: return 'from-slate-700 to-slate-800'
        }
    }

    const getStatusBg = (status: string) => {
        switch (status) {
            case 'complete': return 'border-emerald-500/20 bg-emerald-500/[0.03]'
            case 'running': return 'border-blue-500/25 bg-blue-500/[0.04] shadow-lg shadow-blue-500/5'
            case 'error': return 'border-red-500/20 bg-red-500/[0.03]'
            default: return 'border-slate-700/20 bg-slate-900/20'
        }
    }

    const plannerData = phases.find(p => p.name === 'planner')?.data
    const researcherData = phases.find(p => p.name === 'researcher')?.data
    const criticData = phases.find(p => p.name === 'critic')?.data
    const verifierData = phases.find(p => p.name === 'verifier')?.data
    const executorData = phases.find(p => p.name === 'executor')?.data

    return (
        <div className="space-y-6">
            {/* Input Panel */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="p-2.5 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-xl border border-blue-500/10">
                        <Cpu className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    </motion.div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Start Deliberation</h2>
                        <p className="text-xs text-slate-600 mt-0.5">Submit a prompt for multi-agent analysis</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div className="relative">
                            <textarea
                                value={prompt} onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Enter your deliberation prompt... e.g. 'Create a governance proposal for treasury allocation'"
                                disabled={isRunning} rows={4}
                                className="input-field resize-none !rounded-xl !py-4 !px-5 text-[0.9375rem] leading-relaxed"
                            />
                            {prompt.length > 0 && <div className="absolute bottom-3 right-3 text-[10px] text-slate-700 font-mono">{prompt.length}</div>}
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="flex bg-[#040810] rounded-xl p-1 border border-slate-700/20">
                                {['simulation', 'execution'].map((m) => (
                                    <motion.button key={m} type="button" onClick={() => setMode(m as any)} disabled={isRunning} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40 ${mode === m
                                            ? 'bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-blue-500/20 text-blue-300'
                                            : 'text-slate-500 hover:text-slate-400'}`}
                                    >
                                        {m === 'simulation' ? '🔬' : '⚡'} {m.charAt(0).toUpperCase() + m.slice(1)}
                                    </motion.button>
                                ))}
                            </div>

                            <motion.button type="submit" disabled={isRunning || !prompt.trim()} whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(59,130,246,0.3)' }} whileTap={{ y: 0 }}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-blue-500/20"
                            >
                                {isRunning ? (<><Loader className="w-4 h-4 animate-spin" />Agents Working...</>) : (<><Send className="w-4 h-4" />Start Deliberation</>)}
                            </motion.button>
                        </div>
                    </div>
                </form>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                            className="mt-4 flex items-start gap-3 text-red-400 bg-red-500/[0.06] rounded-xl p-4 border border-red-500/15"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Agent Pipeline */}
            <AnimatePresence>
                {(isRunning || fullResult) && (
                    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-5">
                        {/* Phase Timeline */}
                        <motion.div variants={fadeUp} className="glass-card p-5 sm:p-6">
                            <h3 className="text-base font-bold mb-5 flex items-center gap-2 text-white">
                                <Sparkles className="w-4 h-4 text-purple-400 drop-shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
                                Agent Pipeline
                            </h3>
                            <div className="hidden sm:flex items-center gap-1.5">
                                {phases.map((phase, i) => {
                                    const Icon = phase.icon
                                    return (
                                        <div key={phase.name} className="flex items-center flex-1">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
                                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-500 w-full ${getStatusBg(phase.status)}`}
                                            >
                                                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${getStatusColor(phase.status)} flex items-center justify-center flex-shrink-0 ${phase.status === 'running' ? 'shadow-lg shadow-blue-500/25 animate-pulse' : ''}`}>
                                                    {phase.status === 'running' ? <Loader className="w-4 h-4 text-white animate-spin" /> : phase.status === 'complete' ? <CheckCircle className="w-4 h-4 text-white" /> : <Icon className="w-4 h-4 text-white/40" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-slate-300 truncate">{phase.label}</p>
                                                    <p className={`text-[10px] capitalize font-medium ${phase.status === 'complete' ? 'text-emerald-400' : phase.status === 'running' ? 'text-blue-400' : 'text-slate-600'}`}>{phase.status}</p>
                                                </div>
                                            </motion.div>
                                            {i < phases.length - 1 && <div className={`w-5 h-0.5 flex-shrink-0 transition-all duration-700 rounded-full ${phase.status === 'complete' ? 'bg-emerald-500/40' : 'bg-slate-800'}`} />}
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="sm:hidden space-y-2">
                                {phases.map((phase) => {
                                    const Icon = phase.icon
                                    return (
                                        <div key={phase.name} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${getStatusBg(phase.status)}`}>
                                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getStatusColor(phase.status)} flex items-center justify-center flex-shrink-0`}>
                                                {phase.status === 'running' ? <Loader className="w-3.5 h-3.5 text-white animate-spin" /> : phase.status === 'complete' ? <CheckCircle className="w-3.5 h-3.5 text-white" /> : <Icon className="w-3.5 h-3.5 text-white/40" />}
                                            </div>
                                            <p className="text-sm font-medium text-slate-300">{phase.label}</p>
                                            <p className={`text-xs ml-auto capitalize font-medium ${phase.status === 'complete' ? 'text-emerald-400' : phase.status === 'running' ? 'text-blue-400' : 'text-slate-600'}`}>{phase.status}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>

                        {/* Agent Results */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <AnimatePresence>
                                {plannerData && (
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }} className="glass-card p-5 sm:p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                                <Brain className="w-5 h-5 text-white" />
                                            </div>
                                            <div><h4 className="font-bold text-white">Planner</h4><p className="text-[10px] text-slate-600">Strategic planning</p></div>
                                            <span className="ml-auto text-[10px] text-emerald-400 bg-emerald-500/8 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/10">Complete</span>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <div className="grid grid-cols-2 gap-2.5">
                                                <div className="bg-[#040810] rounded-xl p-3 border border-slate-700/15"><p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Goal</p><p className="text-slate-300 mt-1 text-sm font-medium">{plannerData.goal}</p></div>
                                                <div className="bg-[#040810] rounded-xl p-3 border border-slate-700/15"><p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Timeline</p><p className="text-slate-300 mt-1 text-sm font-medium">{plannerData.timeline}</p></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2.5">
                                                <div className="bg-[#040810] rounded-xl p-3 border border-slate-700/15"><p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Steps</p><p className="text-xl font-bold text-white mt-0.5">{plannerData.steps?.length || 0}</p></div>
                                                <div className="bg-[#040810] rounded-xl p-3 border border-slate-700/15"><p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Est. Cost</p><p className="text-xl font-bold text-white mt-0.5">${plannerData.estimated_total_cost}</p></div>
                                            </div>
                                            <div className="flex items-center gap-3 bg-[#040810] rounded-xl p-3 border border-slate-700/15">
                                                <span className="text-slate-500 text-xs font-medium">Feasibility</span>
                                                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: `${plannerData.feasibility_score || 0}%` }} /></div>
                                                <span className="text-sm text-white font-bold tabular-nums">{plannerData.feasibility_score}%</span>
                                            </div>
                                            {plannerData.steps && (
                                                <div className="space-y-1">{plannerData.steps.slice(0, 4).map((step: any) => (
                                                    <div key={step.id} className="flex items-start gap-2.5 text-xs text-slate-500 bg-[#040810] rounded-lg p-2 border border-slate-700/10">
                                                        <span className="text-blue-400 font-mono flex-shrink-0 font-bold">#{step.id}</span><span className="truncate">{step.action}</span>
                                                    </div>
                                                ))}{plannerData.steps.length > 4 && <p className="text-[10px] text-slate-600 text-center">+{plannerData.steps.length - 4} more</p>}</div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                                {researcherData && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.16,1,0.3,1], delay: 0.1 }} className="glass-card p-5 sm:p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                                <Search className="w-5 h-5 text-white" />
                                            </div>
                                            <div><h4 className="font-bold text-white">Researcher</h4><p className="text-[10px] text-slate-600">Fact verification</p></div>
                                            <span className="ml-auto text-[10px] text-emerald-400 bg-emerald-500/8 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/10">Complete</span>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <div className="grid grid-cols-2 gap-2.5">
                                                <div className="bg-[#040810] rounded-xl p-4 border border-slate-700/15 text-center"><p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Analyzed</p><p className="text-2xl font-bold text-white mt-1">{researcherData.claims_analyzed}</p></div>
                                                <div className="bg-[#040810] rounded-xl p-4 border border-slate-700/15 text-center"><p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Verified</p><p className="text-2xl font-bold text-emerald-400 mt-1">{researcherData.claims_verified}</p></div>
                                            </div>
                                            <div className="flex items-center gap-3 bg-[#040810] rounded-xl p-3 border border-slate-700/15">
                                                <span className="text-slate-500 text-xs font-medium">Confidence</span>
                                                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000" style={{ width: `${(researcherData.confidence_overall || 0) * 100}%` }} /></div>
                                                <span className="text-sm text-white font-bold tabular-nums">{((researcherData.confidence_overall || 0) * 100).toFixed(0)}%</span>
                                            </div>
                                            {researcherData.gaps?.length > 0 && (
                                                <div className="p-3 bg-yellow-500/[0.04] rounded-xl border border-yellow-500/10">
                                                    <p className="text-[10px] text-yellow-400 font-semibold mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />Gaps Found</p>
                                                    {researcherData.gaps.slice(0, 2).map((gap: string, i: number) => (<p key={i} className="text-xs text-yellow-300/70 ml-4">• {gap}</p>))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {criticData && <motion.div variants={fadeUp}><VerdictPanel verdict={criticData} /></motion.div>}
                        {verifierData && <motion.div variants={fadeUp}><VerificationBadge verification={verifierData} /></motion.div>}
                        {executorData && <motion.div variants={fadeUp}><ExecutorPanel execution={executorData} /></motion.div>}

                        {fullResult && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 150 }}
                                className="glass-card p-6 sm:p-8 !border-emerald-500/15 neon-border-green"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">Deliberation Complete</h3>
                                            <p className="text-[10px] text-slate-600 font-mono mt-0.5">{fullResult.session_id}</p>
                                        </div>
                                    </div>
                                    {fullResult.verdict && (
                                        <div className={`sm:ml-auto px-4 py-2 rounded-xl text-sm font-bold ${fullResult.verdict.decision === 'APPROVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/15'}`}>
                                            {fullResult.verdict.decision === 'APPROVE' ? '✓ APPROVED' : '⚠ REVISE'}
                                        </div>
                                    )}
                                </div>
                                {fullResult.verdict && (
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center gap-6 bg-[#040810] rounded-xl p-4 border border-slate-700/15">
                                            <div><span className="text-[10px] text-slate-600 uppercase tracking-wider">Score</span><p className="text-2xl font-black text-blue-400 tabular-nums">{fullResult.verdict.overall_score?.toFixed(1)}%</p></div>
                                            {fullResult.verification && <div className="pl-6 border-l border-slate-700/20"><span className="text-[10px] text-slate-600 uppercase tracking-wider">Verified</span><p className="text-2xl font-black text-emerald-400 tabular-nums">{fullResult.verification.confidence}%</p></div>}
                                            {fullResult.verification && <div className="pl-6 border-l border-slate-700/20"><span className="text-[10px] text-slate-600 uppercase tracking-wider">Decision</span><p className={`text-lg font-bold ${fullResult.verdict.decision === 'APPROVE' ? 'text-emerald-400' : 'text-yellow-400'}`}>{fullResult.verdict.decision}</p></div>}
                                        </div>
                                        {fullResult.verification?.proof && (
                                            <div className="bg-[#040810] rounded-xl p-3.5 border border-slate-700/15">
                                                <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1">
                                                    <Shield className="w-3 h-3" />
                                                    Proof Hash (0G Log)
                                                </p>
                                                <p className="text-[11px] font-mono text-emerald-400/80 break-all">{fullResult.verification.proof}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
