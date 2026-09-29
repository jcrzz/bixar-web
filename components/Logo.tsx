export function Logo() {
  return (
    <div className="flex items-center gap-3" aria-label="Bixar Ingeniería">
      <span className="logo-box flex h-9 w-9 items-center justify-center text-sm font-bold">
        <span className="bg-linear-to-r from-[#09C895] to-[#186DD4] bg-clip-text text-transparent">
          B
        </span>
      </span>
      <span className="logo-font text-sm font-semibold tracking-[0.2em] text-white">
        BIXAR<span className="text-[#09C895]">.</span>
      </span>
    </div>
  )
}
