import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CitationChip } from '@/components/trust/citation-chip'

describe('CitationChip', () => {
  it('renders count of source ids', () => {
    render(<CitationChip sources={['intervention_outcomes:1234', 'cost_priors:55']} />)
    expect(screen.getByText('2 sources')).toBeInTheDocument()
  })

  it('uses singular label for one source', () => {
    render(<CitationChip sources={['species_profiles:42']} />)
    expect(screen.getByText('1 source')).toBeInTheDocument()
  })

  it('renders nothing when sources is empty', () => {
    const { container } = render(<CitationChip sources={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
