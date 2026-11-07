"use client";

import React from "react";
import { COMPANY_INFO } from "@/data/products";
import { Instagram, Phone, MapPin, MessageCircle } from "lucide-react";

export default function Navbar() {
  const contactItems = [
    {
      id: "loc",
      content: (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <MapPin className="w-3.5 h-3.5 text-[#DF9F14] shrink-0" />
          <span>Hasenkamp, Entre Ríos — Parque Industrial</span>
        </span>
      ),
    },
    {
      id: "phone",
      content: (
        <a
          href={`https://wa.me/${COMPANY_INFO.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono tabular-nums text-[#F3F1EA] hover:text-[#DF9F14] transition"
        >
          <Phone className="w-3.5 h-3.5 text-[#DF9F14] shrink-0" />
          <span>{COMPANY_INFO.phoneDisplay}</span>
        </a>
      ),
    },
    {
      id: "ig",
      content: (
        <a
          href={COMPANY_INFO.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 whitespace-nowrap text-[#F3F1EA] hover:text-[#DF9F14] font-semibold transition"
        >
          <Instagram className="w-3.5 h-3.5 text-[#DF9F14] shrink-0" />
          <span>{COMPANY_INFO.instagramHandle}</span>
        </a>
      ),
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F3F1EA]/95 border-b border-[#CEC9BC]">
      {/* Barra Técnica Superior en Modo Carrusel Continuo (1 sola línea sin saltos) */}
      <div className="bg-[#181A18] text-[#E7E4DA] h-8 overflow-hidden flex items-center text-xs select-none">
        <div className="animate-contact-carousel items-center">
          {[0, 1, 2, 3].map((groupIdx) => (
            <div
              key={groupIdx}
              aria-hidden={groupIdx > 0 ? "true" : undefined}
              className="flex items-center gap-6 px-4 whitespace-nowrap shrink-0"
            >
              {contactItems.map((item) => (
                <React.Fragment key={`${groupIdx}-${item.id}`}>
                  {item.content}
                  <span className="text-[#DF9F14]/60 text-[10px]" aria-hidden="true">
                    •
                  </span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Barra Principal con Emblema Oficial de @industriaskisser */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2.5 sm:gap-3">
        <a href="#" className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <img
            src="/brand-logo.jpg"
            alt="Emblema Oficial Industrias Kisser"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-[#CEC9BC] object-cover shrink-0"
          />
          <div className="min-w-0">
            <span className="block font-display text-lg sm:text-[28px] font-extrabold tracking-[-0.02em] text-[#181A18] leading-none uppercase truncate">
              Industrias Kisser
            </span>
            <span className="block text-[11px] sm:text-xs text-[#434642] mt-0.5 truncate">
              Fábrica de Maquinarias Agrícolas
            </span>
          </div>
        </a>

        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-7 text-base font-bold text-[#181A18]"
        >
          <a
            href="#configurador"
            className="hover:text-[#146B38] transition py-1"
          >
            Pintar Máquina en 3D
          </a>
          <a
            href="#catalogo"
            className="hover:text-[#146B38] transition py-1"
          >
            Equipos y Fotos
          </a>
          <a
            href="#a-medida"
            className="hover:text-[#146B38] transition py-1"
          >
            Trabajos a Medida
          </a>
          <a
            href="#historia"
            className="hover:text-[#146B38] transition py-1"
          >
            Local y Planta
          </a>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`https://wa.me/${COMPANY_INFO.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[38px] sm:min-h-[40px] inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg bg-[#146B38] hover:bg-[#0F542B] text-[#F3F1EA] font-bold text-xs sm:text-sm whitespace-nowrap transition"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>WhatsApp Directo</span>
          </a>
        </div>
      </div>

      {/* Barra Rápida para Celulares (Siempre clara y al alcance del pulgar) */}
      <nav
        aria-label="Accesos rápidos en celular"
        className="md:hidden grid grid-cols-3 divide-x divide-[#CEC9BC] border-t border-[#CEC9BC] bg-[#E7E4DA] text-center"
      >
        <a
          href="#configurador"
          className="py-2.5 text-xs font-extrabold text-[#181A18] active:bg-[#146B38] active:text-[#F3F1EA]"
        >
          1. Pintar en 3D
        </a>
        <a
          href="#catalogo"
          className="py-2.5 text-xs font-extrabold text-[#181A18] active:bg-[#146B38] active:text-[#F3F1EA]"
        >
          2. Ver Equipos
        </a>
        <a
          href="#a-medida"
          className="py-2.5 text-xs font-extrabold text-[#181A18] active:bg-[#146B38] active:text-[#F3F1EA]"
        >
          3. A Medida
        </a>
      </nav>
    </header>
  );
}
