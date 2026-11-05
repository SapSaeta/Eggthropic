import type { ReactNode } from "react";

export const C = {
  ink: "#2c2620",
  soft: "#5c5347",
  faint: "#8a7e6d",
  line: "#e0d6c2",
  paper: "#fcf8ef",
  joule: "#0a6ed1",
  teal: "#0d9488",
  violet: "#7a4fd6",
  teja: "#c2542b",
  gold: "#f2a900",
  red: "#d6455d",
  green: "#2e9e5b",
};

/** Marco común de todos los visuales: tarjeta clara con etiqueta mono arriba. */
export function Marco({
  etiqueta,
  children,
}: {
  etiqueta: string;
  children: ReactNode;
}) {
  return (
    <figure className="rounded-2xl border border-paper-line bg-[#fffdf6] p-3 sm:p-4">
      <figcaption className="font-mono text-[10px] tracking-[0.18em] text-ink-faint mb-2">
        {etiqueta.toUpperCase()}
      </figcaption>
      {children}
    </figure>
  );
}

/** Botón segmentado grande, pensado para el pulgar. */
export function Segmentos<T extends string>({
  valor,
  opciones,
  onChange,
}: {
  valor: T;
  opciones: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-xl bg-paper-deep p-1 gap-1" role="tablist">
      {opciones.map((o) => (
        <button
          key={o.id}
          role="tab"
          aria-selected={valor === o.id}
          onClick={() => onChange(o.id)}
          className={`flex-1 min-h-10 rounded-lg px-2 text-sm font-medium transition-colors ${
            valor === o.id ? "bg-white text-ink shadow-sm" : "text-ink-soft"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
