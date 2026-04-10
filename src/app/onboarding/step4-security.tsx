import { useState, type Dispatch, type SetStateAction } from 'react'
import { BottomSheet } from '../../components/ui/bottom-sheet'
import { PrimaryButton, SecondaryButton } from '../../components/ui/button'
import { cn } from '../../lib/utils'

interface SecurityStepProps {
  onContinue: () => void
}

export function SecurityStep({ onContinue }: SecurityStepProps) {
  const [sheetOpen, setSheetOpen] = useState(true)
  const [biometric, setBiometric] = useState(true)
  const [whatsapp, setWhatsapp] = useState(true)
  const [sms, setSms] = useState(false)

  const toggle = (setter: Dispatch<SetStateAction<boolean>>) => setter((prev) => !prev)

  return (
    <div className="space-y-4">
      <div className="surface space-y-2">
        <p className="text-xs uppercase tracking-[0.08em] text-brand-ink/60">Security</p>
        <h2 className="text-brand-ink">Lock in biometrics & 2FA</h2>
        <p className="text-sm text-brand-ink/70">
          We protect your projects with biometric checks plus WhatsApp/SMS verification that works for Gulf teams.
        </p>
        <SecondaryButton className="w-full" onClick={() => setSheetOpen(true)}>
          Configure bottom sheet
        </SecondaryButton>
      </div>

      <div className="rounded-3xl border border-brand-dune/80 bg-white/90 p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-ink">Biometric sign-in</p>
            <p className="text-xs text-brand-ink/60">Face/Touch ID across devices</p>
          </div>
          <button
            type="button"
            className={cn(
              'relative inline-flex h-9 w-16 items-center rounded-full border px-1 transition',
              biometric ? 'border-brand-teal bg-brand-teal/20' : 'border-brand-dune bg-brand-cloud/60',
            )}
            onClick={() => toggle(setBiometric)}
            aria-pressed={biometric}
          >
            <span
              className={cn(
                'h-7 w-7 rounded-full bg-white shadow-card transition-all',
                biometric ? 'translate-x-7' : 'translate-x-0',
              )}
            />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <ChannelCard
            title="WhatsApp 2FA"
            description="Fastest for GCC numbers"
            enabled={whatsapp}
            onToggle={() => toggle(setWhatsapp)}
          />
          <ChannelCard
            title="SMS 2FA"
            description="Carrier fallback mode"
            enabled={sms}
            onToggle={() => toggle(setSms)}
          />
        </div>
      </div>

      <PrimaryButton className="w-full" onClick={onContinue}>
        Secure & continue
      </PrimaryButton>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Security controls"
        action={
          <PrimaryButton className="w-full" onClick={() => setSheetOpen(false)}>
            Save preferences
          </PrimaryButton>
        }
      >
        <div className="rounded-2xl border border-brand-dune/80 bg-brand-cloud/60 p-3 text-sm text-brand-ink">
          <p className="font-semibold text-brand-ink">Biometric</p>
          <p className="text-brand-ink/70">We bind your device for faster approvals and sign-ins.</p>
        </div>
        <div className="space-y-2">
          <ChannelRow
            title="WhatsApp verification"
            description="Primary channel with high deliverability"
            active={whatsapp}
            onToggle={() => toggle(setWhatsapp)}
          />
          <ChannelRow
            title="SMS verification"
            description="Fallback SMS to handle roaming"
            active={sms}
            onToggle={() => toggle(setSms)}
          />
        </div>
      </BottomSheet>
    </div>
  )
}

function ChannelCard({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string
  description: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-full flex-col items-start justify-between rounded-2xl border p-3 text-left shadow-card transition',
        enabled ? 'border-brand-teal/70 bg-brand-teal/10' : 'border-brand-dune/80 bg-white/80 hover:border-brand-teal/50',
      )}
      onClick={onToggle}
      aria-pressed={enabled}
    >
      <div>
        <p className="text-sm font-semibold text-brand-ink">{title}</p>
        <p className="text-xs text-brand-ink/70">{description}</p>
      </div>
      <span
        className={cn(
          'mt-2 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]',
          enabled ? 'bg-brand-teal text-white' : 'bg-brand-cloud text-brand-ink/70',
        )}
      >
        {enabled ? 'Enabled' : 'Tap to enable'}
      </span>
    </button>
  )
}

function ChannelRow({
  title,
  description,
  active,
  onToggle,
}: {
  title: string
  description: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-brand-dune/80 bg-white/80 px-3 py-2">
      <div>
        <p className="text-sm font-semibold text-brand-ink">{title}</p>
        <p className="text-xs text-brand-ink/60">{description}</p>
      </div>
      <button
        type="button"
        className={cn(
          'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] transition',
          active ? 'bg-brand-teal text-white' : 'bg-brand-cloud text-brand-ink/70',
        )}
        onClick={onToggle}
      >
        {active ? 'On' : 'Off'}
      </button>
    </div>
  )
}
