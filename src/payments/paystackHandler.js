const axios = require('axios');
const logger = require('../utils/logger');

class PaystackHandler {
    constructor(config) {
        this.config = {
            secretKey: process.env.PAYSTACK_SECRET_KEY,
            publicKey: process.env.PAYSTACK_PUBLIC_KEY,
            callbackUrl: process.env.PAYSTACK_CALLBACK_URL,
            ...config
        };
        
        this.api = axios.create({
            baseURL: 'https://api.paystack.co',
            headers: {
                'Authorization': `Bearer ${this.config.secretKey}`,
                'Content-Type': 'application/json'
            }
        });
    }

    async initializePayment(userId, packageInfo, email) {
        try {
            const response = await this.api.post('/transaction/initialize', {
                email: email,
                amount: packageInfo.price * 100, // Convert to cents
                currency: 'ZAR',
                callback_url: this.config.callbackUrl,
                metadata: {
                    userId: userId,
                    packageName: packageInfo.name,
                    points: packageInfo.points,
                    custom_fields: [
                        {
                            display_name: "Points Package",
                            variable_name: "points_package",
                            value: packageInfo.name
                        }
                    ]
                }
            });

            if (response.data.status) {
                return {
                    success: true,
                    reference: response.data.data.reference,
                    accessUrl: response.data.data.authorization_url
                };
            }

            throw new Error('Payment initialization failed');

        } catch (error) {
            logger.error('Paystack payment initiation error:', error);
            throw error;
        }
    }

    async verifyPayment(reference) {
        try {
            const response = await this.api.get(`/transaction/verify/${reference}`);

            if (response.data.status && response.data.data.status === 'success') {
                const transactionData = response.data.data;
                return {
                    success: true,
                    amount: transactionData.amount / 100,
                    currency: transactionData.currency,
                    reference: transactionData.reference,
                    metadata: transactionData.metadata,
                    email: transactionData.customer.email
                };
            }

            return {
                success: false,
                message: 'Payment verification failed'
            };

        } catch (error) {
            logger.error('Paystack payment verification error:', error);
            throw error;
        }
    }

    async listBanks() {
        try {
            const response = await this.api.get('/bank?currency=ZAR');
            return response.data.data;
        } catch (error) {
            logger.error('Error fetching bank list:', error);
            throw error;
        }
    }

    async createRefund(transactionReference, reason) {
        try {
            const response = await this.api.post('/refund', {
                transaction: transactionReference,
                reason: reason
            });

            return {
                success: response.data.status,
                refundId: response.data.data?.id,
                message: response.data.message
            };
        } catch (error) {
            logger.error('Error creating refund:', error);
            throw error;
        }
    }
}

module.exports = PaystackHandler;
