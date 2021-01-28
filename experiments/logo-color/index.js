import './styles.scss';

export default {
  // A helper exp-{name}-{var} class will be added to the root element
  name: 'logo-color',

  // Google optimize experiment id
  experimentID: '7Ey9SzS1RDyhfKxYRpf1QA',

  // Implemented variants and their weights
  variants: [
    { weight: 0 }, // <-- This is the default variant
    { weight: 100 }
  ]
};
