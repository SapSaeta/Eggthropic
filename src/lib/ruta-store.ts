"use client";

import { useSyncExternalStore } from "react";

// Estado personal de la ruta: vive solo en este navegador (localStorage).
// Una lección hecha = id → fecha local (AAAA-MM-DD). El quiz guarda la opción elegida.

export interface RutaState {
  hechas: Record<string, string>;
  quiz: Record<string, number>;
}

const KEY = "eggthropic-ruta-v1";
const VACIO: RutaState = { hechas: {}, quiz: {} };

let actual: RutaState = VACIO;
let cargado = false;
const oyentes = new Set<() => void>();

function cargar() {
  cargado = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      actual = { hechas: p.hechas ?? {}, quiz: p.quiz ?? {} };
    }
  } catch {
    // sin almacenamiento: la página funciona igual, solo no recuerda
  }
}

function emitir() {
  oyentes.forEach((o) => o());
}

function suscribir(cb: () => void) {
  oyentes.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cargado = false;
      emitir();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    oyentes.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function snapshot(): RutaState {
  if (!cargado) cargar();
  return actual;
}

function actualizar(fn: (s: RutaState) => RutaState) {
  actual = fn(snapshot());
  try {
    localStorage.setItem(KEY, JSON.stringify(actual));
  } catch {
    // ignorar
  }
  emitir();
}

export function useRuta(): RutaState {
  return useSyncExternalStore(suscribir, snapshot, () => VACIO);
}

export function responderQuiz(id: string, opcion: number) {
  actualizar((s) => (id in s.quiz ? s : { ...s, quiz: { ...s.quiz, [id]: opcion } }));
}

export function marcarHecha(id: string, fecha: string) {
  actualizar((s) => (id in s.hechas ? s : { ...s, hechas: { ...s.hechas, [id]: fecha } }));
}

export function reiniciar() {
  actualizar(() => VACIO);
}

// ─── Hoy (fecha local, como texto) ───────────────────────────────────────────

export function fechaLocal(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dd}`;
}

function suscribirDia(cb: () => void) {
  const t = setInterval(cb, 60_000);
  return () => clearInterval(t);
}

/** Fecha local de hoy; "" en servidor y durante la hidratación. */
export function useHoy(): string {
  return useSyncExternalStore(
    suscribirDia,
    () => fechaLocal(new Date()),
    () => ""
  );
}

export function parseFecha(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function sumarDias(s: string, n: number): string {
  const d = parseFecha(s);
  d.setDate(d.getDate() + n);
  return fechaLocal(d);
}

/** Racha: días seguidos con alguna lección hecha. Sigue viva si hoy aún no has hecho la tuya. */
export function calcularRacha(hechas: Record<string, string>, hoy: string): number {
  if (!hoy) return 0;
  const dias = new Set(Object.values(hechas));
  let cursor = dias.has(hoy) ? hoy : sumarDias(hoy, -1);
  let n = 0;
  while (dias.has(cursor)) {
    n++;
    cursor = sumarDias(cursor, -1);
  }
  return n;
}
