"use client";

import React from "react";
import { COMPANY_INFO } from "@/data/products";
import {
  Instagram,
  MapPin,
  Phone,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contacto"
      className="bg-[#181A18] text-[#E7E4DA] pt-16 pb-12 scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#2E322E]">
          {/* Columna 1: Emblema Oficial e Historia */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3.5 mb-4">
              <img
                src="/brand-logo.svg"
                alt="Emblema Industrias Kisser"
                className="w-12 h-12 rounded-lg border border-[#3E423E] object-contain shrink-0"
              />
              <div>
                <span className="block font-display text-2xl font-extrabold uppercase tracking-wide text-[#F3F1EA] leading-none">
                  Industrias Kisser
                </span>
                <span className="block text-xs text-[#A5A299] mt-0.5">
                  {COMPANY_INFO.legalSubtitle} • Hasenkamp, Entre Ríos
                </span>
              </div>
            </div>

            <p className="text-sm text-[#CEC9BC] leading-relaxed max-w-[54ch] mb-6">
              {COMPANY_INFO.foundersStory}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#146B38] hover:bg-[#0F542B] text-[#F3F1EA] text-xs font-semibold transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp {COMPANY_INFO.whatsappDisplay}</span>
              </a>

              <a
                href={COMPANY_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#252825] hover:bg-[#303430] border border-[#3E423E] text-[#F3F1EA] text-xs font-semibold transition"
              >
                <Instagram className="w-4 h-4 text-[#DF9F14]" />
                <span>{COMPANY_INFO.instagramHandle}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Columna 2: Equipos */}
          <div className="md:col-span-3">
            <h3 className="font-display text-xl font-bold uppercase tracking-wide text-[#F3F1EA] mb-3.5">
              Equipos en Producción
            </h3>
            <ul className="space-y-2.5 text-sm text-[#CEC9BC]">
              <li>
                <a href="#configurador" className="hover:text-[#DF9F14] transition">
                  Acoplados Jaula para Hacienda
                </a>
              </li>
              <li>
                <a href="#configurador" className="hover:text-[#DF9F14] transition">
                  Carrocerías Jaula para Camión
                </a>
              </li>
              <li>
                <a href="#configurador" className="hover:text-[#DF9F14] transition">
                  Rastra Rome Tijera de 18 Platos
                </a>
              </li>
              <li>
                <a href="#configurador" className="hover:text-[#DF9F14] transition">
                  Pala Cargadora Frontal Hidráulica
                </a>
              </li>
              <li>
                <a href="#configurador" className="hover:text-[#DF9F14] transition">
                  Tolvas Semilleras y Autodescargables
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto Directo de Fábrica */}
          <div className="md:col-span-4">
            <h3 className="font-display text-xl font-bold uppercase tracking-wide text-[#F3F1EA] mb-3.5">
              Planta Industrial Hasenkamp
            </h3>
            <ul className="space-y-3 text-sm text-[#CEC9BC]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#DF9F14] shrink-0 mt-1" />
                <span>
                  {COMPANY_INFO.location}
                  <span className="block text-xs text-[#A5A299] mt-0.5">
                    Departamento Paraná — Provincia de Entre Ríos
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2.5 font-mono tabular-nums">
                <Phone className="w-4 h-4 text-[#DF9F14] shrink-0" />
                <span>Teléfono fijo: {COMPANY_INFO.phoneDisplay}</span>
              </li>
              <li className="flex items-center gap-2.5 font-mono tabular-nums">
                <MessageCircle className="w-4 h-4 text-[#146B38] shrink-0" />
                <span>WhatsApp: {COMPANY_INFO.whatsappDisplay}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Instagram className="w-4 h-4 text-[#DF9F14] shrink-0" />
                <a
                  href={COMPANY_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#DF9F14] underline transition"
                >
                  instagram.com/industriaskisser
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A5A299]">
          <p>
            © {new Date().getFullYear()} Industrias Kisser — Hasenkamp, Entre Ríos, Argentina. Industria Argentina.
          </p>
          <p>
            Fabricación de Maquinaria Agrícola y Desarrollos Metalúrgicos a Medida
          </p>
        </div>
      </div>
    </footer>
  );
}
