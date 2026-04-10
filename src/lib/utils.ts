export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function formatBudget(value: number) {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B USD`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M USD`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K USD`
  }
  return `${value.toLocaleString('en-US')} USD`
}
