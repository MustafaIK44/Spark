import '@testing-library/jest-dom';
import React from "react";
import { render, screen } from "@testing-library/react";
import DropDown from "../src/components/DropDown.jsx";

describe("DropDown Component", () => {
  
  test("renders dropdown button", () => {
    render(<DropDown choices={["20151", "20153", "22031"]} />);
    expect(screen.getByText("Zip Codes")).toBeInTheDocument();
  });

  test("renders dropdown choices correctly", () => {
    const zipCodes = ["20151", "20153", "22031"];
    render(<DropDown choices={zipCodes} />);

    zipCodes.forEach(zip => {
      expect(screen.getByText(zip)).toBeInTheDocument();
    });
  });

  test("displays 'No options available' when choices is null", () => {
    render(<DropDown choices={null} />);
    expect(screen.getByText("No options available at the moment. Please try again later.")).toBeInTheDocument();
  });

  test("displays 'No options available' when choices is empty", () => {
    render(<DropDown choices={[]} />);
    expect(screen.getByText("No options available at the moment. Please try again later.")).toBeInTheDocument();
  });

});
