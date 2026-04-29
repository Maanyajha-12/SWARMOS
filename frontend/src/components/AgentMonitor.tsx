import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader, TrendingUp, Activity, Zap, Target } from 'lucide-react'

interface AgentStat {
    name: string
    status: string
    executions: number
    successes: number
    success_rate: number
}

const agentIcons: Record<string, any> = { planner: Activity, researcher: TrendingUp, critic: Target, executor: Zap }
const agentColors: Record<string, string> = { planner: 'from-blue-500 to-cyan-500', researcher: 'from-purple-500 to-pink-500', critic: 'from-amber-500 to-orange-500', executor: 'from-emerald-500 to-teal-500' }
const agentShadows: Record<string, string> = { planner: 'shadow-blue-500/20', researcher: 'shadow-purple-500/20', critic: 'shadow-amber-500/20', executor: 'shadow-emerald-500/20' }

export default function AgentMonitor() {
    const [agents, setAgents] = useState<AgentStat[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || ''
                const response = await fetch(`${apiUrl}/api/agents`)
                if (response.ok) { const data = await response.json(); setAgents(data.agents); setError('') }
                else setError('Failed to fetch agent data')
            } catch (err) { setError('Failed to fetch agent data'); console.error(err) }
            finally { setLoading(false) }
        }
        fetchAgents()
        const interval = setInterval(fetchAgents, 5000)
        return () => clearInterval(interval)
    }, [])

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader className="w-10 h-10 animate-spin text-blue-500" />
            <p className="text-sm text-slate-600">Loading agents...</p>
        </div>
    )

    if (error) return <div className="glass-card p-8 text-center"><p className="text-red-400 font-medium">{error}</p></div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="p-2.5 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-xl border border-blue-500/10">
                    <Activity className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                </motion.div>
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Agent Monitor</h2>
                    <p className="text-xs text-slate-600 mt-0.5">Real-time agent performance</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {agents.map((agent, idx) => {
                    const Icon = agentIcons[agent.name] || TrendingUp
                    const color = agentColors[agent.name] || 'from-blue-500 to-cyan-500'
                    const shadow = agentShadows[agent.name] || 'shadow-blue-500/20'
                    const rate = agent.success_rate * 100

                    return (
                        <motion.div
                            key={agent.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="glass-card p-6 group"
                        >
                            <div className="flex items-start justify-between mb-5">
                                <div>
                                    <h3 className="text-lg font-bold text-white capitalize tracking-tight">{agent.name}</h3>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 status-pulse" />
                                        <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">{agent.status}</p>
                                    </div>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.15, rotate: 8 }}
                                    className={`p-3 bg-gradient-to-br ${color} rounded-xl shadow-lg ${shadow}`}
                                >
                                    <Icon className="w-5 h-5 text-white" />
                                </motion.div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-2.5">
                                        <span className="text-slate-500 font-medium">Success Rate</span>
                                        <span className={`font-bold text-lg tabular-nums ${rate >= 80 ? 'text-emerald-400' : rate >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                            {rate.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${rate}%` }}
                                            transition={{ duration: 1.2, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                            className={`h-full bg-gradient-to-r ${color} rounded-full`}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2.5">
                                    <div className="bg-[#040810] rounded-xl p-3.5 border border-slate-700/15">
                                        <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Executions</p>
                                        <p className="text-2xl font-bold text-white mt-1 tabular-nums">{agent.executions}</p>
                                    </div>
                                    <div className="bg-[#040810] rounded-xl p-3.5 border border-slate-700/15">
                                        <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Successes</p>
                                        <p className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">{agent.successes}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
