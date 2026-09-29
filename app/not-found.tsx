import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#202020] px-6 text-center">
      <h1 className="text-8xl font-bold text-[#09C895]">404</h1>
      <p className="mt-4 max-w-md text-white/60">
        La página que estás buscando no existe o fue movida.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-[#09C895] px-6 py-3 font-semibold text-[#202020] transition hover:bg-[#56e4bc]"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
