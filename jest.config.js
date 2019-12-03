module.exports = {
  roots: [
    "<rootDir>/src"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testEnvironment: "node",
  preset: "ts-jest",
  verbose: true,
  reporters: [
    `default`,
    [
      `jest-junit`,
      {
        "outputName": "test-results.xml"
      }
    ]
  ]
}