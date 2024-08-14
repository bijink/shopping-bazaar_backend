import nodemailer from 'nodemailer';

type MailSenderParamsTypes = {
  fromEmail: string;
  toEmail: string;
  title: string;
  textBody?: string;
  htmlBody?: string;
};

export const mailSender = async ({
  fromEmail,
  toEmail,
  title,
  textBody = '',
  htmlBody = '',
}: MailSenderParamsTypes) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    // #send mail with defined transport object
    const info = await transporter.sendMail({
      from: fromEmail, // sender address
      to: toEmail, // list of receivers
      subject: title, // Subject line
      text: textBody, // plain text body (optional)
      html: htmlBody, // html body (optional)
    });
    return info;
  } catch (error) {
    return error;
  }
};
