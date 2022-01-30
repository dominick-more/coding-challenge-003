// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// adds the 'fetchMock' global variable
// see: https://www.npmjs.com/package/jest-fetch-mock
import fetchMock from 'jest-fetch-mock';

//  rewires 'fetch' global to call 'fetchMock' instead of the real implementation
fetchMock.enableMocks();