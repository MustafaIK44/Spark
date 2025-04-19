import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ShoppingList from "../src/components/ShoppingList";

beforeEach(() => {
  localStorage.clear();
});

describe("ShoppingList Component", () => {
  test("displays message when no items are added", () => {
    render(<ShoppingList />);
    expect(screen.getByText("No items added yet.")).toBeInTheDocument();
  });

  test("loads and displays grouped shopping list from localStorage", () => {
    const testData = [
      { name: "Milk", price: "$2.99", store: "Target" },
      { name: "Bread", price: "$1.99", store: "Aldi" },
      { name: "Eggs", price: "$3.49", store: "Target" },
    ];
    localStorage.setItem("shoppingList", JSON.stringify(testData));
    render(<ShoppingList />);

    expect(screen.getByText("Aldi")).toBeInTheDocument();
    expect(screen.getByText("Target")).toBeInTheDocument();
    expect(screen.getByText("Milk - $2.99")).toBeInTheDocument();
    expect(screen.getByText("Eggs - $3.49")).toBeInTheDocument();
    expect(screen.getByText("Bread - $1.99")).toBeInTheDocument();
  });

  test("removes an item from the list when remove button is clicked", () => {
    const testData = [
      { name: "Milk", price: "$2.99", store: "Target" },
      { name: "Bread", price: "$1.99", store: "Target" },
    ];
    localStorage.setItem("shoppingList", JSON.stringify(testData));
    render(<ShoppingList />);

    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);

    // After removing Milk, Bread should still exist
    expect(screen.queryByText("Milk - $2.99")).not.toBeInTheDocument();
    expect(screen.getByText("Bread - $1.99")).toBeInTheDocument();
  });
});
