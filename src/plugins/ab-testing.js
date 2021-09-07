import weightedRandom from 'weighted-random';
import experiments from '../experiments';

export default function(ctx, inject) {
  if (experiments.length === 0) {
    return; // Do nothing when no experiment
  } else if (ctx.$cookies.get('klaro')?.abTest) {
    initExperiments(); // Init experiment when consent is given
  } else {
    // Inject function to enable experiments when cookie consent is not (yet) given
    inject('abTestingConsent', (consent) => {
      if (consent) {
        initExperiments();
      }
    });
    return;
  }

  function initExperiments() {
    const activeExperiments = {};
    experiments.forEach((experiment) => {
      if (!experiment.name || !experiment.variants || experiment.variants.length <= 1) {
        return; // experiment isn't configured with required settings
      }

      let variant = ctx.$cookies.get(`eu-ab-${experiment.name}`);

      if (!variant) {
        const variants = experiment.variants;
        const weights = variants.map(variant => variant.weight === undefined ? 100 : variant.weight);
        const variantIndex = weightedRandom(weights); // Get random variant according to weights
        variant = variants[variantIndex].title;

        ctx.$cookies.set(`eu-ab-${experiment.name}`, variant);

      // inform Matomo
      // _paq.push(['AbTesting::enter', {experiment: experiment.name, variation: variant}]);
      }

      // define variant for each experiment on the activeExperiments object which will be injected into the app
      activeExperiments[experiment.name] =  {
        variant
      };
    });
    // inject for further use
    // get variant in the app: "$experiments.[NAME].variant"
    inject('experiments', activeExperiments);
  }
}
