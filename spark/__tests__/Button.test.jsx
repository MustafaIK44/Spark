import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../src/components/Button.jsx'

/** Created boilerplate for button test cases based off this prompt (specifications from the button)
 *  "write test cases for a button (made with React and Next.js) with these specifications:
 *      Create a button that can be used for different onClick events.
 *      It will mainly be used to submit info from the search form, or to add an item to a shopping list.
 *       @param text, which will be what text the button displays (dependent on what it's used for)
 *       @param onClick, what specific onClick event happens
 *       @type depends on what type it should be. Button by default, but could be submit type
 *       @className is anything to add on top of the daisyui button class name (usually for styling)
 *       @returns the rendered button"
 *  */

describe("Button", () => {
    test("renders with the correct text", () => {
      render(<Button text="Click Me" />);
      const button = screen.getByRole("button", { name: "Click Me" });
      expect(button).toBeInTheDocument();
    });
  
    test("calls onClick function when clicked", () => {
      const handleClick = jest.fn(); // Mock function
      render(<Button text="Submit" onClick={handleClick} />);
      
      const button = screen.getByRole("button", { name: "Submit" });
      fireEvent.click(button);
  
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  
    test("applies default class and custom class", () => {
      render(<Button text="Styled" className="custom-class" />);
      const button = screen.getByRole("button", { name: "Styled" });
  
      expect(button).toHaveClass("btn"); //Default DaisyUI class
      expect(button).toHaveClass("custom-class"); // Custom class added
    });
  
    test("sets default button type to 'button'", () => {
      render(<Button text="Default Type" />);
      const button = screen.getByRole("button", { name: "Default Type" });
  
      expect(button).toHaveAttribute("type", "button");
    });
  
    test("allows setting a custom button type", () => {
      render(<Button text="Submit" type="submit" />);
      const button = screen.getByRole("button", { name: "Submit" });
  
      expect(button).toHaveAttribute("type", "submit");
    });
    
    test("renders correctly without an onClick handler", () => {
        render(<Button text="No Click Event" />);
        const button = screen.getByRole("button", { name: "No Click Event" });
    
        expect(button).toBeInTheDocument();
        expect(button).not.toHaveAttribute("onClick");
      });
  });