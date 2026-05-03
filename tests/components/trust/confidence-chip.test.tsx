import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ConfidenceChip } from '@/components/trust/confidence-chip'

describe('ConfidenceChip', () => {
  it('renders score and band label', () => {
    render(<ConfidenceChip score={71} band="moderate" />)
    expect(screen.getByText(/71/)).toBeInTheDocument()
    expect(screen.getByText(/moderate/i)).toBeInTheDocument()
  })

  it('clamps score to 0-100', () => {
    render(<ConfidenceChip score={150} band="very_high" />)
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('formats band labels with title-case spacing', () => {
    render(<ConfidenceChip score={20} band="very_high" />)
    expect(screen.getByText(/Very High/)).toBeInTheDocument()
  })
})
