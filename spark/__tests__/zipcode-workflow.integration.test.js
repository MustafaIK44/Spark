import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../libs/firebase/config';
import { fetchZipcodes, fetchZipcodeData } from '../libs/zipcodeService';

// Manually mock the firebase modules to control test behavior
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn()
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

describe('Zipcode Workflow Integration Tests', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test the complete zipcode data retrieval workflow
   */
  describe('Complete Zipcode Store Discovery Workflow', () => {
    it('should fetch zipcodes and then retrieve data for a specific zipcode', async () => {
      // Setup mock data
      const mockZipcodes = ['12345', '67890', '54321'];
      
      // Mock the query snapshot forEach method for zipcode collection
      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          mockZipcodes.forEach(zipcode => {
            callback({ id: zipcode });
          });
        })
      };
      
      // Mock the document snapshot for zipcode data
      const mockZipcodeDoc = {
        exists: jest.fn().mockReturnValue(true),
        data: jest.fn().mockReturnValue({
          stores: [
            { id: 'store1', name: 'Grocery Store', address: '123 Main St' },
            { id: 'store2', name: 'Pharmacy', address: '456 Oak Ave' }
          ]
        })
      };
      
      // Configure mock implementations
      collection.mockReturnValue('zipcode-collection-ref');
      getDocs.mockResolvedValue(mockQuerySnapshot);
      doc.mockReturnValue('zipcode-doc-ref');
      getDoc.mockResolvedValue(mockZipcodeDoc);
      
      // Step 1: Fetch all available zipcodes
      const zipcodes = await fetchZipcodes();
      
      // Step 2: Select a zipcode and fetch its data
      const selectedZipcode = zipcodes[0]; // '12345'
      const zipcodeData = await fetchZipcodeData(selectedZipcode);
      
      // Verify zipcodes were fetched correctly
      expect(collection).toHaveBeenCalledWith(db, 'zipcode');
      expect(getDocs).toHaveBeenCalledWith('zipcode-collection-ref');
      expect(zipcodes).toEqual(mockZipcodes);
      
      // Verify zipcode data was fetched correctly
      expect(doc).toHaveBeenCalledWith(db, 'zipcode', '12345');
      expect(getDoc).toHaveBeenCalledWith('zipcode-doc-ref');
      expect(zipcodeData).toEqual({
        stores: [
          { id: 'store1', name: 'Grocery Store', address: '123 Main St' },
          { id: 'store2', name: 'Pharmacy', address: '456 Oak Ave' }
        ]
      });
    });

    it('should handle a zipcode that does not exist', async () => {
      // Setup mock data
      const mockZipcodes = ['12345', '67890', '54321'];
      
      // Mock the query snapshot forEach method
      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          mockZipcodes.forEach(zipcode => {
            callback({ id: zipcode });
          });
        })
      };
      
      // Mock a document snapshot that doesn't exist
      const mockNonExistentDoc = {
        exists: jest.fn().mockReturnValue(false),
        data: jest.fn()
      };
      
      // Configure mock implementations
      collection.mockReturnValue('zipcode-collection-ref');
      getDocs.mockResolvedValue(mockQuerySnapshot);
      doc.mockReturnValue('zipcode-doc-ref');
      getDoc.mockResolvedValue(mockNonExistentDoc);
      
      // Spy on console.log
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Step 1: Fetch all available zipcodes
      const zipcodes = await fetchZipcodes();
      
      // Step 2: Try to fetch data for a non-existent zipcode
      const nonExistentZipcode = '99999'; // Not in our mock data
      const zipcodeData = await fetchZipcodeData(nonExistentZipcode);
      
      // Verify zipcode data fetch attempt
      expect(doc).toHaveBeenCalledWith(db, 'zipcode', '99999');
      expect(getDoc).toHaveBeenCalledWith('zipcode-doc-ref');
      expect(mockNonExistentDoc.exists).toHaveBeenCalled();
      expect(zipcodeData).toBeNull();
      expect(consoleLogSpy).toHaveBeenCalledWith(`No data found for zipcode: 99999`);
      
      // Restore console.log
      consoleLogSpy.mockRestore();
    });

    it('should handle errors in the zipcode workflow', async () => {
      // Setup mock implementations to throw errors
      collection.mockReturnValue('zipcode-collection-ref');
      
      // First test: error in fetchZipcodes
      getDocs.mockRejectedValueOnce(new Error('Failed to fetch zipcodes'));
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Step 1: Attempt to fetch zipcodes with a simulated error
      const zipcodes = await fetchZipcodes();
      
      // Verify error handling in fetchZipcodes
      expect(collection).toHaveBeenCalledWith(db, 'zipcode');
      expect(getDocs).toHaveBeenCalledWith('zipcode-collection-ref');
      expect(zipcodes).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching zipcodes:',
        expect.objectContaining({ message: 'Failed to fetch zipcodes' })
      );
      
      // Reset error spy
      consoleErrorSpy.mockClear();
      
      // Mock successful zipcode fetch for the next part
      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          callback({ id: '12345' });
        })
      };
      getDocs.mockResolvedValueOnce(mockQuerySnapshot);
      
      // But make fetchZipcodeData fail
      doc.mockReturnValue('zipcode-doc-ref');
      getDoc.mockRejectedValueOnce(new Error('Failed to fetch zipcode data'));
      
      // Step 2: Successfully fetch zipcodes, then fail on fetchZipcodeData
      const refreshedZipcodes = await fetchZipcodes();
      const zipcodeData = await fetchZipcodeData(refreshedZipcodes[0]);
      
      // Verify error handling in fetchZipcodeData
      expect(doc).toHaveBeenCalledWith(db, 'zipcode', '12345');
      expect(getDoc).toHaveBeenCalledWith('zipcode-doc-ref');
      expect(zipcodeData).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching data for zipcode 12345:',
        expect.objectContaining({ message: 'Failed to fetch zipcode data' })
      );
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Store Selection from Zipcode Data', () => {
    it('should fetch zipcode data and find a specific store by ID', async () => {
      // Setup mock data
      const mockStoreId = 'store2';
      const mockZipcodeDoc = {
        exists: jest.fn().mockReturnValue(true),
        data: jest.fn().mockReturnValue({
          stores: [
            { id: 'store1', name: 'Grocery Store', address: '123 Main St' },
            { id: mockStoreId, name: 'Pharmacy', address: '456 Oak Ave' },
            { id: 'store3', name: 'Hardware Store', address: '789 Pine Rd' }
          ]
        })
      };
      
      // Configure mock implementations
      doc.mockReturnValue('zipcode-doc-ref');
      getDoc.mockResolvedValue(mockZipcodeDoc);
      
      // Step 1: Fetch zipcode data
      const zipcode = '12345';
      const zipcodeData = await fetchZipcodeData(zipcode);
      
      // Step 2: Find a specific store by ID
      const findStoreById = (storeId) => {
        return zipcodeData.stores.find(store => store.id === storeId) || null;
      };
      
      const selectedStore = findStoreById(mockStoreId);
      
      // Verify zipcode data was fetched
      expect(doc).toHaveBeenCalledWith(db, 'zipcode', '12345');
      expect(getDoc).toHaveBeenCalledWith('zipcode-doc-ref');
      expect(zipcodeData.stores.length).toBe(3);
      
      // Verify store was found correctly
      expect(selectedStore).toEqual({
        id: 'store2',
        name: 'Pharmacy',
        address: '456 Oak Ave'
      });
    });
  });
}); 