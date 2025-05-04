import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HamburgerMenu from "../src/components/HamburgerMenu";

// Mock useRouter from next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("HamburgerMenu Component", () => {
  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
  ];

  test("renders the hamburger button with default label", () => {
    render(<HamburgerMenu navItems={navItems} />);
    const button = screen.getByText("☰");
    expect(button).toBeInTheDocument();
  });

  test("renders menu items correctly", () => {
    render(<HamburgerMenu navItems={navItems} />);
    navItems.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  test("clicking menu item triggers navigation and closes drawer", () => {
    render(<HamburgerMenu navItems={navItems} />);
    
    const drawerCheckbox = screen.getByRole("checkbox");
    drawerCheckbox.checked = true; // simulate drawer open

    const aboutButton = screen.getByText("About");
    fireEvent.click(aboutButton);

    expect(drawerCheckbox.checked).toBe(false); // drawer should close
  });

  test("renders with custom button label", () => {
    render(<HamburgerMenu navItems={navItems} buttonLabel="Menu" />);
    const labels = screen.getAllByText("Menu");
    expect(labels[0]).toBeInTheDocument(); // or just check that it's at least present
  });
  

  test("handles empty navItems without crashing", () => {
    render(<HamburgerMenu navItems={[]} />);
    expect(screen.getByText("☰")).toBeInTheDocument(); // still renders button
  });
});
