import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Shield, Globe, TrendingUp, Users, ArrowRight,
  Brain, Network, Lock, Layers, Sparkles, ChevronRight,
  ExternalLink, Github, Target, DollarSign, Award, Cpu
} from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
}

const STATS = [
  { label: 'Agents Deployed', value: '12', icon: Brain },
  { label: 'Decisions Verified', value: '847', icon: Shield },
  { label: 'Chains Connected', value: '3', icon: Globe },
  { label: 'Avg Confidence', value: '91%', icon: Target },
]

const FEATURES = [
  {
    icon: Brain,
    title: 'Multi-Agent Deliberation',
    desc: 'Four specialized AI agents (Planner, Researcher, Critic, Executor) independently analyze decisions through a structured pipeline.',
    color: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/20',
  },
  {
    icon: Shield,
    title: 'Proof-of-Intelligence',
    desc: 'Novel commit-reveal consensus where agents cryptographically commit decisions before revealing, ensuring independent analysis.',
    color: 'from-emerald-500 to-green-500',
    shadow: 'shadow-emerald-500/20',
  },
  {
    icon: Lock,
    title: '0G Compute Verification',
    desc: 'Every decision verified through 0G Network TEE (Trusted Execution Environment) with cryptographic proof hashes.',
    color: 'from-purple-500 to-violet-500',
    shadow: 'shadow-purple-500/20',
  },
  {
    icon: Globe,
    title: 'Cross-Chain Swarms',
    desc: 'Agents operate across Ethereum, Polygon, and 0G Chain with bridge-synchronized state and unified leaderboards.',
    color: 'from-orange-500 to-amber-500',
    shadow: 'shadow-orange-500/20',
  },
  {
    icon: Layers,
    title: 'Evolutionary Breeding',
    desc: 'Top-performing agents breed offspring with inherited traits. Genetic crossover with mutation creates increasingly capable generations.',
    color: 'from-pink-500 to-rose-500',
    shadow: 'shadow-pink-500/20',
  },
  {
    icon: Award,
    title: 'Arena Tournaments',
    desc: 'Competitive elimination tournaments where agents evolve through competition. Winners breed, losers are eliminated.',
    color: 'from-yellow-500 to-orange-500',
    shadow: 'shadow-yellow-500/20',
  },
]

const REVENUE = [
  { stream: 'Tournament Entry Fees', amount: '0.1 ETH/entry', split: 'Winner 70% · Protocol 30%', icon: Award },
  { stream: 'iNFT Breeding Royalties', amount: '5% secondary sales', split: 'Parents 2.5% · Protocol 2.5%', icon: Layers },
  { stream: 'Bridge Transaction Fees', amount: '0.5% per message', split: 'Relayers 60% · Protocol 40%', icon: Globe },
  { stream: 'Enterprise API', amount: '$5K/month', split: 'Verifiable AI decision API', icon: Cpu },
]

interface LandingPageProps {
  onNavigate?: (tab: string) => void
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [activeStatIndex, setActiveStatIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStatIndex(prev => (prev + 1) % STATS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* ── HERO SECTION ── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative text-center pt-8 sm:pt-16"
      >
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-500/8 via-purple-500/4 to-transparent rounded-full blur-3xl" />
        </div>

        <motion.div variants={stagger} initial="initial" animate="animate" className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/8 border border-blue-500/15 text-blue-400 text-xs font-semibold mb-8 tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            BUILT ON 0G NETWORK · ETHGLOBAL HACKATHON
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Trustless AI Decision-Making{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
              for the Multi-Chain Future
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            SWARM OS orchestrates autonomous AI agent swarms across multiple blockchains.
            Every decision is verified through 0G Compute TEE and recorded on-chain with cryptographic proof.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={() => onNavigate?.('deliberate')}
              whileHover={{ y: -3, boxShadow: '0 20px 60px rgba(59,130,246,0.35)' }}
              whileTap={{ y: 0 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-bold text-white flex items-center gap-3 shadow-xl shadow-blue-500/25 text-lg"
            >
              <Zap className="w-5 h-5" /> Try Live Demo <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.a
              href="https://github.com/Maanyajha-12/SWARMOS"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              className="px-8 py-4 rounded-2xl font-semibold text-slate-300 flex items-center gap-3 border border-slate-700/30 hover:border-slate-600/40 hover:bg-white/[0.02] transition-all"
            >
              <Github className="w-5 h-5" /> View Source <ExternalLink className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Animated stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {STATS.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className={`glass-card p-4 text-center transition-all duration-500 ${i === activeStatIndex ? '!border-blue-500/25 shadow-lg shadow-blue-500/10' : ''}`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-2 ${i === activeStatIndex ? 'text-blue-400' : 'text-slate-600'} transition-colors`} />
                <p className="text-2xl font-black text-white tabular-nums">{stat.value}</p>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mt-1">{stat.label}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.section>

      {/* ── PROBLEM / SOLUTION ── */}
      <motion.section variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true, margin: '-100px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={fadeUp} className="glass-card p-8 border-red-500/10">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/15 flex items-center justify-center mb-5">
              <TrendingUp className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">The Problem</h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              AI agents make <span className="text-white font-semibold">$2.3 trillion</span> in automated decisions annually. 
              <span className="text-red-400 font-semibold"> Zero are independently verifiable.</span>
            </p>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> Single-point-of-failure AI systems</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> No cryptographic proof of reasoning</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> Opaque decision processes</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> No cross-chain coordination</li>
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card p-8 !border-emerald-500/15">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mb-5">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Our Solution</h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              SWARM OS creates <span className="text-emerald-400 font-semibold">verifiable multi-agent consensus</span> with 
              cryptographic proofs stored on-chain via 0G Network.
            </p>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> 4 independent agents analyze every decision</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> 0G Compute TEE verification with proof hash</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> On-chain iNFT recording of decisions</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Cross-chain agent swarms (3 chains)</li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* ── FEATURES GRID ── */}
      <motion.section variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true, margin: '-100px' }}>
        <motion.div variants={fadeUp} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Core Technology</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Six pillars of trustless AI decision infrastructure</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div key={feature.title} variants={fadeUp} whileHover={{ y: -4 }} className="glass-card p-6 group cursor-default">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 ${feature.shadow} shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* ── ARCHITECTURE DIAGRAM ── */}
      <motion.section variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true, margin: '-100px' }}>
        <div className="glass-card p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-3">How It Works</h2>
            <p className="text-slate-500">End-to-end trustless AI decision pipeline</p>
          </div>

          {/* Pipeline visualization */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2 overflow-x-auto py-4">
            {[
              { label: 'User Prompt', icon: Users, color: 'from-slate-600 to-slate-700' },
              { label: 'Planner', icon: Brain, color: 'from-blue-500 to-cyan-500' },
              { label: 'Researcher', icon: Target, color: 'from-purple-500 to-pink-500' },
              { label: 'Critic', icon: Shield, color: 'from-amber-500 to-orange-500' },
              { label: '0G Verify', icon: Lock, color: 'from-emerald-500 to-green-500' },
              { label: 'On-Chain', icon: Layers, color: 'from-violet-500 to-purple-600' },
            ].map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.label} className="flex items-center gap-2 flex-shrink-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">{step.label}</span>
                  </motion.div>
                  {i < 5 && <ChevronRight className="w-5 h-5 text-slate-700 flex-shrink-0 hidden sm:block" />}
                </div>
              )
            })}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-[#040810] rounded-xl p-4 border border-slate-700/15">
              <p className="text-2xl font-black text-blue-400">~11s</p>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-1">Full Pipeline</p>
            </div>
            <div className="bg-[#040810] rounded-xl p-4 border border-slate-700/15">
              <p className="text-2xl font-black text-emerald-400">SHA-256</p>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-1">Proof Standard</p>
            </div>
            <div className="bg-[#040810] rounded-xl p-4 border border-slate-700/15">
              <p className="text-2xl font-black text-purple-400">TEE</p>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-1">Verification</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── MARKET & REVENUE ── */}
      <motion.section variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true, margin: '-100px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market */}
          <motion.div variants={fadeUp} className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Market Opportunity</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-[#040810] rounded-xl p-5 border border-slate-700/15">
                <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Total Addressable Market</p>
                <p className="text-3xl font-black text-white mt-1">$2.3T</p>
                <p className="text-xs text-slate-500 mt-1">AI-automated decisions globally (2025)</p>
              </div>
              <div className="bg-[#040810] rounded-xl p-5 border border-slate-700/15">
                <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Serviceable Market</p>
                <p className="text-3xl font-black text-blue-400 mt-1">$50B</p>
                <p className="text-xs text-slate-500 mt-1">Verifiable AI decisions by 2027</p>
              </div>
              <div className="bg-[#040810] rounded-xl p-5 border border-slate-700/15">
                <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Initial Target</p>
                <p className="text-3xl font-black text-emerald-400 mt-1">$500M</p>
                <p className="text-xs text-slate-500 mt-1">DeFi governance & autonomous agents</p>
              </div>
            </div>
          </motion.div>

          {/* Revenue */}
          <motion.div variants={fadeUp} className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Revenue Model</h3>
            </div>
            <div className="space-y-3">
              {REVENUE.map((rev) => {
                const Icon = rev.icon
                return (
                  <div key={rev.stream} className="bg-[#040810] rounded-xl p-4 border border-slate-700/15 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white">{rev.stream}</p>
                      <p className="text-xs text-blue-400 font-semibold mt-0.5">{rev.amount}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{rev.split}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── CTA ── */}
      <motion.section
        variants={fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="text-center"
      >
        <div className="glass-card p-10 sm:p-14 !border-blue-500/15 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/3 to-transparent" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to See It in Action?</h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-8">
              Watch four AI agents deliberate, verify, and execute — all in real-time with cryptographic proofs.
            </p>
            <motion.button
              onClick={() => onNavigate?.('deliberate')}
              whileHover={{ y: -3, boxShadow: '0 20px 60px rgba(59,130,246,0.4)' }}
              whileTap={{ y: 0 }}
              className="px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-bold text-white text-lg flex items-center gap-3 mx-auto shadow-xl shadow-blue-500/25"
            >
              <Zap className="w-6 h-6" /> Launch Deliberation <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
