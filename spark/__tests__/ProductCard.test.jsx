import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../src/components/ProductCard.jsx';

describe('ProductCard', () => {
  test('renders with default props', () => {
    render(<ProductCard />);

    expect(screen.getByText(/Product Name - 0.00/i)).toBeInTheDocument();
    expect(screen.getByText(/Store, Zip/i)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', '/stockeggs.jpeg');
    expect(screen.getByText(/Add to list/i)).toBeInTheDocument();
  });

  test('renders with custom props', () => {
    render(<ProductCard
      productName="Apples"
      productPrice="3.56"
      productStore="Walmart"
      storeZipCode="22030"
      productImage="https://i5.walmartimages.com/seo/Fresh-Gala-Apples-3-lb-Bag_eebbaadc-2ca6-4e25-a2c0-c189d4871fea.bcbe9a9c422a1443b7037548bb2c54c3.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF"
    />);

    expect(screen.getByText(/Milk - 3.99/i)).toBeInTheDocument();
    expect(screen.getByText(/Walmart, 22030/i)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://i5.walmartimages.com/seo/Fresh-Gala-Apples-3-lb-Bag_eebbaadc-2ca6-4e25-a2c0-c189d4871fea.bcbe9a9c422a1443b7037548bb2c54c3.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF"');
  });

  test('calls onAdd with correct product details when button is clicked', () => {
    const mockOnAdd = jest.fn();

    render(<ProductCard
      productName="Eggs"
      productPrice="2.99"
      productStore="Target"
      storeZipCode="20151"
      productImage="../public/images/stockeggs.jpg"
      onAdd={mockOnAdd}
    />);

    fireEvent.click(screen.getByText(/Add to list/i));

    expect(mockOnAdd).toHaveBeenCalledWith({
      name: "Eggs",
      store: "Target",
      zip: "20151",
      price: "2.99",
      image: "../public/images/stockeggs.jpg"
    });
  });

  test('does not crash if onAdd is not provided', () => {
    render(<ProductCard productName="Bread" />);
    fireEvent.click(screen.getByText(/Add to list/i));
    // No assertion needed — test passes if no error is thrown
  });
});