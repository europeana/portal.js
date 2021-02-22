export default {
  name: 'hamburger-menu',
  experimentID: ({ $config }) => $config.googleOptimize.experiments.hamburgerMenu,
  isEligible: ({ $config }) => $config.googleOptimize.experiments.hamburgerMenu,
  variants: [
    { component: 'A',
      weight: 50 },
    { component: 'B',
      weight: 50 }
  ]
};
