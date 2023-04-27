import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import matchers from "@testing-library/jest-dom/matchers";

// Add react-testing-library expect methods to Vitest's expect
expect.extend(matchers);

afterAll(() => {
  cleanup();
});
