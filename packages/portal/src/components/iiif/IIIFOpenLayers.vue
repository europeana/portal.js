<template>
  <div
    class="h-100"
  >
    <div
      class="iiif-viewer-inner-wrapper h-100 d-flex flex-row-reverse"
    >
      <div
        id="iiif-open-layers"
        class="h-100"
        :class="{ 'w-75': showSidebar, 'w-100': !showSidebar }"
      />
      <div
        v-show="showSidebar"
        class="w-25 h-100 iiif-viewer-sidebar border-bottom"
      >
        <b-tabs>
          <b-tab title="Manifest">
            <a
              :href="uri"
            >
              {{ uri }}
            </a>
          </b-tab>
          <b-tab
            v-if="otherContent"
            title="Annotations"
            lazy
          >
            <IIIFAnnotationList
              :uri="otherContent"
              class="iiif-viewer-sidebar-panel"
              @clickAnno="onClickAnno"
            />
          </b-tab>
        </b-tabs>
      </div>
    </div>
    <div
      class="d-flex flex-row"
    >
      <b-button
        @click="showSidebar = !showSidebar"
      >
        {{ showSidebar ? 'Hide sidebar' : 'Show sidebar' }}
      </b-button>
      <PaginationNavInput
        :per-page="1"
        :total-results="canvasCount"
      />
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import { BTab, BTabs } from 'bootstrap-vue';

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
        canvas: null,
        canvasCount: 0,
        page: 1,
        fullsize: false,
        imageInfo: null,
        manifest: null,
        map: null,
        otherContent: null,
        resource: null,
        showSidebar: false,
        /**
         * @values IIIF,ImageStatic
         */
        source: null,
        thumbnail: null
      };
    },

    async fetch() {
      const manifestResponse = await axios.get(this.uri);
      this.manifest = manifestResponse.data;

      await this.selectCanvas();
    },

    watch: {
      '$route.query.page': 'selectCanvas'
    },

    mounted() {
      if (!this.$fetchState.pending) {
        this.renderImage();
      }
    },

    methods: {
      async selectCanvas() {
        this.page = Number(this.$route.query.page) || 1;
        this.canvas = this.manifest.sequences?.[0]?.canvases?.[this.page - 1];
        this.canvasCount = this.manifest.sequences?.[0]?.canvases?.length || 0;
        // TODO: make computed?
        this.resource = this.canvas?.images?.[0]?.resource;
        this.thumbnail = this.canvas?.thumbnail;

        const serviceId = this.resource?.service?.['@id'];
        if (serviceId) {
          const imageInfoUrl = `${serviceId}/info.json`;
          const imageInfoResponse = await axios.get(imageInfoUrl);
          this.imageInfo = imageInfoResponse.data;
          this.source = 'IIIF';
          // TODO: can we get a IIIF thumbnail from the image service, without
          //       fetching the info.json first? (Mirador appears to manage to.)
          this.fullsize = true;
        } else if (this.resource?.['@id']) {
          this.imageInfo = null;
          this.source = 'ImageStatic';
          this.fullsize = false;
        }

        if (this.canvas.otherContent) {
          // TODO: handle multiple resources
          this.otherContent = [].concat(this.canvas.otherContent)[0];
        }

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
          const thumbHeight = (this.resource.height / this.resource.width) * thumbWidth;
          await this.renderStaticImage(this.thumbnail['@id'], thumbWidth, thumbHeight);
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

        const layer = new TileLayer();
        this.map.setLayers([layer]);

        const options = new IIIFInfo(this.imageInfo).getTileSourceOptions();
        options.zDirection = -1;
        const iiifTileSource = new IIIF(options);

        layer.setSource(iiifTileSource);
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
        const layer = new ImageLayer({
          source: new ImageStatic({
            url,
            projection,
            imageExtent: extent
          })
        });
        this.map.setLayers([layer]);
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
          this.renderStaticImage(this.resource['@id'], this.resource.width, this.resource.height);
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
  }
</style>
