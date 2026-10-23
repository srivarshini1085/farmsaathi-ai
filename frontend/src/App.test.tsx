import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('FarmSaathi app shell', () => {
  it('renders dashboard heading and navigation', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByText(/FarmSaathi AI/i)).toBeInTheDocument()
    expect(screen.getByText(/Your field outlook is looking steady/i)).toBeInTheDocument()
  })
})
