import experiments from '../experiments';

export default function(ctx, inject) {
  // is there an experiment?
  if (experiments.length === 0) {
    return false;
  }
  // check consent
  const consentManager = ctx.klaro?.getManager();
  if (!consentManager?.getConsent('matomo')) {
    return false;
  }

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
      // TODO: should we introduce weighing in order to show every variant equally?
      const variantIndex = Math.floor(Math.random() * variants.length);
      variant = variants[variantIndex];

      // set cookie
      ctx.$cookies.set(`eu-ab-${experiment.name}`, variant);

      // inform Matomo
      // _paq.push(['AbTesting::enter', {experiment: 'theExperimentName', variation: 'variationNameOrIdActivatedForCurrentVisitor'}]);
    }

    // return variant
    const experimentDefaults = {
      'experimentName': experiment.name,
      'variant': variant
    };
    experimentDefaults);
  });
  // inject for further use
  // for example classname
  // :class="$experiment.experimentClass"
  // or in if statement
  // v-if="$experiment.variant === 'variant1"
  inject('$experiments',
}
