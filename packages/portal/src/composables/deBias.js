import { readonly, ref } from 'vue';

const terms = ref({});
const definitions = ref({});

const termsToHighlight = (field) => {
  return terms.value[field];
};

const definitionOfTerm = (term) => definitions.value[term];

const findTargetForField = (targets, field) => {
  return targets.find((target) => target?.selector.hasPredicate === field);
};

const parseAnnotation = (anno) => {
  const targets = [].concat(anno.target);

  const target = findTargetForField(targets, 'dcTitle') ||
      findTargetForField(targets, 'dcDescription') ||
      findTargetForField(targets, 'dcSubject') ||
      // TODO: this won't necessarily be the first displayed; make order
      //       configurable by consumer?
      targets[0];

  const term = target?.selector.refinedBy.exact['@value'];
  const lang = target?.selector.refinedBy.exact['@language'];
  const field = target?.selector.hasPredicate;
  const definition = anno.body?.definition?.[lang];

  return { definition, field, term };
};

const parseAnnotations = (annotations) => {
  terms.value = {};
  definitions.value = {};

  const debiasAnnotations = (annotations || [])
    .filter((anno) => (anno.motivation === 'highlighting') && (anno.body?.id.includes('/debias/')));

  for (const anno of debiasAnnotations) {
    const { term, field, definition } = parseAnnotation(anno);

    if (term && field && definition) {
      terms.value[field] ||= [];
      terms.value[field].push(term);
      definitions.value[term] = definition;
    }
  }
};

export default function useDeBias(annotations) {
  annotations && parseAnnotations(annotations);

  return {
    definitionOfTerm,
    parseAnnotations,
    termsToHighlight,
    terms: readonly(terms)
  };
}
