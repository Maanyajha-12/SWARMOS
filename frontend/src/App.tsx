import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Network, Zap, Activity, Dna, Swords, Wifi, WifiOff } from 'lucide-react'
import DeliberationPanel from './components/DeliberationPanel'
import AgentMonitor from './components/AgentMonitor'
import SessionHistory from './components/SessionHistory'
import SystemStats from './components/SystemStats'
import Gallery from './components/Gallery'
import ArenaPanel from './components/ArenaPanel'
import WebSocketManager from './services/websocket'

type TabId = 'deliberate' | 'agents' | 'gallery' | 'arena' | 'history' | 'stats'

const pageVariants = {
    initial: { opacity: 0, y: 16, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.2 } },
}

function App() {
    const [activeTab, setActiveTab] = useState<TabId>('deliberate')
    const [wsConnected, setWsConnected] = useState(false)
    const [systemHealth, setSystemHealth] = useState('checking')

    useEffect(() => {
        const ws = WebSocketManager.getInstance()
        ws.connect()
        ws.onConnected(() => setWsConnected(true))
        ws.onDisconnected(() => setWsConnected(false))
        return () => { ws.disconnect() }
    }, [])

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || ''
                const response = await fetch(`${apiUrl}/api/health`)
                setSystemHealth(response.ok ? 'healthy' : 'unhealthy')
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
        { id: 'history',    label: 'History',     icon: Activity },
        { id: 'stats',      label: 'Statistics',  icon: BarChart3 },
    ]

    const renderTab = () => {
        switch (activeTab) {
            case 'deliberate': return <DeliberationPanel />
            case 'agents':     return <AgentMonitor />
            case 'gallery':    return <Gallery />
            case 'arena':      return <ArenaPanel />
            case 'history':    return <SessionHistory />
            case 'stats':      return <SystemStats />
        }
    }

    return (
        <div className="min-h-screen bg-grid">
            {/* ── Header ── */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-slate-700/20 glass-effect gradient-border sticky top-0 z-50"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5 group cursor-default">
                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2.5 bg-gradient-to-br from-blue-500 via-purple-500 to-violet-600 rounded-xl shadow-lg shadow-blue-500/25"
                                >
                                    <Network className="w-6 h-6 text-white" />
                                </motion.div>
                                <div className="absolute -inset-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-15 blur-md animate-pulse" />
                            </div>
                            <div>
                                <h1 className="text-2xl gradient-text tracking-wider">SWARM OS</h1>
                                <p className="text-[0.6rem] text-slate-600 font-medium tracking-[0.2em] uppercase">
                                    Multi-Agent Orchestration
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                    wsConnected
                                        ? 'bg-emerald-500/8 border border-emerald-500/15 text-emerald-400'
                                        : 'bg-red-500/8 border border-red-500/15 text-red-400'
                                }`}
                            >
                                <div className="relative">
                                    {wsConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                                    {wsConnected && <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 status-pulse" />}
                                </div>
                                <span className="hide-mobile">{wsConnected ? 'Live' : 'Offline'}</span>
                            </motion.div>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                    systemHealth === 'healthy'
                                        ? 'bg-emerald-500/8 border border-emerald-500/15 text-emerald-400'
                                        : systemHealth === 'checking'
                                        ? 'bg-blue-500/8 border border-blue-500/15 text-blue-400'
                                        : 'bg-orange-500/8 border border-orange-500/15 text-orange-400'
                                }`}
                            >
                                <div className={`w-2 h-2 rounded-full ${
                                    systemHealth === 'healthy' ? 'bg-emerald-400 status-pulse' :
                                    systemHealth === 'checking' ? 'bg-blue-400 animate-pulse' : 'bg-orange-400'
                                }`} />
                                <span className="capitalize hide-mobile">{systemHealth}</span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* ── Navigation Tabs ── */}
            <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="border-b border-slate-700/15 glass-effect sticky top-[73px] z-40"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative flex">
                        {tabs.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`relative px-4 sm:px-5 py-3.5 font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
                                    activeTab === id
                                        ? 'text-blue-400'
                                        : 'text-slate-600 hover:text-slate-400 hover:bg-white/[0.02]'
                                }`}
                            >
                                <Icon className={`w-4 h-4 transition-all duration-200 ${activeTab === id ? 'text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]' : ''}`} />
                                <span className="hidden sm:inline">{label}</span>
                                {activeTab === id && (
                                    <motion.div
                                        layoutId="tab-indicator"
                                        className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ── Main Content ── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {renderTab()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ── Footer ── */}
            <footer className="border-t border-slate-800/30 mt-12 sm:mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700">
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
