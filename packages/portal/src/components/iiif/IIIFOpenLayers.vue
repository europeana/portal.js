<!-- TODO: move entire component to @europeana/iiif pkg? -->

<template>
  <div
    class="iiif-viewer-inner-wrapper h-100 d-flex flex-column overflow-hidden"
  >
    <div
      class="h-100 d-flex flex-row-reverse overflow-auto"
    >
      <div
        id="iiif-open-layers"
        :class="{ 'w-75': showSidebar, 'w-100': !showSidebar }"
      />
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
              <IIIFAnnotationList
                v-if="!!annotationPage"
                :uri="annotationPage.url.toString()"
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
        :total-results="canvasCount"
        class="pagination mx-auto"
      />
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import { BTab, BTabs } from 'bootstrap-vue';
  import IIIFFactory from '@europeana/iiif/src/index.js';

  export default {
    name: 'IIIFOpenLayers',

    components: {
      BTab,
      BTabs,
      IIIFAnnotationList: () => import('./IIIFAnnotationList.vue'),
      PaginationNavInput: () => import('../generic/PaginationNavInput.vue')
    },

    props: {
      uri: {
        type: String,
        required: true
      },

      itemId: {
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
        canvasCount: 0,
        page: 1,
        fullsize: false,
        imageHeight: null,
        imageWidth: null,
        imageUrl: null,
        imageInfo: null,
        layer: null,
        map: null,
        manifest: null,
        showSidebar: null,
        /**
         * @values IIIF,ImageStatic
         */
        source: null,
        thumbnail: null
      };
    },

    async fetch() {
      if (!this.manifest) {
        this.manifest = await IIIFFactory.fetch(this.uri);
      }

      if (this.layer) {
        this.map.removeLayer(this.layer);
        this.layer = null;
      }

      await this.selectCanvas();
    },

    watch: {
      '$route.query.page': '$fetch'
    },

    mounted() {
      if (!this.$fetchState.pending) {
        this.renderImage();
      }
    },

    methods: {
      async selectCanvas() {
        this.canvasCount = this.manifest.canvases.length || 0;

        const page = Number(this.$route.query.page) || 1;
        const canvas = this.manifest.canvases[page - 1];

        const image = canvas?.images?.[0];
        this.imageUrl = image?.id;
        this.imageHeight = image?.height;
        this.imageWidth = image?.width;

        const imageService = image?.service;

        if (imageService?.infoJson) {
          // TODO: why are we doing this here and not in renderIIIFImage?
          const imageInfoResponse = await axios.get(imageService.infoJson);
          this.imageInfo = imageInfoResponse.data;
          this.source = 'IIIF';
          // TODO: can we get a IIIF thumbnail from the image service, without
          //       fetching the info.json first? (Mirador appears to manage to.)
          this.fullsize = true;
        } else {
          this.imageInfo = null;
          this.source = 'ImageStatic';
          this.fullsize = false;
        }

        this.thumbnail = canvas?.thumbnail || null;

        this.annotationPage = [].concat(canvas.annotationPages)[0] || null;

        if (process.client) {
          this.renderImage();
        }
      },

      async drawMap() {
        if (!this.map) {
          const { default: Map } = await import('ol/Map.js');

          this.map = new Map({
            controls: [],
            layers: [],
            target: 'iiif-open-layers'
          });
        }
      },

      async renderThumbnail() {
        this.map.getInteractions().forEach((interaction) => interaction.setActive(false));
        this.map.on('singleclick', this.onSingleClickThumbnail);

        if ((this.source === 'ImageStatic') && this.thumbnail) {
          const thumbWidth = 400;
          const thumbHeight = (this.imageHeight / this.imageWidth) * thumbWidth;
          await this.renderStaticImage(this.thumbnail.url, thumbWidth, thumbHeight);
        }
      },

      onSingleClickThumbnail() {
        this.map.un('singleclick', this.onSingleClickThumbnail);
        this.map.getInteractions().forEach((interaction) => interaction.setActive(true));
        this.fullsize = true;
        this.renderImage();
      },

      async renderIIIFImage() {
        // IIIF Image API
        // https://openlayers.org/en/latest/examples/iiif.html
        const { default: View } = await import('ol/View.js');
        const { default: IIIF } = await import('ol/source/IIIF.js');
        const { default: IIIFInfo } = await import('ol/format/IIIFInfo.js');
        const { default: TileLayer } = await import('ol/layer/Tile.js');

        this.layer = new TileLayer();
        this.map.setLayers([this.layer]);

        const options = new IIIFInfo(this.imageInfo).getTileSourceOptions();
        options.zDirection = -1;
        const iiifTileSource = new IIIF(options);

        this.layer.setSource(iiifTileSource);
        this.map.setView(
          new View({
            resolutions: iiifTileSource.getTileGrid().getResolutions(),
            extent: iiifTileSource.getTileGrid().getExtent(),
            constrainOnlyCenter: true
          })
        );
        this.map.getView().fit(iiifTileSource.getTileGrid().getExtent());
      },

      async renderStaticImage(url, width, height) {
        // Static image
        // https://openlayers.org/en/latest/examples/static-image.html
        const { default: View } = await import('ol/View.js');
        const { default: ImageLayer } = await import('ol/layer/Image.js');
        const { default: Projection } = await import('ol/proj/Projection.js');
        const { default: ImageStatic } = await import('ol/source/ImageStatic.js');
        const { getCenter } = await import('ol/extent.js');

        const extent = [0, 0, width, height];
        const projection = new Projection({
          units: 'pixels',
          extent
        });
        this.layer = new ImageLayer({
          source: new ImageStatic({
            url,
            projection,
            imageExtent: extent
          })
        });
        this.map.setLayers([this.layer]);
        this.map.setView(new View({
          projection,
          center: getCenter(extent),
          zoom: 1,
          maxZoom: 8
        }));
      },

      renderFullsize() {
        if (this.source === 'IIIF') {
          this.renderIIIFImage();
        } else if (this.source === 'ImageStatic') {
          this.renderStaticImage(this.imageUrl, this.imageWidth, this.imageHeight);
        }
      },

      async renderImage() {
        await this.drawMap();
        if (this.fullsize) {
          this.renderFullsize();
        } else {
          this.renderThumbnail();
        }
      },

      onClickAnno(anno) {
        console.log('onClickAnno', anno);
        // const layer = this.map.getLayers()[0];
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
