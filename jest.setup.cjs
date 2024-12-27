jest.setTimeout(10000);

// Reset modules before each test
beforeEach(() => {
  jest.resetModules();
});

// Clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// ...existing code...
