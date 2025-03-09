import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Header from '../src/components/Header.jsx'
 
describe('Header', () => {
  render(<Header />)
  test('renders a heading', () => {
    const heading = screen.getByRole('heading', { level: 1 })
 
    expect(heading).toBeInTheDocument()
  })

  test('does not render a paragraph', () => {
    const heading = screen.queryByRole('paragraph')
 
    expect(heading).not.toBeInTheDocument()
  })
})