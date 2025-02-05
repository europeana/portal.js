import { readonly, ref } from 'vue';

const terms = ref({});
const definitions = ref({});

const termsToHighlight = (field) => {
  return terms.value[field];
};

const definitionOfTerm = (term) => definitions.value[term];

const findAnnotationTarget = (targets, options = {}) => {
  const { field, lang } = options;

  return targets.find((target) => {
    const fieldMatch = (!field || (target?.selector.hasPredicate === field));
    const langMatch = (!lang || (target?.selector.refinedBy.exact['@language'] === lang));
    return fieldMatch && langMatch;
  });
};

const parseAnnotation = (anno, options = {}) => {
  const { lang } = options;
  const targets = [].concat(anno.target);

  const target = findAnnotationTarget(targets, { field: 'dc:title', lang }) ||
      findAnnotationTarget(targets, { field: 'dc:description', lang }) ||
      findAnnotationTarget(targets, { field: 'dc:subject', lang }) ||
      // TODO: this won't necessarily be the first displayed; make order
      //       configurable by consumer?
      findAnnotationTarget(targets, { lang });

  const term = target?.selector.refinedBy.exact['@value'];
  const field = target?.selector.hasPredicate;
  const definition = anno.body?.definition?.[lang];

  return { definition, field, term };
};

const parseAnnotations = (annotations, options = {}) => {
  terms.value = {};
  definitions.value = {};

  const debiasAnnotations = (annotations || [])
    .filter((anno) => (anno.motivation === 'highlighting') && (anno.body?.id.includes('/debias/')));

  for (const anno of debiasAnnotations) {
    const { field, definition, term } = parseAnnotation(anno, options);

    if (term && field && definition) {
      terms.value[field] ||= [];
      terms.value[field].push(term);
      definitions.value[term] = definition;
    }
  }
};

export default function useDeBias(options = {}) {
  options.annotations && parseAnnotations(options.annotations, { lang: options.lang });

  return {
    definitionOfTerm,
    parseAnnotations,
    termsToHighlight,
    terms: readonly(terms)
  };
}
