interface TraitsDisplayProps {
    traits: {
        reasoning: number
        creativity: number
        caution: number
        speed: number
        accuracy: number
        adaptability: number
    }
    compact?: boolean
}

const traitConfig = [
    { key: 'reasoning', label: 'Reasoning', emoji: '🧠', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500' },
    { key: 'creativity', label: 'Creativity', emoji: '🎨', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500' },
    { key: 'caution', label: 'Caution', emoji: '🛡️', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500' },
    { key: 'speed', label: 'Speed', emoji: '⚡', color: 'from-yellow-500 to-lime-500', bg: 'bg-yellow-500' },
    { key: 'accuracy', label: 'Accuracy', emoji: '🎯', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500' },
    { key: 'adaptability', label: 'Adapt.', emoji: '🔄', color: 'from-indigo-500 to-violet-500', bg: 'bg-indigo-500' },
]

export default function TraitsDisplay({ traits, compact }: TraitsDisplayProps) {
    return (
        <div className={compact ? 'space-y-1.5' : 'space-y-2.5'}>
            {traitConfig.map(({ key, label, emoji, color }) => {
                const value = (traits as any)[key] || 0
                return (
                    <div key={key} className="flex items-center gap-2 group">
                        {!compact && <span className="text-sm w-5">{emoji}</span>}
                        <span className={`text-slate-400 font-medium ${compact ? 'text-[11px] w-14' : 'text-xs w-20'}`}>
                            {compact ? label.slice(0, 5) : label}
                        </span>
                        <div className={`flex-1 ${compact ? 'h-1.5' : 'h-2.5'} bg-slate-800/80 rounded-full overflow-hidden`}>
                            <div
                                className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700 group-hover:brightness-125`}
                                style={{ width: `${Math.min(100, value)}%` }}
                            />
                        </div>
                        <span className={`font-bold text-slate-200 ${compact ? 'text-[11px] w-6' : 'text-xs w-8'} text-right tabular-nums`}>
                            {value}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
