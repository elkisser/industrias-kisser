import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Industrias Kisser — Maquinarias Agrícolas",
    short_name: "Industrias Kisser",
    description:
      "Fábrica de maquinarias agrícolas en Hasenkamp, Entre Ríos. Configurá y cotizá tu equipo en 3D.",
    start_url: "/",
    display: "standalone",
    background_color: "#F3F1EA",
    theme_color: "#181A18",
    lang: "es-AR",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
