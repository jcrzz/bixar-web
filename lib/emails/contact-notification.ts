import { emailFooterNote, emailLayout } from './layout'

/**
 * Escape user input before it lands in the HTML body.
 *
 * The message is arbitrary text from a public, unauthenticated form. Without
 * this, anyone submitting `<img onerror=…>` or a `<style>` block gets that
 * markup executed in the recipient's mail client.
 */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Preserve the line breaks the visitor typed, but as escaped text. */
function escapeWithBreaks(value: string) {
  return escapeHtml(value).replace(/\r\n|\r|\n/g, '<br />')
}

export function contactNotificationEmail({
  name,
  email,
  message,
}: {
  name: string
  email: string
  message: string
}) {
  const html = emailLayout({
    title: `Nuevo mensaje de ${name}`,
    previewText: message.slice(0, 120),
    bodyHtml: `
      <p style="margin:0 0 20px;">Recibiste un mensaje desde el formulario de ${'bixar.com.ar'}.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.6;">
        <tr>
          <td style="padding:8px 0;width:90px;color:#6b7280;vertical-align:top;">Nombre</td>
          <td style="padding:8px 0;font-weight:bold;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;vertical-align:top;">Email</td>
          <td style="padding:8px 0;"><a href="mailto:${encodeURIComponent(email)}" style="color:#186DD4;">${escapeHtml(email)}</a></td>
        </tr>
      </table>
      <div style="margin:20px 0;padding:18px;background-color:#f9f9f9;border-left:3px solid #09C895;font-size:15px;line-height:1.65;">${escapeWithBreaks(message)}</div>
      ${emailFooterNote('Respondé a este correo para contestarle directamente.')}
    `,
  })

  const text = [
    'Nuevo mensaje desde el formulario de bixar.com.ar',
    '',
    `Nombre: ${name}`,
    `Email: ${email}`,
    '',
    'Mensaje:',
    message,
  ].join('\n')

  return { subject: `Nuevo mensaje de ${name}`, html, text }
}