import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type ConfidenceBand = 'low' | 'moderate' | 'high' | 'very_high'

const BAND_LABEL: Record<ConfidenceBand, string> = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  very_high: 'Very High',
}

const BAND_CLASS: Record<ConfidenceBand, string> = {
  low: 'bg-red-100 text-red-900 border-red-200',
  moderate: 'bg-amber-100 text-amber-900 border-amber-200',
  high: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  very_high: 'bg-emerald-200 text-emerald-950 border-emerald-300',
}

export interface ConfidenceChipProps {
  score: number
  band: ConfidenceBand
  className?: string
}

export function ConfidenceChip({ score, band, className }: ConfidenceChipProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)))
  return (
    <Badge variant="outline" className={cn('gap-1.5 font-medium', BAND_CLASS[band], className)}>
      <span aria-label="confidence score">{clamped}</span>
      <span className="text-xs opacity-80">· {BAND_LABEL[band]}</span>
    </Badge>
  )
}
