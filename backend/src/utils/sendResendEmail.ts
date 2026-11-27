import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResendEmail({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) {
  const { data, error } = await resend.emails.send({
    from:`STOCK-IMAGE <onboarding@resend.dev>`,
    to: [to],
    subject,
    html: message,
  });
  if (error) {
    throw new Error(`Resend Error: ${error.message}`);
  }
  return data;
}
