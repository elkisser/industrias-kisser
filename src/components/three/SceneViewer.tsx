"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Grid,
  Html,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  CustomizablePart,
  ProductItem,
} from "@/data/products";
import MachineryModels from "./MachineryModels";

export type CameraPresetView = "iso" | "front" | "side" | "rear";

interface SceneViewerProps {
  product: ProductItem;
  bodyColor: string;
  detailsColor: string;
  rimsColor: string;
  finishType: "gloss" | "satin" | "metallic";
  activePart: CustomizablePart;
  onSelectPart: (part: CustomizablePart) => void;
  autoRotate: boolean;
  showHotspots: boolean;
  explodeView: boolean;
  lightingMode: "workshop" | "field";
  cameraView: CameraPresetView;
  customGlbUrl: string | null;
  variantValue?: number;
  meshPartMapping?: Record<string, CustomizablePart | "original">;
  onMeshesDetected?: (meshes: string[]) => void;
}

function CameraController({
  cameraView,
  autoRotate,
}: {
  cameraView: CameraPresetView;
  autoRotate: boolean;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  useEffect(() => {
    const positions: Record<CameraPresetView, [number, number, number]> = {
      iso: [4.6, 2.55, 4.8],
      front: [6.2, 2.0, 0.0],
      side: [0.0, 1.95, 6.2],
      rear: [-6.0, 2.05, 0.0],
    };
    const [x, y, z] = positions[cameraView];
    camera.position.set(x, y, z);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 1.0, 0);
      controlsRef.current.update();
    }
  }, [cameraView, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      autoRotate={autoRotate}
      autoRotateSpeed={0.55}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI / 2 - 0.04}
      minDistance={2.8}
      maxDistance={10.5}
      enablePan={false}
    />
  );
}

export default function SceneViewer({
  product,
  bodyColor,
  detailsColor,
  rimsColor,
  activePart,
  onSelectPart,
  autoRotate,
  showHotspots,
  lightingMode,
  cameraView,
  customGlbUrl,
  variantValue,
}: SceneViewerProps) {
  const bgHex = lightingMode === "workshop" ? "#1C1E1C" : "#D9D6CC";

  return (
    <div className="relative w-full h-full select-none">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [4.6, 2.55, 4.8], fov: 36 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <color attach="background" args={[bgHex]} />
        <fog attach="fog" args={[bgHex, 14, 28]} />

        <ambientLight intensity={lightingMode === "workshop" ? 1.15 : 1.45} />
        <hemisphereLight
          color={lightingMode === "workshop" ? "#F3F1EA" : "#FFFFFF"}
          groundColor={lightingMode === "workshop" ? "#2A2D2A" : "#6B685E"}
          intensity={lightingMode === "workshop" ? 1.1 : 1.35}
        />
        <directionalLight
          position={[6, 11, 6]}
          intensity={lightingMode === "workshop" ? 2.6 : 3.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight
          position={[-6, 6, -5]}
          intensity={1.2}
          color={lightingMode === "workshop" ? "#DF9F14" : "#F3F1EA"}
        />
        <directionalLight position={[0, 7, -8]} intensity={0.95} color="#FFFFFF" />

        <Suspense
          fallback={
            <Html center>
              <div className="px-4 py-2.5 rounded-lg bg-[#181A18] border border-[#3A3D39] text-[#F3F1EA] text-sm font-bold whitespace-nowrap">
                Cargando máquina 3D...
              </div>
            </Html>
          }
        >
          <group position={[0, -0.1, 0]}>
            <MachineryModels
              modelType={product.modelType}
              colors={{
                body: bodyColor,
                details: detailsColor,
                rims: rimsColor,
              }}
              customGlbUrl={customGlbUrl}
              autoRotate={false}
              variantValue={variantValue}
            />

            {showHotspots && !customGlbUrl && (
              <>
                <Html position={[0, 2.25, 0]} center zIndexRange={[10, 0]}>
                  <button
                    type="button"
                    onClick={() => onSelectPart("body")}
                    className={`hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-sans text-[11px] font-medium tracking-[0.01em] leading-none transition shadow-sm backdrop-blur-sm border ${
                      activePart === "body"
                        ? "bg-[#146B38]/95 text-[#F3F1EA] border-[#F3F1EA]/80"
                        : "bg-[#181A18]/80 text-[#E7E4DA] border-white/20 hover:border-white/50 hover:bg-[#181A18]/95"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full ring-1 ring-white/70 shrink-0"
                      style={{ backgroundColor: bodyColor }}
                    />
                    <span className="whitespace-nowrap">
                      {product.partLabels.body.split(",")[0]}
                    </span>
                  </button>
                </Html>

                <Html position={[1.15, 1.25, 0.85]} center zIndexRange={[10, 0]}>
                  <button
                    type="button"
                    onClick={() => onSelectPart("details")}
                    className={`hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-sans text-[11px] font-medium tracking-[0.01em] leading-none transition shadow-sm backdrop-blur-sm border ${
                      activePart === "details"
                        ? "bg-[#146B38]/95 text-[#F3F1EA] border-[#F3F1EA]/80"
                        : "bg-[#181A18]/80 text-[#E7E4DA] border-white/20 hover:border-white/50 hover:bg-[#181A18]/95"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full ring-1 ring-white/70 shrink-0"
                      style={{ backgroundColor: detailsColor }}
                    />
                    <span className="whitespace-nowrap">
                      {product.modelType === "tolva" && variantValue
                        ? `Gráfica T.${variantValue}`
                        : product.partLabels.details.split(",")[0]}
                    </span>
                  </button>
                </Html>

                <Html position={[-1.05, 0.38, 0.98]} center zIndexRange={[10, 0]}>
                  <button
                    type="button"
                    onClick={() => onSelectPart("rims")}
                    className={`hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-sans text-[11px] font-medium tracking-[0.01em] leading-none transition shadow-sm backdrop-blur-sm border ${
                      activePart === "rims"
                        ? "bg-[#146B38]/95 text-[#F3F1EA] border-[#F3F1EA]/80"
                        : "bg-[#181A18]/80 text-[#E7E4DA] border-white/20 hover:border-white/50 hover:bg-[#181A18]/95"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full ring-1 ring-white/70 shrink-0"
                      style={{ backgroundColor: rimsColor }}
                    />
                    <span className="whitespace-nowrap">
                      {product.partLabels.rims.split("(")[0].trim()}
                    </span>
                  </button>
                </Html>
              </>
            )}

            <ContactShadows
              position={[0, 0.01, 0]}
              opacity={lightingMode === "workshop" ? 0.65 : 0.45}
              scale={12}
              blur={2.0}
              far={4.5}
            />

            <Grid
              position={[0, 0, 0]}
              args={[18, 18]}
              cellSize={0.5}
              cellThickness={0.5}
              cellColor={lightingMode === "workshop" ? "#2E322E" : "#B8B3A6"}
              sectionSize={2.5}
              sectionThickness={1.0}
              sectionColor={lightingMode === "workshop" ? "#484D48" : "#8C877A"}
              fadeDistance={15}
              fadeStrength={1.2}
              infiniteGrid
            />
          </group>
        </Suspense>

        <CameraController cameraView={cameraView} autoRotate={autoRotate} />
      </Canvas>
    </div>
  );
}
