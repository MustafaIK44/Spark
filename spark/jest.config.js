module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",                     
    "\\.(css|scss|sass)$": "identity-obj-proxy",        
    "^next/navigation$": "<rootDir>/__mocks__/next/navigation.js" // the mock for Header
  },
  moduleDirectories: ['node_modules', 'src'],
};
