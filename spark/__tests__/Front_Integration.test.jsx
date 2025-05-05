import "@testing-library/jest-dom";
import React from 'react';
import { getAllItems} from "../libs/firebase/itemDisplay";
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import Front from "../src/Front.jsx";

afterEach(() => {
    //https://jestjs.io/docs/jest-object#jestclearallmocks
    jest.clearAllMocks();
});

//still mocking itemDisplay so we don't call from the database
jest.mock('../libs/firebase/itemDisplay', () => ({
    getAllItems: jest.fn()
  }));

//now we do the integration tests to see if ProductCard onAdd and getAllItems works with Front
describe('Front/ProductCard/getAllItems integration', () => {
    test('renders fallback products if getAllItems returns null', async () => {
        getAllItems.mockResolvedValue(null);
    
        render(<Front search="" onAdd={jest.fn()} />);
    
        await waitFor(() => {
          const cards = screen.getAllByRole('heading', { level: 2 });
          expect(cards).toHaveLength(5);
          expect(cards[0]).toHaveTextContent('Eggs');
        });
      });

    test('renders default products when search is empty and no products fetched', async () => {
        getAllItems.mockResolvedValue([]);
        render(<Front search="" onAdd={jest.fn()} />);
        
        await waitFor(() => {
            const cards = screen.getAllByRole('heading', { level: 2 });
            expect(cards).toHaveLength(5); // Eggs, Apples, Bread, Cereal, Banana
            expect(cards[0]).toHaveTextContent('Eggs');
            expect(cards[1]).toHaveTextContent('Apples');
            expect(cards[2]).toHaveTextContent('Bread');
            expect(cards[3]).toHaveTextContent('Cereal');
            expect(cards[4]).toHaveTextContent('Banana');
    });    
    });

    test('displays "No Product Found!" when search is "beef" (something not in mocked values) and no matching items are returned', async () => {
        getAllItems.mockResolvedValue([
          { name: 'Milk', price: '4.99', imageLink: 'https://i5.walmartimages.com/seo/Great-Value-Whole-Vitamin-D-Milk-Gallon-Plastic-Jug-128-Fl-Oz_6a7b09b4-f51d-4bea-a01c-85767f1b481a.86876244397d83ce6cdedb030abe6e4a.jpeg'},
          {name: 'Seedless Mandarin Oranges', price: '6.99', imageLink: 'https://i5.peapod.com/c/UJ/UJXAD.png'}
        ]);
      
        render(<Front search="beef" onAdd={jest.fn()} />);
      
        await waitFor(() => {
          expect(screen.getByText(/no product found/i)).toBeInTheDocument();
        });
    });

});