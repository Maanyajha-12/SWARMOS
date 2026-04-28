import { useEffect, useState } from 'react'
import { BarChart3, Network, Zap, Activity, Dna } from 'lucide-react'
import DeliberationPanel from './components/DeliberationPanel'
import AgentMonitor from './components/AgentMonitor'
import SessionHistory from './components/SessionHistory'
import SystemStats from './components/SystemStats'
import Gallery from './components/Gallery'
import WebSocketManager from './services/websocket'

type TabId = 'deliberate' | 'agents' | 'gallery' | 'history' | 'stats'

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
        { id: 'agents', label: 'Agents', icon: BarChart3 },
        { id: 'gallery', label: 'Gallery', icon: Dna },
        { id: 'history', label: 'History', icon: Activity },
        { id: 'stats', label: 'Statistics', icon: BarChart3 },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="border-b border-slate-700/50 glass-effect sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                <Network className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold gradient-text">SWARM OS</h1>
                                <p className="text-xs text-slate-400">Multi-Agent Orchestration System</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700/30">
                                <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="text-xs text-slate-300">
                                    {wsConnected ? 'Connected' : 'Disconnected'}
                                </span>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${systemHealth === 'healthy' ? 'bg-emerald-500/10' : 'bg-slate-700/30'}`}>
                                <Activity className={`w-4 h-4 ${systemHealth === 'healthy' ? 'text-emerald-400' : 'text-slate-400'}`} />
                                <span className="text-xs text-slate-300 capitalize">{systemHealth}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="border-b border-slate-700/50 glass-effect sticky top-[73px] z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8">
                        {tabs.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`px-4 py-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === id
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-300'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'deliberate' && <DeliberationPanel />}
                {activeTab === 'agents' && <AgentMonitor />}
                {activeTab === 'gallery' && <Gallery />}
                {activeTab === 'history' && <SessionHistory />}
                {activeTab === 'stats' && <SystemStats />}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-700/50 glass-effect mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                        <p>© 2026 SWARM OS — Autonomous Multi-Agent System with 0G Compute</p>
                        <p className="text-xs">Powered by 0G Network</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default App
