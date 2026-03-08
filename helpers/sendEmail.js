import nodemailer from "nodemailer";

const { SMTP_USER, SMTP_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: SMTP_USER };
  await transport.sendMail(email);
  return true;
};

export default sendEmail;
