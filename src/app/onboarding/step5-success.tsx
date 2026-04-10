import { PrimaryButton, SecondaryButton } from '../../components/ui/button'
import { Card } from '../../components/ui/card'

interface SuccessStepProps {
  onMarketplace: () => void
  onRestart: () => void
}

export function SuccessStep({ onMarketplace, onRestart }: SuccessStepProps) {
  const quickStarts = [
    {
      title: 'Upload a project',
      subtitle: 'Drag a teaser or one-pager to auto-structure your data room.',
      tag: 'Data room',
    },
    {
      title: 'Book a desk call',
      subtitle: '15-minute review with GulfNexus desk to triage next steps.',
      tag: 'Advisory',
    },
    {
      title: 'Enable monitoring',
      subtitle: 'Connect delivery telemetry for automated ESG and progress.',
      tag: 'Live ops',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="surface space-y-2">
        <p className="text-xs uppercase tracking-[0.08em] text-brand-ink/60">Welcome</p>
        <h2 className="text-brand-ink">You&apos;re in. Let&apos;s ship.</h2>
        <p className="text-sm text-brand-ink/70">
          Your workspace is live. Pick a quick start to keep momentum while the desk activates your lane.
        </p>
      </div>

      <div className="space-y-3">
        {quickStarts.map((card) => (
          <Card key={card.title} title={card.title} subtitle={card.subtitle} tag={card.tag} />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <PrimaryButton className="w-full" onClick={onMarketplace}>
          Go to Marketplace
        </PrimaryButton>
        <SecondaryButton className="w-full" onClick={onRestart}>
          Restart onboarding
        </SecondaryButton>
      </div>
    </div>
  )
}
