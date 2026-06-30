import nodemailer from 'nodemailer'

/**
 * Sends a magic sign-in link by direct mail (SMTP).
 * If SMTP isn't configured, logs the link to the server console and reports
 * sent:false so the dev UI can surface the link for local testing.
 */
export async function sendMagicLink(to: string, link: string): Promise<{ sent: boolean }> {
  const host = process.env.SMTP_HOST
  if (!host) {
    console.log(`\n[auth] SMTP not configured — magic link for ${to}:\n${link}\n`)
    return { sent: false }
  }

  const transport = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  })

  await transport.sendMail({
    from: process.env.SMTP_FROM || 'BeanAI <no-reply@beanai.app>',
    to,
    subject: 'Your BeanAI sign-in link',
    text: `Sign in to BeanAI:\n\n${link}\n\nThis link expires in 15 minutes. If you didn't request it, ignore this email.`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:440px;margin:0 auto;padding:32px 24px;color:#202124">
        <p style="font-size:18px;font-weight:700;margin:0 0 4px">Bean<span style="color:#4182EB">AI</span></p>
        <p style="font-size:15px;color:#5F6368;margin:0 0 24px">Click below to sign in. This link expires in 15 minutes.</p>
        <a href="${link}" style="display:inline-block;background:#4182EB;color:#fff;text-decoration:none;font-weight:600;font-size:14px;border-radius:90px;padding:12px 26px">Sign in to BeanAI</a>
        <p style="font-size:12px;color:#9AA0A6;margin:24px 0 0">If you didn't request this, you can safely ignore it.</p>
      </div>`,
  })
  return { sent: true }
}
