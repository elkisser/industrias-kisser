'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CustomColors, MachineModelType } from '@/data/products';

interface MachineryModelProps {
  modelType: MachineModelType;
  colors: CustomColors;
  variantValue?: number;
  customGlbUrl?: string | null;
  autoRotate?: boolean;
  wireframe?: boolean;
}

type Vec3Tuple = [number, number, number];

const UP_AXIS = new THREE.Vector3(0, 1, 0);

/**
 * Conecta exactamente dos puntos 3D (from -> to) con un perfil prismático rectangular (viga, parante, lanza, costilla).
 * Garantiza matemáticamente cero piezas desconectadas o con ángulos invertidos.
 */
function SegmentBox({
  from,
  to,
  width = 0.06,
  depth = 0.06,
  material,
  castShadow = true,
  receiveShadow = false,
}: {
  from: Vec3Tuple;
  to: Vec3Tuple;
  width?: number;
  depth?: number;
  material: THREE.Material;
  castShadow?: boolean;
  receiveShadow?: boolean;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const diff = new THREE.Vector3().subVectors(b, a);
    const len = Math.max(diff.length(), 0.0001);
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(UP_AXIS, diff.clone().normalize());
    return {
      position: [mid.x, mid.y, mid.z] as Vec3Tuple,
      quaternion: quat,
      length: len,
    };
  }, [from[0], from[1], from[2], to[0], to[1], to[2]]);

  return (
    <mesh
      position={position}
      quaternion={quaternion}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      material={material}
    >
      <boxGeometry args={[width, length, depth]} />
    </mesh>
  );
}

/**
 * Viga prismática sin alabeo (roll = 0) entre dos puntos 3D (from -> to),
 * con soporte para estampar calcos ("INDUSTRIA ARGENTINA") exactamente coplanares
 * sobre una o ambas caras laterales de la viga sin ningún desfase angular ni espacial.
 */
function AlignedBeam3D({
  from,
  to,
  height = 0.09,
  thickness = 0.075,
  material,
  decalMaterial,
  decalSide,
  decalSize = [0.6, 0.09],
  decalOffsetX = 0,
  castShadow = true,
  receiveShadow = false,
}: {
  from: Vec3Tuple;
  to: Vec3Tuple;
  height?: number;
  thickness?: number;
  material: THREE.Material;
  decalMaterial?: THREE.Material;
  decalSide?: 1 | -1 | 'both';
  decalSize?: [number, number];
  decalOffsetX?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const diff = new THREE.Vector3().subVectors(b, a);
    const len = Math.max(diff.length(), 0.0001);
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);

    // Eje local X a lo largo de la viga; eje local Y vertical sin alabeo; eje local Z normal a las caras laterales
    const xAxis = diff.clone().normalize();
    const worldUp = Math.abs(xAxis.y) > 0.98 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0);
    const zAxis = new THREE.Vector3().crossVectors(xAxis, worldUp).normalize();
    const yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize();

    const rotMatrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
    const quat = new THREE.Quaternion().setFromRotationMatrix(rotMatrix);

    return {
      position: [mid.x, mid.y, mid.z] as Vec3Tuple,
      quaternion: quat,
      length: len,
    };
  }, [from[0], from[1], from[2], to[0], to[1], to[2]]);

  const sidesToRender: (1 | -1)[] =
    decalSide === 'both' ? [1, -1] : decalSide === 1 ? [1] : decalSide === -1 ? [-1] : [];

  return (
    <group position={position} quaternion={quaternion}>
      <mesh castShadow={castShadow} receiveShadow={receiveShadow} material={material}>
        <boxGeometry args={[length, height, thickness]} />
      </mesh>
      {decalMaterial &&
        sidesToRender.map((s) => (
          <mesh
            key={s}
            position={[decalOffsetX, 0, s * (thickness * 0.5 + 0.003)]}
            rotation={[0, s === 1 ? 0 : Math.PI, 0]}
            material={decalMaterial}
          >
            <planeGeometry args={decalSize} />
          </mesh>
        ))}
    </group>
  );
}

/**
 * Conecta exactamente dos puntos 3D (from -> to) con un cilindro / caño / eje / tubo sinfín.
 */
function SegmentCylinder({
  from,
  to,
  radiusTop = 0.03,
  radiusBottom = 0.03,
  segments = 16,
  material,
  castShadow = true,
  receiveShadow = false,
}: {
  from: Vec3Tuple;
  to: Vec3Tuple;
  radiusTop?: number;
  radiusBottom?: number;
  segments?: number;
  material: THREE.Material;
  castShadow?: boolean;
  receiveShadow?: boolean;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const diff = new THREE.Vector3().subVectors(b, a);
    const len = Math.max(diff.length(), 0.0001);
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(UP_AXIS, diff.clone().normalize());
    return {
      position: [mid.x, mid.y, mid.z] as Vec3Tuple,
      quaternion: quat,
      length: len,
    };
  }, [from[0], from[1], from[2], to[0], to[1], to[2]]);

  return (
    <mesh
      position={position}
      quaternion={quaternion}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      material={material}
    >
      <cylinderGeometry args={[radiusTop, radiusBottom, length, segments]} />
    </mesh>
  );
}

/**
 * Cilindro hidráulico de doble efecto (camisa + vástago cromado) conectado exactamente entre dos pernos 3D (from -> to).
 */
function HydraulicCylinder3D({
  from,
  to,
  barrelRatio = 0.58,
  barrelRadius = 0.044,
  rodRadius = 0.026,
  barrelMat,
  rodMat,
}: {
  from: Vec3Tuple;
  to: Vec3Tuple;
  barrelRatio?: number;
  barrelRadius?: number;
  rodRadius?: number;
  barrelMat: THREE.Material;
  rodMat: THREE.Material;
}) {
  const splitPoint: Vec3Tuple = [
    from[0] + (to[0] - from[0]) * barrelRatio,
    from[1] + (to[1] - from[1]) * barrelRatio,
    from[2] + (to[2] - from[2]) * barrelRatio,
  ];

  return (
    <group>
      <SegmentCylinder
        from={from}
        to={splitPoint}
        radiusTop={barrelRadius}
        radiusBottom={barrelRadius}
        segments={16}
        material={barrelMat}
      />
      <SegmentCylinder
        from={splitPoint}
        to={to}
        radiusTop={rodRadius}
        radiusBottom={rodRadius}
        segments={14}
        material={rodMat}
      />
    </group>
  );
}

/**
 * Tubo o manguera curva continua pasando exactamente por una lista de puntos 3D.
 */
function CurvedTube3D({
  points,
  radius = 0.018,
  tubularSegments = 24,
  radialSegments = 10,
  material,
  castShadow = false,
}: {
  points: Vec3Tuple[];
  radius?: number;
  tubularSegments?: number;
  radialSegments?: number;
  material: THREE.Material;
  castShadow?: boolean;
}) {
  const tubeGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
  }, [points, radius, tubularSegments, radialSegments]);

  return <mesh geometry={tubeGeo} material={material} castShadow={castShadow} />;
}

/**
 * Dibuja el engranaje oficial de Industrias Kisser en un contexto 2D de Canvas
 * con los dientes de engrane completos en los 360° alrededor de toda la circunferencia.
 */
function drawKisserGear2D(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;

  // Corona circular principal (anillo continuo perfecto de 360°)
  const ringOuter = outerR * 0.78;
  const ringInner = outerR * 0.5;
  ctx.beginPath();
  ctx.arc(cx, cy, ringOuter, 0, Math.PI * 2, false);
  ctx.arc(cx, cy, ringInner, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();

  // 12 dientes rectos industriales distribuidos uniformemente en los 360° completos
  const toothCount = 12;
  for (let i = 0; i < toothCount; i++) {
    const ang = (i / toothCount) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx + Math.cos(ang) * (outerR * 0.84), cy + Math.sin(ang) * (outerR * 0.84));
    ctx.rotate(ang);
    ctx.fillRect(-outerR * 0.16, -outerR * 0.105, outerR * 0.32, outerR * 0.21);
    ctx.restore();
  }
  ctx.restore();
}

/**
 * Mide y dibuja tipografía industrial condensada (escala horizontal controlada)
 * para no depender de fuentes instaladas en Windows y garantizar cero superposición.
 */
function measureCondensedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
  condenseX = 0.72
): number {
  ctx.save();
  ctx.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;
  const w = ctx.measureText(text).width * condenseX;
  ctx.restore();
  return w;
}

function drawCondensedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  color: string,
  condenseX = 0.72
): number {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  const rawW = ctx.measureText(text).width;
  ctx.translate(x, y);
  ctx.scale(condenseX, 1);
  ctx.fillText(text, 0, 0);
  ctx.restore();
  return rawW * condenseX;
}

const DECAL_TEXTURE_VERSION = 'v9-crisp-aligned-indarg';

/**
 * Genera texturas Canvas de alta definición con relación de aspecto 1:1 respecto al plano 3D
 * y espaciado dinámico medido con measureText para evitar cualquier superposición.
 */
function useCanvasDecals(colors: CustomColors, tolvaTons = 20, cisternaLiters = 5000) {
  return useMemo(() => {
    if (typeof document === 'undefined') {
      const empty = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
      return {
        kisserDetailMat: empty,
        kisserWhiteMat: empty,
        kisserDarkMat: empty,
        indArgDetailMat: empty,
        indArgWhiteMat: empty,
        indArgDarkMat: empty,
        tolvaBandLeftMat: empty,
        tolvaBandRightMat: empty,
        cisternaBandLeftMat: empty,
        cisternaBandRightMat: empty,
        escarapelaMat: empty,
      };
    }

    const makeLogoMat = (fg: string, underline = false) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const textW = measureCondensedText(ctx, 'KISSER', 176, 0.72);
      const gearR = 82;
      const gap = 28;
      const totalW = gearR * 2 + gap + textW;
      const startX = Math.max(40, (canvas.width - totalW) * 0.5);

      drawKisserGear2D(ctx, startX + gearR, 128, gearR, fg);
      drawCondensedText(ctx, 'KISSER', startX + gearR * 2 + gap, 134, 176, fg, 0.72);

      if (underline) {
        ctx.fillStyle = fg;
        ctx.fillRect(startX + gearR * 2 + gap, 206, textW, 16);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = 8;
      tex.needsUpdate = true;
      return new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.05,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      });
    };

    const makeTextMat = (text: string, fg: string, bgHex = '#146B38') => {
      // Relación 6.667:1 exacta respecto al plano 3D [0.60, 0.09] -> Canvas 1600 x 240 de alta nitidez
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 240;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Garantizar contraste de lectura si el color de detalle elegido es muy similar al color del cuerpo
      const fgCol = new THREE.Color(fg);
      const bgCol = new THREE.Color(bgHex);
      const fgLum = fgCol.r * 0.299 + fgCol.g * 0.587 + fgCol.b * 0.114;
      const bgLum = bgCol.r * 0.299 + bgCol.g * 0.587 + bgCol.b * 0.114;
      const colorDist =
        Math.abs(fgCol.r - bgCol.r) + Math.abs(fgCol.g - bgCol.g) + Math.abs(fgCol.b - bgCol.b);
      const effectiveFg =
        colorDist < 0.38 && Math.abs(fgLum - bgLum) < 0.2
          ? bgLum > 0.55
            ? '#181A18'
            : '#F5F7FA'
          : fg;

      const fontSize = 134;
      const condense = 0.82;
      const badgeR = 66;
      const gap = 34;
      const textW = measureCondensedText(ctx, text, fontSize, condense);
      const totalW = badgeR * 2 + gap + textW;
      const startX = Math.max(36, (canvas.width - totalW) * 0.5);
      const badgeCx = startX + badgeR;
      const badgeCy = 120;

      // Escarapela Argentina circular nítida a la izquierda del texto
      ctx.save();
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(badgeCx, badgeCy, badgeR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(badgeCx, badgeCy, badgeR * 0.64, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(badgeCx, badgeCy, badgeR * 0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Texto "INDUSTRIA ARGENTINA" bien proporcionado y centrado verticalmente
      drawCondensedText(
        ctx,
        text,
        startX + badgeR * 2 + gap,
        125,
        fontSize,
        effectiveFg,
        condense
      );

      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = 8;
      tex.needsUpdate = true;
      return new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.05,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      });
    };

    const leftTonLabel = `T.${tolvaTons}`;
    const rightTonLabel = `${tolvaTons}T.`;

    // Plano 3D en TolvaModel: relación de aspecto 7.718:1 -> Canvas 2470 x 320 para que el engranaje sea un círculo perfecto
    const makeTolvaBandMat = (fg: string, flipped: boolean) => {
      const canvas = document.createElement('canvas');
      canvas.width = 2470;
      canvas.height = 320;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = fg;
      ctx.strokeStyle = fg;

      const margin = 75;
      const gearR = 68;
      const gearGap = 24;
      const stripeGap = 115;

      if (!flipped) {
        // Lado izquierdo (-Z): "T.XX" adelante (izq) | 3 franjas curvas | "⚙ KISSER" atrás (der)
        const leftW = drawCondensedText(ctx, leftTonLabel, margin, 166, 172, fg, 0.74);
        const leftEnd = margin + leftW;

        const kisserW = measureCondensedText(ctx, 'KISSER', 164, 0.72);
        const kisserX = canvas.width - margin - kisserW;
        const gearCx = kisserX - gearGap - gearR;
        const rightStart = gearCx - gearR;

        drawKisserGear2D(ctx, gearCx, 162, gearR, fg);
        drawCondensedText(ctx, 'KISSER', kisserX, 168, 164, fg, 0.72);

        const s0 = leftEnd + stripeGap;
        const s1 = rightStart - stripeGap;
        [0, 34, 68].forEach((offsetY) => {
          ctx.beginPath();
          ctx.moveTo(s0 + offsetY * 1.1, 226);
          ctx.quadraticCurveTo(s0 + 95 + offsetY * 0.9, 104 + offsetY, s0 + 230, 104 + offsetY);
          ctx.lineTo(s1, 116 + offsetY);
          ctx.lineTo(s1, 138 + offsetY);
          ctx.lineTo(s0 + 230, 126 + offsetY);
          ctx.quadraticCurveTo(s0 + 115 + offsetY * 0.9, 126 + offsetY, s0 + 42 + offsetY * 1.1, 226);
          ctx.closePath();
          ctx.fill();
        });
      } else {
        // Lado derecho (+Z): "⚙ KISSER" atrás (izq) | 3 franjas curvas | "XXT." adelante (der)
        const gearCx = margin + gearR;
        drawKisserGear2D(ctx, gearCx, 162, gearR, fg);
        const kisserX = gearCx + gearR + gearGap;
        const kisserW = drawCondensedText(ctx, 'KISSER', kisserX, 168, 164, fg, 0.72);
        const leftEnd = kisserX + kisserW;

        const rightTextW = measureCondensedText(ctx, rightTonLabel, 172, 0.74);
        const rightStart = canvas.width - margin - rightTextW;
        drawCondensedText(ctx, rightTonLabel, rightStart, 166, 172, fg, 0.74);

        const s0 = leftEnd + stripeGap;
        const s1 = rightStart - stripeGap;
        [0, 34, 68].forEach((offsetY) => {
          ctx.beginPath();
          ctx.moveTo(s0, 116 + offsetY);
          ctx.lineTo(s1 - 230, 104 + offsetY);
          ctx.quadraticCurveTo(s1 - 95 - offsetY * 0.9, 104 + offsetY, s1 - offsetY * 1.1, 226);
          ctx.lineTo(s1 - 42 - offsetY * 1.1, 226);
          ctx.quadraticCurveTo(s1 - 115 - offsetY * 0.9, 126 + offsetY, s1 - 230, 126 + offsetY);
          ctx.lineTo(s0, 138 + offsetY);
          ctx.closePath();
          ctx.fill();
        });
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = 8;
      tex.needsUpdate = true;
      return new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.05,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      });
    };

    const litersLabel = `${cisternaLiters} Lts.`;

    // Plano 3D en CisternaModel: relación de aspecto 6.444:1 -> Canvas 2062 x 320 para que el engranaje sea un círculo perfecto
    const makeCisternaBandMat = (fg: string, flipped: boolean) => {
      const canvas = document.createElement('canvas');
      canvas.width = 2062;
      canvas.height = 320;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const c = new THREE.Color(fg);
      const isDarkDetail = c.r * 0.299 + c.g * 0.587 + c.b * 0.114 < 0.35;
      const mainColor = isDarkDetail ? '#F4F6F8' : fg;

      ctx.fillStyle = mainColor;
      ctx.strokeStyle = mainColor;

      const margin = 55;
      const gearR = 62;
      const gearGap = 20;
      const stripeGap = 76;

      if (!flipped) {
        // Lado izquierdo (-Z): "XXXX Lts." adelante (izq) | 4 franjas curvas | "⚙ KISSER" atrás (der)
        const leftW = drawCondensedText(ctx, litersLabel, margin, 166, 140, mainColor, 0.64);
        const leftEnd = margin + leftW;

        const kisserW = measureCondensedText(ctx, 'KISSER', 154, 0.68);
        const kisserX = canvas.width - margin - kisserW;
        const gearCx = kisserX - gearGap - gearR;
        const rightStart = gearCx - gearR;

        drawKisserGear2D(ctx, gearCx, 162, gearR, mainColor);
        drawCondensedText(ctx, 'KISSER', kisserX, 168, 154, mainColor, 0.68);

        const s0 = leftEnd + stripeGap;
        const s1 = rightStart - stripeGap;
        [0, 26, 52, 78].forEach((offsetY) => {
          ctx.beginPath();
          ctx.moveTo(s0, 114 + offsetY);
          ctx.lineTo(s1 - 190, 105 + offsetY);
          ctx.quadraticCurveTo(s1 - 75 - offsetY * 0.8, 105 + offsetY, s1 - offsetY * 0.9, 228);
          ctx.lineTo(s1 - 34 - offsetY * 0.9, 228);
          ctx.quadraticCurveTo(s1 - 95 - offsetY * 0.8, 121 + offsetY, s1 - 190, 121 + offsetY);
          ctx.lineTo(s0, 130 + offsetY);
          ctx.closePath();
          ctx.fill();
        });
      } else {
        // Lado derecho (+Z): "⚙ KISSER" atrás (izq) | 4 franjas curvas | "XXXX Lts." adelante (der)
        const gearCx = margin + gearR;
        drawKisserGear2D(ctx, gearCx, 162, gearR, mainColor);
        const kisserX = gearCx + gearR + gearGap;
        const kisserW = drawCondensedText(ctx, 'KISSER', kisserX, 168, 154, mainColor, 0.68);
        const leftEnd = kisserX + kisserW;

        const rightTextW = measureCondensedText(ctx, litersLabel, 140, 0.64);
        const rightStart = canvas.width - margin - rightTextW;
        drawCondensedText(ctx, litersLabel, rightStart, 166, 140, mainColor, 0.64);

        const s0 = leftEnd + stripeGap;
        const s1 = rightStart - stripeGap;
        [0, 26, 52, 78].forEach((offsetY) => {
          ctx.beginPath();
          ctx.moveTo(s0 + offsetY * 0.9, 228);
          ctx.quadraticCurveTo(s0 + 75 + offsetY * 0.8, 105 + offsetY, s0 + 190, 105 + offsetY);
          ctx.lineTo(s1, 114 + offsetY);
          ctx.lineTo(s1, 130 + offsetY);
          ctx.lineTo(s0 + 190, 121 + offsetY);
          ctx.quadraticCurveTo(s0 + 95 + offsetY * 0.8, 121 + offsetY, s0 + 34 + offsetY * 0.9, 228);
          ctx.closePath();
          ctx.fill();
        });
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = 8;
      tex.needsUpdate = true;
      return new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.05,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      });
    };

    const makeEscarapelaMat = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, 256, 256);

      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(128, 128, 116, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(128, 128, 76, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(128, 128, 38, 0, Math.PI * 2);
      ctx.fill();

      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.05,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      });
    };

    return {
      kisserDetailMat: makeLogoMat(colors.details, false),
      kisserWhiteMat: makeLogoMat('#F5F7FA', false),
      kisserDarkMat: makeLogoMat('#1B1E23', false),
      indArgDetailMat: makeTextMat('INDUSTRIA ARGENTINA', colors.details, colors.body),
      indArgWhiteMat: makeTextMat('INDUSTRIA ARGENTINA', '#F5F7FA', colors.body),
      indArgDarkMat: makeTextMat('INDUSTRIA ARGENTINA', '#1B1E23', colors.body),
      tolvaBandLeftMat: makeTolvaBandMat(colors.details, false),
      tolvaBandRightMat: makeTolvaBandMat(colors.details, true),
      cisternaBandLeftMat: makeCisternaBandMat(colors.details, false),
      cisternaBandRightMat: makeCisternaBandMat(colors.details, true),
      escarapelaMat: makeEscarapelaMat(),
    };
  }, [colors.body, colors.details, tolvaTons, cisternaLiters, DECAL_TEXTURE_VERSION]);
}

function useMachineryMaterials(colors: CustomColors, wireframe = false) {
  return useMemo(() => {
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.body),
      metalness: 0.36,
      roughness: 0.3,
      envMapIntensity: 1.3,
      side: THREE.DoubleSide,
      wireframe,
    });

    const detailMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.details),
      metalness: 0.32,
      roughness: 0.28,
      envMapIntensity: 1.2,
      side: THREE.DoubleSide,
      wireframe,
    });

    const rimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.rims),
      metalness: 0.42,
      roughness: 0.26,
      envMapIntensity: 1.35,
      wireframe,
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#181A1D'),
      metalness: 0.05,
      roughness: 0.88,
      wireframe,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E4E8EC'),
      metalness: 0.92,
      roughness: 0.1,
      envMapIntensity: 1.7,
      wireframe,
    });

    const darkSteelMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1E2228'),
      metalness: 0.58,
      roughness: 0.38,
      side: THREE.DoubleSide,
      wireframe,
    });

    const whitePaintMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F3F5F8'),
      metalness: 0.2,
      roughness: 0.32,
      wireframe,
    });

    const ptoYellowMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#EAB308'),
      metalness: 0.28,
      roughness: 0.34,
      wireframe,
    });

    return {
      bodyMat,
      detailMat,
      rimMat,
      tireMat,
      chromeMat,
      darkSteelMat,
      whitePaintMat,
      ptoYellowMat,
    };
  }, [colors.body, colors.details, colors.rims, wireframe]);
}

/**
 * Rueda agrícola / vial alineada con el eje Z (avanza en X).
 */
function AgriculturalWheel({
  position,
  radius = 0.36,
  width = 0.22,
  lugCount = 16,
  chevronTread = false,
  hubCapMat,
  materials,
}: {
  position: Vec3Tuple;
  radius?: number;
  width?: number;
  lugCount?: number;
  chevronTread?: boolean;
  hubCapMat?: THREE.Material;
  materials: ReturnType<typeof useMachineryMaterials>;
}) {
  const sideSign = position[2] >= 0 ? 1 : -1;

  return (
    <group position={position}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh castShadow receiveShadow material={materials.tireMat}>
          <cylinderGeometry args={[radius, radius, width * 0.88, 36]} />
        </mesh>

        <mesh
          position={[0, width * 0.36, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
          material={materials.tireMat}
        >
          <torusGeometry args={[radius * 0.84, width * 0.16, 16, 36]} />
        </mesh>
        <mesh
          position={[0, -width * 0.36, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
          material={materials.tireMat}
        >
          <torusGeometry args={[radius * 0.84, width * 0.16, 16, 36]} />
        </mesh>

        {Array.from({ length: lugCount }).map((_, i) => {
          const angle = (i * Math.PI * 2) / lugCount;
          if (chevronTread) {
            return (
              <group key={i} rotation={[0, -angle, 0]}>
                <mesh
                  position={[radius * 0.99, width * 0.18, 0]}
                  rotation={[0.38, 0, 0]}
                  material={materials.tireMat}
                >
                  <boxGeometry args={[radius * 0.075, width * 0.42, radius * 0.085]} />
                </mesh>
                <mesh
                  position={[radius * 0.99, -width * 0.18, 0]}
                  rotation={[-0.38, 0, 0]}
                  material={materials.tireMat}
                >
                  <boxGeometry args={[radius * 0.075, width * 0.42, radius * 0.085]} />
                </mesh>
              </group>
            );
          }
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * (radius * 0.985), 0, Math.sin(angle) * (radius * 0.985)]}
              rotation={[0, -angle, 0]}
              material={materials.tireMat}
            >
              <boxGeometry args={[radius * 0.05, width * 0.78, radius * 0.085]} />
            </mesh>
          );
        })}

        <mesh castShadow material={materials.rimMat}>
          <cylinderGeometry args={[radius * 0.62, radius * 0.62, width * 0.92, 32]} />
        </mesh>

        <mesh
          position={[0, sideSign * width * 0.44, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          material={materials.rimMat}
        >
          <torusGeometry args={[radius * 0.59, radius * 0.042, 14, 32]} />
        </mesh>

        <mesh position={[0, sideSign * width * 0.34, 0]} material={materials.rimMat}>
          <cylinderGeometry args={[radius * 0.5, radius * 0.38, width * 0.16, 24]} />
        </mesh>

        <mesh
          position={[0, sideSign * width * 0.45, 0]}
          material={hubCapMat || materials.darkSteelMat}
        >
          <cylinderGeometry args={[radius * 0.19, radius * 0.22, width * 0.16, 20]} />
        </mesh>

        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 8;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * (radius * 0.31),
                sideSign * width * 0.45,
                Math.sin(angle) * (radius * 0.31),
              ]}
              material={materials.chromeMat}
            >
              <cylinderGeometry args={[radius * 0.026, radius * 0.026, width * 0.08, 8]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/**
 * 1. CARRUAJE / JAULA GANADERA TÁNDEM (JG-400)
 * Reconstruida con precisión matemática punto-a-punto según PHOTO-2026-11-06-22-32-38_1.jpg y 22-33-01.jpg:
 * - Cada uno de los 9 parantes sube verticalmente por la pared (Z = ±0.94), dobla HACIA ADENTRO a 45° (Z = ±0.94 -> ±0.76)
 *   y se une en un arco continuo limpio (sin puntas salientes hacia afuera).
 * - Paneles laterales de chapa plegada con las 2 ranuras reales de ventilación y 4 caños redondos superiores.
 * - Pórtico trasero y puerta guillotina en BLANCO con travesaño superior porta-roldanas y grilla superior abierta.
 * - Lanza delantera en V con ambos brazos unidos exactamente en el ojal y tensor diagonal conectado al pecho.
 */
function JaulaGanaderaModel({
  materials,
  decals,
  headsCount = 8,
}: {
  materials: ReturnType<typeof useMachineryMaterials>;
  decals: ReturnType<typeof useCanvasDecals>;
  headsCount?: number;
}) {
  const wheelRadius = 0.35;
  const clampedHeads = Math.max(4, Math.min(12, Math.round(headsCount)));
  // Escala real del largo de la jaula según la cantidad de cabezas (4 cab -> halfLen 1.42; 8 cab -> 1.92; 12 cab -> 2.42)
  const halfLen = 1.42 + ((clampedHeads - 4) / 8) * 1.0;
  const fullLen = halfLen * 2;
  // Cantidad real de parantes/arcos según las cabezas (de 6 a 12 arcos)
  const stakeCount = Math.max(6, Math.min(12, clampedHeads + 1));
  const stakeX = useMemo(
    () =>
      Array.from({ length: stakeCount }, (_, i) => -halfLen + (i / (stakeCount - 1)) * fullLen),
    [stakeCount, halfLen, fullLen]
  );

  const panelHeights = [0.75, 0.91, 1.03, 1.15, 1.27, 1.48, 1.6, 1.71];
  const topRodHeights = [1.83, 1.94, 2.05, 2.16];
  const decalX = Math.min(halfLen - 0.56, Math.max(0.32, halfLen * 0.38));
  const drawbarTipX = halfLen + 1.4;
  const drawbarMidX = halfLen + 0.6;
  const tandemCenterX = -halfLen * 0.24;
  const rearAxleX = tandemCenterX - 0.42;
  const frontAxleX = tandemCenterX + 0.42;

  return (
    <group position={[0, 0, 0]}>
      {/* Chasis inferior y piso antideslizante */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, 0.67, side * 0.88]} castShadow material={materials.bodyMat}>
          <boxGeometry args={[fullLen + 0.08, 0.1, 0.08]} />
        </mesh>
      ))}
      <mesh position={[0, 0.71, 0]} castShadow receiveShadow material={materials.darkSteelMat}>
        <boxGeometry args={[fullLen + 0.04, 0.04, 1.84]} />
      </mesh>
      {/* Teleras transversales de piso */}
      {stakeX.map((tx, idx) => (
        <mesh key={`floor-cross-${idx}`} position={[tx, 0.68, 0]} material={materials.bodyMat}>
          <boxGeometry args={[0.06, 0.07, 1.84]} />
        </mesh>
      ))}

      {/* Paredes laterales de chapa plegada + 4 caños superiores + calco real "⚙ KISSER" */}
      {[-1, 1].map((side) => (
        <group key={`side-wall-${side}`}>
          {panelHeights.map((y, idx) => (
            <group key={`panel-${idx}`} position={[0, y, side * 0.915]}>
              <mesh castShadow receiveShadow material={materials.bodyMat}>
                <boxGeometry args={[fullLen + 0.02, 0.1, 0.026]} />
              </mesh>
              <mesh position={[0, 0, side * 0.015]} material={materials.bodyMat}>
                <boxGeometry args={[fullLen + 0.02, 0.022, 0.012]} />
              </mesh>
            </group>
          ))}

          {/* 4 caños redondos horizontales en la jaula superior aireada */}
          {topRodHeights.map((ry, rIdx) => (
            <SegmentCylinder
              key={`rod-${rIdx}`}
              from={[-halfLen, ry, side * 0.92]}
              to={[halfLen, ry, side * 0.92]}
              radiusTop={0.012}
              radiusBottom={0.012}
              segments={10}
              material={materials.bodyMat}
            />
          ))}

          {/* Calco real "⚙ KISSER" centrado en el paño delantero */}
          <mesh
            position={[decalX, 1.21, side * 0.942]}
            rotation={[0, side === 1 ? 0 : Math.PI, 0]}
            material={decals.kisserDetailMat}
          >
            <planeGeometry args={[0.76, 0.18]} />
          </mesh>
        </group>
      ))}

      {/* Parantes verticales con ochava a 45° HACIA ADENTRO (cantidad dinámica según cabezas) */}
      {stakeX.map((x, idx) => {
        const isRear = idx === 0;
        const archMat = isRear ? materials.whitePaintMat : materials.bodyMat;
        return (
          <group key={`arch-${idx}`}>
            {[-1, 1].map((side) => (
              <React.Fragment key={side}>
                <SegmentBox
                  from={[x, 0.66, side * 0.945]}
                  to={[x, 2.18, side * 0.945]}
                  width={0.046}
                  depth={0.046}
                  material={archMat}
                />
                <SegmentBox
                  from={[x, 2.18, side * 0.945]}
                  to={[x, 2.36, side * 0.76]}
                  width={0.044}
                  depth={0.044}
                  material={archMat}
                />
              </React.Fragment>
            ))}
            <SegmentBox
              from={[x, 2.36, -0.76]}
              to={[x, 2.36, 0.76]}
              width={0.042}
              depth={0.042}
              material={archMat}
            />
          </group>
        );
      })}

      {/* Pecho delantero (+X = halfLen) con escarapela y rueda de auxilio lateral */}
      <group position={[halfLen, 0, 0]}>
        {panelHeights.map((y, idx) => (
          <mesh key={idx} position={[0, y, 0]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[0.028, 0.1, 1.84]} />
          </mesh>
        ))}
        {topRodHeights.map((ry, rIdx) => (
          <SegmentCylinder
            key={rIdx}
            from={[0, ry, -0.92]}
            to={[0, ry, 0.92]}
            radiusTop={0.012}
            radiusBottom={0.012}
            segments={10}
            material={materials.bodyMat}
          />
        ))}
        {[-0.36, 0.36].map((z, idx) => (
          <SegmentBox
            key={idx}
            from={[0.02, 0.66, z]}
            to={[0.02, 2.36, z]}
            width={0.044}
            depth={0.044}
            material={materials.bodyMat}
          />
        ))}
        <mesh position={[0.036, 1.28, 0]} rotation={[0, Math.PI / 2, 0]} material={decals.escarapelaMat}>
          <planeGeometry args={[0.11, 0.11]} />
        </mesh>
        {/* Rueda de auxilio montada en el costado delantero derecho */}
        <group position={[0.15, 1.16, 0.72]} rotation={[0, Math.PI / 2, 0]}>
          <AgriculturalWheel position={[0, 0, 0]} radius={0.31} width={0.18} materials={materials} />
        </group>
      </group>

      {/* Pórtico trasero y Puerta Guillotina en BLANCO (-X = -halfLen) */}
      <group position={[-halfLen - 0.01, 0, 0]}>
        {[-1, 1].map((side) => (
          <group key={`rear-wing-${side}`}>
            {panelHeights.map((y, idx) => (
              <mesh key={idx} position={[0, y, side * 0.69]} castShadow material={materials.whitePaintMat}>
                <boxGeometry args={[0.026, 0.1, 0.44]} />
              </mesh>
            ))}
            {topRodHeights.map((ry, rIdx) => (
              <SegmentCylinder
                key={rIdx}
                from={[0, ry, side * 0.47]}
                to={[0, ry, side * 0.91]}
                radiusTop={0.011}
                radiusBottom={0.011}
                segments={8}
                material={materials.whitePaintMat}
              />
            ))}
          </group>
        ))}

        {[-0.46, 0.46].map((gz, idx) => (
          <SegmentBox
            key={idx}
            from={[-0.02, 0.66, gz]}
            to={[-0.02, 2.48, gz]}
            width={0.05}
            depth={0.05}
            material={materials.whitePaintMat}
          />
        ))}
        <SegmentBox
          from={[-0.02, 2.48, -0.52]}
          to={[-0.02, 2.48, 0.52]}
          width={0.05}
          depth={0.05}
          material={materials.whitePaintMat}
        />

        <mesh position={[-0.015, 1.24, 0]} castShadow material={materials.whitePaintMat}>
          <boxGeometry args={[0.028, 1.04, 0.88]} />
        </mesh>
        {[-0.28, 0, 0.28].map((bz, idx) => (
          <SegmentBox
            key={idx}
            from={[-0.015, 1.76, bz]}
            to={[-0.015, 2.28, bz]}
            width={0.026}
            depth={0.026}
            material={materials.whitePaintMat}
          />
        ))}
        {[1.9, 2.08, 2.26].map((by, idx) => (
          <SegmentBox
            key={idx}
            from={[-0.015, by, -0.44]}
            to={[-0.015, by, 0.44]}
            width={0.026}
            depth={0.026}
            material={materials.whitePaintMat}
          />
        ))}

        <mesh position={[-0.02, 0.5, 0]} castShadow material={materials.bodyMat}>
          <boxGeometry args={[0.04, 0.1, 1.76]} />
        </mesh>
      </group>

      {/* Guardabarros plano tipo banco sobre el tándem trasero */}
      {[-1, 1].map((side) => (
        <group key={`fender-${side}`} position={[tandemCenterX, 0.76, side * 1.03]}>
          <mesh castShadow material={materials.bodyMat}>
            <boxGeometry args={[1.64, 0.045, 0.24]} />
          </mesh>
          <mesh position={[0, -0.1, -side * 0.09]} material={materials.bodyMat}>
            <boxGeometry args={[1.6, 0.22, 0.025]} />
          </mesh>
        </group>
      ))}

      {/* Lanza delantera larga en V conectada exactamente en la punta + tensor diagonal */}
      {[-1, 1].map((side) => (
        <AlignedBeam3D
          key={`drawbar-${side}`}
          from={[halfLen, 0.65, side * 0.52]}
          to={[drawbarTipX, 0.56, 0]}
          height={0.095}
          thickness={0.072}
          material={materials.bodyMat}
          decalMaterial={decals.indArgDetailMat}
          decalSide={side as 1 | -1}
          decalSize={[0.6, 0.09]}
        />
      ))}
      <SegmentBox
        from={[drawbarMidX, 0.61, -0.28]}
        to={[drawbarMidX, 0.61, 0.28]}
        width={0.05}
        depth={0.05}
        material={materials.bodyMat}
      />
      <SegmentCylinder
        from={[drawbarMidX, 0.62, 0]}
        to={[halfLen, 1.04, 0]}
        radiusTop={0.024}
        radiusBottom={0.024}
        segments={12}
        material={materials.bodyMat}
      />
      <mesh position={[drawbarTipX + 0.06, 0.56, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.bodyMat}>
        <torusGeometry args={[0.065, 0.022, 12, 24]} />
      </mesh>

      {/* Sistema Tándem Balancín en el tercio trasero */}
      {[-1, 1].map((side) => (
        <group key={`tandem-susp-${side}`} position={[tandemCenterX, 0, side * 0.76]}>
          <mesh position={[0, 0.54, 0]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[0.22, 0.32, 0.09]} />
          </mesh>
          <mesh position={[0, 0.36, 0]} castShadow material={materials.darkSteelMat}>
            <boxGeometry args={[0.94, 0.09, 0.08]} />
          </mesh>
        </group>
      ))}
      <SegmentCylinder
        from={[rearAxleX, wheelRadius, -0.94]}
        to={[rearAxleX, wheelRadius, 0.94]}
        radiusTop={0.046}
        radiusBottom={0.046}
        material={materials.darkSteelMat}
      />
      <SegmentCylinder
        from={[frontAxleX, wheelRadius, -0.94]}
        to={[frontAxleX, wheelRadius, 0.94]}
        radiusTop={0.046}
        radiusBottom={0.046}
        material={materials.darkSteelMat}
      />

      <AgriculturalWheel
        position={[rearAxleX, wheelRadius, 0.96]}
        radius={wheelRadius}
        width={0.21}
        hubCapMat={materials.bodyMat}
        materials={materials}
      />
      <AgriculturalWheel
        position={[frontAxleX, wheelRadius, 0.96]}
        radius={wheelRadius}
        width={0.21}
        hubCapMat={materials.bodyMat}
        materials={materials}
      />
      <AgriculturalWheel
        position={[rearAxleX, wheelRadius, -0.96]}
        radius={wheelRadius}
        width={0.21}
        hubCapMat={materials.bodyMat}
        materials={materials}
      />
      <AgriculturalWheel
        position={[frontAxleX, wheelRadius, -0.96]}
        radius={wheelRadius}
        width={0.21}
        hubCapMat={materials.bodyMat}
        materials={materials}
      />
    </group>
  );
}

/**
 * 2. TOLVA AUTODESCARGABLE (6 a 30 TONELADAS — T.6 a T.30)
 */
function TolvaModel({
  materials,
  decals,
  toneladas = 20,
}: {
  materials: ReturnType<typeof useMachineryMaterials>;
  decals: ReturnType<typeof useCanvasDecals>;
  toneladas?: number;
}) {
  const clampedTons = Math.max(6, Math.min(30, Math.round(toneladas)));
  // Factor normalizado respecto a 20T: en 6T es -1.0, en 20T es 0.0, en 30T es +0.714
  const u = (clampedTons - 20) / 14;
  const mx1 = 1.85 + u * 0.42;
  const mx0 = -mx1;
  const bx0 = -1.12 - u * 0.25;
  const bx1 = 1.32 + u * 0.28;
  const ty = 2.54 + u * 0.12;
  const my = 1.98;
  const by = 1.08;
  const mz1 = 1.16;
  const mz0 = -1.16;
  const bz1 = 0.28;
  const bz0 = -0.28;

  const wheelRadius = 0.56;
  const tireWidth = 0.34 + Math.max(-0.06, u * 0.05);

  // Cantidad de costillas inclinadas y arcos portacarpa según el tonelaje (6T -> 2 costillas/3 arcos; 20T -> 3 costillas/5 arcos; 30T -> 4 costillas/6 arcos)
  const ribCount = clampedTons <= 10 ? 2 : clampedTons <= 22 ? 3 : 4;
  const ribXList = useMemo(
    () =>
      Array.from(
        { length: ribCount },
        (_, i) => bx0 + 0.35 + (i / Math.max(1, ribCount - 1)) * (bx1 - bx0 - 0.65)
      ),
    [ribCount, bx0, bx1]
  );

  const bowCount = clampedTons <= 10 ? 3 : clampedTons <= 16 ? 4 : clampedTons <= 22 ? 5 : 6;
  const bowXList = useMemo(
    () =>
      Array.from(
        { length: bowCount },
        (_, i) => mx0 + 0.42 + (i / Math.max(1, bowCount - 1)) * (mx1 - mx0 - 0.84)
      ),
    [bowCount, mx0, mx1]
  );

  const frontShift = mx1 - 1.85;
  const frontAxleX = 1.05 + frontShift * 0.65;
  const rearAxleX = -1.08 - frontShift * 0.65;
  const decalWidth = Math.min(mx1 * 2 - 0.14, 3.55 + u * 0.72);
  const decalHeight = decalWidth / (2470 / 320);

  // Geometría piramidal con pared exterior, pared interior y borde superior sólido
  const pyramidalHopperGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const t = 0.05;

    const vertices: number[] = [];
    const addQuad = (a: Vec3Tuple, b: Vec3Tuple, c: Vec3Tuple, d: Vec3Tuple) => {
      vertices.push(...a, ...b, ...c, ...a, ...c, ...d);
    };

    // Caras exteriores del cono piramidal
    addQuad([bx0, by, bz1], [bx1, by, bz1], [mx1, my, mz1], [mx0, my, mz1]);
    addQuad([bx1, by, bz0], [bx0, by, bz0], [mx0, my, mz0], [mx1, my, mz0]);
    addQuad([bx1, by, bz1], [bx1, by, bz0], [mx1, my, mz0], [mx1, my, mz1]);
    addQuad([bx0, by, bz0], [bx0, by, bz1], [mx0, my, mz1], [mx0, my, mz0]);
    addQuad([bx0, by, bz0], [bx1, by, bz0], [bx1, by, bz1], [bx0, by, bz1]);

    // Caras interiores del cono
    addQuad(
      [mx0 + t, my, mz1 - t],
      [mx1 - t, my, mz1 - t],
      [bx1 - t, by + t, bz1 - t],
      [bx0 + t, by + t, bz1 - t]
    );
    addQuad(
      [mx1 - t, my, mz0 + t],
      [mx0 + t, my, mz0 + t],
      [bx0 + t, by + t, bz0 + t],
      [bx1 - t, by + t, bz0 + t]
    );
    addQuad(
      [mx1 - t, my, mz1 - t],
      [mx1 - t, my, mz0 + t],
      [bx1 - t, by + t, bz0 + t],
      [bx1 - t, by + t, bz1 - t]
    );
    addQuad(
      [mx0 + t, my, mz0 + t],
      [mx0 + t, my, mz1 - t],
      [bx0 + t, by + t, bz1 - t],
      [bx0 + t, by + t, bz0 + t]
    );
    addQuad(
      [bx0 + t, by + t, bz1 - t],
      [bx1 - t, by + t, bz1 - t],
      [bx1 - t, by + t, bz0 + t],
      [bx0 + t, by + t, bz0 + t]
    );

    // Paredes exteriores de la bandeja superior
    addQuad([mx0, my, mz1], [mx1, my, mz1], [mx1, ty, mz1], [mx0, ty, mz1]);
    addQuad([mx1, my, mz0], [mx0, my, mz0], [mx0, ty, mz0], [mx1, ty, mz0]);
    addQuad([mx1, my, mz1], [mx1, my, mz0], [mx1, ty, mz0], [mx1, ty, mz1]);
    addQuad([mx0, my, mz0], [mx0, my, mz1], [mx0, ty, mz1], [mx0, ty, mz0]);

    // Paredes interiores de la bandeja superior
    addQuad([mx0 + t, ty, mz1 - t], [mx1 - t, ty, mz1 - t], [mx1 - t, my, mz1 - t], [mx0 + t, my, mz1 - t]);
    addQuad([mx1 - t, ty, mz0 + t], [mx0 + t, ty, mz0 + t], [mx0 + t, my, mz0 + t], [mx1 - t, my, mz0 + t]);
    addQuad([mx1 - t, ty, mz1 - t], [mx1 - t, ty, mz0 + t], [mx1 - t, my, mz0 + t], [mx1 - t, my, mz1 - t]);
    addQuad([mx0 + t, ty, mz0 + t], [mx0 + t, ty, mz1 - t], [mx0 + t, my, mz1 - t], [mx0 + t, my, mz0 + t]);

    // Labio superior perimetral en Y = ty
    addQuad([mx0, ty, mz1], [mx1, ty, mz1], [mx1 - t, ty, mz1 - t], [mx0 + t, ty, mz1 - t]);
    addQuad([mx1, ty, mz0], [mx0, ty, mz0], [mx0 + t, ty, mz0 + t], [mx1 - t, ty, mz0 + t]);
    addQuad([mx1, ty, mz1], [mx1, ty, mz0], [mx1 - t, ty, mz0 + t], [mx1 - t, ty, mz1 - t]);
    addQuad([mx0, ty, mz0], [mx0, ty, mz1], [mx0 + t, ty, mz1 - t], [mx0 + t, ty, mz0 + t]);

    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    return geo;
  }, [mx0, mx1, bx0, bx1, ty]);

  return (
    <group position={[0, 0, 0]}>
      {/* Cuerpo piramidal de doble pared + bandeja superior */}
      <mesh geometry={pyramidalHopperGeo} castShadow receiveShadow material={materials.bodyMat} />

      {/* 2 Tensores internos transversales limpios de pared a pared */}
      {[-mx1 * 0.3, mx1 * 0.3].map((tx, idx) => (
        <SegmentCylinder
          key={`inner-brace-${idx}`}
          from={[tx, 1.92, -1.11]}
          to={[tx, 1.92, 1.11]}
          radiusTop={0.022}
          radiusBottom={0.022}
          segments={12}
          material={materials.bodyMat}
        />
      ))}

      {/* Pliegues horizontales, costillas exteriores por lado y gráfica oficial Canvas */}
      {[-1, 1].map((side) => (
        <group key={`tolva-side-${side}`}>
          <mesh position={[0, 1.98, side * 1.175]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[mx1 * 2 + 0.04, 0.05, 0.04]} />
          </mesh>
          <mesh position={[0, ty - 0.05, side * 1.172]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[mx1 * 2 + 0.04, 0.08, 0.035]} />
          </mesh>

          {/* Costillas inclinadas anchas apoyadas exactamente sobre la cara exterior del cono */}
          {ribXList.map((rx, idx) => (
            <SegmentBox
              key={`rib-${idx}`}
              from={[rx + 0.06, 1.1, side * 0.31]}
              to={[rx - 0.06, 1.96, side * 1.18]}
              width={0.13}
              depth={0.055}
              material={materials.bodyMat}
            />
          ))}

          {/* Gráfica oficial dinámica "T.XX / XXT." + 3 franjas curvas + "⚙ KISSER" */}
          <mesh
            position={[0, (my + ty) * 0.5 - 0.02, side * 1.164]}
            rotation={[0, side === 1 ? 0 : Math.PI, 0]}
            material={side === -1 ? decals.tolvaBandLeftMat : decals.tolvaBandRightMat}
          >
            <planeGeometry args={[decalWidth, decalHeight]} />
          </mesh>
        </group>
      ))}

      {/* Arcos blancos portcarpa que cruzan de pared izquierda (Z=-1.14) a pared derecha (Z=+1.14) */}
      {bowXList.map((x, idx) => (
        <CurvedTube3D
          key={`bow-${idx}`}
          points={[
            [x, ty, -1.14],
            [x, ty + 0.15, 0],
            [x, ty, 1.14],
          ]}
          radius={0.018}
          tubularSegments={24}
          radialSegments={10}
          material={materials.whitePaintMat}
        />
      ))}

      {/* === TUBO SINFÍN DELANTERO EXTERIOR (+X, desplazado dinámicamente con el frente de la tolva) === */}
      <group position={[frontShift, 0, 0]}>
        <mesh position={[1.45, 0.96, -0.32]} castShadow material={materials.bodyMat}>
          <boxGeometry args={[0.42, 0.36, 0.44]} />
        </mesh>
        <mesh position={[1.7, 0.92, -0.18]} castShadow material={materials.ptoYellowMat}>
          <boxGeometry args={[0.18, 0.32, 0.16]} />
        </mesh>

        <SegmentCylinder
          from={[1.56, 1.0, -0.36]}
          to={[1.98, 2.34, -0.94]}
          radiusTop={0.165}
          radiusBottom={0.175}
          segments={24}
          material={materials.bodyMat}
        />

        <SegmentCylinder
          from={[1.95, 2.26, -0.9]}
          to={[2.01, 2.41, -0.97]}
          radiusTop={0.2}
          radiusBottom={0.18}
          segments={24}
          material={materials.bodyMat}
        />
        <SegmentCylinder
          from={[1.98, 2.34, -0.94]}
          to={[2.02, 2.42, -0.98]}
          radiusTop={0.155}
          radiusBottom={0.155}
          segments={20}
          material={materials.darkSteelMat}
        />

        <SegmentBox
          from={[1.96, 2.36, -0.92]}
          to={[2.04, 2.44, -0.78]}
          width={0.12}
          depth={0.12}
          material={materials.bodyMat}
        />

        <SegmentCylinder
          from={[2.04, 2.42, -0.76]}
          to={[2.02, 1.98, 0.92]}
          radiusTop={0.155}
          radiusBottom={0.165}
          segments={24}
          material={materials.bodyMat}
        />
        <SegmentCylinder
          from={[2.02, 1.98, 0.92]}
          to={[2.01, 1.92, 1.12]}
          radiusTop={0.19}
          radiusBottom={0.16}
          segments={24}
          material={materials.bodyMat}
        />
        <SegmentBox
          from={[1.85, 1.95, 0.92]}
          to={[2.04, 1.95, 0.92]}
          width={0.08}
          depth={0.08}
          material={materials.bodyMat}
        />
        <HydraulicCylinder3D
          from={[1.84, 1.88, -0.74]}
          to={[2.03, 2.32, -0.42]}
          barrelRatio={0.6}
          barrelRadius={0.032}
          rodRadius={0.018}
          barrelMat={materials.darkSteelMat}
          rodMat={materials.chromeMat}
        />
      </group>

      {/* === CHASIS INFERIOR CON LOGO "⚙ KISSER" ENTRE LAS RUEDAS === */}
      <mesh position={[0.1, 1.12, 0]} castShadow material={materials.bodyMat}>
        <boxGeometry args={[bx1 - bx0 + 0.1, 0.12, 1.68]} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={`tolva-chassis-${side}`}>
          <mesh position={[-0.02, 0.88, side * 0.76]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[frontAxleX - rearAxleX + 0.82, 0.15, 0.12]} />
          </mesh>
          <mesh
            position={[-0.02, 0.88, side * 0.824]}
            rotation={[0, side === 1 ? 0 : Math.PI, 0]}
            material={decals.kisserDetailMat}
          >
            <planeGeometry args={[0.52, 0.12]} />
          </mesh>
          <mesh position={[frontAxleX, 0.68, side * 0.62]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[0.26, 0.28, 0.12]} />
          </mesh>
          <mesh position={[rearAxleX, 0.72, side * 0.72]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[0.28, 0.34, 0.12]} />
          </mesh>
        </group>
      ))}

      {/* Avantrén delantero, ejes y lanza en V */}
      <mesh position={[frontAxleX, 0.78, 0]} material={materials.bodyMat}>
        <cylinderGeometry args={[0.5, 0.5, 0.08, 28]} />
      </mesh>
      <SegmentCylinder
        from={[frontAxleX, wheelRadius, -0.98]}
        to={[frontAxleX, wheelRadius, 0.98]}
        radiusTop={0.075}
        radiusBottom={0.075}
        material={materials.darkSteelMat}
      />
      <SegmentCylinder
        from={[rearAxleX, wheelRadius, -0.98]}
        to={[rearAxleX, wheelRadius, 0.98]}
        radiusTop={0.075}
        radiusBottom={0.075}
        material={materials.darkSteelMat}
      />

      {[-1, 1].map((side) => (
        <AlignedBeam3D
          key={`tolva-drawbar-${side}`}
          from={[frontAxleX + 0.33, 0.6, side * 0.46]}
          to={[frontAxleX + 1.77, 0.42, 0]}
          height={0.096}
          thickness={0.075}
          material={materials.bodyMat}
          decalMaterial={decals.indArgDetailMat}
          decalSide={side as 1 | -1}
          decalSize={[0.6, 0.09]}
        />
      ))}
      <SegmentBox
        from={[frontAxleX + 0.97, 0.52, -0.25]}
        to={[frontAxleX + 0.97, 0.52, 0.25]}
        width={0.055}
        depth={0.055}
        material={materials.bodyMat}
      />
      <mesh position={[frontAxleX + 1.83, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.bodyMat}>
        <torusGeometry args={[0.072, 0.024, 12, 24]} />
      </mesh>

      {/* 4 Neumáticos de alta flotación con taco tractor */}
      <AgriculturalWheel
        position={[frontAxleX, wheelRadius, 0.98]}
        radius={wheelRadius}
        width={tireWidth}
        lugCount={18}
        chevronTread
        hubCapMat={materials.bodyMat}
        materials={materials}
      />
      <AgriculturalWheel
        position={[frontAxleX, wheelRadius, -0.98]}
        radius={wheelRadius}
        width={tireWidth}
        lugCount={18}
        chevronTread
        hubCapMat={materials.bodyMat}
        materials={materials}
      />
      <AgriculturalWheel
        position={[rearAxleX, wheelRadius, 0.98]}
        radius={wheelRadius}
        width={tireWidth}
        lugCount={18}
        chevronTread
        hubCapMat={materials.bodyMat}
        materials={materials}
      />
      <AgriculturalWheel
        position={[rearAxleX, wheelRadius, -0.98]}
        radius={wheelRadius}
        width={tireWidth}
        lugCount={18}
        chevronTread
        hubCapMat={materials.bodyMat}
        materials={materials}
      />
    </group>
  );
}

/**
 * 3. PALA CARGADORA FRONTAL HIDRÁULICA (KP-1800)
 * Reconstruida punto-a-punto según PHOTO-2026-11-06-22-32-47_1.jpg y 22-32-54_2.jpg:
 * - Cero mangueras o vástagos desconectados: todos los cilindros hidráulicos usan HydraulicCylinder3D entre sus pernos reales.
 * - Cilindros inferiores de levante conectados desde la base de la columna [-1.18, 0.68] hasta el refuerzo del codo [-0.22, 1.2].
 * - Cilindros superiores de vuelco conectados desde el balancín del codo [0.04, 1.62] hasta la oreja superior del balde [1.28, 0.62].
 * - Cañerías hidráulicas adosadas al interior del brazo y costillas traseras del balde apoyadas contra la espalda del balde.
 */
function PalaFrontalModel({
  materials,
  decals,
  capacityKg = 1600,
}: {
  materials: ReturnType<typeof useMachineryMaterials>;
  decals: ReturnType<typeof useCanvasDecals>;
  capacityKg?: number;
}) {
  const clampedKg = Math.max(1000, Math.min(2200, capacityKg));
  const u = (clampedKg - 1600) / 600;
  // Ancho dinámico del balde trapezoidal según capacidad en kg (1000kg -> 1.66m; 1600kg -> 2.08m; 2200kg -> 2.50m)
  const bucketWidth = 2.08 + u * 0.42;
  const halfBucket = bucketWidth * 0.5 - 0.01;
  const ribPositions = useMemo(() => {
    const ribCount = clampedKg <= 1200 ? 2 : clampedKg <= 1800 ? 3 : 4;
    const span = bucketWidth - 0.6;
    return Array.from(
      { length: ribCount },
      (_, i) => -span * 0.5 + (i / Math.max(1, ribCount - 1)) * span
    );
  }, [clampedKg, bucketWidth]);

  const boomArmGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.25, 1.65);
    shape.lineTo(0.05, 1.56);
    shape.lineTo(1.34, 0.44);
    shape.lineTo(1.26, 0.33);
    shape.lineTo(0.02, 1.38);
    shape.lineTo(-0.22, 1.18);
    shape.lineTo(-0.55, 1.44);
    shape.lineTo(-1.25, 1.48);
    shape.closePath();

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.086,
      bevelEnabled: false,
    });
    geom.translate(0, 0, -0.043);
    geom.computeVertexNormals();
    return geom;
  }, []);

  const diagonalBucketSideGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.68, 0);
    shape.lineTo(0.28, 0.56);
    shape.lineTo(0.04, 0.62);
    shape.lineTo(0, 0.54);
    shape.closePath();

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.024,
      bevelEnabled: false,
    });
    geom.translate(0, 0, -0.012);
    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Subchasis transversal inferior */}
      <mesh position={[-1.25, 0.42, 0]} castShadow material={materials.darkSteelMat}>
        <boxGeometry args={[0.24, 0.14, 1.44]} />
      </mesh>

      {/* 2 Columnas traseras de anclaje */}
      {[-1, 1].map((side) => (
        <group key={`tower-${side}`} position={[-1.25, 0, side * 0.64]}>
          <mesh position={[0, 0.32, 0]} castShadow material={materials.darkSteelMat}>
            <boxGeometry args={[0.38, 0.36, 0.11]} />
          </mesh>
          <mesh position={[0, 1.05, 0]} castShadow receiveShadow material={materials.bodyMat}>
            <boxGeometry args={[0.24, 1.4, 0.15]} />
          </mesh>
          <mesh position={[0.04, 1.66, 0]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[0.28, 0.28, 0.17]} />
          </mesh>
          <mesh position={[0, 1.58, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.chromeMat}>
            <cylinderGeometry args={[0.038, 0.038, 0.2, 16]} />
          </mesh>
        </group>
      ))}

      {/* 2 Patas de apoyo verticales desmontables bajo el codo */}
      {[-1, 1].map((side) => (
        <group key={`stand-${side}`}>
          <SegmentBox
            from={[-0.22, 0.02, side * 0.54]}
            to={[-0.22, 1.24, side * 0.54]}
            width={0.055}
            depth={0.055}
            material={materials.bodyMat}
          />
          <mesh position={[-0.22, 0.015, side * 0.54]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[0.16, 0.03, 0.16]} />
          </mesh>
        </group>
      ))}

      {/* Brazos quebrados, paralelogramo y cilindros hidráulicos 100% conectados punto-a-punto */}
      {[-1, 1].map((side) => {
        const z = side * 0.64;
        return (
          <group key={`boom-${side}`}>
            <mesh
              position={[0, 0, z]}
              geometry={boomArmGeometry}
              castShadow
              receiveShadow
              material={materials.bodyMat}
            />

            <SegmentBox
              from={[-1.21, 1.75, z]}
              to={[0.04, 1.67, z]}
              width={0.05}
              depth={0.05}
              material={materials.bodyMat}
            />
            <SegmentBox
              from={[0.02, 1.38, z]}
              to={[0.05, 1.7, z]}
              width={0.065}
              depth={0.065}
              material={materials.bodyMat}
            />

            <mesh position={[0.03, 1.47, z]} rotation={[Math.PI / 2, 0, 0]} material={materials.darkSteelMat}>
              <cylinderGeometry args={[0.065, 0.065, 0.105, 20]} />
            </mesh>

            <group position={[-0.6, 1.54, z + side * 0.045]} rotation={[0, 0, -0.069]}>
              <mesh rotation={[0, side === 1 ? 0 : Math.PI, 0]} material={decals.kisserWhiteMat}>
                <planeGeometry args={[0.54, 0.13]} />
              </mesh>
            </group>

            <group position={[0.64, 0.955, z + side * 0.046]} rotation={[0, 0, -0.71]}>
              <mesh rotation={[0, side === 1 ? 0 : Math.PI, 0]} material={decals.indArgWhiteMat}>
                <planeGeometry args={[0.6, 0.09]} />
              </mesh>
            </group>

            <SegmentCylinder
              from={[-1.12, 1.5, z - side * 0.05]}
              to={[0.02, 1.42, z - side * 0.05]}
              radiusTop={0.011}
              radiusBottom={0.011}
              segments={8}
              material={materials.darkSteelMat}
            />
            <SegmentCylinder
              from={[0.02, 1.42, z - side * 0.05]}
              to={[0.85, 0.72, z - side * 0.05]}
              radiusTop={0.011}
              radiusBottom={0.011}
              segments={8}
              material={materials.darkSteelMat}
            />

            <HydraulicCylinder3D
              from={[-1.18, 0.68, z]}
              to={[-0.22, 1.2, z]}
              barrelRatio={0.58}
              barrelRadius={0.048}
              rodRadius={0.028}
              barrelMat={materials.darkSteelMat}
              rodMat={materials.chromeMat}
            />

            <HydraulicCylinder3D
              from={[0.05, 1.65, z]}
              to={[1.28, 0.6, z]}
              barrelRatio={0.56}
              barrelRadius={0.044}
              rodRadius={0.026}
              barrelMat={materials.darkSteelMat}
              rodMat={materials.chromeMat}
            />
          </group>
        );
      })}

      {/* Travesaño cilíndrico delantero entre ambos brazos */}
      <SegmentCylinder
        from={[0.78, 0.86, -0.64]}
        to={[0.78, 0.86, 0.64]}
        radiusTop={0.068}
        radiusBottom={0.068}
        segments={20}
        material={materials.bodyMat}
      />

      {/* Balde trapezoidal en cuña diagonal con ancho y costillas dinámicas según capacidad elegida */}
      <group position={[1.3, 0.05, 0]}>
        <mesh position={[0.34, 0.015, 0]} castShadow receiveShadow material={materials.detailMat}>
          <boxGeometry args={[0.68, 0.03, bucketWidth]} />
        </mesh>
        <mesh position={[0.71, 0.014, 0]} rotation={[0, 0, -0.12]} castShadow material={materials.chromeMat}>
          <boxGeometry args={[0.1, 0.022, bucketWidth + 0.02]} />
        </mesh>
        <mesh position={[0.02, 0.28, 0]} castShadow receiveShadow material={materials.detailMat}>
          <boxGeometry args={[0.03, 0.56, bucketWidth]} />
        </mesh>
        <mesh position={[0.15, 0.58, 0]} rotation={[0, 0, -0.25]} castShadow material={materials.detailMat}>
          <boxGeometry args={[0.26, 0.028, bucketWidth]} />
        </mesh>
        <mesh
          position={[0, 0, halfBucket]}
          geometry={diagonalBucketSideGeometry}
          castShadow
          receiveShadow
          material={materials.detailMat}
        />
        <mesh
          position={[0, 0, -halfBucket]}
          geometry={diagonalBucketSideGeometry}
          castShadow
          receiveShadow
          material={materials.detailMat}
        />
        {[-0.64, 0.64].map((bz, idx) => (
          <mesh key={`ear-${idx}`} position={[-0.03, 0.42, bz]} castShadow material={materials.detailMat}>
            <boxGeometry args={[0.1, 0.34, 0.09]} />
          </mesh>
        ))}
        {ribPositions.map((z, idx) => (
          <group key={idx} position={[0, 0, z]}>
            <mesh position={[0.005, 0.28, 0]} material={materials.rimMat}>
              <boxGeometry args={[0.035, 0.54, 0.036]} />
            </mesh>
            <mesh position={[0.32, 0.01, 0]} material={materials.rimMat}>
              <boxGeometry args={[0.64, 0.035, 0.036]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/**
 * 4. RASTRA DE TIRO EXCÉNTRICO ROME TIJERA (14 a 28 PLATOS DENTADOS)
 */
function RomeTijeraModel({
  materials,
  decals,
  totalDiscs = 18,
}: {
  materials: ReturnType<typeof useMachineryMaterials>;
  decals: ReturnType<typeof useCanvasDecals>;
  totalDiscs?: number;
}) {
  const clampedTotalDiscs = Math.max(14, Math.min(28, Math.round(totalDiscs / 2) * 2));
  const discCountPerGang = clampedTotalDiscs / 2; // de 7 a 14 discos por paquete
  const discSpacing = discCountPerGang <= 10 ? 0.25 : 0.215;
  const gangSpan = (discCountPerGang - 1) * discSpacing;
  const halfSpan = gangSpan * 0.5;
  const beamLength = gangSpan + 0.28;
  const axleHalfLen = halfSpan + 0.1;

  // 3 bancadas para 14-20 discos, 4 bancadas para 22-28 discos
  const bearingZList = useMemo(() => {
    const count = clampedTotalDiscs >= 22 ? 4 : 3;
    const bSpan = gangSpan * 0.76;
    return Array.from({ length: count }, (_, i) => -bSpan * 0.5 + (i / (count - 1)) * bSpan);
  }, [clampedTotalDiscs, gangSpan]);

  const scallopedDiscGeo = useMemo(() => {
    const outerR = 0.34;
    const notchCount = 10;
    const shape = new THREE.Shape();
    const totalSteps = notchCount * 16;

    for (let s = 0; s <= totalSteps; s++) {
      const t = (s / totalSteps) * Math.PI * 2;
      const sectorPhase = ((t * notchCount) / (Math.PI * 2)) % 1;
      let r = outerR;
      if (sectorPhase > 0.25 && sectorPhase < 0.75) {
        const u = (sectorPhase - 0.5) / 0.25;
        r = outerR - Math.sqrt(Math.max(0, 1 - u * u)) * 0.042;
      }
      const x = Math.cos(t) * r;
      const y = Math.sin(t) * r;
      if (s === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.016,
      bevelEnabled: true,
      bevelThickness: 0.004,
      bevelSize: 0.004,
      bevelSegments: 2,
    });
    geom.translate(0, 0, -0.008);
    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Dos cuerpos portadiscos en V / Tijera con cantidad real de discos según el filtro */}
      {[
        { x: 0.56, rotY: 0.14, isFront: true },
        { x: -0.62, rotY: -0.14, isFront: false },
      ].map((gang, gIdx) => (
        <group key={`gang-${gIdx}`} position={[gang.x, 0, 0]} rotation={[0, gang.rotY, 0]}>
          {/* Viga tubular superior portadiscos */}
          <mesh position={[0, 0.76, 0]} castShadow receiveShadow material={materials.bodyMat}>
            <boxGeometry args={[0.16, 0.14, beamLength]} />
          </mesh>

          {/* Calco "⚙ KISSER" en el extremo derecho de la viga delantera */}
          {gang.isFront && (
            <mesh
              position={[0.083, 0.76, -Math.min(halfSpan - 0.22, 0.78)]}
              rotation={[0, Math.PI / 2, 0]}
              material={decals.kisserDetailMat}
            >
              <planeGeometry args={[0.56, 0.13]} />
            </mesh>
          )}

          {/* Bancadas con soportes en diagonal desde la viga hasta el eje */}
          {bearingZList.map((bz, bIdx) => (
            <group key={`bearing-${bIdx}`} position={[0, 0, bz]}>
              <SegmentBox
                from={[0, 0.74, 0]}
                to={[gang.isFront ? -0.1 : 0.1, 0.36, 0]}
                width={0.08}
                depth={0.08}
                material={materials.bodyMat}
              />
              <mesh position={[gang.isFront ? -0.1 : 0.1, 0.34, 0]} castShadow material={materials.rimMat}>
                <boxGeometry args={[0.15, 0.15, 0.13]} />
              </mesh>
            </group>
          ))}

          {/* Limpiadores individuales que bajan en diagonal hacia cada disco */}
          {Array.from({ length: discCountPerGang }).map((_, i) => {
            const zPos = -halfSpan + i * discSpacing;
            return (
              <SegmentBox
                key={`scraper-${i}`}
                from={[0, 0.72, zPos + 0.06]}
                to={[gang.isFront ? -0.12 : 0.12, 0.38, zPos + 0.02]}
                width={0.04}
                depth={0.025}
                material={materials.bodyMat}
              />
            );
          })}

          {/* Paquete dinámico de N/2 discos dentados cóncavos de 26" */}
          <group position={[gang.isFront ? -0.1 : 0.1, 0.34, 0]}>
            <SegmentCylinder
              from={[0, 0, -axleHalfLen]}
              to={[0, 0, axleHalfLen]}
              radiusTop={0.04}
              radiusBottom={0.04}
              material={materials.darkSteelMat}
            />
            {[-axleHalfLen + 0.02, axleHalfLen - 0.02].map((endZ, eIdx) => (
              <mesh
                key={eIdx}
                position={[0, 0, endZ]}
                rotation={[Math.PI / 2, 0, 0]}
                material={materials.darkSteelMat}
              >
                <cylinderGeometry args={[0.068, 0.068, 0.06, 6]} />
              </mesh>
            ))}

            {Array.from({ length: discCountPerGang }).map((_, i) => {
              const zPos = -halfSpan + i * discSpacing;
              return (
                <group key={`disc-${i}`} position={[0, 0, zPos]}>
                  <mesh geometry={scallopedDiscGeo} castShadow receiveShadow material={materials.darkSteelMat} />
                  <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.darkSteelMat}>
                    <cylinderGeometry args={[0.16, 0.11, 0.036, 24]} />
                  </mesh>
                  {i < discCountPerGang - 1 && (
                    <mesh
                      position={[0, 0, discSpacing * 0.5]}
                      rotation={[Math.PI / 2, 0, 0]}
                      castShadow
                      material={materials.rimMat}
                    >
                      <cylinderGeometry args={[0.074, 0.074, discSpacing - 0.03, 20]} />
                    </mesh>
                  )}
                </group>
              );
            })}
          </group>
        </group>
      ))}

      {/* Viga lateral izquierda (+Z) con calco "⚙ KISSER" limpio */}
      <group position={[-0.03, 0.76, halfSpan - 0.06]} rotation={[0, -0.1, 0]}>
        <mesh castShadow material={materials.bodyMat}>
          <boxGeometry args={[1.38, 0.14, 0.14]} />
        </mesh>
        <mesh position={[0, 0, 0.073]} material={decals.kisserDetailMat}>
          <planeGeometry args={[0.58, 0.13]} />
        </mesh>
      </group>

      {/* Bisagra articulada tipo Tijera en el extremo derecho (-Z) */}
      <group position={[-0.03, 0.78, -halfSpan + 0.02]}>
        <SegmentBox
          from={[0.56, 0, 0]}
          to={[-0.56, 0, 0]}
          width={0.14}
          depth={0.14}
          material={materials.bodyMat}
        />
        <mesh position={[0, 0.06, -0.08]} castShadow material={materials.bodyMat}>
          <cylinderGeometry args={[0.09, 0.09, 0.28, 20]} />
        </mesh>
        <mesh
          position={[0, 0, -0.073]}
          rotation={[0, Math.PI, 0]}
          material={decals.kisserDetailMat}
        >
          <planeGeometry args={[0.58, 0.13]} />
        </mesh>
      </group>

      {/* Cilindro hidráulico de apertura/cierre de tijera alojado DENTRO del marco entre ambas vigas */}
      <SegmentBox
        from={[0.52, 0.76, 0.22]}
        to={[0.42, 0.94, 0.22]}
        width={0.09}
        depth={0.09}
        material={materials.bodyMat}
      />
      <SegmentBox
        from={[-0.58, 0.76, 0.22]}
        to={[-0.48, 0.92, 0.22]}
        width={0.09}
        depth={0.09}
        material={materials.bodyMat}
      />
      <HydraulicCylinder3D
        from={[0.42, 0.9, 0.22]}
        to={[-0.48, 0.9, 0.22]}
        barrelRatio={0.55}
        barrelRadius={0.044}
        rodRadius={0.026}
        barrelMat={materials.bodyMat}
        rodMat={materials.chromeMat}
      />

      {/* === ENGANCHE Y LANZA DELANTERA === */}
      <SegmentBox
        from={[0.58, 0.8, 0.56]}
        to={[1.14, 0.5, 0.16]}
        width={0.09}
        depth={0.09}
        material={materials.bodyMat}
      />
      <SegmentBox
        from={[0.58, 0.8, -0.12]}
        to={[1.14, 0.5, -0.16]}
        width={0.09}
        depth={0.09}
        material={materials.bodyMat}
      />
      <SegmentBox
        from={[1.14, 0.5, -0.24]}
        to={[1.14, 0.5, 0.24]}
        width={0.12}
        depth={0.12}
        material={materials.bodyMat}
      />
      <SegmentBox
        from={[0.58, 0.78, 0.22]}
        to={[0.52, 1.02, 0.22]}
        width={0.1}
        depth={0.08}
        material={materials.bodyMat}
      />
      <SegmentCylinder
        from={[0.52, 1.0, 0.22]}
        to={[1.42, 0.52, 0.04]}
        radiusTop={0.02}
        radiusBottom={0.02}
        material={materials.bodyMat}
      />

      <AlignedBeam3D
        from={[1.12, 0.5, 0]}
        to={[2.88, 0.38, 0]}
        height={0.11}
        thickness={0.092}
        material={materials.bodyMat}
        decalMaterial={decals.indArgDetailMat}
        decalSide="both"
        decalSize={[0.66, 0.1]}
        decalOffsetX={-0.02}
      />

      <mesh position={[2.9, 0.41, 0]} castShadow material={materials.bodyMat}>
        <boxGeometry args={[0.16, 0.035, 0.13]} />
      </mesh>
      <mesh position={[2.9, 0.34, 0]} castShadow material={materials.bodyMat}>
        <boxGeometry args={[0.16, 0.035, 0.13]} />
      </mesh>
      <mesh position={[2.93, 0.38, 0]} castShadow material={materials.chromeMat}>
        <cylinderGeometry args={[0.02, 0.02, 0.14, 12]} />
      </mesh>
      <mesh position={[2.98, 0.375, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.rimMat}>
        <torusGeometry args={[0.065, 0.022, 12, 24]} />
      </mesh>

      <SegmentCylinder
        from={[1.82, 0.46, 0]}
        to={[1.82, 0.88, 0]}
        radiusTop={0.016}
        radiusBottom={0.016}
        material={materials.bodyMat}
      />
      <mesh position={[1.82, 0.96, 0.015]} rotation={[0, 0.12, 0]} material={materials.darkSteelMat}>
        <torusGeometry args={[0.22, 0.014, 10, 28]} />
      </mesh>
      <mesh position={[1.84, 0.98, -0.015]} rotation={[0, -0.1, 0]} material={materials.darkSteelMat}>
        <torusGeometry args={[0.2, 0.013, 10, 28]} />
      </mesh>
      <CurvedTube3D
        points={[
          [0.38, 0.92, 0.22],
          [1.1, 0.78, 0.12],
          [1.82, 0.88, 0.02],
        ]}
        radius={0.011}
        material={materials.darkSteelMat}
      />
    </group>
  );
}

/**
 * 5. ACOPLADO VOLCADOR HIDRÁULICO BILATERAL (4 a 14 TONELADAS)
 */
function VolcadorModel({
  materials,
  decals,
  toneladas = 8,
}: {
  materials: ReturnType<typeof useMachineryMaterials>;
  decals: ReturnType<typeof useCanvasDecals>;
  toneladas?: number;
}) {
  const wheelRadius = 0.36;
  const clampedTons = Math.max(4, Math.min(14, toneladas));
  const u = (clampedTons - 8) / 6;
  const boxLen = 3.24 + u * 0.64;
  const halfBox = boxLen * 0.5 - 0.02;
  const sideH = 0.68 + u * 0.14;
  const frontAxleX = 1.05 + u * 0.24;
  const rearAxleX = -1.08 - u * 0.24;

  const teleraXList = useMemo(() => {
    const count = clampedTons <= 6 ? 5 : clampedTons <= 10 ? 7 : 9;
    const span = boxLen - 0.14;
    return Array.from({ length: count }, (_, i) => -span * 0.5 + (i / (count - 1)) * span);
  }, [clampedTons, boxLen]);

  const sidePostXList = useMemo(() => {
    const count = clampedTons <= 6 ? 3 : clampedTons <= 10 ? 4 : 5;
    const span = boxLen - 0.04;
    return Array.from({ length: count }, (_, i) => -span * 0.5 + (i / (count - 1)) * span);
  }, [clampedTons, boxLen]);

  return (
    <group position={[0, 0, 0]}>
      {/* Bastidor inferior y sobre-chasis elevado */}
      {[-1, 1].map((side) => (
        <group key={`volc-chassis-${side}`}>
          <mesh position={[0, 0.78, side * 0.56]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[boxLen - 0.09, 0.13, 0.09]} />
          </mesh>
          <mesh
            position={[-0.1, 0.78, side * 0.608]}
            rotation={[0, side === 1 ? 0 : Math.PI, 0]}
            material={decals.kisserDetailMat}
          >
            <planeGeometry args={[0.48, 0.11]} />
          </mesh>

          <mesh position={[frontAxleX, 0.54, side * 0.52]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[0.92, 0.09, 0.08]} />
          </mesh>
          <mesh position={[frontAxleX + 0.4, 0.66, side * 0.54]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[0.09, 0.24, 0.09]} />
          </mesh>
          <mesh position={[frontAxleX - 0.4, 0.66, side * 0.54]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[0.09, 0.24, 0.09]} />
          </mesh>

          <mesh position={[frontAxleX, 0.44, side * 0.54]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[0.58, 0.14, 0.08]} />
          </mesh>
          <mesh position={[rearAxleX, 0.54, side * 0.54]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[0.64, 0.34, 0.09]} />
          </mesh>
        </group>
      ))}

      {[-halfBox + 0.12, -halfBox * 0.48, 0, halfBox * 0.48, halfBox - 0.12].map((x, idx) => (
        <mesh key={idx} position={[x, 0.78, 0]} castShadow material={materials.bodyMat}>
          <boxGeometry args={[0.1, 0.11, 1.2]} />
        </mesh>
      ))}
      <mesh position={[0, 0.52, 0]} castShadow material={materials.bodyMat}>
        <boxGeometry args={[0.18, 0.1, 1.12]} />
      </mesh>
      <mesh position={[-halfBox + 0.04, 0.52, 0]} castShadow material={materials.bodyMat}>
        <boxGeometry args={[0.06, 0.1, 1.65]} />
      </mesh>

      {/* Avantrén delantero, ejes y lanza en V */}
      <mesh position={[frontAxleX, 0.6, 0]} material={materials.bodyMat}>
        <cylinderGeometry args={[0.48, 0.48, 0.07, 24]} />
      </mesh>
      <SegmentCylinder
        from={[frontAxleX, wheelRadius, -0.86]}
        to={[frontAxleX, wheelRadius, 0.86]}
        radiusTop={0.048}
        radiusBottom={0.048}
        material={materials.darkSteelMat}
      />
      <SegmentCylinder
        from={[rearAxleX, wheelRadius, -0.86]}
        to={[rearAxleX, wheelRadius, 0.86]}
        radiusTop={0.048}
        radiusBottom={0.048}
        material={materials.darkSteelMat}
      />

      {[-1, 1].map((side) => (
        <AlignedBeam3D
          key={`volc-drawbar-${side}`}
          from={[frontAxleX + 0.37, 0.52, side * 0.44]}
          to={[frontAxleX + 1.73, 0.36, 0]}
          height={0.092}
          thickness={0.07}
          material={materials.bodyMat}
          decalMaterial={decals.indArgDetailMat}
          decalSide={side as 1 | -1}
          decalSize={[0.6, 0.09]}
        />
      ))}
      <mesh position={[frontAxleX + 1.79, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.bodyMat}>
        <torusGeometry args={[0.065, 0.02, 12, 24]} />
      </mesh>

      {/* Cilindro hidráulico telescópico de 3 etapas que termina DEBAJO del piso en [0, 1.07, -0.06] */}
      <SegmentCylinder
        from={[0, 0.52, 0.16]}
        to={[0, 0.74, 0.07]}
        radiusTop={0.08}
        radiusBottom={0.085}
        material={materials.bodyMat}
      />
      <SegmentCylinder
        from={[0, 0.74, 0.07]}
        to={[0, 0.92, 0.0]}
        radiusTop={0.056}
        radiusBottom={0.056}
        material={materials.chromeMat}
      />
      <SegmentCylinder
        from={[0, 0.92, 0.0]}
        to={[0, 1.07, -0.06]}
        radiusTop={0.038}
        radiusBottom={0.038}
        material={materials.chromeMat}
      />

      {/* Caja volcadora con vuelco lateral (pivotando sobre Z = -0.56) */}
      <group position={[0, 0.84, -0.56]} rotation={[-0.46, 0, 0]}>
        <group position={[0, 0, 0.56]}>
          <mesh position={[0, 0.08, 0]} castShadow receiveShadow material={materials.bodyMat}>
            <boxGeometry args={[boxLen, 0.04, 1.88]} />
          </mesh>
          {[-0.54, 0.54].map((lz, lIdx) => (
            <mesh key={lIdx} position={[0, 0.03, lz]} castShadow material={materials.bodyMat}>
              <boxGeometry args={[boxLen - 0.02, 0.08, 0.08]} />
            </mesh>
          ))}
          {teleraXList.map((tx, tIdx) => (
            <mesh key={tIdx} position={[tx, 0.04, 0]} castShadow material={materials.bodyMat}>
              <boxGeometry args={[0.065, 0.07, 1.86]} />
            </mesh>
          ))}

          {/* Barandas laterales rebatibles con nervios horizontales, costillas dinámicas y logo "⚙ KISSER" */}
          {[-1, 1].map((side) => (
            <group key={`box-side-${side}`} position={[0, 0.1 + sideH * 0.5, side * 0.92]}>
              <mesh castShadow receiveShadow material={materials.bodyMat}>
                <boxGeometry args={[boxLen, sideH, 0.035]} />
              </mesh>
              {[-sideH * 0.32, 0, sideH * 0.32, sideH * 0.49].map((ry, rIdx) => (
                <mesh key={rIdx} position={[0, ry, side * 0.02]} material={materials.bodyMat}>
                  <boxGeometry args={[boxLen + 0.02, 0.035, 0.025]} />
                </mesh>
              ))}
              {sidePostXList.map((px, pIdx) => (
                <mesh key={pIdx} position={[px, 0, side * 0.025]} material={materials.bodyMat}>
                  <boxGeometry args={[0.065, sideH + 0.04, 0.045]} />
                </mesh>
              ))}
              <mesh
                position={[boxLen * 0.24, -sideH * 0.14, side * 0.022]}
                rotation={[0, side === 1 ? 0 : Math.PI, 0]}
                material={decals.kisserDetailMat}
              >
                <planeGeometry args={[0.54, 0.13]} />
              </mesh>
            </group>
          ))}

          {/* Frente y compuerta trasera */}
          {[halfBox, -halfBox].map((fx, fIdx) => (
            <group key={fIdx} position={[fx, 0.1 + sideH * 0.5, 0]}>
              <mesh castShadow receiveShadow material={materials.bodyMat}>
                <boxGeometry args={[0.035, sideH, 1.88]} />
              </mesh>
              {[-0.32, 0.32].map((fz, zIdx) => (
                <mesh key={zIdx} position={[fIdx === 0 ? 0.02 : -0.02, 0, fz]} material={materials.bodyMat}>
                  <boxGeometry args={[0.04, sideH, 0.05]} />
                </mesh>
              ))}
              {fIdx === 0 && (
                <mesh position={[0.022, 0.02, 0]} rotation={[0, Math.PI / 2, 0]} material={decals.escarapelaMat}>
                  <planeGeometry args={[0.09, 0.09]} />
                </mesh>
              )}
            </group>
          ))}
        </group>
      </group>

      {/* 4 Ruedas agrícolas/viales */}
      <AgriculturalWheel position={[frontAxleX, wheelRadius, 0.86]} radius={wheelRadius} width={0.22} materials={materials} />
      <AgriculturalWheel position={[frontAxleX, wheelRadius, -0.86]} radius={wheelRadius} width={0.22} materials={materials} />
      <AgriculturalWheel position={[rearAxleX, wheelRadius, 0.86]} radius={wheelRadius} width={0.22} materials={materials} />
      <AgriculturalWheel position={[rearAxleX, wheelRadius, -0.86]} radius={wheelRadius} width={0.22} materials={materials} />
    </group>
  );
}

/**
 * 6. PALA NIVELADORA DE ARRASTRE HIDRÁULICA (NA-3000)
 * Reconstruida punto-a-punto según PHOTO-2026-11-06-22-32-38_2.jpg y 22-32-39.jpg:
 * - Cero piezas sueltas: viga espina central continua desde la trompa delantera [1.76, 0.62, 0] hasta el puente trasero [-0.78, 1.08, 0].
 * - Pie de apoyo delantero unido mediante soporte lateral soldado a la trompa + mangueras hidráulicas curvas.
 * - Horquilla trasera, cajón de contrapeso y 2 cilindros superiores anclados a torretas amarillas soldadas al chasis.
 * - Bastidor inferior en A y caballete central piramidal que sujetan firmemente la viga dorsal de la hoja niveladora.
 */
function NiveladoraModel({
  materials,
  decals,
  bladeWidthCm = 300,
}: {
  materials: ReturnType<typeof useMachineryMaterials>;
  decals: ReturnType<typeof useCanvasDecals>;
  bladeWidthCm?: number;
}) {
  const wheelRadius = 0.45;
  const clampedCm = Math.max(240, Math.min(420, bladeWidthCm));
  const bladeWidth = (clampedCm / 300) * 2.86;
  const halfBlade = bladeWidth * 0.5;
  const dorsalHalf = halfBlade - 0.05;

  const ribZList = useMemo(() => {
    const count = clampedCm >= 330 ? 6 : 4;
    const span = bladeWidth - 0.72;
    return Array.from({ length: count }, (_, i) => -span * 0.5 + (i / (count - 1)) * span);
  }, [clampedCm, bladeWidth]);

  const curvedMoldboardGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0.12, 0.0);
    shape.quadraticCurveTo(-0.08, 0.34, 0.14, 0.68);
    shape.lineTo(0.08, 0.68);
    shape.quadraticCurveTo(-0.14, 0.34, 0.06, 0.0);
    shape.closePath();

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: bladeWidth,
      bevelEnabled: false,
    });
    geom.translate(0, 0, -halfBlade);
    geom.computeVertexNormals();
    return geom;
  }, [bladeWidth, halfBlade]);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. VIGA ESPINA CENTRAL CONTINUA E INCLINADA (de X=1.76, Y=0.62 a X=-0.78, Y=1.08) */}
      <group position={[0.49, 0.85, 0]} rotation={[0, 0, -0.179]}>
        <mesh castShadow receiveShadow material={materials.bodyMat}>
          <boxGeometry args={[2.6, 0.24, 0.22]} />
        </mesh>

        {[-0.06, -0.02, 0.02, 0.06].map((pz, idx) => (
          <mesh key={idx} position={[0, 0.132, pz]} rotation={[0, 0, Math.PI / 2]} material={materials.darkSteelMat}>
            <cylinderGeometry args={[0.009, 0.009, 2.52, 8]} />
          </mesh>
        ))}

        {[-1, 1].map((side) => (
          <React.Fragment key={`niv-decals-${side}`}>
            <mesh
              position={[-0.05, 0, side * 0.114]}
              rotation={[0, side === 1 ? 0 : Math.PI, 0]}
              material={decals.kisserDetailMat}
            >
              <planeGeometry args={[0.62, 0.14]} />
            </mesh>
            <mesh
              position={[0.74, 0, side * 0.114]}
              rotation={[0, side === 1 ? 0 : Math.PI, 0]}
              material={decals.indArgDetailMat}
            >
              <planeGeometry args={[0.68, 0.102]} />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* 2. TROMPA DELANTERA CURVA, ENGANCHE Y PIE DE APOYO UNIDO AL CHASIS */}
      <SegmentBox
        from={[1.74, 0.64, 0]}
        to={[2.08, 0.34, 0]}
        width={0.22}
        depth={0.22}
        material={materials.bodyMat}
      />
      <mesh
        position={[1.95, 0.51, 0]}
        rotation={[0, Math.PI / 2, 0.68]}
        material={decals.escarapelaMat}
      >
        <planeGeometry args={[0.085, 0.085]} />
      </mesh>
      <SegmentBox
        from={[2.02, 0.32, 0]}
        to={[2.32, 0.32, 0]}
        width={0.14}
        depth={0.07}
        material={materials.bodyMat}
      />
      <mesh position={[2.35, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.detailMat}>
        <torusGeometry args={[0.07, 0.022, 12, 24]} />
      </mesh>
      <CurvedTube3D
        points={[
          [1.72, 0.74, 0.04],
          [2.05, 0.62, 0.14],
          [2.12, 0.38, 0.05],
        ]}
        radius={0.012}
        material={materials.darkSteelMat}
      />
      <SegmentBox
        from={[1.76, 0.56, 0]}
        to={[1.76, 0.56, 0.22]}
        width={0.09}
        depth={0.09}
        material={materials.bodyMat}
      />
      <SegmentBox
        from={[1.76, 0.02, 0.22]}
        to={[1.76, 0.72, 0.22]}
        width={0.075}
        depth={0.075}
        material={materials.detailMat}
      />
      <mesh position={[1.76, 0.015, 0.22]} castShadow material={materials.detailMat}>
        <boxGeometry args={[0.16, 0.03, 0.16]} />
      </mesh>
      <SegmentCylinder
        from={[1.76, 0.72, 0.22]}
        to={[1.64, 0.78, 0.1]}
        radiusTop={0.01}
        radiusBottom={0.01}
        material={materials.detailMat}
      />

      {/* 3. HORQUILLA TRASERA, CONTRAPESO Y 2 CILINDROS SUPERIORES CON TORRETAS DE ANCLAJE */}
      <SegmentBox
        from={[-0.78, 1.08, -0.58]}
        to={[-0.78, 1.08, 0.58]}
        width={0.22}
        depth={0.22}
        material={materials.bodyMat}
      />
      <SegmentBox
        from={[-1.18, 0.68, -0.56]}
        to={[-1.18, 0.68, 0.56]}
        width={0.14}
        depth={0.14}
        material={materials.bodyMat}
      />
      {[-1, 1].map((side) => (
        <React.Fragment key={`fork-${side}`}>
          <SegmentBox
            from={[-0.78, 1.08, side * 0.52]}
            to={[-1.48, wheelRadius, side * 0.58]}
            width={0.17}
            depth={0.16}
            material={materials.bodyMat}
          />
          <SegmentBox
            from={[-0.28, 0.96, side * 0.1]}
            to={[-0.28, 1.24, side * 0.14]}
            width={0.08}
            depth={0.06}
            material={materials.bodyMat}
          />
          <SegmentBox
            from={[-0.96, 0.96, side * 0.44]}
            to={[-0.96, 1.2, side * 0.44]}
            width={0.08}
            depth={0.06}
            material={materials.bodyMat}
          />
          <HydraulicCylinder3D
            from={[-0.28, 1.2, side * 0.14]}
            to={[-0.96, 1.16, side * 0.44]}
            barrelRatio={0.62}
            barrelRadius={0.044}
            rodRadius={0.026}
            barrelMat={materials.detailMat}
            rodMat={materials.chromeMat}
          />
        </React.Fragment>
      ))}
      <mesh position={[-1.24, 0.82, 0]} rotation={[0, 0, 0.22]} castShadow receiveShadow material={materials.detailMat}>
        <boxGeometry args={[0.68, 0.44, 0.96]} />
      </mesh>
      <SegmentCylinder
        from={[-1.48, wheelRadius, -0.86]}
        to={[-1.48, wheelRadius, 0.86]}
        radiusTop={0.055}
        radiusBottom={0.055}
        material={materials.darkSteelMat}
      />

      {/* 4. BASTIDOR INFERIOR DE TIRO EN "A", CABALLETE CENTRAL Y HOJA VERTEDERA CURVA 100% UNIDOS */}
      <SegmentBox
        from={[1.02, 0.76, 0]}
        to={[1.02, 0.46, 0]}
        width={0.14}
        depth={0.14}
        material={materials.bodyMat}
      />
      <SegmentBox
        from={[1.02, 0.48, 0]}
        to={[0.08, 0.38, -0.52]}
        width={0.1}
        depth={0.1}
        material={materials.bodyMat}
      />
      <SegmentBox
        from={[1.02, 0.48, 0]}
        to={[0.24, 0.38, 0.52]}
        width={0.1}
        depth={0.1}
        material={materials.bodyMat}
      />

      {[-1, 1].map((side) => {
        const targetX = side === 1 ? 0.24 : 0.08;
        const targetZ = side * 0.52;
        return (
          <React.Fragment key={`tower-suspension-${side}`}>
            <SegmentBox
              from={[0.25, 0.89, 0]}
              to={[targetX, 0.38, targetZ]}
              width={0.095}
              depth={0.095}
              material={materials.bodyMat}
            />
            <SegmentBox
              from={[-0.18, 0.96, 0]}
              to={[targetX, 0.38, targetZ]}
              width={0.09}
              depth={0.09}
              material={materials.bodyMat}
            />
            <SegmentBox
              from={[0.16, 0.9, side * 0.1]}
              to={[0.16, 1.12, side * 0.12]}
              width={0.07}
              depth={0.06}
              material={materials.bodyMat}
            />
            <HydraulicCylinder3D
              from={[0.16, 1.08, side * 0.12]}
              to={[targetX, 0.4, side * 0.44]}
              barrelRatio={0.56}
              barrelRadius={0.038}
              rodRadius={0.022}
              barrelMat={materials.detailMat}
              rodMat={materials.chromeMat}
            />
          </React.Fragment>
        );
      })}

      {/* Hoja vertedera curva en perfil C con ancho dinámico según filtro (240 cm a 420 cm) */}
      <group position={[0.18, 0.08, 0]} rotation={[0, 0.18, 0]}>
        <mesh geometry={curvedMoldboardGeo} castShadow receiveShadow material={materials.bodyMat} />
        <mesh position={[0.13, 0.03, 0]} castShadow material={materials.detailMat}>
          <boxGeometry args={[0.026, 0.08, bladeWidth + 0.02]} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[0.06, 0.34, side * halfBlade]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[0.24, 0.66, 0.03]} />
          </mesh>
        ))}
        <SegmentBox
          from={[-0.04, 0.32, -dorsalHalf]}
          to={[-0.04, 0.32, dorsalHalf]}
          width={0.11}
          depth={0.11}
          material={materials.bodyMat}
        />
        {ribZList.map((rz, idx) => (
          <SegmentBox
            key={idx}
            from={[0.04, 0.06, rz]}
            to={[0.04, 0.62, rz]}
            width={0.09}
            depth={0.045}
            material={materials.bodyMat}
          />
        ))}
      </group>

      <AgriculturalWheel
        position={[-1.48, wheelRadius, 0.86]}
        radius={wheelRadius}
        width={0.28}
        lugCount={16}
        chevronTread
        hubCapMat={materials.detailMat}
        materials={materials}
      />
      <AgriculturalWheel
        position={[-1.48, wheelRadius, -0.86]}
        radius={wheelRadius}
        width={0.28}
        lugCount={16}
        chevronTread
        hubCapMat={materials.detailMat}
        materials={materials}
      />
    </group>
  );
}

/**
 * 7. ACOPLADO TANQUE CISTERNA / COMBUSTIBLE (1.500 a 10.000 LITROS)
 */
function CisternaModel({
  materials,
  decals,
  liters = 5000,
}: {
  materials: ReturnType<typeof useMachineryMaterials>;
  decals: ReturnType<typeof useCanvasDecals>;
  liters?: number;
}) {
  const wheelRadius = 0.36;
  const clampedLiters = Math.max(1500, Math.min(10000, liters));
  const u = (clampedLiters - 5000) / 5000;
  const tankLength = 2.52 + u * 0.64;
  const tankRadius = 0.52 + u * 0.04;
  const frameLen = tankLength + 0.83;
  const frontAxleX = 1.08 + u * 0.26;
  const rearAxleX = -1.12 - u * 0.26;
  const cabinetX = 0.28 - tankLength * 0.5 - 0.34;
  const decalWidth = Math.min(tankLength - 0.16, 2.32 + u * 0.52);
  const decalHeight = decalWidth / (2062 / 320);

  const railStanchionX = useMemo(() => {
    const count = clampedLiters <= 3500 ? 3 : clampedLiters <= 6500 ? 4 : 5;
    const span = tankLength - 0.14;
    return Array.from({ length: count }, (_, i) => -span * 0.5 + (i / (count - 1)) * span);
  }, [clampedLiters, tankLength]);

  return (
    <group position={[0, 0, 0]}>
      {[-1, 1].map((side) => (
        <group key={`cist-frame-${side}`}>
          <mesh position={[0, 0.72, side * 0.54]} castShadow material={materials.detailMat}>
            <boxGeometry args={[frameLen, 0.13, 0.1]} />
          </mesh>
          <mesh position={[frontAxleX, 0.48, side * 0.54]} castShadow material={materials.darkSteelMat}>
            <boxGeometry args={[0.58, 0.22, 0.09]} />
          </mesh>
          <mesh position={[rearAxleX, 0.52, side * 0.54]} castShadow material={materials.darkSteelMat}>
            <boxGeometry args={[0.64, 0.28, 0.09]} />
          </mesh>
        </group>
      ))}

      {[-1, 1].map((side) => (
        <group key={`toolbox-${side}`} position={[0.05, 0.56, side * 0.68]}>
          <mesh castShadow material={materials.darkSteelMat}>
            <boxGeometry args={[0.72, 0.34, 0.28]} />
          </mesh>
          <mesh
            position={[0, 0.03, side * 0.143]}
            rotation={[0, side === 1 ? 0 : Math.PI, 0]}
            material={decals.kisserWhiteMat}
          >
            <planeGeometry args={[0.32, 0.08]} />
          </mesh>
        </group>
      ))}

      {/* Tanque octogonal plegado de 8 caras con largo y gráfica dinámica según los litros elegidos */}
      <group position={[0.28, 1.18, 0]}>
        <mesh
          rotation={[Math.PI / 8, 0, Math.PI / 2]}
          castShadow
          receiveShadow
          material={materials.bodyMat}
        >
          <cylinderGeometry args={[tankRadius, tankRadius, tankLength, 8]} />
        </mesh>

        {[-1, 1].map((side) => (
          <group key={`top-rail-${side}`}>
            <mesh position={[0, tankRadius + 0.04, side * 0.34]} material={materials.bodyMat}>
              <boxGeometry args={[tankLength - 0.06, 0.03, 0.03]} />
            </mesh>
            {railStanchionX.map((rx, idx) => (
              <mesh key={idx} position={[rx, tankRadius - 0.04, side * 0.34]} material={materials.bodyMat}>
                <boxGeometry args={[0.03, 0.16, 0.03]} />
              </mesh>
            ))}
            <mesh
              position={[0, 0, side * (tankRadius * Math.cos(Math.PI / 8) + 0.004)]}
              rotation={[0, side === 1 ? 0 : Math.PI, 0]}
              material={side === -1 ? decals.cisternaBandLeftMat : decals.cisternaBandRightMat}
            >
              <planeGeometry args={[decalWidth, decalHeight]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Baulera trasera grande con puertas blancas */}
      <group position={[cabinetX, 1.18, 0]}>
        <mesh castShadow receiveShadow material={materials.detailMat}>
          <boxGeometry args={[0.68, 0.86, 1.08]} />
        </mesh>
        <mesh position={[-0.345, 0, 0]} material={materials.whitePaintMat}>
          <boxGeometry args={[0.02, 0.78, 0.98]} />
        </mesh>
      </group>

      {/* Avantrén delantero, ejes y lanza en V conectada en la punta */}
      <mesh position={[frontAxleX, 0.62, 0]} material={materials.detailMat}>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 24]} />
      </mesh>
      <SegmentCylinder
        from={[frontAxleX, wheelRadius, -0.86]}
        to={[frontAxleX, wheelRadius, 0.86]}
        radiusTop={0.048}
        radiusBottom={0.048}
        material={materials.darkSteelMat}
      />
      <SegmentCylinder
        from={[rearAxleX, wheelRadius, -0.86]}
        to={[rearAxleX, wheelRadius, 0.86]}
        radiusTop={0.048}
        radiusBottom={0.048}
        material={materials.darkSteelMat}
      />

      {[-1, 1].map((side) => (
        <AlignedBeam3D
          key={`cist-drawbar-${side}`}
          from={[frontAxleX + 0.3, 0.52, side * 0.44]}
          to={[frontAxleX + 1.6, 0.36, 0]}
          height={0.092}
          thickness={0.07}
          material={materials.detailMat}
          decalMaterial={decals.indArgWhiteMat}
          decalSide={side as 1 | -1}
          decalSize={[0.58, 0.087]}
        />
      ))}
      <mesh position={[frontAxleX + 1.66, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.detailMat}>
        <torusGeometry args={[0.065, 0.022, 12, 24]} />
      </mesh>

      <AgriculturalWheel position={[frontAxleX, wheelRadius, 0.86]} radius={wheelRadius} width={0.22} materials={materials} />
      <AgriculturalWheel position={[frontAxleX, wheelRadius, -0.86]} radius={wheelRadius} width={0.22} materials={materials} />
      <AgriculturalWheel position={[rearAxleX, wheelRadius, 0.86]} radius={wheelRadius} width={0.22} materials={materials} />
      <AgriculturalWheel position={[rearAxleX, wheelRadius, -0.86]} radius={wheelRadius} width={0.22} materials={materials} />
    </group>
  );
}

/**
 * 8. BATEA / TRAILER TÁNDEM CON BARANDAS BAJAS Y RAMPAS (4 a 12 TONELADAS)
 */
function BateaModel({
  materials,
  decals,
  toneladas = 6,
}: {
  materials: ReturnType<typeof useMachineryMaterials>;
  decals: ReturnType<typeof useCanvasDecals>;
  toneladas?: number;
}) {
  const wheelRadius = 0.3;
  const clampedTons = Math.max(4, Math.min(12, toneladas));
  const u = (clampedTons - 6) / 6;
  const bedLen = 3.76 + u * 0.78;
  const halfBed = bedLen * 0.5;
  const drawbarTipX = halfBed + 1.38;
  const standX = halfBed + 0.87;
  const tandemCenterX = -halfBed * 0.28;
  const rearAxleX = tandemCenterX - 0.4;
  const frontAxleX = tandemCenterX + 0.4;

  const sideStakeX = useMemo(() => {
    const count = clampedTons <= 4 ? 5 : clampedTons <= 8 ? 6 : 8;
    const span = bedLen - 0.04;
    return Array.from({ length: count }, (_, i) => -span * 0.5 + (i / (count - 1)) * span);
  }, [clampedTons, bedLen]);

  return (
    <group position={[0, 0, 0]}>
      {/* Piso plano de la batea (Z de -0.88 a +0.88, Y = 0.62: por encima y por dentro de las ruedas Z = ±1.04) */}
      <mesh position={[0, 0.62, 0]} castShadow receiveShadow material={materials.bodyMat}>
        <boxGeometry args={[bedLen, 0.09, 1.76]} />
      </mesh>

      {/* Baranda delantera / pecho con escarapela */}
      <group position={[halfBed - 0.02, 0.84, 0]}>
        <mesh castShadow receiveShadow material={materials.bodyMat}>
          <boxGeometry args={[0.04, 0.36, 1.76]} />
        </mesh>
        {[-0.86, -0.3, 0.3, 0.86].map((z, idx) => (
          <mesh key={idx} position={[0.02, 0, z]} material={materials.bodyMat}>
            <boxGeometry args={[0.04, 0.38, 0.045]} />
          </mesh>
        ))}
        <mesh position={[0.024, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={decals.escarapelaMat}>
          <planeGeometry args={[0.08, 0.08]} />
        </mesh>
      </group>

      {/* Barandas laterales bajas (en Z = ±0.86) + placa lisa para "⚙ KISSER" + guardabarros exterior sobre Z = ±1.04 */}
      {[-1, 1].map((side) => (
        <group key={`batea-side-${side}`}>
          <mesh position={[0, 0.84, side * 0.86]} castShadow receiveShadow material={materials.bodyMat}>
            <boxGeometry args={[bedLen, 0.36, 0.035]} />
          </mesh>
          {[0.72, 0.84, 0.96, 1.01].map((ry, idx) => (
            <mesh key={idx} position={[0, ry, side * 0.88]} material={materials.bodyMat}>
              <boxGeometry args={[bedLen + 0.02, 0.024, 0.018]} />
            </mesh>
          ))}
          {sideStakeX.map((sx, idx) => (
            <mesh key={idx} position={[sx, 0.84, side * 0.885]} material={materials.bodyMat}>
              <boxGeometry args={[0.045, 0.38, 0.035]} />
            </mesh>
          ))}

          {/* Placa lisa en el paño delantero para que los nervios NO corten el calco "⚙ KISSER" */}
          <mesh position={[halfBed * 0.42, 0.84, side * 0.882]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[0.7, 0.24, 0.022]} />
          </mesh>
          <mesh
            position={[halfBed * 0.42, 0.84, side * 0.896]}
            rotation={[0, side === 1 ? 0 : Math.PI, 0]}
            material={decals.kisserDetailMat}
          >
            <planeGeometry args={[0.62, 0.15]} />
          </mesh>

          {/* Guardabarros trapezoidal exterior (cubre las ruedas ubicadas en Z = ±1.04 fuera de la caja) */}
          <group position={[tandemCenterX, 0.74, side * 1.03]}>
            <mesh castShadow material={materials.bodyMat}>
              <boxGeometry args={[1.48, 0.04, 0.28]} />
            </mesh>
            <SegmentBox
              from={[0.72, 0, 0]}
              to={[0.92, -0.2, 0]}
              width={0.04}
              depth={0.28}
              material={materials.bodyMat}
            />
            <SegmentBox
              from={[-0.72, 0, 0]}
              to={[-0.92, -0.2, 0]}
              width={0.04}
              depth={0.28}
              material={materials.bodyMat}
            />
          </group>
        </group>
      ))}

      {/* Paragolpes / viga de cola donde articulan las 2 rampas traseras */}
      <mesh position={[-halfBed, 0.58, 0]} castShadow material={materials.bodyMat}>
        <boxGeometry args={[0.08, 0.12, 1.78]} />
      </mesh>

      {/* 2 Rampas traseras altas ("escaleras") 100% unidas a la cola y a las barandas mediante sus tensores */}
      {[-1, 1].map((side) => {
        const zPos = side * 0.56;
        const outerRailZ = zPos + side * 0.18;
        const sideboardZ = side * 0.86;
        return (
          <group key={`ramp-${side}`}>
            {[-0.18, 0, 0.18].map((colZ, cIdx) => (
              <SegmentBox
                key={cIdx}
                from={[-halfBed, 0.58, zPos + colZ]}
                to={[-halfBed, 2.02, zPos + colZ]}
                width={0.048}
                depth={0.042}
                material={materials.detailMat}
              />
            ))}
            {[0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0].map((ry, sIdx) => (
              <SegmentBox
                key={sIdx}
                from={[-halfBed, ry, zPos - 0.2]}
                to={[-halfBed, ry, zPos + 0.2]}
                width={0.044}
                depth={0.035}
                material={materials.detailMat}
              />
            ))}
            <SegmentBox
              from={[-halfBed, 1.34, outerRailZ]}
              to={[-halfBed, 1.34, sideboardZ]}
              width={0.045}
              depth={0.045}
              material={materials.detailMat}
            />
            <SegmentBox
              from={[-halfBed, 1.34, sideboardZ]}
              to={[-halfBed + 0.5, 0.98, sideboardZ]}
              width={0.032}
              depth={0.032}
              material={materials.detailMat}
            />
          </group>
        );
      })}

      {/* Lanza delantera en V conectada en la punta + pie de apoyo blanco */}
      {[-1, 1].map((side) => (
        <AlignedBeam3D
          key={`batea-drawbar-${side}`}
          from={[halfBed, 0.58, side * 0.48]}
          to={[drawbarTipX, 0.48, 0]}
          height={0.095}
          thickness={0.072}
          material={materials.bodyMat}
          decalMaterial={decals.indArgDetailMat}
          decalSide={side as 1 | -1}
          decalSize={[0.6, 0.09]}
        />
      ))}
      <SegmentBox
        from={[standX, 0.52, -0.18]}
        to={[standX, 0.52, 0.22]}
        width={0.055}
        depth={0.055}
        material={materials.bodyMat}
      />
      <mesh position={[standX, 0.32, 0.22]} castShadow material={materials.detailMat}>
        <cylinderGeometry args={[0.035, 0.035, 0.58, 12]} />
      </mesh>
      <mesh position={[standX, 0.04, 0.22]} material={materials.detailMat}>
        <cylinderGeometry args={[0.07, 0.07, 0.025, 16]} />
      </mesh>
      <mesh position={[drawbarTipX + 0.06, 0.48, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.bodyMat}>
        <torusGeometry args={[0.068, 0.022, 12, 24]} />
      </mesh>

      {/* Suspensión tándem balancín y 4 ruedas ubicadas en Z = ±1.04 (fuera de la caja de carga) */}
      {[-1, 1].map((side) => (
        <group key={`batea-susp-${side}`} position={[tandemCenterX, 0, side * 0.78]}>
          <mesh position={[0, 0.46, 0]} castShadow material={materials.bodyMat}>
            <boxGeometry args={[0.24, 0.24, 0.09]} />
          </mesh>
          <mesh position={[0, 0.32, 0]} castShadow material={materials.darkSteelMat}>
            <boxGeometry args={[0.92, 0.09, 0.08]} />
          </mesh>
        </group>
      ))}
      <SegmentCylinder
        from={[rearAxleX, wheelRadius, -1.04]}
        to={[rearAxleX, wheelRadius, 1.04]}
        radiusTop={0.044}
        radiusBottom={0.044}
        material={materials.darkSteelMat}
      />
      <SegmentCylinder
        from={[frontAxleX, wheelRadius, -1.04]}
        to={[frontAxleX, wheelRadius, 1.04]}
        radiusTop={0.044}
        radiusBottom={0.044}
        material={materials.darkSteelMat}
      />
      <AgriculturalWheel
        position={[rearAxleX, wheelRadius, 1.04]}
        radius={wheelRadius}
        width={0.19}
        hubCapMat={materials.bodyMat}
        materials={materials}
      />
      <AgriculturalWheel
        position={[frontAxleX, wheelRadius, 1.04]}
        radius={wheelRadius}
        width={0.19}
        hubCapMat={materials.bodyMat}
        materials={materials}
      />
      <AgriculturalWheel
        position={[rearAxleX, wheelRadius, -1.04]}
        radius={wheelRadius}
        width={0.19}
        hubCapMat={materials.bodyMat}
        materials={materials}
      />
      <AgriculturalWheel
        position={[frontAxleX, wheelRadius, -1.04]}
        radius={wheelRadius}
        width={0.19}
        hubCapMat={materials.bodyMat}
        materials={materials}
      />
    </group>
  );
}

export default function MachineryModels({
  modelType,
  colors,
  variantValue,
  autoRotate = true,
  wireframe = false,
}: MachineryModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materials = useMachineryMaterials(colors, wireframe);
  const tolvaTons = modelType === 'tolva' && variantValue ? variantValue : 20;
  const cisternaLiters = modelType === 'cisterna' && variantValue ? variantValue : 5000;
  const decals = useCanvasDecals(colors, tolvaTons, cisternaLiters);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.22;
    }
  });

  return (
    <group ref={groupRef}>
      {modelType === 'jaula-ganadera' && (
        <JaulaGanaderaModel materials={materials} decals={decals} headsCount={variantValue ?? 8} />
      )}
      {modelType === 'tolva' && (
        <TolvaModel materials={materials} decals={decals} toneladas={variantValue ?? 20} />
      )}
      {modelType === 'pala-frontal' && (
        <PalaFrontalModel materials={materials} decals={decals} capacityKg={variantValue ?? 1600} />
      )}
      {modelType === 'rome-tijera' && (
        <RomeTijeraModel materials={materials} decals={decals} totalDiscs={variantValue ?? 18} />
      )}
      {modelType === 'volcador' && (
        <VolcadorModel materials={materials} decals={decals} toneladas={variantValue ?? 8} />
      )}
      {modelType === 'niveladora' && (
        <NiveladoraModel materials={materials} decals={decals} bladeWidthCm={variantValue ?? 300} />
      )}
      {modelType === 'cisterna' && (
        <CisternaModel materials={materials} decals={decals} liters={variantValue ?? 5000} />
      )}
      {modelType === 'batea' && (
        <BateaModel materials={materials} decals={decals} toneladas={variantValue ?? 6} />
      )}
    </group>
  );
}
