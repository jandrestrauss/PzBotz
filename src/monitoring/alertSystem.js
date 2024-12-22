const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

function sendAlert(subject, message) {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'admin@example.com',
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Error sending alert email:', error);
        } else {
            console.log('Alert email sent:', info.response);
        }
    });
}

module.exports = { sendAlert };
