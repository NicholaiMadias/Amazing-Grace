import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const slug = (label ?? 'input').toString().trim().toLowerCase().replace(/\s+/g, '-')
    const inputId = id ?? props.name ?? `field-${slug}`

    return (
      <label className="block space-y-2" htmlFor={inputId}>
        {label ? (
          <div className="flex items-center justify-between text-sm font-semibold text-brand-ink">
            <span>{label}</span>
            {hint ? <span className="text-xs font-medium text-brand-ink/60">{hint}</span> : null}
          </div>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-2xl border border-brand-dune/80 bg-white/80 px-4 py-3 text-sm text-brand-ink shadow-card placeholder:text-brand-ink/50 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/40',
            error ? 'border-red-400 ring-2 ring-red-200' : '',
            className,
          )}
          {...props}
        />
        {error ? <p className="text-xs text-red-500">{error}</p> : null}
      </label>
    )
  },
)

Input.displayName = 'Input'
