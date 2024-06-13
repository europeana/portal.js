export const FULL_VIEWPORT_PRESETS = {
  small: { w: 576, h: 896, fit: 'fill' },
  medium: { w: 768, h: 1080, fit: 'fill' },
  large: { w: 992, h: 1080, fit: 'fill' },
  xl: { w: 1200, h: 1080, fit: 'fill' },
  xxl: { w: 1400, h: 1080, fit: 'fill' },
  xxxl: { w: 1880, h: 1080, fit: 'fill' },
  wqhd: { w: 2520, h: 1440, fit: 'fill' },
  '4k': { w: 3020, h: 1440, fit: 'fill' },
  '4k+': { w: 3840, h: 2160, fit: 'fill' }
};

export const FULL_VIEWPORT_PRESETS_FOCUS_FACE = {};

for (const key in FULL_VIEWPORT_PRESETS) {
  FULL_VIEWPORT_PRESETS_FOCUS_FACE[key] = { ...FULL_VIEWPORT_PRESETS[key], f: 'face' };
}
