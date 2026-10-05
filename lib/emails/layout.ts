import { site } from '@/lib/site'

/**
 * HTML shell shared by every outgoing email.
 *
 * Everything is inline-styled because that is the only CSS email clients
 * reliably honour — class-based styling from globals.css does not travel, and a
 * template that renders fine in a browser can arrive unstyled in Gmail.
 *
 * Table-based layout for the same reason: flex and grid are unsupported in
 * several major clients.
 */

const BRAND_GREEN = '#09C895'
const BRAND_DARK = '#202020'
const TEXT = '#1a1a1a'
export const MUTED = '#6b7280'

export function emailLayout({
  title,
  previewText,
  bodyHtml,
}: {
  title: string
  /** Shown in the inbox list before the user opens the message. */
  previewText: string
  bodyHtml: string
}) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${previewText}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:4px;overflow:hidden;border:1px solid #e4e4e7;">
        <tr>
          <td style="background-color:${BRAND_DARK};padding:24px 32px;">
            <span style="font-family:Helvetica,Arial,sans-serif;font-size:18px;font-weight:bold;color:#ffffff;letter-spacing:-0.01em;">${site.name}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:${TEXT};">
            ${bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background-color:#fafafa;border-top:1px solid #e4e4e7;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:${MUTED};">
            ${site.address.street}, ${site.address.city}, ${site.address.region}
            &middot;
            <a href="mailto:${site.email}" style="color:${MUTED};text-decoration:underline;">${site.email}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

/** Primary call-to-action button. Table-based, so it survives Outlook. */
export function emailButton(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
  <tr>
    <td style="background-color:${BRAND_GREEN};border-radius:4px;">
      <a href="${href}" style="display:inline-block;padding:13px 26px;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;color:${BRAND_DARK};text-decoration:none;">${label}</a>
    </td>
  </tr>
</table>`
}

export function emailFooterNote(text: string) {
  return `<p style="margin:0;font-size:13px;line-height:1.6;color:${MUTED};">${text}</p>`
}