import { useMemo, useState } from 'react'
import { PrimaryButton, SecondaryButton } from './components/ui/button'
import { ProgressBar } from './components/ui/progress-bar'
import type { IndustryOption, Intent } from './lib/types'
import { Marketplace } from './app/marketplace'
import { IntentStep } from './app/onboarding/step2-intent'
import { ValueHookStep } from './app/onboarding/step1-value-hook'
import { VerificationStep } from './app/onboarding/step3-verification'
import { SecurityStep } from './app/onboarding/step4-security'
import { SuccessStep } from './app/onboarding/step5-success'

type View = 'marketplace' | 'onboarding'

function App() {
  const [view, setView] = useState<View>('marketplace')
  const [step, setStep] = useState(1)
  const [intent, setIntent] = useState<Intent | null>(null)
  const [crNumber, setCrNumber] = useState('')
  const [industry, setIndustry] = useState<IndustryOption | null>(null)
  const tabs: View[] = ['marketplace', 'onboarding']

  const onboardingProgress = useMemo(() => ((step - 1) / 4) * 100, [step])
  const canAdvance = useMemo(() => {
    if (step === 2) return Boolean(intent)
    if (step === 3) return Boolean(crNumber && industry)
    if (step >= 5) return false
    return true
  }, [crNumber, industry, intent, step])

  const resetOnboarding = () => {
    setStep(1)
    setIntent(null)
    setCrNumber('')
    setIndustry(null)
  }

  const advanceStep = () => {
    if (!canAdvance) return
    setStep((prev) => Math.min(5, prev + 1))
  }

  const renderOnboarding = () => {
    switch (step) {
      case 1:
        return <ValueHookStep onContinue={() => setStep(2)} />
      case 2:
        return (
          <IntentStep selected={intent} onSelect={(value) => setIntent(value)} onContinue={() => setStep(3)} />
        )
      case 3:
        return (
          <VerificationStep
            crNumber={crNumber}
            industry={industry}
            onCrChange={setCrNumber}
            onIndustryChange={setIndustry}
            onContinue={() => setStep(4)}
          />
        )
      case 4:
        return <SecurityStep onContinue={() => setStep(5)} />
      case 5:
      default:
        return (
          <SuccessStep
            onMarketplace={() => setView('marketplace')}
            onRestart={() => {
              resetOnboarding()
              setStep(1)
            }}
          />
        )
    }
  }

  return (
    <main className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/10 p-4 shadow-card backdrop-blur">
        <div className="absolute inset-0 bg-desert-radial opacity-50" aria-hidden />
        <div className="relative flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.1em] text-brand-sand/80">GulfNexus</p>
            <h1 className="text-brand-sand">Premium Gulf project marketplace</h1>
            <p className="text-sm text-brand-sand/80">
              Mobile-first flows, sticky CTAs, and secure onboarding tailored to GCC capital velocity.
            </p>
          </div>
          <SecondaryButton className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em]">
            Beta
          </SecondaryButton>
        </div>
      </div>

      <div className="sticky top-0 z-30 -mx-4 mb-2 flex items-center gap-2 bg-brand-sand/90 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6">
        {tabs.map((item) => {
          const active = view === item
          return (
            <button
              key={item}
              className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold capitalize transition ${
                active ? 'bg-brand-ink text-brand-sand shadow-card' : 'bg-white text-brand-ink/80 shadow-card'
              }`}
              onClick={() => setView(item)}
              aria-pressed={active}
            >
              {item}
            </button>
          )
        })}
      </div>

      {view === 'onboarding' ? (
        <section className="space-y-4 pb-8">
          <ProgressBar value={onboardingProgress} label={`Step ${step} of 5`} />
          {renderOnboarding()}
          <div className="rounded-2xl border border-brand-dune/80 bg-white/90 p-3 shadow-card">
            <div className="flex items-center justify-between text-sm text-brand-ink">
              <span>Current track</span>
              <span className="font-semibold text-brand-teal">{intent ?? 'Not selected yet'}</span>
            </div>
          </div>
        </section>
      ) : (
        <Marketplace />
      )}

      {view === 'onboarding' && step < 5 ? (
        <div className="fixed bottom-4 left-4 right-4 z-30">
          <div className="rounded-3xl bg-brand-ink px-4 py-3 text-brand-sand shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-brand-sand/80">Next</p>
                <p className="text-sm font-semibold text-white">Advance to step {step + 1}</p>
              </div>
              <PrimaryButton
                onClick={advanceStep}
                className="px-4 py-2 text-sm"
                disabled={!canAdvance}
              >
                Continue
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default App
