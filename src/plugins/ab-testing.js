import weightedRandom from 'weighted-random';
import experiments from '../experiments';

export default function(ctx, inject) {
  if (ctx.$cookies.get('klaro')?.abTest && experiments.length > 0) {
    initExperiments(); // Only init experiments when consent is given and experiment exists
  }

  function initExperiments() {
    const activeExperiments = {};
    experiments.forEach((experiment) => {
      if (!experiment.name || !experiment.variants || experiment.variants.length <= 1 || experiment.variants.some(variant => variant.weight === undefined)) {
        console.error('Experiment should be configured with a name, more than one variant and with a weight set for each variant');
        return; // experiment isn't configured with required settings
      }

      let activeVariant = ctx.$cookies.get(`eu-ab-${experiment.name}`);

      if (!activeVariant) {
        activeVariant = setActiveVariant(experiment);

        ctx.$cookies.set(`eu-ab-${experiment.name}`, activeVariant);

      // inform Matomo
      // _paq.push(['AbTesting::enter', {experiment: experiment.name, variation: variant}]);
      }

      // define variant for each experiment on the activeExperiments object which will be injected into the app
      activeExperiments[experiment.name] =  {
        activeVariant
      };
    });
    // inject for further use
    // get variant in the app: "$experiments.[NAME].activeVariant"
    inject('experiments', activeExperiments);
  }
}

function setActiveVariant(experiment) {
  const variants = experiment.variants;
  const weights = variants.map(variant => variant.weight);
  const variantIndex = weightedRandom(weights); // Get random variant according to weights
  return variants[variantIndex].title;
}
