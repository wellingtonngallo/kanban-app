export default {
  preset: "ts-jest",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.tsx", "!src/**/*.spec.tsx"],
  coverageDirectory: "coverage",
  testEnvironment: "jest-environment-jsdom",
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^react-dnd$": "<rootDir>/node_modules/react-dnd/dist/cjs",
    "^react-dnd-html5-backend$":
      "<rootDir>/node_modules/react-dnd-html5-backend/dist/cjs",
    "^dnd-core$": "<rootDir>/node_modules/dnd-core/dist/cjs",
  },
};
