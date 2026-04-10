import { cn } from '../../lib/utils'

interface RadioCardProps {
  title: string
  description: string
  badge?: string
  value: string
  checked: boolean
  name: string
  onChange: (value: string) => void
}

export function RadioCard({ title, description, badge, value, checked, name, onChange }: RadioCardProps) {
  return (
    <label
      className={cn(
        'relative flex cursor-pointer gap-3 rounded-2xl border p-4 shadow-card transition',
        checked
          ? 'border-brand-teal/80 bg-white'
          : 'border-brand-dune/80 bg-white/80 hover:border-brand-teal/60',
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <div
        className={cn(
          'mt-1 h-4 w-4 rounded-full border-2',
          checked ? 'border-brand-teal bg-brand-teal/10' : 'border-brand-dune',
        )}
        aria-hidden
      />
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-brand-ink">{title}</p>
          {badge ? (
            <span className="rounded-full bg-brand-teal/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-teal">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="text-sm text-brand-ink/75">{description}</p>
      </div>
    </label>
  )
}
