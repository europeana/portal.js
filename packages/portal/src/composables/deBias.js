import { computed, readonly, ref } from 'vue';
import camelCase from 'lodash/camelCase.js';

const annotations = ref([]);

const terms = computed(() => {
  return annotations.value.reduce((memo, term) => {
    memo[term.field] ||= [];
    memo[term.field].push(term.selector);
    return memo;
  }, {});
});

const definitions = computed(() => {
  return annotations.value.reduce((memo, term) => {
    memo[term.selector.exact] = term.definition;
    return memo;
  }, {});
});

const ids = computed(() => {
  return annotations.value.reduce((memo, term) => {
    memo[term.selector.exact] = term.id;
    return memo;
  }, {});
});

const findAnnotationTarget = (targets, options = {}) => {
  const { field, lang } = options;

  return targets.find((target) => {
    // because Record API v2 uses field names like dcTitle, not dc:title
    const fieldMatch = (!field || (camelCase(target?.selector.hasPredicate) === field));
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

  const id = anno.body?.id;
  const definition = [].concat(anno.body?.definition?.[lang])[0];
  const field = camelCase(target?.selector.hasPredicate);
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
    id,
    field,
    selector
  };
};

const parseAnnotations = (annos, options = {}) => {
  annotations.value = [];

  const debiasAnnotations = (annos || [])
    .filter((anno) => (anno.motivation === 'highlighting') && (anno.body?.id.includes('/debias/')));

  for (const anno of debiasAnnotations) {
    const { definition, field, id, selector } = parseAnnotation(anno, options);

    if (definition && field && id && selector) {
      annotations.value.push({ definition, field, id, selector });
    }
  }
};

export default function useDeBias(options = {}) {
  options.annotations && parseAnnotations(options.annotations, { lang: options.lang });

  return {
    annotations: readonly(annotations),
    definitions,
    ids,
    parseAnnotations,
    terms
  };
}
