import { useEffect, useState } from 'react'
import { Loader, BarChart3, Users, Zap } from 'lucide-react'

interface SystemStatsData {
    total_executions: number
    total_successes: number
    overall_success_rate: number
    active_sessions: number
    connected_clients: number
    timestamp: string
}

export default function SystemStats() {
    const [stats, setStats] = useState<SystemStatsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || ''
                const response = await fetch(`${apiUrl}/api/stats`)
                if (response.ok) {
                    setStats(await response.json())
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
        const interval = setInterval(fetchStats, 5000)
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    if (!stats) {
        return (
            <div className="glass-effect rounded-xl p-6 text-center text-slate-400">
                Failed to load statistics
            </div>
        )
    }

    const statCards = [
        {
            label: 'Total Executions',
            value: stats.total_executions,
            icon: BarChart3,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            label: 'Successful Operations',
            value: stats.total_successes,
            icon: Zap,
            color: 'from-green-500 to-emerald-500',
        },
        {
            label: 'Success Rate',
            value: `${(stats.overall_success_rate * 100).toFixed(1)}%`,
            icon: BarChart3,
            color: 'from-purple-500 to-pink-500',
        },
        {
            label: 'Active Sessions',
            value: stats.active_sessions,
            icon: Users,
            color: 'from-orange-500 to-red-500',
        },
        {
            label: 'Connected Clients',
            value: stats.connected_clients,
            icon: Users,
            color: 'from-indigo-500 to-blue-500',
        },
    ]

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statCards.map((card) => {
                    const Icon = card.icon
                    return (
                        <div key={card.label} className="glass-effect rounded-xl p-6 border border-slate-700/50">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-slate-400 mb-2">{card.label}</p>
                                    <p className="text-3xl font-bold text-white">{card.value}</p>
                                </div>
                                <div className={`p-3 bg-gradient-to-br ${card.color} rounded-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Detailed Stats Table */}
            <div className="glass-effect rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4">Detailed Statistics</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-700/50">
                                <th className="text-left py-3 px-4 font-semibold text-slate-300">Metric</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-300">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-700/30 hover:bg-slate-800/20">
                                <td className="py-3 px-4 text-slate-400">Total Executions</td>
                                <td className="text-right py-3 px-4 font-semibold text-white">
                                    {stats.total_executions}
                                </td>
                            </tr>
                            <tr className="border-b border-slate-700/30 hover:bg-slate-800/20">
                                <td className="py-3 px-4 text-slate-400">Successful Operations</td>
                                <td className="text-right py-3 px-4 font-semibold text-green-400">
                                    {stats.total_successes}
                                </td>
                            </tr>
                            <tr className="border-b border-slate-700/30 hover:bg-slate-800/20">
                                <td className="py-3 px-4 text-slate-400">Overall Success Rate</td>
                                <td className="text-right py-3 px-4 font-semibold text-blue-400">
                                    {(stats.overall_success_rate * 100).toFixed(2)}%
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-800/20">
                                <td className="py-3 px-4 text-slate-400">Active Sessions</td>
                                <td className="text-right py-3 px-4 font-semibold text-purple-400">
                                    {stats.active_sessions}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Last Updated */}
            <p className="text-xs text-slate-500 text-center">
                Last updated: {new Date(stats.timestamp).toLocaleTimeString()}
            </p>
        </div>
    )
}
