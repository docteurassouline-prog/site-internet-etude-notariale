import Image from "next/image";
import { cheminPublic } from "@/lib/chemins";

/** Fichier original transmis par le notaire, sans redessin ni déformation. */
export function Marque({ sombre = false }: { sombre?: boolean }) {
  return (
    <span className={`brand ${sombre ? "brand-dark" : ""}`}>
      <Image
        src={cheminPublic("/images/logo-levy-fourni.png")}
        alt=""
        width={131}
        height={140}
        className="brand-logo"
      />
      <span>
        <span className="brand-name">Thomas Lévy</span>
        <span className="brand-caption">Notaire · Paris XVI</span>
      </span>
    </span>
  );
}
