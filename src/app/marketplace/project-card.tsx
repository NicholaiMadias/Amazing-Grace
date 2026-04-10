import { Card } from '../../components/ui/card'
import { formatBudget } from '../../lib/utils'
import type { Project } from '../../lib/types'

interface Props {
  project: Project
}

export function ProjectCard({ project }: Props) {
  return (
    <Card title={project.title} subtitle={project.summary} tag={project.tag}>
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-brand-ink/60">
        <span className="rounded-full bg-brand-teal/10 px-3 py-1 text-brand-teal"> {project.category}</span>
        <span className="rounded-full bg-brand-gold/10 px-3 py-1 text-brand-ink">{project.timeline}</span>
        <span className="rounded-full bg-brand-cloud px-3 py-1 text-brand-ink">{project.region}</span>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-brand-cloud/70 px-4 py-3 text-sm font-semibold text-brand-ink">
        <span>Budget</span>
        <span className="text-lg">{formatBudget(project.budget)}</span>
      </div>
      <ul className="space-y-1">
        {project.impact.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-brand-ink/80">
            <span className="mt-1 h-2 w-2 rounded-full bg-brand-teal" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </Card>
  )
}
