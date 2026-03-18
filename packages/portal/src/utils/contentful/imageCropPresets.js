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

export const FULL_VIEWPORT_PRESETS_FOCUS_FACE = Object.keys(FULL_VIEWPORT_PRESETS).reduce((memo, key) => {
  memo[key] = {
    ...FULL_VIEWPORT_PRESETS[key],
    f: 'face'
  };
  return memo;
}, {});

export const IMAGE_CONTAINER_PRESETS = {
  small: { w: 545 },
  medium: { w: 510 },
  large: { w: 722 },
  xl: { w: 706 },
  xxl: { w: 826 },
  xxxl: { w: 826 },
  wqhd: { w: 826 },
  '4k': { w: 826 },
  '4k+': { w: 826 }
};

export const IMAGE_CONTAINER_SIZES = [
  '(max-width: 575px) 545px', // bp-small
  '(max-width: 767px) 510px', // bp-medium
  '(max-width: 991px) 722px', // bp-large
  '(max-width: 1199px) 706px', // bp-xl
  '826px'
].join(',');
