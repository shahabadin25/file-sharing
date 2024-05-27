const nodeMailer=require('nodemailer');
const emailValidator=require('email-validator');




async function sendMail({ from, to, subject, text, html }) {
    // Validate the 'to' email address
    if (!emailValidator.validate(to)) {
        console.log(`Invalid recipient email: ${to}`);
        throw new Error('Invalid recipient email');
    }

    if (!emailValidator.validate(from)) {
        console.log(`Invalid sender email: ${from}`);
        throw new Error('Invalid sender email');
    }
        
        
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
            throw new Error('Error occurred while sending email');
        }
    }
    
    module.exports = sendMail;