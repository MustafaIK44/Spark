import { NextRequest, NextResponse } from 'next/server';
import { POST as loginHandler } from '../app/api/login/route';
import { POST as registerHandler } from '../app/api/register/route';
import { auth } from '../libs/firebase/config';

// Mock Firebase authentication
jest.mock('firebase/auth', () => {
  return {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    getAuth: jest.fn(),
    GoogleAuthProvider: jest.fn().mockImplementation(() => {
      return {};
    })
  };
});

// Mock Next.js Response
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: jest.fn((data, options) => {
        return { data, options };
      })
    }
  };
});

describe('API Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login API Integration', () => {
    it('should successfully log in a user with valid credentials', async () => {
      // Mock successful Firebase auth response
      const mockUser = { uid: 'test-user-123' };
      const mockUserCred = { user: mockUser };
      require('firebase/auth').signInWithEmailAndPassword.mockResolvedValue(mockUserCred);

      // Create mock request
      const mockReq = {
        json: jest.fn().mockResolvedValue({
          email: 'test@example.com',
          password: 'password123'
        })
      };

      // Call the API handler
      const response = await loginHandler(mockReq);

      // Verify Firebase auth was called with correct params
      expect(require('firebase/auth').signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth, 
        'test@example.com', 
        'password123'
      );

      // Verify response was formed correctly
      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: 'Login successful', uid: 'test-user-123' }
      );
    });

    it('should return an error for missing credentials', async () => {
      // Create mock request with missing password
      const mockReq = {
        json: jest.fn().mockResolvedValue({
          email: 'test@example.com',
          // password missing
        })
      };

      // Call the API handler
      await loginHandler(mockReq);

      // Verify error response
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Missing credentials' },
        { status: 400 }
      );
    });

    it('should handle Firebase authentication errors', async () => {
      // Mock Firebase auth error
      const authError = new Error('Invalid password');
      authError.code = 'auth/wrong-password';
      require('firebase/auth').signInWithEmailAndPassword.mockRejectedValue(authError);

      // Create mock request
      const mockReq = {
        json: jest.fn().mockResolvedValue({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
      };

      // Call the API handler
      await loginHandler(mockReq);

      // Verify error response
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: authError.message },
        { status: 401 }
      );
    });
  });

  describe('Registration API Integration', () => {
    it('should successfully register a new user', async () => {
      // Mock successful Firebase auth response
      const mockUser = { uid: 'new-user-456' };
      const mockUserCred = { user: mockUser };
      require('firebase/auth').createUserWithEmailAndPassword.mockResolvedValue(mockUserCred);

      // Create mock request
      const mockReq = {
        json: jest.fn().mockResolvedValue({
          email: 'newuser@example.com',
          password: 'newpassword123'
        })
      };

      // Call the API handler
      await registerHandler(mockReq);

      // Verify Firebase auth was called with correct params
      expect(require('firebase/auth').createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'newuser@example.com',
        'newpassword123'
      );

      // Verify response was formed correctly
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ uid: 'new-user-456' }),
        expect.any(Object)
      );
    });

    it('should handle validation errors during registration', async () => {
      // Create mock request with invalid email
      const mockReq = {
        json: jest.fn().mockResolvedValue({
          email: 'invalid-email',
          password: 'password123'
        })
      };

      // Call the API handler
      await registerHandler(mockReq);

      // Verify error response for validation failure
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ status: expect.any(Number) })
      );
    });

    it('should handle missing email and password fields', async () => {
      // Create mock request with empty credentials
      const mockReq = {
        json: jest.fn().mockResolvedValue({
          // No email or password provided
        })
      };

      // Call the API handler
      await registerHandler(mockReq);

      // Verify error response for missing fields
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("Missing") }),
        expect.objectContaining({ status: 400 })
      );
    });

    it('should handle Firebase registration errors', async () => {
      // Mock Firebase auth error
      const authError = new Error('Email already in use');
      authError.code = 'auth/email-already-in-use';
      require('firebase/auth').createUserWithEmailAndPassword.mockRejectedValue(authError);

      // Create mock request
      const mockReq = {
        json: jest.fn().mockResolvedValue({
          email: 'existing@example.com',
          password: 'password123'
        })
      };

      // Call the API handler
      await registerHandler(mockReq);

      // Verify error response
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: authError.message }),
        expect.objectContaining({ status: 400 })
      );
    });
  });
}); 