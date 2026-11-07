"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ConfiguratorStudio from "@/components/ConfiguratorStudio";
import CatalogSection from "@/components/CatalogSection";
import Footer from "@/components/Footer";
import { PRODUCTS, COMPANY_INFO } from "@/data/products";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Factory,
  Sliders,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const HERO_SHOWCASE = [
  {
    productId: "tolva-t20",
    shortTab: "Tolvas",
    title: "Tolvas Autodescargables",
    measureTag: "De 6 a 30 Toneladas",
    commercialHook:
      "Descarga rápida con sinfín plegable hidráulico, avantrén reforzado y llantas de alta flotación.",
    photo: "/muestras/PHOTO-2026-11-06-22-32-47.jpg",
  },
  {
    productId: "acoplado-jaula-ganadero",
    shortTab: "Jaulas",
    title: "Acoplados Jaula Ganadera",
    measureTag: "De 4 a 12 Cabezas",
    commercialHook:
      "Sistema tándem balancín, piso antideslizante, puerta guillotina trasera y pasarela superior.",
    photo: "/muestras/PHOTO-2026-11-06-22-32-38_1.jpg",
  },
  {
    productId: "pala-cargadora-frontal",
    shortTab: "Palas",
    title: "Palas Cargadoras Frontales",
    measureTag: "De 1.000 a 2.200 kg",
    commercialHook:
      "Doble cilindro de levante y vuelco, desacople rápido y adaptación directa a la marca de tu tractor.",
    photo: "/muestras/PHOTO-2026-11-06-22-32-47_1.jpg",
  },
  {
    productId: "rastra-rome-tijera-18",
    shortTab: "Rastras Rome",
    title: "Rastras Rome Tijera",
    measureTag: "De 14 a 28 Discos Dentados",
    commercialHook:
      "Tiro excéntrico pesado con regulación hidráulica de apertura, bancadas en baño de aceite y limpiadiscos.",
    photo: "/muestras/PHOTO-2026-11-06-22-32-43.jpg",
  },
  {
    productId: "acoplado-volcador-kisser",
    shortTab: "Volcadores",
    title: "Acoplados Volcadores Hidráulicos",
    measureTag: "De 4 a 14 Toneladas",
    commercialHook:
      "Cilindro telescópico de 3 etapas, barandas rebatibles y chasis reforzado para uso agrícola y vial.",
    photo: "/muestras/PHOTO-2026-11-06-22-32-48.jpg",
  },
  {
    productId: "tanque-cisterna-kisser",
    shortTab: "Cisternas",
    title: "Tanques Cisterna y Combustible",
    measureTag: "De 1.500 a 10.000 Litros",
    commercialHook:
      "Tanque plegado octogonal con rompeolas internos, baulera para surtidor y chasis de 2 ejes.",
    photo: "/muestras/PHOTO-2026-11-06-22-33-00_1.jpg",
  },
];

export default function HomePage() {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    PRODUCTS[0].id
  );
  const [activeSlide, setActiveSlide] = useState<number>(0);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SHOWCASE.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const selectAndJumpTo3D = (productId: string) => {
    setSelectedProductId(productId);
    const el = document.getElementById("configurador");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentHeroItem = HERO_SHOWCASE[activeSlide];

  const commercialWhatsAppUrl = `https://wa.me/${
    COMPANY_INFO.whatsappNumber
  }?text=${encodeURIComponent(
    "Buen día. Solicito lista de precios de sus equipos. Muchas gracias."
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F1EA] text-[#181A18]">
      <Navbar />

      <main className="flex-1">
        {/* HERO COMERCIAL DE ALTO IMPACTO ORIENTADO A VENTAS */}
        <section className="bg-[#181A18] text-[#F3F1EA] border-b border-[#2E322E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Columna de Venta Directa y Propuesta de Valor */}
              <div className="lg:col-span-6">
                <h1 className="font-display text-5xl sm:text-6xl lg:text-[66px] font-extrabold uppercase tracking-[-0.03em] text-[#F3F1EA] leading-[0.96]">
                  Equipos que Rinden en el Campo.{" "}
                  <span className="text-[#DF9F14]">
                    Venta Directa de Fábrica.
                  </span>
                </h1>

                <p className="mt-4 sm:mt-5 text-base sm:text-lg text-[#E7E4DA] leading-relaxed max-w-[58ch]">
                  Comprá tu próxima maquinaria sin intermediarios en{" "}
                  <strong className="text-white">Industrias Kisser</strong>.
                  Fabricamos equipos agrícolas y viales de acero reforzado con la
                  capacidad exacta que necesita tu establecimiento y pintados con
                  los colores de tu flota.
                </p>

                {/* Botones de Conversión Comercial Inmediata */}
                <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() => selectAndJumpTo3D(currentHeroItem.productId)}
                    className="min-h-[54px] inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#146B38] hover:bg-[#198245] text-[#F3F1EA] font-extrabold text-base transition shadow-lg"
                  >
                    <span>Armar y Cotizar en 3D</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <a
                    href={commercialWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[54px] inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#DF9F14] hover:bg-[#ECCB4D] text-[#181A18] font-extrabold text-base transition"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Pedir Precios por WhatsApp</span>
                  </a>
                </div>

                {/* 3 Beneficios Comerciales Clave para el Comprador */}
                <div className="mt-8 pt-6 border-t border-[#2E322E] grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#252825] border border-[#3A3D39] flex items-center justify-center shrink-0">
                      <Factory className="w-4 h-4 text-[#DF9F14]" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-white leading-tight">
                        Trato Directo
                      </div>
                      <p className="text-xs text-[#CEC9BC] mt-0.5 leading-snug">
                        Precio de fábrica en Hasenkamp sin comisiones.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#252825] border border-[#3A3D39] flex items-center justify-center shrink-0">
                      <Sliders className="w-4 h-4 text-[#DF9F14]" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-white leading-tight">
                        A tu Medida y Color
                      </div>
                      <p className="text-xs text-[#CEC9BC] mt-0.5 leading-snug">
                        Elegí toneladas, litros, discos y pintura en 3D.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#252825] border border-[#3A3D39] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-[#DF9F14]" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-white leading-tight">
                        Chasis Reforzado
                      </div>
                      <p className="text-xs text-[#CEC9BC] mt-0.5 leading-snug">
                        Acero plegado con respaldo y repuestos propios.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Vitrina Comercial Interactiva (Carrusel con Altura Fija y Transición Slide) */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl overflow-hidden border border-[#3A3D39] bg-[#222522] shadow-2xl">
                  {/* Ventana de Altura Fija con Pista Deslizante Horizontal (Slide) */}
                  <div className="relative h-[240px] sm:h-[330px] lg:h-[360px] w-full overflow-hidden bg-[#181A18]">
                    <div
                      className="flex h-full w-full transition-transform duration-500 ease-out will-change-transform"
                      style={{
                        transform: `translate3d(-${activeSlide * 100}%, 0, 0)`,
                      }}
                    >
                      {HERO_SHOWCASE.map((slide) => (
                        <div
                          key={slide.productId}
                          className="relative w-full h-full shrink-0"
                        >
                          <img
                            src={slide.photo}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Etiqueta de Capacidad Destacada */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none z-10">
                      <span className="px-3.5 py-1.5 rounded-lg bg-[#181A18]/90 border border-[#454843] text-[#DF9F14] font-display text-sm sm:text-base font-extrabold uppercase tracking-wide">
                        {currentHeroItem.measureTag}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-[#146B38]/95 text-[#F3F1EA] text-xs font-extrabold uppercase">
                        Fabricación Propia
                      </span>
                    </div>

                    {/* Flechas de navegación del escaparate */}
                    <button
                      type="button"
                      aria-label="Equipo anterior"
                      onClick={() =>
                        setActiveSlide(
                          (prev) =>
                            (prev - 1 + HERO_SHOWCASE.length) %
                            HERO_SHOWCASE.length
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#181A18]/85 hover:bg-[#181A18] border border-white/20 text-white flex items-center justify-center transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Siguiente equipo"
                      onClick={() =>
                        setActiveSlide(
                          (prev) => (prev + 1) % HERO_SHOWCASE.length
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#181A18]/85 hover:bg-[#181A18] border border-white/20 text-white flex items-center justify-center transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Pie Comercial de la Vitrina con Altura Fija para que nunca salte el layout */}
                  <div className="p-4 sm:px-5 sm:py-4 h-[156px] sm:h-[116px] bg-[#222522] border-t border-[#3A3D39] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white leading-none truncate">
                        {currentHeroItem.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#E7E4DA] mt-1.5 max-w-[48ch] leading-snug">
                        {currentHeroItem.commercialHook}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        selectAndJumpTo3D(currentHeroItem.productId)
                      }
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-[#146B38] hover:bg-[#198245] text-[#F3F1EA] text-xs sm:text-sm font-extrabold whitespace-nowrap inline-flex items-center justify-center gap-2 shrink-0 transition"
                    >
                      <span>Pintar y Cotizar</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Selector Rápido de Diapositivas en Grilla Limpia (Sin barra de scroll horizontal) */}
                  <div className="p-2.5 bg-[#181A18] border-t border-[#2E322E] grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {HERO_SHOWCASE.map((item, idx) => {
                      const isCurrent = idx === activeSlide;
                      return (
                        <button
                          key={item.productId}
                          type="button"
                          onClick={() => setActiveSlide(idx)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center truncate transition ${
                            isCurrent
                              ? "bg-[#DF9F14] text-[#181A18]"
                              : "bg-[#252825] text-[#CEC9BC] hover:text-white hover:bg-[#323632]"
                          }`}
                        >
                          {item.shortTab}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra Comercial de Acceso Directo por Rubro (Grilla limpia sin scroll horizontal) */}
          <div className="bg-[#222522] border-t border-[#2E322E] py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <span className="font-display text-lg sm:text-xl font-extrabold uppercase text-[#DF9F14] shrink-0">
                ¿Qué equipo necesitás cotizar hoy?
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 flex-1">
                {PRODUCTS.map((prod) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => selectAndJumpTo3D(prod.id)}
                    className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#181A18] hover:bg-[#146B38] border border-[#3A3D39] text-[#F3F1EA] text-xs font-bold text-center truncate transition"
                  >
                    {prod.shortTitle}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ESTUDIO CONFIGURADOR 3D INTERACTIVO */}
        <ConfiguratorStudio
          selectedProductId={selectedProductId}
          onSelectProduct={setSelectedProductId}
        />

        {/* CATÁLOGO CON FOTOS REALES E HISTORIA FAMILIAR */}
        <CatalogSection onCustomizeProduct={setSelectedProductId} />
      </main>

      <Footer />
    </div>
  );
}
