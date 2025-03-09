import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import DropDown from "../src/components/DropDown.jsx";

describe("DropDown Component", () => {
  
  test("renders dropdown with correct label", () => {
    render(<DropDown choices={["20151", "20153", "22031"]} text="Select a Zip Code" />);
    expect(screen.getByText("Select a Zip Code")).toBeInTheDocument();
  });

  test("renders dropdown choices correctly", () => {
    const zipCodes = ["20151", "20153", "22031"];
    render(<DropDown choices={zipCodes} text="Select a Zip Code" />);

    zipCodes.forEach(zip => {
      expect(screen.getByText(zip)).toBeInTheDocument();
    });
  });

  test("displays 'No options available' when choices is null", () => {
    render(<DropDown choices={null} text="Select a Zip Code" />);
    expect(screen.getByText("Select a Zip Code")).toBeInTheDocument();
    expect(screen.getByText("No options available at the moment. Please try again later.")).toBeInTheDocument();
  });

  test("displays 'No options available' when choices is empty", () => {
    render(<DropDown choices={[]} text="Select a Zip Code" />);
    expect(screen.getByText("Select a Zip Code")).toBeInTheDocument();
    expect(screen.getByText("No options available at the moment. Please try again later.")).toBeInTheDocument();
  });

  test("renders default label when no text prop is provided", () => {
    render(<DropDown choices={["20151", "20153"]} />); 
    expect(screen.getByText("Select an Option")).toBeInTheDocument();
  });

});
