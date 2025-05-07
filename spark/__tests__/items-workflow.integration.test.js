import { collectionGroup, query, orderBy, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../libs/firebase/config';
import { getItemsOnSearch, getAllItems } from '../libs/firebase/itemDisplay';

// Manually mock the firebase modules to control test behavior
jest.mock('firebase/firestore', () => ({
  collectionGroup: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn()
}));

// Mock the firebase config
jest.mock('../libs/firebase/config', () => ({
  db: {},
  auth: {},
  provider: {}
}));

// Mock GoogleAuthProvider
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn().mockImplementation(() => {
    return {};
  })
}));

describe('Item Retrieval Integration Tests', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Item Listing Workflow', () => {
    it('should fetch all items', async () => {
      // Mock data
      const mockItems = [
        { id: 'item1', name: 'Milk', price: 3.99, category: 'Dairy' },
        { id: 'item2', name: 'Bread', price: 2.49, category: 'Bakery' },
        { id: 'item3', name: 'Eggs', price: 4.99, category: 'Dairy' }
      ];
      
      // Mock the firestore query setup
      collectionGroup.mockReturnValue('items-collection-ref');
      query.mockReturnValue('items-query');
      
      // Create proper mock for querySnapshot
      const mockQuerySnapshot = {
        forEach: jest.fn(callback => {
          mockItems.forEach(item => {
            // Create a proper doc reference with nested parent structure
            callback({
              id: item.id,
              data: () => item,
              ref: {
                parent: {
                  parent: {
                    id: 'store-1',
                    parent: {
                      parent: {
                        id: '12345'
                      }
                    }
                  }
                }
              }
            });
          });
        })
      };
      
      // Mock getDocs to return our querySnapshot
      getDocs.mockResolvedValue(mockQuerySnapshot);
      
      // Spy on console.log
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Execute the function under test
      const items = await getAllItems();
      
      // Verify query was called correctly
      expect(collectionGroup).toHaveBeenCalledWith(db, 'items');
      expect(query).toHaveBeenCalledWith('items-collection-ref');
      
      // Verify the result - should have items with store and zipcode added
      expect(items.length).toBe(3);
      expect(items[0].store).toBe('store-1');
      expect(items[0].zipcode).toBe('12345');
      
      consoleLogSpy.mockRestore();
    });

    it('should handle error when fetching items fails', async () => {
      // Setup to throw error
      collectionGroup.mockReturnValue('items-collection-ref');
      query.mockReturnValue('items-query');
      getDocs.mockRejectedValue(new Error('Failed to fetch items'));
      
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const items = await getAllItems();
      
      expect(items).toBeNull();
      expect(consoleLogSpy).toHaveBeenCalled();
      
      consoleLogSpy.mockRestore();
    });
  });

  describe('Item Search Workflow', () => {
    it('should search for items by search term', async () => {
      // Mock data
      const mockAllItems = [
        { id: 'milk1', name: 'Whole Milk', price: 3.99, category: 'Dairy' },
        { id: 'cheese1', name: 'Cheddar Cheese', price: 5.99, category: 'Dairy' },
        { id: 'bread1', name: 'Wheat Bread', price: 2.49, category: 'Bakery' }
      ];
      
      // Mock the firestore query setup
      collectionGroup.mockReturnValue('items-collection-ref');
      query.mockReturnValue('items-query');
      orderBy.mockReturnValue('orderBy-result');
      
      // Create proper mock for querySnapshot
      const mockQuerySnapshot = {
        forEach: jest.fn(callback => {
          mockAllItems.forEach(item => {
            callback({
              id: item.id,
              data: () => item
            });
          });
        })
      };
      
      // Mock getDocs to return our querySnapshot
      getDocs.mockResolvedValue(mockQuerySnapshot);
      
      // Execute function with search term
      const searchTerm = 'cheese';
      const items = await getItemsOnSearch(searchTerm);
      
      // Verify search construction
      expect(collectionGroup).toHaveBeenCalledWith(db, 'items');
      expect(query).toHaveBeenCalledWith('items-collection-ref', orderBy('price', 'asc'));
      
      // Verify the results match expectations - should only contain items with "cheese" in the name
      expect(items.length).toBe(1);
      expect(items[0].name.toLowerCase()).toContain('cheese');
    });

    it('should return all items when search term is empty', async () => {
      // Mock data
      const mockAllItems = [
        { id: 'milk1', name: 'Whole Milk', price: 3.99, category: 'Dairy' },
        { id: 'cheese1', name: 'Cheddar Cheese', price: 5.99, category: 'Dairy' },
        { id: 'bread1', name: 'Wheat Bread', price: 2.49, category: 'Bakery' }
      ];
      
      // Mock the firestore query setup
      collectionGroup.mockReturnValue('items-collection-ref');
      query.mockReturnValue('items-query');
      orderBy.mockReturnValue('orderBy-result');
      
      // Create proper mock for querySnapshot
      const mockQuerySnapshot = {
        forEach: jest.fn(callback => {
          mockAllItems.forEach(item => {
            callback({
              id: item.id,
              data: () => item
            });
          });
        })
      };
      
      // Mock getDocs to return our querySnapshot
      getDocs.mockResolvedValue(mockQuerySnapshot);
      
      // Execute function with empty search term
      const searchTerm = '';
      const items = await getItemsOnSearch(searchTerm);
      
      // Verify all items are returned (no filtering)
      expect(items.length).toBe(3);
    });

    it('should handle errors during item search', async () => {
      // Setup to throw error
      collectionGroup.mockReturnValue('items-collection-ref');
      query.mockReturnValue('items-query');
      orderBy.mockReturnValue('orderBy-result');
      getDocs.mockRejectedValue(new Error('Failed to search items'));
      
      // Spy on console.log
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Execute function with search term
      const searchTerm = 'milk';
      const items = await getItemsOnSearch(searchTerm);
      
      // Verify error handling
      expect(items).toBeNull();
      expect(consoleLogSpy).toHaveBeenCalled();
      
      // Restore console.log
      consoleLogSpy.mockRestore();
    });
  });
}); 