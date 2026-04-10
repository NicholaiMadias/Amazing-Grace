import { PrimaryButton } from '../../components/ui/button'

interface StepOneProps {
  onContinue: () => void
}

export function ValueHookStep({ onContinue }: StepOneProps) {
  return (
    <div className="surface relative overflow-hidden">
      <div className="absolute inset-0 bg-desert-radial opacity-80" aria-hidden />
      <div className="relative flex flex-col gap-4">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-teal/70 via-brand-gold/40 to-brand-ink/90 p-5 text-brand-sand shadow-card">
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.1em] text-brand-sand/80">Gulf onboarding</p>
            <h2 className="leading-tight text-white">Launch with a frictionless, human-led intake</h2>
            <p className="text-sm text-brand-sand/80">
              White-glove review, secure data room, and capital alignment within 48 hours. Designed for one-handed use
              with sticky actions.
            </p>
            <div className="flex gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-brand-sand/80">
              <span className="rounded-full bg-white/20 px-3 py-1">Fast-track</span>
              <span className="rounded-full bg-white/20 px-3 py-1">Trusted desk</span>
            </div>
          </div>
        </div>
        <PrimaryButton className="w-full" onClick={onContinue}>
          Start secure onboarding
        </PrimaryButton>
      </div>
    </div>
  )
}
