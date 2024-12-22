const { errorHandler } = require('../../errorHandling/errorHandler');

describe('Error Handler', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    test('Should handle errors correctly', () => {
        const error = new Error('Test error');
        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        expect(console.error).toHaveBeenCalledWith('Error:', error.message);
        expect(console.error).toHaveBeenCalledWith('Stack:', error.stack);
    });
});
