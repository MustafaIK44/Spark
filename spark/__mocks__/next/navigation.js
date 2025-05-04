// __mocks__/next/navigation.js

// mocks userRouter() hook with a dummy function so Header test doesn't crash!
export const useRouter = () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  });
  