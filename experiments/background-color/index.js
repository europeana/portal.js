import './styles.scss';

export default {
  // A helper exp-{name}-{var} class will be added to the root element
  name: 'background-color',

  // Google optimize experiment id
  experimentID: 'mGAPlm3jRXOMcDwHFxO59Q',

  // Implemented variants and their weights
  variants: [
    { weight: 33 }, // <-- This is the default variant
    { weight: 33 },
    { weight: 33 }
  ]
};
