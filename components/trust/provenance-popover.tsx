import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface ProvenanceSource {
  source: string
  updated_at: string
  detail?: string
}

export interface ProvenancePopoverProps {
  sources: ProvenanceSource[]
}

export function ProvenancePopover({ sources }: ProvenancePopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" aria-label="provenance">
          Provenance ({sources.length})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 text-xs">
        <p className="mb-2 font-medium">Sources contributing to this view</p>
        <ul className="space-y-1.5">
          {sources.map((s, i) => (
            <li key={`${s.source}-${i}`} className="flex justify-between gap-2">
              <span className="font-medium">{s.source}</span>
              <span className="text-muted-foreground">updated {s.updated_at}</span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
