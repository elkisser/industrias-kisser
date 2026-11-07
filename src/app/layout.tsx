import type { Metadata, Viewport } from "next";
import {
  Barlow_Condensed,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const siteTitle =
  "Industrias Kisser | Fábrica de Maquinarias Agrícolas — Hasenkamp, Entre Ríos";
const siteDescription =
  "Venta directa de fábrica: tolvas autodescargables, jaulas ganaderas, palas cargadoras frontales, rastras Rome tijera, volcadores, niveladoras, cisternas y bateas. Configurá y cotizá tu equipo en 3D.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: "Industrias Kisser",
  keywords: [
    "Industrias Kisser",
    "maquinaria agrícola",
    "Hasenkamp",
    "Entre Ríos",
    "tolva autodescargable",
    "jaula ganadera",
    "pala cargadora frontal",
    "rastra Rome tijera",
    "acoplado volcador",
    "tanque cisterna",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "Industrias Kisser",
    title: "Industrias Kisser — Venta Directa de Fábrica",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Industrias Kisser — Venta Directa de Fábrica",
    description: siteDescription,
  },
  appleWebApp: {
    title: "Kisser",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#181A18",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${barlowCondensed.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body>{children}</body>
    </html>
  );
}
