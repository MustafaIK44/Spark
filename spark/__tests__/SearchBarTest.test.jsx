import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SearchBar from '../src/components/SearchBar.jsx';

describe('SearchBar', () => {
    describe('has not been given an array', () => {
        test("renders without a list", () => {
            render(<SearchBar/>)
            const element = screen.getByRole('searchbox')
            expect(element).toBeInTheDocument()
        })

        test("has a different placeholder", () => {
            render(<SearchBar/>)
            const element = screen.getByPlaceholderText('No items available')
            expect(element).toBeInTheDocument()
        })

        test("is disabled", () => {
            render(<SearchBar/>)
            const element = screen.getByRole('searchbox')
            expect(element).toBeDisabled()
        })

        test("should not be a combobox", () => {
            render(<SearchBar/>)
            const element = screen.queryByRole('combobox')
            expect(element).not.toBeInTheDocument()
        })
    
    })

    describe('has been given an array.', () => {
        const avail_items = ["Eggs", "Bread", "Milk", "Cereal", "Chicken", "Beef", "Apples", "Paper towels", "Toilet paper"];
        test("Search box renders with a list directly given to it", () => {
            render( <SearchBar items={["Eggs", "Bread", "Milk"]}/> )
            const element = screen.getByRole('combobox')
            expect(element).toBeInTheDocument()
        })
        test("Search box renders with a list indirectly given to it", () => {
            render( <SearchBar items={avail_items}/> )
            const element = screen.getByRole('combobox')
            expect(element).toBeInTheDocument()
        })
        test("has a different placeholder", () => {
            render(<SearchBar items={avail_items}/>)
            const element = screen.getByPlaceholderText('Search')
            expect(element).toBeInTheDocument()
        })
    })
})