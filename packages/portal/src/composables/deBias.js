import { readonly, ref } from 'vue';

const terms = ref([]);
const definitions = ref([]);

// converts e.g. dcTitle to dc:title
const namespaceFieldName = (name) => {
  if (!name.includes(':')) {
    const match = name.match(/[A-Z]/);
    if (match?.index) {
      return name.slice(0, match.index) + ':' + match[0].toLocaleLowerCase() + name.slice(match.index + 1);
    }
  }
  return name;
};

const termsToHighlight = (name) => {
  const field = namespaceFieldName(name);
  return terms.value.filter((term) => term.field === field).map((term) => term.selector);
};

const definitionOfTerm = (term) => definitions.value.find((def) => def.term === term)?.definition;

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

  const definition = [].concat(anno.body?.definition?.[lang])[0];
  const field = target?.selector.hasPredicate;
  const selector = target?.selector.refinedBy;

  return { definition, field, selector };
};

const parseAnnotations = (annotations, options = {}) => {
  terms.value = [];
  definitions.value = [];

  const debiasAnnotations = (annotations || [])
    .filter((anno) => (anno.motivation === 'highlighting') && (anno.body?.id.includes('/debias/')));

  for (const anno of debiasAnnotations) {
    const { definition, field, selector } = parseAnnotation(anno, options);

    if (definition && field && selector) {
      terms.value.push({ field, selector });
      definitions.value.push({ definition, term: selector.exact['@value'] });
    }
  }
};

export default function useDeBias(options = {}) {
  options.annotations && parseAnnotations(options.annotations, { lang: options.lang });

  return {
    definitionOfTerm,
    definitions: readonly(definitions),
    parseAnnotations,
    termsToHighlight,
    terms: readonly(terms)
  };
}
