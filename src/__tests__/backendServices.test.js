// Import the functions to test
import { fetchZipcodes, fetchZipcodeData } from '../../Spark/Spark/spark/libs/firebase/zipcodeService';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Mock Firebase
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn()
}));

// Mock the Firestore db
jest.mock('../../Spark/Spark/spark/libs/firebase/config', () => ({
  db: {}
}));

describe('Backend Service Functions', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  /**
   * Test Case 1: fetchZipcodes successfully returns data
   * 
   * This test verifies that the fetchZipcodes function correctly:
   * - Makes the expected Firestore calls
   * - Processes and returns zipcode data
   */
  test('fetchZipcodes should return array of zipcodes when successful', async () => {
    // Setup mock implementation
    const mockDocs = [
      { id: '12345' },
      { id: '67890' },
      { id: '54321' }
    ];
    
    // Mock the query snapshot forEach method
    const mockQuerySnapshot = {
      forEach: jest.fn((callback) => {
        mockDocs.forEach(callback);
      })
    };
    
    // Set up the mock implementations for Firestore functions
    collection.mockReturnValue('zipcode-collection-ref');
    getDocs.mockResolvedValue(mockQuerySnapshot);
    
    // Call the function
    const result = await fetchZipcodes();
    
    // Assertions
    expect(collection).toHaveBeenCalledTimes(1);
    expect(getDocs).toHaveBeenCalledTimes(1);
    expect(result).toEqual(['12345', '67890', '54321']);
    expect(result.length).toBe(3);
  });
  
  /**
   * Test Case 2: fetchZipcodes handles errors correctly
   * 
   * This test verifies that the fetchZipcodes function:
   * - Properly handles errors from Firestore
   * - Returns an empty array upon error
   * - Logs the error (which we can't directly test, but we ensure the flow works)
   */
  test('fetchZipcodes should return empty array when error occurs', async () => {
    // Setup mock implementation to throw an error
    collection.mockReturnValue('zipcode-collection-ref');
    getDocs.mockRejectedValue(new Error('Firestore error'));
    
    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Call the function
    const result = await fetchZipcodes();
    
    // Assertions
    expect(collection).toHaveBeenCalledTimes(1);
    expect(getDocs).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching zipcodes:', expect.any(Error));
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
  
  /**
   * Test Case 3: fetchZipcodeData returns correct data for a zipcode
   * 
   * This test verifies that the fetchZipcodeData function:
   * - Makes the expected Firestore calls with the right parameters
   * - Returns the data when it exists
   */
  test('fetchZipcodeData should return correct data for an existing zipcode', async () => {
    // Mock data
    const zipcode = '12345';
    const mockStoreData = {
      stores: [
        { name: 'Store 1', address: '123 Main St', phone: '555-1234' },
        { name: 'Store 2', address: '456 Oak Ave', phone: '555-5678' }
      ]
    };
    
    // Mock document snapshot
    const mockDocSnap = {
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue(mockStoreData)
    };
    
    // Setup mock implementations
    doc.mockReturnValue('zipcode-doc-ref');
    getDoc.mockResolvedValue(mockDocSnap);
    
    // Call the function
    const result = await fetchZipcodeData(zipcode);
    
    // Assertions
    expect(doc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'zipcode', zipcode);
    expect(getDoc).toHaveBeenCalledTimes(1);
    expect(mockDocSnap.exists).toHaveBeenCalledTimes(1);
    expect(mockDocSnap.data).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockStoreData);
  });
});

// Backend services test file
// Add your test implementations here

describe('Backend Services', () => {
  it('should be implemented', () => {
    // Your test implementation
    expect(true).toBe(true);
  });
}); 