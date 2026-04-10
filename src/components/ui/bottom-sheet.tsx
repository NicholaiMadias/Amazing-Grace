import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/utils'
import { SecondaryButton } from './button'

interface BottomSheetProps {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function BottomSheet({
  open,
  title,
  onClose,
  children,
  action,
  className,
}: BottomSheetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handler)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={containerRef}
        className={cn(
          'w-full max-w-screen-md rounded-t-3xl border border-white/70 bg-white/95 p-5 shadow-card',
          'transition-all duration-200',
          className,
        )}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-brand-ink/50">Security</p>
            <h3 className="text-lg text-brand-ink">{title}</h3>
          </div>
          <SecondaryButton aria-label="Close" onClick={onClose} className="px-3 py-2 text-xs">
            Close
          </SecondaryButton>
        </div>
        <div className="space-y-3 text-sm text-brand-ink/80">{children}</div>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
