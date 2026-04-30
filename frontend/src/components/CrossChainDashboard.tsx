import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, ArrowRightLeft, Activity, Zap, Shield, Award,
  ChevronRight, RefreshCw, ExternalLink, Layers, Network
} from 'lucide-react'
import { DEMO_CROSS_CHAIN } from '../services/demo-mode'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
}

const CHAIN_COLORS: Record<string, string> = {
  Ethereum: '#627EEA',
  Polygon: '#8247E5',
  '0G Chain': '#00D4AA',
}

const CHAIN_GRADIENTS: Record<string, string> = {
  Ethereum: 'from-[#627EEA] to-[#4A6CF7]',
  Polygon: 'from-[#8247E5] to-[#7B3FE4]',
  '0G Chain': 'from-[#00D4AA] to-[#00B894]',
}

export default function CrossChainDashboard() {
  const [data] = useState(DEMO_CROSS_CHAIN)
  const [activeChain, setActiveChain] = useState<string | null>(null)
  const [pulseIndex, setPulseIndex] = useState(0)
  const [showMessages, setShowMessages] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex(prev => (prev + 1) % data.bridges.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [data.bridges.length])

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    return mins < 1 ? 'Just now' : `${mins}m ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 sm:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="p-2.5 bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 rounded-xl border border-emerald-500/10">
              <Globe className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Cross-Chain Agent Swarms</h2>
              <p className="text-xs text-slate-600 mt-0.5">Phase 4 — Multi-chain coordinated intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/8 border border-emerald-500/15 text-emerald-400 text-xs font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-pulse" />
              3 Chains Synced
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chain Network Visualization */}
      <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {data.chains.map((chain) => (
          <motion.div
            key={chain.id}
            variants={fadeUp}
            whileHover={{ y: -4 }}
            onClick={() => setActiveChain(activeChain === chain.name ? null : chain.name)}
            className={`glass-card p-6 cursor-pointer transition-all duration-300 ${
              activeChain === chain.name ? '!border-blue-500/25 shadow-lg shadow-blue-500/10' : ''
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${CHAIN_GRADIENTS[chain.name]} flex items-center justify-center shadow-lg`}
                style={{ boxShadow: `0 8px 24px ${chain.color}33` }}
              >
                <Network className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">{chain.name}</h3>
                <p className="text-[10px] text-slate-600">Chain ID: {chain.id}</p>
              </div>
              <div className={`ml-auto w-2.5 h-2.5 rounded-full status-pulse`} style={{ backgroundColor: chain.color }} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#040810] rounded-xl p-3 border border-slate-700/15 text-center">
                <p className="text-xl font-black text-white">{chain.agents}</p>
                <p className="text-[9px] text-slate-600 uppercase tracking-wider">Agents</p>
              </div>
              <div className="bg-[#040810] rounded-xl p-3 border border-slate-700/15 text-center">
                <p className="text-xl font-black" style={{ color: chain.color }}>{chain.avgScore}</p>
                <p className="text-[9px] text-slate-600 uppercase tracking-wider">Avg Score</p>
              </div>
              <div className="bg-[#040810] rounded-xl p-3 border border-slate-700/15 text-center">
                <p className="text-xl font-black text-white">{chain.totalMessages}</p>
                <p className="text-[9px] text-slate-600 uppercase tracking-wider">Messages</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bridge Status */}
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500/15 to-violet-500/15 rounded-xl border border-purple-500/10">
            <ArrowRightLeft className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Bridge Connections</h3>
          <div className="ml-auto text-[10px] text-slate-600 font-mono">Sync interval: 10min</div>
        </div>

        <div className="space-y-3">
          {data.bridges.map((bridge, i) => (
            <motion.div
              key={`${bridge.from}-${bridge.to}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-4 bg-[#040810] rounded-xl p-4 border transition-all duration-500 ${
                pulseIndex === i ? 'border-emerald-500/25 shadow-lg shadow-emerald-500/5' : 'border-slate-700/15'
              }`}
            >
              {/* Source */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: CHAIN_COLORS[bridge.from] }} />
                <span className="text-sm font-semibold text-white truncate">{bridge.from}</span>
              </div>

              {/* Arrow with animation */}
              <div className="flex-1 flex items-center gap-1 px-2">
                <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-slate-700/50 relative">
                  {pulseIndex === i && (
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-6 h-1 rounded-full bg-emerald-400"
                      initial={{ left: '0%', opacity: 0 }}
                      animate={{ left: '100%', opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
              </div>

              {/* Destination */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: CHAIN_COLORS[bridge.to] }} />
                <span className="text-sm font-semibold text-white truncate">{bridge.to}</span>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-4 ml-auto pl-4 border-l border-slate-700/20">
                <div className="text-center">
                  <p className="text-sm font-bold text-white tabular-nums">{bridge.messages}</p>
                  <p className="text-[9px] text-slate-600">msgs</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/8 border border-emerald-500/10">
                  <RefreshCw className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-medium">{formatTime(bridge.lastSync)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Global Leaderboard + Message Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Global Leaderboard */}
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-gradient-to-br from-yellow-500/15 to-orange-500/15 rounded-xl border border-yellow-500/10">
              <Award className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Global Leaderboard</h3>
          </div>

          <div className="space-y-2">
            {data.globalLeaderboard.map((agent, i) => (
              <motion.div
                key={agent.agent_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 bg-[#040810] rounded-xl p-3.5 border border-slate-700/15"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                  i === 0 ? 'bg-gradient-to-br from-yellow-500 to-amber-500 text-white' :
                  i === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-800' :
                  i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                  'bg-slate-800 text-slate-500'
                }`}>
                  #{agent.global_rank}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">{agent.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {['Ethereum', 'Polygon', '0G Chain'].slice(0, agent.chains_active).map(chain => (
                      <div key={chain} className="w-2 h-2 rounded-full" style={{ backgroundColor: CHAIN_COLORS[chain] }} title={chain} />
                    ))}
                    <span className="text-[9px] text-slate-600 ml-1">{agent.chains_active} chains</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white tabular-nums">{agent.average_score}</p>
                  <p className="text-[9px] text-slate-600">avg score</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-700/20">
                  <div className="text-center">
                    <p className="text-[10px] font-semibold tabular-nums" style={{ color: CHAIN_COLORS['Ethereum'] }}>{agent.ethereum_score}</p>
                    <p className="text-[8px] text-slate-700">ETH</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-semibold tabular-nums" style={{ color: CHAIN_COLORS['Polygon'] }}>{agent.polygon_score}</p>
                    <p className="text-[8px] text-slate-700">POLY</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-semibold tabular-nums" style={{ color: CHAIN_COLORS['0G Chain'] }}>{agent.og_score}</p>
                    <p className="text-[8px] text-slate-700">0G</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cross-Chain Message Feed */}
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 rounded-xl border border-cyan-500/10">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Cross-Chain Messages</h3>
            <button
              onClick={() => setShowMessages(!showMessages)}
              className="ml-auto text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
            >
              {showMessages ? 'Hide' : 'Show'}
            </button>
          </div>

          <AnimatePresence>
            {showMessages && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {data.recentMessages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-[#040810] rounded-xl p-3.5 border border-slate-700/15"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHAIN_COLORS[msg.source] }} />
                        <span className="text-[10px] text-slate-500 font-medium">{msg.source}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-700" />
                      <div className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHAIN_COLORS[msg.dest] }} />
                        <span className="text-[10px] text-slate-500 font-medium">{msg.dest}</span>
                      </div>
                      <span className="ml-auto text-[9px] text-slate-700 font-mono">{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">{msg.action}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-600">Agent #{msg.agent}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          msg.confidence >= 85 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {msg.confidence}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Cross-Chain Architecture Note */}
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="glass-card p-6 !border-emerald-500/10">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 rounded-xl border border-emerald-500/10 flex-shrink-0">
            <Layers className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Cross-Chain Architecture</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Agents on each chain make local decisions independently. The bridge relayer synchronizes state every 10 minutes using
              a trusted relayer model with multi-sig validation. Scores are aggregated into a global leaderboard on the primary chain (Ethereum).
              Cross-chain breeding allows parents from different chains to produce offspring, with royalties distributed to native chains.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-500/8 text-blue-400 border border-blue-500/10 font-medium">Relayer-Based MVP</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/8 text-purple-400 border border-purple-500/10 font-medium">Eventual Consistency</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/8 text-emerald-400 border border-emerald-500/10 font-medium">Light Client Upgrade Path</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
