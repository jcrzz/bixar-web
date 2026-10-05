import { emailButton, emailFooterNote, emailLayout, MUTED } from './layout'
import { site } from '@/lib/site'

/**
 * The "olvidé mi contraseña" message.
 *
 * The link is the whole point of the email, so it is also repeated as bare text
 * below the button: some clients and filters strip or hide the primary
 * `<a>`, and a reset the user cannot copy is a support ticket.
 */
export function resetPasswordEmail({
  adminName,
  resetUrl,
  expiresInMinutes,
}: {
  adminName: string
  resetUrl: string
  expiresInMinutes: number
}) {
  const html = emailLayout({
    title: 'Restablecer contraseña',
    previewText: `Tu contraseña de ${site.name} puede cambiarse en los próximos ${expiresInMinutes} minutos.`,
    bodyHtml: `
      <p style="margin:0 0 16px;">Hola ${adminName},</p>
      <p style="margin:0 0 16px;">Recibimos un pedido para restablecer la contraseña de tu panel de administración.</p>
      ${emailButton(resetUrl, 'Elegir nueva contraseña')}
      <p style="margin:0 0 16px;">Este enlace vence en <strong>${expiresInMinutes} minutos</strong> y puede usarse una sola vez.</p>
      <p style="margin:0 0 16px;color:${MUTED};font-size:13px;">Si el botón no funciona, copiá esta dirección en tu navegador:</p>
      <p style="margin:0 0 24px;font-size:13px;word-break:break-all;color:${MUTED};">${resetUrl}</p>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;" />
      ${emailFooterNote(
        'Si no pediste este cambio, no hagas nada: tu contraseña actual sigue siendo válida.'
      )}
    `,
  })

  const text = [
    `Hola ${adminName},`,
    '',
    'Recibimos un pedido para restablecer la contraseña de tu panel de administración.',
    '',
    `Elegí una nueva contraseña en este enlace (vence en ${expiresInMinutes} minutos, un solo uso):`,
    '',
    resetUrl,
    '',
    'Si no pediste este cambio, no hagas nada: tu contraseña actual sigue siendo válida.',
  ].join('\n')

  return { subject: 'Restablecer tu contraseña', html, text }
}