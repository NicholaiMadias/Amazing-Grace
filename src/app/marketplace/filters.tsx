import { projectCategories } from '../../lib/api'
import type { ProjectCategory } from '../../lib/types'
import { cn } from '../../lib/utils'

interface FiltersProps {
  value: ProjectCategory
  onChange: (category: ProjectCategory) => void
}

export function MarketplaceFilters({ value, onChange }: FiltersProps) {
  return (
    <div className="sticky top-16 z-30 -mx-4 mb-3 bg-gradient-to-b from-brand-ink to-brand-ink/80 px-4 pb-3 pt-2 sm:-mx-6 sm:px-6">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.08em] text-brand-sand/80">
        <span>Filters</span>
        <span className="rounded-full bg-brand-teal/15 px-2 py-1 text-[11px] text-brand-sand">Live</span>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {projectCategories.map((category) => {
          const active = value === category
          return (
            <button
              key={category}
              className={cn(
                'whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
                active
                  ? 'bg-white text-brand-ink shadow-card'
                  : 'bg-white/15 text-white hover:bg-white/25',
              )}
              onClick={() => onChange(category)}
              aria-pressed={active}
            >
              {category}
            </button>
          )
        })}
      </div>
    </div>
  )
}
