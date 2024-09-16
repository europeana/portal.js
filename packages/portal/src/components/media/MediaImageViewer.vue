<template>
  <div
    id="media-image-viewer"
    class="h-100 w-100"
  />
</template>

<script>
  import axios from 'axios';
  // NOTE: each of the imported OpenLayers modules needs to be added to
  //       build.transpile in nuxt.config.js
  import IIIFSource from 'ol/source/IIIF.js';
  import IIIFInfo from 'ol/format/IIIFInfo.js';
  import TileLayer from 'ol/layer/Tile.js';
  import Map from 'ol/Map.js';
  import Collection from 'ol/Collection.js';
  import ImageLayer from 'ol/layer/Image.js';
  import Projection from 'ol/proj/Projection.js';
  import ImageStatic from 'ol/source/ImageStatic.js';
  import { getCenter } from 'ol/extent.js';
  import View from 'ol/View.js';
  import FullScreenControl from 'ol/control/FullScreen.js';
  import ZoomControl from 'ol/control/Zoom.js';

  export default {
    name: 'MediaImageViewer',

    props: {
      format: {
        type: String,
        default: null
      },
      height: {
        type: Number,
        default: null
      },
      service: {
        type: Object,
        default: null
      },
      url: {
        type: String,
        required: true
      },
      width: {
        type: Number,
        default: null
      }
    },

    data() {
      return {
        // fullsize: true,
        info: null,
        layer: null,
        map: null,
        /**
         * @values IIIF,ImageStatic
         */
        source: 'ImageStatic'
      };
    },

    async fetch() {
      if (this.service?.id) {
        const infoUri = `${this.service.id}/info.json`;
        const infoResponse = await axios.get(infoUri);
        this.info = infoResponse.data;
        this.source = 'IIIF';
        // this.fullsize = true;
      }

      // if (this.layer) {
      //   this.map.removeLayer(this.layer);
      //   this.layer = null;
      // }

      if (process.client) {
        this.renderImage();
      }
    },

    watch: {
      url: '$fetch'
    },

    mounted() {
      if (!this.$fetchState.pending) {
        this.renderImage();
      }
    },

    methods: {
      drawMap() {
        if (!this.map) {
          const controls = new Collection([
            new FullScreenControl({ tipLabel: this.$t('media.controls.fullscreen') }),
            new ZoomControl({
              zoomInTipLabel: this.$t('media.controls.zoomIn'),
              zoomOutTipLabel: this.$t('media.controls.zoomOut')
            })
          ]);

          this.map = new Map({
            controls,
            layers: [],
            target: 'media-image-viewer'
          });
        }
      },

      // renderThumbnail() {
      //   this.map.getInteractions().forEach((interaction) => interaction.setActive(false));
      //   this.map.on('singleclick', this.onSingleClickThumbnail);
      //
      //   if ((this.source === 'ImageStatic') && this.thumbnail) {
      //     const thumbWidth = 400;
      //     const thumbHeight = (this?.height / this?.width) * thumbWidth;
      //     this.renderStaticImage(this.thumbnail.url, thumbWidth, thumbHeight);
      //   }
      // },
      //
      // onSingleClickThumbnail() {
      //   this.map.un('singleclick', this.onSingleClickThumbnail);
      //   this.map.getInteractions().forEach((interaction) => interaction.setActive(true));
      //   this.fullsize = true;
      //   this.renderImage();
      // },

      renderIIIFImage() {
        // IIIF Image API
        // https://openlayers.org/en/latest/examples/iiif.html
        this.layer = new TileLayer();
        this.map.setLayers([this.layer]);

        const options = new IIIFInfo(this.info).getTileSourceOptions();
        options.zDirection = -1;
        const iiifTileSource = new IIIFSource(options);

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

      renderStaticImage() {
        // Static image
        // https://openlayers.org/en/latest/examples/static-image.html

        this.layer = new ImageLayer();
        this.map.setLayers([this.layer]);

        const extent = [0, 0, this.width, this.height];
        const projection = new Projection({
          units: 'pixels',
          extent
        });
        const staticImageSource = new ImageStatic({
          url: this.url,
          projection,
          imageExtent: extent
        });

        this.layer.setSource(staticImageSource);
        this.map.setView(
          new View({
            projection,
            center: getCenter(extent),
            zoom: 1,
            maxZoom: 8
          })
        );
        this.map.getView().fit(extent);
      },

      async renderImage() {
        await (this.$nextTick()); // without this static images won't render, some race condition
        this.drawMap();
        if (this.source === 'IIIF') {
          this.renderIIIFImage();
        } else if (this.source === 'ImageStatic') {
          this.renderStaticImage();
        }
      }
    }
  };
</script>
