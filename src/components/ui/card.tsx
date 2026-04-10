import { cn } from '../../lib/utils'

interface CardProps {
  title: string
  subtitle?: string
  tag?: string
  className?: string
  children?: React.ReactNode
}

export function Card({ title, subtitle, tag, children, className }: CardProps) {
  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/60 bg-white/90 p-4 shadow-card backdrop-blur transition hover:-translate-y-0.5 hover:shadow-glow',
        'before:pointer-events-none before:absolute before:inset-0 before:bg-card-glow before:content-[""]',
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          {tag ? (
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-brand-ink/60">
              {tag}
            </p>
          ) : null}
          <h3 className="text-lg text-brand-ink">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-sm text-brand-ink/70">{subtitle}</p>
          ) : null}
        </div>
        <div className="h-10 w-10 rounded-full bg-brand-teal/15 ring-1 ring-brand-teal/30" />
      </header>
      {children ? <div className="mt-3 space-y-2 text-sm">{children}</div> : null}
    </article>
  )
}
