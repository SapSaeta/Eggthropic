"use client";

import type { ReactNode } from "react";
import type { VisualKey, VisualSpec } from "@/lib/lecciones";
import { BucleAgente, FlujoAgente, MapaProtocolos, PilaCapas } from "./VisualesAgentes";
import { CleanCore, ConstructorOData, GrafoEC } from "./VisualesDatos";
import { VisualGenerico } from "./VisualesGenericos";
import {
  Anonimizador,
  ConstructorPitch,
  ElegirPlataforma,
  LineaTrazas,
  MatrizPermisos,
  PiramideRiesgo,
} from "./VisualesGobierno";

export function Visual({ k }: { k: VisualKey | VisualSpec }): ReactNode {
  if (typeof k !== "string") return <VisualGenerico spec={k} />;
  switch (k) {
    case "bucle":
      return <BucleAgente />;
    case "pila":
      return <PilaCapas />;
    case "mcp":
      return <MapaProtocolos key="mcp" inicial="mcp" />;
    case "a2a":
      return <MapaProtocolos key="a2a" inicial="a2a" />;
    case "cleancore":
      return <CleanCore />;
    case "hcm":
      return <GrafoEC />;
    case "odata":
      return <ConstructorOData />;
    case "permisos":
      return <MatrizPermisos />;
    case "flujo":
      return <FlujoAgente />;
    case "trazas":
      return <LineaTrazas />;
    case "riesgo":
      return <PiramideRiesgo />;
    case "anonimizar":
      return <Anonimizador />;
    case "plataforma":
      return <ElegirPlataforma />;
    case "pitch":
      return <ConstructorPitch />;
  }
}
