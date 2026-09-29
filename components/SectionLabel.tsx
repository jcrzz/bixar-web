interface SectionLabelProps {
  children: React.ReactNode
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-[#09C895]">
      // {children}
    </p>
  )
}
