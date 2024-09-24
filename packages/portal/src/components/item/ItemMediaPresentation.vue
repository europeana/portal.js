<template>
  <div>
    <div
      class="iiif-viewer-wrapper d-flex flex-column"
    >
      <div
        class="iiif-viewer-inner-wrapper h-100 d-flex flex-column overflow-hidden"
      >
        <div
          class="h-100 d-flex flex-row-reverse overflow-auto"
        >
          <MediaImageViewer
            v-if="resource?.ebucoreHasMimeType?.startsWith('image/')"
            :url="resource.about"
            :item-id="itemId"
            :width="resource.ebucoreWidth"
            :height="resource.ebucoreHeight"
            :format="resource.ebucoreHasMimeType"
            :service="resource.svcsHasService"
            :annotation="activeAnnotation"
          />
          <MediaPDFViewer
            v-else-if="resource?.ebucoreHasMimeType === 'application/pdf'"
            :url="resource.about"
            :item-id="itemId"
          />
          <MediaAudioVisualPlayer
            v-else-if="resource?.isPlayableMedia"
            :url="resource.about"
            :format="resource.ebucoreHasMimeType"
            :item-id="itemId"
          />
          <code
            v-else
            class="h-50 w-100 p-5"
          >
            <pre
              :style="{ color: 'white' }"
            ><!--
            -->{{ JSON.stringify(resource, null, 2) }}
            </pre>
          </code>
          <transition
            appear
            name="fade"
          >
            <div
              v-if="showSidebar"
              class="w-25 iiif-viewer-sidebar border-bottom"
            >
              <b-tabs>
                <b-tab
                  title="Annotations"
                  :disabled="!annotations"
                  :active="!!annotations"
                >
                  <b-container
                    v-if="fetchingAnnotations"
                    data-qa="loading spinner container"
                  >
                    <b-row class="flex-md-row py-4 text-center">
                      <b-col cols="12">
                        <LoadingSpinner />
                      </b-col>
                    </b-row>
                  </b-container>
                  <MediaAnnotationList
                    v-else-if="annotations"
                    :annotations="annotations"
                    class="iiif-viewer-sidebar-panel"
                    @clickAnno="onClickAnno"
                  />
                </b-tab>
                <b-tab title="Manifest">
                  <a
                    :href="uri"
                  >
                    {{ uri }}
                  </a>
                </b-tab>
              </b-tabs>
            </div>
          </transition>
        </div>
        <div
          class="iiif-viewer-toolbar pt-2 px-2 d-flex align-items-center"
        >
          <b-button
            class="d-inline-flex"
            variant="secondary"
            @click="showSidebar = !showSidebar"
          >
            {{ showSidebar ? 'Hide sidebar' : 'Show sidebar' }}
          </b-button>
          <PaginationNavInput
            :per-page="1"
            :total-results="resourceCount"
            class="pagination mx-auto"
          />
        </div>
      </div>
    </div>
    <ItemMediaThumbnails
      v-if="thumbnails.length > 0"
      :thumbnails="thumbnails"
      @clickThumbnail="handleClickThumbnail"
    />
  </div>
</template>

<script>
  import { BTab, BTabs } from 'bootstrap-vue';
  import EuropeanaMediaPresentation from '@/utils/europeana/media/presentation.js';
  import EuropeanaMediaAnnotations from '@/utils/europeana/media/annotations.js';
  import LoadingSpinner from '../generic/LoadingSpinner.vue';

  export default {
    name: 'ItemMediaPresentation',

    components: {
      BTab,
      BTabs,
      LoadingSpinner,
      MediaAnnotationList: () => import('../media/MediaAnnotationList.vue'),
      ItemMediaThumbnails: () => import('./ItemMediaThumbnails.vue'),
      MediaAudioVisualPlayer: () => import('../media/MediaAudioVisualPlayer.vue'),
      MediaImageViewer: () => import('../media/MediaImageViewer.vue'),
      MediaPDFViewer: () => import('../media/MediaPDFViewer.vue'),
      PaginationNavInput: () => import('../generic/PaginationNavInput.vue')
    },

    props: {
      uri: {
        type: String,
        default: null
      },

      webResources: {
        type: Array,
        default: null
      },

      itemId: {
        type: String,
        default: null
      },

      edmType: {
        type: String,
        default: null
      },

      searchQuery: {
        type: String,
        default: null
      },

      providerUrl: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        activeAnnotation: null,
        annotations: null,
        fetchingAnnotations: false,
        presentation: null,
        page: 1,
        showSidebar: null
      };
    },

    async fetch() {
      if (this.uri) {
        this.presentation = await (new EuropeanaMediaPresentation(this.uri)).fetch();
      } else if (this.webResources) {
        this.presentation = {
          canvases: this.webResources.map((resource) => {
            resource;
          })
        };
      } else {
        // TODO: what to do!?
      }

      this.setPage();
    },

    computed: {
      /**
       * Annotation page/list: either a URI as a string, or an object with id
       * property being the URI
       */
      annotationCollection() {
        return this.canvas?.annotations?.[0];
      },

      annotationUri() {
        if (!this.annotationCollection) {
          return null;
        } else if (typeof this.annotationCollection === 'string') {
          return this.annotationCollection;
        }
        return this.annotationCollection.id;
      },

      annotationTextGranularity() {
        return this.annotationCollection.textGranularity;
      },

      canvas() {
        return this.presentation?.canvases?.[this.page - 1];
      },

      resource() {
        return this.canvas?.resource;
      },

      resources() {
        return this.presentation?.canvases?.map((canvas) => canvas.resource);
      },

      resourceCount() {
        return this.resources?.length || 0;
      },

      thumbnail() {
        return this.thumbnails?.[this.page - 1];
      },

      thumbnails() {
        return this.resources?.map((resource) => resource.thumbnails?.(this.$nuxt.context)?.small) || [];
      }
    },

    watch: {
      '$route.query.page': 'setPage',
      'annotationUri': 'fetchAnnotations'
    },

    methods: {
      // TODO: filter by motivation(s)
      async fetchAnnotations() {
        this.activeAnnotation = null;
        if (!this.annotationUri || !this.resource) {
          return;
        }
        this.fetchingAnnotations = true;

        try {
          const annotations = await (new EuropeanaMediaAnnotations({
            id: this.annotationUri,
            textGranularity: this.annotationTextGranularity
          })).fetch();

          const annotationsFor = annotations.for(this.resource.about);
          await Promise.all(annotationsFor.map((anno) => anno.embedBodies()));

          // TODO: move transofmration to EuropeanaMediaAnno class?
          this.annotations = Object.freeze(annotationsFor.map((anno) => {
            const data = {
              id: anno.id, // adds to size of data; use index instead?
              value: anno.body.value,
              lang: anno.body.language
            };

            if (anno.target.startsWith('#')) {
              const fragment = new URLSearchParams(anno.target.slice(1));
              const xywhSelector = fragment.get('xywh');
              if (xywhSelector) {
                [data.x, data.y, data.w, data.h] = xywhSelector.split(',').map((xywh) => xywh.length === 0 ? null : Number(xywh));
              }
            }

            return data;
          }));
        } finally {
          this.fetchingAnnotations = false;
        }
      },

      handleClickThumbnail(index) {
        const page = index + 1;
        this.$router.push({ ...this.$route, query: { ...this.$route.query, page } });
      },

      onClickAnno(anno) {
        console.log('onClickAnno', anno);
        this.activeAnnotation = anno;
      },

      setPage() {
        this.page = Number(this.$route.query.page) || 1;
        this.$nextTick(() => {
          this.$emit('select', this.resource?.about);
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/iiif';
  @import '@europeana/style/scss/transitions';

  .iiif-viewer-inner-wrapper {
    background-color: $black;

    &.error {
      overflow: auto;
    }

    .iiif-viewer-sidebar {
      background-color: $white;
      overflow: auto;

      .tab-pane {
        overflow-wrap: break-word;
        padding: 1rem;
      }
    }

    .iiif-viewer-toolbar {
      background-color: $white;
    }
  }

  ::v-deep .pagination {
    ul {
      margin-bottom: 0;
    }
  }
</style>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/iiif';
</style>
