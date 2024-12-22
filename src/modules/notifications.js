const nodemailer = require('nodemailer');
const twilio = require('twilio');
const admin = require('firebase-admin');
const logger = require('../utils/logger');

class NotificationSystem {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        this.twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FCM_PROJECT_ID,
                clientEmail: process.env.FCM_CLIENT_EMAIL,
                privateKey: process.env.FCM_PRIVATE_KEY.replace(/\\n/g, '\n')
            })
        });
    }

    async sendEmail(to, subject, text) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        try {
            await this.transporter.sendMail(mailOptions);
            logger.info(`Email sent to ${to}`);
        } catch (error) {
            logger.error('Error sending email:', error);
        }
    }

    async sendSMS(to, message) {
        try {
            await this.twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to
            });
            logger.info(`SMS sent to ${to}`);
        } catch (error) {
            logger.error('Error sending SMS:', error);
        }
    }

    async sendPushNotification(token, message) {
        const payload = {
            notification: {
                title: 'Alert Notification',
                body: message
            }
        };

        try {
            await admin.messaging().sendToDevice(token, payload);
            logger.info(`Push notification sent to ${token}`);
        } catch (error) {
            logger.error('Error sending push notification:', error);
        }
    }

    async sendAlert(message) {
        // Logic to send alert to users
        const users = await this.getAlertSubscribers();
        for (const user of users) {
            await this.sendEmail(user.email, 'Alert Notification', message);
            if (user.phone) {
                await this.sendSMS(user.phone, message);
            }
            if (user.pushToken) {
                await this.sendPushNotification(user.pushToken, message);
            }
        }
        logger.info(`Alert sent: ${message}`);
    }

    async getAlertSubscribers() {
        // Logic to get users subscribed to alerts
        return [
            { email: 'user1@example.com', phone: '+1234567890', pushToken: 'fcm_token_1' },
            { email: 'user2@example.com', phone: '+0987654321', pushToken: 'fcm_token_2' }
        ];
    }
}

module.exports = new NotificationSystem();
