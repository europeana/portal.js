import { computed, ref } from 'vue';

const terms = ref([]);
const definitions = {};
const highlighted = ref([]);

const highlight = ((term) => {
  if (!highlighted.value.includes(term)) {
    highlighted.value.push(term);
  }
});

const termsToHighlight = computed(() => {
  return terms.value.filter((term) => !highlighted.value.includes(term));
});

const definitionOfTerm = (term) => definitions.value[term];

const init = (annotations) => {
  terms.value = [];
  definitions.value = {};
  highlighted.value = [];

  const debiasAnnotations = annotations
    .filter((anno) => (anno.motivation === 'highlighting') && (anno.body?.id.includes('/debias/')));

  for (const anno of debiasAnnotations) {
    const target = [].concat(anno.target)[0];
    const term = target?.selector.refinedBy.exact['@value'];
    const lang = target?.selector.refinedBy.exact['@language'];
    const definition = anno.body?.definition?.[lang];
    if (term && definition) {
      terms.value.push(term);
      definitions.value[term] = definition;
    }
  }
};

const parseAnnotations = (annotations) => {
  terms.value = [];
  definitions.value = {};
  highlighted.value = [];

  const debiasAnnotations = (annotations || [])
    .filter((anno) => (anno.motivation === 'highlighting') && (anno.body?.id.includes('/debias/')));

  for (const anno of debiasAnnotations) {
    const target = [].concat(anno.target)[0];
    const term = target?.selector.refinedBy.exact['@value'];
    const lang = target?.selector.refinedBy.exact['@language'];
    const definition = anno.body?.definition?.[lang];
    if (term && definition) {
      terms.value.push(term);
      definitions.value[term] = definition;
    }
  }
};

export default function useDeBias(annotations) {
  annotations && parseAnnotations(annotations);

  return {
    definitionOfTerm,
    highlight,
    parseAnnotations,
    termsToHighlight
  };
}
