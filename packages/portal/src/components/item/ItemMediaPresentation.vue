<template>
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
          v-if="content?.format?.startsWith('image/')"
          :url="content.url || content.id"
          :width="content.width"
          :height="content.height"
          :format="content.format"
          :service="content.service"
        />
        <MediaPDFViewer
          v-else-if="content?.format === 'application/pdf'"
          :url="content.url || content.id"
        />
        <MediaAudioVisualPlayer
          v-else-if="content?.playable"
          :url="content.id"
          :format="content.format"
          :item-id="itemId"
        />
        <code
          v-else
          class="h-50 w-100 p-5"
        >
          <pre
            :style="{ color: 'white' }"
          ><!--
          -->{{ JSON.stringify(content, null, 2) }}
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
                :disabled="!annotationPage"
                :active="!!annotationPage"
              >
                <!-- <IIIFAnnotationList
                  v-if="!!annotationPage"
                  :uri="annotationPage.url.toString()"
                  class="iiif-viewer-sidebar-panel"
                  @clickAnno="onClickAnno"
                /> -->
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
          :total-results="canvasCount"
          class="pagination mx-auto"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { BTab, BTabs } from 'bootstrap-vue';
  import EuropeanaPresentationManifest from '@/utils/europeana/iiif.js';

  export default {
    name: 'ItemMediaPresentation',

    components: {
      BTab,
      BTabs,
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
        annotationPage: null,
        manifest: null,
        page: 1,
        showSidebar: null,
        thumbnail: null
      };
    },

    async fetch() {
      if (this.uri) {
        const manifest = new EuropeanaPresentationManifest(this.uri);
        this.manifest = await manifest.fetch();
      } else if (this.webResources) {
        this.manifest = {
          canvases: this.webResources.map((wr) => {
            return {
              content: [
                {
                  id: wr.about,
                  url: this.$apis.record.mediaProxyUrl(wr.about, this.itemId, { disposition: 'inline' }),
                  width: wr.ebucoreWidth,
                  height: wr.ebucoreHeight,
                  format: wr.ebucoreHasMimeType,
                  playable: wr.isPlayableMedia
                }
              ]
            };
          })
        };
      }

      this.setPage();
    },

    computed: {
      canvasCount() {
        return this.manifest?.canvases?.length || 0;
      },

      // first content resource of the current canvas/page
      content() {
        return this.manifest?.canvases[this.page - 1]?.content?.[0];
      }
    },

    watch: {
      '$route.query.page': 'setPage'
    },

    methods: {
      onClickAnno(anno) {
        console.log('onClickAnno', anno);
        // const layer = this.map.getLayers()[0];
      },

      setPage() {
        this.page = Number(this.$route.query.page) || 1;
        this.$nextTick(() => {
          this.$emit('select', this.content.id);
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
