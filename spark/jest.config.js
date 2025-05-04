module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // <-- Add this line
    "\\.(css|scss|sass)$": "identity-obj-proxy"
  },
  moduleDirectories: ['node_modules', 'src'], // <-- Optional: makes src/ imports easier
};
