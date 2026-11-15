import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/shared/utils/cn'

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    icon: React.ComponentType<{ className?: string }>
    error?: string
}

export function AnimatedInput({ label, icon: Icon, error, id, ...props }: AnimatedInputProps) {
    const [isFocused, setIsFocused] = useState(false)

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-xs font-mono font-semibold text-text uppercase tracking-wider">
                {label}
            </label>

            {/* الـ Container الحاوي لأنيميشن البوردر */}
            <div className="relative rounded-xl p-[1.5px] transition-all duration-300">

                {/* أنيميشن التوهج المتدرج خلف البوردر عند الـ Focus */}
                <motion.div
                    initial={false}
                    animate={{
                        opacity: isFocused ? 1 : 0,
                    }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent blur-[3px] pointer-events-none"
                />

                {/* حقل الإدخال الداخلي للتغطية */}
                <div className="relative flex items-center rounded-[10.5px] bg-surface backdrop-blur-md">
                    <Icon className={cn(
                        'w-4 h-4 absolute left-3.5 transition-colors duration-200 z-10',
                        isFocused ? 'text-primary-light' : 'text-text-secondary'
                    )} />

                    <input
                        id={id}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={cn(
                            'w-full rounded-[10.5px] bg-transparent pl-10 pr-4 py-3 text-sm text-text placeholder:text-text-tertiary focus:outline-none transition-colors relative z-10',
                            error ? 'border border-red-500/80' : 'border border-border hover:border-text-tertiary'
                        )}
                        {...props}
                    />
                </div>
            </div>

            {error && (
                <p className="text-[11px] font-mono text-red-400 flex items-center gap-1 pt-0.5">
                    <span className="inline-block h-1 w-1 rounded-full bg-red-400" />
                    {error}
                </p>
            )}
        </div>
    )
}