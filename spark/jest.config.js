module.exports = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    },
    moduleNameMapper: {
      "\\.(css|scss|sass)$": "identity-obj-proxy"
    }
  }; 