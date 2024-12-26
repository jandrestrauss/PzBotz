const { ErrorHandler, AppError } = require('../../src/middleware/errorHandler');

describe('ErrorHandler', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            path: '/test',
            method: 'GET'
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            headersSent: false
        };
        mockNext = jest.fn();
    });

    test('handles ValidationError correctly', async () => {
        const error = new AppError('Invalid input', 400);
        error.type = 'ValidationError';

        await ErrorHandler.handleError(error, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.objectContaining({
                    message: 'Invalid input'
                })
            })
        );
    });

    test('handles internal server error in production', async () => {
        process.env.NODE_ENV = 'production';
        const error = new Error('Database connection failed');

        await ErrorHandler.handleError(error, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.objectContaining({
                    message: 'An unexpected error occurred'
                })
            })
        );
    });
});
