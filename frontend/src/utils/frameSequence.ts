// Frame sequence loader for Kinnaur Royal Red Apple 198-frame scrollytelling
// Asset location: frontend/src/assets/images/ezgif-4bf16c34ec5ee790-jpg/*.jpg

// Use Vite's import.meta.glob to bundle and hash all 198 frames
const frameModules = import.meta.glob<string | { default: string }>(
  '../assets/images/ezgif-4bf16c34ec5ee790-jpg/*.jpg',
  { eager: true, import: 'default' }
);

// Sort keys alphabetically so ezgif-frame-001.jpg through ezgif-frame-198.jpg are in exact order
export const frameUrls: string[] = Object.keys(frameModules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
  .map((key) => {
    const mod = frameModules[key];
    return typeof mod === 'string' ? mod : mod.default;
  });

export const TOTAL_FRAMES = frameUrls.length; // 198 frames
