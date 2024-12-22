const axios = require('axios');
const crypto = require('crypto');
const logger = require('../utils/logger');

class PayGateHandler {
    constructor(config) {
        this.config = {
            paymentEndpoint: process.env.PAYGATE_ENDPOINT,
            merchantId: process.env.PAYGATE_MERCHANT_ID,
            merchantKey: process.env.PAYGATE_MERCHANT_KEY,
            returnUrl: process.env.PAYGATE_RETURN_URL,
            notifyUrl: process.env.PAYGATE_NOTIFY_URL,
            ...config
        };
    }

    generatePaymentId() {
        return `PZ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    generateChecksum(data) {
        const values = Object.values(data).join('');
        return crypto
            .createHash('md5')
            .update(values + this.config.merchantKey)
            .digest('hex');
    }

    async initiatePayment(userId, package, amount) {
        try {
            const paymentData = {
                PAYGATE_ID: this.config.merchantId,
                REFERENCE: this.generatePaymentId(),
                AMOUNT: amount * 100, // Convert to cents
                CURRENCY: 'ZAR',
                RETURN_URL: this.config.returnUrl,
                NOTIFY_URL: this.config.notifyUrl,
                USER3: userId,
                USER4: package
            };

            paymentData.CHECKSUM = this.generateChecksum(paymentData);

            const response = await axios.post(
                this.config.paymentEndpoint,
                paymentData
            );

            if (response.data.TRANSACTION_STATUS === "1") {
                return {
                    success: true,
                    paymentUrl: response.data.PAY_REQUEST_ID,
                    referenceId: paymentData.REFERENCE
                };
            }

            throw new Error(response.data.ERROR_MESSAGE || 'Payment initialization failed');

        } catch (error) {
            logger.error('PayGate payment initiation error:', error);
            throw error;
        }
    }

    async verifyPayment(paymentId) {
        try {
            const queryData = {
                PAYGATE_ID: this.config.merchantId,
                PAY_REQUEST_ID: paymentId,
                REFERENCE: paymentId
            };

            queryData.CHECKSUM = this.generateChecksum(queryData);

            const response = await axios.post(
                `${this.config.paymentEndpoint}/query`,
                queryData
            );

            return {
                success: response.data.TRANSACTION_STATUS === "1",
                status: response.data.TRANSACTION_STATUS,
                amount: response.data.AMOUNT / 100,
                currency: response.data.CURRENCY,
                reference: response.data.REFERENCE
            };

        } catch (error) {
            logger.error('PayGate payment verification error:', error);
            throw error;
        }
    }
}

module.exports = PayGateHandler;
