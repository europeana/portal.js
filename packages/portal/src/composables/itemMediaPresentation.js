import { computed, ref } from 'vue';

import EuropeanaMediaAnnotationList from '@/utils/europeana/media/AnnotationList.js';
import EuropeanaMediaPresentation from '@/utils/europeana/media/Presentation.js';

const page = ref(1);
const presentation = ref(null);
const annotations = ref([]);

/**
 * Annotation page/list: either a URI as a string, or an object with id
 * property being the URI
 */
const annotationCollection = computed(() => {
  return canvas.value?.annotations?.[0];
});

const annotationTargetId = computed(() => {
  // account for Europeana fulltext annotations incorrectly targeting IIIF
  // images instead of canvases
  return presentation.value?.isInEuropeanaDomain ? resource.value?.about : canvas.value?.id;
});

const annotationTextGranularity = computed(() => {
  return annotationCollection.value?.textGranularity;
});

const annotationUri = computed(() => {
  if (!annotationCollection.value) {
    return null;
  } else if (typeof annotationCollection.value === 'string') {
    return annotationCollection.value;
  }
  return annotationCollection.value.id;
});

const canvas = computed(() => {
  return canvases.value?.[page.value - 1];
});

const canvases = computed(() => {
  return presentation.value?.canvases;
});

const hasAnnotations = computed(() => {
  return !!annotationUri.value;
});

const resource = computed(() => {
  return canvas.value?.resource;
});

const resources = computed(() => {
  return canvases.value?.map((canvas) => canvas.resource).filter(Boolean);
});

const resourceCount = computed(() => {
  return resources?.value?.length || 0;
});

const fetchPresentation = async(uri) => {
  presentation.value = await EuropeanaMediaPresentation.from(uri);
};

const setPresentationFromWebResources = (webResources) => {
  presentation.value = new EuropeanaMediaPresentation({
    canvases: webResources.map((resource) => ({
      resource
    }))
  });
};

// TODO: default param to using annotationUri?
const fetchAnnotations = async(uri) => {
  if (!uri || !annotationTargetId.value) {
    return;
  }

  // TODO: make into a new computed?
  let textGranularity;
  if (Array.isArray(annotationTextGranularity.value)) {
    textGranularity = annotationTextGranularity.value.includes('line') ? 'line' : annotationTextGranularity.value[0];
  } else {
    textGranularity = annotationTextGranularity.value;
  }

  const list = await EuropeanaMediaAnnotationList.from(uri, { params: { textGranularity } });
  const annos = list.annotationsForTarget(annotationTargetId.value);

  // NOTE: this may result in duplicate network requests for the same body resource
  //       if there are multiple external annotations with the same resource URL,
  //       e.g. with just a different hash char selector.
  //       use an axios caching interceptor to avoid this.
  await Promise.all(annos.map((anno) => anno.embedBodies()));

  for (const anno of annos) {
    if (Array.isArray(anno.body)) {
      anno.body = anno.body[0];
    }
  }

  annotations.value = annos;
};

const setPage = (value) => {
  page.value = Number(value) || 1;
};

export default function useItemMediaPresentation() {
  return {
    annotations,
    // annotationCollection,
    // annotationTargetId,
    annotationUri,
    // annotationTextGranularity,
    // canvas,
    fetchAnnotations,
    fetchPresentation,
    hasAnnotations,
    page,
    resource,
    resources,
    resourceCount,
    presentation,
    setPage,
    setPresentationFromWebResources
  };
}
