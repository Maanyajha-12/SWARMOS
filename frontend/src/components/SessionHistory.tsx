import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader, Clock, CheckCircle, AlertCircle, History, RefreshCw } from 'lucide-react'

interface Session {
    session_id: string; prompt: string; status: string; created_at: string
    completed_at?: string; score?: number; decision?: string
}

export default function SessionHistory() {
    const [sessions, setSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchSessions = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || ''
            const response = await fetch(`${apiUrl}/api/sessions`)
            if (response.ok) { const data = await response.json(); setSessions(data.sessions || []); setError('') }
            else setError('Failed to fetch sessions')
        } catch (err) { setError('Backend not reachable'); console.error(err) }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchSessions(); const interval = setInterval(fetchSessions, 8000); return () => clearInterval(interval) }, [])

    const getTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return 'just now'
        if (mins < 60) return `${mins}m ago`
        const hours = Math.floor(mins / 60)
        if (hours < 24) return `${hours}h ago`
        return `${Math.floor(hours / 24)}d ago`
    }

    if (loading) return <div className="flex flex-col items-center justify-center py-20 gap-4"><Loader className="w-10 h-10 animate-spin text-blue-500" /><p className="text-sm text-slate-600">Loading sessions...</p></div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="p-2.5 bg-gradient-to-br from-indigo-500/15 to-blue-500/15 rounded-xl border border-indigo-500/10">
                        <History className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                    </motion.div>
                    <div><h2 className="text-xl font-bold text-white tracking-tight">Session History</h2><p className="text-xs text-slate-600 mt-0.5">Past deliberation sessions</p></div>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={fetchSessions} className="btn-ghost !rounded-xl">
                    <RefreshCw className="w-4 h-4" /><span className="hidden sm:inline">Refresh</span>
                </motion.button>
            </div>

            {error && <div className="glass-card p-5 text-center border-yellow-500/10"><p className="text-yellow-400 text-sm">{error} — sessions will appear after your first deliberation</p></div>}

            {sessions.length === 0 && !error ? (
                <div className="glass-card p-16 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#040810] flex items-center justify-center border border-slate-700/15"><Clock className="w-8 h-8 text-slate-700" /></div>
                    <p className="text-slate-500 font-medium">No sessions yet</p><p className="text-slate-600 text-sm mt-1">Submit a deliberation to get started</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sessions.map((session, idx) => (
                        <motion.div key={session.session_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.06, duration: 0.4, ease: [0.16,1,0.3,1] }}
                            whileHover={{ x: 4, transition: { duration: 0.15 } }}
                            className="glass-card p-4 sm:p-5 group cursor-default"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                                        <p className="text-[10px] font-mono text-slate-600 bg-[#040810] px-2 py-0.5 rounded-md border border-slate-700/10">{session.session_id}</p>
                                        <span className={`badge ${session.status === 'complete' ? 'bg-emerald-500/8 text-emerald-400 border border-emerald-500/10' : 'bg-yellow-500/8 text-yellow-400 border border-yellow-500/10'}`}>{session.status}</span>
                                        {session.decision && <span className={`badge ${session.decision === 'APPROVE' ? 'bg-emerald-500/8 text-emerald-400 border border-emerald-500/10' : 'bg-orange-500/8 text-orange-400 border border-orange-500/10'}`}>{session.decision}</span>}
                                        {session.score !== undefined && session.score > 0 && <span className="badge bg-blue-500/8 text-blue-400 border border-blue-500/10">Score: {session.score.toFixed(1)}%</span>}
                                    </div>
                                    <p className="text-white font-semibold truncate group-hover:text-blue-300 transition-colors">{session.prompt}</p>
                                    <p className="text-[10px] text-slate-600 mt-2 flex items-center gap-1.5"><Clock className="w-3 h-3" />{getTimeAgo(session.created_at)}</p>
                                </div>
                                <div className="flex-shrink-0 mt-1">
                                    {session.status === 'complete' ? (
                                        <motion.div whileHover={{ scale: 1.1 }} className="w-10 h-10 rounded-xl bg-emerald-500/8 flex items-center justify-center border border-emerald-500/10">
                                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                                        </motion.div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-xl bg-yellow-500/8 flex items-center justify-center border border-yellow-500/10">
                                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
