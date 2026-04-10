import { cn } from '../../lib/utils'

interface StickyFooterProps {
  children: React.ReactNode
  className?: string
}

export function StickyFooter({ children, className }: StickyFooterProps) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-white/40 bg-gradient-to-t from-white via-white/95 to-white/80 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] shadow-card backdrop-blur',
        className,
      )}
    >
      <div className="mx-auto flex max-w-screen-md items-center gap-3 px-4 py-3 sm:px-6">{children}</div>
    </div>
  )
}
