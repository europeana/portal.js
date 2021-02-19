export default {
  name: 'hamburger-menu',
  experimentID: ({ $config }) => $config.app.experiments.hamburgerMenu,
  isEligible: ({ $config }) => $config.app.experiments.hamburgerMenu,
  variants: [
    { component: 'A',
      weight: 50 },
    { component: 'B',
      weight: 50 }
  ]
};
