import { useEffect, useState } from 'react'
import { Loader, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface Session {
    session_id: string
    prompt: string
    status: string
    created_at: string
    completed_at?: string
    score?: number
    decision?: string
}

export default function SessionHistory() {
    const [sessions, setSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchSessions = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || ''
            const response = await fetch(`${apiUrl}/api/sessions`)
            if (response.ok) {
                const data = await response.json()
                setSessions(data.sessions || [])
                setError('')
            } else {
                setError('Failed to fetch sessions')
            }
        } catch (err) {
            setError('Backend not reachable')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSessions()
        const interval = setInterval(fetchSessions, 8000)
        return () => clearInterval(interval)
    }, [])

    const getTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return 'just now'
        if (mins < 60) return `${mins}m ago`
        const hours = Math.floor(mins / 60)
        if (hours < 24) return `${hours}h ago`
        return `${Math.floor(hours / 24)}d ago`
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Session History</h2>
                <button
                    onClick={fetchSessions}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors text-sm"
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="glass-effect rounded-xl p-4 text-center text-yellow-400 border border-yellow-500/20">
                    {error} — sessions will appear after your first deliberation
                </div>
            )}

            {sessions.length === 0 && !error ? (
                <div className="glass-effect rounded-xl p-12 text-center">
                    <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No sessions yet — submit a deliberation to get started</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sessions.map((session) => (
                        <div
                            key={session.session_id}
                            className="glass-effect rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all hover:bg-slate-800/30"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <p className="text-sm font-mono text-slate-400">{session.session_id}</p>
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs font-medium ${session.status === 'complete'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-yellow-500/20 text-yellow-400'
                                                }`}
                                        >
                                            {session.status}
                                        </span>
                                        {session.decision && (
                                            <span
                                                className={`px-2 py-0.5 rounded text-xs font-medium ${session.decision === 'APPROVE'
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : 'bg-orange-500/20 text-orange-400'
                                                    }`}
                                            >
                                                {session.decision}
                                            </span>
                                        )}
                                        {session.score !== undefined && session.score > 0 && (
                                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                                                Score: {session.score.toFixed(1)}%
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-white font-medium truncate">{session.prompt}</p>
                                    <p className="text-xs text-slate-400 mt-2">
                                        {getTimeAgo(session.created_at)}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    {session.status === 'complete' ? (
                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                    ) : (
                                        <AlertCircle className="w-6 h-6 text-yellow-500" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
