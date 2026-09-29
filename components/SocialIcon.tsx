interface SocialIconProps {
  network: 'linkedin' | 'instagram' | 'facebook'
}

export function SocialIcon({ network }: SocialIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      className="h-[18px] w-[18px]"
    >
      {network === 'linkedin' && (
        <>
          <path d="M6 9v9" />
          <path d="M6 6.2v.1" />
          <path d="M10.5 18v-5a3 3 0 0 1 6 0v5" />
          <path d="M10.5 10v8" />
        </>
      )}
      {network === 'instagram' && (
        <>
          <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
          <circle cx="12" cy="12" r="3.5" />
          <path d="M17.3 6.8h.01" />
        </>
      )}
      {network === 'facebook' && (
        <path d="M14.5 18v-6h2l.5-2h-2.5V8.8c0-.8.3-1.3 1.3-1.3H16V5.7c-.5-.1-1-.2-1.8-.2-1.8 0-3 1.1-3 3.1V10H9v2h2.2v6" />
      )}
    </svg>
  )
}
