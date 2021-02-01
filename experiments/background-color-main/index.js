import './styles.scss';

export default {
  // A helper exp-{name}-{var} class will be added to the root element
  name: 'background-color-main',

  // Google optimize experiment id
  experimentID: 'Wel69nAkT-iRFMldNCpohQ',

  // Implemented variants and their weights
  variants: [
    { weight: 0 }, // <-- This is the default variant
    { weight: 100 }
  ]
};
