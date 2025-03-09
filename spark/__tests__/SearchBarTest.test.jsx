import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom'
import SearchBar from '../src/components/SearchBar.jsx';
import AvailableItems from '../src/components/SearchBar.jsx';

describe('SearchBar', () => {
    describe('has not been given an array', () => {
        test("renders without a list (nothing)", () => {
            render(<SearchBar/>)
            const element = screen.getByRole('searchbox')
            expect(element).toBeInTheDocument()
        })

        test("renders without a list (null)", () => {
            render(<SearchBar items={null}/>)
            const element = screen.getByRole('searchbox')
            expect(element).toBeInTheDocument()
        })

        test("renders without a list (empty)", () => {
            render(<SearchBar items={[]}/>)
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
            render( <SearchBar items={["Eggs"]}/> )
            const element = screen.getByRole('combobox')
            expect(element).toBeInTheDocument()
        })
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

    describe('has input', () => {
        const avail_items = ["Eggs", "Bread", "Milk", "Cereal", "Chicken", "Beef", "Apples", "Paper towels", "Toilet paper"];
        test('e appears on input', async () => {
            render(<SearchBar items={avail_items}/>)
            //i want to mimic typing 1 letter, e
            const input = screen.getByRole('combobox')
            await userEvent.type(input, 'e')
            //i want to find at least a few things that render (eggs, bread, cereal, beef, apples, paper towels)
            //https://testing-library.com/docs/user-event/utility#type
            expect(input).toHaveValue('e')
        })
        test('e appears on input', async () => {
            render(<SearchBar items={avail_items}/>)
            //i want to mimic typing 1 letter, e
            const input = screen.getByRole('combobox')
            await userEvent.type(input, 'e')
            waitFor( () => expect(screen.findByText("Eggs")).toBeInTheDocument())
            waitFor( () => expect(screen.findByText("Apples")).toBeInTheDocument())
            waitFor( () => expect(screen.findByText("Milk")).not.toBeInTheDocument())
        })
    })
})