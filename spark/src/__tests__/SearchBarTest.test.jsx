import { render, screen } from '@testing-library/react'
import FirstTest from '../components/FirstTest';

test("Introduction message renders successfully", () => {
    render(<SearchBar/>)

    const element = screen.getByText(/eggs/i);

    expect(element).toBeInTheDocument();
})