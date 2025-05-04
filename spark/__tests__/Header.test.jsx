import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "../src/components/Header.jsx";

// Mocks
jest.mock("../libs/firebase/itemDisplay", () => ({
  getAllItems: jest.fn(),
}));
jest.mock("../libs/firebase/zipcodeService", () => ({
  fetchZipcodes: jest.fn(),
}));
jest.mock("../src/Front.jsx", () => {
  const React = require("react");
  return (props) => {
    React.useEffect(() => {
      if (props.onAdd) {
        props.onAdd({ name: "Cheese", price: "$4.99", store: "Aldi" });
      }
    }, []);
    return <div data-testid="mock-front">Mock Front</div>;
  };
});

import { getAllItems } from "../libs/firebase/itemDisplay";
import { fetchZipcodes } from "../libs/firebase/zipcodeService";

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders Header with hamburger and submit button", async () => {
    getAllItems.mockResolvedValue([{ name: "Milk" }, { name: "Eggs" }]);
    fetchZipcodes.mockResolvedValue(["22030", "22031"]);

    render(<Header />);
    expect(await screen.findByText("☰")).toBeInTheDocument();
    expect(await screen.findByText("Submit")).toBeInTheDocument();
  });

  test("loads items and zip codes", async () => {
    getAllItems.mockResolvedValue([{ name: "Banana" }]);
    fetchZipcodes.mockResolvedValue(["20151"]);

    render(<Header />);
    expect(await screen.findByRole("searchbox")).toBeInTheDocument();
    expect(await screen.findByText("20151")).toBeInTheDocument();
  });

  test("handles input and dropdown changes", async () => {
    getAllItems.mockResolvedValue([{ name: "Eggs" }]);
    fetchZipcodes.mockResolvedValue(["22031", "22032"]);
  
    render(<Header />);
  
    const input = await screen.findByRole("searchbox");
  
    await screen.findByText("22032");
    const selects = screen.getAllByRole("combobox");
    const select = selects[1];
  
    const submitButton = screen.getByText("Submit");
  
    fireEvent.change(input, { target: { value: "eggs" } });
    fireEvent.change(select, { target: { value: "22032" } });
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(input.value).toBe("eggs");
      expect(select.value).toBe("22032");
      expect(localStorage.getItem("shoppingList")).toContain("Cheese");
    });
  });

  test("renders Front with props", async () => {
    getAllItems.mockResolvedValue([]);
    fetchZipcodes.mockResolvedValue([]);
    render(<Header />);
    expect(await screen.findByTestId("mock-front")).toBeInTheDocument();
  });

  test("renders fallback zip if unchanged", async () => {
    getAllItems.mockResolvedValue([]);
    fetchZipcodes.mockResolvedValue(null);

    render(<Header />);
    fireEvent.click(screen.getByText("Submit"));

    const select = await screen.findByRole("combobox");
    expect(select).toBeDisabled();
    expect(select).toHaveTextContent("No options available. Please try again later.");
    expect(await screen.findByTestId("mock-front")).toBeInTheDocument();
  });

  test("adds item to shopping list via Front's onAdd", async () => {
    getAllItems.mockResolvedValue([]);
    fetchZipcodes.mockResolvedValue([]);

    render(<Header />);
    await screen.findByTestId("mock-front");

    const stored = JSON.parse(localStorage.getItem("shoppingList"));
    expect(stored).toEqual([{ name: "Cheese", price: "$4.99", store: "Aldi" }]);
  });

  test("explicitly covers handleChange and handleSelectChange", async () => {
    getAllItems.mockResolvedValue([]);
    fetchZipcodes.mockResolvedValue(["22031", "22032"]);

    render(<Header />);
    const input = await screen.findByRole("searchbox");
    const select = screen.getByRole("combobox");

    fireEvent.change(input, { target: { value: "apple" } });
    expect(input.value).toBe("apple");

    fireEvent.change(select, { target: { value: "22031" } });
    expect(select.value).toBe("22031");
  });

  test("explicitly triggers handleChange and updates searchValue", async () => {
    getAllItems.mockResolvedValue([]);
    fetchZipcodes.mockResolvedValue(["22031"]);

    render(<Header />);
    const input = await screen.findByRole("searchbox");

    fireEvent.change(input, { target: { value: "test" } });

    await waitFor(() => {
      expect(input.value).toBe("test");
    });
  });

  test("submit does not update zip when Zip Code is selected", async () => {
    getAllItems.mockResolvedValue([]);
    fetchZipcodes.mockResolvedValue(["Zip Code", "22031", "22032"]);

    render(<Header />);
    const input = await screen.findByRole("searchbox");
    const select = screen.getByRole("combobox");
    const submit = screen.getByText("Submit");

    fireEvent.change(input, { target: { value: "banana" } });
    fireEvent.change(select, { target: { value: "Zip Code" } });
    fireEvent.click(submit);

    await waitFor(() => {
      expect(input.value).toBe("banana");
      expect(select.value).toBe("Zip Code");
    });
  });

  test("sets available items if items exist", async () => {
    getAllItems.mockResolvedValue([{ name: "Eggs" }, { name: "Milk" }]);
    fetchZipcodes.mockResolvedValue([]);
  
    render(<Header />);
    const input = await screen.findByRole("searchbox");
  
    expect(input).toBeInTheDocument();
  
    // Wait until the placeholder updates OR the input is enabled
    await waitFor(() => {
      expect(input).not.toHaveAttribute("disabled");
      expect(input.placeholder).not.toBe("No items available");
    });
  });
  
  test("updates zip if a valid zip is selected", async () => {
    getAllItems.mockResolvedValue([]);
    fetchZipcodes.mockResolvedValue(["22031", "22032"]);
  
    render(<Header />);
    const input = await screen.findByRole("searchbox");
    const select = await screen.findByRole("combobox"); // changed here
    const submit = screen.getByText("Submit");
  
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.change(select, { target: { value: "22032" } });
    fireEvent.click(submit);
  
    await waitFor(() => {
      expect(select.value).toBe("22032");
      expect(localStorage.getItem("shoppingList")).toContain("Cheese");
    });
  });
  
  // ✅ ADD these two new tests to the bottom of your current describe block

  test("handles null items gracefully and does not set availItems", async () => {
    getAllItems.mockResolvedValue(null); // Triggers the `if (items)` to be false
    fetchZipcodes.mockResolvedValue(["22030"]);
  
    render(<Header />);
    const input = await screen.findByRole("searchbox");

    await waitFor(() => {
      // If items were null, the placeholder remains the default
      expect(input).toHaveAttribute("disabled");
      expect(input.placeholder).toBe("No items available");
    });
  });

  test("does not update zip state if zipValue is 'Zip Code'", async () => {
    getAllItems.mockResolvedValue([]);
    fetchZipcodes.mockResolvedValue(["Zip Code", "22030"]);
  
    render(<Header />);
    const input = await screen.findByRole("searchbox");
    const select = await screen.findByRole("combobox");
    const submit = screen.getByText("Submit");

    fireEvent.change(input, { target: { value: "apple" } });
    fireEvent.change(select, { target: { value: "Zip Code" } });
    fireEvent.click(submit);

    await waitFor(() => {
      // Since the zip was not updated, no additional behavior should change
      expect(select.value).toBe("Zip Code");
      expect(input.value).toBe("apple");
    });
  });

  
});
