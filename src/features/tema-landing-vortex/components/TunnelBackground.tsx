import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";

// ---------- Parámetros del túnel ----------
const RINGS = 210; // cantidad de anillos a lo largo del túnel
const SEG = 16; // vértices por anillo (más facetas = más polígonos)
const DZ = 1.9; // separación entre anillos
const BASE_R = 6.2; // radio base del túnel
const COLOR = 0x16e6ad;
const LINE_WIDTH = 0.022; // grosor en UNIDADES DE MUNDO (worldUnits): cerca grueso, lejos fino
const LINE_WIDTH_PX = 1.5; // grosor base en píxeles (pasada uniforme): sostiene el centro
const OPACITY = 0.3; // opacidad de las líneas en desktop (más bajo = más oscuro/menos brillo)
const OPACITY_MOBILE = 0.2; // opacidad en mobile (más oscuro/menos brillo)
const MOBILE_BP = 768; // px: por debajo de esto = mobile
const FOG_NEAR = 18; // a partir de aquí las líneas lejanas empiezan a apagarse
const FOG_FAR = 70; // aquí ya son negras -> define el tamaño del agujero central
const NEAR_FADE_START = 1; // anillos más cerca que esto = invisibles (mata las líneas gigantes)
const NEAR_FADE_END = 4.5; // brillo pleno recién a partir de esta profundidad

// desvanecido suave por largo de línea en pantalla (NDC; el ancho total es 2)
const FADE_LEN_START = 0.95; // aguanta full bastante más antes de empezar a apagarse
const FADE_LEN_END = 1.7; // ya invisible recién acá (transición gradual entremedio)
const FADE_SPAN = FADE_LEN_END - FADE_LEN_START;

export default function TunnelBackground({
  className = "",
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const app = containerRef.current;
    if (!app) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const SPEED = reduced ? 0.12 : 0.55; // velocidad de avance (anillos/seg)

    // tamaño inicial desde el contenedor (no desde window)
    let width = app.clientWidth || 1;
    let height = app.clientHeight || 1;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    // niebla negra: apaga los anillos profundos antes de que colapsen en un punto.
    scene.fog = new THREE.Fog(0x000000, FOG_NEAR, FOG_FAR);

    const camera = new THREE.PerspectiveCamera(74, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0); // la cámara va DENTRO del túnel, sobre el eje
    camera.lookAt(0, 0, -1);
    camera.updateMatrixWorld(); // necesario para proyectar vértices a pantalla

    // ---------- Parallax con el mouse (solo desktop, puntero fino, sin reduced-motion) ----------
    const parallax =
      !reduced &&
      window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;
    const PARALLAX_AMT = 0.05; // cuánto se corre el centro (unidades de escena), leve
    let tx = 0,
      ty = 0; // objetivo normalizado (-1..1)
    let px = 0,
      py = 0; // posición actual (lerp)
    const onMouseMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (parallax) window.addEventListener("mousemove", onMouseMove);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    app.appendChild(renderer.domElement);

    // ---------- Geometría ----------
    const VERTS = RINGS * SEG;
    const positions = new Float32Array(VERTS * 3); // vértices de los anillos
    const colors = new Float32Array(VERTS * 3); // brillo por vértice (fade cercano)

    const _teal = new THREE.Color(COLOR);
    const TR = _teal.r,
      TG = _teal.g,
      TB = _teal.b;

    // Fat lines: grosor real en píxeles (LineBasicMaterial.linewidth se ignora en WebGL)
    const opacityFor = (w: number) => (w < MOBILE_BP ? OPACITY_MOBILE : OPACITY);
    const lineMat = new LineMaterial({
      vertexColors: true,
      transparent: true,
      opacity: opacityFor(width),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: LINE_WIDTH,
      worldUnits: true, // grosor en unidades de mundo -> perspectiva: cerca grueso, lejos fino
      fog: true, // LineMaterial ignora scene.fog si no se activa -> sin esto el centro se llena
    });
    lineMat.resolution.set(width, height); // necesario para que el grosor en px sea correcto

    // Pasada base en píxeles (grosor uniforme) -> mantiene el centro visible como antes.
    // El worldUnits de arriba sólo engrosa lo cercano; ésta sostiene lo lejano/centro.
    const lineMatPx = new LineMaterial({
      vertexColors: true,
      transparent: true,
      opacity: opacityFor(width),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: LINE_WIDTH_PX,
      worldUnits: false,
      fog: true,
    });
    lineMatPx.resolution.set(width, height);

    // Capa 1: contorno de los anillos. Fat lines requieren segmentos explícitos
    // (par de vértices por segmento), no se puede indexar.
    const RING_SEGS = RINGS * SEG;
    const ringSegPos = new Float32Array(RING_SEGS * 6); // x1,y1,z1, x2,y2,z2
    const ringSegCol = new Float32Array(RING_SEGS * 6); // r1,g1,b1, r2,g2,b2
    const ringGeo = new LineSegmentsGeometry();
    ringGeo.setPositions(ringSegPos);
    ringGeo.setColors(ringSegCol);
    const ringLines = new LineSegments2(ringGeo, lineMat);
    ringLines.frustumCulled = false; // movemos vértices a mano -> bounding queda obsoleto
    scene.add(ringLines);
    const ringLinesPx = new LineSegments2(ringGeo, lineMatPx); // misma geo, pasada base px
    ringLinesPx.frustumCulled = false;
    scene.add(ringLinesPx);
    // instanceStart/instanceColorStart son InterleavedBufferAttribute -> .data es el buffer
    const ringPosBuf = (
      ringGeo.attributes.instanceStart as THREE.InterleavedBufferAttribute
    ).data; // wrappea ringSegPos por ref
    const ringColBuf = (
      ringGeo.attributes.instanceColorStart as THREE.InterleavedBufferAttribute
    ).data;

    // Capa 2: conectoras (la malla). Cada conectora ya viene en formato segmento
    // (2 vértices propios) -> calza directo con LineSegmentsGeometry.
    const CONN = (RINGS - 1) * SEG * 2; // riel + diagonal por vértice
    const webPos = new Float32Array(CONN * 6);
    const webCol = new Float32Array(CONN * 6);
    const webGeo = new LineSegmentsGeometry();
    webGeo.setPositions(webPos);
    webGeo.setColors(webCol);
    const webLines = new LineSegments2(webGeo, lineMat);
    webLines.frustumCulled = false;
    scene.add(webLines);
    const webLinesPx = new LineSegments2(webGeo, lineMatPx); // misma geo, pasada base px
    webLinesPx.frustumCulled = false;
    scene.add(webLinesPx);
    const webPosBuf = (
      webGeo.attributes.instanceStart as THREE.InterleavedBufferAttribute
    ).data; // wrappea webPos por ref
    const webColBuf = (
      webGeo.attributes.instanceColorStart as THREE.InterleavedBufferAttribute
    ).data;

    // ---------- Ruido: radio y jitter dependen sólo de z -> el patrón fluye sin saltos ----------
    // edge: 0 en el fondo (centro = forma original del commit) -> 1 en las puntas (deforma extra)
    function edge(z: number) {
      const depth = -z;
      const e = depth >= 30 ? 0 : 1 - depth / 30;
      return e * e; // cuadrático: el relieve extra se concentra en el borde
    }
    function ringRadius(z: number, j: number) {
      // base = exactamente el ruido del commit anterior (manda en el centro)
      const base =
        1.0 +
        0.16 * Math.sin(z * 0.1 + j * 2.1) +
        0.11 * Math.sin(z * 0.21 - j * 1.3 + 1.7) +
        0.07 * Math.sin(z * 0.05 + j * 0.7 + 4.0);
      // extra = formas/relieve que sólo aparecen hacia las puntas
      const extra =
        0.22 * Math.sin(z * 0.1 + j * 2.1) +
        0.16 * Math.sin(z * 0.21 - j * 1.3 + 1.7) +
        0.12 * Math.sin(z * 0.4 + j * 3.1 + 2.2); // armónico alto = textura fina
      const m = base + edge(z) * extra;
      // piso: el vértice nunca colapsa al eje -> evita "destellos" rectos desde el centro
      return BASE_R * Math.max(0.5, m);
    }
    function angleJitter(z: number, j: number) {
      const base =
        0.12 * Math.sin(z * 0.13 + j) + 0.06 * Math.sin(z * 0.27 - j * 0.5);
      const extra =
        0.1 * Math.sin(z * 0.13 + j) + 0.07 * Math.sin(z * 0.55 + j * 1.7);
      return base + edge(z) * extra;
    }

    const TOTAL_DEPTH = RINGS * DZ;
    let offset = 0;
    const clock = new THREE.Clock();

    // scratch para proyectar a pantalla
    const _v = new THREE.Vector3();
    const ndx = new Float32Array(VERTS);
    const ndy = new Float32Array(VERTS);
    const nfRing = new Float32Array(RINGS);
    const inFront = new Uint8Array(VERTS);

    let w = 0;
    function addConn(p1: number, p2: number) {
      const a1 = p1 * 3,
        a2 = p2 * 3;
      webPos[w] = positions[a1];
      webPos[w + 1] = positions[a1 + 1];
      webPos[w + 2] = positions[a1 + 2];
      webPos[w + 3] = positions[a2];
      webPos[w + 4] = positions[a2 + 1];
      webPos[w + 5] = positions[a2 + 2];
      let lf = 0;
      if (inFront[p1] && inFront[p2]) {
        const dx = ndx[p1] - ndx[p2],
          dy = ndy[p1] - ndy[p2];
        const len = Math.sqrt(dx * dx + dy * dy);
        lf =
          len <= FADE_LEN_START
            ? 1
            : len >= FADE_LEN_END
              ? 0
              : 1 - (len - FADE_LEN_START) / FADE_SPAN;
        lf = lf * lf * (3 - 2 * lf); // smoothstep -> sin cortes bruscos
      }
      const f1 = nfRing[(p1 / SEG) | 0] * lf;
      const f2 = nfRing[(p2 / SEG) | 0] * lf;
      webCol[w] = TR * f1;
      webCol[w + 1] = TG * f1;
      webCol[w + 2] = TB * f1;
      webCol[w + 3] = TR * f2;
      webCol[w + 4] = TG * f2;
      webCol[w + 5] = TB * f2;
      w += 6;
    }

    function updatePositions() {
      // 1) anillos: posición + color (fade cercano)
      for (let k = 0; k < RINGS; k++) {
        let z = -DZ * (k + 1) + (offset % TOTAL_DEPTH);
        if (z > 0) z -= TOTAL_DEPTH;
        const twist = z * 0.035; // espiral fija según z (forma, NO rotación en el tiempo)
        const depth = -z;
        let nf =
          (depth - NEAR_FADE_START) / (NEAR_FADE_END - NEAR_FADE_START);
        nf = nf < 0 ? 0 : nf > 1 ? 1 : nf;
        nf = nf * nf * (3 - 2 * nf);
        nfRing[k] = nf;
        for (let j = 0; j < SEG; j++) {
          const r = ringRadius(z, j);
          const ang = (j / SEG) * Math.PI * 2 + angleJitter(z, j) + twist;
          const p = (k * SEG + j) * 3;
          positions[p] = Math.cos(ang) * r;
          positions[p + 1] = Math.sin(ang) * r;
          positions[p + 2] = z;
          colors[p] = TR * nf;
          colors[p + 1] = TG * nf;
          colors[p + 2] = TB * nf;
        }
      }
      // expandir anillos a segmentos explícitos (par de vértices por arista)
      let rs = 0;
      for (let k = 0; k < RINGS; k++) {
        for (let j = 0; j < SEG; j++) {
          const a = (k * SEG + j) * 3;
          const b = (k * SEG + ((j + 1) % SEG)) * 3;
          ringSegPos[rs] = positions[a];
          ringSegPos[rs + 1] = positions[a + 1];
          ringSegPos[rs + 2] = positions[a + 2];
          ringSegPos[rs + 3] = positions[b];
          ringSegPos[rs + 4] = positions[b + 1];
          ringSegPos[rs + 5] = positions[b + 2];
          ringSegCol[rs] = colors[a];
          ringSegCol[rs + 1] = colors[a + 1];
          ringSegCol[rs + 2] = colors[a + 2];
          ringSegCol[rs + 3] = colors[b];
          ringSegCol[rs + 4] = colors[b + 1];
          ringSegCol[rs + 5] = colors[b + 2];
          rs += 6;
        }
      }
      ringPosBuf.needsUpdate = true;
      ringColBuf.needsUpdate = true;

      // 2) proyectar vértices a pantalla
      for (let i = 0; i < VERTS; i++) {
        const p = i * 3;
        inFront[i] = positions[p + 2] < -0.05 ? 1 : 0;
        _v.set(positions[p], positions[p + 1], positions[p + 2]).project(
          camera,
        );
        ndx[i] = _v.x;
        ndy[i] = _v.y;
      }

      // 3) conectoras: se desvanecen solas según su largo (nada salta de golpe)
      w = 0;
      for (let k = 0; k < RINGS - 1; k++) {
        for (let j = 0; j < SEG; j++) {
          const a = k * SEG + j;
          addConn(a, (k + 1) * SEG + j); // riel
          addConn(a, (k + 1) * SEG + ((j + 1) % SEG)); // diagonal
        }
      }
      webPosBuf.needsUpdate = true;
      webColBuf.needsUpdate = true;
    }

    // ---------- Loop ----------
    let raf = 0;
    function animate() {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      offset += SPEED * DZ * dt;
      if (parallax) {
        // lerp suave hacia el objetivo -> el centro se corre apenas con el mouse
        px += (tx - px) * 0.05;
        py += (ty - py) * 0.05;
        camera.position.x = px * PARALLAX_AMT;
        camera.position.y = -py * PARALLAX_AMT;
        camera.lookAt(0, 0, -1);
        camera.updateMatrixWorld(); // la proyección de los vértices depende de esto
      }
      updatePositions();
      renderer.render(scene, camera);
    }
    animate();

    // ---------- Resize: observa el contenedor, no window ----------
    const ro = new ResizeObserver(() => {
      width = app.clientWidth || 1;
      height = app.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      lineMat.resolution.set(width, height);
      lineMatPx.resolution.set(width, height);
      const op = opacityFor(width); // opacidad responsive: mobile más tenue
      lineMat.opacity = op;
      lineMatPx.opacity = op;
    });
    ro.observe(app);

    // ---------- Cleanup ----------
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (parallax) window.removeEventListener("mousemove", onMouseMove);
      scene.remove(ringLines, webLines, ringLinesPx, webLinesPx);
      ringGeo.dispose();
      webGeo.dispose();
      lineMat.dispose();
      lineMatPx.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === app) {
        app.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
