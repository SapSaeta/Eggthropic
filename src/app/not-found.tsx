import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-7xl font-bold text-egg-600/20 font-mono mb-4">404</div>
      <h1 className="text-2xl font-semibold text-ink mb-3">Página no encontrada</h1>
      <p className="text-ink-soft mb-8 max-w-sm">
        Este experimento aún no existe — o quedó archivado. Volvamos al laboratorio.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-egg-400 text-ink font-semibold text-sm hover:bg-egg-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Eggthropic
      </Link>
    </div>
  );
}
