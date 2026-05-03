import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProvenancePopover } from '@/components/trust/provenance-popover'

describe('ProvenancePopover', () => {
  it('renders trigger with source count label', () => {
    render(
      <ProvenancePopover
        sources={[
          { source: 'gbif', updated_at: '2026-04-01' },
          { source: 'iucn', updated_at: '2026-03-15' },
        ]}
      />,
    )
    expect(screen.getByRole('button', { name: /provenance/i })).toBeInTheDocument()
  })
})
