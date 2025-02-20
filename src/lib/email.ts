import nodemailer from "nodemailer"

if (
  !process.env.EMAIL_SERVER_HOST ||
  !process.env.EMAIL_SERVER_PORT ||
  !process.env.EMAIL_SERVER_USER ||
  !process.env.EMAIL_SERVER_PASSWORD ||
  !process.env.EMAIL_FROM ||
  !process.env.NEXTAUTH_URL
) {
  console.error("Missing email configuration environment variables")
  throw new Error("Email configuration is incomplete")
}

// Ensure NEXTAUTH_URL is using HTTPS if it's not already
const nextAuthUrl = process.env.NEXTAUTH_URL.startsWith("https://")
  ? process.env.NEXTAUTH_URL
  : `https://${process.env.NEXTAUTH_URL}`

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

const emailTemplate = (content: string) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BookBorrow Email</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .container {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #2c3e50;
        font-size: 24px;
        margin-bottom: 20px;
      }
      p {
        margin-bottom: 15px;
      }
      .button {
        display: inline-block;
        background-color: #3498db;
        color: #ffffff;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: bold;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #7f8c8d;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      ${content}
    </div>
    <div class="footer">
      <p>© 2023 BookBorrow. All rights reserved.</p>
    </div>
  </body>
  </html>
`

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${nextAuthUrl}/auth/verify-email?token=${token}`

  const content = `
    <h1>Welcome to BookBorrow!</h1>
    <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
    <p>Your verification code is: <strong>${token}</strong></p>
    <p>Alternatively, you can click the button below to verify your email:</p>
    <p><a href="${verificationUrl}" class="button">Verify Email</a></p>
    <p>If you didn't sign up for BookBorrow, please ignore this email.</p>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your email for BookBorrow",
    html: emailTemplate(content),
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${nextAuthUrl}/password-reset?token=${token}`

  const content = `
    <h1>Reset Your BookBorrow Password</h1>
    <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <p><a href="${resetUrl}" class="button">Reset Password</a></p>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>If you're having trouble with the button, copy and paste this URL into your browser:</p>
    <p>${resetUrl}</p>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your BookBorrow password",
    html: emailTemplate(content),
  })
}
