import { useEffect, useState } from 'react'
import { BarChart3, Network, Zap, Activity, Dna, Swords, Wifi, WifiOff } from 'lucide-react'
import DeliberationPanel from './components/DeliberationPanel'
import AgentMonitor from './components/AgentMonitor'
import SessionHistory from './components/SessionHistory'
import SystemStats from './components/SystemStats'
import Gallery from './components/Gallery'
import ArenaPanel from './components/ArenaPanel'
import WebSocketManager from './services/websocket'

type TabId = 'deliberate' | 'agents' | 'gallery' | 'arena' | 'history' | 'stats'

function App() {
    const [activeTab, setActiveTab] = useState<TabId>('deliberate')
    const [wsConnected, setWsConnected] = useState(false)
    const [systemHealth, setSystemHealth] = useState('checking')

    useEffect(() => {
        const ws = WebSocketManager.getInstance()
        ws.connect()

        ws.onConnected(() => {
            setWsConnected(true)
        })

        ws.onDisconnected(() => {
            setWsConnected(false)
        })

        return () => {
            ws.disconnect()
        }
    }, [])

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || ''
                const response = await fetch(`${apiUrl}/api/health`)
                if (response.ok) {
                    setSystemHealth('healthy')
                } else {
                    setSystemHealth('unhealthy')
                }
            } catch {
                setSystemHealth('disconnected')
            }
        }

        checkHealth()
        const interval = setInterval(checkHealth, 10000)
        return () => clearInterval(interval)
    }, [])

    const tabs: { id: TabId; label: string; icon: any }[] = [
        { id: 'deliberate', label: 'Deliberate', icon: Zap },
        { id: 'agents',     label: 'Agents',     icon: BarChart3 },
        { id: 'gallery',    label: 'Gallery',    icon: Dna },
        { id: 'arena',      label: 'Arena',      icon: Swords },
        { id: 'history',    label: 'History',    icon: Activity },
        { id: 'stats',      label: 'Statistics', icon: BarChart3 },
    ]

    return (
        <div className="min-h-screen bg-grid">
            {/* ── Header ── */}
            <header className="border-b border-slate-700/30 glass-effect sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo & Title */}
                        <div className="flex items-center gap-3.5">
                            <div className="relative">
                                <div className="p-2.5 bg-gradient-to-br from-blue-500 via-purple-500 to-violet-600 rounded-xl shadow-lg shadow-blue-500/20">
                                    <Network className="w-6 h-6 text-white" />
                                </div>
                                {/* Animated ring */}
                                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-sm animate-pulse" />
                            </div>
                            <div>
                                <h1 className="text-2xl gradient-text tracking-wide">SWARM OS</h1>
                                <p className="text-[0.65rem] text-slate-500 font-medium tracking-widest uppercase">
                                    Multi-Agent Orchestration
                                </p>
                            </div>
                        </div>

                        {/* Status Indicators */}
                        <div className="flex items-center gap-3">
                            {/* WebSocket */}
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                wsConnected
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                            }`}>
                                {wsConnected
                                    ? <Wifi className="w-3 h-3" />
                                    : <WifiOff className="w-3 h-3" />
                                }
                                <span>{wsConnected ? 'Live' : 'Offline'}</span>
                            </div>

                            {/* System Health */}
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                systemHealth === 'healthy'
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                    : systemHealth === 'checking'
                                    ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                                    : 'bg-orange-500/10 border border-orange-500/20 text-orange-400'
                            }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                    systemHealth === 'healthy' ? 'bg-emerald-400 status-pulse' : 
                                    systemHealth === 'checking' ? 'bg-blue-400 animate-pulse' : 'bg-orange-400'
                                }`} />
                                <span className="capitalize">{systemHealth}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Navigation Tabs ── */}
            <div className="border-b border-slate-700/20 glass-effect sticky top-[73px] z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-1">
                        {tabs.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`relative px-5 py-3.5 font-medium text-sm flex items-center gap-2 transition-all rounded-t-lg ${
                                    activeTab === id
                                        ? 'text-blue-400'
                                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                                {/* Active indicator */}
                                {activeTab === id && (
                                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Main Content ── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="fade-in">
                    {activeTab === 'deliberate' && <DeliberationPanel />}
                    {activeTab === 'agents'     && <AgentMonitor />}
                    {activeTab === 'gallery'    && <Gallery />}
                    {activeTab === 'arena'      && <ArenaPanel />}
                    {activeTab === 'history'    && <SessionHistory />}
                    {activeTab === 'stats'      && <SystemStats />}
                </div>
            </main>

            {/* ── Footer ── */}
            <footer className="border-t border-slate-800/50 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                            <p>SWARM OS — Autonomous Multi-Agent Orchestration</p>
                        </div>
                        <p>Powered by <span className="text-slate-500 font-medium">0G Network</span></p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default App
