"use client";

import React, { useState } from "react";
import {
  PRODUCTS,
  SPECIAL_DEVELOPMENTS,
  COMPANY_INFO,
  ProductItem,
} from "@/data/products";
import {
  ArrowUpRight,
  Instagram,
  Check,
  MessageCircle,
  Phone,
} from "lucide-react";

const CUSTOM_PROJECT_OPTIONS = [
  "Fabricación de un equipo o implemento a medida",
  "Carrocería, acoplado o trailer con medidas especiales",
  "Adaptación de pala frontal para mi modelo de tractor",
  "Reforma, alargue o reparación metalúrgica",
  "Equipamiento especial para Municipio o Comuna",
  "Otro desarrollo metalúrgico para el campo",
];

interface CatalogSectionProps {
  onCustomizeProduct: (productId: string) => void;
}

export default function CatalogSection({
  onCustomizeProduct,
}: CatalogSectionProps) {
  const [selectedImages, setSelectedImages] = useState<Record<string, string>>(
    () => Object.fromEntries(PRODUCTS.map((p) => [p.id, p.instagramPhoto]))
  );

  const [selectedSpecialImages, setSelectedSpecialImages] = useState<
    Record<string, string>
  >(() =>
    Object.fromEntries(SPECIAL_DEVELOPMENTS.map((s) => [s.id, s.photos[0]]))
  );

  const [customTopic, setCustomTopic] = useState<string>(
    CUSTOM_PROJECT_OPTIONS[0]
  );
  const [customName, setCustomName] = useState<string>("");
  const [customLocation, setCustomLocation] = useState<string>("");
  const [customDescription, setCustomDescription] = useState<string>("");

  const handleSendCustomProjectWhatsApp = () => {
    const lines = [
      `Buen día. Consulto por un trabajo a medida:`,
      ``,
      `Tipo de trabajo: ${customTopic}`,
    ];
    if (customDescription.trim()) {
      lines.push(`Detalle: ${customDescription.trim()}`);
    }
    if (customName.trim()) {
      lines.push(`Nombre: ${customName.trim()}`);
    }
    if (customLocation.trim()) {
      lines.push(`Localidad: ${customLocation.trim()}`);
    }
    lines.push(``, `Muchas gracias.`);
    const url = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
      lines.join("\n")
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSelectAndScroll = (product: ProductItem) => {
    onCustomizeProduct(product.id);
    const el = document.getElementById("configurador");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* SECCIÓN CATÁLOGO Y ENTREGAS REALES (@industriaskisser) */}
      <section
        id="catalogo"
        className="py-16 md:py-24 border-b border-[#CEC9BC] scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#CEC9BC]">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.02em] text-[#181A18] leading-[1.04]">
                Equipos Fabricados y Entregados en Planta
              </h2>
              <p className="mt-3 text-[#434642] text-base max-w-[68ch] leading-relaxed">
                Fotografías reales de nuestra producción en Hasenkamp publicadas en{" "}
                <a
                  href={COMPANY_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#146B38] font-semibold underline"
                >
                  {COMPANY_INFO.instagramHandle}
                </a>
                . Cada unidad se entrega con la combinación de colores de carrocería, chasis y llantas solicitada por el productor o municipio.
              </p>
            </div>

            <a
              href={COMPANY_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E7E4DA] hover:bg-[#DBD7C9] border border-[#CEC9BC] text-[#181A18] text-xs sm:text-sm font-semibold transition shrink-0"
            >
              <Instagram className="w-4 h-4 text-[#9E1B22]" />
              <span>Ver publicaciones en Instagram</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Lista Editorial de los 8 Equipos Configurables en 3D */}
          <div className="divide-y divide-[#CEC9BC]">
            {PRODUCTS.map((product, index) => {
              const activeImg =
                selectedImages[product.id] || product.instagramPhoto;
              const isEven = index % 2 === 0;

              return (
                <article
                  key={product.id}
                  className="py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
                >
                  {/* Fotografía Real del Equipo */}
                  <div
                    className={`lg:col-span-7 ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="overflow-hidden rounded-xl border border-[#CEC9BC] bg-[#181A18]">
                      <div className="aspect-[16/10] w-full overflow-hidden">
                        <img
                          src={activeImg}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Pie de foto real y selector de tomas reales */}
                      <div className="p-3.5 bg-[#E7E4DA] border-t border-[#CEC9BC] flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs text-[#434642] max-w-[52ch]">
                          <strong className="text-[#181A18]">
                            Entrega real Kisser:
                          </strong>{" "}
                          {product.instagramPostCaption}
                        </p>

                        {product.galleryPhotos.length > 1 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {product.galleryPhotos.map((photoUrl, gIdx) => (
                              <button
                                key={photoUrl}
                                type="button"
                                onClick={() =>
                                  setSelectedImages((prev) => ({
                                    ...prev,
                                    [product.id]: photoUrl,
                                  }))
                                }
                                className={`w-11 h-8 rounded overflow-hidden border transition ${
                                  activeImg === photoUrl
                                    ? "border-[#181A18] ring-2 ring-[#146B38]"
                                    : "border-[#CEC9BC] opacity-70 hover:opacity-100"
                                }`}
                                title={`Ver foto ${gIdx + 1}`}
                              >
                                <img
                                  src={photoUrl}
                                  alt={`${product.shortTitle} vista ${gIdx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Especificaciones y Acción 3D */}
                  <div
                    className={`lg:col-span-5 flex flex-col justify-between ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div>
                      <h3 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.02em] text-[#181A18] leading-[1.06]">
                        {product.name}
                      </h3>

                      <p className="mt-3 text-sm sm:text-base text-[#434642] leading-relaxed max-w-[65ch]">
                        {product.description}
                      </p>

                      {/* Tabla de Datos Técnicos (Tabular Nums) */}
                      <dl className="mt-6 border-t border-b border-[#CEC9BC] divide-y divide-[#CEC9BC] text-xs sm:text-sm">
                        <div className="py-2.5 flex items-center justify-between gap-4">
                          <dt className="text-[#5F635D] font-medium">
                            Capacidad / Configuración
                          </dt>
                          <dd className="font-mono font-semibold text-[#181A18] tabular-nums text-right">
                            {product.capacity}
                          </dd>
                        </div>
                        <div className="py-2.5 flex items-center justify-between gap-4">
                          <dt className="text-[#5F635D] font-medium">
                            Estructura / Chasis
                          </dt>
                          <dd className="font-mono font-semibold text-[#181A18] tabular-nums text-right">
                            {product.dimensions}
                          </dd>
                        </div>
                        <div className="py-2.5 flex items-center justify-between gap-4">
                          <dt className="text-[#5F635D] font-medium">
                            Rodado / Sistema
                          </dt>
                          <dd className="font-semibold text-[#181A18] text-right">
                            {product.axlesOrConfig}
                          </dd>
                        </div>
                      </dl>

                      {/* Detalles Constructivos */}
                      <ul className="mt-5 space-y-2">
                        {product.features.map((feat, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-[#181A18]"
                          >
                            <Check className="w-4 h-4 text-[#146B38] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-7 pt-5 border-t border-[#CEC9BC] flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs text-[#434642]">
                        <span className="font-semibold text-[#181A18]">
                          Esquema en foto:
                        </span>
                        <span
                          className="w-4 h-4 rounded-sm border border-black/30"
                          style={{ backgroundColor: product.defaultColors.body }}
                          title="Cuerpo"
                        />
                        <span
                          className="w-4 h-4 rounded-sm border border-black/30"
                          style={{
                            backgroundColor: product.defaultColors.details,
                          }}
                          title="Detalles"
                        />
                        <span
                          className="w-4 h-4 rounded-sm border border-black/30"
                          style={{ backgroundColor: product.defaultColors.rims }}
                          title="Llantas / Discos"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectAndScroll(product)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#181A18] hover:bg-[#146B38] text-[#F3F1EA] font-semibold text-xs sm:text-sm transition"
                      >
                        <span>Personalizar este Equipo en 3D</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Desarrollos Especiales y Maquinaria Forrajera / Desmonte */}
          <div className="pt-16 border-t border-[#CEC9BC]">
            <div className="mb-10">
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.02em] text-[#181A18] leading-[1.05]">
                Desarrollos Especiales, Forraje y Desmonte
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#434642] max-w-[65ch]">
                Además de nuestras líneas seriadas, fabricamos equipos especiales a medida para productores, contratistas y comunas de toda la provincia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {SPECIAL_DEVELOPMENTS.map((spec) => {
                const activeSpecPhoto =
                  selectedSpecialImages[spec.id] || spec.photos[0];
                return (
                  <div
                    key={spec.id}
                    className="rounded-xl border border-[#CEC9BC] bg-[#E7E4DA] overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[16/10] w-full bg-[#181A18] overflow-hidden">
                        <img
                          src={activeSpecPhoto}
                          alt={spec.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <span className="text-xs font-bold uppercase text-[#146B38]">
                            {spec.category}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {spec.photos.map((ph, idx) => (
                              <button
                                key={ph}
                                type="button"
                                onClick={() =>
                                  setSelectedSpecialImages((prev) => ({
                                    ...prev,
                                    [spec.id]: ph,
                                  }))
                                }
                                className={`w-10 h-7 rounded overflow-hidden border transition ${
                                  activeSpecPhoto === ph
                                    ? "border-[#181A18] ring-2 ring-[#146B38]"
                                    : "border-[#CEC9BC] opacity-70 hover:opacity-100"
                                }`}
                                title={`Foto ${idx + 1}`}
                              >
                                <img
                                  src={ph}
                                  alt={`${spec.title} ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <h4 className="font-display text-2xl font-extrabold uppercase text-[#181A18] leading-tight">
                          {spec.title}
                        </h4>
                        <p className="mt-2 text-sm text-[#434642] leading-relaxed">
                          {spec.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 py-3.5 border-t border-[#CEC9BC] bg-[#F3F1EA] flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-[#434642]">
                        Fabricación a pedido en Hasenkamp
                      </span>
                      <a
                        href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
                          `Buen día. Consulto por: ${spec.title}. Muchas gracias.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#146B38] hover:underline"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Consultar por WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* APARTADO PARA SOLICITAR TRABAJOS O EQUIPOS QUE NO ESTÁN EN LOS PRODUCTOS */}
      <section
        id="a-medida"
        className="py-16 md:py-24 bg-[#181A18] text-[#F3F1EA] border-b border-[#2E322E] scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Columna Izquierda: Explicación Clara y Botones Rápidos */}
            <div className="lg:col-span-6 space-y-5">
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.02em] text-[#F3F1EA] leading-[1.04]">
                ¿Necesitás Fabricar o Reformar Algo que no Está en el Catálogo?
              </h2>

              <p className="text-base sm:text-lg text-[#CEC9BC] leading-relaxed max-w-[60ch]">
                Al ser una fábrica metalúrgica integral en Hasenkamp, diseñamos y construimos{" "}
                <strong className="text-[#F3F1EA]">
                  implementos especiales, reformas de chasis, carrocerías a medida, comederos, cargadores, rastrillos de desmonte y equipos viales
                </strong>{" "}
                según la necesidad de tu campo, empresa o comuna.
              </p>

              <div className="pt-2">
                <span className="block text-sm font-bold text-[#DF9F14] mb-3">
                  1. Tocá qué tipo de trabajo buscás consultar:
                </span>
                <div
                  role="group"
                  aria-label="Seleccionar tipo de trabajo a medida"
                  className="grid grid-cols-1 gap-2.5"
                >
                  {CUSTOM_PROJECT_OPTIONS.map((option) => {
                    const isSelected = customTopic === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setCustomTopic(option)}
                        className={`min-h-[48px] px-4 py-3 rounded-xl border text-left text-sm sm:text-base font-bold transition flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-[#146B38] text-[#F3F1EA] border-[#F3F1EA]"
                            : "bg-[#242724] hover:bg-[#2E322E] text-[#E7E4DA] border-[#3E423E]"
                        }`}
                      >
                        <span>{option}</span>
                        <span className="text-xs font-mono shrink-0">
                          {isSelected ? "✓ Elegido" : "Elegir"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Columna Derecha: Formulario Simple de Contacto Directo para Trabajos a Medida */}
            <div className="lg:col-span-6 rounded-xl border border-[#3E423E] bg-[#242724] p-6 sm:p-8">
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-[-0.01em] text-[#F3F1EA] mb-2">
                2. Contanos tu Idea y Te Asesoramos Directo de Fábrica
              </h3>
              <p className="text-sm text-[#CEC9BC] mb-6 leading-relaxed">
                Completá lo que necesites abajo y tocá el botón verde para hablar directo por WhatsApp con el taller de{" "}
                <strong className="text-[#F3F1EA]">Industrias Kisser</strong>.
              </p>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="custom-project-desc"
                    className="block text-xs sm:text-sm font-bold text-[#F3F1EA] mb-1.5"
                  >
                    ¿Qué equipo, medida o trabajo necesitás realizar?
                  </label>
                  <textarea
                    id="custom-project-desc"
                    rows={3}
                    placeholder="Ej: Necesito hacer un acoplado playo de 5 metros para rollos, o adaptar una pala para un tractor Fiat..."
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#181A18] border border-[#454843] text-sm sm:text-base text-[#F3F1EA] placeholder-[#8C8F89] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="custom-project-name"
                      className="block text-xs sm:text-sm font-bold text-[#F3F1EA] mb-1.5"
                    >
                      Tu Nombre o Establecimiento:
                    </label>
                    <input
                      id="custom-project-name"
                      type="text"
                      placeholder="Ej: Carlos Gómez"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="min-h-[46px] w-full px-3.5 py-2.5 rounded-lg bg-[#181A18] border border-[#454843] text-sm sm:text-base text-[#F3F1EA] placeholder-[#8C8F89]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="custom-project-location"
                      className="block text-xs sm:text-sm font-bold text-[#F3F1EA] mb-1.5"
                    >
                      Localidad / Zona:
                    </label>
                    <input
                      id="custom-project-location"
                      type="text"
                      placeholder="Ej: Hasenkamp / Entre Ríos"
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      className="min-h-[46px] w-full px-3.5 py-2.5 rounded-lg bg-[#181A18] border border-[#454843] text-sm sm:text-base text-[#F3F1EA] placeholder-[#8C8F89]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleSendCustomProjectWhatsApp}
                    className="min-h-[54px] flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#146B38] hover:bg-[#0F542B] text-[#F3F1EA] font-extrabold text-base transition"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Consultar Trabajo a Medida por WhatsApp</span>
                  </button>

                  <a
                    href="tel:03434930083"
                    className="min-h-[54px] inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#181A18] hover:bg-[#2E322E] border border-[#454843] text-[#F3F1EA] font-bold text-sm transition shrink-0"
                  >
                    <Phone className="w-4 h-4 text-[#DF9F14]" />
                    <span className="font-mono tabular-nums">0343 493-0083</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN HISTORIA, PLANTA INDUSTRIAL Y LOCAL EN HASENKAMP */}
      <section
        id="historia"
        className="py-16 md:py-24 bg-[#E7E4DA] border-b border-[#CEC9BC] scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-5">
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.02em] text-[#181A18] leading-[1.04]">
                Nuestra Planta, Local Comercial e Historia en Hasenkamp
              </h2>

              <p className="text-base text-[#181A18] leading-relaxed max-w-[65ch]">
                Industrias Kisser nació del esfuerzo, la visión y las horas de taller de{" "}
                <strong>Carlos Kisser</strong> en Hasenkamp, Entre Ríos. Un sueño familiar que hoy continúan haciendo crecer sus hijos{" "}
                <strong>Norby y Freddy</strong> junto a cada uno de los trabajadores metalúrgicos de la planta.
              </p>

              <p className="text-sm sm:text-base text-[#434642] leading-relaxed max-w-[65ch]">
                Contamos con nuestro propio local comercial y oficinas de atención, además del galpón industrial equipado con puente grúa, plegadoras y sector de pintura poliuretánica para atender a productores de toda la región.
              </p>

              <div className="pt-4 border-t border-[#CEC9BC] grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="font-display text-2xl font-extrabold uppercase text-[#146B38]">
                    Fabricación Propia
                  </div>
                  <p className="text-xs text-[#434642] mt-0.5">
                    Corte, plegado, soldadura y montaje integral en Hasenkamp.
                  </p>
                </div>
                <div>
                  <div className="font-display text-2xl font-extrabold uppercase text-[#9E1B22]">
                    Pintura a Pedido
                  </div>
                  <p className="text-xs text-[#434642] mt-0.5">
                    Verde Kisser, Rojo Carmesí, Amarillo Vial, Azul o Naranja.
                  </p>
                </div>
                <div>
                  <div className="font-display text-2xl font-extrabold uppercase text-[#181A18]">
                    Atención Directa
                  </div>
                  <p className="text-xs text-[#434642] mt-0.5">
                    En nuestro local comercial y planta en Hasenkamp.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {/* Fotografía Principal del Local / Oficinas de Industrias Kisser */}
              <div className="overflow-hidden rounded-xl border border-[#CEC9BC] bg-[#181A18]">
                <img
                  src="/local-kisser.jpg"
                  alt="Local comercial y oficinas de Industrias Kisser en Hasenkamp, Entre Ríos"
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="p-3.5 bg-[#F3F1EA] border-t border-[#CEC9BC] text-xs sm:text-sm text-[#434642]">
                  <strong className="text-[#181A18] block">
                    Local Comercial y Administración — Hasenkamp, Entre Ríos
                  </strong>
                  Atención directa a productores agropecuarios, contratistas y comunas.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="overflow-hidden rounded-xl border border-[#CEC9BC] bg-[#181A18]">
                  <img
                    src="/instagram/post-2.jpg?v=2"
                    alt="Trabajo metalúrgico y oficio familiar en la planta de Industrias Kisser"
                    className="w-full h-60 object-cover object-top"
                  />
                  <div className="p-3 bg-[#F3F1EA] border-t border-[#CEC9BC] text-xs text-[#434642]">
                    <strong className="text-[#181A18] block">
                      Oficio y Familia
                    </strong>
                    El legado de Carlos Kisser continuado por Norby, Freddy y el plantel de planta.
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#CEC9BC] bg-[#181A18]">
                  <img
                    src="/muestras/PHOTO-2026-11-06-22-32-47_1.jpg"
                    alt="Línea de Palas Cargadoras Frontales frente al emblema de Industrias Kisser"
                    className="w-full h-60 object-cover"
                  />
                  <div className="p-3 bg-[#F3F1EA] border-t border-[#CEC9BC] text-xs text-[#434642]">
                    <strong className="text-[#181A18] block">
                      Planta Industrial en Hasenkamp
                    </strong>
                    Desarrollos robustos en acero con sello de Industria Argentina.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

