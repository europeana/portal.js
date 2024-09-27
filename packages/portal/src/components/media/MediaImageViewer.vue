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
  import { fromExtent } from 'ol/geom/Polygon.js';
  import Feature from 'ol/Feature.js';
  import VectorLayer from 'ol/layer/Vector.js';
  import VectorSource from 'ol/source/Vector.js';
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
      annotation: {
        type: Object,
        default: null
      },
      format: {
        type: String,
        default: null
      },
      height: {
        type: Number,
        default: null
      },
      itemId: {
        type: String,
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
        // TODO: reconsider if all these should be on data props
        olAnnotationFeature: null,
        olAnnotationSource: null,
        olAnnotationLayer: null,
        olExtent: null,
        olImageLayer: null,
        olImageSource: null,
        olMap: null,
        olProjection: null,
        olView: null,
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

      if (process.client) {
        this.renderImage();
      }
    },

    watch: {
      annotation: {
        deep: true,
        handler: 'drawAnnotation'
      },
      url: '$fetch'
    },

    mounted() {
      if (!this.$fetchState.pending) {
        this.renderImage();
      }
    },

    methods: {
      drawAnnotation() {
        if (this.olAnnotationFeature) {
          this.olAnnotationSource.removeFeature(this.olAnnotationFeature);
          this.olAnnotationFeature = null;
        }
        if (!this.annotation) {
          return;
        }

        // TODO: move to computed property `annotationXywh`? or onto Annotation class?
        let [x, y, w, h] = this.olExtent;
        const target = this.annotation.targetFor(this.url)[0];
        const targetId = target?.id || target;
        const targetHash = new URL(targetId).hash;
        const xywhSelector = this.annotation.getHashParam(targetHash, 'xywh');
        if (xywhSelector) {
          [x, y, w, h] = xywhSelector
            .split(',')
            .map((xywh) => xywh.length === 0 ? undefined : Number(xywh));
        }

        const extent = [x, y, x + w, y + h];
        const poly = fromExtent(extent);

        // Vector Layer co-ordinates start bottom left, not top left, so transform
        // Y co-ordinates accordingly.
        // TODO: this seems like it should be handled by ol's projections...
        for (let i = 0; i < poly.flatCoordinates.length; i = i + 1) {
          if ((i % 2) === 1) { // even indices only
            poly.flatCoordinates[i] = this.olExtent[3] - poly.flatCoordinates[i];
          }
        }
        this.olAnnotationFeature = new Feature(poly);

        this.olAnnotationSource.addFeature(this.olAnnotationFeature);
        // uncomment to have the view follow the selected annotation
        // this.olMap.getView().fit(poly);
      },

      initOlMap() {
        const controls = new Collection([
          new FullScreenControl({ tipLabel: this.$t('media.controls.fullscreen') }),
          new ZoomControl({
            zoomInTipLabel: this.$t('media.controls.zoomIn'),
            zoomOutTipLabel: this.$t('media.controls.zoomOut')
          })
        ]);

        this.olProjection = new Projection({
          units: 'pixels',
          extent: this.olExtent
        });

        // TODO: only init when needed, i.e. when 1st drawing annotation
        this.olAnnotationSource = new VectorSource();
        this.olAnnotationLayer = new VectorLayer({
          source: this.olAnnotationSource
        });

        this.olView = new View({
          center: getCenter(this.olExtent),
          constrainOnlyCenter: true,
          maxZoom: 8,
          projection: this.olProjection,
          resolutions: this.olImageSource.getTileGrid?.().getResolutions()
        });

        if (!this.olMap) {
          this.olMap = new Map({
            controls,
            target: 'media-image-viewer'
          });
        }

        this.olMap.setLayers([this.olImageLayer, this.olAnnotationLayer]);
        this.olMap.setView(this.olView);
        this.olMap.getView().fit(this.olExtent);
      },

      // renderThumbnail() {
      //   this.olMap.getInteractions().forEach((interaction) => interaction.setActive(false));
      //   this.olMap.on('singleclick', this.onSingleClickThumbnail);
      //
      //   if ((this.source === 'ImageStatic') && this.thumbnail) {
      //     const thumbWidth = 400;
      //     const thumbHeight = (this?.height / this?.width) * thumbWidth;
      //     this.initOlImageLayerStatic(this.thumbnail.url, thumbWidth, thumbHeight);
      //   }
      // },
      //
      // onSingleClickThumbnail() {
      //   this.olMap.un('singleclick', this.onSingleClickThumbnail);
      //   this.olMap.getInteractions().forEach((interaction) => interaction.setActive(true));
      //   this.fullsize = true;
      //   this.renderImage();
      // },

      // IIIF Image API
      // https://openlayers.org/en/latest/examples/iiif.html
      initOlImageLayerIIIF() {
        const iiifTileSourceOptions = new IIIFInfo(this.info).getTileSourceOptions();

        this.olExtent = [0, 0, iiifTileSourceOptions.size[0], iiifTileSourceOptions.size[1]];

        iiifTileSourceOptions.extent = this.olExtent;
        iiifTileSourceOptions.zDirection = -1;

        this.olImageSource = new IIIFSource(iiifTileSourceOptions);
        this.olImageLayer = new TileLayer({
          source: this.olImageSource
        });
      },

      // Static image
      // https://openlayers.org/en/latest/examples/static-image.html
      initOlImageLayerStatic() {
        this.olExtent = [0, 0, this.width, this.height];
        this.olImageSource = new ImageStatic({
          // TODO: should we always be using the media proxy for static images?
          url: this.$apis.record.mediaProxyUrl(this.url, this.itemId, { disposition: 'inline' }),
          imageExtent: this.olExtent
        });
        this.olImageLayer = new ImageLayer({
          source: this.olImageSource
        });
      },

      async renderImage() {
        await (this.$nextTick()); // without this static images won't render, some race condition
        if (this.source === 'IIIF') {
          this.initOlImageLayerIIIF();
        } else if (this.source === 'ImageStatic') {
          this.initOlImageLayerStatic();
        }
        this.initOlMap();
        this.drawAnnotation();
      }
    }
  };
</script>
