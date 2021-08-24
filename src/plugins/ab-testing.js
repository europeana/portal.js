import experiment from '../experiments'

export default function(ctx, inject) {

  // check consent
  // ,,,

  // experiment already in cookie?
  let variant;
  
  if (ctx.$cookies.get(`eu-ab-${experiment.name}`)) {
    variant = ctx.$cookies.get(`eu-ab-${experiment.name}`);

  // else, not in cookie
  } else {
    const variants = experiment.variants; // get list of available variants

    // and pick one
    // TODO: should we introduce weighing in order to show every variant equally?
    const variantIndex = Math.floor(Math.random() * variants.length);
    variant = variants[variantIndex];
      
    // set cookie    
    ctx.$cookies.set(`eu-ab-${experiment.name}`, variant);

    // inform Matomo
    //_paq.push(['AbTesting::enter', {experiment: 'theExperimentName', variation: 'variationNameOrIdActivatedForCurrentVisitor'}]);
  }

  // return variant
  const experimentDefaults = {
    'experimentName': experiment.name,
    'experimentClass': `${experiment.name}-${variant}`,
    'variant': variant
  }

  // inject for further use
  // for example classname
  // :class="$experiment.experimentClass"
  // or in if statement
  // v-if="$experiment.variant === 'variant1"
  inject('experiment', experimentDefaults);
}