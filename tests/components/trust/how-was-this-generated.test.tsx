import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HowWasThisGenerated } from '@/components/trust/how-was-this-generated'

describe('HowWasThisGenerated', () => {
  it('expands to show prompt version and retrieval sources on click', () => {
    render(
      <HowWasThisGenerated
        outputId="ai_outputs:42"
        promptVersion="plan-v1.0.0"
        retrievalSources={['species_profiles:88', 'cost_priors:7']}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /how was this generated/i }))
    expect(screen.getByText(/plan-v1\.0\.0/)).toBeInTheDocument()
    expect(screen.getByText(/species_profiles:88/)).toBeInTheDocument()
    expect(screen.getByText(/cost_priors:7/)).toBeInTheDocument()
  })
})
