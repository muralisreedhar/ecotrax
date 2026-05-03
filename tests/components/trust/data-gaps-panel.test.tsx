import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DataGapsPanel } from '@/components/trust/data-gaps-panel'

describe('DataGapsPanel', () => {
  it('renders heading and bullet list of gaps', () => {
    render(<DataGapsPanel gaps={['No occurrences since 2018', 'Cost priors n=3']} />)
    expect(screen.getByRole('heading', { name: /what we don['’]t know/i })).toBeInTheDocument()
    expect(screen.getByText(/No occurrences since 2018/)).toBeInTheDocument()
    expect(screen.getByText(/Cost priors n=3/)).toBeInTheDocument()
  })

  it('shows fallback when no gaps', () => {
    render(<DataGapsPanel gaps={[]} />)
    expect(screen.getByText(/no significant data gaps/i)).toBeInTheDocument()
  })
})
