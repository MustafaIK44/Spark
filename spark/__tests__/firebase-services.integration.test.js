import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../libs/firebase/config';
import { fetchZipcodes, fetchZipcodeData } from '../libs/zipcodeService';

// Mock Firebase modules
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn().mockImplementation(() => {
    return {};
  })
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn()
}));

// Mock the Firebase config to return our mocked instances
jest.mock('../libs/firebase/config', () => ({
  auth: {},
  db: {}
}));

describe('Firebase Services Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Auth and Firestore Integration', () => {
    it('should authenticate a user and then access user-specific Firestore data', async () => {
      // Mock successful authentication
      const mockUser = { uid: 'test-uid-123' };
      const mockUserCred = { user: mockUser };
      signInWithEmailAndPassword.mockResolvedValue(mockUserCred);

      // Mock Firestore document responses
      const mockUserDoc = {
        exists: true,
        data: jest.fn().mockReturnValue({
          name: 'Test User',
          email: 'test@example.com',
          preferences: { theme: 'dark' }
        })
      };

      doc.mockReturnValue('user-doc-ref');
      getDoc.mockResolvedValue(mockUserDoc);

      // Step 1: Authenticate the user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        'test@example.com',
        'password123'
      );

      // Step 2: Access user-specific data from Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();

      // Verify auth was called correctly
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth, 
        'test@example.com', 
        'password123'
      );

      // Verify Firestore was accessed with the correct user ID
      expect(doc).toHaveBeenCalledWith(db, 'users', 'test-uid-123');
      expect(getDoc).toHaveBeenCalledWith('user-doc-ref');

      // Verify the data was retrieved
      expect(userDocSnapshot.data).toHaveBeenCalled();
      expect(userData).toEqual({
        name: 'Test User',
        email: 'test@example.com',
        preferences: { theme: 'dark' }
      });
    });

    it('should register a new user and then create their Firestore profile', async () => {
      // Mock successful user creation
      const mockUser = { uid: 'new-user-456' };
      const mockUserCred = { user: mockUser };
      createUserWithEmailAndPassword.mockResolvedValue(mockUserCred);

      // Mock Firestore setDoc
      setDoc.mockResolvedValue();

      // Step 1: Register the user
      const newUserData = {
        email: 'newuser@example.com',
        password: 'newpassword123',
        name: 'New User'
      };

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUserData.email,
        newUserData.password
      );

      // Step 2: Create user profile in Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        name: newUserData.name,
        email: newUserData.email,
        createdAt: new Date().toISOString()
      });

      // Verify auth was called correctly
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth, 
        'newuser@example.com', 
        'newpassword123'
      );

      // Verify Firestore was written to with the correct user ID
      expect(doc).toHaveBeenCalledWith(db, 'users', 'new-user-456');
      expect(setDoc).toHaveBeenCalledWith(
        'user-doc-ref',
        expect.objectContaining({
          name: 'New User',
          email: 'newuser@example.com',
          createdAt: expect.any(String)
        })
      );
    });
  });

  describe('Multiple Firebase Services Interaction', () => {
    it('should authenticate, fetch store locations, and save user preferences', async () => {
      // Mock successful authentication
      const mockUser = { uid: 'test-uid-789' };
      const mockUserCred = { user: mockUser };
      signInWithEmailAndPassword.mockResolvedValue(mockUserCred);

      // Mock Firestore zipcode data
      const mockZipcodeDoc = {
        exists: jest.fn().mockReturnValue(true),
        data: jest.fn().mockReturnValue({
          stores: [
            { id: 'store1', name: 'Store One', address: '123 Main St' },
            { id: 'store2', name: 'Store Two', address: '456 Oak Ave' }
          ]
        })
      };

      // Mock document references for different collections
      const mockDocRefs = {
        zipcode: 'zipcode-doc-ref',
        userPreferences: 'user-prefs-doc-ref'
      };

      // Configure different doc references based on arguments
      doc.mockImplementation((db, collection, id) => {
        if (collection === 'zipcode') {
          return mockDocRefs.zipcode;
        } else if (collection === 'users') {
          return mockDocRefs.userPreferences;
        }
        return 'unknown-doc-ref';
      });

      // Mock getDoc based on doc reference
      getDoc.mockImplementation((docRef) => {
        if (docRef === mockDocRefs.zipcode) {
          return Promise.resolve(mockZipcodeDoc);
        }
        return Promise.resolve({ exists: () => false });
      });

      // Mock setDoc for user preferences
      setDoc.mockResolvedValue();

      // Step 1: Authenticate the user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        'test@example.com',
        'password123'
      );

      // Step 2: Fetch zipcode data
      const zipcode = '12345';
      const zipcodeDocRef = doc(db, 'zipcode', zipcode);
      const zipcodeSnapshot = await getDoc(zipcodeDocRef);
      const zipcodeData = zipcodeSnapshot.exists() ? zipcodeSnapshot.data() : null;

      // Step 3: Save user's preferred store to their profile
      const userPrefsDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userPrefsDocRef, {
        preferredStoreId: zipcodeData.stores[0].id,
        lastUpdated: new Date().toISOString()
      }, { merge: true });

      // Verify auth was called correctly
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password123'
      );

      // Verify zipcode data was fetched
      expect(doc).toHaveBeenCalledWith(db, 'zipcode', '12345');
      expect(getDoc).toHaveBeenCalledWith(mockDocRefs.zipcode);

      // Verify user preferences were saved
      expect(doc).toHaveBeenCalledWith(db, 'users', 'test-uid-789');
      expect(setDoc).toHaveBeenCalledWith(
        mockDocRefs.userPreferences,
        expect.objectContaining({
          preferredStoreId: 'store1',
          lastUpdated: expect.any(String)
        }),
        { merge: true }
      );
    });
  });
}); 