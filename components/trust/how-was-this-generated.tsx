'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export interface HowWasThisGeneratedProps {
  outputId: string
  promptVersion: string
  retrievalSources: string[]
}

export function HowWasThisGenerated({
  outputId,
  promptVersion,
  retrievalSources,
}: HowWasThisGeneratedProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="text-xs">
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2"
        onClick={() => setOpen((v) => !v)}
      >
        How was this generated?
      </Button>
      {open && (
        <div className="mt-2 rounded border bg-muted/50 p-3 font-mono">
          <p>output: {outputId}</p>
          <p>prompt: {promptVersion}</p>
          <p className="mt-1">retrieval:</p>
          <ul className="ml-4 list-disc">
            {retrievalSources.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
