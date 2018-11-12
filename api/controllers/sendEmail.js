const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'attasiemj@gmail.com',
        pass: 'Jaymes92',
    },
});
module.exports = function sendEmail(to, subject, message) {
    const mailOptions = {
        from: 'Attasiemj@gmail.com',
        to,
        subject,
        html: message,
    };
    transport.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
    });
};