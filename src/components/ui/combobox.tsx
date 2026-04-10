import { useMemo, useState } from 'react'
import { cn } from '../../lib/utils'
import type { IndustryOption } from '../../lib/types'

interface ComboboxProps {
  label?: string
  options: IndustryOption[]
  value: IndustryOption | null
  placeholder?: string
  onChange: (option: IndustryOption) => void
}

export function Combobox({ label, options, value, placeholder, onChange }: ComboboxProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!query) return options
    const lowered = query.toLowerCase()
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(lowered) ||
        option.description?.toLowerCase().includes(lowered) ||
        option.value.toLowerCase().includes(lowered),
    )
  }, [options, query])

  return (
    <div className="relative space-y-2">
      {label ? (
        <div className="flex items-center justify-between text-sm font-semibold text-brand-ink">
          <span>{label}</span>
          <span className="text-xs font-medium text-brand-ink/60">Searchable</span>
        </div>
      ) : null}
      <div className="relative" onBlur={() => setTimeout(() => setOpen(false), 100)}>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-2xl border border-brand-dune/80 bg-white/80 px-4 py-3 text-left text-sm text-brand-ink shadow-card focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/40"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className={cn(!value && 'text-brand-ink/50')}>
            {value ? value.label : placeholder ?? 'Select an industry'}
          </span>
          <span className="text-xs text-brand-ink/60">▼</span>
        </button>
        {open ? (
          <div className="absolute inset-x-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-brand-dune/80 bg-white shadow-card">
            <div className="border-b border-brand-dune/60 p-3">
              <input
                className="w-full rounded-xl border border-brand-dune/60 bg-brand-cloud/60 px-3 py-2 text-sm focus:border-brand-teal focus:outline-none"
                placeholder="Type to filter..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoFocus
              />
            </div>
            <ul role="listbox" className="divide-y divide-brand-dune/60">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-brand-ink/60">No matches found</li>
              ) : (
                filtered.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      className={cn(
                        'flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition',
                        value?.value === option.value
                          ? 'bg-brand-teal/10 text-brand-ink'
                          : 'hover:bg-brand-cloud/70 text-brand-ink/80',
                      )}
                      role="option"
                      aria-selected={value?.value === option.value}
                      onClick={() => {
                        onChange(option)
                        setQuery('')
                        setOpen(false)
                      }}
                    >
                      <span className="text-sm font-semibold text-brand-ink">{option.label}</span>
                      {option.description ? (
                        <span className="text-xs text-brand-ink/60">{option.description}</span>
                      ) : null}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  )
}
