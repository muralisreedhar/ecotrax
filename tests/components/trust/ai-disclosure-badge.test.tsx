import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AIDisclosureBadge } from '@/components/trust/ai-disclosure-badge'

describe('AIDisclosureBadge', () => {
  it('renders unreviewed warning', () => {
    render(<AIDisclosureBadge tier="unreviewed" />)
    expect(screen.getByText(/AI generated/i)).toBeInTheDocument()
    expect(screen.getByText(/unreviewed/i)).toBeInTheDocument()
  })
  it('renders reviewed acknowledgement', () => {
    render(<AIDisclosureBadge tier="reviewed" reviewer="Dr. Asha Patel" />)
    expect(screen.getByText(/Dr\. Asha Patel/)).toBeInTheDocument()
  })
})
