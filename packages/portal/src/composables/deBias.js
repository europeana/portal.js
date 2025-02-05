import { computed, readonly, ref } from 'vue';
import camelCase from 'lodash/camelCase.js';

const annotations = ref([]);

const terms = computed(() => {
  return annotations.value.reduce((memo, term) => {
    // because Record API v2 uses field names like dcTitle, not dc:title
    const camelCaseField = camelCase(term.field);
    memo[camelCaseField] ||= [];
    memo[camelCaseField].push(term.selector);
    return memo;
  }, {});
});

const definitions = computed(() => {
  return annotations.value.reduce((memo, term) => {
    memo[term.selector.exact] = term.definition;
    return memo;
  }, {});
});

const findAnnotationTarget = (targets, options = {}) => {
  const { field, lang } = options;

  return targets.find((target) => {
    const fieldMatch = (!field || (target?.selector.hasPredicate === field));
    const langMatch = (!lang || (target?.selector.refinedBy.exact['@language'] === lang));
    return fieldMatch && langMatch;
  });
};

const parseAnnotation = (anno, options = {}) => {
  const { fields, lang } = options;
  const targets = [].concat(anno.target);

  let target;
  // pick the first in the order matching the fields option
  for (const field of (fields || [])) {
    target = findAnnotationTarget(targets, { field, lang });
    if (target) {
      break;
    }
  }

  if (!target) {
    // no fields specified, or nothing found; just pick one
    target = findAnnotationTarget(targets, { lang });
  }

  const definition = [].concat(anno.body?.definition?.[lang])[0];
  const field = target?.selector.hasPredicate;
  const refinedBy = target?.selector.refinedBy;
  const selector = { exact: refinedBy?.exact?.['@value'] };
  if (refinedBy?.prefix) {
    selector.prefix = refinedBy.prefix;
  }
  if (refinedBy?.suffix) {
    selector.suffix = refinedBy.suffix;
  }

  return {
    definition,
    field,
    selector
  };
};

const parseAnnotations = (annos, options = {}) => {
  annotations.value = [];

  const debiasAnnotations = (annos || [])
    .filter((anno) => (anno.motivation === 'highlighting') && (anno.body?.id.includes('/debias/')));

  for (const anno of debiasAnnotations) {
    const { definition, field, selector } = parseAnnotation(anno, options);

    if (definition && field && selector) {
      annotations.value.push({ definition, field, selector });
    }
  }
};

export default function useDeBias(options = {}) {
  options.annotations && parseAnnotations(options.annotations, { lang: options.lang });

  return {
    annotations: readonly(annotations),
    definitions,
    parseAnnotations,
    terms
  };
}
