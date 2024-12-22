const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ALERT_EMAIL,
        pass: process.env.ALERT_PASSWORD
    }
});

const sendAlert = (message) => {
    const mailOptions = {
        from: process.env.ALERT_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: 'Critical Alert',
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending alert email:', error);
        } else {
            console.log('Alert email sent:', info.response);
        }
    });
};

module.exports = { sendAlert };
