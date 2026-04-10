import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const base =
  'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

export const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        base,
        'bg-gradient-to-r from-brand-teal to-brand-gold text-brand-ink shadow-glow ring-offset-brand-sand hover:brightness-[1.04] active:translate-y-[1px]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
)

export const SecondaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        base,
        'border border-brand-dune/80 bg-white/80 text-brand-ink shadow-card ring-offset-brand-sand hover:border-brand-teal/60',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
)

PrimaryButton.displayName = 'PrimaryButton'
SecondaryButton.displayName = 'SecondaryButton'
