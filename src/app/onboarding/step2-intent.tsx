import { PrimaryButton } from '../../components/ui/button'
import { RadioCard } from '../../components/ui/radio-card'
import { intents } from '../../lib/api'
import type { Intent } from '../../lib/types'

interface IntentStepProps {
  selected: Intent | null
  onSelect: (intent: Intent) => void
  onContinue: () => void
}

export function IntentStep({ selected, onSelect, onContinue }: IntentStepProps) {
  return (
    <div className="space-y-4">
      <div className="surface">
        <p className="text-xs uppercase tracking-[0.08em] text-brand-ink/60">Who are you?</p>
        <h2 className="text-brand-ink">Choose your track</h2>
        <p className="text-sm text-brand-ink/70">
          We adapt the flow for the role you play in Gulf projects, ensuring only relevant asks and faster approvals.
        </p>
      </div>

      <div className="space-y-3">
        {intents.map((intent) => (
          <RadioCard
            key={intent.value}
            title={intent.title}
            description={intent.description}
            badge={intent.badge}
            value={intent.value}
            name="intent"
            checked={selected === intent.value}
            onChange={(value) => onSelect(value as Intent)}
          />
        ))}
      </div>

      <PrimaryButton className="w-full" onClick={onContinue} disabled={!selected}>
        Continue
      </PrimaryButton>
    </div>
  )
}
