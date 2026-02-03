/**
 * setupTests.js
 * 
 * Test environment setup for Vitest.
 * Runs before all test files.
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
