import { useEffect, useState } from 'react'
import { Loader, TrendingUp } from 'lucide-react'

interface AgentStat {
    name: string
    status: string
    executions: number
    successes: number
    success_rate: number
}

export default function AgentMonitor() {
    const [agents, setAgents] = useState<AgentStat[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || ''
                const response = await fetch(`${apiUrl}/api/agents`)
                if (response.ok) {
                    const data = await response.json()
                    setAgents(data.agents)
                    setError('')
                } else {
                    setError('Failed to fetch agent data')
                }
            } catch (err) {
                setError('Failed to fetch agent data')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchAgents()
        const interval = setInterval(fetchAgents, 5000)
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="glass-effect rounded-xl p-6 text-center text-red-400">
                {error}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agents.map((agent) => (
                <div
                    key={agent.name}
                    className="glass-effect rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white capitalize">{agent.name}</h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Status: <span className="text-green-400">{agent.status}</span>
                            </p>
                        </div>
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {/* Success Rate */}
                        <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-slate-300">Success Rate</span>
                                <span className="font-semibold text-slate-100">
                                    {(agent.success_rate * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                                    style={{ width: `${agent.success_rate * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="bg-slate-900/50 rounded-lg p-3">
                                <p className="text-xs text-slate-400">Executions</p>
                                <p className="text-xl font-bold text-white">{agent.executions}</p>
                            </div>
                            <div className="bg-slate-900/50 rounded-lg p-3">
                                <p className="text-xs text-slate-400">Successes</p>
                                <p className="text-xl font-bold text-emerald-400">{agent.successes}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
