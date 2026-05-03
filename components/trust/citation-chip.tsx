import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface CitationChipProps {
  sources: string[]
  className?: string
}

export function CitationChip({ sources, className }: CitationChipProps) {
  if (sources.length === 0) return null
  const label = `${sources.length} source${sources.length === 1 ? '' : 's'}`
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge variant="secondary" className={cn('cursor-pointer', className)}>
          {label}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-72 text-xs">
        <p className="mb-2 font-medium">Cited sources</p>
        <ul className="space-y-1">
          {sources.map((s) => (
            <li key={s} className="font-mono text-muted-foreground">{s}</li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
