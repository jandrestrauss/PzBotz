// Increase timeout for all tests
jest.setTimeout(10000);

// Single beforeEach for all cleanup
beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
});

// Add any other global test setup here