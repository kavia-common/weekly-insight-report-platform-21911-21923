/* jest-dom adds custom jest matchers for asserting on DOM nodes.
   allows you to do things like:
   expect(element).toHaveTextContent(/react/i)
   learn more: https://github.com/testing-library/jest-dom */
import '@testing-library/jest-dom';

beforeAll(() => {
  // Ensure API base URL is defined for tests that read it
  process.env.REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9999/api';
  // Polyfill fetch if not present (jsdom environment)
  if (!global.fetch) {
    global.fetch = jest.fn();
  }
});

afterEach(() => {
  // reset fetch mocks between tests
  if (global.fetch && typeof global.fetch.mockReset === 'function') {
    global.fetch.mockReset();
  }
  // Clean localStorage between tests
  try {
    localStorage.clear();
  } catch {}
});
