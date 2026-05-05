import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-7xl font-bold text-egg-400/20 font-mono mb-4">404</div>
      <h1 className="text-2xl font-semibold text-white mb-3">Page not found</h1>
      <p className="text-slate-400 mb-8 max-w-sm">
        This experiment doesn't exist yet — or it got archived. Back to the lab.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-egg-400 text-lab-900 font-semibold text-sm hover:bg-egg-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Eggthropic
      </Link>
    </div>
  );
}
