import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_KEY);

export async function sendVerificationEmail(email: string, code: string) {
  await resend.emails.send({
    from: 'GenZeChef <noreply@zestcooko.work.gd>',
    to: email,
    subject: "Your ChefConnect verification code",
    html: `
      <div style="font-family: sans-serif; padding: 24px;">
        <h2 style="color: #E8A33D;">Welcome to ChefConnect</h2>
        <p>Your verification code is:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px;">${code}</p>
        <p style="color: #888;">This code expires in 10 minutes.</p>
      </div>
    `,
  });
}