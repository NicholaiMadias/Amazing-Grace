import { PrimaryButton, SecondaryButton } from '../../components/ui/button'
import { Combobox } from '../../components/ui/combobox'
import { Input } from '../../components/ui/input'
import { industries } from '../../lib/api'
import type { IndustryOption } from '../../lib/types'

interface VerificationStepProps {
  crNumber: string
  industry: IndustryOption | null
  onCrChange: (value: string) => void
  onIndustryChange: (option: IndustryOption) => void
  onContinue: () => void
}

export function VerificationStep({
  crNumber,
  industry,
  onCrChange,
  onIndustryChange,
  onContinue,
}: VerificationStepProps) {
  return (
    <div className="space-y-4">
      <div className="surface space-y-2">
        <p className="text-xs uppercase tracking-[0.08em] text-brand-ink/60">Verification</p>
        <h2 className="text-brand-ink">Verify your entity</h2>
        <p className="text-sm text-brand-ink/70">
          We only ask for the data points that speed up approvals. Your information stays inside GulfNexus.
        </p>
      </div>

      <div className="space-y-3 rounded-3xl border border-brand-dune/80 bg-white/90 p-4 shadow-card">
        <Input
          label="Commercial Registration Number"
          placeholder="Enter CR / company ID"
          value={crNumber}
          onChange={(event) => onCrChange(event.target.value)}
        />
        <Combobox
          label="Industry focus"
          options={industries}
          value={industry}
          placeholder="Tap to search industries"
          onChange={onIndustryChange}
        />
        <SecondaryButton className="w-full" onClick={() => onCrChange('')}>
          Scan document instead
        </SecondaryButton>
      </div>

      <PrimaryButton className="w-full" onClick={onContinue} disabled={!crNumber || !industry}>
        Continue
      </PrimaryButton>
    </div>
  )
}
