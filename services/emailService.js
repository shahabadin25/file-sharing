const nodeMailer=require('nodemailer');
const emailValidator=require('email-validator');




async function sendMail({ from, to, subject, text, html }) {
    // Validate the 'to' email address
    if (emailValidator.validate(to,from)) {
        // Valid email address, proceed with sending the email
        try {
            let transporter = nodeMailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: false,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                }
            });

            let info = await transporter.sendMail({
                from: `inShare <${from}>`,
                to: to,
                subject: subject,
                text: text,
                html: html
            });

            console.log('Message sent: %s', info.messageId);
            return info; // Return info object if needed
        } catch (error) {
            console.log('Error occurred while sending email:', error);
            //throw error; // Throw error for error handling in the caller
            const status=422;
            const message=error.message;//captures the error message
                error={
                status,
                message
            };
            next(error);//calls the error middleware
        }
    } else {
        // Invalid email address, throw error
        const error = new Error('Invalid Email'); // Create a new error object
        error.status = 422;
        next(error); // Pass the error to the error handling middleware
}
}

module.exports = sendMail;