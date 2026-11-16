import * as THREE from 'three';
import { AppleVariety } from './AppleModel3D';

// Procedural PBR Texture Generator for Photorealistic Mountain Apples
// Generates high-resolution albedo, bump, and roughness maps directly in memory

interface ApplePalette {
  baseColor: string;
  stemBasinColor: string;
  calyxColor: string;
  streakColorPrimary: string;
  streakColorSecondary: string;
  lenticelColor: string;
  lenticelDensity: number;
  russetingIntensity: number;
  specularGloss: number;
}

const getVarietyPalette = (variety: AppleVariety): ApplePalette => {
  switch (variety) {
    case 'golden':
      return {
        baseColor: '#e8c84a',
        stemBasinColor: '#96a644',
        calyxColor: '#8a9b3d',
        streakColorPrimary: '#f5d862',
        streakColorSecondary: '#d8ab28',
        lenticelColor: '#ffffff',
        lenticelDensity: 1200,
        russetingIntensity: 0.35,
        specularGloss: 0.65,
      };
    case 'shimla':
      return {
        baseColor: '#8eae4e',
        stemBasinColor: '#7a9e3d',
        calyxColor: '#6d8e35',
        streakColorPrimary: '#c43d3d',
        streakColorSecondary: '#a82c2c',
        lenticelColor: '#f2f7e4',
        lenticelDensity: 900,
        russetingIntensity: 0.2,
        specularGloss: 0.7,
      };
    case 'fuji':
      return {
        baseColor: '#e07662',
        stemBasinColor: '#a6af52',
        calyxColor: '#8e9643',
        streakColorPrimary: '#c62b2b',
        streakColorSecondary: '#8c1616',
        lenticelColor: '#faeae1',
        lenticelDensity: 1100,
        russetingIntensity: 0.25,
        specularGloss: 0.72,
      };
    case 'cherry':
      return {
        baseColor: '#6b0713',
        stemBasinColor: '#4a030b',
        calyxColor: '#3d0208',
        streakColorPrimary: '#8c0d1e',
        streakColorSecondary: '#52040d',
        lenticelColor: '#ffffff',
        lenticelDensity: 200,
        russetingIntensity: 0.05,
        specularGloss: 0.92,
      };
    case 'walnut':
      return {
        baseColor: '#4a2f1c',
        stemBasinColor: '#362112',
        calyxColor: '#2b190c',
        streakColorPrimary: '#5c3d26',
        streakColorSecondary: '#301c0f',
        lenticelColor: '#26150a',
        lenticelDensity: 1500,
        russetingIntensity: 0.9,
        specularGloss: 0.15,
      };
    case 'royal-red':
    default:
      // Signature Kinnaur Royal Red Delicious sampled directly from official showcase image
      // Base: #8a0a0c, Highlights: #d03a30, Deep shadows: #9f2d23, Lenticels: #fae4c3
      return {
        baseColor: '#8a0a0c',
        stemBasinColor: '#5c6827',
        calyxColor: '#4f080a',
        streakColorPrimary: '#d03a30',
        streakColorSecondary: '#9f2d23',
        lenticelColor: '#fae4c3',
        lenticelDensity: 1600,
        russetingIntensity: 0.35,
        specularGloss: 0.85,
      };
  }
};

// Generates the photorealistic organic skin texture
export function createAppleSkinTexture(variety: AppleVariety): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const p = getVarietyPalette(variety);
  const w = canvas.width;
  const h = canvas.height;

  // 1. Base vertical gradient (stem basin -> body -> calyx)
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, p.stemBasinColor);
  grad.addColorStop(0.12, p.baseColor);
  grad.addColorStop(0.5, p.baseColor);
  grad.addColorStop(0.88, p.streakColorSecondary);
  grad.addColorStop(1, p.calyxColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // 2. Natural vertical streaks (orchard sun ripening striations)
  const streakCount = variety === 'walnut' ? 60 : 180;
  ctx.globalAlpha = 0.45;
  for (let i = 0; i < streakCount; i++) {
    const x = (i / streakCount) * w + (Math.random() - 0.5) * 8;
    const streakGrad = ctx.createLinearGradient(x, 0, x, h);
    streakGrad.addColorStop(0, 'rgba(0,0,0,0)');
    streakGrad.addColorStop(0.15, i % 2 === 0 ? p.streakColorPrimary : p.streakColorSecondary);
    streakGrad.addColorStop(0.7, p.baseColor);
    streakGrad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = streakGrad;
    const width = 2 + Math.random() * 5;
    ctx.fillRect(x, 0, width, h);
  }

  // 3. Natural Lenticels (authentic speckled pores on natural apple skin)
  ctx.globalAlpha = 0.65;
  for (let i = 0; i < p.lenticelDensity; i++) {
    const lx = Math.random() * w;
    const ly = Math.random() * h;
    const size = 0.6 + Math.random() * 1.6;

    // Lenticels are denser and larger towards lower half of apple
    const radius = ly > h * 0.4 ? size : size * 0.6;
    ctx.beginPath();
    ctx.arc(lx, ly, radius, 0, Math.PI * 2);
    ctx.fillStyle = p.lenticelColor;
    ctx.fill();
  }

  // 4. Russeting in the upper stem cavity (fine organic rough patch)
  if (p.russetingIntensity > 0) {
    ctx.globalAlpha = p.russetingIntensity * 0.4;
    ctx.fillStyle = '#6b4f2c';
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * (h * 0.12);
      ctx.fillRect(rx, ry, 1 + Math.random() * 3, 1 + Math.random() * 3);
    }
  }

  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// Micro-bump normal map for realistic skin pores and slight vertical grooving
export function createAppleBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Fill neutral bump
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add subtle vertical ridges
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * canvas.width;
    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#000000';
    ctx.fillRect(x, 0, 2 + Math.random() * 4, canvas.height);
  }

  // Add micro-pores
  ctx.globalAlpha = 0.25;
  for (let i = 0; i < 2000; i++) {
    const px = Math.random() * canvas.width;
    const py = Math.random() * canvas.height;
    ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#222222';
    ctx.fillRect(px, py, 1.2, 1.2);
  }

  ctx.globalAlpha = 1.0;
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// Generates the crisp golden-cream apple flesh texture for the 3D Anatomy/Cutaway view
// Calibrated from official Kinnaur Royal Red Showcase image (#f4e0af, #ebd7a3, #32251e)
export function createAppleFleshTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = 256;
  const cy = 256;

  // 1. Crisp mountain golden-cream flesh gradient
  const fleshGrad = ctx.createRadialGradient(cx, cy, 25, cx, cy, 250);
  fleshGrad.addColorStop(0, '#fef9e8');
  fleshGrad.addColorStop(0.5, '#f4e0af');
  fleshGrad.addColorStop(0.85, '#ebd7a3');
  fleshGrad.addColorStop(0.96, '#d8c78c'); // Greenish-cream just under cuticle skin
  fleshGrad.addColorStop(1, '#8a0a0c');   // Signature deep crimson skin rim
  ctx.fillStyle = fleshGrad;
  ctx.fillRect(0, 0, 512, 512);

  // 2. Fine radial flesh fibers & juicy cellular sparkle
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = '#c4b37f';
  ctx.lineWidth = 1;
  for (let a = 0; a < Math.PI * 2; a += 0.03) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    const r = 240 + Math.random() * 12;
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.stroke();
  }

  // 3. Central core star cavity
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = '#dfcca0';
  ctx.beginPath();
  ctx.arc(cx, cy, 38, 0, Math.PI * 2);
  ctx.fill();

  // 4. Two teardrop apple seeds (sampled #32251e)
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = '#32251e';
  [-16, 16].forEach((offsetX) => {
    ctx.beginPath();
    ctx.ellipse(cx + offsetX, cy + 4, 8, 14, (offsetX > 0 ? 0.3 : -0.3), 0, Math.PI * 2);
    ctx.fill();
    // Shiny seed specular dot
    ctx.fillStyle = '#7a5135';
    ctx.beginPath();
    ctx.arc(cx + offsetX + (offsetX > 0 ? -2 : 2), cy, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#32251e';
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Generates the texture for the cut faces of an individual Apple Slice / Wedge
export function createAppleSliceFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Vertical gradient from inner core (left) to outer skin (right)
  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, '#ebd7a3');       // Inner core edge
  grad.addColorStop(0.2, '#f4e0af');     // Juicy center flesh
  grad.addColorStop(0.85, '#ebd7a3');    // Main flesh
  grad.addColorStop(0.95, '#d4c58b');    // Sub-cuticle green-gold
  grad.addColorStop(1, '#8a0a0c');       // Outer crimson skin edge

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle cellular crisp texture
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#bfae7e';
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Small seed notch cavity near inner apex
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = '#32251e';
  ctx.beginPath();
  ctx.ellipse(50, 256, 12, 22, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // Seed highlight
  ctx.fillStyle = '#825838';
  ctx.beginPath();
  ctx.arc(48, 250, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1.0;
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Dark mountain slate / pedestal texture for showcase staging
export function createSlatePedestalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Moody dark stone base (#1a191b to #131214)
  const grad = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
  grad.addColorStop(0, '#222022');
  grad.addColorStop(0.7, '#161516');
  grad.addColorStop(1, '#111011');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Stone grain & micro cleft lines
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = '#ffffff';
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    const y = Math.random() * 512;
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(170, y + (Math.random() - 0.5) * 20, 340, y + (Math.random() - 0.5) * 20, 512, y);
    ctx.stroke();
  }

  // Dark clefts
  ctx.strokeStyle = '#050505';
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    const y = Math.random() * 512;
    ctx.moveTo(0, y);
    ctx.lineTo(512, y + (Math.random() - 0.5) * 15);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Woody bark texture for natural apple stem (sampled #32251e)
export function createWoodStemTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dark brown bark gradient (sampled #32251e cedar tone)
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#32251e');
  grad.addColorStop(0.5, '#261b15');
  grad.addColorStop(1, '#18100c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 256);

  // Bark grain lines
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#0f0a07';
  for (let i = 0; i < 40; i++) {
    ctx.fillRect(Math.random() * 128, 0, 2, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}
