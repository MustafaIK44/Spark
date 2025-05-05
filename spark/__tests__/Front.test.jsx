import "@testing-library/jest-dom";
import React from 'react';
import { getAllItems} from "../libs/firebase/itemDisplay";
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import Front from "../src/Front.jsx";

//mocking the productcards so we're just testing front behavior (no integration tests yet)
//https://jestjs.io/docs/mock-functions
jest.mock('../src/components/ProductCard.jsx', () => ({ productName }) => (
    <div data-testid="product-card">{productName}</div>
));

jest.mock('../libs/firebase/itemDisplay', () => ({
    getAllItems: jest.fn()
  }));

afterEach(() => {
    //https://jestjs.io/docs/jest-object#jestclearallmocks
    //https://jestjs.io/docs/jest-object#jestrestoreallmocks
    jest.clearAllMocks();
    jest.restoreAllMocks();
    cleanup();
});

//this will use the mocks from above so it ONLY tests Front itself, and not ProductCards' onAdd nor any firebase things.
describe('Front Unit Tests', () => {
    test('renders default products when search is empty and no products fetched', () => {
        render(<Front search="" onAdd={jest.fn()} />);
        
        const cards = screen.getAllByTestId('product-card');
        expect(cards.length).toBe(5);
        expect(screen.queryByText(/no product found/i)).not.toBeInTheDocument();
        
    });

    test('shows "No Product Found!" if search is not empty and no products exist', () => {
        render(<Front search="milk" onAdd={jest.fn()} />);
        
        expect(screen.getByText(/no product found/i)).toBeInTheDocument();
    });

    test('does not crash if onAdd is not provided', () => {
        render(<Front search="" />);
        expect(screen.getAllByTestId('product-card').length).toBe(5);
      });

    //thanks to the mock from earlier, we're entirely mocking the result from getAllItems

    // test('renders products from getAllItems()', async () => {
    //     getAllItems.mockResolvedValue([
    //         { name: 'Milk', price: '4.99', imageLink: 'https://i5.walmartimages.com/seo/Great-Value-Whole-Vitamin-D-Milk-Gallon-Plastic-Jug-128-Fl-Oz_6a7b09b4-f51d-4bea-a01c-85767f1b481a.86876244397d83ce6cdedb030abe6e4a.jpeg' },
    //         { name: 'Seedless Mandarin Oranges', price: '6.99', imageLink: 'https://i5.peapod.com/c/UJ/UJXAD.png' },
    //     ]);
        
    //     render(<Front search="" onAdd={jest.fn()} />);
        
    //     await waitFor(() => {
    //         const cards = screen.getAllByTestId('product-card');
    //         expect(cards.length).toBe(2);
    //         expect(cards[0]).toHaveTextContent('Milk');
    //         expect(cards[1]).toHaveTextContent('Seedless Mandarin Oranges');
    //     });
    // });
});