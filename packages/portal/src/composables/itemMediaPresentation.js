import { computed, ref } from 'vue';

import EuropeanaMediaAnnotationList from '@/utils/europeana/media/AnnotationList.js';
import EuropeanaMediaPresentation from '@/utils/europeana/media/Presentation.js';
import EuropeanaMediaResource from '@/utils/europeana/media/Resource.js';

const annotations = ref([]);
const annotationSearchHits = ref([]);
const annotationSearchResults = ref([]);
const activeAnnotation = ref(null);
const page = ref(1);
const presentation = ref(null);

const annotationAtCoordinate  = (coordinate, fullExtent) => {
  const coordinateToCompare = [coordinate[0], fullExtent[3] - coordinate[1]];
  return annotations.value.find((anno) => {
    return (anno.extent[0] <= coordinateToCompare[0]) &&
      (anno.extent[2] >= coordinateToCompare[0]) &&
      (anno.extent[1] <= coordinateToCompare[1]) &&
      (anno.extent[3] >= coordinateToCompare[1]);
  });
};

/**
 * Annotation page/list: either a URI as a string, or an object with id
 * property being the URI
 */
const annotationCollection = computed(() => {
  return canvas.value?.annotations?.[0];
});

const annotationSearchHitSelectorFor = (annoId) => {
  return annotationSearchHits.value.find((hit) => [].concat(hit.annotations).includes(annoId))?.selectors?.[0] || null;
};

const annotationTargetId = computed(() => {
  // account for Europeana fulltext annotations incorrectly targeting IIIF
  // images instead of canvases
  return presentation.value?.isInEuropeanaDomain ? resource.value?.id : canvas.value?.id;
});

const annotationTextGranularity = computed(() => {
  return annotationCollection.value?.textGranularity;
});

// TODO: ambiguous name; rename `annotationCollectionUri`
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

const hasSearchService = computed(() => {
  return !!searchServiceUri.value;
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

const searchServiceUri = computed(() => {
  return [].concat(presentation.value?.search).filter(Boolean)[0]?.id;
});

const fetchPresentation = async(uri) => {
  presentation.value = await EuropeanaMediaPresentation.from(uri);
};

const setPresentationFromWebResources = (webResources) => {
  presentation.value = new EuropeanaMediaPresentation({
    canvases: webResources.map((wr) => ({
      resource: EuropeanaMediaResource.fromEDM(wr)
    }))
  });
};

const fetchAnnotations = async(uri, { params = {} } = {}) => {
  if (!uri) {
    return;
  }

  // TODO: make into a new computed?
  let textGranularity;
  if (Array.isArray(annotationTextGranularity.value)) {
    textGranularity = annotationTextGranularity.value.includes('line') ? 'line' : annotationTextGranularity.value[0];
  } else {
    textGranularity = annotationTextGranularity.value;
  }

  return await EuropeanaMediaAnnotationList.from(uri, { params: { textGranularity, ...params } });
};

const fetchCanvasAnnotations = async() => {
  const list = await fetchAnnotations(annotationUri.value);

  const annos = annotationTargetId.value ? list.annotationsForTarget(annotationTargetId.value) : list.items;

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

const pageForAnnotationTarget = (annoTarget) => {
  const annoTargets = [].concat(annoTarget).filter(Boolean);
  let targetIds;
  if (presentation.value?.isInEuropeanaDomain) {
    targetIds = resources.value.map((resource) => resource.id);
  } else {
    targetIds = canvases.value.map((canvas) => canvas.id);
  }

  const i = targetIds.findIndex((id) => annoTargets.some((at) => (at === id) || at.startsWith(`${id}#`)));

  if (i === -1) {
    return undefined;
  }
  return i + 1;
};

const searchAnnotations = async(query) => {
  const list = await fetchAnnotations(searchServiceUri.value, { params: { query } });
  annotationSearchResults.value = list.items;
  annotationSearchHits.value = list.hits || [];
};

const setActiveAnnotation = (active) => {
  activeAnnotation.value = active;
};

const setPage = (value) => {
  page.value = Number(value) || 1;
};

export default function useItemMediaPresentation() {
  return {
    annotations,
    annotationAtCoordinate,
    annotationCollection,
    annotationSearchHits,
    annotationSearchHitSelectorFor,
    annotationSearchResults,
    annotationTargetId,
    annotationUri,
    annotationTextGranularity,
    activeAnnotation,
    canvas,
    fetchAnnotations,
    fetchCanvasAnnotations,
    fetchPresentation,
    hasAnnotations,
    hasSearchService,
    page,
    pageForAnnotationTarget,
    resource,
    resources,
    resourceCount,
    presentation,
    searchAnnotations,
    searchServiceUri,
    setActiveAnnotation,
    setPage,
    setPresentationFromWebResources
  };
}
