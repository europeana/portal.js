import experiments from '../experiments';

export default function(ctx, inject) {
  // is there an experiment?
  if (experiments.length === 0) {
    inject('experiments', () => {
      return false;
    });
    return false;
  }
  // check consent
  const consentCookie = ctx.$cookies.get('klaro');
  if (!consentCookie?.matomo) {
    inject('experiments', () => {
      return false;
    });
    return false;
  }

  const activeExperiments = {};

  experiments.forEach((experiment) => {
    if (!experiment.name || !experiment.variants || experiment.variants.length <= 1) {
      return; // experiment isn't configured with required settings
    }
    // experiment already in cookie?
    let variant;

    if (ctx.$cookies.get(`eu-ab-${experiment.name}`)) {
      variant = ctx.$cookies.get(`eu-ab-${experiment.name}`);
    } else { // else, not in cookie
      const variants = experiment.variants; // get list of available variants

      // and pick one
      // TODO: should we introduce weighting in order to show every variant equally?
      const variantIndex = Math.floor(Math.random() * variants.length);
      variant = variants[variantIndex];

      // set cookie
      ctx.$cookies.set(`eu-ab-${experiment.name}`, variant);

      // inform Matomo
      // _paq.push(['AbTesting::enter', {experiment: experiment.name, variation: variant}]);
    }

    // set variant for export
    activeExperiments[experiment.name] =  {
      variant
    };
  });
  // inject for further use
  // for example classname
  // :class="$experiment.experimentClass"
  // or in if statement
  // v-if="$experiments.[NAME].variant === 'variant1"
  inject('experiments', () => {
    return activeExperiments;
  });
}
