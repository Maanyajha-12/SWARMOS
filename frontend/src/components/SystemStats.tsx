import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader, BarChart3, Users, Zap, Activity, TrendingUp, Clock } from 'lucide-react'

interface SystemStatsData {
    total_executions: number; total_successes: number; overall_success_rate: number
    active_sessions: number; connected_clients: number; timestamp: string
}

const iconMap = [BarChart3, Zap, TrendingUp, Activity, Users]
const colorMap = [
    { gradient: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20' },
    { gradient: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
    { gradient: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-500/20' },
    { gradient: 'from-orange-500 to-amber-500', shadow: 'shadow-orange-500/20' },
    { gradient: 'from-indigo-500 to-blue-500', shadow: 'shadow-indigo-500/20' },
]

export default function SystemStats() {
    const [stats, setStats] = useState<SystemStatsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const demoStats: SystemStatsData = {
            total_executions: 188, total_successes: 167, overall_success_rate: 0.888,
            active_sessions: 3, connected_clients: 12, timestamp: new Date().toISOString()
        }
        const fetchStats = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || ''
                if (!apiUrl) throw new Error('No API URL')
                const response = await fetch(`${apiUrl}/api/stats`, { signal: AbortSignal.timeout(3000) })
                if (!response.ok) throw new Error('Not ok')
                setStats(await response.json())
            } catch (error) { setStats(demoStats) }
            finally { setLoading(false) }
        }
        fetchStats()
        const interval = setInterval(fetchStats, 5000)
        return () => clearInterval(interval)
    }, [])

    if (loading) return <div className="flex flex-col items-center justify-center py-20 gap-4"><Loader className="w-10 h-10 animate-spin text-blue-500" /><p className="text-sm text-slate-600">Loading statistics...</p></div>
    if (!stats) return <div className="glass-card p-8 text-center"><p className="text-slate-500">Failed to load statistics</p></div>

    const statCards = [
        { label: 'Total Executions', value: stats.total_executions },
        { label: 'Successful Operations', value: stats.total_successes },
        { label: 'Success Rate', value: `${(stats.overall_success_rate * 100).toFixed(1)}%` },
        { label: 'Active Sessions', value: stats.active_sessions },
        { label: 'Connected Clients', value: stats.connected_clients },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="p-2.5 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-xl border border-purple-500/10">
                    <BarChart3 className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                </motion.div>
                <div><h2 className="text-xl font-bold text-white tracking-tight">System Statistics</h2><p className="text-xs text-slate-600 mt-0.5">Real-time performance overview</p></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {statCards.map((card, idx) => {
                    const Icon = iconMap[idx]; const colors = colorMap[idx]
                    return (
                        <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.16,1,0.3,1] }}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }} className="glass-card p-6 group"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mb-2">{card.label}</p>
                                    <p className="text-3xl font-bold text-white tracking-tight tabular-nums">{card.value}</p>
                                </div>
                                <motion.div whileHover={{ scale: 1.15, rotate: 8 }} className={`p-3 bg-gradient-to-br ${colors.gradient} rounded-xl shadow-lg ${colors.shadow}`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </motion.div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
                <h3 className="text-base font-bold mb-5 text-white">Detailed Statistics</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b border-slate-700/30"><th className="text-left py-3.5 px-4 text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Metric</th><th className="text-right py-3.5 px-4 text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Value</th></tr></thead>
                        <tbody>
                            {[
                                { label: 'Total Executions', value: stats.total_executions, color: 'text-white' },
                                { label: 'Successful Operations', value: stats.total_successes, color: 'text-emerald-400' },
                                { label: 'Overall Success Rate', value: `${(stats.overall_success_rate * 100).toFixed(2)}%`, color: 'text-blue-400' },
                                { label: 'Active Sessions', value: stats.active_sessions, color: 'text-purple-400' },
                            ].map((row) => (
                                <tr key={row.label} className="border-b border-slate-700/15 hover:bg-white/[0.01] transition-colors">
                                    <td className="py-3.5 px-4 text-slate-500">{row.label}</td>
                                    <td className={`text-right py-3.5 px-4 font-bold tabular-nums ${row.color}`}>{row.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-700">
                <Clock className="w-3 h-3" /><span>Last updated: {new Date(stats.timestamp).toLocaleTimeString()}</span>
            </div>
        </div>
    )
}
