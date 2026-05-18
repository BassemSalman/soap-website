import { getResend } from "@/lib/resend/client";

type SendVerificationRequestParams = {
  identifier: string;
  url: string;
};

export async function sendVerificationRequest({
  identifier,
  url,
}: SendVerificationRequestParams): Promise<void> {
  await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: identifier,
    subject: "Sign in to your account",
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
        <h2>Sign in</h2>
        <p>Click the button below to sign in to your account. This link expires in 24 hours.</p>
        <a
          href="${url}"
          style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 6px;"
        >
          Sign in
        </a>
        <p style="margin-top: 16px; color: #666; font-size: 14px;">
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
