"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  PRODUCTS,
  INDUSTRIAL_COLORS,
  COLOR_PRESETS,
  COMPANY_INFO,
  CustomizablePart,
  ProductItem,
} from "@/data/products";
import type { CameraPresetView } from "./three/SceneViewer";
import {
  RotateCw,
  Sun,
  Warehouse,
  MessageCircle,
  Check,
  Copy,
  RefreshCcw,
  Undo2,
} from "lucide-react";

const SceneViewer = dynamic(() => import("./three/SceneViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center bg-[#1C1E1C] text-[#E7E4DA] gap-3">
      <div className="w-9 h-9 rounded-full border-2 border-[#146B38] border-t-transparent animate-spin" />
      <p className="text-sm font-bold text-[#E7E4DA]">
        Cargando máquina en 3D...
      </p>
    </div>
  ),
});

interface ConfiguratorStudioProps {
  selectedProductId: string;
  onSelectProduct: (productId: string) => void;
}

interface ColorStateSnapshot {
  body: string;
  details: string;
  rims: string;
}

export default function ConfiguratorStudio({
  selectedProductId,
  onSelectProduct,
}: ConfiguratorStudioProps) {
  const currentProduct: ProductItem =
    PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  const [bodyColor, setBodyColor] = useState<string>(
    currentProduct.defaultColors.body
  );
  const [detailsColor, setDetailsColor] = useState<string>(
    currentProduct.defaultColors.details
  );
  const [rimsColor, setRimsColor] = useState<string>(
    currentProduct.defaultColors.rims
  );
  const [variantValue, setVariantValue] = useState<number>(
    currentProduct.variantFilter.defaultValue
  );
  const [colorHistory, setColorHistory] = useState<ColorStateSnapshot[]>([]);
  const [finishType, setFinishType] = useState<"gloss" | "satin" | "metallic">(
    "gloss"
  );
  const [activePart, setActivePart] = useState<CustomizablePart>("body");

  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [lightingMode, setLightingMode] = useState<"workshop" | "field">(
    "workshop"
  );
  const [cameraView, setCameraView] = useState<CameraPresetView>("iso");
  const [showRealPhotoCompare, setShowRealPhotoCompare] =
    useState<boolean>(false);

  const [clientName, setClientName] = useState<string>("");
  const [clientLocation, setClientLocation] = useState<string>("");
  const [clientNotes, setClientNotes] = useState<string>("");
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setAutoRotate(false);
    }
  }, []);

  useEffect(() => {
    setBodyColor(currentProduct.defaultColors.body);
    setDetailsColor(currentProduct.defaultColors.details);
    setRimsColor(currentProduct.defaultColors.rims);
    setVariantValue(currentProduct.variantFilter.defaultValue);
    setColorHistory([]);
  }, [currentProduct.id]);

  const pushHistorySnapshot = () => {
    setColorHistory((prev) => [
      ...prev.slice(-9),
      { body: bodyColor, details: detailsColor, rims: rimsColor },
    ]);
  };

  const handleUndoColor = () => {
    if (colorHistory.length === 0) return;
    const last = colorHistory[colorHistory.length - 1];
    setBodyColor(last.body);
    setDetailsColor(last.details);
    setRimsColor(last.rims);
    setColorHistory((prev) => prev.slice(0, -1));
  };

  const handleProductChange = (product: ProductItem) => {
    onSelectProduct(product.id);
    setBodyColor(product.defaultColors.body);
    setDetailsColor(product.defaultColors.details);
    setRimsColor(product.defaultColors.rims);
    setVariantValue(product.variantFilter.defaultValue);
    setColorHistory([]);
    setShowRealPhotoCompare(false);
  };

  const getActivePartColor = () => {
    if (activePart === "body") return bodyColor;
    if (activePart === "details") return detailsColor;
    return rimsColor;
  };

  const getActivePartLabel = () => {
    if (activePart === "body") return currentProduct.partLabels.body;
    if (activePart === "details") return currentProduct.partLabels.details;
    return currentProduct.partLabels.rims;
  };

  const setActivePartColor = (hex: string) => {
    pushHistorySnapshot();
    if (activePart === "body") setBodyColor(hex);
    else if (activePart === "details") setDetailsColor(hex);
    else setRimsColor(hex);
  };

  const getShortColorName = (hex: string) => {
    const match = INDUSTRIAL_COLORS.find(
      (c) => c.hex.toLowerCase() === hex.toLowerCase()
    );
    return match ? match.name : `Personalizado (${hex.toUpperCase()})`;
  };

  const getColorLabel = (hex: string) => {
    const match = INDUSTRIAL_COLORS.find(
      (c) => c.hex.toLowerCase() === hex.toLowerCase()
    );
    return match
      ? `${match.name} (${match.code})`
      : `Color HEX ${hex.toUpperCase()}`;
  };

  const applyPreset = (preset: (typeof COLOR_PRESETS)[0]) => {
    pushHistorySnapshot();
    setBodyColor(preset.body);
    setDetailsColor(preset.details);
    setRimsColor(preset.rims);
  };

  const resetToDefault = () => {
    pushHistorySnapshot();
    setBodyColor(currentProduct.defaultColors.body);
    setDetailsColor(currentProduct.defaultColors.details);
    setRimsColor(currentProduct.defaultColors.rims);
    setFinishType("gloss");
  };

  const finishNameMap = {
    gloss: "Brillante Poliuretánico",
    satin: "Satinado Semi-Mate",
    metallic: "Metalizado Industrial",
  };

  const getActiveVariantDescription = () => {
    const presetMatch = currentProduct.variantFilter.presets.find(
      (p) => p.value === variantValue
    );
    if (presetMatch) {
      return presetMatch.label;
    }
    return `${variantValue} ${currentProduct.variantFilter.unit}`;
  };

  const getDynamicViewerTitle = () => {
    if (currentProduct.modelType === "tolva") {
      return `Tolva T.${variantValue} (${variantValue} Ton.)`;
    }
    if (currentProduct.modelType === "jaula-ganadera") {
      return `Jaula Ganadera (${variantValue} Cabezas)`;
    }
    if (currentProduct.modelType === "rome-tijera") {
      return `Rastra Rome Tijera (${variantValue} Discos)`;
    }
    if (currentProduct.modelType === "cisterna") {
      return `Tanque Cisterna (${variantValue} Lts.)`;
    }
    return `${currentProduct.shortTitle.split("(")[0].trim()} (${variantValue} ${currentProduct.variantFilter.unit})`;
  };

  const buildOrderMessage = () => {
    const lines = [
      `Hola Industrias Kisser, les escribo desde el Configurador 3D de la web para cotizar el siguiente equipo:`,
      ``,
      `EQUIPO: ${currentProduct.name}`,
      `MEDIDA / CAPACIDAD ELEGIDA: ${getActiveVariantDescription()}`,
      ``,
      `COLORES SELECCIONADOS:`,
      `- ${currentProduct.partLabels.body}: ${getColorLabel(bodyColor)}`,
      `- ${currentProduct.partLabels.details}: ${getColorLabel(detailsColor)}`,
      `- ${currentProduct.partLabels.rims}: ${getColorLabel(rimsColor)}`,
      `- Terminación de pintura: ${finishNameMap[finishType]}`,
    ];

    if (clientName.trim()) {
      lines.push(``, `Nombre / Establecimiento: ${clientName.trim()}`);
    }
    if (clientLocation.trim()) {
      lines.push(`Localidad / Provincia: ${clientLocation.trim()}`);
    }
    if (clientNotes.trim()) {
      lines.push(`Observaciones: ${clientNotes.trim()}`);
    }

    lines.push(
      ``,
      `Quedo atento a disponibilidad, plazo de fabricación y presupuesto. Muchas gracias.`
    );
    return lines.join("\n");
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(buildOrderMessage());
    window.open(
      `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(buildOrderMessage());
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <section
      id="configurador"
      aria-labelledby="configurador-heading"
      className="py-12 md:py-20 border-b border-[#CEC9BC] scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado Principal Claro y Directo */}
        <div className="mb-8">
          <h2
            id="configurador-heading"
            className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.02em] text-[#181A18] leading-[1.04]"
          >
            Personalizá tu Máquina en 3 Pasos Simples
          </h2>
          <p className="mt-2.5 text-[#434642] text-base sm:text-lg max-w-[66ch] leading-relaxed">
            Elegí el equipo, tocá los botones grandes para cambiar el color del cuerpo, el chasis o las llantas y enviá tu pedido directo por WhatsApp a nuestra fábrica en Hasenkamp.
          </p>
        </div>

        {/* PASO 1: SELECCIONAR MÁQUINA */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-[-0.01em] text-[#181A18]">
              Paso 1: Elegí qué máquina querés ver
            </h3>
          </div>

          <div
            role="group"
            aria-label="Paso 1: Elegir máquina"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {PRODUCTS.map((prod) => {
              const isSelected = prod.id === currentProduct.id;
              return (
                <button
                  key={prod.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleProductChange(prod)}
                  className={`min-h-[84px] text-left p-3.5 rounded-xl border transition flex items-center gap-3.5 ${
                    isSelected
                      ? "bg-[#181A18] text-[#F3F1EA] border-[#181A18] ring-2 ring-[#146B38]"
                      : "bg-[#E7E4DA] hover:bg-[#DBD7C9] text-[#181A18] border-[#CEC9BC]"
                  }`}
                >
                  <img
                    src={prod.instagramPhoto}
                    alt={prod.shortTitle}
                    className="w-16 h-16 rounded-lg object-cover border border-[#CEC9BC] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-xl font-bold uppercase tracking-[-0.01em] leading-tight">
                      {prod.shortTitle}
                    </div>
                    <div
                      className={`mt-1 text-xs font-semibold ${
                        isSelected ? "text-[#DF9F14]" : "text-[#434642]"
                      }`}
                    >
                      {isSelected ? "✓ Máquina Seleccionada" : "Tocar para elegir"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* FILTRO DE CAPACIDAD / MEDIDA EN VIVO (Modifica el Modelo 3D y las Gráficas en tiempo real) */}
          <div className="mt-4 p-4 sm:p-5 rounded-xl bg-[#E7E4DA] border border-[#CEC9BC]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3.5">
              <div>
                <label
                  htmlFor="variant-range-slider"
                  className="block font-display text-xl sm:text-2xl font-extrabold uppercase tracking-[-0.01em] text-[#181A18]"
                >
                  {currentProduct.variantFilter.label}:{" "}
                  <span className="text-[#146B38] tabular-nums">
                    {variantValue} {currentProduct.variantFilter.unit}
                  </span>
                </label>
                <p className="text-xs sm:text-sm text-[#434642] mt-0.5">
                  Mové el control o tocá una medida rápida para ver cómo se adapta la estructura y las calcos del modelo 3D en vivo (mín.{" "}
                  <strong className="tabular-nums">
                    {currentProduct.variantFilter.min}{" "}
                    {currentProduct.variantFilter.unit}
                  </strong>{" "}
                  — máx.{" "}
                  <strong className="tabular-nums">
                    {currentProduct.variantFilter.max}{" "}
                    {currentProduct.variantFilter.unit}
                  </strong>
                  ).
                </p>
              </div>

              <div className="inline-flex items-center gap-2 self-start md:self-auto px-3 py-1.5 rounded-lg bg-[#181A18] text-[#F3F1EA] text-xs sm:text-sm font-bold tabular-nums shrink-0">
                <span className="text-[#DF9F14]">Configuración 3D:</span>
                <span>{getActiveVariantDescription()}</span>
              </div>
            </div>

            {/* Botones rápidos de medidas habituales */}
            <div
              role="group"
              aria-label={currentProduct.variantFilter.label}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-3.5"
            >
              {currentProduct.variantFilter.presets.map((preset) => {
                const isSelectedPreset = variantValue === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    aria-pressed={isSelectedPreset}
                    onClick={() => setVariantValue(preset.value)}
                    className={`min-h-[44px] px-3 py-2 rounded-lg border text-center transition flex items-center justify-center ${
                      isSelectedPreset
                        ? "bg-[#146B38] text-[#F3F1EA] border-[#146B38] ring-2 ring-[#181A18]"
                        : "bg-[#F3F1EA] hover:bg-white text-[#181A18] border-[#CEC9BC]"
                    }`}
                  >
                    <span className="text-sm font-extrabold tabular-nums leading-tight">
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Deslizador continuo con botones - / + para ajuste fino */}
            <div className="flex items-center gap-3 bg-[#F3F1EA] px-3.5 py-2.5 rounded-lg border border-[#CEC9BC]">
              <button
                type="button"
                aria-label={`Disminuir ${currentProduct.variantFilter.unit}`}
                onClick={() =>
                  setVariantValue((v) =>
                    Math.max(
                      currentProduct.variantFilter.min,
                      v - currentProduct.variantFilter.step
                    )
                  )
                }
                disabled={variantValue <= currentProduct.variantFilter.min}
                className="min-h-[38px] min-w-[38px] px-2.5 rounded-lg bg-[#E7E4DA] hover:bg-[#DBD7C9] disabled:opacity-40 border border-[#CEC9BC] font-mono text-base font-extrabold text-[#181A18] transition"
              >
                -
              </button>

              <div className="flex-1 flex flex-col gap-1">
                <input
                  id="variant-range-slider"
                  type="range"
                  min={currentProduct.variantFilter.min}
                  max={currentProduct.variantFilter.max}
                  step={currentProduct.variantFilter.step}
                  value={variantValue}
                  onChange={(e) => setVariantValue(Number(e.target.value))}
                  className="w-full accent-[#146B38] cursor-pointer h-2 rounded-lg"
                />
                <div className="flex justify-between text-[11px] font-bold text-[#434642] tabular-nums">
                  <span>
                    Mín: {currentProduct.variantFilter.min}{" "}
                    {currentProduct.variantFilter.unit}
                  </span>
                  <span className="text-[#181A18]">
                    Actual: {variantValue} {currentProduct.variantFilter.unit}
                  </span>
                  <span>
                    Máx: {currentProduct.variantFilter.max}{" "}
                    {currentProduct.variantFilter.unit}
                  </span>
                </div>
              </div>

              <button
                type="button"
                aria-label={`Aumentar ${currentProduct.variantFilter.unit}`}
                onClick={() =>
                  setVariantValue((v) =>
                    Math.min(
                      currentProduct.variantFilter.max,
                      v + currentProduct.variantFilter.step
                    )
                  )
                }
                disabled={variantValue >= currentProduct.variantFilter.max}
                className="min-h-[38px] min-w-[38px] px-2.5 rounded-lg bg-[#E7E4DA] hover:bg-[#DBD7C9] disabled:opacity-40 border border-[#CEC9BC] font-mono text-base font-extrabold text-[#181A18] transition"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL: VISOR 3D + PANEL DE PINTURA PASO A PASO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* COLUMNA IZQUIERDA (7 cols): VISOR 3D (Sin sticky en mobile para no superponerse sobre el Paso 2 ni el Paso 3) */}
          <div
            id="visor-3d-kisser"
            className="lg:col-span-7 relative scroll-mt-20 rounded-xl overflow-hidden border border-[#CEC9BC] bg-[#181A18]"
          >
            {/* Barra Superior del Visor con Botones Grandes y Claros */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-[#181A18] text-[#F3F1EA] border-b border-[#2E322E]">
              <div className="font-display text-lg sm:text-xl font-bold uppercase tracking-wide truncate tabular-nums">
                {getDynamicViewerTitle()}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  aria-pressed={showRealPhotoCompare}
                  onClick={() => setShowRealPhotoCompare(!showRealPhotoCompare)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold border transition ${
                    showRealPhotoCompare
                      ? "bg-[#DF9F14] text-[#181A18] border-[#DF9F14]"
                      : "bg-[#252825] border-[#454843] text-[#F3F1EA] hover:bg-[#323632]"
                  }`}
                >
                  {showRealPhotoCompare ? "Volver al 3D" : "Ver Foto Real"}
                </button>

                <button
                  type="button"
                  aria-pressed={autoRotate}
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold border transition ${
                    autoRotate
                      ? "bg-[#146B38] border-[#1E8E4C] text-[#F3F1EA]"
                      : "bg-[#252825] border-[#454843] text-[#F3F1EA] hover:bg-[#323632]"
                  }`}
                >
                  <RotateCw className="w-4 h-4" />
                  <span>{autoRotate ? "Girando" : "Girar"}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setLightingMode(
                      lightingMode === "workshop" ? "field" : "workshop"
                    )
                  }
                  className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-[#252825] border border-[#454843] text-[#F3F1EA] hover:bg-[#323632] transition"
                >
                  {lightingMode === "workshop" ? (
                    <>
                      <Warehouse className="w-4 h-4 text-[#DF9F14]" />
                      <span className="hidden sm:inline">Luz Galpón</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4 text-[#DF9F14]" />
                      <span className="hidden sm:inline">Luz Campo</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Escenario 3D Compacto en Mobile (260px) y Amplio en Desktop (520px) */}
            <div className="relative h-[250px] sm:h-[360px] lg:h-[520px] w-full bg-[#1C1E1C]">
              {showRealPhotoCompare ? (
                <div className="w-full h-full flex flex-col justify-between p-3 sm:p-4 bg-[#181A18]">
                  <div className="relative flex-1 overflow-hidden rounded-lg border border-[#3A3D39]">
                    <img
                      src={currentProduct.instagramPhoto}
                      alt={currentProduct.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 p-3 rounded-lg bg-[#181A18]/95 border border-[#454843] text-[#F3F1EA] flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs sm:text-sm text-[#E7E4DA] max-w-[54ch]">
                        <strong className="text-white">Foto Real Kisser:</strong>{" "}
                        {currentProduct.instagramPostCaption}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowRealPhotoCompare(false)}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#146B38] text-[#F3F1EA] text-xs sm:text-sm font-bold shrink-0"
                      >
                        Volver al Modelo 3D
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <SceneViewer
                  product={currentProduct}
                  bodyColor={bodyColor}
                  detailsColor={detailsColor}
                  rimsColor={rimsColor}
                  finishType={finishType}
                  activePart={activePart}
                  onSelectPart={(part) => setActivePart(part)}
                  autoRotate={autoRotate}
                  showHotspots={true}
                  explodeView={false}
                  lightingMode={lightingMode}
                  cameraView={cameraView}
                  customGlbUrl={null}
                  variantValue={variantValue}
                />
              )}
            </div>

            {/* Botones Grandes de Ángulo de Cámara (Muy fáciles de tocar con el pulgar en el celular) */}
            {!showRealPhotoCompare && (
              <div
                role="group"
                aria-label="Cambiar vista de la máquina"
                className="grid grid-cols-4 divide-x divide-[#2E322E] bg-[#181A18] border-t border-[#2E322E]"
              >
                {(
                  [
                    { id: "iso" as CameraPresetView, label: "Vista 3/4" },
                    { id: "front" as CameraPresetView, label: "De Frente" },
                    { id: "side" as CameraPresetView, label: "De Costado" },
                    { id: "rear" as CameraPresetView, label: "De Atrás" },
                  ] as const
                ).map((cam) => {
                  const isCurrentCam = cameraView === cam.id && !autoRotate;
                  return (
                    <button
                      key={cam.id}
                      type="button"
                      onClick={() => {
                        setAutoRotate(false);
                        setCameraView(cam.id);
                      }}
                      className={`min-h-[42px] py-2 text-xs sm:text-sm font-bold transition ${
                        isCurrentCam
                          ? "bg-[#146B38] text-[#F3F1EA]"
                          : "bg-[#181A18] text-[#E7E4DA] hover:bg-[#252825]"
                      }`}
                    >
                      {cam.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Resumen Visual Siempre Visible de los 3 Colores Actuales */}
            <div className="grid grid-cols-3 divide-x divide-[#CEC9BC] bg-[#E7E4DA] border-t border-[#CEC9BC] text-[#181A18]">
              <button
                type="button"
                onClick={() => setActivePart("body")}
                className={`p-2.5 sm:p-3 text-left transition ${
                  activePart === "body" ? "bg-[#F3F1EA] font-bold" : "opacity-85"
                }`}
              >
                <span className="block text-[11px] uppercase text-[#434642]">
                  1. Cuerpo
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-xs sm:text-sm font-bold truncate">
                  <span
                    className="w-4 h-4 rounded-sm border border-black/40 shrink-0"
                    style={{ backgroundColor: bodyColor }}
                  />
                  <span className="truncate">{getShortColorName(bodyColor)}</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActivePart("details")}
                className={`p-2.5 sm:p-3 text-left transition ${
                  activePart === "details"
                    ? "bg-[#F3F1EA] font-bold"
                    : "opacity-85"
                }`}
              >
                <span className="block text-[11px] uppercase text-[#434642]">
                  2. Detalles
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-xs sm:text-sm font-bold truncate">
                  <span
                    className="w-4 h-4 rounded-sm border border-black/40 shrink-0"
                    style={{ backgroundColor: detailsColor }}
                  />
                  <span className="truncate">
                    {getShortColorName(detailsColor)}
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActivePart("rims")}
                className={`p-2.5 sm:p-3 text-left transition ${
                  activePart === "rims" ? "bg-[#F3F1EA] font-bold" : "opacity-85"
                }`}
              >
                <span className="block text-[11px] uppercase text-[#434642]">
                  3. Llantas / Discos
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-xs sm:text-sm font-bold truncate">
                  <span
                    className="w-4 h-4 rounded-sm border border-black/40 shrink-0"
                    style={{ backgroundColor: rimsColor }}
                  />
                  <span className="truncate">{getShortColorName(rimsColor)}</span>
                </span>
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA (5 cols en Desktop, abarca las 2 filas): PASO 2 ELEGIR PARTE Y COLOR */}
          <div className="lg:col-span-5 lg:row-span-2 rounded-xl border border-[#CEC9BC] bg-[#F3F1EA] overflow-hidden">
            {/* Encabezado Paso 2 */}
            <div className="p-4 sm:p-5 bg-[#E7E4DA] border-b border-[#CEC9BC] flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-[-0.01em] text-[#181A18]">
                Paso 2: Elegí los Colores
              </h3>

              <div className="flex items-center gap-3">
                {colorHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={handleUndoColor}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#F3F1EA] border border-[#CEC9BC] inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#181A18] hover:bg-white transition"
                  >
                    <Undo2 className="w-4 h-4 text-[#146B38]" />
                    <span>Deshacer</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetToDefault}
                  className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#F3F1EA] border border-[#CEC9BC] inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#181A18] hover:bg-white transition"
                >
                  <RefreshCcw className="w-4 h-4 text-[#9E1B22]" />
                  <span>Color de Fábrica</span>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-6">
              {/* Opción Rápida: Combinaciones Listas en 1 Toque */}
              <div>
                <span className="block text-sm font-bold text-[#181A18] mb-2">
                  Combinaciones listas en 1 solo toque:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COLOR_PRESETS.slice(0, 4).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="min-h-[46px] px-3.5 py-2.5 rounded-lg bg-[#E7E4DA] hover:bg-[#DBD7C9] border border-[#CEC9BC] text-left flex items-center gap-3 transition"
                    >
                      <span className="flex items-center gap-1 shrink-0">
                        <span
                          className="w-5 h-5 rounded-sm border border-black/30"
                          style={{ backgroundColor: preset.body }}
                        />
                        <span
                          className="w-5 h-5 rounded-sm border border-black/30"
                          style={{ backgroundColor: preset.details }}
                        />
                        <span
                          className="w-5 h-5 rounded-sm border border-black/30"
                          style={{ backgroundColor: preset.rims }}
                        />
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-[#181A18] leading-tight">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selección de las 3 Zonas con Botones Grandes y Claros */}
              <div className="pt-4 border-t border-[#CEC9BC]">
                <span className="block text-sm font-bold text-[#181A18] mb-2.5">
                  ¿Qué parte de la máquina querés cambiar ahora?
                </span>

                <div
                  role="group"
                  aria-label="Seleccionar qué parte de la máquina pintar"
                  className="grid grid-cols-1 gap-2.5"
                >
                  {(
                    [
                      {
                        key: "body" as CustomizablePart,
                        stepNum: "A",
                        title: "Color General de la Máquina",
                        subtitle: currentProduct.partLabels.body,
                        color: bodyColor,
                      },
                      {
                        key: "details" as CustomizablePart,
                        stepNum: "B",
                        title: "Color de Detalles y Chasis",
                        subtitle: currentProduct.partLabels.details,
                        color: detailsColor,
                      },
                      {
                        key: "rims" as CustomizablePart,
                        stepNum: "C",
                        title: "Color de Llantas / Discos",
                        subtitle: currentProduct.partLabels.rims,
                        color: rimsColor,
                      },
                    ] as const
                  ).map((item) => {
                    const isActive = activePart === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setActivePart(item.key)}
                        className={`min-h-[60px] p-3.5 rounded-xl border text-left transition flex items-center justify-between gap-3 ${
                          isActive
                            ? "bg-[#181A18] text-[#F3F1EA] border-[#181A18] ring-2 ring-[#146B38]"
                            : "bg-[#E7E4DA] hover:bg-[#DBD7C9] text-[#181A18] border-[#CEC9BC]"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="w-8 h-8 rounded-lg border-2 border-white shadow-sm shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <div className="min-w-0">
                            <div className="text-sm sm:text-base font-extrabold leading-tight">
                              {item.stepNum}. {item.title}
                            </div>
                            <div
                              className={`text-xs mt-0.5 truncate ${
                                isActive ? "text-[#DF9F14] font-semibold" : "text-[#434642]"
                              }`}
                            >
                              Color actual: {getShortColorName(item.color)}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-bold shrink-0 ${
                            isActive
                              ? "bg-[#146B38] text-[#F3F1EA]"
                              : "bg-[#F3F1EA] text-[#181A18] border border-[#CEC9BC]"
                          }`}
                        >
                          {isActive ? "Pintando esta parte" : "Cambiar"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grilla de Colores con NOMBRE ESCRITO en cada botón (Ideal para +40/50/60) */}
              <div className="pt-4 border-t border-[#CEC9BC]">
                <div className="mb-3 p-3 rounded-lg bg-[#181A18] text-[#F3F1EA] flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-bold">
                    Tocá un color para:{" "}
                    <strong className="text-[#DF9F14] underline">
                      {getActivePartLabel()}
                    </strong>
                  </span>
                  <a
                    href="#visor-3d-kisser"
                    className="lg:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#146B38] text-[#F3F1EA] text-xs font-bold"
                  >
                    ↑ Ver en 3D
                  </a>
                </div>

                <div
                  role="group"
                  aria-label="Colores disponibles"
                  className="grid grid-cols-2 gap-2.5"
                >
                  {INDUSTRIAL_COLORS.map((colorObj) => {
                    const isCurrentColor =
                      getActivePartColor().toLowerCase() ===
                      colorObj.hex.toLowerCase();
                    return (
                      <button
                        key={colorObj.id}
                        type="button"
                        aria-pressed={isCurrentColor}
                        onClick={() => setActivePartColor(colorObj.hex)}
                        className={`min-h-[52px] p-2.5 rounded-xl border text-left transition flex items-center gap-3 ${
                          isCurrentColor
                            ? "bg-[#181A18] text-[#F3F1EA] border-[#181A18] ring-2 ring-[#146B38]"
                            : "bg-[#E7E4DA] hover:bg-[#DBD7C9] text-[#181A18] border-[#CEC9BC]"
                        }`}
                      >
                        <span
                          className="w-8 h-8 rounded-lg border border-black/30 shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: colorObj.hex }}
                        >
                          {isCurrentColor && (
                            <Check
                              className={`w-5 h-5 ${
                                colorObj.id === "blanco-guillotina" ||
                                colorObj.id === "crema-camion" ||
                                colorObj.id === "amarillo-kisser" ||
                                colorObj.id === "aluminio-galv"
                                  ? "text-[#181A18]"
                                  : "text-white"
                              }`}
                            />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="block text-xs sm:text-sm font-bold leading-tight truncate">
                            {colorObj.name.replace(" Kisser", "")}
                          </span>
                          <span
                            className={`block text-[11px] font-mono ${
                              isCurrentColor
                                ? "text-[#DF9F14] font-semibold"
                                : "text-[#5F635D]"
                            }`}
                          >
                            {isCurrentColor ? "✓ Elegido" : colorObj.code}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selector de Terminación y Color Libre */}
                <div className="mt-4 pt-4 border-t border-[#CEC9BC] grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="paint-finish-select"
                      className="block text-xs font-bold uppercase text-[#434642] mb-1.5"
                    >
                      Brillo de la Pintura
                    </label>
                    <select
                      id="paint-finish-select"
                      value={finishType}
                      onChange={(e) =>
                        setFinishType(
                          e.target.value as "gloss" | "satin" | "metallic"
                        )
                      }
                      className="min-h-[44px] w-full bg-[#E7E4DA] border border-[#CEC9BC] rounded-lg px-3 py-2 text-sm font-bold text-[#181A18]"
                    >
                      <option value="gloss">Brillante Poliuretánico</option>
                      <option value="satin">Satinado Semi-Mate</option>
                      <option value="metallic">Metalizado Industrial</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="custom-hex-picker"
                      className="block text-xs font-bold uppercase text-[#434642] mb-1.5"
                    >
                      Otro Color a Elección
                    </label>
                    <div className="min-h-[44px] flex items-center gap-2.5 bg-[#E7E4DA] border border-[#CEC9BC] rounded-lg px-3 py-1.5">
                      <input
                        id="custom-hex-picker"
                        type="color"
                        value={getActivePartColor()}
                        onChange={(e) => setActivePartColor(e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs sm:text-sm font-bold text-[#181A18]">
                        Tocar para abrir paleta
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PASO 3: SOLICITAR PRESUPUESTO POR WHATSAPP (Debajo de la card del modelo 3D en Desktop y sin superposición en Mobile) */}
          <div className="lg:col-span-7 rounded-xl border border-[#CEC9BC] bg-[#E7E4DA] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-[-0.01em] text-[#181A18]">
                Paso 3: Pedir Presupuesto con estos Colores
              </h3>
              <a
                href="#visor-3d-kisser"
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181A18] text-[#F3F1EA] text-xs font-bold"
              >
                ↑ Ver Modelo 3D
              </a>
            </div>
            <p className="text-sm text-[#434642] mb-4 max-w-[65ch]">
              Al tocar el botón verde se abre tu WhatsApp con el resumen de la máquina y los colores que elegiste para enviarlo a{" "}
              <strong className="text-[#181A18]">
                Industrias Kisser ({COMPANY_INFO.whatsappDisplay})
              </strong>
              .
            </p>

            {/* Resumen compacto de la configuración elegida (especialmente útil en celulares al bajar al Paso 3) */}
            <div className="mb-4 p-3.5 rounded-xl bg-[#F3F1EA] border border-[#CEC9BC] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="block text-[11px] font-bold uppercase text-[#434642]">
                  Equipo y Medida Configurada
                </span>
                <span className="font-display text-lg font-extrabold uppercase text-[#181A18] tabular-nums">
                  {getDynamicViewerTitle()}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E7E4DA] border border-[#CEC9BC] text-xs font-bold text-[#181A18]">
                  <span
                    className="w-3.5 h-3.5 rounded-sm border border-black/30 shrink-0"
                    style={{ backgroundColor: bodyColor }}
                  />
                  <span>{getShortColorName(bodyColor)}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E7E4DA] border border-[#CEC9BC] text-xs font-bold text-[#181A18]">
                  <span
                    className="w-3.5 h-3.5 rounded-sm border border-black/30 shrink-0"
                    style={{ backgroundColor: detailsColor }}
                  />
                  <span>{getShortColorName(detailsColor)}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E7E4DA] border border-[#CEC9BC] text-xs font-bold text-[#181A18]">
                  <span
                    className="w-3.5 h-3.5 rounded-sm border border-black/30 shrink-0"
                    style={{ backgroundColor: rimsColor }}
                  />
                  <span>{getShortColorName(rimsColor)}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label
                  htmlFor="client-name-input"
                  className="block text-xs font-bold text-[#181A18] mb-1"
                >
                  Tu Nombre o Establecimiento (opcional):
                </label>
                <input
                  id="client-name-input"
                  type="text"
                  placeholder="Ej: Juan Pérez / Estancia San José"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="min-h-[44px] w-full px-3.5 py-2.5 rounded-lg bg-[#F3F1EA] border border-[#CEC9BC] text-sm text-[#181A18] placeholder-[#5F635D]"
                />
              </div>

              <div>
                <label
                  htmlFor="client-location-input"
                  className="block text-xs font-bold text-[#181A18] mb-1"
                >
                  Tu Localidad (opcional):
                </label>
                <input
                  id="client-location-input"
                  type="text"
                  placeholder="Ej: Hasenkamp, Crespo, María Grande, Paraná..."
                  value={clientLocation}
                  onChange={(e) => setClientLocation(e.target.value)}
                  className="min-h-[44px] w-full px-3.5 py-2.5 rounded-lg bg-[#F3F1EA] border border-[#CEC9BC] text-sm text-[#181A18] placeholder-[#5F635D]"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="client-notes-input"
                  className="block text-xs font-bold text-[#181A18] mb-1"
                >
                  Algún detalle o consulta adicional (opcional):
                </label>
                <textarea
                  id="client-notes-input"
                  rows={2}
                  placeholder="Ej: Consultar precio en 2 ejes, plazo de entrega..."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F3F1EA] border border-[#CEC9BC] text-sm text-[#181A18] placeholder-[#5F635D] resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="min-h-[52px] flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-[#146B38] hover:bg-[#0F542B] text-[#F3F1EA] font-extrabold text-base transition"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enviar Pedido por WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopySummary}
                className="min-h-[52px] inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#F3F1EA] hover:bg-white border border-[#CEC9BC] text-[#181A18] font-bold text-sm transition"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-4 h-4 text-[#146B38]" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Resumen</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
