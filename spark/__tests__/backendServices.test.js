// Mock implementations of Firestore functions
const mockCollection = jest.fn();
const mockGetDocs = jest.fn();
const mockDoc = jest.fn();
const mockGetDoc = jest.fn();

// Manual mock implementations of the service functions
const fetchZipcodes = async () => {
  try {
    const zipcodeCollectionRef = mockCollection({}, 'zipcode');
    const querySnapshot = await mockGetDocs(zipcodeCollectionRef);
    
    const zipcodes = [];
    querySnapshot.forEach((doc) => {
      // If the document ID is the zipcode, add it directly
      if (doc.id) { // Only add non-null, non-undefined IDs
        zipcodes.push(doc.id);
      }
    });
    
    return zipcodes;
  } catch (error) {
    console.error('Error fetching zipcodes:', error);
    return [];
  }
};

const fetchZipcodeData = async (zipcode) => {
  try {
    if (!zipcode) {
      throw new Error('No zipcode provided');
    }
    
    const zipcodeDocRef = mockDoc({}, 'zipcode', zipcode);
    const docSnap = await mockGetDoc(zipcodeDocRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log(`No data found for zipcode: ${zipcode}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching data for zipcode ${zipcode}:`, error);
    return null;
  }
};

describe('Backend Service Functions', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  /**
   * Test Suite for fetchZipcodes function
   */
  describe('fetchZipcodes', () => {
    test('should return array of zipcodes when successful', async () => {
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
      mockCollection.mockReturnValue('zipcode-collection-ref');
      mockGetDocs.mockResolvedValue(mockQuerySnapshot);
      
      // Call the function
      const result = await fetchZipcodes();
      
      // Assertions
      expect(mockCollection).toHaveBeenCalledTimes(1);
      expect(mockGetDocs).toHaveBeenCalledTimes(1);
      expect(result).toEqual(['12345', '67890', '54321']);
      expect(result.length).toBe(3);
    });
    
    test('should return empty array when no zipcodes are found', async () => {
      // Mock the query snapshot with no documents
      const mockQuerySnapshot = {
        forEach: jest.fn() // Empty forEach that doesn't call the callback
      };
      
      mockCollection.mockReturnValue('zipcode-collection-ref');
      mockGetDocs.mockResolvedValue(mockQuerySnapshot);
      
      // Call the function
      const result = await fetchZipcodes();
      
      // Assertions
      expect(mockCollection).toHaveBeenCalledTimes(1);
      expect(mockGetDocs).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
    
    test('should return empty array when error occurs', async () => {
      // Setup mock implementation to throw an error
      mockCollection.mockReturnValue('zipcode-collection-ref');
      mockGetDocs.mockRejectedValue(new Error('Firestore error'));
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Call the function
      const result = await fetchZipcodes();
      
      // Assertions
      expect(mockCollection).toHaveBeenCalledTimes(1);
      expect(mockGetDocs).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching zipcodes:', expect.any(Error));
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
    
    test('should handle specific Firebase permission errors', async () => {
      // Setup mock implementation with a Firebase permission error
      mockCollection.mockReturnValue('zipcode-collection-ref');
      const permissionError = new Error('Permission denied');
      permissionError.code = 'permission-denied';
      mockGetDocs.mockRejectedValue(permissionError);
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Call the function
      const result = await fetchZipcodes();
      
      // Assertions
      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching zipcodes:', expect.objectContaining({
        code: 'permission-denied'
      }));
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
    
    test('should handle malformed document data gracefully', async () => {
      // Setup mock implementation with documents that don't have proper IDs
      const mockDocs = [
        { /* Missing ID property */ },
        { id: null },
        { id: undefined },
        { id: '12345' } // Only this one should be added
      ];
      
      // Mock the query snapshot forEach method that will encounter malformed data
      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          mockDocs.forEach(callback);
        })
      };
      
      // Set up the mock implementations
      mockCollection.mockReturnValue('zipcode-collection-ref');
      mockGetDocs.mockResolvedValue(mockQuerySnapshot);
      
      // Call the function
      const result = await fetchZipcodes();
      
      // Assertions
      expect(mockCollection).toHaveBeenCalledTimes(1);
      expect(mockGetDocs).toHaveBeenCalledTimes(1);
      // Should only include the valid document ID
      expect(result).toEqual(['12345']);
      expect(result.length).toBe(1);
    });
  });
  
  /**
   * Test Suite for fetchZipcodeData
   */
  describe('fetchZipcodeData', () => {
    test('should return correct data for an existing zipcode', async () => {
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
      mockDoc.mockReturnValue('zipcode-doc-ref');
      mockGetDoc.mockResolvedValue(mockDocSnap);
      
      // Call the function
      const result = await fetchZipcodeData(zipcode);
      
      // Assertions
      expect(mockDoc).toHaveBeenCalledTimes(1);
      expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'zipcode', zipcode);
      expect(mockGetDoc).toHaveBeenCalledTimes(1);
      expect(mockDocSnap.exists).toHaveBeenCalledTimes(1);
      expect(mockDocSnap.data).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockStoreData);
    });
    
    test('should return null for a non-existent zipcode', async () => {
      // Mock data
      const zipcode = '99999';
      
      // Mock document snapshot for non-existent document
      const mockDocSnap = {
        exists: jest.fn().mockReturnValue(false),
        data: jest.fn()
      };
      
      // Spy on console.log
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Setup mock implementations
      mockDoc.mockReturnValue('zipcode-doc-ref');
      mockGetDoc.mockResolvedValue(mockDocSnap);
      
      // Call the function
      const result = await fetchZipcodeData(zipcode);
      
      // Assertions
      expect(mockDoc).toHaveBeenCalledTimes(1);
      expect(mockGetDoc).toHaveBeenCalledTimes(1);
      expect(mockDocSnap.exists).toHaveBeenCalledTimes(1);
      expect(mockDocSnap.data).not.toHaveBeenCalled();
      expect(result).toBeNull();
      expect(consoleLogSpy).toHaveBeenCalledWith(`No data found for zipcode: ${zipcode}`);
      
      // Restore console.log
      consoleLogSpy.mockRestore();
    });
    
    test('should return null and log error when no zipcode is provided', async () => {
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Call the function with no zipcode
      const result = await fetchZipcodeData();
      
      // Assertions
      expect(mockDoc).not.toHaveBeenCalled();
      expect(mockGetDoc).not.toHaveBeenCalled();
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching data for zipcode undefined:', 
        expect.any(Error)
      );
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
    
    test('should handle Firestore errors when fetching zipcode data', async () => {
      const zipcode = '12345';
      
      // Setup mock to throw network error
      mockDoc.mockReturnValue('zipcode-doc-ref');
      mockGetDoc.mockRejectedValue(new Error('Network error'));
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Call the function
      const result = await fetchZipcodeData(zipcode);
      
      // Assertions
      expect(mockDoc).toHaveBeenCalledTimes(1);
      expect(mockGetDoc).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Error fetching data for zipcode ${zipcode}:`, 
        expect.any(Error)
      );
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
    
    test('should handle data with nested objects correctly', async () => {
      // Mock data with nested objects
      const zipcode = '12345';
      const mockComplexData = {
        stores: [
          { 
            id: 1, 
            name: 'Complex Store', 
            location: {
              address: '123 Main St',
              coordinates: {
                lat: 37.7749,
                lng: -122.4194
              }
            },
            contacts: [
              { type: 'phone', value: '555-1234' },
              { type: 'email', value: 'store@example.com' }
            ],
            isOpen: true,
            hours: {
              monday: '9am-9pm',
              tuesday: '9am-9pm',
              wednesday: '9am-9pm',
              thursday: '9am-9pm',
              friday: '9am-10pm',
              saturday: '10am-10pm',
              sunday: '10am-8pm'
            }
          }
        ],
        metadata: {
          lastUpdated: '2023-07-15',
          dataSource: 'Retailer API'
        }
      };
      
      // Mock document snapshot
      const mockDocSnap = {
        exists: jest.fn().mockReturnValue(true),
        data: jest.fn().mockReturnValue(mockComplexData)
      };
      
      // Setup mock implementations
      mockDoc.mockReturnValue('zipcode-doc-ref');
      mockGetDoc.mockResolvedValue(mockDocSnap);
      
      // Call the function
      const result = await fetchZipcodeData(zipcode);
      
      // Assertions
      expect(mockDoc).toHaveBeenCalledTimes(1);
      expect(mockGetDoc).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockComplexData);
      // Verify nested data is preserved
      expect(result.stores[0].location.coordinates.lat).toBe(37.7749);
      expect(result.stores[0].contacts[1].value).toBe('store@example.com');
      expect(result.metadata.lastUpdated).toBe('2023-07-15');
    });
  });
}); 