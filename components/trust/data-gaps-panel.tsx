import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface DataGapsPanelProps {
  gaps: string[]
}

export function DataGapsPanel({ gaps }: DataGapsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base" role="heading" aria-level={3}>What we don&rsquo;t know</CardTitle>
      </CardHeader>
      <CardContent>
        {gaps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No significant data gaps for this view.</p>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {gaps.map((g) => <li key={g}>{g}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
