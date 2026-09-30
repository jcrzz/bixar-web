export function Logo() {
  return (
    <div className="flex items-center gap-3" aria-label="Bixar Ingeniería">
      <img
        src="/BIXAR-LOGO-SOLO.png"
        alt="Bixar Ingeniería"
        className="logo-img"
      />
      <span className="logo-font text-sm font-semibold tracking-[0.2em] text-white">
        BIXAR<span className="text-[#09C895]">.</span>
      </span>
    </div>
  )
}
