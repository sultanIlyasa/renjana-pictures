import * as THREE from "three";

export interface ScrubScene {
  render: (progress: number) => void;
  resize: () => void;
  destroy: () => void;
}

export interface ScrubSceneOptions {
  logoSrc: string;
}

const TWO_PI = Math.PI * 2;
const SPINS = 2.15;
const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);

interface SourceRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const EMBLEM_SOURCE: SourceRect = {
  x: 150,
  y: 105,
  width: 780,
  height: 725,
};

const WORDMARK_SOURCE: SourceRect = {
  x: 25,
  y: 820,
  width: 1030,
  height: 170,
};

function seeded(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function createCropTexture(
  renderer: THREE.WebGLRenderer,
  image: HTMLImageElement,
  source: SourceRect,
  width: number,
) {
  const crop = document.createElement("canvas");
  crop.width = width;
  crop.height = Math.round(width * (source.height / source.width));
  const context = crop.getContext("2d");

  if (!context) return null;

  context.clearRect(0, 0, crop.width, crop.height);
  context.drawImage(
    image,
    source.x,
    source.y,
    source.width,
    source.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  const texture = new THREE.CanvasTexture(crop);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createOrbitLine(
  radiusX: number,
  radiusY: number,
  opacity: number,
  color = 0x259e8f,
) {
  const points = Array.from({ length: 160 }, (_, index) => {
    const angle = (index / 160) * TWO_PI;
    return new THREE.Vector3(
      Math.cos(angle) * radiusX,
      Math.sin(angle) * radiusY,
      0,
    );
  });
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  return new THREE.LineLoop(geometry, material);
}

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (!context) return null;

  const glow = context.createRadialGradient(128, 128, 0, 128, 128, 128);
  glow.addColorStop(0, "rgba(86, 230, 210, 0.32)");
  glow.addColorStop(0.3, "rgba(37, 158, 143, 0.16)");
  glow.addColorStop(1, "rgba(37, 158, 143, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createScrubScene(
  canvas: HTMLCanvasElement,
  { logoSrc }: ScrubSceneOptions,
): ScrubScene {
  let renderer: THREE.WebGLRenderer | null = null;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch {
    return {
      render: () => undefined,
      resize: () => undefined,
      destroy: () => undefined,
    };
  }

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 30);
  camera.position.set(0, 0, 8);

  const ambientLight = new THREE.AmbientLight(0x9fded5, 1.35);
  const keyLight = new THREE.DirectionalLight(0xe7fff9, 2.6);
  keyLight.position.set(-3, 4, 6);
  const rimLight = new THREE.DirectionalLight(0x259e8f, 2.2);
  rimLight.position.set(4, -1, 3);
  scene.add(ambientLight, keyLight, rimLight);

  const orbitGroup = new THREE.Group();
  const orbitLines = [
    createOrbitLine(1.55, 0.42, 0.17, 0xfdf5d7),
    createOrbitLine(2.0, 0.54, 0.11),
    createOrbitLine(2.48, 0.67, 0.075),
    createOrbitLine(3.02, 0.82, 0.045),
  ];
  orbitLines.forEach((line) => orbitGroup.add(line));
  scene.add(orbitGroup);

  const dustCount = 110;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let index = 0; index < dustCount; index++) {
    dustPositions[index * 3] = (seeded(index, 1) - 0.5) * 9.5;
    dustPositions[index * 3 + 1] = (seeded(index, 2) - 0.5) * 5.8;
    dustPositions[index * 3 + 2] = -1.2 + seeded(index, 3) * 2.6;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(dustPositions, 3),
  );
  const dustMaterial = new THREE.PointsMaterial({
    color: 0xfdf5d7,
    size: 0.018,
    transparent: true,
    opacity: 0.28,
    sizeAttenuation: true,
    depthWrite: false,
  });
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  scene.add(dust);

  const glowTexture = createGlowTexture();
  const glowMaterial = glowTexture
    ? new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0x66d6c7,
        transparent: true,
        opacity: 0.68,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    : null;
  const glow = glowMaterial ? new THREE.Sprite(glowMaterial) : null;
  if (glow) {
    glow.scale.set(4.8, 4.8, 1);
    glow.position.z = -0.8;
    scene.add(glow);
  }

  const logoGroup = new THREE.Group();
  scene.add(logoGroup);

  let wordmark: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null =
    null;
  let emblemTexture: THREE.CanvasTexture | null = null;
  let wordmarkTexture: THREE.CanvasTexture | null = null;
  let frontMaterial: THREE.MeshStandardMaterial | null = null;
  let backMaterial: THREE.MeshStandardMaterial | null = null;
  let depthMaterial: THREE.MeshStandardMaterial | null = null;
  let wordmarkMaterial: THREE.MeshBasicMaterial | null = null;
  let emblemGeometry: THREE.PlaneGeometry | null = null;
  let wordmarkGeometry: THREE.PlaneGeometry | null = null;
  let baseLogoScale = 1;
  let baseWordmarkScale = 1;
  let width = 1;
  let height = 1;
  let last = 0;
  let logoBuilt = false;
  let destroyed = false;

  const image = new Image();
  image.decoding = "async";

  const handleLogoLoad = () => {
    if (destroyed || logoBuilt || !renderer) return;
    logoBuilt = true;

    emblemTexture = createCropTexture(renderer, image, EMBLEM_SOURCE, 1024);
    wordmarkTexture = createCropTexture(renderer, image, WORDMARK_SOURCE, 1024);
    if (!emblemTexture || !wordmarkTexture) {
      logoBuilt = false;
      return;
    }

    emblemGeometry = new THREE.PlaneGeometry(2.15, 2.0, 1, 1);
    frontMaterial = new THREE.MeshStandardMaterial({
      map: emblemTexture,
      transparent: true,
      alphaTest: 0.08,
      roughness: 0.34,
      metalness: 0.08,
      side: THREE.FrontSide,
    });
    backMaterial = frontMaterial.clone();
    depthMaterial = new THREE.MeshStandardMaterial({
      map: emblemTexture,
      color: 0x176f65,
      transparent: true,
      alphaTest: 0.12,
      opacity: 0.86,
      roughness: 0.6,
      metalness: 0.16,
      side: THREE.DoubleSide,
    });

    const depth = 0.26;
    const slices = 12;
    for (let index = 0; index < slices; index++) {
      const slice = new THREE.Mesh(emblemGeometry, depthMaterial);
      slice.position.z = -depth / 2 + (index / (slices - 1)) * depth;
      logoGroup.add(slice);
    }

    const front = new THREE.Mesh(emblemGeometry, frontMaterial);
    front.position.z = depth / 2 + 0.012;
    logoGroup.add(front);

    const back = new THREE.Mesh(emblemGeometry, backMaterial);
    back.position.z = -depth / 2 - 0.012;
    back.rotation.y = Math.PI;
    logoGroup.add(back);

    wordmarkGeometry = new THREE.PlaneGeometry(2.6, 0.43, 1, 1);
    wordmarkMaterial = new THREE.MeshBasicMaterial({
      map: wordmarkTexture,
      transparent: true,
      alphaTest: 0.04,
      depthWrite: false,
      toneMapped: false,
    });
    wordmark = new THREE.Mesh(wordmarkGeometry, wordmarkMaterial);
    wordmark.position.z = 0.15;
    scene.add(wordmark);

    resize();
    render(last);
  };

  image.addEventListener("load", handleLogoLoad);
  image.src = logoSrc;

  function resize() {
    if (!renderer) return;
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    const compact = width <= 820;
    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      compact ? 1.5 : 2,
    );

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    baseLogoScale = compact ? 0.72 : width < 1100 ? 0.86 : 1;
    baseWordmarkScale = compact ? 0.7 : width < 1100 ? 0.84 : 1;
    logoGroup.position.set(0, compact ? 0.98 : 0.76, 0);
    orbitGroup.position.copy(logoGroup.position);
    if (glow) glow.position.set(0, logoGroup.position.y, -0.8);
    if (wordmark) {
      wordmark.position.set(0, compact ? -0.08 : -0.52, 0.15);
      wordmark.scale.setScalar(baseWordmarkScale);
    }
  }

  function render(progress: number) {
    if (!renderer) return;
    const p = clamp(progress);
    const entrance = easeOut(clamp((p + 0.02) / 0.18));
    const rotation = (p * SPINS + (1 - entrance) * 0.045) * TWO_PI;
    last = p;

    logoGroup.rotation.set(
      -0.08 + Math.sin(p * Math.PI * 1.4) * 0.08,
      rotation,
      Math.sin(p * TWO_PI) * 0.025,
    );
    logoGroup.scale.setScalar(baseLogoScale * (0.78 + entrance * 0.22));

    const logoOpacity = 0.25 + entrance * 0.75;
    if (frontMaterial) frontMaterial.opacity = logoOpacity;
    if (backMaterial) backMaterial.opacity = logoOpacity;
    if (depthMaterial) depthMaterial.opacity = logoOpacity * 0.86;
    if (wordmarkMaterial) {
      wordmarkMaterial.opacity = easeOut(clamp((p + 0.01) / 0.22)) * 0.92;
    }

    orbitGroup.rotation.z = p * 0.18;
    orbitLines.forEach((line, index) => {
      line.rotation.z = p * (index % 2 === 0 ? 0.1 : -0.08);
      const material = line.material as THREE.LineBasicMaterial;
      material.opacity = (index === 0 ? 0.17 : 0.11 / (index * 0.45 + 1)) *
        (0.35 + entrance * 0.65);
    });

    dust.rotation.z = p * 0.035;
    dust.position.y = (p - 0.5) * 0.14;
    if (glowMaterial) glowMaterial.opacity = 0.36 + entrance * 0.32;

    renderer.render(scene, camera);
  }

  resize();
  render(0);

  if (image.complete && image.naturalWidth > 0) {
    handleLogoLoad();
  }

  return {
    render,
    resize: () => {
      resize();
      render(last);
    },
    destroy: () => {
      destroyed = true;
      image.removeEventListener("load", handleLogoLoad);

      emblemGeometry?.dispose();
      wordmarkGeometry?.dispose();
      emblemTexture?.dispose();
      wordmarkTexture?.dispose();
      frontMaterial?.dispose();
      backMaterial?.dispose();
      depthMaterial?.dispose();
      wordmarkMaterial?.dispose();
      orbitLines.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });
      dustGeometry.dispose();
      dustMaterial.dispose();
      glowTexture?.dispose();
      glowMaterial?.dispose();
      renderer?.dispose();
      renderer = null;
    },
  };
}
