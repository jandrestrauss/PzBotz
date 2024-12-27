import { jest } from '@jest/globals';
import * as advancedMetrics from '../../src/monitoring/advancedMetrics';
import * as logger from '../../src/utils/logger';
import { CpuInfo } from 'os';

jest.mock('os');
jest.mock('../../src/monitoring/advancedMetrics', () => ({
    collect: jest.fn(),
    // ...other methods...
}));

jest.mock('../../src/utils/logger', () => ({
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn()
}));

describe('Advanced Metrics', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should collect CPU metrics', () => {
        const mockCpuInfo: CpuInfo[] = [
            // ...mock data...
        ];
        jest.spyOn(os, 'cpus').mockReturnValue(mockCpuInfo);
        jest.spyOn(os, 'totalmem').mockReturnValue(16000000000);
        jest.spyOn(os, 'freemem').mockReturnValue(8000000000);

        advancedMetrics.collect();

        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('CPU metrics collected'));
    });

    test('should handle errors during metrics collection', () => {
        jest.spyOn(os, 'cpus').mockImplementation(() => {
            throw new Error('Test error');
        });

        advancedMetrics.collect();

        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error collecting metrics'));
    });
});
