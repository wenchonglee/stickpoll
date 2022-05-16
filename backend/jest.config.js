const { defaults: tsjPreset } = require("ts-jest/presets");

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  // preset: "ts-jest",
  testEnvironment: "node",
  preset: "@shelf/jest-dynamodb",
  transform: {
    ...tsjPreset.transform,
  },
};
