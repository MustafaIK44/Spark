import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SearchBar from '../src/components/SearchBar.jsx';

describe('SearchBar', () => {
    render(<SearchBar/>)
test("Search box renders successfully (with a list)", () => {
    const element = screen.getByRole('combobox')

    expect(element).toBeInTheDocument()
})
})