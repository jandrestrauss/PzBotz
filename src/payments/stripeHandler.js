const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('../utils/logger');

class StripeHandler {
    constructor(config) {
        this.config = {
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
            successUrl: process.env.PAYMENT_SUCCESS_URL,
            cancelUrl: process.env.PAYMENT_CANCEL_URL,
            ...config
        };
    }

    async createCheckoutSession(userId, package, amount, description) {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${package} Points Package`,
                            description: description
                        },
                        unit_amount: amount * 100, // Convert to cents
                    },
                    quantity: 1,
                }],
                metadata: {
                    userId: userId,
                    package: package
                },
                mode: 'payment',
                success_url: `${this.config.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: this.config.cancelUrl,
            });

            return {
                success: true,
                sessionId: session.id,
                url: session.url
            };
        } catch (error) {
            logger.error('Error creating Stripe checkout session:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async handleWebhook(event) {
        const sig = event.headers['stripe-signature'];

        let stripeEvent;
        try {
            stripeEvent = stripe.webhooks.constructEvent(event.body, sig, this.config.webhookSecret);
        } catch (err) {
            logger.error('Webhook signature verification failed:', err);
            throw new Error('Webhook signature verification failed');
        }

        // Handle the event
        switch (stripeEvent.type) {
            case 'checkout.session.completed':
                const session = stripeEvent.data.object;
                // Fulfill the purchase...
                logger.info(`Payment for session ${session.id} was successful.`);
                break;
            default:
                logger.warn(`Unhandled event type ${stripeEvent.type}`);
        }

        return { received: true };
    }
}

module.exports = StripeHandler;
