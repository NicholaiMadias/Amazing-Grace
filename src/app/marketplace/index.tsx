import { useMemo, useState } from 'react'
import { PrimaryButton, SecondaryButton } from '../../components/ui/button'
import { StickyFooter } from '../../components/ui/sticky-footer'
import { filterProjects } from '../../lib/api'
import type { ProjectCategory } from '../../lib/types'
import { MarketplaceFilters } from './filters'
import { ProjectCard } from './project-card'

export function Marketplace() {
  const [category, setCategory] = useState<ProjectCategory>('All')

  const visibleProjects = useMemo(() => filterProjects(category), [category])

  const stats = [
    { label: 'Active pipeline', value: '22', suffix: 'projects' },
    { label: 'Avg. ticket', value: '$145M', suffix: 'USD' },
    { label: 'Deployable in', value: '90', suffix: 'days' },
  ]

  return (
    <section className="space-y-4 pb-10">
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-brand-ink px-5 py-6 text-brand-sand shadow-card">
        <div className="absolute inset-0 bg-desert-radial opacity-60" aria-hidden />
        <div className="relative flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.12em] text-brand-sand/80">GulfNexus Marketplace</p>
          <h2 className="text-3xl font-semibold text-brand-sand">Projects built for the Gulf velocity</h2>
          <p className="text-sm text-brand-sand/80">
            Filter capital-ready infrastructure, technology, and investment opportunities with transparent impact and
            delivery partners.
          </p>
          <div className="mt-2 grid grid-cols-3 gap-3 text-sm sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.08em] text-brand-sand/70">{stat.label}</p>
                <p className="text-xl font-semibold text-white">
                  {stat.value}{' '}
                  <span className="text-xs font-medium text-brand-sand/70 uppercase tracking-[0.08em]">
                    {stat.suffix}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MarketplaceFilters value={category} onChange={setCategory} />

      <div className="space-y-3">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-brand-dune/70 bg-white/90 p-5 shadow-card">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.08em] text-brand-ink/60">Need a quick review?</p>
          <h3 className="text-xl font-semibold text-brand-ink">White-glove submission</h3>
          <p className="text-sm text-brand-ink/75">
            Share your project outline and our GulfNexus desk will return a structure, data room template, and partner
            shortlist within 72 hours.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-brand-teal">
              NDA ready
            </span>
            <span className="rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-brand-ink">
              Humans on chat
            </span>
          </div>
        </div>
      </div>

      <StickyFooter>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-ink/60">Project Desk</p>
          <p className="text-sm font-semibold text-brand-ink">Submit once, matched to capital and partners</p>
        </div>
        <PrimaryButton className="px-5">Submit a Project</PrimaryButton>
        <SecondaryButton className="px-4">Talk to an advisor</SecondaryButton>
      </StickyFooter>
    </section>
  )
}
