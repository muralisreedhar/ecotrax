import { Badge } from '@/components/ui/badge'

export interface AIDisclosureBadgeProps {
  tier: 'unreviewed' | 'reviewed'
  reviewer?: string
}

export function AIDisclosureBadge({ tier, reviewer }: AIDisclosureBadgeProps) {
  if (tier === 'reviewed') {
    return (
      <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-900">
        AI generated · reviewed{reviewer ? ` by ${reviewer}` : ''}
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900">
      AI generated · unreviewed
    </Badge>
  )
}
