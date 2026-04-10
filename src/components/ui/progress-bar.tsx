import { cn } from '../../lib/utils'

interface ProgressBarProps {
  value: number
  label?: string
  className?: string
}

export function ProgressBar({ value, label, className }: ProgressBarProps) {
  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <div className="mb-2 flex items-center justify-between text-xs text-brand-ink/70">
          <span>{label}</span>
          <span>{Math.round(value)}%</span>
        </div>
      ) : null}
      <div className="relative h-1.5 overflow-hidden rounded-full bg-brand-cloud/70">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-teal to-brand-gold transition-[width]"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          aria-hidden
        />
      </div>
    </div>
  )
}
